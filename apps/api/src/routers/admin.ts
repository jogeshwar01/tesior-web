import { Router } from "express";
import { PrismaClient } from "@prisma/client";
import jwt from "jsonwebtoken";
import { ADMIN_JWT_SECRET } from "../config";
import { adminAuthMiddleware } from "../middlewares/auth";
import { TaskStatus } from "@repo/common";

const router = Router();

const prismaClient = new PrismaClient();

router.post("/signin", async (req, res) => {
  // Todo : add sign verification logic here

  const publicKey = "0x1234567890";

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
      error: "Invalid status. Valid statuses are: Pending, Approved, Rejected.",
    });
  }

  try {
    // Start a transaction to update task and create approval entry
    const result = await prismaClient.$transaction(async (prisma) => {
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

export default router;
