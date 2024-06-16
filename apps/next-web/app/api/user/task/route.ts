import { getSession } from "@/lib/auth/session";
import prisma from "@/lib/prisma";
import { createTaskInput } from "@/lib/types";
import { NextRequest, NextResponse } from "next/server";

// Create Task
export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    const body = await req.json();

    const parseData = createTaskInput.safeParse(body);

    if (!parseData.success) {
      return new Response("Invalid payload", { status: 411 });
    }

    const task = await prisma.task.create({
      data: {
        title: parseData.data.title,
        amount: parseData.data.amount,
        user_id: session.user.id,
        contact: parseData.data.contact,
        proof: parseData.data.proof,
      },
    });

    return NextResponse.json({ id: task.id }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}

// Get all user tasks
export async function GET() {
  try {
    const session = await getSession();
    // admin can view all tasks
    const user_id = session.user.role != 'admin' ? session.user.id: undefined;

    const tasks = await prisma.task.findMany({
      where: {
        user_id: user_id,  
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

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
