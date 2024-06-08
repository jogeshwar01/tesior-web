import { parse } from "@/lib/middleware/utils";
import { NextRequest, NextResponse } from "next/server";
import { getUserViaToken } from "@/lib/middleware/utils";

export default async function AppMiddleware(req: NextRequest) {
  const { path, fullPath } = parse(req);
  const user = await getUserViaToken(req);
  
  // if there's no user and the path isn't /login or /register, redirect to /login
  if (!user && path !== "/login") {
    return NextResponse.redirect(
      new URL(
        `/login${path === "/" ? "" : `?next=${encodeURIComponent(fullPath)}`}`,
        req.url
      )
    );
  }

  // if there's a user, go to /
  else if (user) {
    if (path === "/login") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // otherwise, rewrite the path to /app
  return NextResponse.rewrite(
    new URL(`/app.tesior.xyz${fullPath === "/" ? "" : fullPath}`, req.url)
  );
}
