import prisma from "@/lib/prisma";
import { lamportsToSol } from "@/lib/utils/solana";
import { NextRequest, NextResponse } from "next/server";

// Get tasks (all or based on userId)
export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;
    const userId = searchParams.get("userId") ?? undefined;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: userId,
      },
      orderBy: [
        {
          createdAt: "desc",
        },
      ],
    });

    // fix bigint type - not serializable on frontend, so convert to number
    const newTasks = tasks.map((task) => {
      return {
        ...task,
        amount: lamportsToSol(task.amount),
      };
    });

    return NextResponse.json(newTasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
