"use client";

import React from "react";
import { SkillGapAnalysisItem } from "@/lib/curriculum/xray-service";
import {
  X,
  AlertTriangle,
  Flame,
  CheckCircle2,
  TrendingUp,
  Clock,
  Layers,
  Building2,
  GraduationCap,
  Quote,
  ShieldCheck,
} from "lucide-react";

interface GapExplanationModalProps {
  item: SkillGapAnalysisItem | null;
  onClose: () => void;
}

export function GapExplanationModal({ item, onClose }: GapExplanationModalProps) {
  if (!item) return null;

  const getCategoryBadge = (category: string) => {
    switch (category) {
      case "CRITICAL GAP":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-bold text-rose-700 border border-rose-200">
            <Flame className="h-3.5 w-3.5 text-rose-600" />
            CRITICAL GAP
          </span>
        );
      case "MAJOR GAP":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-bold text-amber-700 border border-amber-200">
            <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
            MAJOR GAP
          </span>
        );
      case "MODERATE GAP":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold text-sky-700 border border-sky-200">
            <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
            MODERATE GAP
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
            ALIGNED
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        {/* Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Curriculum Audit Explanation
              </span>
              <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase">
                {item.category.replace("_", " ")}
              </span>
            </div>
            <h2 className="text-xl font-bold text-[#0f2744] flex items-center gap-2">
              Why is {item.skillName} a Gap?
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {getCategoryBadge(item.categoryClassification)}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Summary Box */}
          <div
            className={`rounded-xl border p-4 ${
              item.categoryClassification === "CRITICAL GAP"
                ? "border-rose-200 bg-rose-50/40 text-rose-950"
                : item.categoryClassification === "MAJOR GAP"
                ? "border-amber-200 bg-amber-50/40 text-amber-950"
                : "border-sky-200 bg-sky-50/40 text-sky-950"
            }`}
          >
            <div className="text-xs font-bold uppercase tracking-wider mb-1">
              {item.explanation.title}
            </div>
            <p className="text-sm font-medium leading-relaxed">
              {item.explanation.summary}
            </p>
          </div>

          {/* Tri-Metric Score Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-center">
              <div className="text-[11px] font-medium text-slate-500 uppercase">
                Industry Requirement
              </div>
              <div className="text-2xl font-bold text-slate-900 mt-1">
                {item.industryRequirementScore}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Target: {item.industryProficiencyRequired} tier
              </div>
            </div>

            <div className="rounded-xl border border-slate-200 bg-slate-50/50 p-3.5 text-center">
              <div className="text-[11px] font-medium text-slate-500 uppercase">
                Curriculum Coverage
              </div>
              <div className="text-2xl font-bold text-cyan-600 mt-1">
                {item.curriculumCoverageScore}%
              </div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                {item.allocatedHoursInSyllabus} allocated hours
              </div>
            </div>

            <div
              className={`rounded-xl border p-3.5 text-center ${
                item.gapScore >= 50
                  ? "border-rose-200 bg-rose-50/60"
                  : item.gapScore >= 30
                  ? "border-amber-200 bg-amber-50/60"
                  : "border-sky-200 bg-sky-50/60"
              }`}
            >
              <div className="text-[11px] font-medium text-slate-500 uppercase">
                Calculated Gap
              </div>
              <div
                className={`text-2xl font-bold mt-1 ${
                  item.gapScore >= 50
                    ? "text-rose-700"
                    : item.gapScore >= 30
                    ? "text-amber-700"
                    : "text-sky-700"
                }`}
              >
                {item.gapScore}%
              </div>
              <div className="text-[10px] text-slate-500 mt-0.5">
                Priority: {item.priority}
              </div>
            </div>
          </div>

          {/* Transparent Multi-Factor Audit Breakdown */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Deterministic Scoring & Evidence Breakdown
            </h3>

            {/* Factor 1: Market Demand */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 shrink-0">
                <TrendingUp className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Factor 1: Industry Demand Signal
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {item.explanation.marketDemandFactor}
                </p>
              </div>
            </div>

            {/* Factor 2: Curriculum Deficit */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 shrink-0">
                <Clock className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Factor 2: Syllabus Allocated Hours vs Benchmark
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {item.explanation.curriculumDeficitFactor}
                </p>
              </div>
            </div>

            {/* Factor 3: Proficiency Mismatch */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 shrink-0">
                <Layers className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Factor 3: Required vs Provided Proficiency Tier
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {item.explanation.proficiencyMismatchFactor}
                </p>
              </div>
            </div>

            {/* Factor 4: Employer Survey Validation */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-4 shadow-2xs flex items-start gap-3">
              <div className="rounded-lg bg-amber-100 p-2 text-amber-800 shrink-0">
                <Building2 className="h-4 w-4" />
              </div>
              <div className="space-y-1.5">
                <h4 className="text-xs font-bold text-amber-950">
                  Factor 4: Employer Survey Feedback
                </h4>
                <div className="flex items-start gap-1.5 text-xs text-amber-900 italic font-serif">
                  <Quote className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                  <span>{item.explanation.employerValidationEvidence}</span>
                </div>
              </div>
            </div>

            {/* Factor 5: Placement Outcomes */}
            <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs flex items-start gap-3">
              <div className="rounded-lg bg-slate-100 p-2 text-slate-700 shrink-0">
                <GraduationCap className="h-4 w-4" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Factor 5: Graduate Placement Impact
                </h4>
                <p className="text-xs text-slate-600 mt-0.5 leading-normal">
                  {item.explanation.placementRelevanceEvidence}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs text-slate-500 font-medium flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
            Transparent deterministic math • Zero stochastic scoring
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#0f2744] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a60] transition-colors"
          >
            Close Explanation
          </button>
        </div>
      </div>
    </div>
  );
}
