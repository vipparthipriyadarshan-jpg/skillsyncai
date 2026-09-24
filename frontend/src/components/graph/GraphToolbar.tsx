"use client";

import React from "react";
import {
  Search,
  Filter,
  Maximize2,
  RotateCcw,
  Sparkles,
  MapPin,
  Building2,
  GraduationCap,
  BookOpen,
  Users,
  Building,
  Briefcase,
  LucideIcon,
} from "lucide-react";
import { GraphNodeType, SkillGraphSummary } from "@/lib/graph/types";

interface GraphToolbarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedSector: string;
  onSectorChange: (sector: string) => void;
  selectedDistrict: string;
  onDistrictChange: (district: string) => void;
  activeNodeTypes: Set<GraphNodeType>;
  onToggleNodeType: (type: GraphNodeType) => void;
  onResetFilters: () => void;
  onFitView: () => void;
  summary: SkillGraphSummary | null;
  sectors: string[];
  districts: string[];
}

interface TypeButtonConfig {
  type: GraphNodeType;
  label: string;
  icon: LucideIcon;
  colorClass: string;
  activeBg: string;
}

const TYPE_BUTTONS: TypeButtonConfig[] = [
  { type: "district", label: "District", icon: MapPin, colorClass: "text-amber-600", activeBg: "bg-amber-100 dark:bg-amber-950/70 border-amber-300 dark:border-amber-700 text-amber-900 dark:text-amber-200" },
  { type: "training_center", label: "Center", icon: Building2, colorClass: "text-sky-600", activeBg: "bg-sky-100 dark:bg-sky-950/70 border-sky-300 dark:border-sky-700 text-sky-900 dark:text-sky-200" },
  { type: "course", label: "Course", icon: GraduationCap, colorClass: "text-blue-600", activeBg: "bg-blue-100 dark:bg-blue-950/70 border-blue-300 dark:border-blue-700 text-blue-900 dark:text-blue-200" },
  { type: "module", label: "Module", icon: BookOpen, colorClass: "text-slate-600", activeBg: "bg-slate-200 dark:bg-slate-800 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100" },
  { type: "trainer", label: "Trainer", icon: Users, colorClass: "text-emerald-600", activeBg: "bg-emerald-100 dark:bg-emerald-950/70 border-emerald-300 dark:border-emerald-700 text-emerald-900 dark:text-emerald-200" },
  { type: "employer", label: "Employer", icon: Building, colorClass: "text-rose-600", activeBg: "bg-rose-100 dark:bg-rose-950/70 border-rose-300 dark:border-rose-700 text-rose-900 dark:text-rose-200" },
  { type: "job_role", label: "Job Role", icon: Briefcase, colorClass: "text-purple-600", activeBg: "bg-purple-100 dark:bg-purple-950/70 border-purple-300 dark:border-purple-700 text-purple-900 dark:text-purple-200" },
  { type: "skill", label: "Skill", icon: Sparkles, colorClass: "text-indigo-600", activeBg: "bg-indigo-100 dark:bg-indigo-950/70 border-indigo-300 dark:border-indigo-700 text-indigo-900 dark:text-indigo-200" },
];

export const GraphToolbar: React.FC<GraphToolbarProps> = ({
  searchQuery,
  onSearchChange,
  selectedSector,
  onSectorChange,
  selectedDistrict,
  onDistrictChange,
  activeNodeTypes,
  onToggleNodeType,
  onResetFilters,
  onFitView,
  summary,
  sectors,
  districts,
}) => {
  return (
    <div className="border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md px-4 py-3 space-y-3 z-30 shadow-xs">
      {/* Top Row: Search, Dropdowns, and View Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[240px] max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search roles, skills, courses, employers..."
            className="w-full pl-9 pr-4 py-1.5 text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Sector & District Filters */}
        <div className="flex items-center gap-2">
          {/* Sector Selector */}
          <select
            value={selectedSector}
            onChange={(e) => onSectorChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Sectors</option>
            {sectors.map((sec) => (
              <option key={sec} value={sec}>
                {sec.replace("_", " ").toUpperCase()}
              </option>
            ))}
          </select>

          {/* District Selector */}
          <select
            value={selectedDistrict}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="text-xs px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Districts</option>
            {districts.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>

          {/* Fit View Button */}
          <button
            onClick={onFitView}
            title="Fit graph to canvas"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
          >
            <Maximize2 className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Fit View</span>
          </button>

          {/* Reset Filters */}
          <button
            onClick={onResetFilters}
            title="Reset filters and view"
            className="p-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Live Topology Stat Readout */}
        {summary && (
          <div className="hidden lg:flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 font-medium">
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">{summary.totalNodes}</strong> Nodes
            </span>
            <span className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800">
              <strong className="text-slate-900 dark:text-slate-100">{summary.totalEdges}</strong> Relational Edges
            </span>
          </div>
        )}
      </div>

      {/* Bottom Row: 8 Node Type Toggle Pills */}
      <div className="flex flex-wrap items-center gap-1.5 pt-1">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Entity Tiers:
        </span>

        {TYPE_BUTTONS.map((btn) => {
          const isActive = activeNodeTypes.has(btn.type);
          const Icon = btn.icon;
          const count = summary?.byNodeType[btn.type] || 0;

          return (
            <button
              key={btn.type}
              onClick={() => onToggleNodeType(btn.type)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs rounded-lg border transition-all ${
                isActive
                  ? `${btn.activeBg} font-semibold shadow-xs`
                  : "border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 text-slate-500 opacity-60 hover:opacity-90"
              }`}
            >
              <Icon className={`w-3 h-3 ${isActive ? btn.colorClass : "text-slate-400"}`} />
              <span>{btn.label}</span>
              <span className="ml-0.5 text-[10px] px-1 py-0.2 rounded-full bg-black/5 dark:bg-white/10 font-mono">
                {count}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
