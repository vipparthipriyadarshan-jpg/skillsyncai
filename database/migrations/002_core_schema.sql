-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 002: Core Relational Schema (20 Tables)
-- ==============================================================================

-- 1. Districts (Geo-Hierarchy Master)
CREATE TABLE IF NOT EXISTS public.districts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  state TEXT NOT NULL,
  code TEXT UNIQUE,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_districts_name_state UNIQUE (name, state)
);

CREATE TRIGGER trg_districts_updated_at
  BEFORE UPDATE ON public.districts
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 2. Skills (Normalized Master Taxonomy)
CREATE TABLE IF NOT EXISTS public.skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT NOT NULL,
  category skill_category NOT NULL DEFAULT 'technical',
  is_emerging BOOLEAN NOT NULL DEFAULT FALSE,
  description TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_skills_name UNIQUE (name),
  CONSTRAINT uq_skills_slug UNIQUE (slug)
);

CREATE TRIGGER trg_skills_updated_at
  BEFORE UPDATE ON public.skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 3. Profiles (User Identity linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY, -- references auth.users(id) in Supabase deployment
  email TEXT NOT NULL,
  full_name TEXT,
  role user_role NOT NULL DEFAULT 'government',
  district_id UUID REFERENCES public.districts(id) ON DELETE SET NULL,
  organization_name TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 4. Employers (Industry Partners & Recruiters)
CREATE TABLE IF NOT EXISTS public.employers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
  company_name TEXT NOT NULL,
  sector sector_type NOT NULL,
  company_size employer_size_enum NOT NULL DEFAULT 'medium_enterprise',
  hr_contact_name TEXT,
  hr_contact_email TEXT,
  website_url TEXT,
  is_active_hiring BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_employers_name_district UNIQUE (company_name, district_id)
);

CREATE TRIGGER trg_employers_updated_at
  BEFORE UPDATE ON public.employers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 5. Training Centers (Vocational Institutions, ITIs, Polytechnics)
CREATE TABLE IF NOT EXISTS public.training_centers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
  name TEXT NOT NULL,
  code TEXT NOT NULL UNIQUE,
  institution_type institution_type_enum NOT NULL DEFAULT 'iti_government',
  contact_email TEXT,
  contact_phone TEXT,
  address TEXT,
  total_active_students INT NOT NULL DEFAULT 0 CHECK (total_active_students >= 0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_training_centers_updated_at
  BEFORE UPDATE ON public.training_centers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 6. Courses (Academic and Vocational Trade Curricula)
CREATE TABLE IF NOT EXISTS public.courses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id UUID NOT NULL REFERENCES public.training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  code TEXT NOT NULL,
  trade_sector sector_type NOT NULL,
  duration_hours INT NOT NULL CHECK (duration_hours > 0),
  duration_months NUMERIC(4,1) NOT NULL CHECK (duration_months > 0),
  annual_intake_capacity INT NOT NULL DEFAULT 40 CHECK (annual_intake_capacity >= 0),
  current_enrollment INT NOT NULL DEFAULT 0 CHECK (current_enrollment >= 0),
  syllabus_version TEXT NOT NULL DEFAULT '1.0',
  status course_status NOT NULL DEFAULT 'active',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_courses_center_code UNIQUE (training_center_id, code)
);

CREATE TRIGGER trg_courses_updated_at
  BEFORE UPDATE ON public.courses
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 7. Course Modules (Curricular Breakdown of Syllabus Topics)
CREATE TABLE IF NOT EXISTS public.course_modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  module_number INT NOT NULL CHECK (module_number > 0),
  title TEXT NOT NULL,
  description TEXT,
  theory_hours INT NOT NULL DEFAULT 0 CHECK (theory_hours >= 0),
  practical_hours INT NOT NULL DEFAULT 0 CHECK (practical_hours >= 0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_course_modules_num UNIQUE (course_id, module_number)
);

CREATE TRIGGER trg_course_modules_updated_at
  BEFORE UPDATE ON public.course_modules
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 8. Course Skills (M:N Normalized Mapping of Skills Taught in Courses)
CREATE TABLE IF NOT EXISTS public.course_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  proficiency_targeted proficiency_level NOT NULL DEFAULT 'intermediate',
  allocated_hours INT NOT NULL DEFAULT 10 CHECK (allocated_hours > 0),
  is_core BOOLEAN NOT NULL DEFAULT TRUE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_course_skills UNIQUE (course_id, skill_id)
);

CREATE TRIGGER trg_course_skills_updated_at
  BEFORE UPDATE ON public.course_skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 9. Trainers (Vocational Instructors & Faculty)
