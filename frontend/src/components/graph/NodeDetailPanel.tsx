"use client";

import React from "react";
import {
  X,
  ArrowRight,
  ArrowLeft,
  Briefcase,
  Sparkles,
  GraduationCap,
  BookOpen,
  Users,
  Building2,
  MapPin,
  Building,
  CheckCircle,
  ExternalLink,
  LucideIcon,
} from "lucide-react";
import { GraphNodeType, NodeDetailInspection } from "@/lib/graph/types";

interface NodeDetailPanelProps {
  inspection: NodeDetailInspection | null;
  onClose: () => void;
  onSelectNode: (nodeId: string) => void;
}

const TYPE_CONFIG: Record<GraphNodeType, { label: string; icon: LucideIcon; color: string }> = {
  district: { label: "District", icon: MapPin, color: "text-amber-600 dark:text-amber-400" },
  training_center: { label: "Training Center", icon: Building2, color: "text-sky-600 dark:text-sky-400" },
  course: { label: "Course", icon: GraduationCap, color: "text-blue-600 dark:text-blue-400" },
  module: { label: "Module", icon: BookOpen, color: "text-slate-600 dark:text-slate-400" },
  trainer: { label: "Trainer", icon: Users, color: "text-emerald-600 dark:text-emerald-400" },
  employer: { label: "Employer", icon: Building, color: "text-rose-600 dark:text-rose-400" },
  job_role: { label: "Job Role", icon: Briefcase, color: "text-purple-600 dark:text-purple-400" },
  skill: { label: "Skill", icon: Sparkles, color: "text-indigo-600 dark:text-indigo-400" },
};

export const NodeDetailPanel: React.FC<NodeDetailPanelProps> = ({
  inspection,
  onClose,
  onSelectNode,
}) => {
  if (!inspection) return null;

  const { node, incomingEdges, outgoingEdges, relatedNodesCount } = inspection;
  const config = TYPE_CONFIG[node.nodeType] || TYPE_CONFIG.skill;
  const Icon = config.icon;

  return (
    <aside className="w-96 flex-shrink-0 border-l border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-2xl flex flex-col h-full z-40 transition-all">
      {/* Header */}
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-950/40">
        <div className="flex items-center gap-2.5">
          <div className={`p-2 rounded-lg bg-slate-100 dark:bg-slate-800 ${config.color}`}>
            <Icon className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {config.label}
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-tight line-clamp-1">
              {node.label}
            </h3>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-md text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Close details"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs text-slate-600 dark:text-slate-300">
        {/* Core Attributes Card */}
        <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-950/30 p-3 space-y-2">
          {node.sublabel && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Identifier / Subtitle:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">{node.sublabel}</span>
            </div>
          )}
          {node.district && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">District:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">📍 {node.district}</span>
            </div>
          )}
          {node.sector && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Sector:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200 capitalize">
                {node.sector.replace("_", " ")}
              </span>
            </div>
          )}
          {node.metrics?.vacancies !== undefined && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Open Vacancies:</span>
              <span className="font-bold text-purple-600 dark:text-purple-400">{node.metrics.vacancies} positions</span>
            </div>
          )}
          {node.metrics?.salaryRange && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Salary Band:</span>
              <span className="font-semibold text-emerald-600 dark:text-emerald-400">{node.metrics.salaryRange}</span>
            </div>
          )}
          {node.metrics?.durationHours !== undefined && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Total Duration:</span>
              <span className="font-semibold text-blue-600 dark:text-blue-400">{node.metrics.durationHours} hours</span>
            </div>
          )}
          {node.metrics?.activeStudents !== undefined && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Active Enrolled:</span>
              <span className="font-semibold text-sky-600 dark:text-sky-400">{node.metrics.activeStudents} students</span>
            </div>
          )}
          {node.metrics?.practicalHours !== undefined && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Practical / Theory:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {node.metrics.practicalHours}h practical / {node.metrics.theoryHours}h theory
              </span>
            </div>
          )}
          {node.metrics?.isEmerging && (
            <div className="flex justify-between items-center py-0.5">
              <span className="text-slate-500 font-medium">Market Status:</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-400">⚡ Surging Emerging Skill</span>
            </div>
          )}
          {node.attributes?.description && (
            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                {String(node.attributes.description)}
              </p>
            </div>
          )}
        </div>

        {/* Dynamic Relational Connections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
              Connected Relationships ({relatedNodesCount})
            </h4>
            <span className="text-[10px] text-slate-400">From relational database</span>
          </div>

          {/* Incoming Connections */}
          {incomingEdges.length > 0 && (
            <div className="mb-3 space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ArrowRight className="w-3 h-3 text-slate-400" /> Incoming ({incomingEdges.length}):
              </span>
              <div className="space-y-1">
                {incomingEdges.map(({ edge, sourceNode }) => {
                  const edgeSourceConfig = TYPE_CONFIG[sourceNode.nodeType] || TYPE_CONFIG.skill;
                  return (
                    <button
                      key={edge.id}
                      onClick={() => onSelectNode(sourceNode.id)}
                      className="w-full text-left p-2 rounded-md bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between group"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          <span className={edgeSourceConfig.color}>{edgeSourceConfig.label}</span>
                          <span>•</span>
                          <span className="italic">{edge.label || edge.data.relationType}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {sourceNode.label}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Outgoing Connections */}
          {outgoingEdges.length > 0 && (
            <div className="space-y-1.5">
              <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <ArrowLeft className="w-3 h-3 text-slate-400" /> Outgoing ({outgoingEdges.length}):
              </span>
              <div className="space-y-1">
                {outgoingEdges.map(({ edge, targetNode }) => {
                  const edgeTargetConfig = TYPE_CONFIG[targetNode.nodeType] || TYPE_CONFIG.skill;
                  return (
                    <button
                      key={edge.id}
                      onClick={() => onSelectNode(targetNode.id)}
                      className="w-full text-left p-2 rounded-md bg-slate-100/70 dark:bg-slate-800/60 hover:bg-slate-200/70 dark:hover:bg-slate-700/60 transition-colors flex items-center justify-between group"
                    >
                      <div className="overflow-hidden pr-2">
                        <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1">
                          <span className="italic">{edge.label || edge.data.relationType}</span>
                          <span>•</span>
                          <span className={edgeTargetConfig.color}>{edgeTargetConfig.label}</span>
                        </div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-blue-600 dark:group-hover:text-blue-400">
                          {targetNode.label}
                        </p>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 flex-shrink-0" />
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {incomingEdges.length === 0 && outgoingEdges.length === 0 && (
            <p className="text-[11px] text-slate-400 italic py-2">
              No direct connections active under current filter settings.
            </p>
          )}
        </div>
      </div>

      {/* Footer / Database Origin Tag */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-slate-950/60 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
        <span className="flex items-center gap-1">
          <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> Grounded in relational DB
        </span>
        <span className="font-mono text-[10px]">{node.entityId}</span>
      </div>
    </aside>
  );
};
