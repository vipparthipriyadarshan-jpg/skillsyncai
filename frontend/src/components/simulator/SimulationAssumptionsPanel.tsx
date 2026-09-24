"use client";

import React from "react";
import { SimulationAssumptions } from "@/lib/simulator/types";
import { Info, Calculator, Users, Wrench, Clock, ShieldAlert } from "lucide-react";

interface SimulationAssumptionsPanelProps {
  assumptions: SimulationAssumptions;
  sectorLabel: string;
}

export function SimulationAssumptionsPanel({
  assumptions,
  sectorLabel,
}: SimulationAssumptionsPanelProps) {
  const formatInr = (val: number) => {
    if (val >= 100000) return `₹${(val / 100000).toFixed(1)} Lakhs`;
    return `₹${val.toLocaleString("en-IN")}`;
  };

  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50/40 p-4 space-y-3 text-xs">
      {/* Banner / Disclaimer */}
      <div className="flex items-start gap-2.5 text-amber-900 border-b border-amber-200/80 pb-3">
        <ShieldAlert className="h-4 w-4 shrink-0 text-amber-600 mt-0.5" />
        <div className="space-y-0.5">
          <span className="font-bold uppercase tracking-wider text-[10px] text-amber-700">
            Policy Modeling Notice • Exploratory Simulation
          </span>
          <p className="text-[11px] text-amber-800 leading-relaxed">
            Simulated outcomes are mathematical policy projections for {sectorLabel} planning. They are <strong>never</strong> presented as guaranteed predictions or real-world facts.
          </p>
        </div>
      </div>

      {/* Assumptions Grid */}
      <div>
        <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-2 flex items-center gap-1">
          <Calculator className="h-3 w-3 text-slate-400" />
          Transparent Mathematical Assumptions & Planning Coefficients
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center">
          {/* 1. Trainee to Faculty Ratio */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Users className="h-3 w-3 text-blue-600" /> Trainee/Faculty
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {assumptions.studentToTrainerRatio}:1
            </div>
            <div className="text-[9px] text-slate-400">20 trainees / instructor</div>
          </div>

          {/* 2. Students per Bench Station */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Wrench className="h-3 w-3 text-indigo-600" /> Lab Bench Ratio
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {assumptions.studentsPerBench}:1
            </div>
            <div className="text-[9px] text-slate-400">4 trainees / workstation</div>
          </div>

          {/* 3. Bench Station Unit Capex */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Calculator className="h-3 w-3 text-emerald-600" /> Station Capex
            </div>
            <div className="text-xs font-bold text-emerald-700 mt-0.5">
              {formatInr(assumptions.benchUnitCostInr)}
            </div>
            <div className="text-[9px] text-slate-400">Unit procurement cost</div>
          </div>

          {/* 4. Faculty Enablement Cost */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Info className="h-3 w-3 text-amber-600" /> Faculty Upskilling
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {formatInr(assumptions.trainerUpskillingCostPerFacultyInr)}
            </div>
            <div className="text-[9px] text-slate-400">80h certification course</div>
          </div>

          {/* 5. Absorption Timeframe */}
          <div className="p-2 rounded-lg bg-white border border-slate-200 shadow-2xs">
            <div className="text-[10px] text-slate-500 font-medium flex items-center justify-center gap-1">
              <Clock className="h-3 w-3 text-purple-600" /> Hiring Lag
            </div>
            <div className="text-xs font-bold text-slate-900 mt-0.5">
              {assumptions.absorptionMonths} Months
            </div>
            <div className="text-[9px] text-slate-400">Industry onboarding buffer</div>
          </div>
        </div>
      </div>
    </div>
  );
}
