"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import {
  IndustryRecommendationView,
  EmployerProfile,
  ValidationStance,
  HiringDifficulty,
  EntryProficiency,
  EmployerValidationResponse,
} from "@/lib/employer-validation/types";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  FileEdit,
  XCircle,
  AlertCircle,
  Plus,
  Tag,
  ShieldCheck,
  Building2,
} from "lucide-react";

interface EmployerReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: IndustryRecommendationView | null;
  activeEmployer: EmployerProfile;
  onSuccess: (newResponse: EmployerValidationResponse) => void;
}

const COMMON_SKILL_SUGGESTIONS: Record<string, string[]> = {
  "rec-act-001": ["CAN Bus Protocol", "Vector CANoe Diagnostics", "Oscilloscope Waveform Analysis", "BMS Communication", "DBC File Parsing"],
  "rec-act-002": ["5-Axis Simultaneous CAM", "Mastercam Multi-Axis", "Toolpath Collision Simulation", "Post-Processor Optimization"],
  "rec-act-003": ["HV Battery Teardown", "Cell Balancing", "Thermal Runaway Mitigation", "Multimeter High-Voltage Safety"],
  "rec-act-009": ["Grid Inverter Synchronization", "Solar SCADA Telemetry", "Anti-Islanding Protection", "Three-Phase Power Quality"],
};

