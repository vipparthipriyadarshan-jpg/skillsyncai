/**
 * Skill Sync AI - Employer Validation Types
 * Problem Statement ID: 26134
 * 
 * Strict Guideline:
 * All feedback and statistics must be presented as "Employer Validation Evidence".
 * Do NOT refer to this data as "truth" or "ground truth".
 */

export type ValidationStance = "confirmed" | "modified" | "rejected";

export type HiringDifficulty = "low" | "moderate" | "high" | "acute_shortage";

export type EntryProficiency = "introductory" | "intermediate" | "advanced" | "expert";

export interface EmployerProfile {
  id: string;
  name: string;
  sector: string;
  district: string;
  contactPerson: string;
  designation: string;
  employeeCount: number;
}

export interface EmployerValidationResponse {
  id: string;
  recommendationId: string;
  employerId: string;
  employerName: string;
  district: string;
  sector: string;
  reviewerName: string;
  reviewerDesignation: string;
  stance: ValidationStance;
  hiringDifficulty: HiringDifficulty;
  validatedProficiency: EntryProficiency;
  identifiedImportantSkills: string[];
  feedbackComments: string;
  proposedModifications?: string;
  timestamp: string;
  auditId: string;
}

export interface ValidationStatistics {
  totalReviews: number;
  confirmedCount: number;
  modifiedCount: number;
  rejectedCount: number;
  confirmationPercentage: number; // 0 - 100
  displayRatio: string; // e.g. "8 of 10 employers confirmed"
  displayPercentage: string; // e.g. "80% Employer Confirmation"
  hiringDifficultyDistribution: Record<HiringDifficulty, number>;
  dominantHiringDifficulty: HiringDifficulty;
  dominantProficiencyRequirement: EntryProficiency;
  topImportantSkills: { name: string; count: number }[];
}

export interface EmployerAuditRecord {
  id: string;
  timestamp: string;
  employerName: string;
  actorName: string;
  actorDesignation: string;
  action: "confirmed" | "modified" | "rejected";
  recommendationId: string;
  recommendationTitle: string;
  summary: string;
}

export interface IndustryRecommendationView {
  id: string;
  recommendation: string;
  actionType: string;
  reason: string;
  affectedCourseCode: string;
  affectedCourseName: string;
  affectedSkillName: string;
  sector: string;
  district: string;
  validationStats: ValidationStatistics;
  recentResponses: EmployerValidationResponse[];
}
