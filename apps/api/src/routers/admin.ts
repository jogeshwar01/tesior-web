import nacl from "tweetnacl";
import { Router } from "express";
import jwt from "jsonwebtoken";
import { PublicKey } from "@solana/web3.js";
import prismaClient from "../database/prismaClient";
import { TaskStatus } from "@repo/common";
import { ADMIN_JWT_SECRET } from "../config";
import { adminAuthMiddleware } from "../middlewares/auth";
import { adminPayoutQueue, adminEscrowQueue } from "../redis/queues";
import { adminPayoutWorker, adminEscrowWorker } from "../redis/workers";
async function adminWorkers() {
  try {
    await adminEscrowWorker.waitUntilReady();
    await adminPayoutWorker.waitUntilReady();
    console.log("Admin workers ready!");
  } catch (error) {
    console.error("Failed to initialize admin workers:", error);
  }
}
adminWorkers();

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

// Get Admin balance
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

  const { amount, signature } = req.body;

  if (!amount || !signature || !adminId) {
    return res.status(400).json({
      error: "Amount and Signature are required.",
    });
  }

  try {
    adminEscrowQueue.add("process-queue", { adminId, amount, signature });

    res.status(200).json({
      message: "Escrow creation initiated. It will be processed shortly",
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
        error: "Admin is required",
      });
    }

    await prismaClient.$transaction(
      async (tx: any) => {
        const admin = await tx.admin.findUnique({
          where: { id: adminId },
        });
        if (!admin) {
          throw new Error("Admin not found");
        }
        if (admin.pending_amount < 30000000) {
          throw new Error(
            "Your need to have atleast 0.03 sol as pending amount to withdraw."
          );
        }
        const amount = admin.pending_amount;

        await tx.admin.update({
          where: {
            id: adminId,
          },
          data: {
            pending_amount: {
              decrement: amount,
            },
            locked_amount: {
              increment: amount,
            },
          },
        });
      },
      {
        isolationLevel: "Serializable", // runs all concurrent request in series and prevents double spending
      }
    );

    adminPayoutQueue.add("process-queue", { adminId });

    return res.status(200).json({
      message: "Pending amount locked. Payout will be processed shortly",
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while processing payout: " + error.message,
    });
  }
});

export default router;
