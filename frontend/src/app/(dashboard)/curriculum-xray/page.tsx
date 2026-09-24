"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { GapExplanationModal } from "@/components/curriculum/GapExplanationModal";
import { CurriculumRecommendations } from "@/components/curriculum/CurriculumRecommendations";
import {
  CurriculumXRayReport,
  SkillGapAnalysisItem,
  CurriculumRecommendation,
} from "@/lib/curriculum/xray-service";
import {
  ScanSearch,
  Flame,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  MapPin,
  HelpCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";

interface CourseOption {
  id: string;
  code: string;
  name: string;
  district: string;
  sector: string;
}

function CurriculumXRayContent() {
  const [courses, setCourses] = useState<CourseOption[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState<string>("course-ev-201");
  const [report, setReport] = useState<CurriculumXRayReport | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Modal explanation state
  const [inspectedGapItem, setInspectedGapItem] = useState<SkillGapAnalysisItem | null>(null);

  // Load available courses on mount
  useEffect(() => {
    async function loadCourseList() {
      try {
        const res = await fetch("/api/curriculum/xray");
        if (res.ok) {
          const data = await res.json();
          if (data.courses) {
            setCourses(data.courses);
            if (data.courses.length > 0) {
              setSelectedCourseId(data.courses[0].id);
            }
          }
        }
      } catch {
        // Course list unavailable; page continues with default course selection
      }
    }
    loadCourseList();
  }, []);

  // Run Curriculum X-Ray audit
  const runCurriculumAudit = useCallback(async (courseIdToRun?: string) => {
    const targetCourse = courseIdToRun || selectedCourseId;
    if (!targetCourse) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`/api/curriculum/xray?courseId=${encodeURIComponent(targetCourse)}`);
      if (!res.ok) {
        throw new Error(`Curriculum audit failed (HTTP ${res.status})`);
      }
      const data: CurriculumXRayReport = await res.json();
      setReport(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run Curriculum X-Ray.");
    } finally {
      setLoading(false);
    }
  }, [selectedCourseId]);

  // Initial audit run on first course
  useEffect(() => {
    if (selectedCourseId) {
      runCurriculumAudit(selectedCourseId);
    }
  }, [selectedCourseId, runCurriculumAudit]);

  const handleRecommendationUpdated = (updated: CurriculumRecommendation) => {
    if (!report) return;
    setReport({
      ...report,
      recommendations: report.recommendations.map((r) =>
        r.id === updated.id ? updated : r
      ),
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Curriculum X-Ray Engine"
        description="Transparent side-by-side gap audit comparing vocational training syllabi with industry labor demand to pinpoint missing, under-allocated, and obsolete competencies."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => runCurriculumAudit()}
              disabled={loading}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Re-Audit Syllabus
            </Button>
          </div>
        }
      />

      {/* Course Selector & Audit Trigger Banner */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3 flex-1">
            <div className="min-w-[280px] flex-1">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                Select Vocational Course Syllabus
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-slate-50/70 px-3.5 py-2 text-xs font-medium text-slate-800 focus:border-[#0f2744] focus:outline-hidden"
              >
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    [{c.code}] {c.name} ({c.district})
                  </option>
                ))}
              </select>
            </div>

            {report && (
              <div className="flex items-center gap-2 pt-4">
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5 text-slate-400" />
                  {report.course.district}
                </span>
                <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 uppercase">
                  {report.course.tradeSector.replace("_", " ")}
                </span>
              </div>
            )}
          </div>

          <Button
            size="sm"
            onClick={() => runCurriculumAudit()}
            disabled={loading}
            className="bg-[#0f2744] text-white hover:bg-[#1a3a60] h-9 px-4"
          >
            <ScanSearch className="h-4 w-4 mr-1.5" />
            Analyze Curriculum
          </Button>
        </div>

        {/* Selected Course Quick Stats Bar */}
        {report && (
          <div className="mt-4 pt-4 border-t border-slate-100 grid grid-cols-2 sm:grid-cols-5 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium">Training Center:</span>
              <div className="font-semibold text-slate-800 truncate">{report.course.trainingCenter}</div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Total Duration:</span>
              <div className="font-semibold text-slate-800">
                {report.course.totalHours} Hours ({report.course.durationMonths} Mos)
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Annual Enrollment:</span>
              <div className="font-semibold text-slate-800">
                {report.course.currentEnrollment} / {report.course.annualCapacity} Students
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Employer Relevance:</span>
              <div className="font-semibold text-amber-700 flex items-center gap-1">
                ★ {report.course.employerRelevanceRating} / 5.0
              </div>
            </div>
            <div>
              <span className="text-slate-400 font-medium">Placement Rate:</span>
              <div className="font-semibold text-emerald-700">
                {report.course.placementRatePct}% Placed
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Loading Skeleton */}
      {loading && (
        <div className="rounded-xl border border-slate-200 bg-white p-8 space-y-4">
          <div className="h-8 w-48 animate-pulse rounded-md bg-slate-100" />
          <div className="grid grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 animate-pulse rounded-xl bg-slate-100" />
            ))}
          </div>
          <div className="h-64 animate-pulse rounded-xl bg-slate-100" />
        </div>
      )}

      {/* Error Banner */}
      {error && (
        <div className="rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
          <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
          <div className="text-sm font-bold text-rose-900">{error}</div>
          <Button
            size="sm"
            variant="outline"
            onClick={() => runCurriculumAudit()}
            className="mt-3 border-rose-300 text-rose-700 hover:bg-rose-100"
          >
            Retry Audit
          </Button>
        </div>
      )}

      {/* Main Audit Report */}
      {!loading && !error && report && (
        <>
          {/* 4 Category KPI Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Critical Gaps */}
            <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-rose-700 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <Flame className="h-3.5 w-3.5 text-rose-600" />
                  Critical Gaps
                </span>
                <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
                  &gt;=50%
                </span>
              </div>
              <div className="text-2xl font-bold text-rose-900">
                {report.summary.criticalGapsCount}
              </div>
              <div className="text-[11px] text-rose-700/80 mt-1">
                Zero or near-zero coverage of high-demand skills
              </div>
            </div>

            {/* Major Gaps */}
            <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-amber-700 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                  Major Gaps
                </span>
                <span className="rounded-full bg-amber-100 px-1.5 py-0.5 text-[10px] font-bold text-amber-800">
                  30% - 50%
                </span>
              </div>
              <div className="text-2xl font-bold text-amber-900">
                {report.summary.majorGapsCount}
              </div>
              <div className="text-[11px] text-amber-700/80 mt-1">
                Substantial hours or proficiency deficit
              </div>
            </div>

            {/* Moderate Gaps */}
            <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-sky-700 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
                  Moderate Gaps
                </span>
                <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
                  15% - 30%
                </span>
              </div>
              <div className="text-2xl font-bold text-sky-900">
                {report.summary.moderateGapsCount}
              </div>
              <div className="text-[11px] text-sky-700/80 mt-1">
                Minor adjustments needed to align
              </div>
            </div>

            {/* Aligned Skills */}
            <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
              <div className="flex items-center justify-between text-emerald-700 mb-1">
                <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                  Aligned Skills
                </span>
                <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
                  &lt;15%
                </span>
              </div>
              <div className="text-2xl font-bold text-emerald-900">
                {report.summary.alignedSkillsCount}
              </div>
              <div className="text-[11px] text-emerald-700/80 mt-1">
                Syllabus matches industry benchmarks
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <h3 className="text-sm font-bold text-[#0f2744]">
                  Side-by-Side Curriculum vs Industry Requirement Matrix
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Direct mathematical gap computation across required competencies. Click &quot;Why is this a gap?&quot; for qualitative survey evidence.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-xs text-slate-500 font-medium">Overall Alignment Index:</span>
                <span className="rounded-md bg-slate-100 px-2 py-0.5 text-xs font-bold text-slate-800 font-mono">
                  {report.summary.overallCurriculumAlignmentIndex}%
                </span>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                  <tr>
                    <th className="px-6 py-3.5">Skill Competency</th>
                    <th className="px-4 py-3.5">Industry Requirement</th>
                    <th className="px-4 py-3.5">Curriculum Coverage</th>
                    <th className="px-4 py-3.5">Calculated Gap</th>
                    <th className="px-4 py-3.5">Category Classification</th>
                    <th className="px-4 py-3.5">Priority</th>
                    <th className="px-6 py-3.5 text-right">Audit Detail</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {report.skills.map((item) => (
                    <tr
                      key={item.skillSlug}
                      onClick={() => setInspectedGapItem(item)}
                      className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                    >
                      {/* Skill Name & Category */}
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                          {item.skillName}
                        </div>
                        <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                          {item.category.replace("_", " ")} • {item.allocatedHoursInSyllabus}h in syllabus
                        </div>
                      </td>

                      {/* Industry Requirement % */}
                      <td className="px-4 py-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-xs font-mono font-bold text-slate-800">
                            <span>{item.industryRequirementScore}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[#0f2744]"
                              style={{ width: `${item.industryRequirementScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Curriculum Coverage % */}
                      <td className="px-4 py-4">
                        <div className="w-24 space-y-1">
                          <div className="flex justify-between text-xs font-mono font-bold text-cyan-700">
                            <span>{item.curriculumCoverageScore}%</span>
                          </div>
                          <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-cyan-600"
                              style={{ width: `${item.curriculumCoverageScore}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Gap % */}
                      <td className="px-4 py-4 font-mono font-bold">
                        <span
                          className={
                            item.gapScore >= 50
                              ? "text-rose-700 text-sm"
                              : item.gapScore >= 30
                              ? "text-amber-700"
                              : item.gapScore >= 15
                              ? "text-sky-700"
                              : "text-emerald-700"
                          }
                        >
                          {item.gapScore}%
                        </span>
                      </td>

                      {/* Category Classification */}
                      <td className="px-4 py-4">
                        {item.categoryClassification === "CRITICAL GAP" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-[11px] font-bold text-rose-700 border border-rose-200">
                            <Flame className="h-3 w-3 text-rose-600" />
                            CRITICAL GAP
                          </span>
                        )}
                        {item.categoryClassification === "MAJOR GAP" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-700 border border-amber-200">
                            <AlertTriangle className="h-3 w-3 text-amber-600" />
                            MAJOR GAP
                          </span>
                        )}
                        {item.categoryClassification === "MODERATE GAP" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-0.5 text-[11px] font-bold text-sky-700 border border-sky-200">
                            <TrendingUp className="h-3 w-3 text-sky-600" />
                            MODERATE GAP
                          </span>
                        )}
                        {item.categoryClassification === "ALIGNED" && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-0.5 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-600" />
                            ALIGNED
                          </span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="px-4 py-4">
                        <span
                          className={`font-semibold uppercase text-[10px] ${
                            item.priority === "CRITICAL"
                              ? "text-rose-700"
                              : item.priority === "HIGH"
                              ? "text-amber-700"
                              : item.priority === "MEDIUM"
                              ? "text-sky-700"
                              : "text-slate-400"
                          }`}
                        >
                          {item.priority}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setInspectedGapItem(item);
                          }}
                          className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
                        >
                          <HelpCircle className="h-3.5 w-3.5 text-cyan-600" />
                          Why is this a gap?
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Section: Recommended Curriculum Changes & Human Review */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-[#0f2744]">
                  Recommended Curriculum Revisions & Module Additions
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Evidence-based syllabus change proposals generated by the X-Ray engine. Requires formal institutional review before adoption.
                </p>
              </div>

              <span className="text-xs text-slate-400 font-mono">
                {report.recommendations.length} actionable proposals
              </span>
            </div>

            <CurriculumRecommendations
              recommendations={report.recommendations}
              onRecommendationUpdated={handleRecommendationUpdated}
            />
          </div>
        </>
      )}

      {/* "Why is this a gap?" Audit Explanation Modal */}
      <GapExplanationModal
        item={inspectedGapItem}
        onClose={() => setInspectedGapItem(null)}
      />
    </div>
  );
}

export default function CurriculumXRayPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Curriculum X-Ray...</div>}>
      <CurriculumXRayContent />
    </Suspense>
  );
}
