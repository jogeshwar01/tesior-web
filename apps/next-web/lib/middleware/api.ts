import { parse } from "@/lib/middleware/utils";
import {
  applyRateLimitHeaders,
  checkApiRateLimit,
  rateLimitExceededResponse,
} from "@/lib/middleware/utils/rate-limit";
import { NextRequest, NextResponse } from "next/server";

export default function ApiMiddleware(req: NextRequest) {
  const { fullPath } = parse(req);
  const rateLimitResult = checkApiRateLimit(req);

  if (rateLimitResult.limited) {
    return rateLimitExceededResponse(rateLimitResult);
  }

  // Note: we don't have to account for paths starting with `/api`
  // since they're automatically excluded via our middleware matcher
  return applyRateLimitHeaders(
    NextResponse.rewrite(new URL(`/api${fullPath}`, req.url)),
    rateLimitResult,
  );
}
