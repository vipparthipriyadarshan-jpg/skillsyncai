"use client";

import React from "react";
import Link from "next/link";
import { PageHeader } from "@/components/shared/PageHeader";
import { Sliders, ScanSearch, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SkillGapsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Skill Gap Quantification Engine"
        description="Deterministic mathematical quantification of skill deficits across industrial trades, identifying high-risk obsolete areas and synthesizing cross-dimensional action recommendations."
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Card 1: Curriculum X-Ray */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
              <ScanSearch className="h-6 w-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">Curriculum X-Ray Audit</h3>
              <p className="text-xs text-slate-500">
                Detailed syllabus hours vs. industrial demand gap analysis
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Audit vocational courses (EV, CNC, Solar) against industry vacancies, quantify syllabus deficits ($0-100\%$), inspect the &quot;Why is this a gap?&quot; evidence panel, and review proposed hours.
          </p>
          <div className="pt-2">
            <Link href="/curriculum-xray">
              <Button size="sm" className="w-full flex items-center justify-center gap-1.5 bg-[#0f2744] hover:bg-[#1a3a60] text-white">
                Launch Curriculum X-Ray <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Card 2: Decision Engine */}
        <div className="p-6 rounded-xl border border-slate-200 bg-white shadow-xs space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-lg bg-emerald-50 text-emerald-700 border border-emerald-100">
              <Sliders className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">AI Decision Engine</h3>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                  10 Actions
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Action recommendations synthesized across 7 institutional inputs
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            Evaluates demand volume, curriculum gaps, employer validation, trainer readiness, equipment status, intake utilization, and placement outcomes into auditable proposals for human governance sign-off.
          </p>
          <div className="pt-2">
            <Link href="/decision-engine">
              <Button size="sm" className="w-full flex items-center justify-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white">
                Open Decision Engine <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Governance & Multi-Metric Vector Card */}
      <div className="p-5 rounded-xl border border-slate-200 bg-slate-50/70 space-y-3">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
          <ShieldCheck className="h-4 w-4 text-blue-600" />
          Mathematical Determinism & Human-in-the-Loop Safeguards
        </h4>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-600">
          <div className="p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-800 block mb-1">7 Synthesized Dimensions</strong>
            Demand growth, syllabus hours, employer consensus, faculty certifications, lab tools, intake fill, and placement ROI.
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-800 block mb-1">10 Action Archetypes</strong>
            Module additions, updates, practical labs, trainer upskilling, equipment procurement, capacity changes, and bridge paths.
          </div>
          <div className="p-3 rounded-lg bg-white border border-slate-200">
            <strong className="text-slate-800 block mb-1">Audit Trail & Governance</strong>
            AI generates proposals for human review. Status changes (approve, reject, modify) are permanently recorded in audit logs.
          </div>
        </div>
      </div>
    </div>
  );
}
