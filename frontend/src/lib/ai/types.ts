import { z } from "zod";

/**
 * Raw output schema expected from LLM provider
 */
export const RawExtractedSkillSchema = z.object({
  name: z.string().min(1, "Skill name must not be empty"),
  category: z.string().default("technical"),
  proficiency: z.enum(["introductory", "intermediate", "advanced", "expert"]).default("intermediate"),
  evidence: z.string().min(1, "Evidence snippet from job description is mandatory"),
});

export const RawJobExtractionOutputSchema = z.object({
  role: z.string().min(1, "Role must not be empty"),
  skills: z.array(RawExtractedSkillSchema).min(1, "At least one skill must be extracted"),
  industry: z.string().default("technology"),
  location: z.string().default("Unspecified"),
  experience_level: z.string().default("mid_level"),
});

export type RawExtractedSkill = z.infer<typeof RawExtractedSkillSchema>;
export type RawJobExtractionOutput = z.infer<typeof RawJobExtractionOutputSchema>;

/**
 * Normalized Canonical Skill Entity
 */
export interface CanonicalSkillResult {
  rawName: string;
  canonicalName: string;
  slug: string;
  category: "technical" | "tool" | "soft_skill" | "domain_knowledge" | "compliance_standard";
  isEmerging: boolean;
  confidence: number;
  matchedVia: "exact_canonical" | "alias_dictionary" | "heuristic_normalized";
  isCanonical: boolean;
}

/**
 * Validated Skill with Grounding and Confidence
 */
export interface ValidatedSkill {
  name: string;
  canonical: CanonicalSkillResult;
  category: string;
  proficiency: "introductory" | "intermediate" | "advanced" | "expert";
  evidence: string;
  isGroundedInText: boolean;
  confidenceScore: number;
}

/**
 * Job Role Classification Output
 */
export interface RoleClassificationResult {
  standardizedTitle: string;
  sector: string;
  experienceLevel: "entry_level" | "mid_level" | "senior" | "lead" | "executive";
  minYearsEstimated: number;
  maxYearsEstimated: number;
  confidence: number;
}

/**
 * Final Production-Ready Extraction Result
 */
export interface JobExtractionResult {
  jobId?: string;
  originalDescription: string;
  scrubbedDescription: string;
  piiDetected: boolean;
  role: RoleClassificationResult;
  skills: ValidatedSkill[];
  industry: string;
  location: string;
  overallConfidence: number;
  needsReview: boolean;
  reviewReasons: string[];
  extractionDurationMs: number;
  providerUsed: string;
  extractedAt: string;
}

export interface ExtractionOptions {
  jobId?: string;
  timeoutMs?: number;
  maxRetries?: number;
  confidenceThreshold?: number; // default 0.70
  provider?: "groq" | "openai" | "heuristic";
  customProvider?: import("./provider").AIProvider;
}

