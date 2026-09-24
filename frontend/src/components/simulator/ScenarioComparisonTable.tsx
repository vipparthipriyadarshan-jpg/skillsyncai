"use client";

import React from "react";
import { SavedScenario, ScenarioComparisonItem } from "@/lib/simulator/types";
import { Sliders, ShieldCheck } from "lucide-react";

interface ScenarioComparisonTableProps {
  scenarios: SavedScenario[];
  comparisonRows: ScenarioComparisonItem[];
}

export function ScenarioComparisonTable({
  scenarios,
  comparisonRows,
}: ScenarioComparisonTableProps) {
  if (scenarios.length === 0 || comparisonRows.length === 0) {
    return (
      <div className="p-8 text-center text-slate-500 text-xs border border-dashed rounded-xl bg-slate-50">
        No scenarios available for comparison. Run a simulation and click &quot;Save Policy Scenario&quot; to compare side-by-side.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header Banner */}
      <div className="flex flex-wrap items-center justify-between gap-2 p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-blue-600" />
          <span className="font-semibold text-slate-800">
            Side-by-Side Policy Comparison Matrix
          </span>
          <span className="text-slate-400">•</span>
          <span className="text-slate-500">
            Comparing <strong>Actual Baseline</strong> against <strong>{scenarios.length}</strong> exploratory scenarios
          </span>
        </div>

        <span className="text-[11px] text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200 font-medium">
          Mathematical Projections Only
        </span>
      </div>

      {/* Comparison Grid */}
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50 text-[11px] font-bold uppercase tracking-wider text-slate-500">
              <th className="py-3 px-4 w-1/4">Policy Metric / Dimension</th>
              {/* Baseline Column */}
              <th className="py-3 px-4 w-1/5 bg-slate-100/70 border-r border-slate-200 text-slate-900">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-slate-500" />
                  <span>ACTUAL DATA (BASELINE)</span>
                </div>
              </th>
              {/* Scenarios Columns */}
              {scenarios.map((scen) => (
                <th key={scen.id} className="py-3 px-4 text-blue-900 bg-blue-50/40 border-r border-slate-100">
                  <div className="font-extrabold text-xs">{scen.title}</div>
                  <div className="text-[10px] font-medium text-slate-500 lowercase">
                    {scen.output.sectorLabel} ({scen.demandChangePct > 0 ? "+" : ""}{scen.demandChangePct}%)
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {comparisonRows.map((row) => (
              <tr key={row.metricKey} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-3 px-4 font-semibold text-slate-800">
                  <div>{row.metricLabel}</div>
                  <span className="text-[10px] text-slate-400 font-normal">
                    {row.dimension} • {row.unit}
                  </span>
                </td>

                {/* Baseline actual cell */}
                <td className="py-3 px-4 font-bold text-slate-900 bg-slate-50/40 border-r border-slate-200">
                  {row.baselineActual}
                </td>

                {/* Simulated scenarios cells */}
                {scenarios.map((scen) => {
                  const val = row.scenarios[scen.id];
                  return (
                    <td key={scen.id} className="py-3 px-4 font-bold text-blue-950 border-r border-slate-100">
                      {val !== undefined ? String(val) : "—"}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
