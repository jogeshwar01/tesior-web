import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { createTaskInput } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";
import { TOTAL_DECIMALS } from "@/lib/utils/constants";
import { lamportsToSol } from "@/lib/utils/solana";
import { getSearchParams } from "@/lib/utils/functions";

// POST /api/task - create tasks in a workspace
export async function POST(req: NextRequest) {
  try {
    const searchParams = getSearchParams(req.url);
    const workspaceId: string | undefined = searchParams.workspaceId || undefined;

    const session = await getSession();
    const body = await req.json();

    const parseData = createTaskInput.safeParse(body);

    if (!parseData.success || !workspaceId) {
      return new Response("Invalid payload", { status: 411 });
    }

    const task = await prisma.task.create({
      data: {
        title: parseData.data.title,
        amount: BigInt(parseData.data.amount * TOTAL_DECIMALS),
        user_id: session.user.id,
        project_id: workspaceId,
        contact: parseData.data.contact,
        proof: parseData.data.proof,
      },
    });

    return NextResponse.json({ id: task.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// GET /api/task -  get all user tasks in a workspace - if admin, get all tasks in the workspace
export async function GET(req: Request) {
  try {
    const session = await getSession();
    // admin can view all tasks in the workspace
    const user_id = session.user.role != "admin" ? session.user.id : undefined;
    
    const searchParams = getSearchParams(req.url);
    const workspaceId: string | undefined = searchParams.workspaceId || undefined;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: user_id,
        project_id: workspaceId,
      },
      include: {
        user: {
          select: {
            name: true,
          },
        },
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
