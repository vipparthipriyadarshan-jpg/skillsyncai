"use client";

import React, { useState } from "react";
import { Modal } from "@/components/shared/Modal";
import { ActionRecommendation, RecommendationPriority } from "@/lib/decision-engine/types";
import { Button } from "@/components/ui/button";
import { CheckCircle2, XCircle, FileEdit, AlertCircle, ShieldAlert } from "lucide-react";

interface ReviewActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: ActionRecommendation | null;
  initialAction?: "approve" | "reject" | "modify";
  onSuccess: (updated: ActionRecommendation) => void;
}

export function ReviewActionModal({
  isOpen,
  onClose,
  recommendation,
  initialAction = "approve",
  onSuccess,
}: ReviewActionModalProps) {
  const [actionType, setActionType] = useState<"approve" | "reject" | "modify">(initialAction);
  const [actorName, setActorName] = useState("Dr. R. K. Sharma");
  const [actorRole, setActorRole] = useState("State Directorate of Vocational Education");
  const [rationale, setRationale] = useState("");
  const [newPriority, setNewPriority] = useState<RecommendationPriority>(recommendation?.priority || "high");
  const [modifiedTitle, setModifiedTitle] = useState(recommendation?.recommendation || "");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Sync state whenever recommendation or initialAction changes
  React.useEffect(() => {
    if (recommendation) {
      setActionType(initialAction);
      setNewPriority(recommendation.priority);
      setModifiedTitle(recommendation.recommendation);
      setRationale("");
      setErrorMessage(null);
    }
  }, [recommendation, initialAction]);

  if (!recommendation) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (actionType === "reject" && (!rationale || !rationale.trim())) {
      setErrorMessage("Rejection rationale is required by governance guidelines.");
      return;
    }

    if (actionType === "modify" && (!rationale || !rationale.trim())) {
      setErrorMessage("Please explain why these modifications are being made.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload: Record<string, unknown> = {
        id: recommendation.id,
        action: actionType,
        actorName,
        actorRole,
        rationale: rationale.trim() || (actionType === "approve" ? "Approved in state vocational planning session." : ""),
      };

      if (actionType === "modify") {
        payload.modifications = {
          priority: newPriority,
          recommendation: modifiedTitle.trim(),
        };
      }

      const res = await fetch("/api/decision-engine", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to submit review");
      }

      onSuccess(data.recommendation);
      onClose();
    } catch (err: unknown) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Human Review & Governance Sign-Off"
      description="The Decision Engine produces proposals. Irreversible curriculum or budget mutations require explicit human review."
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-5 pt-2">
        {/* Recommendation snapshot */}
        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 text-xs">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-0.5">
            Target Intervention
          </div>
          <div className="font-semibold text-slate-800 text-sm">{recommendation.recommendation}</div>
          <div className="mt-1 flex items-center gap-2 text-slate-500">
            <span>Course: <strong className="text-slate-700">{recommendation.affectedCourse.code}</strong></span>
            <span>•</span>
            <span>District: <strong className="text-slate-700">{recommendation.affectedDistrict.name}</strong></span>
            <span>•</span>
            <span>Current Status: <strong className="capitalize text-slate-700">{recommendation.status}</strong></span>
          </div>
        </div>

        {/* Action Type Toggle */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1.5">
            Decision Action <span className="text-rose-500">*</span>
          </label>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => setActionType("approve")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                actionType === "approve"
                  ? "border-emerald-500 bg-emerald-50 text-emerald-800 font-semibold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <CheckCircle2 className="h-4 w-4 text-emerald-600" />
              Approve
            </button>

            <button
              type="button"
              onClick={() => setActionType("modify")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                actionType === "modify"
                  ? "border-amber-500 bg-amber-50 text-amber-800 font-semibold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <FileEdit className="h-4 w-4 text-amber-600" />
              Modify & Approve
            </button>

            <button
              type="button"
              onClick={() => setActionType("reject")}
              className={`flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg border text-xs font-medium transition-all ${
                actionType === "reject"
                  ? "border-rose-500 bg-rose-50 text-rose-800 font-semibold shadow-xs"
                  : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
              }`}
            >
              <XCircle className="h-4 w-4 text-rose-600" />
              Reject
            </button>
          </div>
        </div>

        {/* Reviewer Credentials */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Reviewer Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={actorName}
              onChange={(e) => setActorName(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Stakeholder Role / Department
            </label>
            <input
              type="text"
              required
              value={actorRole}
              onChange={(e) => setActorRole(e.target.value)}
              className="w-full text-xs rounded-md border border-slate-300 px-3 py-2 text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Conditional Fields if "Modify & Approve" is chosen */}
        {actionType === "modify" && (
          <div className="p-3.5 rounded-lg border border-amber-200 bg-amber-50/50 space-y-3 text-xs">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5">
              <FileEdit className="h-3.5 w-3.5" />
              Custom Parameter Adjustments
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Adjust Priority Tier</label>
              <select
                value={newPriority}
                onChange={(e) => setNewPriority(e.target.value as RecommendationPriority)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
              >
                <option value="urgent">Urgent</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-700 font-medium mb-1">Adjusted Action Statement</label>
              <input
                type="text"
                value={modifiedTitle}
                onChange={(e) => setModifiedTitle(e.target.value)}
                className="w-full rounded-md border border-slate-300 bg-white px-3 py-1.5 text-xs text-slate-800"
              />
            </div>
          </div>
        )}

        {/* Rationale / Audit Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            {actionType === "reject" ? (
              <span className="text-rose-700 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Rejection Rationale (Mandatory)
              </span>
            ) : actionType === "modify" ? (
              <span className="text-amber-800 flex items-center gap-1">
                <AlertCircle className="h-3.5 w-3.5" />
                Reason for Modifications (Mandatory)
              </span>
            ) : (
              <span>Reviewer Approval Notes & Roadmap Directive (Optional)</span>
            )}
          </label>
          <textarea
            rows={3}
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
            placeholder={
              actionType === "reject"
                ? "State clear regulatory, budgetary, or operational reasons why this recommendation cannot be executed..."
                : actionType === "modify"
                ? "Explain why the priority or scope was adjusted before sign-off..."
                : "e.g. Sanctioned for Q4 curriculum revision cycle with state co-funding."
            }
            className="w-full rounded-md border border-slate-300 p-2.5 text-xs text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {errorMessage && (
          <div className="flex items-center gap-2 text-xs text-rose-700 bg-rose-50 p-2.5 rounded-md border border-rose-200">
            <ShieldAlert className="h-4 w-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-200">
          <Button type="button" variant="outline" size="sm" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button
            type="submit"
            size="sm"
            disabled={isSubmitting}
            className={
              actionType === "reject"
                ? "bg-rose-600 hover:bg-rose-700 text-white"
                : actionType === "modify"
                ? "bg-amber-600 hover:bg-amber-700 text-white"
                : "bg-emerald-600 hover:bg-emerald-700 text-white"
            }
          >
            {isSubmitting
              ? "Submitting Sign-Off..."
              : actionType === "reject"
              ? "Confirm Rejection"
              : actionType === "modify"
              ? "Sign-Off with Modifications"
              : "Confirm Approval"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
