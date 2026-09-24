"use client";

import React from "react";
import { CareerPathPhase } from "@/lib/candidate/types";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  BookOpen,
  Wrench,
  Award,
  Sparkles,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface VisualCareerRoadmapProps {
  phases: CareerPathPhase[];
  targetRoleTitle: string;
  currentSkillsCount: number;
}

export function VisualCareerRoadmap({
  phases,
  targetRoleTitle,
  currentSkillsCount,
}: VisualCareerRoadmapProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-xs space-y-5">
      {/* Title Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-blue-600" />
            Visual Career Path & Recommended Learning Sequence
          </h3>
          <p className="text-xs text-slate-500">
            Progressive 4-phase pedagogical pathway sequenced by industrial prerequisites
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-slate-500">Target Role:</span>
          <span className="font-bold text-blue-900 bg-blue-50 px-2.5 py-1 rounded-full border border-blue-200">
            {targetRoleTitle}
          </span>
        </div>
      </div>

      {/* Visual Roadmap Flow */}
      <div className="relative space-y-6 before:absolute before:left-5 before:top-4 before:bottom-4 before:w-0.5 before:bg-blue-200 pl-2">
        {/* Node 0: Current Baseline */}
        <div className="relative pl-10 group">
          <div className="absolute left-3 top-0.5 w-5 h-5 rounded-full bg-emerald-600 border-2 border-white shadow-xs flex items-center justify-center text-white">
            <CheckCircle2 className="h-3 w-3" />
          </div>

          <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/40 text-xs">
            <div className="flex items-center justify-between">
              <span className="font-bold text-emerald-950">Starting Point • Current Acquired Baseline</span>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                {currentSkillsCount} Competencies Validated
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 mt-0.5">
              Candidate brings foundational trade training and verified baseline competencies.
            </p>
          </div>
        </div>

        {/* Nodes 1 to 4: Phased Roadmap */}
        {phases.map((phase) => (
          <div key={phase.phaseNumber} className="relative pl-10 group">
            {/* Timeline node marker */}
            <div className="absolute left-3 top-0.5 w-5 h-5 rounded-full bg-blue-600 border-2 border-white shadow-xs flex items-center justify-center text-white text-[10px] font-bold">
              {phase.phaseNumber}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 bg-white hover:border-blue-300 transition-all shadow-2xs space-y-3">
              {/* Header */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-100">
                    Phase {phase.phaseNumber}
                  </span>
                  <h4 className="font-bold text-slate-900 text-xs sm:text-sm">{phase.phaseTitle}</h4>
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Clock className="h-3 w-3 text-slate-400" />
                    ~{phase.durationWeeks} Weeks
                  </span>
                  {phase.status === "in_progress" ? (
                    <Badge variant="warning">In Progress</Badge>
                  ) : (
                    <Badge variant="outline">Recommended Next</Badge>
                  )}
                </div>
              </div>

              {/* Skills targeted in this phase */}
              {phase.skillsCovered.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {phase.skillsCovered.map((skill) => (
                    <span
                      key={skill}
                      className="px-2.5 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 text-[11px] font-medium"
                    >
                      + {skill}
                    </span>
                  ))}
                </div>
              )}

              {/* Learning Objectives */}
              <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                {phase.learningObjectives.map((obj, i) => (
                  <li key={i}>{obj}</li>
                ))}
              </ul>

              {/* Course & Practical Project integrations */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs pt-1">
                {phase.recommendedCourse && (
                  <div className="p-2.5 rounded-lg border border-indigo-100 bg-indigo-50/40 flex items-start gap-2">
                    <BookOpen className="h-4 w-4 text-indigo-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-indigo-700 uppercase">
                        Recommended Vocational Course
                      </div>
                      <div className="font-semibold text-slate-900">
                        {phase.recommendedCourse.code} • {phase.recommendedCourse.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {phase.recommendedCourse.hours}h ({phase.recommendedCourse.practicalHoursRatio})
                      </div>
                    </div>
                  </div>
                )}

                {phase.practicalProject && (
                  <div className="p-2.5 rounded-lg border border-emerald-100 bg-emerald-50/40 flex items-start gap-2">
                    <Wrench className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <div className="text-[10px] font-bold text-emerald-700 uppercase">
                        Hands-On Practical Lab Project
                      </div>
                      <div className="font-semibold text-slate-900">
                        {phase.practicalProject.title}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        ~{phase.practicalProject.estimatedHours}h • {phase.practicalProject.toolsUsed.join(", ")}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Milestone Node: Target Occupational Role */}
        <div className="relative pl-10 group">
          <div className="absolute left-3 top-0.5 w-5 h-5 rounded-full bg-amber-500 border-2 border-white shadow-xs flex items-center justify-center text-white">
            <Award className="h-3 w-3" />
          </div>

          <div className="p-3.5 rounded-xl border border-amber-300 bg-amber-50/60 text-xs flex flex-wrap items-center justify-between gap-2 shadow-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-amber-950 flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-amber-700" />
                Target Milestone • {targetRoleTitle}
              </span>
              <p className="text-[11px] text-amber-800">
                Ready to submit verified practical project portfolio to regional hiring employers.
              </p>
            </div>

            <span className="text-[10px] px-2.5 py-1 rounded-full bg-amber-200/80 text-amber-900 font-bold">
              100% Competency Alignment Target
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
