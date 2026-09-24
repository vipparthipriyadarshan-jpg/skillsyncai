"use client";

import React, { useState, useEffect, useCallback, Suspense } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { KpiCard } from "@/components/shared/KpiCard";
import { LoadingState } from "@/components/shared/LoadingState";
import { SimulationAssumptionsPanel } from "@/components/simulator/SimulationAssumptionsPanel";
import { ImpactDimensionCard } from "@/components/simulator/ImpactDimensionCard";
import { ScenarioComparisonTable } from "@/components/simulator/ScenarioComparisonTable";
import { SaveScenarioModal } from "@/components/simulator/SaveScenarioModal";
import {
  SimulatorScenarioInput,
  SimulationOutput,
  SavedScenario,
  ScenarioComparisonItem,
} from "@/lib/simulator/types";
import {
  Sliders,
  TrendingUp,
  GraduationCap,
  Users,
  Wrench,
  Brain,
  BookOpen,
  MapPin,
  BookmarkPlus,
  RotateCcw,
  CheckCircle2,
  TableProperties,
  Layers,
} from "lucide-react";
import { Button } from "@/components/ui/button";

function SimulatorContent() {
  // Scenario inputs
  const [sector, setSector] = useState<"automotive_ev" | "manufacturing_cnc" | "renewable_energy">("automotive_ev");
  const [demandChangePct, setDemandChangePct] = useState<number>(30); // Default to prompt's example: +30%
  const [districtScope, setDistrictScope] = useState<"all" | "Pune" | "Coimbatore" | "Ahmedabad">("all");

  // Active view tab
  const [activeTab, setActiveTab] = useState<"impact" | "comparison" | "library">("impact");

  // Simulation execution state
  const [simulationOutput, setSimulationOutput] = useState<SimulationOutput | null>(null);
  const [savedScenarios, setSavedScenarios] = useState<SavedScenario[]>([]);
  const [comparisonRows, setComparisonRows] = useState<ScenarioComparisonItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Modal & Toast
  const [isSaveModalOpen, setIsSaveModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Run simulation calculation
  const executeSimulation = useCallback(
    async (overrideInputs?: Partial<SimulatorScenarioInput>) => {
      setError(null);
      try {
        const payload: SimulatorScenarioInput = {
          sector: overrideInputs?.sector || sector,
          demandChangePct: overrideInputs?.demandChangePct !== undefined ? overrideInputs.demandChangePct : demandChangePct,
          districtScope: overrideInputs?.districtScope || districtScope,
        };

        const res = await fetch("/api/simulator", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (!res.ok) throw new Error("Simulation execution failed");
        const data = await res.json();
        setSimulationOutput(data.output);
      } catch (err: unknown) {
        setError(err instanceof Error ? err.message : "Calculation failed");
      } finally {
        setLoading(false);
      }
    },
    [sector, demandChangePct, districtScope]
  );

  // Load saved scenarios and comparisons
  const loadSavedScenarios = useCallback(async () => {
    try {
      const res = await fetch("/api/simulator");
      if (res.ok) {
        const data = await res.json();
        setSavedScenarios(data.savedScenarios || []);
        setComparisonRows(data.comparison || []);
      }
    } catch {
      // Scenario library unavailable; simulation runs without saved history
    }
  }, []);

  useEffect(() => {
    executeSimulation();
    loadSavedScenarios();
  }, [executeSimulation, loadSavedScenarios]);

  const handleApplyPreset = (pct: number) => {
    setDemandChangePct(pct);
    executeSimulation({ demandChangePct: pct });
  };

  const handleSaveSuccess = (newSaved: SavedScenario) => {
    setToastMessage(`Scenario "${newSaved.title}" saved to policy library.`);
    setTimeout(() => setToastMessage(null), 4000);
    loadSavedScenarios();
  };

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-lg bg-slate-900 text-white shadow-xl text-xs font-medium border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <CheckCircle2 className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Page Header */}
      <PageHeader
        title="What-If Workforce Simulator"
        description="Explore hypothetical changes in industrial demand (e.g. Electric Vehicles +30%) and calculate estimated impacts on required skills, courses, seats, trainers, equipment, districts, and employer hiring."
      />

      {/* Interactive Scenario Controls Card */}
      <div className="p-5 rounded-xl border border-blue-200 bg-white shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Sliders className="h-5 w-5 text-blue-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Hypothetical Scenario Levers
            </h3>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800">
              Exploratory Policy Simulation
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                setSector("automotive_ev");
                setDemandChangePct(30);
                setDistrictScope("all");
                executeSimulation({ sector: "automotive_ev", demandChangePct: 30, districtScope: "all" });
              }}
              className="text-xs h-8 text-slate-600 hover:text-slate-900 flex items-center gap-1"
            >
              <RotateCcw className="h-3 w-3" /> Reset to Prompt Benchmark (+30% EV)
            </Button>

            <Button
              type="button"
              size="sm"
              onClick={() => setIsSaveModalOpen(true)}
              disabled={!simulationOutput}
              className="text-xs bg-[#0f2744] hover:bg-[#1a3a60] text-white h-8 flex items-center gap-1 shadow-2xs"
            >
              <BookmarkPlus className="h-3.5 w-3.5" /> Save Policy Scenario
            </Button>
          </div>
        </div>

        {/* Inputs Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          {/* Lever 1: Sector */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              Industrial Sector
            </label>
            <select
              value={sector}
              onChange={(e) => {
                const s = e.target.value as "automotive_ev" | "manufacturing_cnc" | "renewable_energy";
                setSector(s);
                executeSimulation({ sector: s });
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-medium"
            >
              <option value="automotive_ev">Electric Vehicles & Clean Mobility</option>
              <option value="manufacturing_cnc">Precision Manufacturing & Multi-Axis CNC</option>
              <option value="renewable_energy">Renewable Energy & Solar Grid Systems</option>
            </select>
          </div>

          {/* Lever 2: Demand Change Slider & Presets */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="font-semibold text-slate-700">Hypothetical Demand Shift</label>
              <span
                className={`font-mono text-sm font-extrabold ${
                  demandChangePct > 0 ? "text-emerald-600" : demandChangePct < 0 ? "text-rose-600" : "text-slate-600"
                }`}
              >
                {demandChangePct > 0 ? `+${demandChangePct}%` : `${demandChangePct}%`}
              </span>
            </div>

            <input
              type="range"
              min="-50"
              max="100"
              step="5"
              value={demandChangePct}
              onChange={(e) => setDemandChangePct(parseInt(e.target.value, 10))}
              onMouseUp={() => executeSimulation()}
              onTouchEnd={() => executeSimulation()}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />

            {/* Quick Presets */}
            <div className="flex items-center gap-1.5 pt-1">
              <span className="text-[10px] text-slate-400">Presets:</span>
              {[
                { label: "-35%", val: -35 },
                { label: "+15%", val: 15 },
                { label: "+30% (Prompt)", val: 30 },
                { label: "+50%", val: 50 },
                { label: "+100%", val: 100 },
              ].map((p) => (
                <button
                  key={p.val}
                  type="button"
                  onClick={() => handleApplyPreset(p.val)}
                  className={`text-[10px] px-2 py-0.5 rounded border transition-colors ${
                    demandChangePct === p.val
                      ? "bg-blue-600 text-white border-blue-600 font-bold"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200 border-slate-200"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Lever 3: District Scope */}
          <div>
            <label className="block font-semibold text-slate-700 mb-1">
              District Focus Scope
            </label>
            <select
              value={districtScope}
              onChange={(e) => {
                const d = e.target.value as "all" | "Pune" | "Coimbatore" | "Ahmedabad";
                setDistrictScope(d);
                executeSimulation({ districtScope: d });
              }}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-xs text-slate-800 font-medium"
            >
              <option value="all">All Regional Clusters</option>
              <option value="Pune">Pune District (Automotive / EV Hub)</option>
              <option value="Coimbatore">Coimbatore District (Machinery / CNC)</option>
              <option value="Ahmedabad">Ahmedabad District (Solar / Renewables)</option>
            </select>
          </div>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab("impact")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-bold transition-all ${
            activeTab === "impact"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <Layers className="h-4 w-4" />
          7-Dimension Impact Projections
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("comparison")}
          className={`flex items-center gap-1.5 px-4 py-2.5 border-b-2 font-bold transition-all ${
            activeTab === "comparison"
              ? "border-blue-600 text-blue-700"
              : "border-transparent text-slate-500 hover:text-slate-800"
          }`}
        >
          <TableProperties className="h-4 w-4" />
          Side-by-Side Scenario Comparison
        </button>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <LoadingState message="Executing mathematical workforce policy simulation..." />
      ) : error ? (
        <div className="p-4 rounded-xl border border-rose-200 bg-rose-50 text-rose-800 text-xs">
          <strong>Simulation Error: </strong> {error}
        </div>
      ) : !simulationOutput ? null : activeTab === "comparison" ? (
        /* Scenario Comparison View */
        <ScenarioComparisonTable scenarios={savedScenarios} comparisonRows={comparisonRows} />
      ) : (
        /* 7-Dimension Impact Breakdown View */
        <div className="space-y-5">
          {/* Assumptions & Disclaimer Panel */}
          <SimulationAssumptionsPanel
            assumptions={simulationOutput.assumptions}
            sectorLabel={simulationOutput.sectorLabel}
          />

          {/* KPI High-Level Deltas Summary */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard
              title="Employer Demand Delta"
              value={`${simulationOutput.employerDemandImpact.deltaSummary}`}
              subtext="Projected open vacancies change"
              icon={TrendingUp}
              variant="accent"
            />
            <KpiCard
              title="Required Seats Delta"
              value={`${simulationOutput.seatsImpact.deltaSummary}`}
              subtext="Annual student intake shift"
              icon={GraduationCap}
            />
            <KpiCard
              title="Faculty Deficit"
              value={`${simulationOutput.trainersImpact.simulatedValue.trainerDeficit} Trainers`}
              subtext={`${simulationOutput.trainersImpact.simulatedValue.upskillingHoursRequired}h upskilling needed`}
              icon={Users}
              variant="warning"
            />
            <KpiCard
              title="Equipment Capex Deficit"
              value={`${simulationOutput.equipmentImpact.simulatedValue.formattedCapex}`}
              subtext={`${simulationOutput.equipmentImpact.simulatedValue.benchShortfall} additional lab benches`}
              icon={Wrench}
              variant="warning"
            />
          </div>

          {/* 7 Dimensions Cards Grid */}
          <div className="space-y-4">
            {/* 1. Employer Demand */}
            <ImpactDimensionCard
              impact={simulationOutput.employerDemandImpact}
              icon={TrendingUp}
              badgeLabel="Labor Market Shift"
            />

            {/* 2. Training Seats */}
            <ImpactDimensionCard
              impact={simulationOutput.seatsImpact}
              icon={GraduationCap}
              badgeLabel="Intake Capacity"
            />

            {/* 3. Trainers */}
            <ImpactDimensionCard
              impact={simulationOutput.trainersImpact}
              icon={Users}
              badgeLabel="Faculty Readiness"
            />

            {/* 4. Equipment */}
            <ImpactDimensionCard
              impact={simulationOutput.equipmentImpact}
              icon={Wrench}
              badgeLabel="Infrastructure & Capex"
            />

            {/* 5. Required Skills */}
            <ImpactDimensionCard
              impact={simulationOutput.skillsImpact}
              icon={Brain}
              badgeLabel="Skill Headcount Shift"
            >
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3">Competency</th>
                      <th className="py-2.5 px-3">Category</th>
                      <th className="py-2.5 px-3 text-right">Actual Baseline</th>
                      <th className="py-2.5 px-3 text-right">Hypothetical Simulation</th>
                      <th className="py-2.5 px-3 text-right">Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulationOutput.skillsImpact.simulatedValue.map((s) => (
                      <tr key={s.skillName} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-semibold text-slate-800">{s.skillName}</td>
                        <td className="py-2 px-3 text-slate-500 capitalize">{s.category.replace("_", " ")}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-700">{s.baselineDemand}</td>
                        <td className="py-2 px-3 text-right font-bold text-blue-900">{s.simulatedDemand}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600">
                          {s.delta > 0 ? `+${s.delta}` : s.delta} ({s.deltaPct > 0 ? `+${s.deltaPct}%` : `${s.deltaPct}%`})
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ImpactDimensionCard>

            {/* 6. Courses Impact */}
            <ImpactDimensionCard
              impact={simulationOutput.coursesImpact}
              icon={BookOpen}
              badgeLabel="Curriculum Syllabi"
            >
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3">Course Code</th>
                      <th className="py-2.5 px-3">Course Title</th>
                      <th className="py-2.5 px-3 text-right">Baseline Seats</th>
                      <th className="py-2.5 px-3 text-right">Simulated Seats</th>
                      <th className="py-2.5 px-3 text-right">Practical Hours Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulationOutput.coursesImpact.simulatedValue.map((c) => (
                      <tr key={c.courseCode} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-900">{c.courseCode}</td>
                        <td className="py-2 px-3 text-slate-700">{c.courseName}</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">{c.baselineAnnualIntake}</td>
                        <td className="py-2 px-3 text-right font-bold text-blue-900">{c.simulatedAnnualIntake}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600">
                          +{c.recommendedPracticalHoursDelta}h lab
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ImpactDimensionCard>

            {/* 7. Districts Impact */}
            <ImpactDimensionCard
              impact={simulationOutput.districtsImpact}
              icon={MapPin}
              badgeLabel="Geographical Slicing"
            >
              <div className="overflow-x-auto rounded-lg border border-slate-200 bg-white">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      <th className="py-2.5 px-3">Industrial District</th>
                      <th className="py-2.5 px-3 text-right">Absorption Share</th>
                      <th className="py-2.5 px-3 text-right">Baseline Vacancies</th>
                      <th className="py-2.5 px-3 text-right">Simulated Vacancies</th>
                      <th className="py-2.5 px-3 text-right">Vacancy Delta</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {simulationOutput.districtsImpact.simulatedValue.map((d) => (
                      <tr key={d.districtName} className="hover:bg-slate-50">
                        <td className="py-2 px-3 font-bold text-slate-800">{d.districtName}</td>
                        <td className="py-2 px-3 text-right text-slate-600">{d.regionalAbsorptionSharePct}%</td>
                        <td className="py-2 px-3 text-right font-medium text-slate-600">{d.baselineVacancies}</td>
                        <td className="py-2 px-3 text-right font-bold text-blue-900">{d.simulatedVacancies}</td>
                        <td className="py-2 px-3 text-right font-bold text-emerald-600">
                          {d.vacancyDelta > 0 ? `+${d.vacancyDelta}` : d.vacancyDelta}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ImpactDimensionCard>
          </div>
        </div>
      )}

      {/* Save Scenario Modal */}
      <SaveScenarioModal
        isOpen={isSaveModalOpen}
        onClose={() => setIsSaveModalOpen(false)}
        output={simulationOutput}
        onSuccess={handleSaveSuccess}
      />
    </div>
  );
}

export default function SimulatorPage() {
  return (
    <Suspense fallback={<LoadingState message="Loading What-If Simulator..." />}>
      <SimulatorContent />
    </Suspense>
  );
}
