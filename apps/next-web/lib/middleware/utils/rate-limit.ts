import { NextRequest, NextResponse } from "next/server";

type RateLimitBucket = {
  count: number;
  resetAt: number;
};

type RateLimitResult = {
  limited: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
  retryAfter: number;
};

const DEFAULT_RATE_LIMIT_WINDOW_MS = 60 * 1000;
const DEFAULT_RATE_LIMIT_MAX = 60;

const rateLimitBuckets = new Map<string, RateLimitBucket>();
let lastCleanupAt = 0;

function getPositiveInteger(value: string | undefined, fallback: number) {
  if (!value) return fallback;

  const parsedValue = Number.parseInt(value, 10);
  return Number.isFinite(parsedValue) && parsedValue > 0
    ? parsedValue
    : fallback;
}

function getClientIdentifier(req: NextRequest) {
  const forwardedFor = req.headers
    .get("x-forwarded-for")
    ?.split(",")[0]
    ?.trim();
  if (forwardedFor) return forwardedFor;

  const realIp = req.headers.get("x-real-ip")?.trim();
  if (realIp) return realIp;

  return "anonymous";
}

function cleanupExpiredBuckets(now: number, windowMs: number) {
  if (now - lastCleanupAt < windowMs) return;

  for (const [key, bucket] of rateLimitBuckets.entries()) {
    if (bucket.resetAt <= now) rateLimitBuckets.delete(key);
  }

  lastCleanupAt = now;
}

function setRateLimitHeaders(
  response: NextResponse,
  rateLimitResult: RateLimitResult,
) {
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set(
    "X-RateLimit-Remaining",
    rateLimitResult.remaining.toString(),
  );
  response.headers.set(
    "X-RateLimit-Reset",
    Math.ceil(rateLimitResult.resetAt / 1000).toString(),
  );
}

export function checkApiRateLimit(req: NextRequest): RateLimitResult {
  const windowMs = getPositiveInteger(
    process.env.API_RATE_LIMIT_WINDOW_MS,
    DEFAULT_RATE_LIMIT_WINDOW_MS,
  );
  const maxRequests = getPositiveInteger(
    process.env.API_RATE_LIMIT_MAX,
    DEFAULT_RATE_LIMIT_MAX,
  );
  const now = Date.now();
  const bucketKey = `api:${getClientIdentifier(req)}`;

  cleanupExpiredBuckets(now, windowMs);

  const currentBucket = rateLimitBuckets.get(bucketKey);
  const bucket =
    currentBucket && currentBucket.resetAt > now
      ? currentBucket
      : { count: 0, resetAt: now + windowMs };

  bucket.count += 1;
  rateLimitBuckets.set(bucketKey, bucket);

  const retryAfter = Math.max(1, Math.ceil((bucket.resetAt - now) / 1000));

  return {
    limited: bucket.count > maxRequests,
    limit: maxRequests,
    remaining: Math.max(maxRequests - bucket.count, 0),
    resetAt: bucket.resetAt,
    retryAfter,
  };
}

export function applyRateLimitHeaders(
  response: NextResponse,
  rateLimitResult: RateLimitResult,
) {
  setRateLimitHeaders(response, rateLimitResult);

  if (rateLimitResult.limited) {
    response.headers.set("Retry-After", rateLimitResult.retryAfter.toString());
  }

  return response;
}

export function rateLimitExceededResponse(rateLimitResult: RateLimitResult) {
  return applyRateLimitHeaders(
    NextResponse.json({ error: "Too many requests" }, { status: 429 }),
    rateLimitResult,
  );
}