export function EmployerReviewModal({
  isOpen,
  onClose,
  recommendation,
  activeEmployer,
  onSuccess,
}: EmployerReviewModalProps) {
  const [stance, setStance] = useState<ValidationStance>("confirmed");
  const [hiringDifficulty, setHiringDifficulty] = useState<HiringDifficulty>("high");
  const [validatedProficiency, setValidatedProficiency] = useState<EntryProficiency>("intermediate");
  const [reviewerName, setReviewerName] = useState(activeEmployer.contactPerson);
  const [reviewerDesignation, setReviewerDesignation] = useState(activeEmployer.designation);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [customSkillInput, setCustomSkillInput] = useState("");
  const [feedbackComments, setFeedbackComments] = useState("");
  const [proposedModifications, setProposedModifications] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Initialize skills when recommendation opens
  React.useEffect(() => {
    if (recommendation) {
      const suggestions = COMMON_SKILL_SUGGESTIONS[recommendation.id] || [recommendation.affectedSkillName];
      setSelectedSkills(suggestions.slice(0, 2));
      setStance("confirmed");
      setFeedbackComments("");
      setProposedModifications("");
      setErrorMessage(null);
    }
  }, [recommendation]);

  if (!recommendation) return null;

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleAddCustomSkill = () => {
    if (customSkillInput.trim() && !selectedSkills.includes(customSkillInput.trim())) {
      setSelectedSkills((prev) => [...prev, customSkillInput.trim()]);
      setCustomSkillInput("");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (stance === "rejected" && (!feedbackComments || !feedbackComments.trim())) {
      setErrorMessage("Please provide feedback explaining why this recommendation is not applicable.");
      return;
    }

    if (stance === "modified" && (!proposedModifications || !proposedModifications.trim())) {
      setErrorMessage("Please specify the proposed modifications to the curriculum.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/employer-validation", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          recommendationId: recommendation.id,
          employerId: activeEmployer.id,
          reviewerName,
          reviewerDesignation,
          stance,
          hiringDifficulty,
          validatedProficiency,
          identifiedImportantSkills: selectedSkills,
          feedbackComments,
          proposedModifications: stance === "modified" ? proposedModifications : undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit validation");
      }

      onSuccess(data.response);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error submitting validation");
    } finally {
      setIsSubmitting(false);
    }
  };

  const suggestions = COMMON_SKILL_SUGGESTIONS[recommendation.id] || [recommendation.affectedSkillName];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Submit Employer Validation Feedback"
      description="Record industry feedback to validate or refine AI workforce recommendations."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-2 text-xs">
        {/* Active Employer Banner */}
        <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 bg-slate-50">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-blue-600" />
            <div>
              <span className="font-bold text-slate-800">{activeEmployer.name}</span>
              <div className="text-[11px] text-slate-500">
                {activeEmployer.district} • Sector: {activeEmployer.sector}
              </div>
            </div>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-blue-100 text-blue-800 font-semibold">
            Industry Reviewer
          </span>
        </div>

        {/* Target Recommendation Summary */}
        <div className="p-3 rounded-lg border border-blue-100 bg-blue-50/50 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-blue-600">
            Target Workforce Intervention
          </div>
          <div className="font-semibold text-slate-900 text-xs sm:text-sm">
            {recommendation.recommendation}
          </div>
          <div className="text-[11px] text-slate-600">
            Course: <strong>{recommendation.affectedCourseCode}</strong> • Skill: <strong>{recommendation.affectedSkillName}</strong>
          </div>
        </div>

        {/* 1. Validation Stance */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1.5">
            Validation Decision <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setStance("confirmed")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-medium transition-all ${
                stance === "confirmed"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-bold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Confirm Need
            </button>

            <button
              type="button"
              onClick={() => setStance("modified")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-medium transition-all ${
                stance === "modified"
                  ? "border-amber-500 bg-amber-50 text-amber-800 font-bold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileEdit className="h-4 w-4 text-amber-600" />
              Modify & Confirm
            </button>

            <button
              type="button"
              onClick={() => setStance("rejected")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border font-medium transition-all ${
                stance === "rejected"
                  ? "border-rose-500 bg-rose-50 text-rose-800 font-bold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <XCircle className="h-4 w-4 text-rose-600" />
              Reject Need
            </button>
          </div>
        </div>

        {/* 2. Hiring Difficulty & Validated Proficiency */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Report Hiring Difficulty <span className="text-rose-500">*</span>
            </label>
            <select
              value={hiringDifficulty}
              onChange={(e) => setHiringDifficulty(e.target.value as HiringDifficulty)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="acute_shortage">Acute Shortage (&gt;90 days to fill)</option>
              <option value="high">High Difficulty (45-90 days to fill)</option>
              <option value="moderate">Moderate Difficulty (30-45 days)</option>
              <option value="low">Low Difficulty (&lt;30 days)</option>
            </select>
          </div>

          <div>
            <label className="block font-semibold text-slate-800 mb-1">
              Validate Entry Proficiency <span className="text-rose-500">*</span>
            </label>
            <select
              value={validatedProficiency}
              onChange={(e) => setValidatedProficiency(e.target.value as EntryProficiency)}
              className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
            >
              <option value="introductory">Introductory (Basic theoretical awareness)</option>
              <option value="intermediate">Intermediate (Supervised practical execution)</option>
              <option value="advanced">Advanced (Independent tool execution & troubleshooting)</option>
              <option value="expert">Expert (Multi-system integration & optimization)</option>
            </select>
          </div>
        </div>

        {/* 3. Identify Important Skills */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1 flex items-center justify-between">
            <span className="flex items-center gap-1">
              <Tag className="h-3.5 w-3.5 text-blue-600" />
              Identify Critical / Important Skills
            </span>
            <span className="text-[10px] text-slate-400 font-normal">Click to toggle tags</span>
          </label>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {suggestions.map((skill) => {
              const isSelected = selectedSkills.includes(skill);
              return (
                <button
                  key={skill}
                  type="button"
                  onClick={() => toggleSkill(skill)}
                  className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all ${
                    isSelected
                      ? "bg-blue-600 text-white shadow-2xs"
                      : "bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-200"
                  }`}
                >
                  {isSelected ? "✓ " : "+ "} {skill}
                </button>
              );
            })}
          </div>

          {/* Add custom skill tag */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              placeholder="Tag additional specific skill or protocol..."
              value={customSkillInput}
              onChange={(e) => setCustomSkillInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  handleAddCustomSkill();
                }
              }}
              className="flex-1 rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
            />
            <Button type="button" variant="outline" size="sm" onClick={handleAddCustomSkill} className="h-8 text-xs">
              <Plus className="h-3.5 w-3.5 mr-1" /> Add Tag
            </Button>
          </div>
        </div>

        {/* 4. If Modified: Proposed Changes */}
        {stance === "modified" && (
          <div className="p-3 rounded-lg border border-amber-200 bg-amber-50/50 space-y-1.5">
            <label className="block font-semibold text-amber-900">
              Specify Proposed Modifications (Hours, Pedagogy, Apparatus) <span className="text-rose-500">*</span>
            </label>
            <textarea
              rows={2}
              required
              value={proposedModifications}
              onChange={(e) => setProposedModifications(e.target.value)}
              placeholder="e.g. Recommend reducing theoretical hours from 20h to 8h and allocating 32h purely for live multimeter and CANoe trace analysis..."
              className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-900 bg-white"
            />
          </div>
        )}

        {/* 5. Qualitative Feedback / Comments */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1">
            Qualitative Feedback & Industry Perspective
          </label>
          <textarea
            rows={3}
            value={feedbackComments}
            onChange={(e) => setFeedbackComments(e.target.value)}
            placeholder="Share hiring context, candidate performance gaps, or specific testing apparatus standards..."
            className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-900 placeholder:text-slate-400"
          />
        </div>

        {/* Reviewer signature */}
        <div className="grid grid-cols-2 gap-3 pt-1 border-t border-slate-100">
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Reviewer Name</label>
            <input
              type="text"
              required
              value={reviewerName}
              onChange={(e) => setReviewerName(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block text-[11px] font-medium text-slate-600 mb-1">Designation</label>
            <input
              type="text"
              required
              value={reviewerDesignation}
              onChange={(e) => setReviewerDesignation(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-2.5 py-1 text-xs text-slate-900"
            />
          </div>
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-2.5 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-200">
          <span className="text-[11px] text-slate-400 flex items-center gap-1">
            <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
            Stored as Employer Validation Evidence
          </span>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className={
                stance === "rejected"
                  ? "bg-rose-600 hover:bg-rose-700 text-white"
                  : stance === "modified"
                  ? "bg-amber-600 hover:bg-amber-700 text-white"
                  : "bg-emerald-600 hover:bg-emerald-700 text-white"
              }
            >
              {isSubmitting ? "Submitting..." : "Submit Employer Review"}
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  );
}
