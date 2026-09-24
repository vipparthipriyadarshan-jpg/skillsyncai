/**
 * User roles and permission matrix for Skill Sync AI.
 */

export type UserRole =
  | "admin"
  | "government"
  | "institution"
  | "employer"
  | "candidate";

export interface RoleConfig {
  id: UserRole;
  label: string;
  description: string;
  badgeColor: string;
  badgeBg: string;
  badgeBorder: string;
}

export const USER_ROLES: Record<UserRole, RoleConfig> = {
  admin: {
    id: "admin",
    label: "Platform Admin",
    description: "Full system control, schema configuration, user management, and raw data ingestion.",
    badgeColor: "text-purple-700",
    badgeBg: "bg-purple-50",
    badgeBorder: "border-purple-200",
  },
  government: {
    id: "government",
    label: "Government / Policymaker",
    description: "Macro-level district intelligence, resource allocation, and policy simulation.",
    badgeColor: "text-blue-800",
    badgeBg: "bg-blue-50",
    badgeBorder: "border-blue-200",
  },
  institution: {
    id: "institution",
    label: "Training Institution",
    description: "Curriculum audits, trainer qualification gap tracking, and equipment readiness.",
    badgeColor: "text-teal-800",
    badgeBg: "bg-teal-50",
    badgeBorder: "border-teal-200",
  },
  employer: {
    id: "employer",
    label: "Industry Employer",
    description: "Post hiring requirements, validate course curricula, and access talent pipelines.",
    badgeColor: "text-amber-800",
    badgeBg: "bg-amber-50",
    badgeBorder: "border-amber-200",
  },
  candidate: {
    id: "candidate",
    label: "Workforce Candidate",
    description: "Personalized skill gap assessment, market-aligned career pathways, and training options.",
    badgeColor: "text-emerald-800",
    badgeBg: "bg-emerald-50",
    badgeBorder: "border-emerald-200",
  },
};

export const DEFAULT_ROLE: UserRole = "government";

export function isValidRole(role: string): role is UserRole {
  return Object.keys(USER_ROLES).includes(role);
}
