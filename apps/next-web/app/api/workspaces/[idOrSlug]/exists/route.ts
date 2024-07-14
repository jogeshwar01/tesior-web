import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";

// GET /api/workspaces/[idOrSlug]/exists - check if a workspace with the given slug exists
export async function GET(
  req: NextRequest,
  { params = {} }: { params: Record<string, string> | undefined }
) {
  const { idOrSlug: slug } = params;

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },
    select: {
      slug: true,
    },
  });
  if (project) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
}
