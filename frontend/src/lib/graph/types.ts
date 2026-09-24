/**
 * Skill Sync AI - Skill Graph Types
 * Problem Statement ID: 26134
 * 
 * Supports 8 Relational Node Types & Semantic Relational Edges:
 * Nodes: Job Role, Skill, Course, Module, Trainer, Training Center, District, Employer
 * Edges: Job -> Requires Skill, Course -> Teaches Skill, Trainer -> Has Skill,
 *        Center -> Offers Course, Employer -> Requires Skill, District -> Contains Center, etc.
 */

export type GraphNodeType =
  | "job_role"
  | "skill"
  | "course"
  | "module"
  | "trainer"
  | "training_center"
  | "district"
  | "employer";

export type GraphEdgeType =
  | "requires_skill"      // Job Role -> Skill, Employer -> Skill
  | "teaches_skill"       // Course -> Skill
  | "has_skill"           // Trainer -> Skill
  | "offers_course"       // Training Center -> Course
  | "contains_center"     // District -> Training Center
  | "has_module"          // Course -> Module
  | "employs_trainer"     // Training Center -> Trainer
  | "posts_job"           // Employer -> Job Role
  | "contains_employer";  // District -> Employer

export interface GraphNodeMetrics {
  vacancies?: number;
  durationHours?: number;
  intakeCapacity?: number;
  activeStudents?: number;
  experienceYears?: number;
  theoryHours?: number;
  practicalHours?: number;
  proficiency?: "introductory" | "intermediate" | "advanced" | "expert";
  isEmerging?: boolean;
  category?: string;
  salaryRange?: string;
}

export interface GraphNodeData {
  id: string;
  label: string;
  sublabel?: string;
  nodeType: GraphNodeType;
  sector?: string;
  district?: string;
  entityId: string;
  metrics?: GraphNodeMetrics;
  attributes?: Record<string, string | number | boolean | undefined>;
  matched?: boolean;      // For search highlight
  isDimmed?: boolean;     // For filter/focus dimming
}

export interface GraphEdgeData {
  relationType: GraphEdgeType;
  label?: string;
  weight?: number;
  proficiency?: string;
}

export interface SkillGraphNode {
  id: string;
  type: "custom";
  position: { x: number; y: number };
  data: GraphNodeData;
}

export interface SkillGraphEdge {
  id: string;
  source: string;
  target: string;
  type?: string;
  animated?: boolean;
  label?: string;
  data: GraphEdgeData;
  style?: React.CSSProperties;
}

export interface SkillGraphSummary {
  totalNodes: number;
  totalEdges: number;
  byNodeType: Record<GraphNodeType, number>;
  byEdgeType: Record<GraphEdgeType, number>;
  sectors: string[];
  districts: string[];
}

export interface GraphFilterParams {
  searchQuery?: string;
  sector?: string;
  district?: string;
  nodeTypes?: GraphNodeType[];
}

export interface NodeDetailInspection {
  node: GraphNodeData;
  incomingEdges: { edge: SkillGraphEdge; sourceNode: GraphNodeData }[];
  outgoingEdges: { edge: SkillGraphEdge; targetNode: GraphNodeData }[];
  relatedNodesCount: number;
}
