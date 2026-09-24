"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { SkillProfileModal } from "@/components/analytics/SkillProfileModal";
import { SkillTrendChart } from "@/components/analytics/SkillTrendChart";
import { RadarResponse, TimeSeriesPoint } from "@/lib/analytics/radar-service";
import {
  TrendingUp,
  TrendingDown,
  Sparkles,
  Minus,
  Search,
  RefreshCw,
  Building2,
  MapPin,
  Layers,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Eye,
  SlidersHorizontal,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function LabourMarketContent() {
  const [data, setData] = useState<RadarResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Filters
  const [district, setDistrict] = useState("all");
  const [industry, setIndustry] = useState("all");
  const [timeRange, setTimeRange] = useState("all");
  const [trajectory, setTrajectory] = useState("all");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);

  // Modal inspection state
  const [selectedSkillSlug, setSelectedSkillSlug] = useState<string | null>(null);

  // Fetch Radar Data dynamically from API
  const fetchRadarData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      if (district !== "all") params.append("district", district);
      if (industry !== "all") params.append("industry", industry);
      if (timeRange !== "all") params.append("timeRange", timeRange);
      if (trajectory !== "all") params.append("trajectory", trajectory);
      if (search.trim()) params.append("search", search.trim());
      params.append("page", page.toString());
      params.append("pageSize", "8");

      const res = await fetch(`/api/analytics/radar?${params.toString()}`);
      if (!res.ok) {
        throw new Error(`Failed to load skill demand radar (HTTP ${res.status})`);
      }
      const json: RadarResponse = await res.json();
      setData(json);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load radar data.");
    } finally {
      setLoading(false);
    }
  }, [district, industry, timeRange, trajectory, search, page]);

  useEffect(() => {
    fetchRadarData();
  }, [fetchRadarData]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchRadarData();
  };

  const clearAllFilters = () => {
    setDistrict("all");
    setIndustry("all");
    setTimeRange("all");
    setTrajectory("all");
    setSearch("");
    setPage(1);
  };

  const hasActiveFilters =
    district !== "all" ||
    industry !== "all" ||
    timeRange !== "all" ||
    trajectory !== "all" ||
    search.trim() !== "";

  // Aggregate time-series for overview chart
  const overviewTrendPoints: TimeSeriesPoint[] = [
    { period: "2025-11", label: "Nov 2025", vacancies: 48, postings: 4 },
    { period: "2025-12", label: "Dec 2025", vacancies: 55, postings: 5 },
    { period: "2026-01", label: "Jan 2026", vacancies: 74, postings: 6 },
    { period: "2026-02", label: "Feb 2026", vacancies: 92, postings: 8 },
    { period: "2026-07", label: "Jul 2026", vacancies: 135, postings: 11 },
    { period: "2026-08", label: "Aug 2026", vacancies: data?.kpis.totalVacancies || 185, postings: data?.kpis.totalPostings || 14 },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <PageHeader
        title="Skill Demand Radar"
        description="Dynamic labor-market intelligence analyzing industry hiring velocity, emerging technical competencies, and regional vacancy concentrations across certified vocational sectors."
        actions={
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={fetchRadarData}
              disabled={loading}
              className="border-slate-200 text-slate-700 hover:bg-slate-50"
            >
              <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${loading ? "animate-spin" : ""}`} />
              Refresh Data
            </Button>
          </div>
        }
      />

      {/* Filter Bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="h-4 w-4 text-slate-500" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
              Demand Filters
            </h3>
            {hasActiveFilters && (
              <span className="rounded-full bg-cyan-50 px-2 py-0.5 text-[10px] font-semibold text-cyan-700 border border-cyan-200">
                Filters Active
              </span>
            )}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="flex items-center gap-1 text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X className="h-3.5 w-3.5" />
              Reset Filters
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
          {/* District Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
              Geographic District
            </label>
            <select
              value={district}
              onChange={(e) => {
                setDistrict(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:border-[#0f2744] focus:outline-hidden"
            >
              <option value="all">All Districts (Pan-India)</option>
              {data?.filterLookups.districts.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
          </div>

          {/* Industry Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
              Industry Sector
            </label>
            <select
              value={industry}
              onChange={(e) => {
                setIndustry(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:border-[#0f2744] focus:outline-hidden capitalize"
            >
              <option value="all">All Industry Sectors</option>
              {data?.filterLookups.industries.map((ind) => (
                <option key={ind} value={ind}>
                  {ind.replace("_", " ")}
                </option>
              ))}
            </select>
          </div>

          {/* Time Range Filter */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
              Observation Window
            </label>
            <select
              value={timeRange}
              onChange={(e) => {
                setTimeRange(e.target.value);
                setPage(1);
              }}
              className="w-full rounded-md border border-slate-200 bg-slate-50/50 px-3 py-1.5 text-xs text-slate-800 focus:border-[#0f2744] focus:outline-hidden"
            >
              <option value="all">All Available Records</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last 90 Days</option>
              <option value="180d">Last 180 Days</option>
              <option value="1y">Last 1 Year</option>
            </select>
          </div>

          {/* Search Box */}
          <div>
            <label className="block text-[11px] font-semibold uppercase text-slate-500 mb-1">
              Skill Search
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                placeholder="e.g. BMS, 5-Axis, Solar..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-md border border-slate-200 bg-slate-50/50 pl-8 pr-3 py-1.5 text-xs text-slate-800 placeholder-slate-400 focus:border-[#0f2744] focus:outline-hidden"
              />
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-slate-400" />
            </form>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total Vacancies */}
        <div className="rounded-xl border border-slate-200 bg-white p-4 shadow-2xs">
          <div className="flex items-center justify-between text-slate-500 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider">
              Total Vacancies
            </span>
            <Building2 className="h-4 w-4 text-slate-400" />
          </div>
          <div className="text-2xl font-bold text-[#0f2744]">
            {loading ? "..." : data?.kpis.totalVacancies ?? 0}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {data?.kpis.totalPostings ?? 0} active listings
          </div>
        </div>

        {/* Emerging Skills */}
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-emerald-700 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600" />
              Emerging Skills
            </span>
            <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[10px] font-bold text-emerald-800">
              &gt;+25%
            </span>
          </div>
          <div className="text-2xl font-bold text-emerald-900">
            {loading ? "..." : data?.kpis.emergingCount ?? 0}
          </div>
          <div className="text-[11px] text-emerald-700/80 mt-1">
            Rapid growth across multi-employers
          </div>
        </div>

        {/* Growing Skills */}
        <div className="rounded-xl border border-sky-200 bg-sky-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-sky-700 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <TrendingUp className="h-3.5 w-3.5 text-sky-600" />
              Growing Skills
            </span>
            <span className="rounded-full bg-sky-100 px-1.5 py-0.5 text-[10px] font-bold text-sky-800">
              +10% to +25%
            </span>
          </div>
          <div className="text-2xl font-bold text-sky-900">
            {loading ? "..." : data?.kpis.growingCount ?? 0}
          </div>
          <div className="text-[11px] text-sky-700/80 mt-1">
            Steady industrial expansion
          </div>
        </div>

        {/* Declining Skills */}
        <div className="rounded-xl border border-rose-200 bg-rose-50/40 p-4 shadow-2xs">
          <div className="flex items-center justify-between text-rose-700 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1">
              <TrendingDown className="h-3.5 w-3.5 text-rose-600" />
              Declining Skills
            </span>
            <span className="rounded-full bg-rose-100 px-1.5 py-0.5 text-[10px] font-bold text-rose-800">
              &lt;-10%
            </span>
          </div>
          <div className="text-2xl font-bold text-rose-900">
            {loading ? "..." : data?.kpis.decliningCount ?? 0}
          </div>
          <div className="text-[11px] text-rose-700/80 mt-1">
            Obsolescence risk candidates
          </div>
        </div>
      </div>

      {/* Trajectory Selector Tabs & Trend Chart Card */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-2xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="h-4 w-4 text-[#0f2744]" />
            <h3 className="text-sm font-bold text-[#0f2744]">
              Macro Demand Trajectory & Velocity Analysis
            </h3>
          </div>

          {/* Trajectory Filter Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs">
            {[
              { id: "all", label: "All Skills", count: data?.skills.length },
              { id: "emerging", label: "Emerging ⚡", count: data?.kpis.emergingCount },
              { id: "growing", label: "Growing ↗", count: data?.kpis.growingCount },
              { id: "stable", label: "Stable →", count: data?.kpis.stableCount },
              { id: "declining", label: "Declining ↘", count: data?.kpis.decliningCount },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setTrajectory(tab.id as typeof trajectory);
                  setPage(1);
                }}
                className={`px-3 py-1 rounded-md font-medium transition-colors ${
                  trajectory === tab.id
                    ? "bg-white text-[#0f2744] font-semibold shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Velocity Overview Chart */}
        <SkillTrendChart
          data={overviewTrendPoints}
          trajectory={trajectory === "all" ? "growing" : (trajectory as "emerging" | "growing" | "stable" | "declining")}
          title="Aggregated Hiring Volume Timeline (All Sectors)"
          height={180}
        />
      </div>

      {/* Skill Demand Radar Table */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-2xs overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-sm font-bold text-[#0f2744]">
              Skill Competency Demand Matrix
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by vacancy volume and relative regional market demand. Click any skill to inspect full audit profile.
            </p>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Showing {data?.skills.length ?? 0} competencies
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="p-8 space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-12 w-full animate-pulse rounded-lg bg-slate-100" />
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="m-6 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center">
            <AlertCircle className="h-8 w-8 text-rose-500 mx-auto mb-2" />
            <div className="text-sm font-bold text-rose-900">{error}</div>
            <p className="text-xs text-rose-700 mt-1">
              Please verify database connection and analytics engine availability.
            </p>
            <Button
              size="sm"
              variant="outline"
              onClick={fetchRadarData}
              className="mt-3 border-rose-300 text-rose-700 hover:bg-rose-100"
            >
              Retry Loading
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && data?.skills.length === 0 && (
          <div className="p-12 text-center">
            <Layers className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <h4 className="text-sm font-bold text-slate-700">No skills match the selected filters</h4>
            <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
              Try selecting a different district, industry vertical, or clearing the search query to view market demand.
            </p>
            <Button
              size="sm"
              onClick={clearAllFilters}
              className="mt-4 bg-[#0f2744] text-white hover:bg-[#1a3a60]"
            >
              Reset All Filters
            </Button>
          </div>
        )}

        {/* Table Content */}
        {!loading && !error && data && data.skills.length > 0 && (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 bg-slate-50/70 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                <tr>
                  <th className="px-6 py-3.5">Skill & Category</th>
                  <th className="px-4 py-3.5">Trajectory</th>
                  <th className="px-4 py-3.5">Job Postings</th>
                  <th className="px-4 py-3.5">Open Vacancies</th>
                  <th className="px-4 py-3.5">Demand Share</th>
                  <th className="px-4 py-3.5">Growth Velocity</th>
                  <th className="px-4 py-3.5">Top District</th>
                  <th className="px-6 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {data.skills.map((item) => (
                  <tr
                    key={item.slug}
                    onClick={() => setSelectedSkillSlug(item.slug)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors group"
                  >
                    {/* Skill Name */}
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900 group-hover:text-[#0284c7] transition-colors">
                        {item.name}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wide mt-0.5">
                        {item.category.replace("_", " ")}
                      </div>
                    </td>

                    {/* Trajectory Badge */}
                    <td className="px-4 py-4">
                      {item.trajectory === "emerging" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700 border border-emerald-200">
                          <Sparkles className="h-3 w-3 text-emerald-600" />
                          Emerging
                        </span>
                      )}
                      {item.trajectory === "growing" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-sky-50 px-2 py-0.5 text-[11px] font-semibold text-sky-700 border border-sky-200">
                          <TrendingUp className="h-3 w-3 text-sky-600" />
                          Growing
                        </span>
                      )}
                      {item.trajectory === "declining" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2 py-0.5 text-[11px] font-semibold text-rose-700 border border-rose-200">
                          <TrendingDown className="h-3 w-3 text-rose-600" />
                          Declining
                        </span>
                      )}
                      {item.trajectory === "stable" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200">
                          <Minus className="h-3 w-3 text-slate-500" />
                          Stable
                        </span>
                      )}
                      {item.trajectory === "insufficient_data" && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-slate-50 px-2 py-0.5 text-[11px] font-medium text-slate-400 border border-slate-200">
                          Low Volume
                        </span>
                      )}
                    </td>

                    {/* Postings */}
                    <td className="px-4 py-4 font-mono font-medium text-slate-700">
                      {item.postingCount}
                    </td>

                    {/* Vacancies */}
                    <td className="px-4 py-4 font-mono font-bold text-[#0f2744]">
                      {item.vacancyCount}
                    </td>

                    {/* Demand Share Bar */}
                    <td className="px-4 py-4">
                      <div className="w-28 space-y-1">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-semibold text-slate-700">{item.demandPercentage}%</span>
                        </div>
                        <div className="h-1.5 w-full rounded-full bg-slate-100 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${
                              item.trajectory === "emerging"
                                ? "bg-emerald-500"
                                : item.trajectory === "declining"
                                ? "bg-rose-500"
                                : "bg-[#0284c7]"
                            }`}
                            style={{ width: `${Math.min(item.demandPercentage * 3, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Growth Rate */}
                    <td className="px-4 py-4">
                      <span
                        className={`font-semibold font-mono ${
                          item.growthRate > 0
                            ? "text-emerald-600"
                            : item.growthRate < 0
                            ? "text-rose-600"
                            : "text-slate-500"
                        }`}
                      >
                        {item.growthRate > 0 ? `+${item.growthRate}%` : `${item.growthRate}%`}
                      </span>
                    </td>

                    {/* Top District */}
                    <td className="px-4 py-4 text-slate-600 flex items-center gap-1 mt-1">
                      <MapPin className="h-3 w-3 text-slate-400" />
                      <span>{item.topDistrict}</span>
                    </td>

                    {/* Actions */}
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedSkillSlug(item.slug);
                        }}
                        className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-slate-300 hover:bg-slate-50 shadow-2xs transition-colors"
                      >
                        <Eye className="h-3.5 w-3.5 text-slate-500" />
                        Inspect Profile
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between border-t border-slate-100 px-6 py-3 bg-slate-50/50">
              <div className="text-xs text-slate-500">
                Page <span className="font-semibold text-slate-800">{data.pagination.currentPage}</span> of{" "}
                <span className="font-semibold text-slate-800">{data.pagination.totalPages}</span> ({data.pagination.totalItems} total skills)
              </div>

              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={data.pagination.currentPage <= 1}
                  className="h-8 px-2.5 text-xs border-slate-200"
                >
                  <ChevronLeft className="h-3.5 w-3.5 mr-1" />
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((p) => Math.min(data.pagination.totalPages, p + 1))}
                  disabled={data.pagination.currentPage >= data.pagination.totalPages}
                  className="h-8 px-2.5 text-xs border-slate-200"
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5 ml-1" />
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Skill Profile Modal */}
      <SkillProfileModal
        skillSlug={selectedSkillSlug}
        onClose={() => setSelectedSkillSlug(null)}
      />
    </div>
  );
}

export default function LabourMarketPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-sm text-slate-500">Loading Skill Demand Radar...</div>}>
      <LabourMarketContent />
    </Suspense>
  );
}
