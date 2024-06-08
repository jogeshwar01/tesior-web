import { parse } from "@/lib/middleware/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export default async function AdminMiddleware(req: NextRequest) {
  const { path } = parse(req);
  let isAdmin = false;

  const sessionUser = (await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET,
  })) as {
    id?: string;
    email?: string;
    name?: string;
    role?: string;
  };

  if (sessionUser?.id) {
    const user = await prisma.user.findUnique({
      where: {
        id: sessionUser.id,
      },
    });

    if (user) {
      isAdmin = user.role === "admin";
    }
  }

  if (path === "/login" && isAdmin) {
    return NextResponse.redirect(new URL("/", req.url));
  } else if (path !== "/login" && !isAdmin) {
    return NextResponse.redirect(new URL(`/login`, req.url));
  }

  return NextResponse.rewrite(
    new URL(`/admin.tesior.xyz${path === "/" ? "" : path}`, req.url)
  );
}
