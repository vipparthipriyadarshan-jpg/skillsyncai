"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { SimulationOutput, SavedScenario } from "@/lib/simulator/types";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, AlertCircle } from "lucide-react";

interface SaveScenarioModalProps {
  isOpen: boolean;
  onClose: () => void;
  output: SimulationOutput | null;
  onSuccess: (saved: SavedScenario) => void;
}

export function SaveScenarioModal({
  isOpen,
  onClose,
  output,
  onSuccess,
}: SaveScenarioModalProps) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("Director of Technical Education");
  const [authorRole, setAuthorRole] = useState("State Vocational Planning Board");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  React.useEffect(() => {
    if (output) {
      const sign = output.demandChangePct >= 0 ? "+" : "";
      setTitle(`${output.sectorLabel} (${sign}${output.demandChangePct}% Shift Policy)`);
      setNotes("");
      setErrorMessage(null);
    }
  }, [output]);

  if (!output) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!title.trim()) {
      setErrorMessage("Please enter a title for this simulation scenario.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch("/api/simulator", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          author: author.trim(),
          authorRole: authorRole.trim(),
          notes: notes.trim(),
          output,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to save scenario");

      onSuccess(data.savedScenario);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Error saving scenario");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Save Policy Simulation Scenario"
      description="Save current simulation results to the policy library for comparative evaluation and budget planning."
      size="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4 pt-1 text-xs">
        {/* Scenario snapshot */}
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Scenario Scope
          </div>
          <div className="font-semibold text-slate-900">{output.sectorLabel}</div>
          <div className="text-[11px] text-slate-500">
            Demand Shift: <strong>{output.demandChangePct > 0 ? `+${output.demandChangePct}%` : `${output.demandChangePct}%`}</strong> • Net Seat Delta: <strong>{output.seatsImpact.deltaSummary}</strong>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1">
            Scenario Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
          />
        </div>

        {/* Author details */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Author Name</label>
            <input
              type="text"
              required
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
            />
          </div>
          <div>
            <label className="block font-semibold text-slate-800 mb-1">Department / Board</label>
            <input
              type="text"
              required
              value={authorRole}
              onChange={(e) => setAuthorRole(e.target.value)}
              className="w-full rounded-md border border-slate-300 px-3 py-1.5 text-xs text-slate-900"
            />
          </div>
        </div>

        {/* Policy Notes */}
        <div>
          <label className="block font-semibold text-slate-800 mb-1">
            Policy Context & Planning Rationale
          </label>
          <textarea
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Document target fiscal year, planned scheme budget allocation, or industrial cluster intent..."
            className="w-full rounded-md border border-slate-300 p-2 text-xs text-slate-900"
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 p-2 rounded-md bg-rose-50 border border-rose-200 text-rose-800 text-xs">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className="bg-[#0f2744] hover:bg-[#1a3a60] text-white flex items-center gap-1.5"
          >
            <BookmarkPlus className="h-3.5 w-3.5" />
            {isSubmitting ? "Saving..." : "Save to Policy Library"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
