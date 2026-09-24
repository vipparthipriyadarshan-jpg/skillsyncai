"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { EmptyState } from "@/components/shared/EmptyState";
import { LoadingState } from "@/components/shared/LoadingState";
import { RecommendationCard } from "@/components/decision-engine/RecommendationCard";
import { ReviewActionModal } from "@/components/decision-engine/ReviewActionModal";
import { AuditHistoryModal } from "@/components/decision-engine/AuditHistoryModal";
import {
  ActionRecommendation,
  DecisionEngineSummary,
  ACTION_TYPE_LABELS,
} from "@/lib/decision-engine/types";
import {
  Sliders,
  Clock,
  ShieldCheck,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function DecisionEngineContent() {
  const [recommendations, setRecommendations] = useState<ActionRecommendation[]>([]);
  const [summary, setSummary] = useState<DecisionEngineSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filter state
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [selectedActionType, setSelectedActionType] = useState<string>("all");
  const [selectedPriority, setSelectedPriority] = useState<string>("all");
  const [selectedDistrict, setSelectedDistrict] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Modal states
  const [reviewTarget, setReviewTarget] = useState<ActionRecommendation | null>(null);
  const [reviewAction, setReviewAction] = useState<"approve" | "reject" | "modify">("approve");
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [auditTarget, setAuditTarget] = useState<ActionRecommendation | null>(null);
  const [isAuditModalOpen, setIsAuditModalOpen] = useState(false);

  // Success toast state
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null);

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (selectedStatus !== "all") params.set("status", selectedStatus);
      if (selectedActionType !== "all") params.set("actionType", selectedActionType);
      if (selectedPriority !== "all") params.set("priority", selectedPriority);
      if (selectedDistrict !== "all") params.set("district", selectedDistrict);
      if (searchQuery.trim()) params.set("search", searchQuery.trim());

      const res = await fetch(`/api/decision-engine?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load recommendations (${res.status})`);
      }
      const data = await res.json();
      setRecommendations(data.recommendations || []);
      setSummary(data.summary || null);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, [selectedStatus, selectedActionType, selectedPriority, selectedDistrict, searchQuery]);

  useEffect(() => {
    fetchRecommendations();
  }, [fetchRecommendations]);

  const handleOpenReview = (rec: ActionRecommendation, action: "approve" | "reject" | "modify") => {
    setReviewTarget(rec);
    setReviewAction(action);
    setIsReviewModalOpen(true);
  };

  const handleOpenAudit = (rec: ActionRecommendation) => {
    setAuditTarget(rec);
    setIsAuditModalOpen(true);
  };

  const handleReviewSuccess = (updated: ActionRecommendation) => {
    setFeedbackToast(`Action for "${updated.affectedCourse.code}" transitioned to ${updated.status}.`);
    setTimeout(() => setFeedbackToast(null), 4000);
    fetchRecommendations();
  };

  const resetFilters = () => {
    setSelectedStatus("all");
    setSelectedActionType("all");
    setSelectedPriority("all");
    setSelectedDistrict("all");
    setSearchQuery("");
  };

  return (
    <div className="space-y-6">
      {/* Toast Feedback */}
      {feedbackToast && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{feedbackToast}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Skill Sync AI Decision Engine"
        description="Synthesizes industry demand signals, syllabus gaps, employer feedback, faculty readiness, equipment availability, intake capacity, and placement outcomes into actionable, auditable workforce interventions."
      />

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Total Recommendations"
          value={summary?.totalRecommendations ?? 0}
          subtext="Synthesized across 7 dimensions"
          icon={Sliders}
        />
        <KpiCard
          title="Pending Human Review"
          value={summary?.pendingReviewCount ?? 0}
          subtext="Awaiting governance sign-off"
          icon={Clock}
        />
        <KpiCard
          title="Approved Actions"
          value={summary?.approvedCount ?? 0}
          subtext="Sanctioned for implementation"
          icon={ShieldCheck}
        />
        <KpiCard
          title="Urgent Interventions"
          value={summary?.urgentCount ?? 0}
          subtext="High deficit & surge demand"
          icon={AlertTriangle}
        />
      </div>

      {/* Filters and Controls Card */}
      <div className="p-4 rounded-xl border border-slate-200 bg-white shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-slate-100 text-xs font-medium">
            {[
              { id: "all", label: "All Actions" },
              { id: "pending", label: `Pending (${summary?.pendingReviewCount ?? 0})` },
              { id: "approved", label: `Approved (${summary?.approvedCount ?? 0})` },
              { id: "modified", label: `Modified (${summary?.modifiedCount ?? 0})` },
              { id: "rejected", label: `Rejected (${summary?.rejectedCount ?? 0})` },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedStatus(tab.id)}
                className={`px-3 py-1.5 rounded-md transition-all ${
                  selectedStatus === tab.id
                    ? "bg-white text-slate-900 font-bold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Reset Filters */}
          <Button
            variant="ghost"
            size="sm"
            onClick={resetFilters}
            className="text-xs text-slate-500 hover:text-slate-900 flex items-center gap-1 h-8"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            Reset Filters
          </Button>
        </div>

        {/* Dropdown Filters & Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2.5 pt-1">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search skill, course, or action..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-slate-300 pl-8 pr-3 py-1.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Action Type */}
          <select
            value={selectedActionType}
            onChange={(e) => setSelectedActionType(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
          >
            <option value="all">All Action Types (10 Available)</option>
            {Object.entries(ACTION_TYPE_LABELS).map(([key, meta]) => (
              <option key={key} value={key}>
                {meta.label}
              </option>
            ))}
          </select>

          {/* Priority */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
          >
            <option value="all">All Priorities</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>

          {/* District */}
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
          >
            <option value="all">All Industrial Districts</option>
            <option value="pune">Pune (Automotive / EV)</option>
            <option value="coimbatore">Coimbatore (CNC / Machinery)</option>
            <option value="ahmedabad">Ahmedabad (Solar / Renewables)</option>
          </select>
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Synthesizing multi-metric inputs and evaluating decision rules..." />
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
          <strong>Failed to load recommendations: </strong> {error}
        </div>
      ) : recommendations.length === 0 ? (
        <EmptyState
          title="No Recommendations Match Active Criteria"
          description="Adjust your status, action type, priority, or district filters to inspect decision engine recommendations."
          icon={Filter}
          action={{
            label: "Reset All Filters",
            onClick: resetFilters,
          }}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Displaying <strong>{recommendations.length}</strong> action recommendations
            </span>
            <span className="italic">
              *All actions require explicit human authorization before execution.
            </span>
          </div>

          <div className="space-y-4">
            {recommendations.map((rec) => (
              <RecommendationCard
                key={rec.id}
                recommendation={rec}
                onReview={handleOpenReview}
                onViewAudit={handleOpenAudit}
              />
            ))}
          </div>
        </div>
      )}

      {/* Human Review Modal */}
      <ReviewActionModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        recommendation={reviewTarget}
        initialAction={reviewAction}
        onSuccess={handleReviewSuccess}
      />

      {/* Audit Trail Modal */}
      <AuditHistoryModal
        isOpen={isAuditModalOpen}
        onClose={() => setIsAuditModalOpen(false)}
        recommendation={auditTarget}
      />
    </div>
  );
}

export default function DecisionEnginePage() {
  return (
    <Suspense fallback={<LoadingState message="Loading Decision Engine..." />}>
      <DecisionEngineContent />
    </Suspense>
  );
}
