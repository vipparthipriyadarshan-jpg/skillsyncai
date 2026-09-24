"use client";

import React from "react";
import { DimensionImpact } from "@/lib/simulator/types";
import { Calculator, ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

interface ImpactDimensionCardProps<T> {
  impact: DimensionImpact<T>;
  icon: React.ElementType;
  badgeLabel?: string;
  children?: React.ReactNode;
}

export function ImpactDimensionCard<T>({
  impact,
  icon: Icon,
  badgeLabel,
  children,
}: ImpactDimensionCardProps<T>) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-xs overflow-hidden">
      {/* Dimension Header */}
      <div className="p-4 border-b border-slate-100 flex flex-wrap items-center justify-between gap-2 bg-slate-50/50">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-lg bg-blue-50 text-blue-700 border border-blue-100">
            <Icon className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-900">{impact.dimensionName}</h3>
            {badgeLabel && <span className="text-[10px] text-slate-400 font-medium">{badgeLabel}</span>}
          </div>
        </div>

        {/* Delta Summary Pill */}
        <span
          className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold border shadow-2xs ${
            impact.deltaNumeric > 0
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : impact.deltaNumeric < 0
              ? "bg-rose-50 text-rose-800 border-rose-200"
              : "bg-slate-100 text-slate-700 border-slate-200"
          }`}
        >
          <Sparkles className="h-3 w-3" />
          {impact.deltaSummary}
        </span>
      </div>

      {/* 4 Required Simulation Elements Grid */}
      <div className="p-4 space-y-3.5 text-xs">
        {/* Row 1: Scenario Input & Calculation Logic */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Element 2: Scenario Input */}
          <div className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Scenario Lever Input
            </div>
            <div className="font-semibold text-slate-800 text-xs">{impact.scenarioInput}</div>
          </div>

          {/* Element 3: Calculation Logic */}
          <div className="p-2.5 rounded-lg border border-blue-200 bg-blue-50/40 space-y-1">
            <div className="text-[10px] font-bold uppercase tracking-wider text-blue-700 flex items-center gap-1">
              <Calculator className="h-3 w-3 text-blue-600" />
              Transparent Calculation Logic
            </div>
            <div className="font-mono text-[11px] text-slate-800">{impact.calculationLogic}</div>
          </div>
        </div>

        {/* Row 2: Baseline (Actual Data) vs Simulated Result */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
          {/* Element 1: Baseline (ACTUAL DATA) */}
          <div className="p-3 rounded-lg border-2 border-slate-200 bg-white relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700 border border-slate-300">
                ACTUAL DATA (BASELINE)
              </span>
              <ShieldCheck className="h-3.5 w-3.5 text-slate-400" />
            </div>
            <div className="text-[11px] text-slate-500">Observed real-world telemetry:</div>
            {/* If string or number, render directly */}
            {typeof impact.baseline === "object" && impact.baseline !== null ? (
              <div className="mt-1 font-semibold text-slate-800">
                {JSON.stringify(impact.baseline).slice(0, 70)}...
              </div>
            ) : (
              <div className="text-base font-bold text-slate-900 mt-1">{String(impact.baseline)}</div>
            )}
          </div>

          {/* Element 4: Resulting Changes (HYPOTHETICAL SIMULATION) */}
          <div className="p-3 rounded-lg border-2 border-blue-400 bg-blue-50/30 relative">
            <div className="flex items-center justify-between mb-1.5">
              <span className="text-[10px] font-extrabold uppercase tracking-wider px-2 py-0.5 rounded bg-blue-600 text-white shadow-2xs">
                HYPOTHETICAL SIMULATION
              </span>
              <span className="text-[10px] font-bold text-blue-700">Projected</span>
            </div>
            <div className="text-[11px] text-blue-700">Calculated policy outcome:</div>
            {typeof impact.simulatedValue === "object" && impact.simulatedValue !== null ? (
              <div className="mt-1 font-semibold text-blue-900">
                {JSON.stringify(impact.simulatedValue).slice(0, 70)}...
              </div>
            ) : (
              <div className="text-base font-bold text-blue-950 mt-1 flex items-center gap-2">
                <span>{String(impact.simulatedValue)}</span>
                <span className="text-xs text-slate-500 font-normal flex items-center gap-1">
                  <ArrowRight className="h-3 w-3" /> ({impact.deltaSummary})
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Custom granular breakdown (e.g. table or list) */}
        {children && <div className="pt-2 border-t border-slate-100">{children}</div>}
      </div>
    </div>
  );
}
