-- ==============================================================================
-- Skill Sync AI: Synthetic Demonstration Ecosystem Seed
-- DISCLAIMER: Synthetic Demo Data — for demonstration only.
-- All companies, roles, and institutional records are synthetic test entities.
-- ALL RECORDS ARE STRICTLY FLAGGED WITH is_demo = TRUE
-- ==============================================================================

-- 1. Districts
INSERT INTO public.districts (id, name, state, code, latitude, longitude, is_demo)
VALUES
  ('a1111111-1111-1111-1111-111111111101', 'Pune', 'Maharashtra', 'MH-PUN', 18.5204, 73.8567, TRUE),
  ('a1111111-1111-1111-1111-111111111102', 'Coimbatore', 'Tamil Nadu', 'TN-CBE', 11.0168, 76.9558, TRUE),
  ('a1111111-1111-1111-1111-111111111103', 'Ahmedabad', 'Gujarat', 'GJ-AHM', 23.0225, 72.5714, TRUE),
  ('a1111111-1111-1111-1111-111111111104', 'Bengaluru Urban', 'Karnataka', 'KA-BEN', 12.9716, 77.5946, TRUE),
  ('a1111111-1111-1111-1111-111111111105', 'Gurugram', 'Haryana', 'HR-GUR', 28.4595, 77.0266, TRUE)
ON CONFLICT (name, state) DO NOTHING;

-- 2. Standardized Skills Taxonomy (High Demand, Stable, Declining)
INSERT INTO public.skills (id, name, slug, category, is_emerging, description, is_demo)
VALUES
  ('b2222222-2222-2222-2222-222222222201', 'EV Battery Diagnostics', 'ev-battery-diagnostics', 'technical', TRUE, 'Testing balancing and state-of-health analysis of high-voltage Lithium-ion traction batteries', TRUE),
  ('b2222222-2222-2222-2222-222222222202', 'Battery Management Systems (BMS)', 'bms-configuration', 'technical', TRUE, 'BMS telemetry parameter configuration cell balancing and thermal runaway mitigation', TRUE),
  ('b2222222-2222-2222-2222-222222222203', 'Automotive CAN Bus Protocol', 'can-bus-protocol', 'technical', FALSE, 'Controller Area Network serial communication troubleshooting and bus telemetry analyzers', TRUE),
  ('b2222222-2222-2222-2222-222222222204', 'Industrial Robotics Programming', 'industrial-robotics-programming', 'technical', TRUE, 'Teach pendant programming kinematics payload calibration and safety interlocks for 6-axis articulated arms', TRUE),
  ('b2222222-2222-2222-2222-222222222205', '5-Axis CNC Milling', '5-axis-cnc-milling', 'technical', TRUE, 'Simultaneous multi-axis kinematic programming CAD/CAM simulation and collision avoidance', TRUE),
  ('b2222222-2222-2222-2222-222222222206', 'Grid-Tie Solar Inverter Sizing', 'grid-tie-inverter-sizing', 'technical', TRUE, 'Inverter MPPT string matching IEEE 1547 anti-islanding validation and SCADA utility sync', TRUE),
  ('b2222222-2222-2222-2222-222222222207', 'Dialysis Machine Calibration', 'dialysis-machine-calibration', 'technical', TRUE, 'Pressure transducer calibration ultrafiltration rate verification and blood leak sensor alignment', TRUE),
  ('b2222222-2222-2222-2222-222222222208', 'Kubernetes Container Orchestration', 'kubernetes-orchestration', 'technical', TRUE, 'Declarative container deployment ingress routing autoscaling and microservices infrastructure', TRUE),
  ('b2222222-2222-2222-2222-222222222209', 'G-Code & M-Code Programming', 'g-code-m-code-programming', 'tool', FALSE, 'ISO standard CNC machine tool programming canned cycles and tool offset calculations', TRUE),
  ('b2222222-2222-2222-2222-222222222210', 'High Voltage Safety & Lockout/Tagout', 'high-voltage-safety-loto', 'compliance_standard', FALSE, 'OSHA and IS standard high voltage zero-energy verification Arc Flash PPE and Lockout/Tagout', TRUE),
  ('b2222222-2222-2222-2222-222222222211', 'Solar PV Array Installation', 'solar-pv-array-installation', 'technical', FALSE, 'Roof-mount mechanical structural anchoring DC combiner box wiring and array grounding', TRUE),
  ('b2222222-2222-2222-2222-222222222212', 'Engineering Blueprint Reading', 'engineering-blueprint-reading', 'domain_knowledge', FALSE, 'Geometric Dimensioning and Tolerancing (GD&T) orthographic views and fabrication schematics', TRUE),
  ('b2222222-2222-2222-2222-222222222213', 'Pneumatics & Hydraulics Basics', 'pneumatics-hydraulics-basics', 'technical', FALSE, 'Pneumatic actuator circuits directional control valves fluid power safety and manifold assembly', TRUE),
  ('b2222222-2222-2222-2222-222222222214', 'Linux System Administration', 'linux-system-administration', 'technical', FALSE, 'Shell scripting systemd service management user permissions and secure SSH administration', TRUE),
  ('b2222222-2222-2222-2222-222222222215', 'Sterilization Autoclave Operation', 'sterilization-autoclave-operation', 'technical', FALSE, 'Hospital steam autoclave sterilization cycles biological indicator logging and pressure validation', TRUE),
  ('b2222222-2222-2222-2222-222222222216', 'Carburetor Tuning & Overhaul', 'carburetor-tuning-overhaul', 'technical', FALSE, 'Mechanical carburetor jet cleaning float adjustment and idle air mixture screw tuning for legacy internal combustion engines', TRUE),
  ('b2222222-2222-2222-2222-222222222217', 'Manual Drafting on Drafting Boards', 'manual-drafting-drafting-boards', 'domain_knowledge', FALSE, 'Manual technical drawing with T-squares compasses drafting boards and tracing linen', TRUE),
  ('b2222222-2222-2222-2222-222222222218', 'Conventional Lathe Manual Turning', 'conventional-lathe-manual-turning', 'technical', FALSE, 'Manual stepped shaft turning using handwheel dials single-point high-speed steel cutters without CNC automation', TRUE)
