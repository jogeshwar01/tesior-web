import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getSession } from "@/lib/auth/session";

// GET /api/workspaces/[idOrSlug] - get a workspace by id or slug
export async function GET(
  req: NextRequest,
  { params = {} }: { params: Record<string, string> | undefined }
) {
  try {
    const session = await getSession();
    const { idOrSlug: slug } = params;

    const workspace = await prisma.project.findUnique({
      where: {
        slug,
      },
      include: {
        users: {
          select: {
            role: true,
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(new Error("Workspace not found"), {
        status: 404,
      });
    }

    if (session.user.id !== workspace?.users[0]?.user.id) {
      return NextResponse.json(new Error("Unauthorized"), { status: 401 });
    }

    return NextResponse.json(workspace);
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
