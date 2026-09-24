-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 004: Row Level Security (RLS) & Granular Role-Based Access Policies
-- ==============================================================================

-- 1. Helper function: Get caller's assigned role from public.profiles
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS user_role AS $$
DECLARE
  v_role user_role;
BEGIN
  SELECT role INTO v_role
  FROM public.profiles
  WHERE id = auth.uid();
  
  RETURN COALESCE(v_role, 'candidate'::user_role);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- 2. Helper function: Check if caller is Admin or Government Officer
CREATE OR REPLACE FUNCTION public.is_admin_or_govt()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (public.current_user_role() IN ('admin', 'government'));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER STABLE;

-- ==============================================================================
-- 3. Enable RLS on all 20 Core Tables
-- ==============================================================================
ALTER TABLE public.districts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.training_centers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.course_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trainer_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.equipment ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.job_skills ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.employer_feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.placements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_trends ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.skill_gaps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recommendations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_scenarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.simulation_results ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 4. Reference & Shared Knowledge Policies (Districts & Skills)
-- ==============================================================================
-- Anyone authenticated can view districts & skills
CREATE POLICY "Public Read: Districts viewable by all authenticated users"
  ON public.districts FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage districts"
  ON public.districts FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Skills taxonomy viewable by all authenticated users"
  ON public.skills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage skills taxonomy"
  ON public.skills FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

-- ==============================================================================
-- 5. Profiles Policies
-- ==============================================================================
CREATE POLICY "Users: Read own profile"
  ON public.profiles FOR SELECT
  TO authenticated USING (id = auth.uid());

CREATE POLICY "Users: Update own profile"
  ON public.profiles FOR UPDATE
  TO authenticated USING (id = auth.uid());

CREATE POLICY "Admin/Govt: View all stakeholder profiles"
  ON public.profiles FOR SELECT
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Admin: Full control over profiles"
  ON public.profiles FOR ALL
  TO authenticated USING (public.current_user_role() = 'admin');

-- ==============================================================================
-- 6. Employers & Job Postings Policies
-- ==============================================================================
CREATE POLICY "Public Read: Active employers directory"
  ON public.employers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Employer: Manage own company profile"
  ON public.employers FOR ALL
  TO authenticated USING (
    profile_id = auth.uid() OR public.is_admin_or_govt()
  );

CREATE POLICY "Public Read: Active job postings"
  ON public.job_postings FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Employer/Admin: Manage job postings"
  ON public.job_postings FOR ALL
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = job_postings.employer_id
      AND employers.profile_id = auth.uid()
    )
    OR public.is_admin_or_govt()
  );

CREATE POLICY "Public Read: Job skills breakdown"
  ON public.job_skills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Employer/Admin: Manage job skills"
  ON public.job_skills FOR ALL
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.job_postings jp
      JOIN public.employers emp ON emp.id = jp.employer_id
      WHERE jp.id = job_skills.job_id
      AND emp.profile_id = auth.uid()
    )
    OR public.is_admin_or_govt()
  );

-- ==============================================================================
-- 7. Institutions, Courses, Trainers & Equipment Policies
-- ==============================================================================
CREATE POLICY "Public Read: Training centers directory"
  ON public.training_centers FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage training centers"
  ON public.training_centers FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Active trade courses"
  ON public.courses FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Institution/Admin: Manage trade courses"
  ON public.courses FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Public Read: Course modules and skills"
  ON public.course_modules FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Institution/Admin: Manage course modules"
  ON public.course_modules FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Public Read: Course skill mappings"
  ON public.course_skills FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Institution/Admin: Manage course skills"
  ON public.course_skills FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Govt: View trainers"
  ON public.trainers FOR SELECT
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Admin: Manage trainers"
  ON public.trainers FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Govt: View trainer skills"
  ON public.trainer_skills FOR SELECT
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Admin: Manage trainer skills"
  ON public.trainer_skills FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Govt: View equipment inventory"
  ON public.equipment FOR SELECT
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

CREATE POLICY "Institution/Admin: Manage equipment inventory"
  ON public.equipment FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

-- ==============================================================================
-- 8. Feedback & Placements Policies
-- ==============================================================================
CREATE POLICY "Public Read: Employer feedback on courses"
  ON public.employer_feedback FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Employer/Admin: Submit employer feedback"
  ON public.employer_feedback FOR INSERT
  TO authenticated WITH CHECK (
    public.current_user_role() IN ('employer', 'admin')
  );

CREATE POLICY "Employer: Update own feedback"
  ON public.employer_feedback FOR UPDATE
  TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.employers
      WHERE employers.id = employer_feedback.employer_id
      AND employers.profile_id = auth.uid()
    )
    OR public.current_user_role() = 'admin'
  );

CREATE POLICY "Public Read: Placement statistics"
  ON public.placements FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Institution/Admin: Manage placement records"
  ON public.placements FOR ALL
  TO authenticated USING (
    public.is_admin_or_govt() OR public.current_user_role() = 'institution'
  );

-- ==============================================================================
-- 9. Analytics, Gaps, Recommendations & Simulation Policies
-- ==============================================================================
CREATE POLICY "Public Read: Aggregated skill trends"
  ON public.skill_trends FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage skill trends"
  ON public.skill_trends FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Quantified skill gaps"
  ON public.skill_gaps FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage skill gaps"
  ON public.skill_gaps FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Policy & Curriculum Recommendations"
  ON public.recommendations FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage recommendations"
  ON public.recommendations FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Govt/Admin: Manage simulation scenarios"
  ON public.simulation_scenarios FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Simulation scenarios"
  ON public.simulation_scenarios FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Govt/Admin: Manage simulation results"
  ON public.simulation_results FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Simulation results"
  ON public.simulation_results FOR SELECT
  TO authenticated USING (true);
