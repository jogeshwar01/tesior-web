import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";
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
          where: {
            user_id: session.user.id,
          },
          select: {
            user: {
              select: {
                id: true,
              },
            },
            role: true,
          },
        },
      },
    });

    if (!workspace) {
      return NextResponse.json(new Error("Workspace not found"), {
        status: 404,
      });
    }

    const user = workspace.users.find(
      (user) => user.user.id === session?.user?.id
    );

    if (!user) {
      return NextResponse.json(
        new Error("You are not a member/owner of this workspace"),
        { status: 403 }
      );
    }

    return NextResponse.json(workspace);
  } catch (error: any) {
    return NextResponse.json(error.message, { status: 500 });
  }
}
