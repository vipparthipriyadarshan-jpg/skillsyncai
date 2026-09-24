"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wrench, CheckCircle2, AlertTriangle, AlertCircle, Trash2 } from "lucide-react";
import Link from "next/link";

interface EquipmentData {
  name: string;
  centerCode: string;
  centerName: string;
  sector: string;
  quantityTotal: number;
  quantityOperational: number;
  conditionRating: "new_commissioned" | "operational_good" | "needs_maintenance" | "non_operational" | "obsolete";
  criticalNotice?: string;
}

const DEMO_EQUIPMENT: EquipmentData[] = [
  {
    name: "Automated EV Lithium Battery Pack Cycler 400V 60A",
    centerCode: "ITI-MH-PUN-01",
    centerName: "Government ITI Aundh (Pune)",
    sector: "automotive_ev",
    quantityTotal: 3,
    quantityOperational: 2,
    conditionRating: "operational_good",
  },
  {
    name: "Vector CANoe CAN Bus Protocol Analyzer Bench",
    centerCode: "ITI-MH-PUN-01",
    centerName: "Government ITI Aundh (Pune)",
    sector: "automotive_ev",
    quantityTotal: 4,
    quantityOperational: 1,
    conditionRating: "needs_maintenance",
    criticalNotice: "3 units damaged OBD-II interface cables; practical bus troubleshooting bottleneck",
  },
  {
    name: "Jyoti 3-Axis CNC Vertical Machining Center VMC 430",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    quantityTotal: 4,
    quantityOperational: 4,
    conditionRating: "operational_good",
  },
  {
    name: "DMG Mori 5-Axis Universal Machining Center",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    quantityTotal: 1,
    quantityOperational: 0,
    conditionRating: "non_operational",
    criticalNotice: "Spindle bearing failure awaiting imported replacement; halting 5-axis runs",
  },
  {
    name: "KUKA 6-Axis Articulated Industrial Robot Cybertech",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    quantityTotal: 2,
    quantityOperational: 1,
    conditionRating: "needs_maintenance",
    criticalNotice: "Robot arm 2 requires teach pendant touch screen replacement",
  },
  {
    name: "Solar Array I-V Curve Tracer & DC Combiner Test Bench",
    centerCode: "GSTA-GJ-AHM-02",
    centerName: "Gujarat Skill Training Academy Ahmedabad",
    sector: "renewable_energy",
    quantityTotal: 3,
    quantityOperational: 3,
    conditionRating: "operational_good",
  },
  {
    name: "Schneider Smart Grid-Tie Inverter Synchronization Skid",
    centerCode: "GSTA-GJ-AHM-02",
    centerName: "Gujarat Skill Training Academy Ahmedabad",
    sector: "renewable_energy",
    quantityTotal: 2,
    quantityOperational: 2,
    conditionRating: "new_commissioned",
  },
  {
    name: "Fresenius Hemodialysis Simulator Training Unit 4008S",
    centerCode: "ITI-KA-BEN-03",
    centerName: "Government ITI Peenya (Bengaluru)",
    sector: "healthcare_allied",
    quantityTotal: 2,
    quantityOperational: 1,
    conditionRating: "needs_maintenance",
    criticalNotice: "Pressure transducer calibration verification overdue",
  },
  {
    name: "Tuttnauer Hospital Autoclave Steam Sterilizer Chamber",
    centerCode: "ITI-KA-BEN-03",
    centerName: "Government ITI Peenya (Bengaluru)",
    sector: "healthcare_allied",
    quantityTotal: 2,
    quantityOperational: 2,
    conditionRating: "operational_good",
  },
  {
    name: "Edge Kubernetes Rack Cluster 64-Core Node Array",
    centerCode: "NSTI-HR-GUR-01",
    centerName: "National Skill Training Institute Gurugram",
    sector: "information_technology",
    quantityTotal: 4,
    quantityOperational: 4,
    conditionRating: "new_commissioned",
  },
  {
    name: "Solex Multi-Jet Carburetor Flow Bench Rig",
    centerCode: "ITI-MH-PUN-01",
    centerName: "Government ITI Aundh (Pune)",
    sector: "automotive_ev",
    quantityTotal: 4,
    quantityOperational: 4,
    conditionRating: "obsolete",
    criticalNotice: "Obsolete hardware; occupies 120 sq. m of shop floor for declining trade",
  },
  {
    name: "Manual Drafting Boards with Drafting Arm Machines",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    quantityTotal: 30,
    quantityOperational: 30,
    conditionRating: "obsolete",
    criticalNotice: "Manual drafting desks idle while digital CAD/CAM labs face space constraints",
  },
];

