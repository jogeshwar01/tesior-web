import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "@/lib/middleware/utils";
import {
  ADMIN_HOSTNAMES,
  API_HOSTNAMES,
  APP_HOSTNAMES,
} from "@/lib/utils/constants";
import {
  AppMiddleware,
  ApiMiddleware,
  AdminMiddleware,
} from "@/lib/middleware";

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    "/((?!api/|_next/|_static/|_vercel|[\\w-]+\\.\\w+).*)",
  ],
};

export default async function middleware(req: NextRequest, ev: NextFetchEvent) {
  const { domain, path, key, fullKey } = parse(req);

  // for App
  if (APP_HOSTNAMES.has(domain)) {
    return AppMiddleware(req);
  }

  // for API
  if (API_HOSTNAMES.has(domain)) {
    return ApiMiddleware(req);
  }

  // for Admin
  if (ADMIN_HOSTNAMES.has(domain)) {
    return AdminMiddleware(req);
  }

  // for root pages (e.g. dub.sh, chatg.pt, etc.)
  // if (key.length === 0) {
  // return RootMiddleware(req, ev);
  // }
}
