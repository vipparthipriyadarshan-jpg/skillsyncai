import React from "react";
import Link from "next/link";
import {
  Layers,
  ArrowRight,
  TrendingUp,
  ScanSearch,
  Sliders,
  ShieldCheck,
  Building2,
  GraduationCap,
  Users,
  Compass,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Enterprise Header */}
      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#0f2744] text-white shadow-xs">
              <Layers className="h-5 w-5 text-[#38bdf8]" />
            </div>
            <div>
              <span className="text-base font-bold text-slate-900 tracking-tight block">
                Skill Sync AI
              </span>
              <span className="text-xs text-slate-500 font-medium block">
                Bridging Industry Demand and Workforce Skills
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200">
              Enterprise Edition
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild size="sm" className="bg-[#0f2744] text-white hover:bg-[#1a3a60]">
              <Link href="/dashboard">Launch Platform</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1">
        <section className="px-6 pt-16 pb-20 border-b border-slate-200 bg-white">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full border border-sky-200 bg-sky-50 px-3.5 py-1 text-xs font-semibold text-sky-900">
              <span className="h-2 w-2 rounded-full bg-sky-600" />
              Workforce & Skill Alignment Intelligence Platform
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-950 max-w-4xl mx-auto leading-tight">
              An Evidence-Based Bridge Between Changing Industry Demand & Vocational Training
            </h1>

            <p className="text-lg text-slate-600 max-w-3xl mx-auto leading-relaxed">
              Curricula, trainers, and equipment often lag years behind real-time industry needs.
              Skill Sync AI translates millions of labor market signals into deterministic curriculum audits,
              trainer readiness assessments, and district-level workforce simulations.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
              <Button asChild size="lg" className="w-full sm:w-auto bg-[#0f2744] text-white hover:bg-[#1a3a60] px-8">
                <Link href="/dashboard" className="flex items-center gap-2">
                  Access Live Dashboard
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
                <Link href="/signup">Register Stakeholder Account</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* 5 Role Ecosystem */}
        <section className="px-6 py-16 max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
              Multi-Stakeholder Governance
            </h2>
            <p className="text-2xl font-bold text-slate-900 mt-1">
              Engineered for Every Level of the Skill Ecosystem
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-purple-50 text-purple-700 mb-3">
                <ShieldCheck className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Admin</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Centralized taxonomy governance, API health monitoring, data ingestion pipelines, and schema audits.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-blue-50 text-blue-800 mb-3">
                <Building2 className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Government</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                District-level demand heatmaps, training capacity allocation, and What-If workforce policy simulation.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-teal-50 text-teal-800 mb-3">
                <GraduationCap className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Training Institution</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Automated Curriculum X-Ray, trainer upskilling gap detection, and equipment readiness matrices.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-amber-50 text-amber-800 mb-3">
                <Users className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Employer</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Direct curriculum validation loop, missing capability endorsements, and pre-aligned talent sourcing.
              </p>
            </div>

            <div className="rounded-lg border border-slate-200 bg-white p-5 shadow-xs">
              <div className="flex h-9 w-9 items-center justify-center rounded-md bg-emerald-50 text-emerald-800 mb-3">
                <Compass className="h-5 w-5" />
              </div>
              <h3 className="text-sm font-semibold text-slate-900">Candidate</h3>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Individual skill gap evaluation, market-verified learning roadmaps, and local certified training centers.
              </p>
            </div>
          </div>
        </section>

        {/* Architectural Pillars */}
        <section className="px-6 py-16 bg-white border-t border-slate-200">
          <div className="max-w-7xl mx-auto">
            <div className="max-w-2xl mb-12">
              <h2 className="text-xs font-bold uppercase tracking-wider text-[#0284c7]">
                Technical Core
              </h2>
              <p className="text-2xl font-bold text-slate-900 mt-1">
                Deterministic Analytics Powered by Structured Language Intelligence
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 rounded-lg border border-slate-200 bg-slate-50/50">
                <TrendingUp className="h-6 w-6 text-[#0f2744] mb-3" />
                <h4 className="text-base font-semibold text-slate-900">Evidence-Based Signal Ingestion</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Processes raw job listings, vocational syllabi PDFs, and employer surveys into normalized skill taxonomies without data hallucination.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-slate-200 bg-slate-50/50">
                <ScanSearch className="h-6 w-6 text-[#0f2744] mb-3" />
                <h4 className="text-base font-semibold text-slate-900">Curriculum X-Ray Engine</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Compares active trade curricula against 90-day industry requirements to highlight missing, aligned, and obsolete competencies.
                </p>
              </div>

              <div className="p-6 rounded-lg border border-slate-200 bg-slate-50/50">
                <Sliders className="h-6 w-6 text-[#0f2744] mb-3" />
                <h4 className="text-base font-semibold text-slate-900">What-If Workforce Simulator</h4>
                <p className="text-xs text-slate-600 mt-2 leading-relaxed">
                  Allows administrators to simulate budget increases or trade expansions to forecast placement returns and identify trainer bottlenecks.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Enterprise Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 px-6 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-800">Skill Sync AI</span>
            <span>—</span>
            <span>Labour Market &amp; Skill Alignment Intelligence</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/api/health" className="hover:text-slate-800">
              System Health API
            </Link>
            <Link href="/login" className="hover:text-slate-800">
              Stakeholder Sign In
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
