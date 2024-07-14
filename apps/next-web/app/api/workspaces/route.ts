import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";
import { getSession } from "@/lib/auth/session";

// GET /api/workspaces - get all projects for the current user
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

// POST /api/workspaces - create a new project for the current user
export async function POST(req: NextRequest) {
  const session = await getSession();
  const userId = session.user.id;

  if (!userId) {
    return new Response("User is required", { status: 400 });
  }

  const body = await req.json();
  const { name, slug } = body;

  if (!name || !slug || !userId) {
    return new Response("Invalid payload", { status: 411 });
  }

  try {
    const project = await prisma.project.create({
      data: {
        name,
        slug,
        users: {
          create: {
            user_id: userId,
            role: "owner",
          },
        },
      },
    });

    return NextResponse.json(project, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
