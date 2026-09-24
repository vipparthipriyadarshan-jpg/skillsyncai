import { NextRequest, NextResponse } from "next/server";
import { extractJobSkills } from "@/lib/ai/service";
import { redactSecrets } from "@/lib/ai/provider";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  // 1. Rate Limiting: Max 20 extraction requests per minute per IP
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`ai-extract:${clientIp}`, {
    limit: 20,
    windowMs: 60 * 1000,
  });

  if (!rateLimit.allowed) {
    return NextResponse.json(
      {
        error: "Rate limit exceeded. Too many AI extraction requests.",
        retryAfterMs: rateLimit.resetMs,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)),
        },
      }
    );
  }

  try {
    const body = await request.json();
    const { text, jobId, confidenceThreshold } = body;

    if (!text || typeof text !== "string" || !text.trim()) {
      return NextResponse.json(
        { error: "Field 'text' is required and must contain job description text." },
        { status: 400 }
      );
    }

    // Payload length cap to prevent DoS via massive text inputs (50KB cap)
    if (text.length > 50000) {
      return NextResponse.json(
        { error: "Payload too large. Job description must be under 50,000 characters." },
        { status: 413 }
      );
    }

    const result = await extractJobSkills(text, {
      jobId,
      confidenceThreshold: typeof confidenceThreshold === "number" ? confidenceThreshold : 0.70,
    });

    return NextResponse.json({
      success: true,
      data: result,
    });
  } catch (err: unknown) {
    const rawMessage = err instanceof Error ? err.message : "Internal extraction error";
    const safeMessage = redactSecrets(rawMessage);
    console.error("[Security Audit] AI extract route error:", safeMessage);
    return NextResponse.json(
      {
        error: "Failed to extract skills from job description.",
        details: safeMessage,
      },
      { status: 500 }
    );
  }
}
