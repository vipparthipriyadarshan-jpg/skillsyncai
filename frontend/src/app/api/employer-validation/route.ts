import { NextRequest, NextResponse } from "next/server";
import {
  REGISTERED_EMPLOYERS,
  getRecommendationsForIndustry,
  getResponsesForRecommendation,
  getEmployerAuditTrail,
  submitEmployerValidation,
  calculateValidationStats,
} from "@/lib/employer-validation/service";

import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { sanitizeText } from "@/lib/ingestion/sanitizer";

export const dynamic = "force-dynamic";

/**
 * GET /api/employer-validation
 * Query recommendations tailored to the employer's industry, transparent validation evidence, and audit logs.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const sector = searchParams.get("sector") || undefined;
    const recommendationId = searchParams.get("recommendationId") || undefined;

    if (recommendationId) {
      const stats = calculateValidationStats(recommendationId);
      const responses = getResponsesForRecommendation(recommendationId);
      return NextResponse.json({
        success: true,
        recommendationId,
        validationStats: stats,
        responses,
      });
    }

    const recommendations = getRecommendationsForIndustry(sector);
    const auditTrail = getEmployerAuditTrail();

    return NextResponse.json({
      success: true,
      employers: REGISTERED_EMPLOYERS,
      recommendations,
      auditTrail,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/employer-validation
 * Submit an employer validation review.
 */
export async function POST(req: NextRequest) {
  // 1. Rate Limiting: Max 30 employer validations per minute
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`emp-val:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many validation submissions. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  try {
    const body = await req.json();
    const {
      recommendationId,
      employerId,
      reviewerName,
      reviewerDesignation,
      stance,
      hiringDifficulty,
      validatedProficiency,
      identifiedImportantSkills,
      feedbackComments,
      proposedModifications,
    } = body;

    if (!recommendationId || !employerId || !reviewerName || !stance) {
      return NextResponse.json(
        { error: "Missing required fields: recommendationId, employerId, reviewerName, and stance are mandatory." },
        { status: 400 }
      );
    }

    // Input bounds: reviewerName max 120 chars, feedbackComments max 5000 chars
    if (String(reviewerName).length > 120) {
      return NextResponse.json({ error: "Reviewer name is too long (max 120 characters)." }, { status: 400 });
    }
    if (feedbackComments && String(feedbackComments).length > 5000) {
      return NextResponse.json({ error: "Feedback comments exceed maximum limit (5000 characters)." }, { status: 400 });
    }

    if (stance === "rejected" && (!feedbackComments || !String(feedbackComments).trim())) {
      return NextResponse.json(
        { error: "Feedback comments explaining rejection rationale are required." },
        { status: 400 }
      );
    }

    const sanitizedReviewerName = sanitizeText(String(reviewerName));
    const sanitizedDesignation = sanitizeText(String(reviewerDesignation || "Technical Hiring Lead"));
    const sanitizedFeedback = feedbackComments ? sanitizeText(String(feedbackComments)) : "";

    const result = submitEmployerValidation({
      recommendationId,
      employerId,
      reviewerName: sanitizedReviewerName,
      reviewerDesignation: sanitizedDesignation,
      stance,
      hiringDifficulty: hiringDifficulty || "moderate",
      validatedProficiency: validatedProficiency || "intermediate",
      identifiedImportantSkills: identifiedImportantSkills || [],
      feedbackComments: sanitizedFeedback,
      proposedModifications,
    });

    return NextResponse.json({
      success: true,
      response: result.response,
      audit: result.audit,
      updatedStats: result.updatedStats,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to record validation";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
