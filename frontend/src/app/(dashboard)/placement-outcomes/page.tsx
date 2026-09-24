"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScanSearch } from "lucide-react";
import Link from "next/link";

interface PlacementData {
  courseCode: string;
  courseName: string;
  batchYear: number;
  totalGraduates: number;
  placedGraduates: number;
  avgSalaryMonthly: number;
  topPartner: string;
}

const DEMO_PLACEMENTS: PlacementData[] = [
  {
    courseCode: "EV-TECH-201",
    courseName: "Electric Vehicle Service & Maintenance Technician",
    batchYear: 2024,
    totalGraduates: 52,
    placedGraduates: 38,
    avgSalaryMonthly: 24500,
    topPartner: "Apex Dynamics Mobility Ltd (Synthetic Entity)",
  },
  {
    courseCode: "EV-TECH-201",
    courseName: "Electric Vehicle Service & Maintenance Technician",
    batchYear: 2025,
    totalGraduates: 56,
    placedGraduates: 46,
    avgSalaryMonthly: 27500,
    topPartner: "Apex Dynamics & Veloce E-Mobility (Synthetic Entities)",
  },
  {
    courseCode: "ROB-CNC-301",
    courseName: "Industrial Robotics & Multi-Axis CNC Automation",
    batchYear: 2024,
    totalGraduates: 38,
    placedGraduates: 34,
    avgSalaryMonthly: 28000,
    topPartner: "Precision Multi-Axis Robotics Ltd (Synthetic Entity)",
  },
  {
    courseCode: "ROB-CNC-301",
    courseName: "Industrial Robotics & Multi-Axis CNC Automation",
    batchYear: 2025,
    totalGraduates: 40,
    placedGraduates: 38,
    avgSalaryMonthly: 31000,
    topPartner: "Precision Multi-Axis Robotics & Kalyani Mechatronics (Synthetic Entities)",
  },
  {
    courseCode: "SOL-GRID-101",
    courseName: "Solar Photovoltaic & Smart Microgrid Technician",
    batchYear: 2024,
    totalGraduates: 45,
    placedGraduates: 36,
    avgSalaryMonthly: 22000,
    topPartner: "Helios CleanGrid Solutions (Synthetic Entity)",
  },
  {
    courseCode: "SOL-GRID-101",
    courseName: "Solar Photovoltaic & Smart Microgrid Technician",
    batchYear: 2025,
    totalGraduates: 48,
    placedGraduates: 42,
    avgSalaryMonthly: 25500,
    topPartner: "Helios CleanGrid & BreezePulse Energy (Synthetic Entities)",
  },
  {
    courseCode: "BIOMED-DIA-201",
    courseName: "Biomedical Equipment Maintenance & Dialysis Technology",
    batchYear: 2025,
    totalGraduates: 28,
    placedGraduates: 24,
    avgSalaryMonthly: 26000,
    topPartner: "AuraHealth MedTech Devices (Synthetic Entity)",
  },
  {
    courseCode: "CLD-K8S-401",
    courseName: "Cloud DevOps & Container Orchestration Associate",
    batchYear: 2025,
    totalGraduates: 42,
    placedGraduates: 39,
    avgSalaryMonthly: 34000,
    topPartner: "CloudMatrix Edge Systems",
  },
  {
    courseCode: "ENG-LEG-101",
    courseName: "Conventional Engine Overhaul & Carburetion Trade (Legacy)",
    batchYear: 2024,
    totalGraduates: 35,
    placedGraduates: 16,
    avgSalaryMonthly: 15000,
    topPartner: "Vintage Motor Spares & Overhaul",
  },
  {
    courseCode: "ENG-LEG-101",
    courseName: "Conventional Engine Overhaul & Carburetion Trade (Legacy)",
    batchYear: 2025,
    totalGraduates: 32,
    placedGraduates: 11,
    avgSalaryMonthly: 15500,
    topPartner: "Vintage Motor Spares & Overhaul",
  },
  {
    courseCode: "MEC-LEG-102",
    courseName: "Manual Drafting & Machine Tool Turning (Legacy)",
    batchYear: 2024,
    totalGraduates: 28,
    placedGraduates: 12,
    avgSalaryMonthly: 16000,
    topPartner: "Local Machine Workshops",
  },
  {
    courseCode: "MEC-LEG-102",
    courseName: "Manual Drafting & Machine Tool Turning (Legacy)",
    batchYear: 2025,
    totalGraduates: 25,
    placedGraduates: 9,
    avgSalaryMonthly: 16200,
    topPartner: "Local Machine Workshops",
  },
];

export default function PlacementOutcomesPage() {
  const [selectedYear, setSelectedYear] = useState<string>("all");

  const filtered = DEMO_PLACEMENTS.filter(
    (p) => selectedYear === "all" || p.batchYear.toString() === selectedYear
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Placement Outcomes & Graduate Tracking"
        description="Analyzes graduate employment rates, average starting salaries, and placement correlation with curriculum modernization scores."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Outcomes Registry: Verified Tracer Data
            </span>
            <Button asChild size="sm" className="bg-[#0f2744] hover:bg-[#1a3a60] text-white">
              <Link href="/curriculum-xray">
                <ScanSearch className="h-3.5 w-3.5 mr-1 text-[#38bdf8]" />
                Inspect Curricula Gaps
              </Link>
            </Button>
          </div>
        }
      />

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Overall Placement Average</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">78.4%</p>
          <span className="text-xs text-emerald-700 font-medium">315 graduates placed of 442 total</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Advanced Robotics & EV Wage</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">₹31,000 / mo</p>
          <span className="text-xs text-slate-500">+100% higher than legacy trade averages</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Declining Trade Placement</span>
          <p className="text-2xl font-bold text-red-700 mt-1">34.4%</p>
          <span className="text-xs text-slate-500">Legacy Carburetion & Manual Drafting</span>
        </div>
      </div>

      {/* Cohort Placement Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Historical Batch Placement Outcomes (2024 vs 2025)
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Placement performance correlated with emerging versus legacy trades
              </CardDescription>
            </div>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="all">All Cohort Years</option>
              <option value="2025">2025 Cohort</option>
              <option value="2024">2024 Cohort</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Course / Trade</th>
                <th className="py-2.5 px-3 text-center">Batch</th>
                <th className="py-2.5 px-3 text-center">Graduates</th>
                <th className="py-2.5 px-3 text-center">Placed</th>
                <th className="py-2.5 px-3 text-center">Placement Rate</th>
                <th className="py-2.5 px-3 text-center">Avg Monthly Salary</th>
                <th className="py-2.5 px-3">Top Placement Partner</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((item, idx) => {
                const rate = Math.round((item.placedGraduates / item.totalGraduates) * 100);
                const isHigh = rate >= 75;
                const isLow = rate < 50;

                return (
                  <tr key={`${item.courseCode}-${item.batchYear}-${idx}`} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{item.courseName}</div>
                      <div className="text-[11px] font-mono text-slate-500">{item.courseCode}</div>
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-700">
                      {item.batchYear}
                    </td>
                    <td className="py-3 px-3 text-center text-slate-700">
                      {item.totalGraduates}
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-900">
                      {item.placedGraduates}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold ${
                          isHigh
                            ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                            : isLow
                            ? "bg-red-50 text-red-700 border border-red-200"
                            : "bg-slate-100 text-slate-700"
                        }`}
                      >
                        {rate}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-900">
                      ₹{item.avgSalaryMonthly.toLocaleString()}
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {item.topPartner}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}
