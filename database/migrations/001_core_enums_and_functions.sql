-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 001: Core Enums & Utility Functions
-- ==============================================================================

-- Modern PostgreSQL (v13+) provides native gen_random_uuid() in core

-- 1. System Stakeholder Roles
CREATE TYPE user_role AS ENUM (
  'admin',
  'government',
  'institution',
  'employer',
  'candidate'
);

-- 2. Industrial Trade / Technical Sectors
CREATE TYPE sector_type AS ENUM (
  'information_technology',
  'automotive_ev',
  'renewable_energy',
  'manufacturing_cnc',
  'healthcare_allied',
  'electronics_semiconductor',
  'construction_infrastructure',
  'logistics_supplychain'
);

-- 3. Skill Taxonomy Category
CREATE TYPE skill_category AS ENUM (
  'technical',
  'tool',
  'soft_skill',
  'domain_knowledge',
  'compliance_standard'
);

-- 4. Job Requirement Level
CREATE TYPE requirement_level_enum AS ENUM (
  'required',
  'preferred',
  'bonus'
);

-- 5. Proficiency / Targeted Skill Level
CREATE TYPE proficiency_level AS ENUM (
  'introductory',
  'intermediate',
  'advanced',
  'expert'
);

-- 6. Academic / Vocational Course Status
CREATE TYPE course_status AS ENUM (
  'active',
  'under_review',
  'revision_required',
  'deprecated',
  'proposed'
);

-- 7. Institution / Training Center Type
CREATE TYPE institution_type_enum AS ENUM (
  'iti_government',
  'iti_private',
  'polytechnic_college',
  'engineering_college',
  'pradhan_mantri_kushal_kendra',
  'vocational_training_provider'
);

-- 8. Trainer Status
CREATE TYPE trainer_status AS ENUM (
  'active',
  'on_leave',
  'reassigned',
  'upskilling_required',
  'inactive'
);

-- 9. Equipment Condition Rating
CREATE TYPE equipment_condition AS ENUM (
  'new_commissioned',
  'operational_good',
  'needs_maintenance',
  'non_operational',
  'obsolete'
);

-- 10. Employer Size Classification
CREATE TYPE employer_size_enum AS ENUM (
  'startup',
  'small_msme',
  'medium_enterprise',
  'large_multinational'
);

-- 11. Skill Demand Intensity
CREATE TYPE demand_intensity_enum AS ENUM (
  'low',
  'moderate',
  'high',
  'surging',
  'critical'
);

-- 12. Skill Gap Severity
CREATE TYPE gap_severity_enum AS ENUM (
  'aligned',
  'minor_shortage',
  'moderate_deficit',
  'critical_deficit',
  'oversupply'
);

-- 13. Recommendation Types
CREATE TYPE recommendation_type_enum AS ENUM (
  'add_curriculum_module',
  'prune_obsolete_module',
  'upskill_trainers',
  'procure_equipment',
  'expand_intake_capacity',
  'reduce_intake_capacity',
  'partner_with_industry'
);

-- 14. Recommendation Priority & Status
CREATE TYPE priority_enum AS ENUM (
  'low',
  'medium',
  'high',
  'urgent'
);

CREATE TYPE recommendation_status AS ENUM (
  'pending_review',
  'approved_by_board',
  'rejected',
  'implementation_in_progress',
  'completed'
);

-- 15. Job Posting Status & Type
CREATE TYPE posting_status AS ENUM (
  'active',
  'expired',
  'filled',
  'draft'
);

CREATE TYPE job_type_enum AS ENUM (
  'full_time',
  'part_time',
  'apprenticeship',
  'contract',
  'internship'
);

-- 16. Utility Trigger Function to automatically update updated_at
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;
