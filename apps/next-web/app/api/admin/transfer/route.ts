import prisma from "@/lib/prisma";
import { TaskStatus } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";

// Transfer funds from admin's account to user's account
export async function POST(req: NextRequest) {
  const session = await getSession();
  const adminId = session?.user?.id;

  if (!adminId) {
    return new Response("Admin is required", { status: 400 });
  }

  const body = await req.json();
  const { taskId } = body;

  const task = await prisma.task.findUnique({
    where: {
      id: taskId,
    },
  });

  if (!task) {
    return new Response("Task not found", { status: 411 });
  }

  const { user_id, amount } = task;

  if (!user_id || (!amount && amount !== 0)) {
    return new Response("User ID and Amount are required.", { status: 411 });
  }

  if (user_id === adminId) {
    return new Response("You cannot pay for your own task.", { status: 400 });
  }

  try {
    const user = await prisma.user.findUnique({
      where: {
        id: user_id,
      },
    });

    if (!user) {
      return new Response("User not found", { status: 404 });
    }

    const admin = await prisma.user.findUnique({
      where: {
        id: adminId,
      },
    });

    if (!admin) {
      return new Response("Admin not found.", { status: 404 });
    }

    if (admin.pending_amount < amount) {
      return new Response("Insufficient Funds.", { status: 400 });
    }

    // Start a transaction to update user's balance and admin's pending_amount
    const result = await prisma.$transaction(async (prisma: any) => {
      await prisma.user.update({
        where: { id: user_id },
        data: { pending_amount: user.pending_amount + Number(amount) },
      });

      const updatedAdmin = await prisma.user.update({
        where: { id: adminId },
        data: { pending_amount: admin.pending_amount - Number(amount) },
      });

      await prisma.task.update({
        where: { id: taskId },
        data: { status: TaskStatus.Paid },
      });

      await prisma.transfer.create({
        data: {
          receiver_id: user_id,
          sender_id: adminId,
          task_id: taskId,
          amount: Number(amount),
        },
      });

      return { updatedAdmin };
    });

    // If the transaction is successful, return the success response
    return NextResponse.json(
      {
        message: "Funds transferred successfully.",
        admin: result.updatedAdmin,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: "An error occurred while transferring funds: " + error.message },
      { status: 500 }
    );
  }
}
