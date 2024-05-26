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
import { createTaskInput } from "@repo/common";
import { TxnStatus, EntityType } from "@repo/common";
import {
  PARENT_WALLET_ADDRESS,
  PRIVATE_KEY,
  RPC_URL,
  TOTAL_DECIMALS,
  USER_JWT_SECRET,
} from "../config";
import { userAuthMiddleware } from "../middlewares/auth";
import prismaClient from "../database/prismaClient";
import { decode } from "bs58";

const connection = new Connection(RPC_URL);

const router = Router();

router.post("/signin", async (req, res) => {
  try {
    const { publicKey, signature } = req.body;

    if (!publicKey || !signature) {
      return res.status(400).json({ message: "Missing or invalid parameters" });
    }

    const message = new TextEncoder().encode("Sign in to tesior as user");
    const publicKeyBytes = new PublicKey(publicKey).toBytes();

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
    const user = await prismaClient.user.upsert({
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
        userId: user.id,
      },
      USER_JWT_SECRET
    );

    res.json({
      token,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while signing user in user: " + error.message,
    });
  }
});

// Create a task
router.post("/task", userAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;
    const body = req.body;

    const parseData = createTaskInput.safeParse(body);

    if (!parseData.success) {
      return res.status(411).json({
        message: "You've sent the wrong inputs",
      });
    }

    const task = await prismaClient.task.create({
      data: {
        title: parseData.data.title,
        amount: parseData.data.amount,
        signature: parseData.data.signature,
        user_id: userId,
        contact: parseData.data.contact,
        proof: parseData.data.proof,
      },
    });

    res.json({
      id: task.id,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while creating task: " + error.message,
    });
  }
});

// Get all user tasks
router.get("/task", userAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const tasks = await prismaClient.task.findMany({
      where: {
        user_id: userId,
      },
    });

    res.json(tasks);
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while fetching tasks: " + error.message,
    });
  }
});

// Get User balance
router.get("/balance", userAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    res.json({
      pending_amount: user?.pending_amount,
      locked_amount: user?.locked_amount,
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while fetching balance: " + error.message,
    });
  }
});

// Payout user balance to user (by application escrow)
router.post("/payout", userAuthMiddleware, async (req, res) => {
  try {
    // @ts-ignore
    const userId = req.userId;

    if (!userId) {
      return res.status(400).json({
        error: "User is required",
      });
    }

    const user = await prismaClient.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) {
      return res.status(404).json({
        error: "User not found",
      });
    }

    await prismaClient.user.update({
      where: {
        id: userId,
      },
      data: {
        locked_amount: {
          increment: user.pending_amount,
        },
        pending_amount: {
          decrement: user.pending_amount,
        },
      },
    });

    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: new PublicKey(PARENT_WALLET_ADDRESS),
        toPubkey: new PublicKey(user.address),
        lamports: user.pending_amount * TOTAL_DECIMALS,
      })
    );

    const keypair = Keypair.fromSecretKey(decode(PRIVATE_KEY));
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
      prismaClient.user.update({
        where: {
          id: userId,
        },
        data: {
          locked_amount: 0,
        },
      }),
      prismaClient.payment.create({
        data: {
          user_id: userId,
          amount: user.pending_amount,
          status: TxnStatus.Success,
          signature: signature,
          entity: EntityType.User,
        },
      }),
    ]);

    res.json({
      message: "Payout successful",
    });
  } catch (error: any) {
    res.status(500).json({
      error: "An error occurred while processing payout: " + error.message,
    });
  }
});

router.post("/", async (req, res) => {
  res.send("User router");
});

export default router;
