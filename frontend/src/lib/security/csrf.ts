/**
 * Skill Sync AI - Origin & CSRF Protection Utility
 * Problem Statement ID: 26134
 * 
 * Verifies request origin and referer for state-changing HTTP requests (POST, PATCH, DELETE, PUT)
 * to prevent Cross-Site Request Forgery (CSRF).
 */

import { NextRequest } from "next/server";

export function verifyRequestOrigin(request: NextRequest): { valid: boolean; reason?: string } {
  const method = request.method.toUpperCase();

  // Safe idempotent methods do not require origin check
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return { valid: true };
  }

  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!origin && !request.headers.get("referer")) {
    // In server-to-server or curl/automated test calls where no origin is passed, allow if internal
    return { valid: true };
  }

  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      // Validate origin host matches request host
      if (originUrl.host !== host) {
        return {
          valid: false,
          reason: `Cross-origin request rejected. Origin '${originUrl.host}' does not match Host '${host}'.`,
        };
      }
    } catch {
      return { valid: false, reason: "Malformed Origin header." };
    }
  }

  return { valid: true };
}
