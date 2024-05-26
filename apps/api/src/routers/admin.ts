import nacl from "tweetnacl";
import { Router } from "express";
import jwt from "jsonwebtoken";
import {
  Connection,
  Keypair,
  PublicKey,
  SystemProgram,
  Transaction,
  sendAndConfirmTransaction,
} from "@solana/web3.js";
import { decode } from "bs58";
import prismaClient from "../database/prismaClient";
import { TaskStatus, TxnStatus, EntityType } from "@repo/common";
import {
  ADMIN_JWT_SECRET,
  PARENT_WALLET_ADDRESS,
  PRIVATE_KEY,
  RPC_URL,
  TOTAL_DECIMALS,
} from "../config";
import { adminAuthMiddleware } from "../middlewares/auth";

const connection = new Connection(RPC_URL);

const router = Router();

router.post("/signin", async (req, res) => {
  const { publicKey, signature } = req.body;

  if (!publicKey || !signature) {
    return res.status(400).json({ message: "Missing or invalid parameters" });
  }

  const message = new TextEncoder().encode("Sign in to tesior as admin");
  const publicKeyBytes = new PublicKey(publicKey).toBytes();

  // frontend had sent signature as a uint8array, but as json doesnt natively support typed arrays like uint8array,
  // it was converted to an object. So, we need to convert it back to a uint8array. (can also send a base64 encoded string from frontend and decode here)
  // Phantom gives signature in { data : ... }  while backpack directly gives the uint8array
  const signatureUint8Array = new Uint8Array(
    signature.data ?? Object.keys(signature).map((key) => signature[key])
  );

  const result = nacl.sign.detached.verify(
    message,
    signatureUint8Array,
    publicKeyBytes
  );

  if (!result) {
    return res.status(411).json({
      message: "Incorrect signature",
    });
  }

  try {
    const admin = await prismaClient.admin.upsert({
      where: {
        address: publicKey,
      },
      update: {},
      create: {
        address: publicKey,
        pending_amount: 0,
        locked_amount: 0,
      },
    });

    const token = jwt.sign(
      {
        adminId: admin.id,
      },
      ADMIN_JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while signing in admin: " + error.message,
    });
  }
});

// Get User balance
router.get("/balance", adminAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const adminId = req.adminId;

    const admin = await prismaClient.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    res.json({
      pending_amount: admin?.pending_amount,
      locked_amount: admin?.locked_amount,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while fetching balance: " + error.message,
    });
  }
});

// Get tasks (all or based on userId)
router.get("/task", adminAuthMiddleware, async (req, res) => {
  try {
    const userId = req.params.userId;

    const tasks = await prismaClient.task.findMany({
      where: {
        user_id: userId, // if userId is undefined, it will return all tasks
      },
    });

    res.json({
      tasks,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while fetching tasks: " + error.message,
    });
  }
});

// Update task status and record approval/rejection
router.put("/task/:id", adminAuthMiddleware, async (req, res) => {
  const taskId = req.params.id;

  if (!taskId) {
    return res.status(400).json({
      error: "Task ID is required.",
    });
  }

  const { status } = req.body;

  //@ts-ignore
  const adminId = req.adminId;

  // Check if the new status is a valid TaskStatus
  if (!Object.values(TaskStatus).includes(status)) {
    return res.status(400).json({
      error:
        "Invalid status. Valid statuses are: Pending, Approved, Rejected, Paid.",
    });
  }

  try {
    // Start a transaction to update task and create approval entry
    const result = await prismaClient.$transaction(async (prisma: any) => {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });

      if (!updatedTask) {
        throw new Error("Task not found.");
      }

      const newApproval = await prisma.approval.create({
        data: {
          admin_id: adminId,
          task_id: taskId,
          status: status,
        },
      });

      return { updatedTask, newApproval };
    });

    // If the transaction is successful, return the success response
    res.status(200).json({
      message: "Task status updated and approval recorded successfully.",
      task: result.updatedTask,
      approval: result.newApproval,
    });
  } catch (error: any) {
    if (error.message === "Task not found.") {
      res.status(404).json({
        error: "Task not found.",
      });
    } else {
      res.status(500).json({
        error:
          "An error occurred while updating the task status: " + error.message,
      });
    }
  }
});