ON CONFLICT (name) DO NOTHING;

-- 3. Training Centers
INSERT INTO public.training_centers (id, district_id, name, code, institution_type, contact_email, address, total_active_students, is_demo)
VALUES
  ('c3333333-3333-3333-3333-333333333301', 'a1111111-1111-1111-1111-111111111101', 'Government ITI Aundh (Pune)', 'ITI-MH-PUN-01', 'iti_government', 'principal.aundh@dvet-demo.gov.in', 'Aundh Industrial Area, Pune, Maharashtra', 720, TRUE),
  ('c3333333-3333-3333-3333-333333333302', 'a1111111-1111-1111-1111-111111111102', 'Government Polytechnic Coimbatore', 'POLY-TN-CBE-04', 'polytechnic_college', 'principal.cbe@dte-demo.tn.gov.in', 'Aerodrome Post, Coimbatore, Tamil Nadu', 1200, TRUE),
  ('c3333333-3333-3333-3333-333333333303', 'a1111111-1111-1111-1111-111111111103', 'Gujarat Skill Training Academy Ahmedabad', 'GSTA-GJ-AHM-02', 'pradhan_mantri_kushal_kendra', 'director@gsta-demo.org.in', 'Sanand Industrial Estate, Ahmedabad, Gujarat', 450, TRUE),
  ('c3333333-3333-3333-3333-333333333304', 'a1111111-1111-1111-1111-111111111104', 'Government ITI Peenya (Bengaluru)', 'ITI-KA-BEN-03', 'iti_government', 'principal.peenya@dept-skills-demo.ka.gov.in', 'Peenya Industrial Area, Bengaluru, Karnataka', 850, TRUE),
  ('c3333333-3333-3333-3333-333333333305', 'a1111111-1111-1111-1111-111111111105', 'National Skill Training Institute Gurugram', 'NSTI-HR-GUR-01', 'iti_government', 'director@nsti-gurugram-demo.gov.in', 'Sector 18 Industrial Area, Gurugram, Haryana', 600, TRUE)
