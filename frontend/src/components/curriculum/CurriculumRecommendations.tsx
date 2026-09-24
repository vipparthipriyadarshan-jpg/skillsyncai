"use client";

import React, { useState } from "react";
import { CurriculumRecommendation } from "@/lib/curriculum/xray-service";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Wrench,
  UserCheck,
  ShieldAlert,
  Sparkles,
  Loader2,
  FileCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CurriculumRecommendationsProps {
  recommendations: CurriculumRecommendation[];
  onRecommendationUpdated: (updated: CurriculumRecommendation) => void;
}

export function CurriculumRecommendations({
  recommendations,
  onRecommendationUpdated,
}: CurriculumRecommendationsProps) {
  const [submittingId, setSubmittingId] = useState<string | null>(null);
  const [reviewNotes, setReviewNotes] = useState<Record<string, string>>({});

  const handleReviewAction = async (
    recommendationId: string,
    decision: "approved" | "rejected"
  ) => {
    setSubmittingId(recommendationId);
    try {
      const notes = reviewNotes[recommendationId] || (decision === "approved" ? "Approved per institutional board review." : "Rejected pending further revision.");
      const res = await fetch("/api/curriculum/xray", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId,
          decision,
          reviewerName: "State Directorate of Vocational Education Board",
          reviewerNotes: notes,
        }),
      });

      if (!res.ok) {
        throw new Error(`Failed to submit review decision (HTTP ${res.status})`);
      }

      const data = await res.json();
      if (data.success && data.recommendation) {
        onRecommendationUpdated(data.recommendation);
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Failed to record human review decision.");
    } finally {
      setSubmittingId(null);
    }
  };

  if (!recommendations || recommendations.length === 0) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-6 text-center shadow-2xs">
        <FileCheck className="h-8 w-8 text-emerald-500 mx-auto mb-2" />
        <h4 className="text-sm font-bold text-slate-800">No Actionable Recommendations Required</h4>
        <p className="text-xs text-slate-500 mt-1">
          This vocational syllabus exhibits tight alignment with current industry competencies.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Safeguard Alert Banner */}
      <div className="rounded-xl border border-blue-200 bg-blue-50/60 p-4 text-xs text-blue-950 flex items-start gap-3">
        <ShieldAlert className="h-4 w-4 text-blue-600 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Human-in-the-Loop Governance Notice: </span>
          <span>
            Curriculum modifications are strictly advisory proposals. In compliance with vocational board accreditation standards,
            recommendations <strong>never automatically overwrite</strong> the master course syllabus. All changes require explicit institutional review and formal sign-off.
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {recommendations.map((rec) => {
          const isSubmitting = submittingId === rec.id;
          const isPending = rec.status === "pending_review";
          const isApproved = rec.status === "approved";
          const isRejected = rec.status === "rejected";

          return (
            <div
              key={rec.id}
              className={`rounded-xl border bg-white p-5 shadow-2xs flex flex-col justify-between transition-all ${
                isApproved
                  ? "border-emerald-300 ring-1 ring-emerald-200"
                  : isRejected
                  ? "border-slate-300 opacity-75"
                  : "border-slate-200 hover:border-slate-300"
              }`}
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <span className="inline-block rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-bold uppercase text-slate-600 mb-1">
                      {rec.recommendationType === "NEW_MODULE" ? "Proposed New Module" : "Hours Expansion"}
                    </span>
                    <h4 className="text-sm font-bold text-[#0f2744]">
                      {rec.proposedModuleTitle}
                    </h4>
                    <div className="text-xs font-medium text-slate-500 mt-0.5">
                      Target Skill: <span className="font-semibold text-slate-800">{rec.skillName}</span>
                    </div>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isPending && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 border border-amber-200">
                        <Clock className="h-3 w-3" />
                        Pending Review
                      </span>
                    )}
                    {isApproved && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" />
                        Approved
                      </span>
                    )}
                    {isRejected && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                        <XCircle className="h-3 w-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Hours Breakdown */}
                <div className="grid grid-cols-2 gap-2 rounded-lg bg-slate-50 p-2.5 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Recommended Theory</span>
                    <div className="font-bold text-slate-900 mt-0.5">{rec.recommendedTheoryHours} Hours</div>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase font-medium">Recommended Practical</span>
                    <div className="font-bold text-cyan-700 mt-0.5">{rec.recommendedPracticalHours} Hours</div>
                  </div>
                </div>

                {/* Equipment & Trainer Prerequisites */}
                <div className="space-y-2 text-xs text-slate-700">
                  <div className="flex items-start gap-1.5">
                    <Wrench className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Workshop Equipment Needed: </span>
                      <span>{rec.equipmentPrerequisites.join(", ")}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-1.5">
                    <UserCheck className="h-3.5 w-3.5 text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800">Faculty Qualification: </span>
                      <span>{rec.trainerQualificationNeeded}</span>
                    </div>
                  </div>
                </div>

                {/* Rationale */}
                <div className="rounded-lg bg-slate-50/70 p-2.5 text-xs text-slate-600 italic">
                  &ldquo;{rec.rationale}&rdquo;
                </div>

                {/* Audit Review Info if reviewed */}
                {!isPending && rec.reviewedBy && (
                  <div className="rounded-lg border border-slate-200 bg-slate-50 p-2.5 text-[11px] text-slate-600">
                    <div className="font-semibold text-slate-800">
                      Reviewed by: {rec.reviewedBy}
                    </div>
                    {rec.reviewerNotes && (
                      <div className="text-slate-500 mt-0.5">Notes: {rec.reviewerNotes}</div>
                    )}
                  </div>
                )}
              </div>

              {/* Action Controls for Human Review */}
              {isPending && (
                <div className="mt-4 pt-3 border-t border-slate-100 space-y-2.5">
                  <input
                    type="text"
                    placeholder="Optional review feedback or board conditions..."
                    value={reviewNotes[rec.id] || ""}
                    onChange={(e) =>
                      setReviewNotes({ ...reviewNotes, [rec.id]: e.target.value })
                    }
                    className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-2.5 py-1 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f2744] focus:outline-hidden"
                  />

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      disabled={isSubmitting}
                      onClick={() => handleReviewAction(rec.id, "rejected")}
                      className="h-8 px-3 text-xs border-slate-200 text-rose-700 hover:bg-rose-50"
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      disabled={isSubmitting}
                      onClick={() => handleReviewAction(rec.id, "approved")}
                      className="h-8 px-3 text-xs bg-[#0f2744] text-white hover:bg-[#1a3a60]"
                    >
                      {isSubmitting ? (
                        <Loader2 className="h-3.5 w-3.5 animate-spin mr-1" />
                      ) : (
                        <Sparkles className="h-3.5 w-3.5 mr-1 text-cyan-300" />
                      )}
                      Approve Proposal
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
