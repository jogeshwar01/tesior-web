import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

// GET /api/workspaces/[idOrSlug]/users – get users for a specific workspace
export const GET = async (
  req: NextRequest,
  { params = {} }: { params: Record<string, string> | undefined }
) => {
  const { idOrSlug: workspaceId } = params;

  const users = await prisma.projectUsers.findMany({
    where: {
      project_id: workspaceId,
    },
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
      createdAt: true,
    },
  });
  return NextResponse.json(
    users.map((u) => ({
      ...u.user,
      role: u.role,
    }))
  );
};
