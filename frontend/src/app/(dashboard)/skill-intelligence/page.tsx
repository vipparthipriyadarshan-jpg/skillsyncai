"use client";

import React, { useState } from "react";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobExtractionResult } from "@/lib/ai/types";
import { CANONICAL_SKILLS } from "@/lib/ai/taxonomy";
import {
  Brain,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Quote,
  Search,
  ArrowRight,
  RefreshCw,
  Lock,
} from "lucide-react";

const SAMPLE_JOB_TEXTS = {
  ev_battery: `We are hiring an EV Battery Diagnostic Technician at Apex Dynamics Mobility Ltd in Pune.
Contact recruiter at talent@apexdynamics.com.
The role requires hands-on experience in lithium-ion battery pack assembly, high-voltage battery diagnostics, and cell balancing.
Must be proficient in CAN bus protocol debugging using Vector CANoe, BMS configuration, and automotive electrical wiring.
Candidate must observe Industrial Safety & Lockout/Tagout (LOTO) procedures. Experience: 1 to 3 years.`,

  cnc_operator: `Looking for a Senior 5-Axis CNC Mill Operator at Precision Multi-Axis Robotics Ltd in Coimbatore.
Email resumes to careers@precision-robotics.com.
Key requirements:
- Extensive knowledge of multi-axis CNC milling, rotary axis setup, and precision aeronautical machining.
- Strong mastery of ISO G-Code & M-Code Programming and tool wear offset adjustments.
- Minimum 3 to 6 years of workshop machining experience.`,

  cloud_devops: `Seeking an Edge Cloud DevOps Associate at CloudMatrix Edge Systems in Gurugram.
Required competencies include Docker & containerization, Kubernetes cluster orchestration, and Python automation scripting.
Candidate must understand CI/CD pipeline automation and Linux system administration.
Experience: 1-3 years. Send details to hiring@cloudmatrix.io.`,
};

