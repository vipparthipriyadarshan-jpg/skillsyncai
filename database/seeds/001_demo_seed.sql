-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Seed 001: Realistic Development Seed Data
-- ALL RECORDS ARE STRICTLY FLAGGED WITH is_demo = TRUE
-- ==============================================================================

-- 1. Seed Districts
INSERT INTO public.districts (id, name, state, code, latitude, longitude, is_demo)
VALUES
  ('11111111-1111-1111-1111-111111111101', 'Pune', 'Maharashtra', 'MH-PUN', 18.5204, 73.8567, TRUE),
  ('11111111-1111-1111-1111-111111111102', 'Bengaluru Urban', 'Karnataka', 'KA-BEN', 12.9716, 77.5946, TRUE),
  ('11111111-1111-1111-1111-111111111103', 'Coimbatore', 'Tamil Nadu', 'TN-CBE', 11.0168, 76.9558, TRUE),
  ('11111111-1111-1111-1111-111111111104', 'Ahmedabad', 'Gujarat', 'GJ-AHM', 23.0225, 72.5714, TRUE),
  ('11111111-1111-1111-1111-111111111105', 'Gurugram', 'Haryana', 'HR-GUR', 28.4595, 77.0266, TRUE)
ON CONFLICT (name, state) DO NOTHING;

