import { NextRequest, NextResponse } from "next/server";
import {
  TARGET_ROLES,
  PRESET_CANDIDATES,
  evaluateCareerPath,
} from "@/lib/candidate/service";
import { CandidateProfile } from "@/lib/candidate/types";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";

export const dynamic = "force-dynamic";

/**
 * GET /api/candidate-career-path
 * Returns available occupational target roles and sample candidate profiles.
 */
export async function GET() {
  try {
    return NextResponse.json({
      success: true,
      targetRoles: TARGET_ROLES,
      presetCandidates: PRESET_CANDIDATES,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/candidate-career-path
 * Evaluates candidate competencies against target role requirements.
 */
export async function POST(req: NextRequest) {
  // 1. Rate Limiting: Max 30 career path assessments per minute
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`cand-eval:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many evaluation requests. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const { candidate, targetRoleId } = body;

    if (!targetRoleId) {
      return NextResponse.json(
        { error: "Missing required field: 'targetRoleId' is mandatory." },
        { status: 400 }
      );
    }

    const candidateProfile: CandidateProfile = candidate || PRESET_CANDIDATES[0];
    const assessment = evaluateCareerPath(candidateProfile, targetRoleId);

    return NextResponse.json({
      success: true,
      assessment,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Assessment Failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
