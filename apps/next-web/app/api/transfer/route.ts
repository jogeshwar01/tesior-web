import { getSession } from "@/lib/auth/session";
import prisma from "@repo/prisma";
import { lamportsToSol } from "@/lib/utils/solana";
import { NextRequest, NextResponse } from "next/server";
import { TaskStatus } from "@/lib/types";
import { getSearchParams } from "@/lib/utils/functions";

// Transfer funds from admin's account to user's account
export async function POST(req: NextRequest) {
  const session = await getSession();
  const adminId = session?.user?.id;

  if (!adminId) {
    return new Response("Admin is required", { status: 400 });
  }

  const searchParams = getSearchParams(req.url);
  const workspaceId: string | undefined = searchParams.workspaceId || undefined;

  const projectUser = await prisma.projectUsers.findFirst({
    where: {
      project_id: workspaceId,
      user_id: adminId,
    },
  });

  if (!projectUser || projectUser.role !== "owner") {
    return new Response("Unauthorized", { status: 401 });
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

  if (!user_id || (!amount && amount !== BigInt(0))) {
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
        data: { pending_amount: user.pending_amount + BigInt(amount) },
      });

      const updatedAdmin = await prisma.user.update({
        where: { id: adminId },
        data: { pending_amount: admin.pending_amount - BigInt(amount) },
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
          amount: BigInt(amount),
        },
      });
    });

    // If the transaction is successful, return the success response
    return NextResponse.json(
      {
        message: "Funds transferred successfully.",
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

// Get all user transfers - sent or received based on searchParam
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const sentOrReceived = searchParams.get("transfer") ?? undefined;
    const session = await getSession();

    if (!session) {
      return NextResponse.json("Unauthorized", { status: 401 });
    }

    let transfers: any = [];
    if (sentOrReceived === "sent") {
      transfers = await prisma.transfer.findMany({
        where: {
          sender_id: session.user.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    } else if (sentOrReceived === "received") {
      transfers = await prisma.transfer.findMany({
        where: {
          receiver_id: session.user.id,
        },
        orderBy: [
          {
            createdAt: "desc",
          },
        ],
      });
    }

    const newTransfers = transfers.map((transfer: any) => {
      return {
        ...transfer,
        amount: lamportsToSol(transfer.amount),
      };
    });

    return NextResponse.json(newTransfers, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
