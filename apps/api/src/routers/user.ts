import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { USER_JWT_SECRET } from "../config";
import { userAuthMiddleware } from "../middlewares/auth";
import { createTaskInput } from "@repo/common";

const router = Router();

const prismaClient = new PrismaClient();

router.post("/signin", async (req, res) => {
  try {
    // Todo : add sign verification logic here

    const publicKey = "0x9999999";
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
      console.log(parseData.error);
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

router.post("/", async (req, res) => {
  res.send("User router");
});

export default router;
