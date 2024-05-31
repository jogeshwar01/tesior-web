import prisma from "@/lib/prisma";
import { TaskStatus } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

// Update task status and record approval/rejection
export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;
  const session = await getSession();

  if (!taskId) {
    NextResponse.json(
      {
        error: "Task ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  const { status } = await req.json();

  // Check if the new status is a valid TaskStatus
  if (!Object.values(TaskStatus).includes(status)) {
    NextResponse.json(
      {
        error:
          "Invalid status. Valid statuses are: Pending, Approved, Rejected, Paid.",
      },
      {
        status: 404,
      }
    );
  }

  try {
    // Start a transaction to update task and create approval entry
    const result = await prisma.$transaction(async (prisma: any) => {
      const updatedTask = await prisma.task.update({
        where: { id: taskId },
        data: { status },
      });

      if (!updatedTask) {
        throw new Error("Task not found.");
      }

      const newApproval = await prisma.approval.create({
        data: {
          user_id: session.user.id,
          task_id: taskId,
          status: status,
        },
      });

      return { updatedTask, newApproval };
    });

    // If the transaction is successful, return the success response
    NextResponse.json({
      message: "Task status updated and approval recorded successfully.",
      task: result.updatedTask,
      approval: result.newApproval,
    });
  } catch (error: any) {
    if (error.message === "Task not found.") {
      NextResponse.json(
        {
          error: "Task not found.",
        },
        {
          status: 404,
        }
      );
    } else {
      NextResponse.json(
        {
          error:
            "An error occurred while updating the task status: " +
            error.message,
        },
        {
          status: 500,
        }
      );
    }
  }
}
