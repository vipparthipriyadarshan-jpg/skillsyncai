-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 003: Performance Indexes
-- ==============================================================================

-- 1. Job Posting Date & Location Indexes
CREATE INDEX IF NOT EXISTS idx_job_postings_posting_date
  ON public.job_postings(posting_date DESC);

CREATE INDEX IF NOT EXISTS idx_job_postings_district
  ON public.job_postings(district_id);

CREATE INDEX IF NOT EXISTS idx_job_postings_sector
  ON public.job_postings(sector);

CREATE INDEX IF NOT EXISTS idx_job_postings_status
  ON public.job_postings(status);

CREATE INDEX IF NOT EXISTS idx_job_postings_employer
  ON public.job_postings(employer_id);

-- 2. Skill Indexes (Search, Taxonomy & M:N relations)
CREATE INDEX IF NOT EXISTS idx_skills_category
  ON public.skills(category);

CREATE INDEX IF NOT EXISTS idx_skills_is_emerging
  ON public.skills(is_emerging) WHERE is_emerging = TRUE;

CREATE INDEX IF NOT EXISTS idx_job_skills_skill
  ON public.job_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_job_skills_job
  ON public.job_skills(job_id);

CREATE INDEX IF NOT EXISTS idx_course_skills_skill
  ON public.course_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_course_skills_course
  ON public.course_skills(course_id);

CREATE INDEX IF NOT EXISTS idx_trainer_skills_skill
  ON public.trainer_skills(skill_id);

CREATE INDEX IF NOT EXISTS idx_trainer_skills_trainer
  ON public.trainer_skills(trainer_id);

-- 3. Course & Academic Ingestion Indexes
CREATE INDEX IF NOT EXISTS idx_courses_training_center
  ON public.courses(training_center_id);

CREATE INDEX IF NOT EXISTS idx_courses_trade_sector
  ON public.courses(trade_sector);

CREATE INDEX IF NOT EXISTS idx_courses_status
  ON public.courses(status);

CREATE INDEX IF NOT EXISTS idx_course_modules_course
  ON public.course_modules(course_id);

-- 4. District & Location Hierarchy Indexes
CREATE INDEX IF NOT EXISTS idx_districts_state
  ON public.districts(state);

CREATE INDEX IF NOT EXISTS idx_training_centers_district
  ON public.training_centers(district_id);

CREATE INDEX IF NOT EXISTS idx_employers_district
  ON public.employers(district_id);

CREATE INDEX IF NOT EXISTS idx_employers_sector
  ON public.employers(sector);

-- 5. User Profiles & Role Indexes
CREATE INDEX IF NOT EXISTS idx_profiles_role
  ON public.profiles(role);

CREATE INDEX IF NOT EXISTS idx_profiles_district
  ON public.profiles(district_id);

-- 6. Analytics & Intelligence Query Indexes (Trends & Gaps)
CREATE INDEX IF NOT EXISTS idx_skill_trends_lookup
  ON public.skill_trends(skill_id, district_id, time_period DESC);

CREATE INDEX IF NOT EXISTS idx_skill_gaps_lookup
  ON public.skill_gaps(district_id, sector, gap_severity);

CREATE INDEX IF NOT EXISTS idx_recommendations_target
  ON public.recommendations(district_id, course_id, status);

CREATE INDEX IF NOT EXISTS idx_placements_course_year
  ON public.placements(course_id, batch_year DESC);

CREATE INDEX IF NOT EXISTS idx_simulation_results_scenario
  ON public.simulation_results(scenario_id);

-- 7. Demo Data Filter Partial Indexes (ensures production queries stay fast and isolated)
CREATE INDEX IF NOT EXISTS idx_job_postings_demo
  ON public.job_postings(is_demo) WHERE is_demo = TRUE;

CREATE INDEX IF NOT EXISTS idx_courses_demo
  ON public.courses(is_demo) WHERE is_demo = TRUE;
