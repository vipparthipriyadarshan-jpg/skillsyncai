"use client";

import React, { useState } from "react";
import {
  ActionRecommendation,
  ACTION_TYPE_LABELS,
} from "@/lib/decision-engine/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  PlusCircle,
  FileEdit,
  Clock,
  GraduationCap,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  Handshake,
  Compass,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  XCircle,
  History,
  ShieldCheck,
  Quote,
  Sparkles,
} from "lucide-react";

const ACTION_ICONS: Record<string, React.ElementType> = {
  PlusCircle,
  FileEdit,
  Clock,
  GraduationCap,
  Wrench,
  TrendingUp,
  TrendingDown,
  AlertOctagon,
  Handshake,
  Compass,
};

interface RecommendationCardProps {
  recommendation: ActionRecommendation;
  onReview: (recommendation: ActionRecommendation, action: "approve" | "reject" | "modify") => void;
  onViewAudit: (recommendation: ActionRecommendation) => void;
}

export function RecommendationCard({
  recommendation,
  onReview,
  onViewAudit,
}: RecommendationCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const actionMeta = ACTION_TYPE_LABELS[recommendation.actionType] || {
    label: recommendation.actionType,
    iconName: "Sparkles",
    category: "Action",
  };

  const IconComponent = ACTION_ICONS[actionMeta.iconName] || Sparkles;

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent":
        return <Badge variant="destructive" className="uppercase font-bold tracking-wider text-[10px]">Urgent</Badge>;
      case "high":
        return <Badge variant="warning" className="uppercase font-bold tracking-wider text-[10px]">High Priority</Badge>;
      case "medium":
        return <Badge variant="secondary" className="uppercase font-semibold tracking-wider text-[10px]">Medium</Badge>;
      case "low":
      default:
        return <Badge variant="outline" className="uppercase tracking-wider text-[10px]">Low</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="h-3 w-3" /> Approved
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-rose-50 text-rose-700 border border-rose-200">
            <XCircle className="h-3 w-3" /> Rejected
          </span>
        );
      case "modified":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
            <FileEdit className="h-3 w-3" /> Modified & Approved
          </span>
        );
      case "pending":
      default:
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
            <Clock className="h-3 w-3" /> Pending Review
          </span>
        );
    }
  };

  const { supportingMetrics: m } = recommendation;

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all">
      {/* Top Card Bar */}
      <div className="p-5 border-b border-slate-100 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          {/* Action Category & Action Type */}
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                {actionMeta.category}
              </span>
              <div className="text-xs font-semibold text-slate-700">{actionMeta.label}</div>
            </div>
          </div>

          {/* Badges: Priority, Status, and Confidence */}
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200" title="Deterministic statistical confidence score">
              <ShieldCheck className="h-3 w-3 text-blue-600" />
              {Math.round(recommendation.confidence * 100)}% Confidence
            </span>
            {getPriorityBadge(recommendation.priority)}
            {getStatusBadge(recommendation.status)}
          </div>
        </div>

        {/* Action Title / Statement */}
        <h3 className="text-base font-bold text-slate-900 leading-snug">
          {recommendation.recommendation}
        </h3>

        {/* Target Context Tags */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-slate-400 font-medium">District:</span>
            <strong>{recommendation.affectedDistrict.name}</strong>
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 border border-slate-200 text-slate-700">
            <span className="text-slate-400 font-medium">Course:</span>
            <strong>{recommendation.affectedCourse.code}</strong> ({recommendation.affectedCourse.name})
          </span>

          <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-indigo-50 border border-indigo-100 text-indigo-800 font-medium">
            Skill: {recommendation.affectedSkill.name}
          </span>
        </div>
      </div>

      {/* 7 Supporting Metrics Grid */}
      <div className="p-4 bg-slate-50/70 border-b border-slate-100">
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2.5">
          Synthesized Input Signals (Deterministic Multi-Metric Vector)
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5 text-center">
          {/* 1. Skill Demand */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Demand Vol / Growth</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {m.skillDemandVolume} vac{" "}
              <span className={m.demandGrowthRate >= 0 ? "text-emerald-600" : "text-rose-600"}>
                ({m.demandGrowthRate > 0 ? `+${m.demandGrowthRate}%` : `${m.demandGrowthRate}%`})
              </span>
            </div>
          </div>

          {/* 2. Curriculum Gap */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Curriculum Gap</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              <span className={m.curriculumGapPct >= 50 ? "text-rose-600" : m.curriculumGapPct >= 25 ? "text-amber-600" : "text-emerald-600"}>
                {m.curriculumGapPct}% Gap
              </span>
            </div>
          </div>

          {/* 3. Employer Validation */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Employer Consensus</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {m.employerValidationScore}% Agreement
            </div>
          </div>

          {/* 4. Trainer Readiness */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Trainer Readiness</div>
            <div className={`text-xs font-bold mt-0.5 ${m.trainerReadinessPct < 50 ? "text-rose-600" : "text-slate-800"}`}>
              {m.trainerReadinessPct}% Certified
            </div>
          </div>

          {/* 5. Equipment Availability */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Equipment Readiness</div>
            <div className={`text-xs font-bold mt-0.5 ${m.equipmentAvailabilityPct < 40 ? "text-rose-600" : "text-slate-800"}`}>
              {m.equipmentAvailabilityPct}% Available
            </div>
          </div>

          {/* 6. Training Capacity */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Seat Utilization</div>
            <div className="text-xs font-bold text-slate-800 mt-0.5">
              {m.capacityUtilizationPct}% Filled
            </div>
          </div>

          {/* 7. Placement Rate */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium">Placement Rate</div>
            <div className={`text-xs font-bold mt-0.5 ${m.placementRatePct >= 75 ? "text-emerald-600" : m.placementRatePct <= 40 ? "text-rose-600" : "text-slate-800"}`}>
              {m.placementRatePct}% Placed
            </div>
          </div>
        </div>
      </div>

      {/* Expandable Reasoning & Grounded Evidence */}
      {isExpanded && (
        <div className="p-5 border-b border-slate-100 bg-white space-y-4 text-xs">
          {/* Reason */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5 text-blue-600" />
              Algorithmic Recommendation Rationale
            </h4>
            <p className="text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
              {recommendation.reason}
            </p>
          </div>

          {/* Evidence */}
          <div>
            <h4 className="font-bold text-slate-900 mb-1 flex items-center gap-1.5">
              <Quote className="h-3.5 w-3.5 text-emerald-600" />
              Grounded Evidence & Empirical Citations
            </h4>
            <p className="text-slate-600 italic bg-emerald-50/50 p-3 rounded-lg border border-emerald-200">
              {recommendation.evidence}
            </p>
          </div>
        </div>
      )}

      {/* Card Footer: Expand toggle & Governance Review Buttons */}
      <div className="p-3.5 flex flex-wrap items-center justify-between gap-2 bg-white">
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-xs font-medium text-blue-600 hover:text-blue-800 flex items-center gap-1 py-1 px-2 rounded hover:bg-blue-50 transition-colors"
        >
          {isExpanded ? (
            <>
              Hide Explainability Details <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View Explainability & Grounded Evidence <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>

        <div className="flex items-center gap-2">
          {/* Audit History Button */}
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => onViewAudit(recommendation)}
            className="text-xs text-slate-600 hover:text-slate-900 flex items-center gap-1.5 h-8"
          >
            <History className="h-3.5 w-3.5 text-slate-500" />
            Audit History ({recommendation.auditHistory.length})
          </Button>

          {/* Governance Action Buttons */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReview(recommendation, "modify")}
            className="text-xs border-amber-300 text-amber-800 hover:bg-amber-50 h-8 flex items-center gap-1"
          >
            <FileEdit className="h-3.5 w-3.5 text-amber-600" />
            Modify
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onReview(recommendation, "reject")}
            className="text-xs border-rose-300 text-rose-800 hover:bg-rose-50 h-8 flex items-center gap-1"
          >
            <XCircle className="h-3.5 w-3.5 text-rose-600" />
            Reject
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={() => onReview(recommendation, "approve")}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 text-white h-8 flex items-center gap-1 shadow-2xs"
          >
            <CheckCircle2 className="h-3.5 w-3.5" />
            Approve Action
          </Button>
        </div>
      </div>
    </div>
  );
}
