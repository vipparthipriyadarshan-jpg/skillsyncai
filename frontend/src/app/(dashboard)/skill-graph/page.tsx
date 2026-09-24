"use client";

import React, { useState, useEffect, useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
  useReactFlow,
  Node,
  Edge,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";

import { CustomGraphNode } from "@/components/graph/CustomGraphNode";
import { GraphToolbar } from "@/components/graph/GraphToolbar";
import { NodeDetailPanel } from "@/components/graph/NodeDetailPanel";
import { buildSkillGraph, inspectNode } from "@/lib/graph/service";
import {
  GraphNodeType,
  NodeDetailInspection,
  SkillGraphSummary,
} from "@/lib/graph/types";
import { Network, Database, Sparkles } from "lucide-react";

// Register custom node component
const nodeTypes = {
  custom: CustomGraphNode,
};

function SkillGraphCanvas() {
  const reactFlowInstance = useReactFlow();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSector, setSelectedSector] = useState("all");
  const [selectedDistrict, setSelectedDistrict] = useState("all");
  const [activeNodeTypes, setActiveNodeTypes] = useState<Set<GraphNodeType>>(
    new Set<GraphNodeType>([
      "district",
      "training_center",
      "course",
      "module",
      "trainer",
      "employer",
      "job_role",
      "skill",
    ])
  );

  // Selected Node Inspection State
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [inspection, setInspection] = useState<NodeDetailInspection | null>(null);

  // Summary & Options
  const [summary, setSummary] = useState<SkillGraphSummary | null>(null);
  const [sectors, setSectors] = useState<string[]>([]);
  const [districts, setDistricts] = useState<string[]>([]);

  // React Flow Nodes & Edges State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Generate Graph from Relational Database
  const refreshGraph = useCallback(() => {
    const result = buildSkillGraph({
      searchQuery,
      sector: selectedSector,
      district: selectedDistrict,
      nodeTypes: Array.from(activeNodeTypes),
    });

    // Style and configure edges for high performance and visual clarity
    const formattedEdges: Edge[] = result.edges.map((e) => {
      const isSkillRelation =
        e.data.relationType === "teaches_skill" || e.data.relationType === "requires_skill";
      const isTrainerSkill = e.data.relationType === "has_skill";

      return {
        ...e,
        animated: isSkillRelation,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 14,
          height: 14,
          color: isSkillRelation ? "#6366f1" : isTrainerSkill ? "#10b981" : "#94a3b8",
        },
        style: {
          stroke: isSkillRelation ? "#818cf8" : isTrainerSkill ? "#34d399" : "#cbd5e1",
          strokeWidth: isSkillRelation ? 2 : 1.5,
          opacity: 0.8,
        },
      };
    });

    // Map nodes to ReactFlow format with selected state
    const formattedNodes: Node[] = result.nodes.map((n) => ({
      ...n,
      selected: n.id === selectedNodeId,
    }));

    setNodes(formattedNodes);
    setEdges(formattedEdges);
    setSummary(result.summary);
    setSectors(result.sectors);
    setDistricts(result.districts);

    // Update inspection if a node is currently selected
    if (selectedNodeId) {
      const insp = inspectNode(selectedNodeId, result.nodes, result.edges);
      setInspection(insp);
    }
  }, [searchQuery, selectedSector, selectedDistrict, activeNodeTypes, selectedNodeId, setNodes, setEdges]);

  // Initial load and whenever filters change
  useEffect(() => {
    refreshGraph();
  }, [refreshGraph]);

  // Handle Node Selection
  const handleNodeClick = useCallback(
    (_: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
      const graphData = buildSkillGraph({
        searchQuery,
        sector: selectedSector,
        district: selectedDistrict,
        nodeTypes: Array.from(activeNodeTypes),
      });
      const insp = inspectNode(node.id, graphData.nodes, graphData.edges);
      setInspection(insp);
    },
    [searchQuery, selectedSector, selectedDistrict, activeNodeTypes]
  );

  // Jump to / Select Node from Drawer
  const handleSelectNodeFromDrawer = useCallback(
    (nodeId: string) => {
      setSelectedNodeId(nodeId);
      const targetNode = nodes.find((n) => n.id === nodeId);
      if (targetNode && reactFlowInstance) {
        reactFlowInstance.setCenter(targetNode.position.x + 120, targetNode.position.y + 60, {
          duration: 800,
          zoom: 1.1,
        });
      }
      const graphData = buildSkillGraph({
        searchQuery,
        sector: selectedSector,
        district: selectedDistrict,
        nodeTypes: Array.from(activeNodeTypes),
      });
      const insp = inspectNode(nodeId, graphData.nodes, graphData.edges);
      setInspection(insp);
    },
    [nodes, reactFlowInstance, searchQuery, selectedSector, selectedDistrict, activeNodeTypes]
  );

  // Toggle Node Type Filter
  const handleToggleNodeType = (type: GraphNodeType) => {
    setActiveNodeTypes((prev) => {
      const next = new Set(prev);
      if (next.has(type)) {
        if (next.size > 1) {
          next.delete(type);
        }
      } else {
        next.add(type);
      }
      return next;
    });
  };

  // Reset Filters
  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedSector("all");
    setSelectedDistrict("all");
    setActiveNodeTypes(
      new Set<GraphNodeType>([
        "district",
        "training_center",
        "course",
        "module",
        "trainer",
        "employer",
        "job_role",
        "skill",
      ])
    );
    setSelectedNodeId(null);
    setInspection(null);
    setTimeout(() => {
      reactFlowInstance.fitView({ padding: 0.15, duration: 600 });
    }, 50);
  };

  // Fit View
  const handleFitView = () => {
    reactFlowInstance.fitView({ padding: 0.15, duration: 600 });
  };

  // Close Detail Drawer
  const handleCloseDrawer = () => {
    setSelectedNodeId(null);
    setInspection(null);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] overflow-hidden bg-slate-50 dark:bg-slate-950">
      {/* Top Header / Context Strip */}
      <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Network className="w-5 h-5" />
            </div>
            <h1 className="text-lg font-bold text-slate-900 dark:text-slate-100">
              Vocational Skill Graph
            </h1>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800 flex items-center gap-1">
              <Database className="w-2.5 h-2.5" /> Database-Generated
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Interactive multi-entity network mapping relationships between Districts, Centers, Courses, Modules, Trainers, Employers, Jobs, and Skills.
          </p>
        </div>

        {/* Legend Quick Reference */}
        <div className="hidden xl:flex items-center gap-2 text-[11px] text-slate-600 dark:text-slate-400">
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-indigo-500" /> Relational Flow:
          </span>
          <span className="px-1.5 py-0.5 rounded bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300">District</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-sky-50 dark:bg-sky-950/50 text-sky-700 dark:text-sky-300">Center</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300">Course</span>
          <span>→</span>
          <span className="px-1.5 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 font-bold">Skill</span>
          <span>←</span>
          <span className="px-1.5 py-0.5 rounded bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300">Job Role</span>
          <span>←</span>
          <span className="px-1.5 py-0.5 rounded bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300">Employer</span>
        </div>
      </div>

      {/* Filter & Search Toolbar */}
      <GraphToolbar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedSector={selectedSector}
        onSectorChange={setSelectedSector}
        selectedDistrict={selectedDistrict}
        onDistrictChange={setSelectedDistrict}
        activeNodeTypes={activeNodeTypes}
        onToggleNodeType={handleToggleNodeType}
        onResetFilters={handleResetFilters}
        onFitView={handleFitView}
        summary={summary}
        sectors={sectors}
        districts={districts}
      />

      {/* React Flow Canvas and Detail Panel */}
      <div className="flex-1 relative flex overflow-hidden">
        <div className="flex-1 h-full w-full">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onNodeClick={handleNodeClick}
            nodeTypes={nodeTypes}
            fitView
            fitViewOptions={{ padding: 0.15 }}
            minZoom={0.2}
            maxZoom={2.0}
            defaultViewport={{ x: 0, y: 0, zoom: 0.75 }}
            onlyRenderVisibleElements={true}
            proOptions={{ hideAttribution: true }}
            className="bg-slate-50 dark:bg-slate-950"
          >
            <Background color="#94a3b8" gap={20} size={1} />
            <Controls
              className="!bg-white dark:!bg-slate-900 !border !border-slate-200 dark:!border-slate-800 !rounded-lg !shadow-md"
              showInteractive={false}
            />
            <MiniMap
              className="!bg-white/80 dark:!bg-slate-900/80 !border !border-slate-200 dark:!border-slate-800 !rounded-lg !shadow-lg"
              nodeColor={(node) => {
                switch (node.data?.nodeType) {
                  case "district": return "#f59e0b";
                  case "training_center": return "#0284c7";
                  case "course": return "#2563eb";
                  case "module": return "#64748b";
                  case "trainer": return "#10b981";
                  case "employer": return "#f43f5e";
                  case "job_role": return "#9333ea";
                  case "skill": return "#4f46e5";
                  default: return "#64748b";
                }
              }}
              nodeStrokeWidth={3}
              zoomable
              pannable
            />
          </ReactFlow>
        </div>

        {/* Slide-over Inspection Panel */}
        {inspection && (
          <NodeDetailPanel
            inspection={inspection}
            onClose={handleCloseDrawer}
            onSelectNode={handleSelectNodeFromDrawer}
          />
        )}
      </div>
    </div>
  );
}

export default function SkillGraphPage() {
  return (
    <ReactFlowProvider>
      <SkillGraphCanvas />
    </ReactFlowProvider>
  );
}