export default function SkillIntelligencePage() {
  const [inputText, setInputText] = useState(SAMPLE_JOB_TEXTS.ev_battery);
  const [isExtracting, setIsExtracting] = useState(false);
  const [result, setResult] = useState<JobExtractionResult | null>(null);
  const [taxonomySearch, setTaxonomySearch] = useState("");

  const handleExtract = async () => {
    if (!inputText.trim()) return;
    setIsExtracting(true);
    setResult(null);

    try {
      const res = await fetch("/api/ai/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: inputText }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setResult(data.data);
      } else {
        alert(data.error || "Failed to extract skills.");
      }
    } catch (err: unknown) {
      alert(err instanceof Error ? err.message : "Extraction network error.");
    } finally {
      setIsExtracting(false);
    }
  };

  const filteredTaxonomy = CANONICAL_SKILLS.filter(
    (item) =>
      item.name.toLowerCase().includes(taxonomySearch.toLowerCase()) ||
      item.aliases.some((a) => a.toLowerCase().includes(taxonomySearch.toLowerCase()))
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Skill Intelligence & Taxonomy Normalization"
        description="Provider-independent AI extraction service that parses unstructured job descriptions, scrubs PII, grounds competencies in verbatim text evidence, and deduplicates aliases into canonical skills."
        badge={
          <Badge variant="teal" className="flex items-center gap-1">
            <Sparkles className="h-3 w-3" />
            Llama-3 &amp; Heuristic Grounded
          </Badge>
        }
      />

      {/* Main Dual Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Live Extractor */}
        <div className="lg:col-span-7 space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Brain className="h-5 w-5 text-[#0284c7]" />
                  Job Description Analyzer
                </CardTitle>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] text-slate-500">Quick Samples:</span>
                  <button
                    onClick={() => setInputText(SAMPLE_JOB_TEXTS.ev_battery)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    EV Tech
                  </button>
                  <button
                    onClick={() => setInputText(SAMPLE_JOB_TEXTS.cnc_operator)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    CNC Mill
                  </button>
                  <button
                    onClick={() => setInputText(SAMPLE_JOB_TEXTS.cloud_devops)}
                    className="text-[10px] bg-slate-100 hover:bg-slate-200 text-slate-700 px-2 py-0.5 rounded font-medium"
                  >
                    Cloud
                  </button>
                </div>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Paste raw job postings to extract validated skills, grounded evidence quotes, and canonical taxonomy mappings.
              </CardDescription>
            </CardHeader>
            <CardContent className="p-5 pt-0 space-y-3">
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                rows={7}
                placeholder="Paste job posting text here..."
                className="w-full rounded-md border border-slate-300 p-3 text-xs font-mono text-slate-900 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
              />

              <div className="flex items-center justify-between pt-1">
                <div className="flex items-center gap-1.5 text-[11px] text-slate-500">
                  <Lock className="h-3 w-3 text-slate-400" />
                  <span>Automatic PII Scrubbing active</span>
                </div>

                <Button
                  disabled={isExtracting || !inputText.trim()}
                  onClick={handleExtract}
                  size="sm"
                  className="bg-[#0f2744] text-white hover:bg-[#1a3a60]"
                >
                  {isExtracting ? (
                    <span className="flex items-center gap-1.5">
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      Extracting Skills...
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5">
                      Extract &amp; Ground Skills
                      <ArrowRight className="h-3.5 w-3.5" />
                    </span>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Extraction Output Panel */}
          {result && (
            <Card className="border-slate-200">
              <CardHeader className="p-5 pb-3 border-b border-slate-100">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Extraction Results &amp; Grounding Audit
                    </h3>
                    <p className="text-xs text-slate-500">
                      Provider: <code className="font-mono text-slate-700">{result.providerUsed}</code> &bull; Duration: {result.extractionDurationMs}ms
                    </p>
                  </div>

                  {result.needsReview ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-800 border border-amber-200">
                      <AlertTriangle className="h-3.5 w-3.5 text-amber-600" />
                      Manual Review State
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600" />
                      High Confidence ({Math.round(result.overallConfidence * 100)}%)
                    </span>
                  )}
                </div>

                {/* Role Classification Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Classified Role</span>
                    <span className="font-bold text-slate-900 truncate block">{result.role.standardizedTitle}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Sector</span>
                    <span className="font-bold text-slate-900 capitalize block">{result.role.sector.replace("_", " ")}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Experience Tier</span>
                    <span className="font-bold text-slate-900 capitalize block">{result.role.experienceLevel.replace("_", " ")}</span>
                  </div>
                  <div className="p-2 rounded bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-semibold text-slate-500 block">Extracted Skills</span>
                    <span className="font-bold text-slate-900 block">{result.skills.length} competencies</span>
                  </div>
                </div>

                {/* PII Detection Notification */}
                {result.piiDetected && (
                  <div className="mt-3 p-2.5 rounded bg-sky-50 border border-sky-200 text-xs text-sky-900 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-sky-600 shrink-0" />
                    <span>
                      <strong>Privacy Protected:</strong> Email addresses and phone numbers were automatically redacted before processing.
                    </span>
                  </div>
                )}
              </CardHeader>

              <CardContent className="p-5 pt-3 space-y-3">
                <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Validated Competencies with Text Grounding
                </h4>

                <div className="divide-y divide-slate-100 border rounded-md border-slate-200 overflow-hidden">
                  {result.skills.map((skill, idx) => (
                    <div key={idx} className="p-3 bg-white hover:bg-slate-50 space-y-1.5 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-900">{skill.name}</span>
                          <span className="text-slate-400">&rarr;</span>
                          <span className="font-semibold text-[#0284c7] font-mono bg-sky-50 px-1.5 py-0.5 rounded text-[11px]">
                            {skill.canonical.canonicalName}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono text-slate-500">
                            Confidence: {Math.round(skill.confidenceScore * 100)}%
                          </span>
                          {skill.isGroundedInText ? (
                            <span className="inline-flex items-center text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                              Grounded
                            </span>
                          ) : (
                            <span className="inline-flex items-center text-[10px] font-semibold text-red-700 bg-red-50 px-1.5 py-0.5 rounded">
                              Ungrounded
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-start gap-1.5 text-[11px] text-slate-600 bg-slate-50 p-2 rounded">
                        <Quote className="h-3 w-3 text-slate-400 shrink-0 mt-0.5" />
                        <span className="italic">{skill.evidence}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column: Canonical Skill Taxonomy & Alias Normalizer */}
        <div className="lg:col-span-5 space-y-4">
          <Card className="border-slate-200">
            <CardHeader className="p-5 pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck className="h-5 w-5 text-emerald-600" />
                  Canonical Skill Normalizer
                </CardTitle>
                <span className="text-xs font-mono text-slate-500">
                  {CANONICAL_SKILLS.length} entities
                </span>
              </div>
              <CardDescription className="text-xs text-slate-500">
                Guarantees deduplication across spelling variations (e.g. ML, Machine Learning, Machine-Learning &rarr; Machine Learning).
              </CardDescription>

              <div className="relative mt-2">
                <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-slate-400" />
                <input
                  type="text"
                  value={taxonomySearch}
                  onChange={(e) => setTaxonomySearch(e.target.value)}
                  placeholder="Search skills or aliases (e.g. ML, K8s, CAN)..."
                  className="w-full rounded-md border border-slate-300 py-1.5 pl-8 pr-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#0284c7] focus:outline-none focus:ring-1 focus:ring-[#0284c7]"
                />
              </div>
            </CardHeader>

            <CardContent className="p-5 pt-0 space-y-2 max-h-[560px] overflow-y-auto">
              {filteredTaxonomy.map((entity, i) => (
                <div key={i} className="p-3 rounded-lg border border-slate-100 bg-slate-50/70 text-xs space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900">{entity.name}</span>
                    <span className="font-mono text-[10px] text-slate-500 bg-white px-1.5 py-0.5 rounded border border-slate-200">
                      {entity.category}
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
                      Recognized Aliases &amp; Deduplicated Variants:
                    </span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {entity.aliases.map((alias, aIdx) => (
                        <span
                          key={aIdx}
                          className="bg-white border border-slate-200 text-slate-700 px-1.5 py-0.5 rounded text-[10px] font-mono"
                        >
                          {alias}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
