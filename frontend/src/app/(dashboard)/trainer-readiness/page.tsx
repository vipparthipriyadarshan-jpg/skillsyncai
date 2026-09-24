"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle2, AlertTriangle, Sliders } from "lucide-react";
import Link from "next/link";

interface TrainerData {
  name: string;
  email: string;
  institutionCode: string;
  institutionName: string;
  qualification: string;
  experienceYears: number;
  certifiedSkills: string[];
  upskillingNeed: string | null;
  status: "certified" | "upskilling_required" | "reskilling_recommended";
}

const DEMO_TRAINERS: TrainerData[] = [
  {
    name: "Sunil Deshmukh",
    email: "s.deshmukh@iti-pune.gov.in",
    institutionCode: "ITI-MH-PUN-01",
    institutionName: "Government ITI Aundh (Pune)",
    qualification: "Diploma in Automobile Engineering",
    experienceYears: 8.5,
    certifiedSkills: ["High Voltage Safety & Lockout/Tagout", "EV Battery Diagnostics"],
    upskillingNeed: "Automotive CAN Bus Protocol Analyzer Certification (40 hours recommended)",
    status: "upskilling_required",
  },
  {
    name: "Vikram Patil",
    email: "v.patil@iti-pune.gov.in",
    institutionCode: "ITI-MH-PUN-01",
    institutionName: "Government ITI Aundh (Pune)",
    qualification: "B.Tech Electrical Engineering",
    experienceYears: 4.0,
    certifiedSkills: ["High Voltage Safety & Lockout/Tagout"],
    upskillingNeed: "Battery Management Systems (BMS) Firmware & Telemetry (60 hours recommended)",
    status: "upskilling_required",
  },
  {
    name: "K. Murugesan",
    email: "k.murugesan@poly-cbe.edu.in",
    institutionCode: "POLY-TN-CBE-04",
    institutionName: "Government Polytechnic Coimbatore",
    qualification: "M.Tech Production Engineering",
    experienceYears: 12.0,
    certifiedSkills: ["G-Code & M-Code Programming", "5-Axis CNC Milling", "Engineering Blueprint Reading"],
    upskillingNeed: "6-Axis Industrial Robotics Teach Pendant Programming (80 hours recommended)",
    status: "upskilling_required",
  },
  {
    name: "Revathi Senthil",
    email: "r.senthil@poly-cbe.edu.in",
    institutionCode: "POLY-TN-CBE-04",
    institutionName: "Government Polytechnic Coimbatore",
    qualification: "B.E. Mechatronics",
    experienceYears: 5.5,
    certifiedSkills: ["Industrial Robotics Programming", "Pneumatics & Hydraulics Basics"],
    upskillingNeed: null,
    status: "certified",
  },
  {
    name: "Hiren Joshi",
    email: "h.joshi@gsta-skill.edu.in",
    institutionCode: "GSTA-GJ-AHM-02",
    institutionName: "Gujarat Skill Training Academy Ahmedabad",
    qualification: "B.E. Renewable Energy",
    experienceYears: 6.0,
    certifiedSkills: ["Solar PV Array Installation", "Grid-Tie Solar Inverter Sizing"],
    upskillingNeed: null,
    status: "certified",
  },
  {
    name: "Ananya Swaminathan",
    email: "a.swaminathan@iti-ben.gov.in",
    institutionCode: "ITI-KA-BEN-03",
    institutionName: "Government ITI Peenya (Bengaluru)",
    qualification: "B.E. Biomedical Instrumentation",
    experienceYears: 7.0,
    certifiedSkills: ["Sterilization Autoclave Operation", "Dialysis Machine Calibration"],
    upskillingNeed: null,
    status: "certified",
  },
  {
    name: "Gaurav Singhal",
    email: "g.singhal@nsti-gurugram.gov.in",
    institutionCode: "NSTI-HR-GUR-01",
    institutionName: "National Skill Training Institute Gurugram",
    qualification: "M.Sc Computer Science & C-DAC PG-DAC",
    experienceYears: 9.0,
    certifiedSkills: ["Linux System Administration", "Kubernetes Container Orchestration"],
    upskillingNeed: null,
    status: "certified",
  },
  {
    name: "Bapu Kadam",
    email: "b.kadam@iti-pune.gov.in",
    institutionCode: "ITI-MH-PUN-01",
    institutionName: "Government ITI Aundh (Pune)",
    qualification: "ITI Motor Mechanic Trade Certificate",
    experienceYears: 24.0,
    certifiedSkills: ["Carburetor Tuning & Overhaul"],
    upskillingNeed: "Candidate for reskilling: Transition legacy carburetion expertise to EV mechanical suspension & chassis",
    status: "reskilling_recommended",
  },
  {
    name: "V. Natarajan",
    email: "v.natarajan@poly-cbe.edu.in",
    institutionCode: "POLY-TN-CBE-04",
    institutionName: "Government Polytechnic Coimbatore",
    qualification: "Diploma in Mechanical Draughtsmanship",
    experienceYears: 28.0,
    certifiedSkills: ["Manual Drafting on Drafting Boards", "Conventional Lathe Manual Turning"],
    upskillingNeed: "Candidate for reskilling: Transition manual drawing expertise to SolidWorks / Autodesk CAD-CAM",
    status: "reskilling_recommended",
  },
];