-- 2. Seed Skills Taxonomy
INSERT INTO public.skills (id, name, slug, category, is_emerging, description, is_demo)
VALUES
  ('22222222-2222-2222-2222-222222222201', 'EV Battery Diagnostics', 'ev-battery-diagnostics', 'technical', TRUE, 'Testing, balancing and troubleshooting Lithium-ion battery packs', TRUE),
  ('22222222-2222-2222-2222-222222222202', 'Battery Management Systems (BMS)', 'bms-configuration', 'technical', TRUE, 'Firmware configuration, CAN bus telemetry, and thermal safety monitoring', TRUE),
  ('22222222-2222-2222-2222-222222222203', 'Automotive CAN Bus Protocol', 'can-bus-protocol', 'technical', FALSE, 'Controller Area Network communication and vehicle bus analyzers', TRUE),
  ('22222222-2222-2222-2222-222222222204', 'Solar PV Array Installation', 'solar-pv-installation', 'technical', FALSE, 'Roof-mount mechanical anchoring, stringing, and DC disconnect wiring', TRUE),
  ('22222222-2222-2222-2222-222222222205', 'Grid-Tie Solar Inverter Sizing', 'grid-tie-inverter-sizing', 'technical', TRUE, 'Inverter MPPT matching, IEEE 1547 anti-islanding, and utility sync', TRUE),
  ('22222222-2222-2222-2222-222222222206', '5-Axis CNC Milling', '5-axis-cnc-milling', 'technical', TRUE, 'Simultaneous multi-axis kinematic programming and collision avoidance', TRUE),
  ('22222222-2222-2222-2222-222222222207', 'G-Code & M-Code Programming', 'g-code-programming', 'tool', FALSE, 'ISO Standard computerized numerical control machine instruction sets', TRUE),
  ('22222222-2222-2222-2222-222222222208', 'Docker & Containerization', 'docker-containerization', 'tool', FALSE, 'Creating, deploying and isolating microservices via container runtimes', TRUE),
  ('22222222-2222-2222-2222-222222222209', 'Kubernetes Orchestration', 'kubernetes-orchestration', 'technical', TRUE, 'Cluster orchestration, auto-scaling, and declarative infrastructure', TRUE),
  ('22222222-2222-2222-2222-222222222210', 'Dialysis Machine Calibration', 'dialysis-calibration', 'technical', FALSE, 'Transducer calibration, ultrafiltration rate validation, and blood leak sensor testing', TRUE),
  ('22222222-2222-2222-2222-222222222211', 'Industrial Safety & Lockout/Tagout', 'loto-safety', 'compliance_standard', FALSE, 'OSHA and IS standard zero energy state verification and hazard isolation', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 3. Seed Training Centers
INSERT INTO public.training_centers (id, district_id, name, code, institution_type, contact_email, address, total_active_students, is_demo)
VALUES
  ('33333333-3333-3333-3333-333333333301', '11111111-1111-1111-1111-111111111101', 'Government ITI Aundh (Pune)', 'ITI-MH-PUN-01', 'iti_government', 'principal.aundh@dvet.gov.in', 'Aundh Industrial Area, Pune, Maharashtra', 680, TRUE),
  ('33333333-3333-3333-3333-333333333302', '11111111-1111-1111-1111-111111111103', 'Government Polytechnic Coimbatore', 'POLY-TN-CBE-04', 'polytechnic_college', 'polytechnic.cbe@dte.tn.gov.in', 'Aerodrome Post, Coimbatore, Tamil Nadu', 1150, TRUE),
  ('33333333-3333-3333-3333-333333333303', '11111111-1111-1111-1111-111111111104', 'Gujarat Skill Training Academy Ahmedabad', 'GSTA-GJ-AHM-02', 'pradhan_mantri_kushal_kendra', 'director@gsta.org.in', 'Sanand Industrial Estate, Ahmedabad, Gujarat', 420, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 4. Seed Courses
INSERT INTO public.courses (id, training_center_id, name, code, trade_sector, duration_hours, duration_months, annual_intake_capacity, current_enrollment, status, is_demo)
VALUES
  ('44444444-4444-4444-4444-444444444401', '33333333-3333-3333-3333-333333333301', 'Electric Vehicle Service & Maintenance Technician', 'EV-TECH-201', 'automotive_ev', 1200, 12.0, 60, 58, 'active', TRUE),
  ('44444444-4444-4444-4444-444444444402', '33333333-3333-3333-3333-333333333302', 'CNC Machinist & Multi-Axis Programmer', 'CNC-PROG-301', 'manufacturing_cnc', 1600, 18.0, 80, 74, 'active', TRUE),
  ('44444444-4444-4444-4444-444444444403', '33333333-3333-3333-3333-333333333303', 'Solar Photovoltaic Installation & Smart Grid Tech', 'SOL-GRID-101', 'renewable_energy', 800, 6.0, 50, 48, 'active', TRUE)
ON CONFLICT (training_center_id, code) DO NOTHING;

-- 5. Seed Course Modules
INSERT INTO public.course_modules (id, course_id, module_number, title, description, theory_hours, practical_hours, is_demo)
VALUES
  ('55555555-5555-5555-5555-555555555501', '44444444-4444-4444-4444-444444444401', 1, 'EV Fundamentals & Electrical Safety', 'High-voltage safety precautions and PPE protocols', 40, 60, TRUE),
  ('55555555-5555-5555-5555-555555555502', '44444444-4444-4444-4444-444444444401', 2, 'Traction Battery Pack Assembly & Diagnostics', 'Cell balancing, BMS wiring, and state-of-health analysis', 60, 140, TRUE),
  ('55555555-5555-5555-5555-555555555503', '44444444-4444-4444-4444-444444444402', 1, 'CNC Basics & G/M Code Programming', 'Cartesian coordinates, tool offsets, and canned cycles', 80, 160, TRUE),
  ('55555555-5555-5555-5555-555555555504', '44444444-4444-4444-4444-444444444402', 2, 'Multi-Axis Machining Operations', 'Rotary table setups, workholding, and surface finishing', 60, 200, TRUE)
ON CONFLICT (course_id, module_number) DO NOTHING;

-- 6. Seed Course Skills Mapping
INSERT INTO public.course_skills (id, course_id, skill_id, proficiency_targeted, allocated_hours, is_core, is_demo)
VALUES
  ('66666666-6666-6666-6666-666666666601', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222201', 'intermediate', 120, TRUE, TRUE),
  ('66666666-6666-6666-6666-666666666602', '44444444-4444-4444-4444-444444444401', '22222222-2222-2222-2222-222222222211', 'advanced', 40, TRUE, TRUE),
  ('66666666-6666-6666-6666-666666666603', '44444444-4444-4444-4444-444444444402', '22222222-2222-2222-2222-222222222207', 'advanced', 180, TRUE, TRUE),
  ('66666666-6666-6666-6666-666666666604', '44444444-4444-4444-4444-444444444403', '22222222-2222-2222-2222-222222222204', 'advanced', 120, TRUE, TRUE)
ON CONFLICT (course_id, skill_id) DO NOTHING;

-- 7. Seed Trainers
INSERT INTO public.trainers (id, training_center_id, name, email, qualification, years_of_experience, status, is_demo)
VALUES
  ('77777777-7777-7777-7777-777777777701', '33333333-3333-3333-3333-333333333301', 'Sunil Deshmukh', 's.deshmukh@iti-pune.gov.in', 'Diploma in Automobile Engineering', 8.5, 'active', TRUE),
  ('77777777-7777-7777-7777-777777777702', '33333333-3333-3333-3333-333333333301', 'Vikram Patil', 'v.patil@iti-pune.gov.in', 'B.Tech Electrical & Electronics', 4.0, 'upskilling_required', TRUE),
  ('77777777-7777-7777-7777-777777777703', '33333333-3333-3333-3333-333333333302', 'K. Murugesan', 'k.murugesan@poly-cbe.gov.in', 'M.Tech Production Engineering', 12.0, 'active', TRUE)
ON CONFLICT DO NOTHING;

-- 8. Seed Trainer Skills (Showing skill coverage & gaps)
INSERT INTO public.trainer_skills (id, trainer_id, skill_id, proficiency, certified_by, certified_at, is_demo)
VALUES
  ('88888888-8888-8888-8888-888888888801', '77777777-7777-7777-7777-777777777701', '22222222-2222-2222-2222-222222222211', 'expert', 'Directorate General of Training', '2023-04-15', TRUE),
  ('88888888-8888-8888-8888-888888888802', '77777777-7777-7777-7777-777777777703', '22222222-2222-2222-2222-222222222207', 'expert', 'National Skill Development Corp', '2022-09-10', TRUE)
ON CONFLICT (trainer_id, skill_id) DO NOTHING;

-- 9. Seed Equipment
INSERT INTO public.equipment (id, training_center_id, name, trade_sector, model_specification, quantity_total, quantity_operational, condition_rating, is_demo)
VALUES
  ('99999999-9999-9999-9999-999999999901', '33333333-3333-3333-3333-333333333301', 'EV Battery Testing & Balancing Rig', 'automotive_ev', 'Delta Electronics 400V 60A Automated Battery Cycler', 2, 2, 'operational_good', TRUE),
  ('99999999-9999-9999-9999-999999999902', '33333333-3333-3333-3333-333333333301', 'Automotive CAN Bus Protocol Analyzer', 'automotive_ev', 'Vector CANoe Interface with VN1630A', 4, 3, 'needs_maintenance', TRUE),
  ('99999999-9999-9999-9999-999999999903', '33333333-3333-3333-3333-333333333302', '3-Axis CNC Vertical Machining Center', 'manufacturing_cnc', 'Jyoti VMC 430 Siemens 828D Controller', 3, 3, 'operational_good', TRUE)
ON CONFLICT DO NOTHING;

-- 10. Seed Employers
INSERT INTO public.employers (id, district_id, company_name, sector, company_size, hr_contact_name, hr_contact_email, is_demo)
VALUES
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '11111111-1111-1111-1111-111111111101', 'Tata Motors Passenger Electric Vehicles', 'automotive_ev', 'large_multinational', 'Pooja Nair', 'talent.ev@tatamotors.com', TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '11111111-1111-1111-1111-111111111101', 'Bharat Forge Advanced Mobility Div', 'automotive_ev', 'large_multinational', 'Anand Kulkarni', 'careers@bharatforge.com', TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', '11111111-1111-1111-1111-111111111103', 'LMW Precision Machine Works', 'manufacturing_cnc', 'large_multinational', 'S. Ramaswamy', 'recruitment@lmw.co.in', TRUE),
  ('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa04', '11111111-1111-1111-1111-111111111104', 'Adani Solar Manufacturing Ltd', 'renewable_energy', 'large_multinational', 'Deepak Mehta', 'solar.talent@adani.com', TRUE)
ON CONFLICT (company_name, district_id) DO NOTHING;

-- 11. Seed Job Postings
INSERT INTO public.job_postings (id, employer_id, district_id, title, sector, experience_min_years, experience_max_years, salary_min, salary_max, vacancies_count, posting_date, status, is_demo)
VALUES
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '11111111-1111-1111-1111-111111111101', 'EV Battery Assembly & Quality Technician', 'automotive_ev', 1.0, 3.0, 280000.00, 420000.00, 35, CURRENT_DATE - INTERVAL '14 days', 'active', TRUE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa02', '11111111-1111-1111-1111-111111111101', 'CAN Bus Diagnostic & Wire Harness Specialist', 'automotive_ev', 2.0, 5.0, 350000.00, 550000.00, 18, CURRENT_DATE - INTERVAL '7 days', 'active', TRUE),
  ('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa03', '11111111-1111-1111-1111-111111111103', 'Senior 5-Axis CNC Mill Operator', 'manufacturing_cnc', 3.0, 6.0, 400000.00, 650000.00, 24, CURRENT_DATE - INTERVAL '3 days', 'active', TRUE)
ON CONFLICT DO NOTHING;

-- 12. Seed Job Skills Requirements
INSERT INTO public.job_skills (id, job_id, skill_id, requirement_level, weight, is_demo)
VALUES
  ('cccccccc-cccc-cccc-cccc-cccccccccc01', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '22222222-2222-2222-2222-222222222201', 'required', 1.0, TRUE),
  ('cccccccc-cccc-cccc-cccc-cccccccccc02', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb01', '22222222-2222-2222-2222-222222222202', 'required', 0.9, TRUE),
  ('cccccccc-cccc-cccc-cccc-cccccccccc03', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb02', '22222222-2222-2222-2222-222222222203', 'required', 1.0, TRUE),
  ('cccccccc-cccc-cccc-cccc-cccccccccc04', 'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbb03', '22222222-2222-2222-2222-222222222206', 'required', 1.0, TRUE)
ON CONFLICT (job_id, skill_id) DO NOTHING;

-- 13. Seed Employer Feedback (Curriculum Validation)
INSERT INTO public.employer_feedback (id, employer_id, course_id, relevance_score, curriculum_modernity_score, hiring_intent_graduates, practical_readiness_rating, feedback_notes, is_demo)
VALUES
  ('dddddddd-dddd-dddd-dddd-dddddddddd01', 'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaa01', '44444444-4444-4444-4444-444444444401', 4, 3, 25, 3, 'Course covers baseline EV electrical well, but urgently requires 30+ hours on CAN Bus diagnostics and high-voltage BMS isolation faults to meet current shopfloor standards.', TRUE)
ON CONFLICT DO NOTHING;

-- 14. Seed Historical Placements
INSERT INTO public.placements (id, course_id, batch_year, total_graduates, placed_graduates, avg_salary_monthly, median_salary_monthly, top_placement_partner, is_demo)
VALUES
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee01', '44444444-4444-4444-4444-444444444401', 2024, 52, 38, 24500.00, 22000.00, 'Tata Motors EV', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee02', '44444444-4444-4444-4444-444444444401', 2025, 56, 46, 27500.00, 26000.00, 'Tata Motors EV & Ather Energy', TRUE),
  ('eeeeeeee-eeee-eeee-eeee-eeeeeeeeee03', '44444444-4444-4444-4444-444444444402', 2025, 70, 58, 29000.00, 28000.00, 'LMW Precision & Roots Auto', TRUE)
ON CONFLICT (course_id, batch_year) DO NOTHING;

-- 15. Seed Skill Trends (Demand Velocity)
INSERT INTO public.skill_trends (id, skill_id, district_id, time_period, postings_volume, growth_rate_pct, demand_intensity, is_demo)
VALUES
  ('ffffffff-ffff-ffff-ffff-ffffffffff01', '22222222-2222-2222-2222-222222222201', '11111111-1111-1111-1111-111111111101', '2026-08-01', 142, 34.50, 'surging', TRUE),
  ('ffffffff-ffff-ffff-ffff-ffffffffff02', '22222222-2222-2222-2222-222222222203', '11111111-1111-1111-1111-111111111101', '2026-08-01', 98, 22.00, 'high', TRUE),
  ('ffffffff-ffff-ffff-ffff-ffffffffff03', '22222222-2222-2222-2222-222222222206', '11111111-1111-1111-1111-111111111103', '2026-08-01', 115, 18.20, 'high', TRUE)
ON CONFLICT (skill_id, district_id, time_period) DO NOTHING;

-- 16. Seed Skill Gaps (Market Demand vs Institutional Supply)
INSERT INTO public.skill_gaps (id, district_id, skill_id, sector, market_demand_volume, trained_supply_volume, gap_severity, calculated_date, is_demo)
VALUES
  ('12121212-1212-1212-1212-121212121201', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222201', 'automotive_ev', 142, 58, 'critical_deficit', CURRENT_DATE, TRUE),
  ('12121212-1212-1212-1212-121212121202', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'automotive_ev', 98, 12, 'critical_deficit', CURRENT_DATE, TRUE),
  ('12121212-1212-1212-1212-121212121203', '11111111-1111-1111-1111-111111111103', '22222222-2222-2222-2222-222222222206', 'manufacturing_cnc', 115, 74, 'moderate_deficit', CURRENT_DATE, TRUE)
ON CONFLICT (district_id, skill_id, calculated_date) DO NOTHING;

-- 17. Seed Evidence-Based Recommendations
INSERT INTO public.recommendations (id, course_id, district_id, skill_id, recommendation_type, priority, evidence_summary, data_source_citation, estimated_cost_inr, status, is_demo)
VALUES
  ('13131313-1313-1313-1313-131313131301', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222203', 'add_curriculum_module', 'urgent', 'EV diagnostic job demand in Pune exceeds supply by +86 vacancies. Tata Motors feedback underscores critical CAN bus troubleshooting gaps.', 'Tata Motors Survey & Q3 Job Signals Ingestion (53 postings)', 350000.00, 'approved_by_board', TRUE),
  ('13131313-1313-1313-1313-131313131302', '44444444-4444-4444-4444-444444444401', '11111111-1111-1111-1111-111111111101', '22222222-2222-2222-2222-222222222202', 'upskill_trainers', 'high', 'Faculty audit at ITI Aundh shows 2 trainers lack certified BMS safety qualification. 80 hours training recommended.', 'DGT Faculty Audit & Trainer Skill Matrix 2026', 120000.00, 'pending_review', TRUE)
ON CONFLICT DO NOTHING;

-- 18. Seed Simulation Scenario & Projected Results
INSERT INTO public.simulation_scenarios (id, name, description, district_id, target_sector, budget_allocation_inr, capacity_multiplier, is_demo)
VALUES
  ('14141414-1414-1414-1414-141414141401', 'Pune District EV Trade Modernization FY26', 'Reallocates ₹45 Lakhs to expand EV Service Technician capacity by 50% and procure CAN bus hardware', '11111111-1111-1111-1111-111111111101', 'automotive_ev', 4500000.00, 1.50, TRUE)
ON CONFLICT DO NOTHING;

INSERT INTO public.simulation_results (id, scenario_id, projected_placement_rate, baseline_placement_rate, net_placement_gain_pct, trainers_requiring_upskilling, equipment_capex_deficit_inr, estimated_absorption_months, bottlenecks_identified, is_demo)
VALUES
  ('15151515-1515-1515-1515-151515151501', '14141414-1414-1414-1414-141414141401', 82.50, 68.00, 14.50, 4, 850000.00, 4.5, 'Trainer certification delay: 4 instructors require 80 hours external upskilling before expanded batch commencement.', TRUE)
ON CONFLICT DO NOTHING;