CREATE TABLE IF NOT EXISTS public.trainers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id UUID NOT NULL REFERENCES public.training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  qualification TEXT NOT NULL,
  years_of_experience NUMERIC(4,1) NOT NULL DEFAULT 0.0 CHECK (years_of_experience >= 0),
  status trainer_status NOT NULL DEFAULT 'active',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_trainers_updated_at
  BEFORE UPDATE ON public.trainers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 10. Trainer Skills (Instructor Competency Audit & Certifications)
CREATE TABLE IF NOT EXISTS public.trainer_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trainer_id UUID NOT NULL REFERENCES public.trainers(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  proficiency proficiency_level NOT NULL DEFAULT 'intermediate',
  certified_by TEXT,
  certified_at DATE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_trainer_skills UNIQUE (trainer_id, skill_id)
);

CREATE TRIGGER trg_trainer_skills_updated_at
  BEFORE UPDATE ON public.trainer_skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 11. Equipment (Practical Lab Machinery & Tools)
CREATE TABLE IF NOT EXISTS public.equipment (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  training_center_id UUID NOT NULL REFERENCES public.training_centers(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  trade_sector sector_type NOT NULL,
  model_specification TEXT,
  quantity_total INT NOT NULL DEFAULT 1 CHECK (quantity_total >= 0),
  quantity_operational INT NOT NULL DEFAULT 1 CHECK (quantity_operational >= 0 AND quantity_operational <= quantity_total),
  procurement_year INT CHECK (procurement_year >= 1990 AND procurement_year <= 2100),
  condition_rating equipment_condition NOT NULL DEFAULT 'operational_good',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_equipment_updated_at
  BEFORE UPDATE ON public.equipment
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 12. Job Postings (Real-World Labor Market Demand Signals)
CREATE TABLE IF NOT EXISTS public.job_postings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  sector sector_type NOT NULL,
  job_type job_type_enum NOT NULL DEFAULT 'full_time',
  experience_min_years NUMERIC(4,1) NOT NULL DEFAULT 0.0 CHECK (experience_min_years >= 0),
  experience_max_years NUMERIC(4,1) CHECK (experience_max_years IS NULL OR experience_max_years >= experience_min_years),
  salary_min NUMERIC(12,2) CHECK (salary_min IS NULL OR salary_min >= 0),
  salary_max NUMERIC(12,2) CHECK (salary_max IS NULL OR salary_max >= salary_min),
  vacancies_count INT NOT NULL DEFAULT 1 CHECK (vacancies_count > 0),
  raw_description TEXT,
  source_platform TEXT DEFAULT 'portal_upload',
  posting_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status posting_status NOT NULL DEFAULT 'active',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_job_postings_updated_at
  BEFORE UPDATE ON public.job_postings
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 13. Job Skills (Normalized Skills Extracted from Job Postings)
CREATE TABLE IF NOT EXISTS public.job_skills (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.job_postings(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE RESTRICT,
  requirement_level requirement_level_enum NOT NULL DEFAULT 'required',
  weight NUMERIC(3,2) NOT NULL DEFAULT 1.0 CHECK (weight > 0 AND weight <= 1.0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_job_skills UNIQUE (job_id, skill_id)
);

CREATE TRIGGER trg_job_skills_updated_at
  BEFORE UPDATE ON public.job_skills
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 14. Employer Feedback (Industry Validation of Trade Curricula)
CREATE TABLE IF NOT EXISTS public.employer_feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employer_id UUID NOT NULL REFERENCES public.employers(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  relevance_score INT NOT NULL CHECK (relevance_score >= 1 AND relevance_score <= 5),
  curriculum_modernity_score INT NOT NULL CHECK (curriculum_modernity_score >= 1 AND curriculum_modernity_score <= 5),
  hiring_intent_graduates INT NOT NULL DEFAULT 0 CHECK (hiring_intent_graduates >= 0),
  practical_readiness_rating INT CHECK (practical_readiness_rating >= 1 AND practical_readiness_rating <= 5),
  feedback_notes TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_employer_feedback_updated_at
  BEFORE UPDATE ON public.employer_feedback
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 15. Placements (Historical Graduate Employment & ROI Tracking)
CREATE TABLE IF NOT EXISTS public.placements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID NOT NULL REFERENCES public.courses(id) ON DELETE CASCADE,
  batch_year INT NOT NULL CHECK (batch_year >= 2015 AND batch_year <= 2035),
  total_graduates INT NOT NULL CHECK (total_graduates >= 0),
  placed_graduates INT NOT NULL CHECK (placed_graduates >= 0 AND placed_graduates <= total_graduates),
  avg_salary_monthly NUMERIC(10,2) CHECK (avg_salary_monthly IS NULL OR avg_salary_monthly >= 0),
  median_salary_monthly NUMERIC(10,2) CHECK (median_salary_monthly IS NULL OR median_salary_monthly >= 0),
  top_placement_partner TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_placements_course_batch UNIQUE (course_id, batch_year)
);

CREATE TRIGGER trg_placements_updated_at
  BEFORE UPDATE ON public.placements
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 16. Skill Trends (Aggregated Time-Series Demand by Skill & District)
CREATE TABLE IF NOT EXISTS public.skill_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  district_id UUID REFERENCES public.districts(id) ON DELETE CASCADE,
  time_period DATE NOT NULL,
  postings_volume INT NOT NULL DEFAULT 0 CHECK (postings_volume >= 0),
  growth_rate_pct NUMERIC(6,2) NOT NULL DEFAULT 0.0,
  demand_intensity demand_intensity_enum NOT NULL DEFAULT 'moderate',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_skill_trends UNIQUE (skill_id, district_id, time_period)
);

CREATE TRIGGER trg_skill_trends_updated_at
  BEFORE UPDATE ON public.skill_trends
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 17. Skill Gaps (Deterministic Math Deficits: Market Demand - Trained Supply)
CREATE TABLE IF NOT EXISTS public.skill_gaps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  skill_id UUID NOT NULL REFERENCES public.skills(id) ON DELETE CASCADE,
  sector sector_type NOT NULL,
  market_demand_volume INT NOT NULL DEFAULT 0 CHECK (market_demand_volume >= 0),
  trained_supply_volume INT NOT NULL DEFAULT 0 CHECK (trained_supply_volume >= 0),
  gap_net_delta INT GENERATED ALWAYS AS (market_demand_volume - trained_supply_volume) STORED,
  gap_severity gap_severity_enum NOT NULL DEFAULT 'moderate_deficit',
  calculated_date DATE NOT NULL DEFAULT CURRENT_DATE,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT uq_skill_gaps UNIQUE (district_id, skill_id, calculated_date)
);

CREATE TRIGGER trg_skill_gaps_updated_at
  BEFORE UPDATE ON public.skill_gaps
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 18. Recommendations (Auditable, Evidence-Based Recommendations)
CREATE TABLE IF NOT EXISTS public.recommendations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  skill_id UUID REFERENCES public.skills(id) ON DELETE SET NULL,
  recommendation_type recommendation_type_enum NOT NULL,
  priority priority_enum NOT NULL DEFAULT 'medium',
  evidence_summary TEXT NOT NULL,
  data_source_citation TEXT NOT NULL,
  estimated_cost_inr NUMERIC(12,2) CHECK (estimated_cost_inr IS NULL OR estimated_cost_inr >= 0),
  status recommendation_status NOT NULL DEFAULT 'pending_review',
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_recommendations_updated_at
  BEFORE UPDATE ON public.recommendations
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 19. Simulation Scenarios (Policy & Budget Parameters for What-If Modeling)
CREATE TABLE IF NOT EXISTS public.simulation_scenarios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  description TEXT,
  district_id UUID NOT NULL REFERENCES public.districts(id) ON DELETE CASCADE,
  target_sector sector_type NOT NULL,
  budget_allocation_inr NUMERIC(14,2) NOT NULL CHECK (budget_allocation_inr >= 0),
  capacity_multiplier NUMERIC(4,2) NOT NULL DEFAULT 1.0 CHECK (capacity_multiplier > 0),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_simulation_scenarios_updated_at
  BEFORE UPDATE ON public.simulation_scenarios
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- 20. Simulation Results (Projected Placement & Bottlenecks Output)
CREATE TABLE IF NOT EXISTS public.simulation_results (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  scenario_id UUID NOT NULL REFERENCES public.simulation_scenarios(id) ON DELETE CASCADE,
  projected_placement_rate NUMERIC(5,2) NOT NULL CHECK (projected_placement_rate >= 0 AND projected_placement_rate <= 100),
  baseline_placement_rate NUMERIC(5,2) NOT NULL CHECK (baseline_placement_rate >= 0 AND baseline_placement_rate <= 100),
  net_placement_gain_pct NUMERIC(5,2) NOT NULL,
  trainers_requiring_upskilling INT NOT NULL DEFAULT 0 CHECK (trainers_requiring_upskilling >= 0),
  equipment_capex_deficit_inr NUMERIC(12,2) NOT NULL DEFAULT 0 CHECK (equipment_capex_deficit_inr >= 0),
  estimated_absorption_months NUMERIC(4,1) NOT NULL DEFAULT 6.0 CHECK (estimated_absorption_months > 0),
  bottlenecks_identified TEXT,
  computed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_simulation_results_updated_at
  BEFORE UPDATE ON public.simulation_results
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
