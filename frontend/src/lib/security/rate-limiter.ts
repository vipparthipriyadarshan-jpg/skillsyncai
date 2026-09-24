/**
 * Skill Sync AI - High Performance In-Memory Sliding-Window Rate Limiter
 * Problem Statement ID: 26134
 * 
 * Protects critical API endpoints (AI extraction, data ingestion, simulations)
 * from Denial of Service (DoS) and automated brute-force attacks.
 */

interface RateLimitRecord {
  timestamps: number[];
}

// In-memory store keyed by IP or user identifier
const rateLimitStore = new Map<string, RateLimitRecord>();

// Clean up expired entries every 5 minutes to prevent memory leaks
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    rateLimitStore.forEach((record, key) => {
      record.timestamps = record.timestamps.filter((ts: number) => now - ts < 60000);
      if (record.timestamps.length === 0) {
        rateLimitStore.delete(key);
      }
    });
  }, 5 * 60 * 1000);
}

export interface RateLimitOptions {
  limit?: number;        // Max requests in window
  windowMs?: number;     // Sliding window duration in milliseconds
  identifier?: string;   // Unique client identifier (IP or user ID)
}

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetMs: number;
  total: number;
}

export function checkRateLimit(
  key: string,
  options: RateLimitOptions = {}
): RateLimitResult {
  const limit = options.limit || 30; // 30 requests default
  const windowMs = options.windowMs || 60 * 1000; // 1 minute default
  const now = Date.now();

  const record = rateLimitStore.get(key) || { timestamps: [] };

  // Filter timestamps within the current sliding window
  record.timestamps = record.timestamps.filter((ts) => now - ts < windowMs);

  if (record.timestamps.length >= limit) {
    const oldestTimestamp = record.timestamps[0];
    const resetMs = Math.max(0, windowMs - (now - oldestTimestamp));

    return {
      allowed: false,
      remaining: 0,
      resetMs,
      total: record.timestamps.length,
    };
  }

  // Record new request
  record.timestamps.push(now);
  rateLimitStore.set(key, record);

  return {
    allowed: true,
    remaining: limit - record.timestamps.length,
    resetMs: windowMs,
    total: record.timestamps.length,
  };
}

export function getClientIp(req: Request): string {
  // Check standard proxy headers
  const forwardedFor = req.headers.get("x-forwarded-for");
  if (forwardedFor) {
    return forwardedFor.split(",")[0].trim();
  }

  const realIp = req.headers.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  return "127.0.0.1";
}