export default function EquipmentPlanningPage() {
  const [filterRating, setFilterRating] = useState<string>("all");

  const filtered = DEMO_EQUIPMENT.filter(
    (e) => filterRating === "all" || e.conditionRating === filterRating
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Equipment & Lab Infrastructure Planning"
        description="Tracks lab machinery availability, working condition ratios, and Capex requirements to deliver modern hands-on vocational modules."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Infrastructure Registry: Verified
            </span>
            <span className="inline-flex items-center rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              Demo Dataset
            </span>
            <Button asChild size="sm" className="bg-[#0f2744] hover:bg-[#1a3a60] text-white">
              <Link href="/decision-engine">
                <Wrench className="h-3.5 w-3.5 mr-1 text-[#38bdf8]" />
                View Procurement Actions
              </Link>
            </Button>
          </div>
        }
      />

      {/* Overview Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Tracked Units</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">59 Units</p>
          <span className="text-xs text-slate-500">Across 12 equipment categories</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Operational Good</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">21 Units</p>
          <span className="text-xs text-slate-500">Ready for student lab batches</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Deficits / Down</span>
          <p className="text-2xl font-bold text-red-700 mt-1">4 Machinery Lines</p>
          <span className="text-xs text-slate-500">Causing practical training deficits</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Obsolete Rigs</span>
          <p className="text-2xl font-bold text-slate-600 mt-1">34 Units</p>
          <span className="text-xs text-slate-500">Candidates for lab floor decommissioning</span>
        </div>
      </div>

      {/* Equipment Inventories Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Workshop Machinery & Lab Test Benches
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Condition ratings, operational counts, and bottleneck notices
              </CardDescription>
            </div>
            <select
              value={filterRating}
              onChange={(e) => setFilterRating(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="all">All Conditions</option>
              <option value="new_commissioned">New / Commissioned</option>
              <option value="operational_good">Operational (Good)</option>
              <option value="needs_maintenance">Needs Maintenance</option>
              <option value="non_operational">Non-Operational</option>
              <option value="obsolete">Obsolete Machinery</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Equipment / Spec</th>
                <th className="py-2.5 px-3">Institution</th>
                <th className="py-2.5 px-3 text-center">Total Units</th>
                <th className="py-2.5 px-3 text-center">Operational</th>
                <th className="py-2.5 px-3">Condition</th>
                <th className="py-2.5 px-3">Notice</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item) => (
                <tr key={`${item.centerCode}-${item.name}`} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-3 font-semibold text-slate-900">
                    {item.name}
                  </td>
                  <td className="py-3 px-3 text-slate-600 font-mono text-[11px]">
                    {item.centerCode}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.quantityTotal}
                  </td>
                  <td className="py-3 px-3 text-center font-bold text-slate-800">
                    {item.quantityOperational}
                  </td>
                  <td className="py-3 px-3">
                    {item.conditionRating === "new_commissioned" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 text-blue-700 px-2 py-0.5 text-[11px] font-medium border border-blue-200">
                        New
                      </span>
                    ) : item.conditionRating === "operational_good" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium border border-emerald-200">
                        <CheckCircle2 className="h-3 w-3" /> Operational
                      </span>
                    ) : item.conditionRating === "needs_maintenance" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-medium border border-amber-200">
                        <AlertTriangle className="h-3 w-3" /> Needs Service
                      </span>
                    ) : item.conditionRating === "non_operational" ? (
                      <span className="inline-flex items-center gap-1 rounded bg-red-50 text-red-700 px-2 py-0.5 text-[11px] font-medium border border-red-200">
                        <AlertCircle className="h-3 w-3" /> Down / Repair
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded bg-slate-100 text-slate-600 px-2 py-0.5 text-[11px] font-medium border border-slate-200">
                        <Trash2 className="h-3 w-3" /> Obsolete
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 text-[11px] text-slate-600 max-w-xs">
                    {item.criticalNotice || "Fully operational for lab curriculum"}
                  </td>
                  <td className="py-3 px-3 text-right">
                    <Button asChild variant="outline" size="sm" className="text-xs h-7">
                      <Link href="/decision-engine">Procure</Link>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
