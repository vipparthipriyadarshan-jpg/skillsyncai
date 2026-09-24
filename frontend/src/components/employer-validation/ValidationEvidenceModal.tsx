"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import {
  IndustryRecommendationView,
  EmployerValidationResponse,
} from "@/lib/employer-validation/types";
import {
  ShieldCheck,
  CheckCircle2,
  FileEdit,
  XCircle,
  Building2,
  Quote,
  Clock,
  Layers,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface ValidationEvidenceModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: IndustryRecommendationView | null;
  responses: EmployerValidationResponse[];
}

export function ValidationEvidenceModal({
  isOpen,
  onClose,
  recommendation,
  responses,
}: ValidationEvidenceModalProps) {
  if (!recommendation) return null;

  const stats = recommendation.validationStats;

  const getStanceBadge = (stance: string) => {
    switch (stance) {
      case "confirmed":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Confirmed
          </span>
        );
      case "modified":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <FileEdit className="h-3 w-3" /> Modified
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      default:
        return <Badge variant="outline">{stance}</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Employer Validation Evidence"
      description={`Transparent industry consensus compiled for ${recommendation.affectedCourseCode} (${recommendation.affectedSkillName})`}
      size="xl"
    >
      <div className="space-y-5 pt-1 text-xs">
        {/* Recommendation Header */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
          <div className="font-bold text-slate-900 text-sm">{recommendation.recommendation}</div>
          <p className="text-slate-600 text-xs">{recommendation.reason}</p>
        </div>

        {/* Transparent Statistics Card */}
        <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/40 space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-100 pb-2.5">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-blue-600" />
                Employer Validation Evidence Metric
              </span>
              <div className="text-xl font-extrabold text-slate-900 mt-0.5">
                {stats.displayPercentage}
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                {stats.displayRatio}
              </span>
            </div>
          </div>

          {/* Metric breakdown grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center">
            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Total Reviews</div>
              <div className="text-sm font-bold text-slate-800">{stats.totalReviews}</div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Confirmed / Modified</div>
              <div className="text-sm font-bold text-emerald-600">
                {stats.confirmedCount} <span className="text-slate-400 font-normal">/</span>{" "}
                <span className="text-amber-600">{stats.modifiedCount}</span>
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Hiring Friction</div>
              <div className="text-sm font-bold capitalize text-rose-600">
                {stats.dominantHiringDifficulty.replace("_", " ")}
              </div>
            </div>

            <div className="p-2 rounded-lg bg-white border border-slate-200">
              <div className="text-[10px] text-slate-500 font-medium">Validated Proficiency</div>
              <div className="text-sm font-bold capitalize text-indigo-700">
                {stats.dominantProficiencyRequirement}
              </div>
            </div>
          </div>
        </div>

        {/* Identified Important Skills */}
        {stats.topImportantSkills.length > 0 && (
          <div className="space-y-1.5">
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
              <Layers className="h-3.5 w-3.5 text-blue-600" />
              Industry-Identified Critical Skills
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {stats.topImportantSkills.map((s) => (
                <span
                  key={s.name}
                  className="px-2.5 py-1 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-xs flex items-center gap-1.5"
                >
                  <span className="font-medium">{s.name}</span>
                  <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-100 text-blue-800 font-bold">
                    {s.count} mentions
                  </span>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Employer Response Feed */}
        <div className="space-y-3">
          <h4 className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Quote className="h-3.5 w-3.5 text-emerald-600" />
            Participating Employer Submissions ({responses.length})
          </h4>

          <div className="space-y-2.5 max-h-80 overflow-y-auto pr-1">
            {responses.map((resp) => (
              <div key={resp.id} className="p-3.5 rounded-lg border border-slate-200 bg-white space-y-2 shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-1.5">
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4 text-slate-500" />
                    <div>
                      <strong className="text-slate-900 text-xs">{resp.employerName}</strong>
                      <div className="text-[11px] text-slate-500">
                        {resp.reviewerName} • {resp.reviewerDesignation}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStanceBadge(resp.stance)}
                    <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                      {resp.hiringDifficulty.replace("_", " ")}
                    </span>
                  </div>
                </div>

                {resp.feedbackComments && (
                  <p className="text-slate-700 italic bg-slate-50 p-2.5 rounded border border-slate-100 text-xs">
                    &quot;{resp.feedbackComments}&quot;
                  </p>
                )}

                {resp.proposedModifications && (
                  <div className="text-xs p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                    <strong className="font-semibold">Proposed Modification: </strong>
                    {resp.proposedModifications}
                  </div>
                )}

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-slate-100">
                  <span>Required Proficiency: <strong className="capitalize text-slate-600">{resp.validatedProficiency}</strong></span>
                  <time className="flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {new Date(resp.timestamp).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </time>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
