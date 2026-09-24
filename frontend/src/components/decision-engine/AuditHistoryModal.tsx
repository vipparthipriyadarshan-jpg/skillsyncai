"use client";

import React from "react";
import { Modal } from "@/components/shared/Modal";
import { ActionRecommendation } from "@/lib/decision-engine/types";
import { History, ShieldCheck, Clock, UserCheck, AlertCircle, FileEdit } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AuditHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  recommendation: ActionRecommendation | null;
}

export function AuditHistoryModal({
  isOpen,
  onClose,
  recommendation,
}: AuditHistoryModalProps) {
  if (!recommendation) return null;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "approved":
        return <Badge variant="success">Approved</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "modified":
        return <Badge variant="warning">Modified & Approved</Badge>;
      case "pending":
      default:
        return <Badge variant="outline">Pending Review</Badge>;
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Recommendation Audit History"
      description={`Tracking governance and human reviews for ${recommendation.affectedCourse.code} (${recommendation.affectedDistrict.name})`}
      size="lg"
    >
      <div className="space-y-6 pt-2">
        {/* Recommendation context banner */}
        <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50 text-xs">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="font-semibold text-slate-800 text-sm">
              {recommendation.recommendation}
            </span>
            {getStatusBadge(recommendation.status)}
          </div>
          <p className="text-slate-500 line-clamp-2">{recommendation.reason}</p>
        </div>

        {/* Audit Timeline */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5 text-slate-400" />
            Audit Trail ({recommendation.auditHistory.length} Recorded Events)
          </h4>

          <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
            {recommendation.auditHistory.map((entry) => (
              <div key={entry.id} className="relative group">
                {/* Timeline node icon */}
                <div className="absolute -left-6 top-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-white border-2 border-slate-300 group-hover:border-blue-500 transition-colors">
                  {entry.newStatus === "approved" ? (
                    <ShieldCheck className="h-3 w-3 text-emerald-600" />
                  ) : entry.newStatus === "rejected" ? (
                    <AlertCircle className="h-3 w-3 text-rose-600" />
                  ) : entry.newStatus === "modified" ? (
                    <FileEdit className="h-3 w-3 text-amber-600" />
                  ) : (
                    <Clock className="h-3 w-3 text-slate-400" />
                  )}
                </div>

                <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-slate-800 flex items-center gap-1">
                        <UserCheck className="h-3 w-3 text-blue-600" />
                        {entry.actorName}
                      </span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-slate-100 text-slate-600 border border-slate-200">
                        {entry.actorRole}
                      </span>
                    </div>
                    <time className="text-[11px] text-slate-400">
                      {new Date(entry.timestamp).toLocaleString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </time>
                  </div>

                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-slate-500">Status transition:</span>
                    <span className="text-slate-400 line-through text-[11px]">{entry.previousStatus}</span>
                    <span className="text-slate-400">→</span>
                    {getStatusBadge(entry.newStatus)}
                  </div>

                  {entry.modificationSummary && (
                    <div className="text-xs p-2 rounded bg-amber-50 border border-amber-200 text-amber-900">
                      <span className="font-semibold">Modifications: </span>
                      {entry.modificationSummary}
                    </div>
                  )}

                  <div className="text-xs text-slate-700 bg-slate-50 p-2.5 rounded border border-slate-100">
                    <span className="font-medium text-slate-900">Rationale / Decision Notes: </span>
                    {entry.rationale}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
}