ON CONFLICT (code) DO NOTHING;

-- 4. Courses
INSERT INTO public.courses (id, training_center_id, name, code, trade_sector, duration_hours, duration_months, annual_intake_capacity, current_enrollment, status, is_demo)
VALUES
  ('d4444444-4444-4444-4444-444444444401', 'c3333333-3333-3333-3333-333333333301', 'Electric Vehicle Service & Maintenance Technician', 'EV-TECH-201', 'automotive_ev', 1200, 12.0, 60, 58, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444402', 'c3333333-3333-3333-3333-333333333302', 'Industrial Robotics & Multi-Axis CNC Automation', 'ROB-CNC-301', 'manufacturing_cnc', 1600, 18.0, 40, 40, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444403', 'c3333333-3333-3333-3333-333333333303', 'Solar Photovoltaic & Smart Microgrid Technician', 'SOL-GRID-101', 'renewable_energy', 800, 6.0, 50, 48, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444404', 'c3333333-3333-3333-3333-333333333304', 'Biomedical Equipment Maintenance & Dialysis Technology', 'BIOMED-DIA-201', 'healthcare_allied', 1000, 10.0, 30, 28, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444405', 'c3333333-3333-3333-3333-333333333305', 'Cloud DevOps & Container Orchestration Associate', 'CLD-K8S-401', 'information_technology', 900, 9.0, 45, 42, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444406', 'c3333333-3333-3333-3333-333333333301', 'Conventional Engine Overhaul & Carburetion Trade (Legacy)', 'ENG-LEG-101', 'automotive_ev', 600, 6.0, 40, 32, 'active', TRUE),
  ('d4444444-4444-4444-4444-444444444407', 'c3333333-3333-3333-3333-333333333302', 'Manual Drafting & Machine Tool Turning (Legacy)', 'MEC-LEG-102', 'manufacturing_cnc', 800, 8.0, 30, 25, 'active', TRUE)
ON CONFLICT (training_center_id, code) DO NOTHING;

-- 5. Course Modules
INSERT INTO public.course_modules (id, course_id, module_number, title, description, theory_hours, practical_hours, is_demo)
VALUES
  ('e5555555-5555-5555-5555-555555555501', 'd4444444-4444-4444-4444-444444444401', 1, 'High Voltage Safety & LOTO Protocols', 'High voltage zero-energy verification and Arc Flash PPE protocols', 40, 60, TRUE),
  ('e5555555-5555-5555-5555-555555555502', 'd4444444-4444-4444-4444-444444444401', 2, 'Lithium Traction Battery Assembly & SOH Diagnostics', 'Cell balancing, BMS telemetry, and state-of-health diagnostics', 60, 140, TRUE),
  ('e5555555-5555-5555-5555-555555555503', 'd4444444-4444-4444-4444-444444444402', 1, 'Cartesian CNC Coordinate Foundations & G-Code', 'ISO G/M code, tool offsets, and canned cycles', 50, 120, TRUE),
  ('e5555555-5555-5555-5555-555555555504', 'd4444444-4444-4444-4444-444444444402', 2, 'Multi-Axis Kinematics & 5-Axis Simultaneous Milling', 'Multi-axis setups, rotary table kinematics, and CAD/CAM simulation', 70, 180, TRUE),
  ('e5555555-5555-5555-5555-555555555505', 'd4444444-4444-4444-4444-444444444402', 3, 'Industrial Robotics Articulated Arm Programming', '6-axis teach pendant programming, safety interlocks, and palletizing cycles', 60, 140, TRUE),
  ('e5555555-5555-5555-5555-555555555506', 'd4444444-4444-4444-4444-444444444403', 1, 'Solar PV Mounting Structures & DC String Cabling', 'Roof-mount anchoring, DC combiner wiring, and array grounding', 40, 80, TRUE),
  ('e5555555-5555-5555-5555-555555555507', 'd4444444-4444-4444-4444-444444444403', 2, 'Grid-Tie Inverter Synchronization & Safety Protection', 'Grid-tie inverters, IEEE 1547 anti-islanding, and utility sync', 60, 100, TRUE),
  ('e5555555-5555-5555-5555-555555555508', 'd4444444-4444-4444-4444-444444444404', 1, 'Clinical Infection Control & Autoclave Sterilization', 'Steam autoclave operation, pressure validation, and biological indicator logging', 40, 60, TRUE),
  ('e5555555-5555-5555-5555-555555555509', 'd4444444-4444-4444-4444-444444444404', 2, 'Hemodialysis Machine Hydraulics & Transducer Calibration', 'Pressure transducer calibration, ultrafiltration fluid circuit, and blood leak sensor tests', 60, 120, TRUE),
  ('e5555555-5555-5555-5555-555555555510', 'd4444444-4444-4444-4444-444444444405', 1, 'Enterprise Linux Core Administration & Shell Automation', 'Linux shell scripting, user privileges, systemd, and secure networking', 50, 80, TRUE),
  ('e5555555-5555-5555-5555-555555555511', 'd4444444-4444-4444-4444-444444444405', 2, 'Container Packaging & Kubernetes Fleet Management', 'Docker images, Kubernetes declarative manifests, and ingress networking', 60, 140, TRUE),
  ('e5555555-5555-5555-5555-555555555512', 'd4444444-4444-4444-4444-444444444406', 1, 'Multi-Jet Carburetor Calibration & Float Level Adjustment', 'Jet cleaning, float height measurement, and idle mixture tuning', 50, 100, TRUE),
  ('e5555555-5555-5555-5555-555555555513', 'd4444444-4444-4444-4444-444444444407', 1, 'Orthographic Hand Drafting & Tracing Linen Standards', 'T-square manual drafting, scale ruler views, and ink tracing', 50, 80, TRUE)
ON CONFLICT (course_id, module_number) DO NOTHING;

-- 6. Course Skills Mapping
INSERT INTO public.course_skills (id, course_id, skill_id, proficiency_targeted, allocated_hours, is_core, is_demo)
VALUES
  ('f6666666-6666-6666-6666-666666666601', 'd4444444-4444-4444-4444-444444444401', 'b2222222-2222-2222-2222-222222222210', 'advanced', 100, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666602', 'd4444444-4444-4444-4444-444444444401', 'b2222222-2222-2222-2222-222222222201', 'intermediate', 120, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666603', 'd4444444-4444-4444-4444-444444444401', 'b2222222-2222-2222-2222-222222222202', 'intermediate', 80, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666604', 'd4444444-4444-4444-4444-444444444402', 'b2222222-2222-2222-2222-222222222209', 'advanced', 170, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666605', 'd4444444-4444-4444-4444-444444444402', 'b2222222-2222-2222-2222-222222222205', 'advanced', 250, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666606', 'd4444444-4444-4444-4444-444444444402', 'b2222222-2222-2222-2222-222222222204', 'intermediate', 200, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666607', 'd4444444-4444-4444-4444-444444444403', 'b2222222-2222-2222-2222-222222222211', 'advanced', 120, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666608', 'd4444444-4444-4444-4444-444444444403', 'b2222222-2222-2222-2222-222222222206', 'intermediate', 160, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666609', 'd4444444-4444-4444-4444-444444444404', 'b2222222-2222-2222-2222-222222222207', 'advanced', 180, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666610', 'd4444444-4444-4444-4444-444444444405', 'b2222222-2222-2222-2222-222222222208', 'advanced', 200, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666611', 'd4444444-4444-4444-4444-444444444406', 'b2222222-2222-2222-2222-222222222216', 'advanced', 150, TRUE, TRUE),
  ('f6666666-6666-6666-6666-666666666612', 'd4444444-4444-4444-4444-444444444407', 'b2222222-2222-2222-2222-222222222217', 'advanced', 130, TRUE, TRUE)
ON CONFLICT (course_id, skill_id) DO NOTHING;

-- 7. Synthetic Employers
INSERT INTO public.employers (id, district_id, company_name, sector, company_size, hr_contact_name, hr_contact_email, is_demo)
VALUES
  ('10101010-1010-1010-1010-101010101001', 'a1111111-1111-1111-1111-111111111101', 'Apex Dynamics Mobility Ltd (Synthetic Entity)', 'automotive_ev', 'large_multinational', 'Pooja V. Nair', 'talent@apexdynamics-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101002', 'a1111111-1111-1111-1111-111111111101', 'Veloce E-Mobility Systems (Synthetic Entity)', 'automotive_ev', 'medium_enterprise', 'Rohan Deshpande', 'recruitment@veloce-emobility-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101003', 'a1111111-1111-1111-1111-111111111102', 'Precision Multi-Axis Robotics Ltd (Synthetic Entity)', 'manufacturing_cnc', 'large_multinational', 'S. Ramachandran', 'careers@precision-robotics-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101004', 'a1111111-1111-1111-1111-111111111101', 'Kalyani Mechatronics Works (Synthetic Entity)', 'manufacturing_cnc', 'medium_enterprise', 'Sunita Jadhav', 'hr@kalyani-mechatronics-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101005', 'a1111111-1111-1111-1111-111111111103', 'Helios CleanGrid Solutions (Synthetic Entity)', 'renewable_energy', 'large_multinational', 'Deepak C. Mehta', 'talent@helios-cleangrid-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101006', 'a1111111-1111-1111-1111-111111111104', 'AuraHealth MedTech Devices (Synthetic Entity)', 'healthcare_allied', 'large_multinational', 'K. Srinivasan', 'recruiting@aurahealth-medtech-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101007', 'a1111111-1111-1111-1111-111111111104', 'CloudMatrix Edge Systems (Synthetic Entity)', 'information_technology', 'large_multinational', 'Arjun V. Rao', 'careers@cloudmatrix-edge-demo.org', TRUE),
  ('10101010-1010-1010-1010-101010101008', 'a1111111-1111-1111-1111-111111111101', 'Vintage Motor Spares & Overhaul (Synthetic Entity)', 'automotive_ev', 'small_enterprise', 'Ganesh Kadam', 'workshop@vintagemotors-demo.org', TRUE)
ON CONFLICT (company_name, district_id) DO NOTHING;

-- 8. Job Postings
INSERT INTO public.job_postings (id, employer_id, district_id, title, sector, experience_min_years, experience_max_years, salary_min, salary_max, vacancies_count, posting_date, status, is_demo)
VALUES
  ('20202020-2020-2020-2020-202020202001', '10101010-1010-1010-1010-101010101001', 'a1111111-1111-1111-1111-111111111101', 'EV Battery Diagnostics & BMS Specialist', 'automotive_ev', 1.0, 3.5, 320000.00, 480000.00, 35, CURRENT_DATE - INTERVAL '12 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202002', '10101010-1010-1010-1010-101010101002', 'a1111111-1111-1111-1111-111111111101', 'Automotive CAN Bus & Telemetry Diagnostic Specialist', 'automotive_ev', 2.0, 5.0, 380000.00, 580000.00, 22, CURRENT_DATE - INTERVAL '9 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202003', '10101010-1010-1010-1010-101010101003', 'a1111111-1111-1111-1111-111111111102', 'Industrial Robotics Automation & 6-Axis Arm Programmer', 'manufacturing_cnc', 2.0, 4.5, 420000.00, 680000.00, 28, CURRENT_DATE - INTERVAL '7 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202004', '10101010-1010-1010-1010-101010101003', 'a1111111-1111-1111-1111-111111111102', 'Senior 5-Axis CNC Milling Specialist', 'manufacturing_cnc', 3.0, 6.0, 450000.00, 720000.00, 18, CURRENT_DATE - INTERVAL '5 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202005', '10101010-1010-1010-1010-101010101005', 'a1111111-1111-1111-1111-111111111103', 'Smart Grid Solar Inverter Commissioning Engineer', 'renewable_energy', 1.5, 4.0, 340000.00, 520000.00, 30, CURRENT_DATE - INTERVAL '4 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202006', '10101010-1010-1010-1010-101010101006', 'a1111111-1111-1111-1111-111111111104', 'Dialysis Biomedical Calibration Specialist', 'healthcare_allied', 1.5, 4.0, 360000.00, 540000.00, 20, CURRENT_DATE - INTERVAL '3 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202007', '10101010-1010-1010-1010-101010101007', 'a1111111-1111-1111-1111-111111111104', 'Edge Cloud Infrastructure & Kubernetes DevOps Associate', 'information_technology', 1.0, 3.0, 500000.00, 780000.00, 40, CURRENT_DATE - INTERVAL '2 days', 'active', TRUE),
  ('20202020-2020-2020-2020-202020202008', '10101010-1010-1010-1010-101010101008', 'a1111111-1111-1111-1111-111111111101', 'Carburetor & Vintage Engine Restoration Mechanic (Legacy)', 'automotive_ev', 5.0, 10.0, 180000.00, 240000.00, 2, CURRENT_DATE - INTERVAL '15 days', 'active', TRUE)
ON CONFLICT DO NOTHING;

-- 9. Job Skills Requirements Mapping
INSERT INTO public.job_skills (id, job_id, skill_id, requirement_level, weight, is_demo)
VALUES
  ('30303030-3030-3030-3030-303030303001', '20202020-2020-2020-2020-202020202001', 'b2222222-2222-2222-2222-222222222201', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303002', '20202020-2020-2020-2020-202020202001', 'b2222222-2222-2222-2222-222222222202', 'required', 0.9, TRUE),
  ('30303030-3030-3030-3030-303030303003', '20202020-2020-2020-2020-202020202002', 'b2222222-2222-2222-2222-222222222203', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303004', '20202020-2020-2020-2020-202020202003', 'b2222222-2222-2222-2222-222222222204', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303005', '20202020-2020-2020-2020-202020202003', 'b2222222-2222-2222-2222-222222222213', 'preferred', 0.7, TRUE),
  ('30303030-3030-3030-3030-303030303006', '20202020-2020-2020-2020-202020202004', 'b2222222-2222-2222-2222-222222222205', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303007', '20202020-2020-2020-2020-202020202005', 'b2222222-2222-2222-2222-222222222206', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303008', '20202020-2020-2020-2020-202020202006', 'b2222222-2222-2222-2222-222222222207', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303009', '20202020-2020-2020-2020-202020202007', 'b2222222-2222-2222-2222-222222222208', 'required', 1.0, TRUE),
  ('30303030-3030-3030-3030-303030303010', '20202020-2020-2020-2020-202020202008', 'b2222222-2222-2222-2222-222222222216', 'required', 1.0, TRUE)
ON CONFLICT (job_id, skill_id) DO NOTHING;

-- 10. Historical Placements
INSERT INTO public.placements (id, course_id, batch_year, total_graduates, placed_graduates, avg_salary_monthly, median_salary_monthly, top_placement_partner, is_demo)
VALUES
  ('40404040-4040-4040-4040-404040404001', 'd4444444-4444-4444-4444-444444444401', 2024, 52, 38, 24500.00, 23000.00, 'Apex Dynamics Mobility Ltd (Synthetic Entity)', TRUE),
  ('40404040-4040-4040-4040-404040404002', 'd4444444-4444-4444-4444-444444444401', 2025, 56, 46, 27500.00, 26000.00, 'Apex Dynamics & Veloce E-Mobility (Synthetic Entities)', TRUE),
  ('40404040-4040-4040-4040-404040404003', 'd4444444-4444-4444-4444-444444444402', 2024, 38, 34, 28000.00, 27000.00, 'Precision Multi-Axis Robotics Ltd (Synthetic Entity)', TRUE),
  ('40404040-4040-4040-4040-404040404004', 'd4444444-4444-4444-4444-444444444402', 2025, 40, 38, 31000.00, 30000.00, 'Precision Multi-Axis Robotics & Kalyani Mechatronics (Synthetic Entities)', TRUE),
  ('40404040-4040-4040-4040-404040404005', 'd4444444-4444-4444-4444-444444444406', 2024, 35, 16, 15000.00, 14500.00, 'Vintage Motor Spares & Overhaul (Synthetic Entity)', TRUE),
  ('40404040-4040-4040-4040-404040404006', 'd4444444-4444-4444-4444-444444444406', 2025, 32, 11, 15500.00, 15000.00, 'Vintage Motor Spares & Overhaul (Synthetic Entity)', TRUE)
ON CONFLICT (course_id, batch_year) DO NOTHING;

-- 11. Trainers & Competencies
INSERT INTO public.trainers (id, training_center_id, name, email, qualification, years_of_experience, status, is_demo)
VALUES
  ('50505050-5050-5050-5050-505050505001', 'c3333333-3333-3333-3333-333333333301', 'Sunil Deshmukh', 's.deshmukh@iti-pune-demo.gov.in', 'Diploma in Automobile Engineering', 8.5, 'active', TRUE),
  ('50505050-5050-5050-5050-505050505002', 'c3333333-3333-3333-3333-333333333302', 'K. Murugesan', 'k.murugesan@poly-cbe-demo.gov.in', 'M.Tech Production Engineering', 12.0, 'active', TRUE),
  ('50505050-5050-5050-5050-505050505003', 'c3333333-3333-3333-3333-333333333302', 'Revathi Senthil', 'r.senthil@poly-cbe-demo.gov.in', 'B.E. Mechatronics', 5.5, 'active', TRUE),
  ('50505050-5050-5050-5050-505050505004', 'c3333333-3333-3333-3333-333333333301', 'Bapu Kadam', 'b.kadam@iti-pune-demo.gov.in', 'ITI Motor Mechanic Trade Certificate', 24.0, 'upskilling_required', TRUE)
ON CONFLICT DO NOTHING;

-- 12. Equipment Inventories
INSERT INTO public.equipment (id, training_center_id, name, trade_sector, model_specification, quantity_total, quantity_operational, condition_rating, is_demo)
VALUES
  ('60606060-6060-6060-6060-606060606001', 'c3333333-3333-3333-3333-333333333301', 'Automated EV Lithium Battery Pack Cycler 400V 60A', 'automotive_ev', 'Automated 400V 60A Battery Testing & Balancing Rig', 3, 2, 'operational_good', TRUE),
  ('60606060-6060-6060-6060-606060606002', 'c3333333-3333-3333-3333-333333333301', 'Vector CANoe CAN Bus Protocol Analyzer Bench', 'automotive_ev', 'Vector VN1630A Interface with CANoe Diagnostics', 4, 1, 'needs_maintenance', TRUE),
  ('60606060-6060-6060-6060-606060606003', 'c3333333-3333-3333-3333-333333333302', 'Jyoti 3-Axis CNC Vertical Machining Center VMC 430', 'manufacturing_cnc', 'Jyoti VMC 430 with Siemens 828D Controller', 4, 4, 'operational_good', TRUE),
  ('60606060-6060-6060-6060-606060606004', 'c3333333-3333-3333-3333-333333333302', 'DMG Mori 5-Axis Universal Machining Center', 'manufacturing_cnc', 'DMG Mori DMU 50 5-Axis Simultaneous Mill', 1, 0, 'non_operational', TRUE),
  ('60606060-6060-6060-6060-606060606005', 'c3333333-3333-3333-3333-333333333302', 'KUKA 6-Axis Articulated Industrial Robot Cybertech', 'manufacturing_cnc', 'KUKA KR 16 R2010 Cybertech with KRC4 Controller', 2, 1, 'needs_maintenance', TRUE)
ON CONFLICT DO NOTHING;
