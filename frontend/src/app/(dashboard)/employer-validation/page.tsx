"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { EmptyState } from "@/components/shared/EmptyState";
import { EmployerReviewModal } from "@/components/employer-validation/EmployerReviewModal";
import { ValidationEvidenceModal } from "@/components/employer-validation/ValidationEvidenceModal";
import {
  EmployerProfile,
  IndustryRecommendationView,
  EmployerValidationResponse,
} from "@/lib/employer-validation/types";
import {
  ShieldCheck,
  Building2,
  CheckCircle2,
  FileEdit,
  AlertTriangle,
  Briefcase,
  Layers,
  ChevronRight,
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function EmployerValidationContent() {
  const [employers, setEmployers] = useState<EmployerProfile[]>([]);
  const [selectedEmployerId, setSelectedEmployerId] = useState<string>("emp-tata-motors");
  const [recommendations, setRecommendations] = useState<IndustryRecommendationView[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal states
  const [reviewTarget, setReviewTarget] = useState<IndustryRecommendationView | null>(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

  const [evidenceTarget, setEvidenceTarget] = useState<IndustryRecommendationView | null>(null);
  const [evidenceResponses, setEvidenceResponses] = useState<EmployerValidationResponse[]>([]);
  const [isEvidenceModalOpen, setIsEvidenceModalOpen] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const activeEmployer =
    employers.find((e) => e.id === selectedEmployerId) ||
    employers[0] || {
      id: "emp-tata-motors",
      name: "Tata Motors Passenger Electric Vehicles",
      sector: "automotive_ev",
      district: "Pune",
      contactPerson: "Rajesh Kulkarni",
      designation: "Head of Powertrain Talent",
      employeeCount: 4200,
    };

  const loadData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/employer-validation");
      if (!res.ok) throw new Error("Failed to load employer validation data");
      const data = await res.json();
      setEmployers(data.employers || []);
      setRecommendations(data.recommendations || []);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Error connecting to server");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter recommendations matching the active employer's sector
  const relevantRecommendations = recommendations.filter(
    (r) => r.sector === activeEmployer.sector || activeEmployer.sector === "all"
  );

  const handleOpenReview = (rec: IndustryRecommendationView) => {
    setReviewTarget(rec);
    setIsReviewModalOpen(true);
  };

  const handleOpenEvidence = async (rec: IndustryRecommendationView) => {
    setEvidenceTarget(rec);
    try {
      const res = await fetch(`/api/employer-validation?recommendationId=${rec.id}`);
      if (res.ok) {
        const data = await res.json();
        setEvidenceResponses(data.responses || []);
      }
    } catch {
      setEvidenceResponses(rec.recentResponses || []);
    }
    setIsEvidenceModalOpen(true);
  };

  const handleValidationSuccess = (newResponse: EmployerValidationResponse) => {
    setToastMessage(`Feedback from ${newResponse.employerName} recorded as Employer Validation Evidence.`);
    setTimeout(() => setToastMessage(null), 4000);
    loadData();
  };

  // High-level summary stats across visible recommendations
  const totalReviews = relevantRecommendations.reduce((acc, r) => acc + r.validationStats.totalReviews, 0);
  const totalConfirmed = relevantRecommendations.reduce((acc, r) => acc + r.validationStats.confirmedCount, 0);
  const overallConfirmationPct = totalReviews > 0 ? Math.round((totalConfirmed / totalReviews) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="Employer Validation & Industry Feedback"
        description="Direct industry feedback mechanism allowing employers to validate, modify, or reject AI recommendations, report hiring friction, and validate proficiency requirements."
      />

      {/* Active Employer Switcher Bar */}
      <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-600 text-white shadow-2xs">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <div className="text-[11px] font-bold uppercase tracking-wider text-blue-700">
              Active Employer Persona
            </div>
            <div className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <span>{activeEmployer.name}</span>
              <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
                {activeEmployer.district}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="employer-select" className="text-xs font-medium text-slate-600">
            Switch Organization:
          </label>
          <select
            id="employer-select"
            value={selectedEmployerId}
            onChange={(e) => setSelectedEmployerId(e.target.value)}
            className="rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800 font-medium"
          >
            {employers.map((emp) => (
              <option key={emp.id} value={emp.id}>
                {emp.name} ({emp.district} - {emp.sector.replace("_", " ")})
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <KpiCard
          title="Employer Confirmation Rate"
          value={`${overallConfirmationPct}%`}
          subtext={`${totalConfirmed} of ${totalReviews} employers confirmed`}
          icon={ShieldCheck}
          variant="accent"
        />
        <KpiCard
          title="Active Industry Reviews"
          value={totalReviews}
          subtext="Compiled across regional clusters"
          icon={Briefcase}
        />
        <KpiCard
          title="Participating Enterprises"
          value={employers.length}
          subtext="Automotive, CNC, and Solar OEMs"
          icon={Building2}
        />
        <KpiCard
          title="Acute Hiring Friction"
          value="80%"
          subtext="Report >45 days to fill vacancies"
          icon={AlertTriangle}
          variant="warning"
        />
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Loading employer validation evidence..." />
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
          <strong>Failed to load validation feed: </strong> {error}
        </div>
      ) : relevantRecommendations.length === 0 ? (
        <EmptyState
          title="No Recommendations for this Industry Sector"
          description={`No current workforce interventions match the ${activeEmployer.sector} sector.`}
          icon={Filter}
        />
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-slate-500 px-1">
            <span>
              Displaying <strong>{relevantRecommendations.length}</strong> AI recommendations relevant to{" "}
              <strong className="text-slate-700 capitalize">{activeEmployer.sector.replace("_", " ")}</strong>
            </span>
            <span className="text-[11px] text-slate-400 italic">
              *All feedback is captured strictly as Employer Validation Evidence.
            </span>
          </div>

          <div className="space-y-4">
            {relevantRecommendations.map((rec) => {
              const stats = rec.validationStats;
              return (
                <div
                  key={rec.id}
                  className="rounded-xl border border-slate-200 bg-white shadow-xs hover:border-slate-300 transition-all overflow-hidden"
                >
                  {/* Card Header */}
                  <div className="p-5 border-b border-slate-100 space-y-3">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                          {rec.affectedCourseCode}
                        </span>
                        <span className="text-xs font-semibold text-slate-500">{rec.affectedCourseName}</span>
                      </div>

                      {/* Transparent validation evidence badge */}
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 shadow-2xs">
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        {stats.displayPercentage} ({stats.displayRatio})
                      </span>
                    </div>

                    <h3 className="text-base font-bold text-slate-900">{rec.recommendation}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-200">
                      {rec.reason}
                    </p>

                    {/* Context attributes & Identified skills */}
                    <div className="flex flex-wrap items-center gap-2 text-xs pt-1">
                      <span className="text-slate-500 font-medium">Hiring Difficulty:</span>
                      <span className="px-2 py-0.5 rounded bg-rose-50 border border-rose-200 text-rose-800 font-bold capitalize">
                        {stats.dominantHiringDifficulty.replace("_", " ")}
                      </span>

                      <span className="text-slate-400">•</span>

                      <span className="text-slate-500 font-medium">Required Entry Proficiency:</span>
                      <span className="px-2 py-0.5 rounded bg-indigo-50 border border-indigo-200 text-indigo-800 font-bold capitalize">
                        {stats.dominantProficiencyRequirement}
                      </span>
                    </div>

                    {/* Top Important Skills */}
                    {stats.topImportantSkills.length > 0 && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1">
                          <Layers className="h-3 w-3 text-slate-400" /> Validated Critical Skills:
                        </span>
                        {stats.topImportantSkills.map((s) => (
                          <span
                            key={s.name}
                            className="px-2 py-0.5 rounded text-[11px] bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                          >
                            {s.name} ({s.count})
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Footer: Action Buttons */}
                  <div className="p-3.5 bg-slate-50/70 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[11px] text-slate-500 flex items-center gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      {stats.confirmedCount} Confirmations • {stats.modifiedCount} Modifications • {stats.rejectedCount} Rejections
                    </span>

                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => handleOpenEvidence(rec)}
                        className="text-xs text-slate-700 hover:text-slate-900 h-8 flex items-center gap-1"
                      >
                        <ShieldCheck className="h-3.5 w-3.5 text-blue-600" />
                        View Employer Evidence Log
                      </Button>

                      <Button
                        type="button"
                        size="sm"
                        onClick={() => handleOpenReview(rec)}
                        className="text-xs bg-[#0f2744] hover:bg-[#1a3a60] text-white h-8 flex items-center gap-1 shadow-2xs"
                      >
                        <FileEdit className="h-3.5 w-3.5" />
                        Submit Employer Review
                        <ChevronRight className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Review Submission Modal */}
      <EmployerReviewModal
        isOpen={isReviewModalOpen}
        onClose={() => setIsReviewModalOpen(false)}
        recommendation={reviewTarget}
        activeEmployer={activeEmployer}
        onSuccess={handleValidationSuccess}
      />

      {/* Evidence Breakdown Modal */}
      <ValidationEvidenceModal
        isOpen={isEvidenceModalOpen}
        onClose={() => setIsEvidenceModalOpen(false)}
        recommendation={evidenceTarget}
        responses={evidenceResponses}
      />
    </div>
  );
}

export default function EmployerValidationPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading Employer Validation module..." />}>
      <EmployerValidationContent />
    </Suspense>
  );
}
