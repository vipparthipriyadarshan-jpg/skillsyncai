"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Sliders, AlertCircle, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CourseCapacity {
  courseCode: string;
  courseName: string;
  centerCode: string;
  centerName: string;
  sector: string;
  annualCapacity: number;
  currentEnrollment: number;
  regionalDemand: number;
  status: "surplus_demand" | "balanced" | "underutilized";
  durationMonths: number;
}

const DEMO_CAPACITIES: CourseCapacity[] = [
  {
    courseCode: "ROB-CNC-301",
    courseName: "Industrial Robotics & Multi-Axis CNC Automation",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    annualCapacity: 40,
    currentEnrollment: 40,
    regionalDemand: 120,
    status: "surplus_demand",
    durationMonths: 18,
  },
  {
    courseCode: "EV-TECH-201",
    courseName: "Electric Vehicle Service & Maintenance Technician",
    centerCode: "ITI-MH-PUN-01",
    centerName: "Government ITI Aundh (Pune)",
    sector: "automotive_ev",
    annualCapacity: 60,
    currentEnrollment: 58,
    regionalDemand: 95,
    status: "surplus_demand",
    durationMonths: 12,
  },
  {
    courseCode: "SOL-GRID-101",
    courseName: "Solar Photovoltaic & Smart Microgrid Technician",
    centerCode: "GSTA-GJ-AHM-02",
    centerName: "Gujarat Skill Training Academy Ahmedabad",
    sector: "renewable_energy",
    annualCapacity: 50,
    currentEnrollment: 48,
    regionalDemand: 52,
    status: "balanced",
    durationMonths: 6,
  },
  {
    courseCode: "BIOMED-DIA-201",
    courseName: "Biomedical Equipment Maintenance & Dialysis Technology",
    centerCode: "ITI-KA-BEN-03",
    centerName: "Government ITI Peenya (Bengaluru)",
    sector: "healthcare_allied",
    annualCapacity: 30,
    currentEnrollment: 28,
    regionalDemand: 38,
    status: "surplus_demand",
    durationMonths: 10,
  },
  {
    courseCode: "CLD-K8S-401",
    courseName: "Cloud DevOps & Container Orchestration Associate",
    centerCode: "NSTI-HR-GUR-01",
    centerName: "National Skill Training Institute Gurugram",
    sector: "information_technology",
    annualCapacity: 45,
    currentEnrollment: 42,
    regionalDemand: 64,
    status: "surplus_demand",
    durationMonths: 9,
  },
  {
    courseCode: "ENG-LEG-101",
    courseName: "Conventional Engine Overhaul & Carburetion Trade (Legacy)",
    centerCode: "ITI-MH-PUN-01",
    centerName: "Government ITI Aundh (Pune)",
    sector: "automotive_ev",
    annualCapacity: 40,
    currentEnrollment: 32,
    regionalDemand: 4,
    status: "underutilized",
    durationMonths: 6,
  },
  {
    courseCode: "MEC-LEG-102",
    courseName: "Manual Drafting & Machine Tool Turning (Legacy)",
    centerCode: "POLY-TN-CBE-04",
    centerName: "Government Polytechnic Coimbatore",
    sector: "manufacturing_cnc",
    annualCapacity: 30,
    currentEnrollment: 25,
    regionalDemand: 6,
    status: "underutilized",
    durationMonths: 8,
  },
];

export default function TrainingCapacityPage() {
  const [filterSector, setFilterSector] = useState<string>("all");

  const filtered = DEMO_CAPACITIES.filter(
    (c) => filterSector === "all" || c.sector === filterSector
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Training Capacity & Intake Planning"
        description="Tracks institutional seat capacities, batch allocations, oversupplied training areas, and annual enrollment utilization."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Registry: Verified TVET Centers
            </span>
            <span className="inline-flex items-center rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              Demo Dataset
            </span>
            <Button asChild size="sm" className="bg-[#0f2744] hover:bg-[#1a3a60] text-white">
              <Link href="/simulator">
                <Sliders className="h-3.5 w-3.5 mr-1 text-[#38bdf8]" />
                Simulate Capacity Shift
              </Link>
            </Button>
          </div>
        }
      />

      {/* Overview Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Total Sanctioned Seats</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">305 Seats</p>
          <span className="text-xs text-slate-500">Across 7 registered trade courses</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Average Seat Utilization</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">89.5%</p>
          <span className="text-xs text-slate-500">273 active enrolled candidates</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Capacity Mismatch Index</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">2.4x Demand Ratio</p>
          <span className="text-xs text-slate-500">Robotics & EV trades face severe seat bottlenecks</span>
        </div>
      </div>

      {/* Courses Capacity Table */}
      <Card className="border-slate-200">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Registered Trade Courses Capacity Breakdown
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Comparison of sanctioned annual intake vs current enrollment and industry vacancy demand
              </CardDescription>
            </div>
            <select
              value={filterSector}
              onChange={(e) => setFilterSector(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="all">All Sectors</option>
              <option value="automotive_ev">Automotive & EV</option>
              <option value="manufacturing_cnc">Manufacturing & CNC</option>
              <option value="renewable_energy">Renewable Energy</option>
              <option value="healthcare_allied">Healthcare Allied</option>
              <option value="information_technology">Information Technology</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 overflow-x-auto">
          <table className="w-full text-xs text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                <th className="py-2.5 px-3">Course / Institution</th>
                <th className="py-2.5 px-3">Duration</th>
                <th className="py-2.5 px-3 text-center">Sanctioned Seats</th>
                <th className="py-2.5 px-3 text-center">Enrolled</th>
                <th className="py-2.5 px-3 text-center">Regional Demand</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((course) => {
                const utilizationPct = Math.round((course.currentEnrollment / course.annualCapacity) * 100);
                return (
                  <tr key={course.courseCode} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-slate-900">{course.courseName}</div>
                      <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                        {course.courseCode} • {course.centerName}
                      </div>
                    </td>
                    <td className="py-3 px-3 text-slate-600">
                      {course.durationMonths} months
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-slate-900">
                      {course.annualCapacity}
                    </td>
                    <td className="py-3 px-3 text-center font-medium text-slate-700">
                      {course.currentEnrollment} ({utilizationPct}%)
                    </td>
                    <td className="py-3 px-3 text-center font-semibold text-blue-700">
                      {course.regionalDemand} vacancies
                    </td>
                    <td className="py-3 px-3">
                      {course.status === "surplus_demand" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-red-50 text-red-700 px-2 py-0.5 text-[11px] font-medium border border-red-200">
                          <AlertCircle className="h-3 w-3" /> Capacity Deficit
                        </span>
                      ) : course.status === "underutilized" ? (
                        <span className="inline-flex items-center gap-1 rounded bg-amber-50 text-amber-700 px-2 py-0.5 text-[11px] font-medium border border-amber-200">
                          Oversupplied / Declining
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded bg-emerald-50 text-emerald-700 px-2 py-0.5 text-[11px] font-medium border border-emerald-200">
                          <CheckCircle2 className="h-3 w-3" /> Balanced
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Button asChild variant="outline" size="sm" className="text-xs h-7">
                        <Link href="/simulator">Simulate</Link>
                      </Button>
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
