import prisma from "@/lib/prisma";
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
    });

    return NextResponse.json(tasks, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
