"use client";

import React from "react";
import { RoleSkillRequirement } from "@/lib/candidate/types";
import { CheckCircle2, AlertTriangle, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SkillGapBreakdownProps {
  currentSkills: string[];
  missingSkills: RoleSkillRequirement[];
  employerRequiredSkills: RoleSkillRequirement[];
}

export function SkillGapBreakdown({
  currentSkills,
  missingSkills,
  employerRequiredSkills,
}: SkillGapBreakdownProps) {
  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "critical":
        return <Badge variant="destructive" className="uppercase font-bold tracking-wider text-[9px]">Critical Priority</Badge>;
      case "high":
        return <Badge variant="warning" className="uppercase font-bold tracking-wider text-[9px]">High Priority</Badge>;
      case "medium":
      default:
        return <Badge variant="secondary" className="uppercase tracking-wider text-[9px]">Medium</Badge>;
    }
  };

  return (
    <div className="space-y-5 text-xs">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Column 1: Current Acquired Skills */}
        <div className="p-5 rounded-xl border border-emerald-200 bg-white shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Current Acquired Skills ({currentSkills.length})
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
              Verified Competencies
            </span>
          </div>

          {currentSkills.length === 0 ? (
            <div className="p-4 rounded-lg bg-slate-50 text-slate-500 text-center">
              No existing skills selected. Select your baseline skills above to assess.
            </div>
          ) : (
            <div className="space-y-2">
              {currentSkills.map((skill) => (
                <div
                  key={skill}
                  className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/30 flex items-center justify-between gap-2"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 shrink-0" />
                    <span className="font-semibold text-slate-800 text-xs">{skill}</span>
                  </div>
                  <span className="text-[10px] text-emerald-700 font-medium bg-white px-2 py-0.5 rounded border border-emerald-200">
                    Acquired
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Column 2: Missing Skills & Priorities */}
        <div className="p-5 rounded-xl border border-rose-200 bg-white shadow-xs space-y-3.5">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
            <h3 className="font-bold text-slate-900 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-rose-600" />
              Missing Skills & Learning Priorities ({missingSkills.length})
            </h3>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-100 text-rose-800 font-semibold">
              Actionable Gap
            </span>
          </div>

          {missingSkills.length === 0 ? (
            <div className="p-4 rounded-lg bg-emerald-50 text-emerald-800 text-center font-medium">
              Outstanding! You have acquired all core skills required for this occupational role.
            </div>
          ) : (
            <div className="space-y-2.5">
              {missingSkills.map((req) => (
                <div
                  key={req.skillName}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50/50 space-y-2 hover:border-slate-300 transition-colors"
                >
                  <div className="flex flex-wrap items-center justify-between gap-1.5">
                    <span className="font-bold text-slate-900 text-xs">{req.skillName}</span>
                    {getPriorityBadge(req.priority)}
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-[11px] text-slate-500">
                    <span>
                      Employer Demand: <strong className="text-slate-800">{req.employerDemandPct}%</strong>
                    </span>
                    <span>•</span>
                    <span>
                      Required Proficiency: <strong className="capitalize text-slate-800">{req.requiredProficiency}</strong>
                    </span>
                    <span>•</span>
                    <span className="capitalize text-slate-500">{req.category.replace("_", " ")}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Employer-Required Skills Reference Bar */}
      <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
            <Building2 className="h-4 w-4 text-blue-600" />
            Employer-Required Skills Benchmark ({employerRequiredSkills.length} Total Competencies)
          </h4>
          <span className="text-[10px] text-slate-500">
            Ranked by regional employer survey demand consensus
          </span>
        </div>

        <div className="flex flex-wrap gap-2 pt-1">
          {employerRequiredSkills.map((req) => {
            const isAcquired = currentSkills.some(
              (c) => c.toLowerCase().trim() === req.skillName.toLowerCase().trim()
            );
            return (
              <span
                key={req.skillName}
                className={`px-2.5 py-1 rounded-md text-[11px] border font-medium flex items-center gap-1.5 ${
                  isAcquired
                    ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                    : "bg-white text-slate-700 border-slate-200"
                }`}
              >
                <span>{isAcquired ? "✓" : "○"} {req.skillName}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 font-bold">
                  {req.employerDemandPct}% demand
                </span>
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
