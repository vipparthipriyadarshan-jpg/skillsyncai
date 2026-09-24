import { NextRequest, NextResponse } from "next/server";
import {
  queryRecommendations,
  getRecommendationById,
  approveRecommendation,
  rejectRecommendation,
  modifyRecommendation,
  resetRecommendationsStore,
} from "@/lib/decision-engine/engine";
import { ActionType, RecommendationPriority, RecommendationStatus } from "@/lib/decision-engine/types";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { verifyApiAuth } from "@/lib/security/auth-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/decision-engine
 * Query recommendations with multi-dimensional filters, search, and KPI summary.
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const district = searchParams.get("district") || undefined;
    const course = searchParams.get("course") || undefined;
    const actionType = (searchParams.get("actionType") as ActionType) || undefined;
    const status = (searchParams.get("status") as RecommendationStatus) || undefined;
    const priority = (searchParams.get("priority") as RecommendationPriority) || undefined;
    const search = searchParams.get("search") || undefined;
    const id = searchParams.get("id");

    if (id) {
      const recommendation = getRecommendationById(id);
      if (!recommendation) {
        return NextResponse.json(
          { error: `Recommendation with ID '${id}' not found.` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, recommendation });
    }

    const { recommendations, summary } = queryRecommendations({
      district,
      course,
      actionType,
      status,
      priority,
      search,
    });

    return NextResponse.json({
      success: true,
      summary,
      recommendations,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PATCH /api/decision-engine
 * Human-in-the-Loop review endpoint.
 * Accepts review actions: 'approve', 'reject', 'modify'
 */
export async function PATCH(req: NextRequest) {
  // 1. Rate Limiting: Max 30 review actions per minute
  const clientIp = getClientIp(req);
  const rateLimit = checkRateLimit(`dec-eng:${clientIp}`, { limit: 30, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many decision engine review actions. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  // 2. Authorization Guard: Admin or Government required to review/approve recommendations
  const auth = await verifyApiAuth(req, ["admin", "government"]);
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.errorResponse?.error || "Unauthorized. Only administrators and government officers can sign off on recommendations." },
      { status: auth.errorResponse?.status || 403 }
    );
  }

  try {
    const body = await req.json();
    const { id, action, actorName, actorRole, rationale, modifications } = body;

    if (!id || !action) {
      return NextResponse.json(
        { error: "Missing required fields: 'id' and 'action' are mandatory." },
        { status: 400 }
      );
    }

    // Role-verified actor identity
    const actor = {
      name: actorName?.trim() || auth.session?.email || "State Review Officer",
      role: actorRole?.trim() || (auth.session?.role === "admin" ? "System Administrator" : "Government Reviewer"),
    };

    let updated;

    switch (action) {
      case "approve":
        updated = approveRecommendation(id, actor, rationale);
        break;

      case "reject":
        if (!rationale || !rationale.trim()) {
          return NextResponse.json(
            { error: "A clear rejection rationale is mandatory when rejecting a recommendation." },
            { status: 400 }
          );
        }
        updated = rejectRecommendation(id, actor, rationale);
        break;

      case "modify":
        if (!rationale || !rationale.trim()) {
          return NextResponse.json(
            { error: "A rationale explaining the modifications is mandatory." },
            { status: 400 }
          );
        }
        updated = modifyRecommendation(id, actor, modifications || {}, rationale);
        break;

      case "reset":
        if (auth.session?.role !== "admin") {
          return NextResponse.json(
            { error: "Access denied. Only system administrators can reset the recommendations store." },
            { status: 403 }
          );
        }
        resetRecommendationsStore();
        return NextResponse.json({ success: true, message: "Store reset to seed baseline." });

      default:
        return NextResponse.json(
          { error: `Invalid action '${action}'. Allowed: 'approve', 'reject', 'modify', 'reset'.` },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      recommendation: updated,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to process review action";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
