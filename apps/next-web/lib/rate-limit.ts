/**
 * In-memory rate limiter using a sliding window approach.
 *
 * Works for single-instance Next.js deployments. For multi-instance
 * deployments, swap the Map store for a shared Redis-backed counter.
 */

interface RateLimitEntry {
  count: number;
  resetTime: number;
}

const store = new Map<string, RateLimitEntry>();

// Periodically clean up expired entries to avoid unbounded memory growth.
// Only runs in Node.js runtime (not edge).
if (typeof setInterval !== "undefined") {
  setInterval(
    () => {
      const now = Date.now();
      for (const [key, entry] of store.entries()) {
        if (now > entry.resetTime) {
          store.delete(key);
        }
      }
    },
    5 * 60 * 1000, // every 5 minutes
  );
}

/**
 * Check whether the given identifier is within the allowed rate limit.
 *
 * @param identifier - A string that uniquely identifies the caller
 *   (e.g. IP address or wallet public key).
 * @param limit - Maximum number of requests allowed per window (default 10).
 * @param windowMs - Window duration in milliseconds (default 60 s).
 * @returns `true` if the request is allowed, `false` if it should be rejected.
 */
export function checkRateLimit(
  identifier: string,
  limit = 10,
  windowMs = 60_000,
): boolean {
  const now = Date.now();
  const entry = store.get(identifier);

  if (!entry || now > entry.resetTime) {
    store.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }

  if (entry.count >= limit) {
    return false;
  }

  entry.count++;
  return true;
}

/**
 * Return the remaining time (in seconds) until the rate-limit window resets
 * for the given identifier, or 0 if no active window exists.
 */
export function getRateLimitReset(identifier: string): number {
  const entry = store.get(identifier);
  if (!entry) return 0;
  const remaining = Math.ceil((entry.resetTime - Date.now()) / 1000);
  return remaining > 0 ? remaining : 0;
}
