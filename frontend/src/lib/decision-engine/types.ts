/**
 * Skill Sync AI - Decision Engine Type Definitions
 * Problem Statement ID: 26134
 * 
 * Synthesizes 7 core inputs:
 * 1. Skill Demand
 * 2. Curriculum Gap
 * 3. Employer Validation
 * 4. Trainer Readiness
 * 5. Equipment Availability
 * 6. Training Capacity
 * 7. Placement Outcomes
 * 
 * To generate explainable, auditable recommendations across 10 actions for human review.
 */

export type ActionType =
  | "add_curriculum_module"
  | "update_curriculum_module"
  | "increase_practical_hours"
  | "upskill_trainers"
  | "procure_equipment"
  | "increase_training_capacity"
  | "reduce_capacity"
  | "review_obsolete_course"
  | "partner_with_employers"
  | "create_candidate_learning_path";

export const ACTION_TYPE_LABELS: Record<ActionType, { label: string; iconName: string; category: string }> = {
  add_curriculum_module: {
    label: "Add Curriculum Module",
    iconName: "PlusCircle",
    category: "Curriculum Intervention",
  },
  update_curriculum_module: {
    label: "Update Curriculum Module",
    iconName: "FileEdit",
    category: "Curriculum Intervention",
  },
  increase_practical_hours: {
    label: "Increase Practical Hours",
    iconName: "Clock",
    category: "Pedagogy & Hours",
  },
  upskill_trainers: {
    label: "Upskill Trainers",
    iconName: "GraduationCap",
    category: "Faculty Readiness",
  },
  procure_equipment: {
    label: "Procure Equipment",
    iconName: "Wrench",
    category: "Infrastructure & Labs",
  },
  increase_training_capacity: {
    label: "Increase Training Capacity",
    iconName: "TrendingUp",
    category: "Capacity Planning",
  },
  reduce_capacity: {
    label: "Reduce Capacity",
    iconName: "TrendingDown",
    category: "Capacity Planning",
  },
  review_obsolete_course: {
    label: "Review Obsolete Course",
    iconName: "AlertOctagon",
    category: "Course Deprecation",
  },
  partner_with_employers: {
    label: "Partner with Employers",
    iconName: "Handshake",
    category: "Industry Partnerships",
  },
  create_candidate_learning_path: {
    label: "Create Candidate Learning Path",
    iconName: "Compass",
    category: "Student Upskilling",
  },
};

export type RecommendationPriority = "urgent" | "high" | "medium" | "low";

export type RecommendationStatus = "pending" | "approved" | "rejected" | "modified";

export interface SupportingMetrics {
  skillDemandVolume: number; // e.g. Open vacancies in district
  demandGrowthRate: number; // e.g. +900% or -85%
  curriculumCoveragePct: number; // 0 - 100%
  curriculumGapPct: number; // 0 - 100%
  employerValidationScore: number; // 0 - 100% agreement on critical need
  trainerReadinessPct: number; // 0 - 100% certified/qualified faculty
  equipmentAvailabilityPct: number; // 0 - 100% lab apparatus availability
  capacityUtilizationPct: number; // 0 - 100% current seat intake fill rate
  placementRatePct: number; // 0 - 100% graduate placement rate
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  previousStatus: RecommendationStatus;
  newStatus: RecommendationStatus;
  modificationSummary?: string;
  rationale: string;
}

export interface AffectedDistrict {
  id: string;
  name: string;
  state: string;
}

export interface AffectedCourse {
  id: string;
  code: string;
  name: string;
  sector: string;
}

export interface AffectedSkill {
  id: string;
  name: string;
  category: string;
}

export interface ActionRecommendation {
  id: string;
  actionType: ActionType;
  recommendation: string; // Action statement/title
  reason: string; // Why this recommendation is generated
  evidence: string; // Citations, employer quotes, data sources
  priority: RecommendationPriority;
  affectedDistrict: AffectedDistrict;
  affectedCourse: AffectedCourse;
  affectedSkill: AffectedSkill;
  confidence: number; // 0.0 to 1.0 (derived deterministically)
  supportingMetrics: SupportingMetrics;
  status: RecommendationStatus;
  auditHistory: AuditEntry[];
  createdAt: string;
  updatedAt: string;
}

export interface DecisionEngineSummary {
  totalRecommendations: number;
  pendingReviewCount: number;
  approvedCount: number;
  rejectedCount: number;
  modifiedCount: number;
  urgentCount: number;
  highCount: number;
  byActionType: Record<ActionType, number>;
}
