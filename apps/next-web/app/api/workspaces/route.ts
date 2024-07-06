import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// Get all user workspaces
export async function GET() {
  try {
    const session = await getSession();

    const projects = await prisma.project.findMany({
      where: {
        users: {
          some: {
            user_id: session.user.id,
          },
        },
      },
      include: {
        users: {
          where: {
            user_id: session.user.id,
          },
          select: {
            role: true,
          },
        },
      },
    });

    return NextResponse.json(projects, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
