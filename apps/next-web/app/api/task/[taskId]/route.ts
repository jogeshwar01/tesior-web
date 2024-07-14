import prisma from "@repo/prisma";
import { TaskStatus } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getSearchParams } from "@/lib/utils/functions";

// PUT /api/task/[taskId] - Update task status and record approval/rejection
export async function PUT(
  req: NextRequest,
  { params }: { params: { taskId: string } }
) {
  const taskId = params.taskId;
  const session = await getSession();

  const searchParams = getSearchParams(req.url);
  const workspaceId: string | undefined = searchParams.workspaceId || undefined;

  if (!taskId || !workspaceId) {
    return NextResponse.json(
      {
        error: "Task and Workspace ID is required.",
      },
      {
        status: 400,
      }
    );
  }

  // check if user is owner of workspace by checking in projectUser table for user_id and project_id
  const projectUser = await prisma.projectUsers.findFirst({
    where: {
      project_id: workspaceId,
      user_id: session.user.id,
    },
  });

  if (!projectUser || projectUser.role !== "owner") {
    return NextResponse.json(
      {
        error: "You are not authorized to perform this action.",
      },
      {
        status: 403,
      }
    );
  }

  const { status } = await req.json();

  // Check if the new status is a valid TaskStatus
  if (!Object.values(TaskStatus).includes(status)) {
    return NextResponse.json(
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

      return { newApproval };
    });

    // If the transaction is successful, return the success response
    return NextResponse.json({
      message: "Task status updated and approval recorded successfully.",
      approval: result.newApproval,
    });
  } catch (error: any) {
    if (error.message === "Task not found.") {
      return NextResponse.json(
        {
          error: "Task not found.",
        },
        {
          status: 404,
        }
      );
    } else {
      return NextResponse.json(
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
