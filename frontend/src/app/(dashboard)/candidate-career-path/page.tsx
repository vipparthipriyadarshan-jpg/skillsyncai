"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { VisualCareerRoadmap } from "@/components/candidate/VisualCareerRoadmap";
import { SkillGapBreakdown } from "@/components/candidate/SkillGapBreakdown";
import {
  TargetRole,
  CandidateProfile,
  CandidateCareerPathAssessment,
} from "@/lib/candidate/types";
import {
  Compass,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Wrench,
  Clock,
  ShieldAlert,
  UserCheck,
  Building2,
  Sparkles,
} from "lucide-react";

function CandidateCareerPathContent() {
  const [targetRoles, setTargetRoles] = useState<TargetRole[]>([]);
  const [presetCandidates, setPresetCandidates] = useState<CandidateProfile[]>([]);
  const [selectedRoleId, setSelectedRoleId] = useState<string>("role-ev-tech");
  const [selectedCandidateId, setSelectedCandidateId] = useState<string>("cand-rohan");
  const [customCurrentSkills, setCustomCurrentSkills] = useState<string[]>([]);
  const [assessment, setAssessment] = useState<CandidateCareerPathAssessment | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load target roles and presets
  const loadRolesAndPresets = useCallback(async () => {
    try {
      const res = await fetch("/api/candidate-career-path");
      if (!res.ok) throw new Error("Failed to load career path roles");
      const data = await res.json();
      setTargetRoles(data.targetRoles || []);
      setPresetCandidates(data.presetCandidates || []);
      if (data.presetCandidates && data.presetCandidates.length > 0) {
        setCustomCurrentSkills(data.presetCandidates[0].currentSkills);
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Network error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadRolesAndPresets();
  }, [loadRolesAndPresets]);

  // Evaluate assessment whenever role or current skills change
  const runAssessment = useCallback(async () => {
    if (!selectedRoleId) return;
    try {
      const candidateProfile: CandidateProfile = {
        id: selectedCandidateId,
        name: presetCandidates.find((c) => c.id === selectedCandidateId)?.name || "Job Seeker",
        currentTrade: presetCandidates.find((c) => c.id === selectedCandidateId)?.currentTrade || "Vocational Trainee",
        currentSkills: customCurrentSkills,
        experienceYears: 1,
      };

      const res = await fetch("/api/candidate-career-path", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          candidate: candidateProfile,
          targetRoleId: selectedRoleId,
        }),
      });

      if (!res.ok) throw new Error("Failed to evaluate career path");
      const data = await res.json();
      setAssessment(data.assessment);
    } catch {
      // Assessment failed silently; UI continues to display prior state
    }
  }, [selectedRoleId, selectedCandidateId, customCurrentSkills, presetCandidates]);

  useEffect(() => {
    runAssessment();
  }, [runAssessment]);

  // Handle switching preset candidates
  const handleCandidateChange = (candId: string) => {
    setSelectedCandidateId(candId);
    const cand = presetCandidates.find((c) => c.id === candId);
    if (cand) {
      setCustomCurrentSkills(cand.currentSkills);
    }
  };

  // Toggle skills in custom selection
  const toggleSkill = (skill: string) => {
    setCustomCurrentSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const activeRole = targetRoles.find((r) => r.id === selectedRoleId) || targetRoles[0];

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title="Candidate Career Pathways & Skill Roadmap"
        description="Personalized, evidence-based skill gap assessment for job seekers, comparing existing competencies against target industrial roles to construct a structured bridge-learning roadmap."
      />

      {/* Mandatory Disclaimer Safeguard */}
      <div className="p-4 rounded-xl border border-amber-300 bg-amber-50/80 text-xs flex items-start gap-3 text-amber-900 shadow-2xs">
        <ShieldAlert className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-0.5">
          <div className="font-extrabold uppercase tracking-wider text-[11px] text-amber-800">
            Important Educational Disclaimer • No Employment or Salary Guarantee
          </div>
          <p className="leading-relaxed text-amber-900">
            Recommendations and pathway milestones are educational guideposts derived from platform job vacancy telemetry and employer validation evidence. <strong>Skill Sync AI does NOT guarantee employment, job offers, or specific compensation levels.</strong> Hiring decisions remain at the sole discretion of industrial employers.
          </p>
        </div>
      </div>

      {/* Selector Controls Card */}
      <div className="p-5 rounded-xl border border-blue-200 bg-white shadow-xs space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          {/* Target Role Selector */}
          <div>
            <label htmlFor="target-role-select" className="block font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-blue-600" />
              Select Target Occupational Role
            </label>
            <select
              id="target-role-select"
              value={selectedRoleId}
              onChange={(e) => setSelectedRoleId(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs font-bold text-slate-900 shadow-2xs"
            >
              {targetRoles.map((role) => (
                <option key={role.id} value={role.id}>
                  {role.title} ({role.district} • {role.openVacancies} vacancies)
                </option>
              ))}
            </select>
            {activeRole && (
              <p className="text-[11px] text-slate-500 mt-1.5 leading-relaxed">
                {activeRole.description} • <em>{activeRole.benchmarkSalaryBand}</em>
              </p>
            )}
          </div>

          {/* Candidate Persona Preset Switcher */}
          <div>
            <label htmlFor="candidate-preset-select" className="block font-semibold text-slate-800 mb-1.5 flex items-center gap-1.5">
              <UserCheck className="h-4 w-4 text-emerald-600" />
              Candidate Persona Baseline
            </label>
            <select
              id="candidate-preset-select"
              value={selectedCandidateId}
              onChange={(e) => handleCandidateChange(e.target.value)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-medium shadow-2xs"
            >
              {presetCandidates.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name} — {c.currentTrade} ({c.currentSkills.length} skills)
                </option>
              ))}
            </select>
            <p className="text-[11px] text-slate-500 mt-1.5">
              Toggle specific acquired skills below to simulate personalized candidate backgrounds in real time.
            </p>
          </div>
        </div>

        {/* Skill Toggle Checklist */}
        {activeRole && (
          <div className="pt-3 border-t border-slate-100 space-y-2 text-xs">
            <span className="font-semibold text-slate-700 block">
              Customize Candidate Acquired Skills for {activeRole.title}:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activeRole.requiredSkills.map((req) => {
                const isSelected = customCurrentSkills.some(
                  (s) => s.toLowerCase().trim() === req.skillName.toLowerCase().trim()
                );
                return (
                  <button
                    key={req.skillName}
                    type="button"
                    onClick={() => toggleSkill(req.skillName)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      isSelected
                        ? "bg-emerald-600 text-white shadow-xs"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 border border-slate-200"
                    }`}
                  >
                    {isSelected ? "✓ Acquired: " : "+ Missing: "} {req.skillName}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Evaluating candidate competencies against target industrial requirements..." />
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
          <strong>Failed to load assessment: </strong> {error}
        </div>
      ) : !assessment ? null : (
        <div className="space-y-6">
          {/* KPI Summary Cards */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Role Match Readiness"
              value={`${assessment.matchScorePct}%`}
              subtext={`${assessment.currentSkills.length} of ${assessment.employerRequiredSkills.length} skills acquired`}
              icon={Sparkles}
              variant={assessment.matchScorePct >= 70 ? "accent" : "warning"}
            />
            <KpiCard
              title="Acquired Skills"
              value={assessment.currentSkills.length}
              subtext="Verified baseline competencies"
              icon={CheckCircle2}
            />
            <KpiCard
              title="Missing Skill Gaps"
              value={assessment.missingSkills.length}
              subtext={`${assessment.missingSkills.filter((s) => s.priority === "critical").length} critical priorities`}
              icon={AlertTriangle}
              variant="warning"
            />
            <KpiCard
              title="Projected Timeline"
              value="~14 Weeks"
              subtext="4-Phase progressive learning path"
              icon={Clock}
            />
          </div>

          {/* Visual Career Path Roadmap Component */}
          <VisualCareerRoadmap
            phases={assessment.phasedRoadmap}
            targetRoleTitle={assessment.targetRole.title}
            currentSkillsCount={assessment.currentSkills.length}
          />

          {/* Skill Gap Breakdown: Current vs Missing with Priorities */}
          <SkillGapBreakdown
            currentSkills={assessment.currentSkills}
            missingSkills={assessment.missingSkills}
            employerRequiredSkills={assessment.employerRequiredSkills}
          />

          {/* Relevant Courses & Recommended Practical Projects */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 text-xs">
            {/* Relevant Courses */}
            <div className="p-5 rounded-xl border border-indigo-200 bg-white shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-indigo-600" />
                  Relevant Registered Courses ({assessment.relevantCourses.length})
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 font-semibold">
                  Curriculum Catalog
                </span>
              </div>

              <div className="space-y-3">
                {assessment.relevantCourses.map((c) => (
                  <div
                    key={c.code}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">
                        {c.code} • {c.name}
                      </span>
                      <span className="text-[11px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded border border-indigo-200">
                        {c.hours} Hours
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 flex items-center gap-1.5">
                      <Building2 className="h-3 w-3 text-slate-400" />
                      <span>{c.provider}</span>
                    </div>
                    <div className="text-[10px] text-slate-500 font-medium">
                      Pedagogy: {c.practicalHoursRatio}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Practical Lab Projects */}
            <div className="p-5 rounded-xl border border-emerald-200 bg-white shadow-xs space-y-3.5">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <h3 className="font-bold text-slate-900 flex items-center gap-2">
                  <Wrench className="h-4 w-4 text-emerald-600" />
                  Recommended Practical Projects ({assessment.recommendedProjects.length})
                </h3>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                  Hands-On Evidence
                </span>
              </div>

              <div className="space-y-3">
                {assessment.recommendedProjects.map((p) => (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1.5"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-900 text-xs">{p.title}</span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        ~{p.estimatedHours}h Lab Work
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{p.description}</p>
                    <div className="text-[10px] text-slate-500">
                      <strong>Tools Used:</strong> {p.toolsUsed.join(", ")}
                    </div>
                    <div className="text-[10px] text-emerald-800 italic bg-white p-1.5 rounded border border-emerald-100">
                      Citation: {p.industryContext}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function CandidateCareerPathPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading Candidate Career Pathways..." />}>
      <CandidateCareerPathContent />
    </Suspense>
  );
}
