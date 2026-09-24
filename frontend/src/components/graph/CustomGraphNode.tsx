"use client";

import React, { memo } from "react";
import { Handle, Position, NodeProps } from "reactflow";
import {
  Briefcase,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  MapPin,
  Building,
  LucideIcon,
} from "lucide-react";
import { GraphNodeData, GraphNodeType } from "@/lib/graph/types";

interface NodeTheme {
  icon: LucideIcon;
  badge: string;
  badgeBg: string;
  badgeText: string;
  borderColor: string;
  headerBg: string;
  accentBg: string;
}

const THEMES: Record<GraphNodeType, NodeTheme> = {
  district: {
    icon: MapPin,
    badge: "DISTRICT",
    badgeBg: "bg-amber-100 dark:bg-amber-950/60",
    badgeText: "text-amber-800 dark:text-amber-300",
    borderColor: "border-amber-300 dark:border-amber-700/60",
    headerBg: "bg-amber-50/80 dark:bg-amber-950/30",
    accentBg: "bg-amber-500",
  },
  training_center: {
    icon: Building2,
    badge: "CENTER",
    badgeBg: "bg-sky-100 dark:bg-sky-950/60",
    badgeText: "text-sky-800 dark:text-sky-300",
    borderColor: "border-sky-300 dark:border-sky-700/60",
    headerBg: "bg-sky-50/80 dark:bg-sky-950/30",
    accentBg: "bg-sky-500",
  },
  course: {
    icon: GraduationCap,
    badge: "COURSE",
    badgeBg: "bg-blue-100 dark:bg-blue-950/60",
    badgeText: "text-blue-800 dark:text-blue-300",
    borderColor: "border-blue-300 dark:border-blue-700/60",
    headerBg: "bg-blue-50/80 dark:bg-blue-950/30",
    accentBg: "bg-blue-600",
  },
  module: {
    icon: BookOpen,
    badge: "MODULE",
    badgeBg: "bg-slate-100 dark:bg-slate-800",
    badgeText: "text-slate-800 dark:text-slate-300",
    borderColor: "border-slate-300 dark:border-slate-700",
    headerBg: "bg-slate-50/80 dark:bg-slate-900/40",
    accentBg: "bg-slate-500",
  },
  trainer: {
    icon: Users,
    badge: "TRAINER",
    badgeBg: "bg-emerald-100 dark:bg-emerald-950/60",
    badgeText: "text-emerald-800 dark:text-emerald-300",
    borderColor: "border-emerald-300 dark:border-emerald-700/60",
    headerBg: "bg-emerald-50/80 dark:bg-emerald-950/30",
    accentBg: "bg-emerald-500",
  },
  employer: {
    icon: Building,
    badge: "EMPLOYER",
    badgeBg: "bg-rose-100 dark:bg-rose-950/60",
    badgeText: "text-rose-800 dark:text-rose-300",
    borderColor: "border-rose-300 dark:border-rose-700/60",
    headerBg: "bg-rose-50/80 dark:bg-rose-950/30",
    accentBg: "bg-rose-500",
  },
  job_role: {
    icon: Briefcase,
    badge: "JOB ROLE",
    badgeBg: "bg-purple-100 dark:bg-purple-950/60",
    badgeText: "text-purple-800 dark:text-purple-300",
    borderColor: "border-purple-300 dark:border-purple-700/60",
    headerBg: "bg-purple-50/80 dark:bg-purple-950/30",
    accentBg: "bg-purple-600",
  },
  skill: {
    icon: Sparkles,
    badge: "SKILL",
    badgeBg: "bg-indigo-100 dark:bg-indigo-950/60",
    badgeText: "text-indigo-800 dark:text-indigo-300",
    borderColor: "border-indigo-400 dark:border-indigo-600",
    headerBg: "bg-indigo-50/80 dark:bg-indigo-950/40",
    accentBg: "bg-indigo-600",
  },
};

export const CustomGraphNode = memo(({ data, selected }: NodeProps<GraphNodeData>) => {
  const theme = THEMES[data.nodeType] || THEMES.skill;
  const IconComponent = theme.icon;

  const isMatched = Boolean(data.matched);
  const isDimmed = Boolean(data.isDimmed);

  return (
    <div
      className={`relative min-w-[220px] max-w-[280px] rounded-xl border bg-white dark:bg-slate-900 shadow-md transition-all duration-200 ${
        theme.borderColor
      } ${
        selected
          ? "ring-2 ring-blue-500 shadow-xl scale-[1.03] z-30"
          : isMatched
          ? "ring-2 ring-amber-400 shadow-lg scale-[1.02] z-20"
          : "hover:shadow-lg hover:border-slate-400 dark:hover:border-slate-500"
      } ${isDimmed ? "opacity-35 grayscale-[50%]" : "opacity-100"}`}
    >
      {/* React Flow Handles for dynamic connecting edges */}
      <Handle
        type="target"
        position={Position.Left}
        className="!w-3 !h-3 !bg-slate-400 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-900"
      />
      <Handle
        type="source"
        position={Position.Right}
        className="!w-3 !h-3 !bg-slate-400 dark:!bg-slate-600 !border-2 !border-white dark:!border-slate-900"
      />

      {/* Top Accent Strip */}
      <div className={`h-1.5 w-full rounded-t-xl ${theme.accentBg}`} />

      {/* Node Header */}
      <div className={`flex items-center justify-between px-3 py-2 border-b border-slate-100 dark:border-slate-800 ${theme.headerBg}`}>
        <div className="flex items-center gap-2 overflow-hidden">
          <div className="p-1 rounded-md bg-white dark:bg-slate-800 shadow-xs border border-slate-200 dark:border-slate-700">
            <IconComponent className="w-3.5 h-3.5 text-slate-700 dark:text-slate-300" />
          </div>
          <span className={`text-[10px] font-bold tracking-wider px-1.5 py-0.5 rounded ${theme.badgeBg} ${theme.badgeText}`}>
            {theme.badge}
          </span>
        </div>

        {data.metrics?.isEmerging && (
          <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-800">
            Emerging
          </span>
        )}
      </div>

      {/* Node Body */}
      <div className="p-3">
        <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-snug line-clamp-2" title={data.label}>
          {data.label}
        </h4>

        {data.sublabel && (
          <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
            {data.sublabel}
          </p>
        )}

        {/* Quick Micro Metrics */}
        <div className="mt-2.5 flex flex-wrap items-center gap-1.5 text-[10px]">
          {data.metrics?.vacancies !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 font-medium border border-purple-200 dark:border-purple-800">
              {data.metrics.vacancies} open roles
            </span>
          )}
          {data.metrics?.durationHours !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 font-medium border border-blue-200 dark:border-blue-800">
              {data.metrics.durationHours} hrs
            </span>
          )}
          {data.metrics?.activeStudents !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/40 text-sky-700 dark:text-sky-300 font-medium border border-sky-200 dark:border-sky-800">
              {data.metrics.activeStudents} students
            </span>
          )}
          {data.metrics?.experienceYears !== undefined && (
            <span className="px-1.5 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-medium border border-emerald-200 dark:border-emerald-800">
              {data.metrics.experienceYears}y exp
            </span>
          )}
          {data.district && data.nodeType !== "district" && (
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 font-medium">
              📍 {data.district}
            </span>
          )}
        </div>
      </div>
    </div>
  );
});

CustomGraphNode.displayName = "CustomGraphNode";
