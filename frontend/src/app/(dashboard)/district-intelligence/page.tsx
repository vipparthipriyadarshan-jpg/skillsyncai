"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, ArrowRight, Search } from "lucide-react";
import Link from "next/link";

interface DistrictCardData {
  code: string;
  name: string;
  state: string;
  keySectors: string[];
  activePostings: number;
  topSkillsDemand: string[];
  keyInstitutions: string[];
  criticalGaps: string[];
  severity: "critical" | "moderate" | "aligned";
}

const DEMO_DISTRICTS: DistrictCardData[] = [
  {
    code: "MH-PUN",
    name: "Pune",
    state: "Maharashtra",
    keySectors: ["Automotive & EV", "Precision CNC", "Mechatronics"],
    activePostings: 57,
    topSkillsDemand: ["EV Battery Diagnostics", "Automotive CAN Bus Protocol", "BMS Configuration"],
    keyInstitutions: ["Government ITI Aundh (ITI-MH-PUN-01)"],
    criticalGaps: ["CAN Bus diagnostic telemetry omitted in current 1-year syllabus", "Obsolete carburetor training consuming workshop capacity"],
    severity: "critical",
  },
  {
    code: "TN-CBE",
    name: "Coimbatore",
    state: "Tamil Nadu",
    keySectors: ["Industrial Robotics", "5-Axis CNC", "Textile Automation"],
    activePostings: 46,
    topSkillsDemand: ["Industrial Robotics Programming", "5-Axis CNC Milling", "G-Code & M-Code"],
    keyInstitutions: ["Government Polytechnic Coimbatore (POLY-TN-CBE-04)"],
    criticalGaps: ["Severe capacity deficit (40 annual seats vs 120+ regional vacancies)", "5-axis milling machine non-operational awaiting spindle part"],
    severity: "critical",
  },
  {
    code: "GJ-AHM",
    name: "Ahmedabad",
    state: "Gujarat",
    keySectors: ["Renewable Energy", "Solar PV", "Power Transmission"],
    activePostings: 46,
    topSkillsDemand: ["Grid-Tie Solar Inverter Sizing", "Solar PV Array Installation", "Anti-Islanding Testing"],
    keyInstitutions: ["Gujarat Skill Training Academy (GSTA-GJ-AHM-02)"],
    criticalGaps: ["Smart grid synchronization telemetry needs 20 additional practical hours"],
    severity: "moderate",
  },
  {
    code: "KA-BEN",
    name: "Bengaluru Urban",
    state: "Karnataka",
    keySectors: ["Healthcare Allied Devices", "Cloud DevOps", "Edge AI"],
    activePostings: 60,
    topSkillsDemand: ["Dialysis Machine Calibration", "Kubernetes Container Orchestration", "Autoclave Sterilization"],
    keyInstitutions: ["Government ITI Peenya (ITI-KA-BEN-03)"],
    criticalGaps: ["1 of 2 hemodialysis simulators needs transducer calibration"],
    severity: "moderate",
  },
  {
    code: "HR-GUR",
    name: "Gurugram",
    state: "Haryana",
    keySectors: ["Information Technology", "Cloud Infrastructure", "Automotive Electronics"],
    activePostings: 24,
    topSkillsDemand: ["Linux System Administration", "Kubernetes Fleet Management", "Networking"],
    keyInstitutions: ["National Skill Training Institute Gurugram (NSTI-HR-GUR-01)"],
    criticalGaps: ["Faculty requires updated certification in declarative Kubernetes orchestration"],
    severity: "aligned",
  },
];

export default function DistrictIntelligencePage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedState, setSelectedState] = useState<string>("all");

  const filteredDistricts = DEMO_DISTRICTS.filter((d) => {
    const matchesSearch =
      d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      d.keySectors.some((s) => s.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesState = selectedState === "all" || d.state === selectedState;
    return matchesSearch && matchesState;
  });

  return (
    <div className="space-y-6">
      <PageHeader
        title="District Intelligence"
        description="Spatial distribution of skill mismatch, district-level industrial clusters, ITI capacities, and regional supply-demand indices."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Data Source: Regional Economic Telemetry
            </span>
            <span className="inline-flex items-center rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              Demo Dataset
            </span>
          </div>
        }
      />

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-4 rounded-lg border border-slate-200">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search district, state, or trade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs rounded-md border border-slate-300 focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <span className="text-xs text-slate-500">Filter by State:</span>
          <select
            value={selectedState}
            onChange={(e) => setSelectedState(e.target.value)}
            className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
          >
            <option value="all">All States</option>
            <option value="Maharashtra">Maharashtra</option>
            <option value="Tamil Nadu">Tamil Nadu</option>
            <option value="Gujarat">Gujarat</option>
            <option value="Karnataka">Karnataka</option>
            <option value="Haryana">Haryana</option>
          </select>
        </div>
      </div>

      {/* District Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredDistricts.map((district) => (
          <Card key={district.code} className="hover:border-slate-300 transition-all flex flex-col justify-between">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-[#0284c7]" />
                    <CardTitle className="text-base font-bold text-slate-900">
                      {district.name}
                    </CardTitle>
                    <span className="text-[11px] font-mono text-slate-500">
                      ({district.code})
                    </span>
                  </div>
                  <CardDescription className="text-xs text-slate-500 mt-0.5">
                    {district.state}
                  </CardDescription>
                </div>
                <Badge
                  className={
                    district.severity === "critical"
                      ? "bg-red-50 text-red-700 border-red-200"
                      : district.severity === "moderate"
                      ? "bg-amber-50 text-amber-700 border-amber-200"
                      : "bg-emerald-50 text-emerald-700 border-emerald-200"
                  }
                  variant="outline"
                >
                  {district.severity === "critical"
                    ? "Critical Deficit"
                    : district.severity === "moderate"
                    ? "Moderate Gap"
                    : "Balanced Supply"}
                </Badge>
              </div>

              <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 text-xs">
                <div>
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Industry Specializations
                  </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {district.keySectors.map((sec) => (
                      <span
                        key={sec}
                        className="rounded bg-slate-100 px-2 py-0.5 text-[11px] text-slate-700 font-medium"
                      >
                        {sec}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Top Demand Competencies
                  </span>
                  <p className="text-xs text-slate-800 font-medium mt-0.5">
                    {district.topSkillsDemand.join(" • ")}
                  </p>
                </div>

                <div className="pt-1">
                  <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wide">
                    Identified Bottleneck
                  </span>
                  <p className="text-xs text-red-700 mt-0.5">
                    {district.criticalGaps[0]}
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0">
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                <span className="text-slate-500">
                  Active Vacancies: <strong className="text-slate-900">{district.activePostings}</strong>
                </span>
                <Button asChild variant="outline" size="sm" className="text-xs">
                  <Link href={`/labour-market?district=${district.name}`} className="flex items-center gap-1">
                    <span>View Signals</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
