import { parse } from "@/lib/middleware/utils";
import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";
import { APP_DOMAIN } from "@/lib/utils/constants";

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

  // using a fetch call as prisma is not available in middleware
  // as middleware only supports edge runtime and not node runtime
  if (sessionUser?.id) {
    const response = await fetch(
      APP_DOMAIN + `/api/database/admin?userId=${sessionUser.id}`
    );

    const data = await response.json();
    isAdmin = data?.isAdmin;
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
