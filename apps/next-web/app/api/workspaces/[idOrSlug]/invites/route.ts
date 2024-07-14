import z from "zod";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";
import { getSession } from "@/lib/auth/session";

const usernameInviteSchema = z.object({
  username: z.string(),
});

// POST /api/workspaces/[idOrSlug]/invites – invite a teammate
export const POST = async (
  req: NextRequest,
  { params = {} }: { params: Record<string, string> | undefined }
) => {
  const { username } = usernameInviteSchema.parse(await req.json());
  const { idOrSlug: workspaceId } = params;
  const session = await getSession();

  if (!workspaceId) {
    return NextResponse.json(
      { message: "Workspace not found" },
      { status: 404 }
    );
  }

  // check if current user is owner of workspace
  const ownerUser = await prisma.projectUsers.findFirst({
    where: {
      project_id: workspaceId,
      user_id: session.user.id,
      role: "owner",
    },
  });

  if (!ownerUser) {
    return NextResponse.json(
      { message: "You are not the owner of this workspace" },
      { status: 403 }
    );
  }

  const alreadyInWorkspace = await prisma.projectUsers.findFirst({
    where: {
      project_id: workspaceId,
      user: {
        name: username,
      },
    },
  });

  if (alreadyInWorkspace) {
    return NextResponse.json(
      { message: "User is already in this workspace" },
      { status: 400 }
    );
  }

  // check if user with email exists
  const user = await prisma.user.findFirst({
    where: {
      name: username,
    },
  });

  if (!user) {
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  // add user to projectUsers as member
  await prisma.projectUsers.create({
    data: {
      project_id: workspaceId,
      user_id: user.id,
      role: "member",
    },
  });

  return NextResponse.json({ message: "User Added to workspace!" });
};
