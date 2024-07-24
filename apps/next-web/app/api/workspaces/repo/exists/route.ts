import { NextRequest, NextResponse } from "next/server";
import prisma from "@repo/prisma";

// POST /api/workspaces/repo/exists - check if a workspace with the given repoUrl exists
export async function POST(req: NextRequest) {
  let { repoUrl } = await req.json();
  repoUrl = repoUrl.toLowerCase().trim();

  const project = await prisma.project.findUnique({
    where: {
      repoUrl,
    },
    select: {
      repoUrl: true,
    },
  });
  if (project) {
    return NextResponse.json(1);
  } else {
    return NextResponse.json(0);
  }
}
