import { NextRequest, NextResponse } from "next/server";
import {
  getAllCourses,
  auditCurriculum,
  reviewRecommendation,
} from "@/lib/curriculum/xray-service";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");

    // If no courseId requested, return the available courses list
    if (!courseId) {
      const courses = getAllCourses();
      return NextResponse.json({ courses }, { status: 200 });
    }

    // Run transparent deterministic Curriculum X-Ray audit
    const report = auditCurriculum(courseId);
    return NextResponse.json(report, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to run Curriculum X-Ray audit.";
    console.error("[Curriculum X-Ray API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { recommendationId, decision, reviewerName, reviewerNotes } = body;

    if (!recommendationId || !decision) {
      return NextResponse.json(
        { error: "recommendationId and decision ('approved' | 'rejected') are required." },
        { status: 400 }
      );
    }

    if (decision !== "approved" && decision !== "rejected") {
      return NextResponse.json(
        { error: "decision must be either 'approved' or 'rejected'." },
        { status: 400 }
      );
    }

    const result = reviewRecommendation(
      recommendationId,
      decision,
      reviewerName || "Institutional Curriculum Board Reviewer",
      reviewerNotes || "Approved per industrial gap analysis audit."
    );

    return NextResponse.json(result, { status: 200 });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Failed to review curriculum recommendation.";
    console.error("[Curriculum Review API Error]:", message);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
