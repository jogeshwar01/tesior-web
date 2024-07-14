import prisma from "@repo/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const userId = searchParams.get("userId") ?? undefined;

  let isAdmin = false;
  if (userId) {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (user) {
      isAdmin = user.role === "admin";
    }

    return NextResponse.json({ isAdmin }, { status: 200 });
  }

  return NextResponse.json({ error: "User id not provided" }, { status: 400 });
}