export default function TrainerReadinessPage() {
  const [filterStatus, setFilterStatus] = useState<string>("all");

  const filtered = DEMO_TRAINERS.filter(
    (t) => filterStatus === "all" || t.status === filterStatus
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Trainer Readiness & Faculty Competency Audit"
        description="Audits existing trainer competency matrices against emerging trade curriculum requirements to calculate upskilling hours needed."
        actions={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center rounded bg-slate-100 px-2 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Faculty Audit Registry: Active
            </span>
            <span className="inline-flex items-center rounded bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700 border border-amber-200">
              Demo Dataset
            </span>
            <Button asChild size="sm" className="bg-[#0f2744] hover:bg-[#1a3a60] text-white">
              <Link href="/decision-engine">
                <Sliders className="h-3.5 w-3.5 mr-1 text-[#38bdf8]" />
                View Upskilling Actions
              </Link>
            </Button>
          </div>
        }
      />

      {/* Roster Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Registered Instructors</span>
          <p className="text-2xl font-bold text-slate-900 mt-1">9 Faculty</p>
          <span className="text-xs text-slate-500">Across 5 public training centers</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Certified & Aligned</span>
          <p className="text-2xl font-bold text-emerald-700 mt-1">4 Instructors</p>
          <span className="text-xs text-slate-500">Fully meet current course specs</span>
        </div>
        <div className="p-4 rounded-lg border border-slate-200 bg-white">
          <span className="text-xs text-slate-500 font-semibold uppercase">Upskilling / Reskilling Gap</span>
          <p className="text-2xl font-bold text-amber-700 mt-1">5 Instructors</p>
          <span className="text-xs text-slate-500">Require certification or trade transition</span>
        </div>
      </div>

      {/* Trainer Roster Cards Grid */}
      <Card className="border-slate-200">
        <CardHeader className="p-5 pb-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-sm font-bold text-slate-900">
                Institutional Faculty Competency Profiles
              </CardTitle>
              <CardDescription className="text-xs text-slate-500">
                Individual certifications and algorithmically flagged curriculum training gaps
              </CardDescription>
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs border border-slate-300 rounded-md px-2.5 py-1.5 bg-white text-slate-800 focus:outline-none"
            >
              <option value="all">All Statuses</option>
              <option value="certified">Fully Certified</option>
              <option value="upskilling_required">Upskilling Required</option>
              <option value="reskilling_recommended">Reskilling Recommended</option>
            </select>
          </div>
        </CardHeader>
        <CardContent className="p-5 pt-0 space-y-3">
          {filtered.map((trainer) => (
            <div
              key={trainer.email}
              className="p-4 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-slate-900">{trainer.name}</span>
                  <span className="text-slate-400">•</span>
                  <span className="text-slate-600">{trainer.qualification}</span>
                  <span className="text-slate-400">•</span>
                  <span className="font-semibold text-slate-700">{trainer.experienceYears} yrs exp</span>
                </div>
                <div className="text-[11px] text-slate-500 font-mono">
                  {trainer.institutionName} ({trainer.institutionCode})
                </div>

                <div className="pt-1 flex flex-wrap items-center gap-1.5">
                  <span className="text-slate-500 font-medium">Certified Skills:</span>
                  {trainer.certifiedSkills.map((sk) => (
                    <span
                      key={sk}
                      className="rounded bg-slate-100 px-2 py-0.5 text-[10px] text-slate-700 font-medium"
                    >
                      {sk}
                    </span>
                  ))}
                </div>

                {trainer.upskillingNeed && (
                  <div className="pt-1.5 text-xs">
                    <span className="font-semibold text-amber-900">Recommended Action: </span>
                    <span className="text-amber-800">{trainer.upskillingNeed}</span>
                  </div>
                )}
              </div>

              <div className="shrink-0 flex items-center gap-3">
                {trainer.status === "certified" ? (
                  <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">
                    <CheckCircle2 className="h-3 w-3 mr-1" /> Fully Certified
                  </Badge>
                ) : trainer.status === "upskilling_required" ? (
                  <Badge className="bg-amber-50 text-amber-700 border-amber-200">
                    <AlertTriangle className="h-3 w-3 mr-1" /> Upskilling Required
                  </Badge>
                ) : (
                  <Badge className="bg-purple-50 text-purple-700 border-purple-200">
                    Reskilling Candidate
                  </Badge>
                )}

                <Button asChild variant="outline" size="sm" className="text-xs h-8">
                  <Link href="/decision-engine">Action Plan</Link>
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
