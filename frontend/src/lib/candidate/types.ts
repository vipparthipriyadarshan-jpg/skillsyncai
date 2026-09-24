/**
 * Skill Sync AI - Candidate Career Path Types
 * Problem Statement ID: 26134
 * 
 * Strict Constraint:
 * Do NOT guarantee employment or salary.
 * All career pathway recommendations are educational guideposts grounded in platform telemetry.
 */

export type SkillPriority = "critical" | "high" | "medium";

export type EntryProficiency = "introductory" | "intermediate" | "advanced" | "expert";

export interface RoleSkillRequirement {
  skillName: string;
  category: string;
  priority: SkillPriority;
  employerDemandPct: number; // e.g. 94% Tata/Mahindra consensus
  requiredProficiency: EntryProficiency;
  isPrerequisite?: boolean;
}

export interface TargetRole {
  id: string;
  title: string;
  sector: string;
  district: string;
  openVacancies: number;
  description: string;
  benchmarkSalaryBand: string; // Historical observation benchmark
  requiredSkills: RoleSkillRequirement[];
}

export interface CandidateProfile {
  id: string;
  name: string;
  currentTrade: string;
  currentSkills: string[];
  experienceYears: number;
}

export interface PracticalProject {
  id: string;
  title: string;
  description: string;
  toolsUsed: string[];
  estimatedHours: number;
  industryContext: string;
}

export interface RelevantCourse {
  code: string;
  name: string;
  hours: number;
  provider: string;
  practicalHoursRatio: string;
}

export interface CareerPathPhase {
  phaseNumber: number;
  phaseTitle: string;
  durationWeeks: number;
  learningObjectives: string[];
  skillsCovered: string[];
  recommendedCourse?: RelevantCourse;
  practicalProject?: PracticalProject;
  status: "completed" | "in_progress" | "upcoming";
}

export interface CandidateCareerPathAssessment {
  candidate: CandidateProfile;
  targetRole: TargetRole;
  matchScorePct: number;
  currentSkills: string[];
  missingSkills: RoleSkillRequirement[];
  employerRequiredSkills: RoleSkillRequirement[];
  phasedRoadmap: CareerPathPhase[];
  relevantCourses: RelevantCourse[];
  recommendedProjects: PracticalProject[];
  disclaimer: string;
}