// Create Escrow payment by admin
router.post("/escrow", adminAuthMiddleware, async (req, res) => {
  //@ts-ignore
  const adminId = req.adminId;

  if (!adminId) {
    return res.status(400).json({
      error: "Admin is required.",
    });
  }

  const admin = await prismaClient.admin.findUnique({
    where: {
      id: adminId,
    },
  });

  const { amount, signature } = req.body;

  if (!amount || !signature || !adminId) {
    return res.status(400).json({
      error: "Amount and Signature are required.",
    });
  }

  try {
    const escrow = await prismaClient.escrow.create({
      data: {
        admin_id: adminId,
        amount: Number(amount),
        signature,
        status: TxnStatus.Processing,
      },
    });

    // need to wait here to ensure the transaction is confirmed
    await new Promise((resolve) => setTimeout(resolve, 30000));
    const transaction = await connection.getTransaction(signature, {
      maxSupportedTransactionVersion: 1,
    });

    if (
      (transaction?.meta?.postBalances[1] ?? 0) -
        (transaction?.meta?.preBalances[1] ?? 0) !==
      amount * 1000000000
    ) {
      return res.status(411).json({
        message: "Transaction signature/amount incorrect",
      });
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(1)?.toString() !==
      PARENT_WALLET_ADDRESS
    ) {
      return res.status(411).json({
        message: "Transaction sent to wrong address",
      });
    }

    if (
      transaction?.transaction.message.getAccountKeys().get(0)?.toString() !==
      admin?.address
    ) {
      return res.status(411).json({
        message: "Transaction sent to wrong address",
      });
    }

    // check time also - a user can send the same signature again and again
    // parse the signature here to ensure the person has paid 0.1 SOL - is it just a system transfer or something else
    // const transaction = Transaction.from(parseData.data.signature);

    await prismaClient.$transaction([
      prismaClient.escrow.update({
        where: {
          id: escrow.id,
        },
        data: {
          status: TxnStatus.Success,
        },
      }),
      prismaClient.admin.update({
        where: {
          id: adminId,
        },
        data: {
          pending_amount: admin.pending_amount + Number(amount),
        },
      }),
    ]);

    res.json({
      pending_amount: admin.pending_amount + Number(amount),
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while creating escrow: " + error.message,
    });
  }
});

// Transfer funds from admin's account to user's account
router.post("/transfer", adminAuthMiddleware, async (req, res) => {
  //@ts-ignore
  const adminId = req.adminId;

  if (!adminId) {
    return res.status(400).json({
      error: "Admin is required.",
    });
  }

  const { taskId } = req.body;

  const task = await prismaClient.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    return res.status(404).json({
      error: "Task not found.",
    });
  }

  const { user_id, amount } = task;

  if (!user_id || !amount) {
    return res.status(400).json({
      error: "User ID and Amount are required.",
    });
  }

  try {
    const user = await prismaClient.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found.",
      });
    }

    const admin = await prismaClient.admin.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return res.status(404).json({
        error: "Admin not found.",
      });
    }

    if (admin.pending_amount < amount) {
      return res.status(400).json({
        error: "Insufficient funds.",
      });
    }

    // Start a transaction to update user's balance and admin's pending_amount
    const result = await prismaClient.$transaction(async (prisma: any) => {
      const updatedUser = await prisma.user.update({
        where: { id: user_id },
        data: { pending_amount: user.pending_amount + Number(amount) },
      });

      const updatedAdmin = await prisma.admin.update({
        where: { id: adminId },
        data: { pending_amount: admin.pending_amount - Number(amount) },
      });

      await prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.Paid },
      });

      await prisma.transfer.create({
        data: {
          user_id: user_id,
          admin_id: adminId,
          task_id: taskId,
          amount: Number(amount),
        },
      });

      return { updatedAdmin };
    });

    // If the transaction is successful, return the success response
    res.status(200).json({
      message: "Funds transferred successfully.",
      admin: result.updatedAdmin,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while transferring funds: " + error.message,
    });
  }
});

// Payout admin balance to admin (by application escrow)
router.post("/payout", adminAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const adminId = req.adminId;

    if (!adminId) {
      return res.status(400).json({
        error: "Admin is required.",
      });
    }

    const admin = await prismaClient.admin.findUnique({
      where: {
        id: adminId,
      },
    });
    if (!admin) {
      return res.status(404).json({
        error: "Admin not found",
      });
    }

    await prismaClient.user.update({
      where: {
        id: adminId,
      },
      data: {
        locked_amount: {
          increment: admin.pending_amount,
        },
        pending_amount: {
          decrement: admin.pending_amount,
        },
      },
    });

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
        toPubkey: new PublicKey(admin.address),
        lamports: admin.pending_amount * TOTAL_DECIMALS,
      })
    );

    const keypair = Keypair.fromSecretKey(decode(PRIVATE_KEY));
    // TODO: There's a double spending problem here - if server goes down just after sendAndConfirmTxn
    // The user can request the withdrawal multiple times. Put in a queue and process it later.
    let signature = "";
    try {
      signature = await sendAndConfirmTransaction(connection, transaction, [
        keypair,
      ]);
    } catch (e) {
      return res.json({
        message: "Transaction failed",
      });
    }

    await prismaClient.$transaction([
      prismaClient.admin.update({
        where: {
          id: adminId,
        },
        data: {
          locked_amount: 0,
        },
      }),
      prismaClient.payment.create({
        data: {
          admin_id: adminId,
          amount: admin.pending_amount,
          status: TxnStatus.Processing,
          signature: signature,
          entity: EntityType.Admin,
        },
      }),
    ]);
    // keep checking the transaction via polling, if successful update payment status to Success and update admin's locked_amount to 0
    // else update payment status to Failure and update admin's pending_amount to locked_amount

    res.json({
      message: "Payout successful",
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while processing payout: " + error.message,
    });
  }
});

export default router;
