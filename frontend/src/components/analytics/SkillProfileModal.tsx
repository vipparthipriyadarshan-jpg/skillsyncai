"use client";

import React, { useEffect, useState } from "react";
import { SkillProfileDetail } from "@/lib/analytics/radar-service";
import { SkillTrendChart } from "./SkillTrendChart";
import {
  X,
  TrendingUp,
  TrendingDown,
  Minus,
  Sparkles,
  Building2,
  MapPin,
  Briefcase,
  Layers,
  ShieldCheck,
  Quote,
  Loader2,
  Calendar,
  IndianRupee,
} from "lucide-react";

interface SkillProfileModalProps {
  skillSlug: string | null;
  onClose: () => void;
}

export function SkillProfileModal({ skillSlug, onClose }: SkillProfileModalProps) {
  const [profile, setProfile] = useState<SkillProfileDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!skillSlug) {
      setProfile(null);
      return;
    }

    async function fetchProfile() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/analytics/radar?skillSlug=${encodeURIComponent(skillSlug!)}`);
        if (!res.ok) {
          throw new Error(`Failed to load profile for '${skillSlug}' (HTTP ${res.status})`);
        }
        const data = await res.json();
        setProfile(data);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Failed to load skill profile.");
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [skillSlug]);

  if (!skillSlug) return null;

  const getTrajectoryBadge = (trajectory: string, growthRate: number) => {
    switch (trajectory) {
      case "emerging":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 border border-emerald-200">
            <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
            Emerging (+{growthRate}%)
          </span>
        );
      case "growing":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-semibold text-sky-700 border border-sky-200">
            <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
            Growing (+{growthRate}%)
          </span>
        );
      case "declining":
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 border border-rose-200">
            <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
            Declining ({growthRate}%)
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 border border-slate-200">
            <Minus className="h-3.5 w-3.5 text-slate-500" />
            Stable ({growthRate}%)
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4 sm:p-6 overflow-y-auto">
      <div className="relative w-full max-w-4xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl border border-slate-200 flex flex-col">
        {/* Modal Header */}
        <div className="sticky top-0 z-20 flex items-center justify-between border-b border-slate-200 bg-white/95 px-6 py-4 backdrop-blur-xs">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Skill Profile & Evidence Audit
              </span>
              {profile && (
                <span className="rounded-sm bg-slate-100 px-2 py-0.5 text-[10px] font-medium text-slate-600 uppercase">
                  {profile.category.replace("_", " ")}
                </span>
              )}
            </div>
            <h2 className="text-xl font-bold text-[#0f2744]">
              {profile?.name || skillSlug}
            </h2>
          </div>

          <div className="flex items-center gap-3">
            {profile && getTrajectoryBadge(profile.trajectory, profile.growthRate)}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-6">
          {loading && (
            <div className="flex flex-col items-center justify-center py-20 text-slate-500">
              <Loader2 className="h-8 w-8 animate-spin text-[#0f2744] mb-3" />
              <p className="text-sm font-medium">Aggregating skill intelligence & evidence...</p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
              {error}
            </div>
          )}

          {profile && !loading && (
            <>
              {/* 1. Overview KPIs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="text-[11px] font-medium text-slate-500">Total Vacancy Demand</div>
                  <div className="text-2xl font-bold text-[#0f2744] mt-0.5">
                    {profile.totalVacancies}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Across {profile.totalPostings} active listings
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="text-[11px] font-medium text-slate-500">Market Demand Share</div>
                  <div className="text-2xl font-bold text-cyan-600 mt-0.5">
                    {profile.demandPercentage}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Of total regional vacancies
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="text-[11px] font-medium text-slate-500">Hiring Employers</div>
                  <div className="text-2xl font-bold text-slate-700 mt-0.5">
                    {profile.uniqueEmployers}
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Distinct verified companies
                  </div>
                </div>

                <div className="rounded-lg border border-slate-200 bg-slate-50/50 p-3.5">
                  <div className="text-[11px] font-medium text-slate-500">Evidence Grounding</div>
                  <div className="text-2xl font-bold text-emerald-600 mt-0.5">
                    {Math.round(profile.averageConfidence * 100)}%
                  </div>
                  <div className="text-[11px] text-slate-400 mt-0.5">
                    Verbatim source quote match
                  </div>
                </div>
              </div>

              {/* 2. Historical Velocity Trend Chart */}
              <div className="rounded-xl border border-slate-200 p-4 bg-slate-50/30">
                <SkillTrendChart
                  data={profile.trendHistory}
                  trajectory={profile.trajectory}
                  title="Demand Velocity Timeline"
                  height={160}
                />
              </div>

              {/* 3. Dimensional Slicing: Districts & Industries */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* District Distribution */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <MapPin className="h-3.5 w-3.5 text-slate-400" />
                    Demand by District
                  </div>
                  <div className="space-y-2.5">
                    {profile.districtBreakdown.map((d) => (
                      <div key={d.district} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700">{d.district}</span>
                          <span className="text-slate-500 font-mono">
                            {d.vacancies} vacancies ({d.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-[#0f2744]"
                            style={{ width: `${d.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Industry Distribution */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <Building2 className="h-3.5 w-3.5 text-slate-400" />
                    Demand by Industry Sector
                  </div>
                  <div className="space-y-2.5">
                    {profile.industryBreakdown.map((ind) => (
                      <div key={ind.industry} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="font-medium text-slate-700 capitalize">
                            {ind.industry.replace("_", " ")}
                          </span>
                          <span className="text-slate-500 font-mono">
                            {ind.vacancies} vacancies ({ind.percentage}%)
                          </span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className="h-full rounded-full bg-cyan-600"
                            style={{ width: `${ind.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 4. Occupational Roles & Proficiency Tiers */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Roles */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500 mb-3">
                    <Briefcase className="h-3.5 w-3.5 text-slate-400" />
                    Target Occupational Roles
                  </div>
                  <div className="space-y-2">
                    {profile.roleBreakdown.map((r) => (
                      <div
                        key={r.role}
                        className="flex items-center justify-between rounded-lg border border-slate-100 bg-slate-50 px-3 py-2 text-xs"
                      >
                        <span className="font-semibold text-slate-800">{r.role}</span>
                        <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-mono font-medium text-slate-600 border border-slate-200">
                          {r.vacancies} open slots
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Proficiency Distribution */}
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <Layers className="h-3.5 w-3.5 text-slate-400" />
                      Required Proficiency Breakdown
                    </div>
                    <span className="text-[11px] font-semibold uppercase text-cyan-700 bg-cyan-50 px-2 py-0.5 rounded-sm border border-cyan-200">
                      Dominant: {profile.proficiencyBreakdown.dominant}
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 pt-2">
                    {[
                      { tier: "Introductory", count: profile.proficiencyBreakdown.introductory },
                      { tier: "Intermediate", count: profile.proficiencyBreakdown.intermediate },
                      { tier: "Advanced", count: profile.proficiencyBreakdown.advanced },
                      { tier: "Expert", count: profile.proficiencyBreakdown.expert },
                    ].map((p) => (
                      <div
                        key={p.tier}
                        className="rounded-lg border border-slate-100 bg-slate-50/70 p-2 text-center"
                      >
                        <div className="text-[10px] font-medium text-slate-400 uppercase">
                          {p.tier}
                        </div>
                        <div className="text-base font-bold text-slate-800 mt-1">
                          {p.count}
                        </div>
                        <div className="text-[9px] text-slate-400">vacancies</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* 5. Co-occurring / Related Skills */}
              {profile.relatedSkills.length > 0 && (
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2.5">
                    Frequently Co-Demanded Skills
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {profile.relatedSkills.map((rs) => (
                      <span
                        key={rs.slug}
                        className="inline-flex items-center gap-1.5 rounded-full border border-slate-200 bg-white px-3 py-1 text-xs text-slate-700 shadow-2xs"
                      >
                        <span className="font-medium">{rs.name}</span>
                        <span className="rounded-full bg-slate-100 px-1.5 py-0.2 text-[10px] text-slate-500 font-mono">
                          +{rs.coOccurrenceCount}
                        </span>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* 6. Supporting Job Postings with Verbatim Evidence Quotes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-[#0f2744]">
                    Supporting Employer Job Listings & Verbatim Grounding
                  </h3>
                  <span className="text-xs text-slate-500 font-medium">
                    {profile.supportingJobPostings.length} verified listings
                  </span>
                </div>

                <div className="space-y-3">
                  {profile.supportingJobPostings.map((posting) => (
                    <div
                      key={posting.id}
                      className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs hover:border-slate-300 transition-colors"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">{posting.title}</h4>
                          <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-slate-600">
                            <span className="font-medium text-slate-800 flex items-center gap-1">
                              <Building2 className="h-3 w-3 text-slate-400" />
                              {posting.company}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <MapPin className="h-3 w-3 text-slate-400" />
                              {posting.district}
                            </span>
                            <span className="flex items-center gap-1 text-slate-500">
                              <Calendar className="h-3 w-3 text-slate-400" />
                              {posting.postedAt}
                            </span>
                            <span className="flex items-center gap-1 text-slate-700 font-medium">
                              <IndianRupee className="h-3 w-3 text-slate-400" />
                              {posting.salaryRange}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="rounded-md bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-700 font-mono">
                            {posting.vacancies} vacancies
                          </span>
                          <span className="inline-flex items-center gap-1 rounded-md bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                            <ShieldCheck className="h-3 w-3 text-emerald-600" />
                            {Math.round(posting.confidenceScore * 100)}% Grounded
                          </span>
                        </div>
                      </div>

                      {/* Verbatim Grounded Quote */}
                      <div className="mt-3 rounded-lg border border-amber-200/60 bg-amber-50/50 p-2.5 text-xs text-amber-950 flex items-start gap-2">
                        <Quote className="h-3.5 w-3.5 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-semibold text-amber-900">Extracted Evidence: </span>
                          <span className="italic font-serif">&ldquo;{posting.evidenceQuote}&rdquo;</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Modal Footer */}
        <div className="sticky bottom-0 z-20 flex items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-3">
          <span className="text-xs text-slate-500 font-medium">
            Evidence-based labor market intelligence • Zero stochastic numbers
          </span>
          <button
            onClick={onClose}
            className="rounded-lg bg-[#0f2744] px-4 py-1.5 text-xs font-semibold text-white hover:bg-[#1a3a60] transition-colors"
          >
            Close Profile
          </button>
        </div>
      </div>
    </div>
  );
}
