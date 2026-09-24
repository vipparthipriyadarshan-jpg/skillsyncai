/**
 * Skill Sync AI - Skill Graph Relational Service
 * Problem Statement ID: 26134
 * 
 * Dynamic Graph Generation Engine:
 * Generates nodes and relationship edges directly from relational database schema
 * without hardcoded graph edges.
 * 
 * Relationships:
 * - Job Role -> Requires Skill (via job_skills)
 * - Course -> Teaches Skill (via course_skills)
 * - Trainer -> Has Skill (via trainer_skills)
 * - Training Center -> Offers Course (via courses.training_center_id)
 * - Employer -> Requires Skill (aggregated via job postings -> job_skills)
 * - District -> Contains Center (via training_centers.district_id)
 * - Course -> Has Module (via course_modules.course_id)
 * - Training Center -> Employs Trainer (via trainers.training_center_id)
 * - Employer -> Posts Job (via job_postings.employer_id)
 * - District -> Contains Employer (via employers.district_id)
 */

import {
  GraphEdgeType,
  GraphFilterParams,
  GraphNodeData,
  GraphNodeType,
  NodeDetailInspection,
  SkillGraphEdge,
  SkillGraphNode,
  SkillGraphSummary,
} from "./types";

// ============================================================================
// RELATIONAL DATABASE REPOSITORY (Matches 001_demo_seed.sql & Relational Schema)
// ============================================================================

export interface RelDistrict {
  id: string;
  name: string;
  state: string;
  code: string;
}

export interface RelTrainingCenter {
  id: string;
  districtId: string;
  name: string;
  code: string;
  institutionType: string;
  totalActiveStudents: number;
}

export interface RelCourse {
  id: string;
  trainingCenterId: string;
  name: string;
  code: string;
  tradeSector: string;
  durationHours: number;
  annualIntakeCapacity: number;
  currentEnrollment: number;
}

export interface RelCourseModule {
  id: string;
  courseId: string;
  moduleNumber: number;
  title: string;
  theoryHours: number;
  practicalHours: number;
}

export interface RelCourseSkill {
  id: string;
  courseId: string;
  skillId: string;
  proficiencyTargeted: "introductory" | "intermediate" | "advanced" | "expert";
  allocatedHours: number;
  isCore: boolean;
}

export interface RelTrainer {
  id: string;
  trainingCenterId: string;
  name: string;
  qualification: string;
  yearsOfExperience: number;
  status: "active" | "upskilling_required";
}

export interface RelTrainerSkill {
  id: string;
  trainerId: string;
  skillId: string;
  proficiency: "introductory" | "intermediate" | "advanced" | "expert";
  certifiedBy: string;
}

export interface RelEmployer {
  id: string;
  districtId: string;
  companyName: string;
  sector: string;
  companySize: string;
}

export interface RelJobPosting {
  id: string;
  employerId: string;
  districtId: string;
  title: string;
  sector: string;
  vacanciesCount: number;
  salaryMin: number;
  salaryMax: number;
}

export interface RelJobSkill {
  id: string;
  jobId: string;
  skillId: string;
  requirementLevel: "required" | "preferred";
  weight: number;
}

export interface RelSkill {
  id: string;
  name: string;
  slug: string;
  category: "technical" | "tool" | "soft_skill" | "compliance_standard";
  isEmerging: boolean;
  description: string;
}

// Master Database Tables
export const DB_DISTRICTS: RelDistrict[] = [
  { id: "dist-pune", name: "Pune", state: "Maharashtra", code: "MH-PUN" },
  { id: "dist-cbe", name: "Coimbatore", state: "Tamil Nadu", code: "TN-CBE" },
  { id: "dist-ahm", name: "Ahmedabad", state: "Gujarat", code: "GJ-AHM" },
  { id: "dist-ben", name: "Bengaluru Urban", state: "Karnataka", code: "KA-BEN" },
];

export const DB_SKILLS: RelSkill[] = [
  {
    id: "sk-ev-battery",
    name: "EV Battery Diagnostics",
    slug: "ev-battery-diagnostics",
    category: "technical",
    isEmerging: true,
    description: "Testing, balancing, and troubleshooting high-voltage Lithium-ion battery packs",
  },
  {
    id: "sk-bms",
    name: "Battery Management Systems (BMS)",
    slug: "bms-configuration",
    category: "technical",
    isEmerging: true,
    description: "Firmware configuration, CAN telemetry, and thermal runaway mitigation",
  },
  {
    id: "sk-can-bus",
    name: "Automotive CAN Bus Protocol",
    slug: "can-bus-protocol",
    category: "technical",
    isEmerging: false,
    description: "Controller Area Network frame analysis, arbitration IDs, and bus physical layer checks",
  },
  {
    id: "sk-solar-pv",
    name: "Solar PV Array Installation",
    slug: "solar-pv-installation",
    category: "technical",
    isEmerging: false,
    description: "Mechanical array structure assembly, string balancing, and DC disconnect terminations",
  },
  {
    id: "sk-grid-inverter",
    name: "Grid-Tie Solar Inverter Sizing",
    slug: "grid-tie-inverter-sizing",
    category: "technical",
    isEmerging: true,
    description: "MPPT calculation, IEEE 1547 utility synchronization, and reactive power control",
  },
  {
    id: "sk-cnc-5axis",
    name: "5-Axis CNC Milling",
    slug: "5-axis-cnc-milling",
    category: "technical",
    isEmerging: true,
    description: "Simultaneous multi-axis kinematic path programming and clearance collision checks",
  },
  {
    id: "sk-gcode",
    name: "G-Code & M-Code Programming",
    slug: "g-code-programming",
    category: "tool",
    isEmerging: false,
    description: "Standard computerized numerical control syntax, tool offsets, and canned cycles",
  },
  {
    id: "sk-loto",
    name: "Industrial Safety & Lockout/Tagout",
    slug: "loto-safety",
    category: "compliance_standard",
    isEmerging: false,
    description: "Zero energy state verification, OSHA 1910.147 isolation, and arc flash safety",
  },
];

export const DB_TRAINING_CENTERS: RelTrainingCenter[] = [
  {
    id: "tc-iti-aundh",
    districtId: "dist-pune",
    name: "Government ITI Aundh (Pune)",
    code: "ITI-MH-PUN-01",
    institutionType: "iti_government",
    totalActiveStudents: 680,
  },
  {
    id: "tc-poly-cbe",
    districtId: "dist-cbe",
    name: "Government Polytechnic Coimbatore",
    code: "POLY-TN-CBE-04",
    institutionType: "polytechnic_college",
    totalActiveStudents: 1150,
  },
  {
    id: "tc-gsta-ahm",
    districtId: "dist-ahm",
    name: "Gujarat Skill Training Academy Ahmedabad",
    code: "GSTA-GJ-AHM-02",
    institutionType: "pmkk_center",
    totalActiveStudents: 420,
  },
];

export const DB_COURSES: RelCourse[] = [
  {
    id: "course-ev-tech",
    trainingCenterId: "tc-iti-aundh",
    name: "Electric Vehicle Service & Maintenance Technician",
    code: "EV-TECH-201",
    tradeSector: "automotive_ev",
    durationHours: 1200,
    annualIntakeCapacity: 60,
    currentEnrollment: 58,
  },
  {
    id: "course-cnc-prog",
    trainingCenterId: "tc-poly-cbe",
    name: "CNC Machinist & Multi-Axis Programmer",
    code: "CNC-PROG-301",
    tradeSector: "manufacturing_cnc",
    durationHours: 1600,
    annualIntakeCapacity: 80,
    currentEnrollment: 74,
  },
  {
    id: "course-solar-grid",
    trainingCenterId: "tc-gsta-ahm",
    name: "Solar Photovoltaic Installation & Smart Grid Tech",
    code: "SOL-GRID-101",
    tradeSector: "renewable_energy",
    durationHours: 800,
    annualIntakeCapacity: 50,
    currentEnrollment: 48,
  },
];

export const DB_COURSE_MODULES: RelCourseModule[] = [
  {
    id: "mod-ev-safe",
    courseId: "course-ev-tech",
    moduleNumber: 1,
    title: "EV Fundamentals & High Voltage Safety",
    theoryHours: 40,
    practicalHours: 60,
  },
  {
    id: "mod-ev-bat",
    courseId: "course-ev-tech",
    moduleNumber: 2,
    title: "Traction Battery Pack Assembly & Diagnostics",
    theoryHours: 60,
    practicalHours: 140,
  },
  {
    id: "mod-cnc-basic",
    courseId: "course-cnc-prog",
    moduleNumber: 1,
    title: "CNC Basics & G/M Code Programming",
    theoryHours: 80,
    practicalHours: 160,
  },
  {
    id: "mod-cnc-5ax",
    courseId: "course-cnc-prog",
    moduleNumber: 2,
    title: "Multi-Axis Machining Operations",
    theoryHours: 60,
    practicalHours: 200,
  },
  {
    id: "mod-sol-array",
    courseId: "course-solar-grid",
    moduleNumber: 1,
    title: "Solar PV Array Mechanical & Electrical Mounting",
    theoryHours: 40,
    practicalHours: 80,
  },
];

export const DB_COURSE_SKILLS: RelCourseSkill[] = [
  {
    id: "cs-01",
    courseId: "course-ev-tech",
    skillId: "sk-ev-battery",
    proficiencyTargeted: "intermediate",
    allocatedHours: 140,
    isCore: true,
  },
  {
    id: "cs-02",
    courseId: "course-ev-tech",
    skillId: "sk-loto",
    proficiencyTargeted: "advanced",
    allocatedHours: 60,
    isCore: true,
  },
  {
    id: "cs-03",
    courseId: "course-cnc-prog",
    skillId: "sk-gcode",
    proficiencyTargeted: "advanced",
    allocatedHours: 180,
    isCore: true,
  },
  {
    id: "cs-04",
    courseId: "course-cnc-prog",
    skillId: "sk-cnc-5axis",
    proficiencyTargeted: "intermediate",
    allocatedHours: 160,
    isCore: true,
  },
  {
    id: "cs-05",
    courseId: "course-solar-grid",
    skillId: "sk-solar-pv",
    proficiencyTargeted: "advanced",
    allocatedHours: 120,
    isCore: true,
  },
  {
    id: "cs-06",
    courseId: "course-solar-grid",
    skillId: "sk-grid-inverter",
    proficiencyTargeted: "intermediate",
    allocatedHours: 100,
    isCore: true,
  },
];

export const DB_TRAINERS: RelTrainer[] = [
  {
    id: "tr-sunil",
    trainingCenterId: "tc-iti-aundh",
    name: "Sunil Deshmukh",
    qualification: "Diploma in Automobile Engineering",
    yearsOfExperience: 8.5,
    status: "active",
  },
  {
    id: "tr-vikram",
    trainingCenterId: "tc-iti-aundh",
    name: "Vikram Patil",
    qualification: "B.Tech Electrical & Electronics",
    yearsOfExperience: 4.0,
    status: "upskilling_required",
  },
  {
    id: "tr-murugesan",
    trainingCenterId: "tc-poly-cbe",
    name: "K. Murugesan",
    qualification: "M.Tech Production Engineering",
    yearsOfExperience: 12.0,
    status: "active",
  },
];

export const DB_TRAINER_SKILLS: RelTrainerSkill[] = [
  {
    id: "ts-01",
    trainerId: "tr-sunil",
    skillId: "sk-loto",
    proficiency: "expert",
    certifiedBy: "Directorate General of Training (DGT)",
  },
  {
    id: "ts-02",
    trainerId: "tr-sunil",
    skillId: "sk-ev-battery",
    proficiency: "intermediate",
    certifiedBy: "Automotive Skills Development Council (ASDC)",
  },
  {
    id: "ts-03",
    trainerId: "tr-murugesan",
    skillId: "sk-gcode",
    proficiency: "expert",
    certifiedBy: "National Skill Development Corporation (NSDC)",
  },
  {
    id: "ts-04",
    trainerId: "tr-murugesan",
    skillId: "sk-cnc-5axis",
    proficiency: "advanced",
    certifiedBy: "Siemens CNC Academy",
  },
];

export const DB_EMPLOYERS: RelEmployer[] = [
  {
    id: "emp-tata",
    districtId: "dist-pune",
    companyName: "Tata Motors Passenger EV Division",
    sector: "automotive_ev",
    companySize: "large_multinational",
  },
  {
    id: "emp-bharatforge",
    districtId: "dist-pune",
    companyName: "Bharat Forge Advanced Mobility Div",
    sector: "automotive_ev",
    companySize: "large_multinational",
  },
  {
    id: "emp-lmw",
    districtId: "dist-cbe",
    companyName: "LMW Precision Machine Works",
    sector: "manufacturing_cnc",
    companySize: "large_multinational",
  },
  {
    id: "emp-adani",
    districtId: "dist-ahm",
    companyName: "Adani Solar Manufacturing Ltd",
    sector: "renewable_energy",
    companySize: "large_multinational",
  },
];

export const DB_JOB_POSTINGS: RelJobPosting[] = [
  {
    id: "job-tata-ev-tech",
    employerId: "emp-tata",
    districtId: "dist-pune",
    title: "EV Battery Assembly & Quality Technician",
    sector: "automotive_ev",
    vacanciesCount: 35,
    salaryMin: 280000,
    salaryMax: 420000,
  },
  {
    id: "job-bf-can-spec",
    employerId: "emp-bharatforge",
    districtId: "dist-pune",
    title: "CAN Bus Diagnostic & Wire Harness Specialist",
    sector: "automotive_ev",
    vacanciesCount: 18,
    salaryMin: 350000,
    salaryMax: 550000,
  },
  {
    id: "job-lmw-cnc-op",
    employerId: "emp-lmw",
    districtId: "dist-cbe",
    title: "Senior 5-Axis CNC Mill Operator",
    sector: "manufacturing_cnc",
    vacanciesCount: 24,
    salaryMin: 400000,
    salaryMax: 650000,
  },
  {
    id: "job-adani-solar-eng",
    employerId: "emp-adani",
    districtId: "dist-ahm",
    title: "Solar PV Array & Inverter Technician",
    sector: "renewable_energy",
    vacanciesCount: 20,
    salaryMin: 260000,
    salaryMax: 380000,
  },
];

export const DB_JOB_SKILLS: RelJobSkill[] = [
  {
    id: "js-01",
    jobId: "job-tata-ev-tech",
    skillId: "sk-ev-battery",
    requirementLevel: "required",
    weight: 1.0,
  },
  {
    id: "js-02",
    jobId: "job-tata-ev-tech",
    skillId: "sk-bms",
    requirementLevel: "required",
    weight: 0.9,
  },
  {
    id: "js-03",
    jobId: "job-bf-can-spec",
    skillId: "sk-can-bus",
    requirementLevel: "required",
    weight: 1.0,
  },
  {
    id: "js-04",
    jobId: "job-bf-can-spec",
    skillId: "sk-ev-battery",
    requirementLevel: "preferred",
    weight: 0.8,
  },
  {
    id: "js-05",
    jobId: "job-lmw-cnc-op",
    skillId: "sk-cnc-5axis",
    requirementLevel: "required",
    weight: 1.0,
  },
  {
    id: "js-06",
    jobId: "job-lmw-cnc-op",
    skillId: "sk-gcode",
    requirementLevel: "required",
    weight: 0.9,
  },
  {
    id: "js-07",
    jobId: "job-adani-solar-eng",
    skillId: "sk-solar-pv",
    requirementLevel: "required",
    weight: 1.0,
  },
  {
    id: "js-08",
    jobId: "job-adani-solar-eng",
    skillId: "sk-grid-inverter",
    requirementLevel: "required",
    weight: 0.9,
  },
];

// ============================================================================
// DYNAMIC GRAPH GENERATOR (Builds nodes & edges strictly from relational links)
// ============================================================================

export interface GeneratedGraphResult {
  nodes: SkillGraphNode[];
  edges: SkillGraphEdge[];
  summary: SkillGraphSummary;
  sectors: string[];
  districts: string[];
}

export function buildSkillGraph(filters?: GraphFilterParams): GeneratedGraphResult {
  const query = filters?.searchQuery?.trim().toLowerCase() || "";
  const filterSector = filters?.sector && filters.sector !== "all" ? filters.sector : null;
  const filterDistrict = filters?.district && filters.district !== "all" ? filters.district : null;
  const allowedNodeTypes = new Set<GraphNodeType>(
    filters?.nodeTypes && filters.nodeTypes.length > 0
      ? filters.nodeTypes
      : [
          "district",
          "training_center",
          "course",
          "module",
          "trainer",
          "employer",
          "job_role",
          "skill",
        ]
  );

  // 1. DYNAMICALLY BUILD RAW NODES FROM RELATIONAL TABLES
  const rawNodes: GraphNodeData[] = [];
  const districtNameById = new Map<string, string>();

  // District Nodes
  DB_DISTRICTS.forEach((d) => {
    districtNameById.set(d.id, d.name);
    rawNodes.push({
      id: `node-${d.id}`,
      entityId: d.id,
      label: d.name,
      sublabel: `${d.state} (${d.code})`,
      nodeType: "district",
      district: d.name,
      metrics: {},
      attributes: {
        state: d.state,
        code: d.code,
      },
    });
  });

  // Training Center Nodes
  DB_TRAINING_CENTERS.forEach((tc) => {
    const distName = districtNameById.get(tc.districtId);
    rawNodes.push({
      id: `node-${tc.id}`,
      entityId: tc.id,
      label: tc.name,
      sublabel: tc.code,
      nodeType: "training_center",
      district: distName,
      metrics: {
        activeStudents: tc.totalActiveStudents,
      },
      attributes: {
        institutionType: tc.institutionType,
      },
    });
  });

  // Course Nodes
  DB_COURSES.forEach((c) => {
    const center = DB_TRAINING_CENTERS.find((tc) => tc.id === c.trainingCenterId);
    const distName = center ? districtNameById.get(center.districtId) : undefined;
    rawNodes.push({
      id: `node-${c.id}`,
      entityId: c.id,
      label: c.name,
      sublabel: c.code,
      nodeType: "course",
      sector: c.tradeSector,
      district: distName,
      metrics: {
        durationHours: c.durationHours,
        intakeCapacity: c.annualIntakeCapacity,
        activeStudents: c.currentEnrollment,
      },
      attributes: {
        sector: c.tradeSector,
      },
    });
  });

  // Module Nodes
  DB_COURSE_MODULES.forEach((m) => {
    const course = DB_COURSES.find((c) => c.id === m.courseId);
    rawNodes.push({
      id: `node-${m.id}`,
      entityId: m.id,
      label: m.title,
      sublabel: `Module ${m.moduleNumber}`,
      nodeType: "module",
      sector: course?.tradeSector,
      metrics: {
        theoryHours: m.theoryHours,
        practicalHours: m.practicalHours,
        durationHours: m.theoryHours + m.practicalHours,
      },
    });
  });

  // Trainer Nodes
  DB_TRAINERS.forEach((tr) => {
    const center = DB_TRAINING_CENTERS.find((tc) => tc.id === tr.trainingCenterId);
    const distName = center ? districtNameById.get(center.districtId) : undefined;
    rawNodes.push({
      id: `node-${tr.id}`,
      entityId: tr.id,
      label: tr.name,
      sublabel: tr.qualification,
      nodeType: "trainer",
      district: distName,
      metrics: {
        experienceYears: tr.yearsOfExperience,
      },
      attributes: {
        status: tr.status,
      },
    });
  });

  // Employer Nodes
  DB_EMPLOYERS.forEach((emp) => {
    const distName = districtNameById.get(emp.districtId);
    rawNodes.push({
      id: `node-${emp.id}`,
      entityId: emp.id,
      label: emp.companyName,
      sublabel: emp.companySize.replace("_", " ").toUpperCase(),
      nodeType: "employer",
      sector: emp.sector,
      district: distName,
      metrics: {},
      attributes: {
        sector: emp.sector,
      },
    });
  });

  // Job Role Nodes
  DB_JOB_POSTINGS.forEach((job) => {
    const employer = DB_EMPLOYERS.find((e) => e.id === job.employerId);
    const distName = districtNameById.get(job.districtId);
    rawNodes.push({
      id: `node-${job.id}`,
      entityId: job.id,
      label: job.title,
      sublabel: `${employer?.companyName || "Employer"} • ${job.vacanciesCount} Vacancies`,
      nodeType: "job_role",
      sector: job.sector,
      district: distName,
      metrics: {
        vacancies: job.vacanciesCount,
        salaryRange: `₹${(job.salaryMin / 100000).toFixed(1)}L - ₹${(job.salaryMax / 100000).toFixed(1)}L`,
      },
      attributes: {
        salaryMin: job.salaryMin,
        salaryMax: job.salaryMax,
      },
    });
  });

  // Skill Nodes
  DB_SKILLS.forEach((sk) => {
    rawNodes.push({
      id: `node-${sk.id}`,
      entityId: sk.id,
      label: sk.name,
      sublabel: sk.category.toUpperCase(),
      nodeType: "skill",
      metrics: {
        isEmerging: sk.isEmerging,
        category: sk.category,
      },
      attributes: {
        description: sk.description,
        slug: sk.slug,
      },
    });
  });

  // 2. DYNAMICALLY BUILD EDGES FROM RELATIONAL FOREIGN KEYS
  const rawEdges: SkillGraphEdge[] = [];

  // A. District -> Contains Center (training_centers.district_id -> districts.id)
  DB_TRAINING_CENTERS.forEach((tc) => {
    rawEdges.push({
      id: `edge-dist-tc-${tc.id}`,
      source: `node-${tc.districtId}`,
      target: `node-${tc.id}`,
      label: "Contains Center",
      data: { relationType: "contains_center" },
    });
  });

  // B. Center -> Offers Course (courses.training_center_id -> training_centers.id)
  DB_COURSES.forEach((c) => {
    rawEdges.push({
      id: `edge-tc-course-${c.id}`,
      source: `node-${c.trainingCenterId}`,
      target: `node-${c.id}`,
      label: "Offers Course",
      data: { relationType: "offers_course" },
    });
  });

  // C. Course -> Has Module (course_modules.course_id -> courses.id)
  DB_COURSE_MODULES.forEach((m) => {
    rawEdges.push({
      id: `edge-course-mod-${m.id}`,
      source: `node-${m.courseId}`,
      target: `node-${m.id}`,
      label: "Has Module",
      data: { relationType: "has_module" },
    });
  });

  // D. Course -> Teaches Skill (course_skills.course_id -> skill_id)
  DB_COURSE_SKILLS.forEach((cs) => {
    rawEdges.push({
      id: `edge-course-sk-${cs.id}`,
      source: `node-${cs.courseId}`,
      target: `node-${cs.skillId}`,
      label: `Teaches Skill (${cs.proficiencyTargeted})`,
      animated: true,
      data: {
        relationType: "teaches_skill",
        proficiency: cs.proficiencyTargeted,
        weight: cs.allocatedHours,
      },
    });
  });

  // E. Center -> Employs Trainer (trainers.training_center_id -> training_centers.id)
  DB_TRAINERS.forEach((tr) => {
    rawEdges.push({
      id: `edge-tc-trainer-${tr.id}`,
      source: `node-${tr.trainingCenterId}`,
      target: `node-${tr.id}`,
      label: "Employs Trainer",
      data: { relationType: "employs_trainer" },
    });
  });

  // F. Trainer -> Has Skill (trainer_skills.trainer_id -> skill_id)
  DB_TRAINER_SKILLS.forEach((ts) => {
    rawEdges.push({
      id: `edge-tr-sk-${ts.id}`,
      source: `node-${ts.trainerId}`,
      target: `node-${ts.skillId}`,
      label: `Has Skill (${ts.proficiency})`,
      data: {
        relationType: "has_skill",
        proficiency: ts.proficiency,
      },
    });
  });

  // G. District -> Contains Employer (employers.district_id -> districts.id)
  DB_EMPLOYERS.forEach((emp) => {
    rawEdges.push({
      id: `edge-dist-emp-${emp.id}`,
      source: `node-${emp.districtId}`,
      target: `node-${emp.id}`,
      label: "Contains Employer",
      data: { relationType: "contains_employer" },
    });
  });

  // H. Employer -> Posts Job (job_postings.employer_id -> employers.id)
  DB_JOB_POSTINGS.forEach((job) => {
    rawEdges.push({
      id: `edge-emp-job-${job.id}`,
      source: `node-${job.employerId}`,
      target: `node-${job.id}`,
      label: "Posts Job",
      data: { relationType: "posts_job" },
    });
  });

  // I. Job -> Requires Skill (job_skills.job_id -> skill_id)
  DB_JOB_SKILLS.forEach((js) => {
    rawEdges.push({
      id: `edge-job-sk-${js.id}`,
      source: `node-${js.jobId}`,
      target: `node-${js.skillId}`,
      label: `Requires Skill (${js.requirementLevel})`,
      animated: true,
      data: {
        relationType: "requires_skill",
        weight: js.weight,
      },
    });
  });

  // J. Employer -> Requires Skill (Dynamic Relational Aggregation via active jobs)
  const employerSkillPairs = new Set<string>();
  DB_JOB_POSTINGS.forEach((job) => {
    const skillsForJob = DB_JOB_SKILLS.filter((js) => js.jobId === job.id);
    skillsForJob.forEach((js) => {
      const pairKey = `${job.employerId}:${js.skillId}`;
      if (!employerSkillPairs.has(pairKey)) {
        employerSkillPairs.add(pairKey);
        rawEdges.push({
          id: `edge-emp-sk-${job.employerId}-${js.skillId}`,
          source: `node-${job.employerId}`,
          target: `node-${js.skillId}`,
          label: "Requires Skill",
          data: { relationType: "requires_skill" },
        });
      }
    });
  });

  // 3. APPLY FILTERS & SEARCH MATCHING
  // Filter nodes according to allowed node types, sector, and district
  const filteredNodes = rawNodes.filter((node) => {
    if (!allowedNodeTypes.has(node.nodeType)) {
      return false;
    }
    if (filterSector && node.sector && node.sector !== filterSector) {
      return false;
    }
    if (filterDistrict && node.district && node.district !== filterDistrict) {
      return false;
    }
    return true;
  });

  const validNodeIds = new Set(filteredNodes.map((n) => n.id));

  // Filter edges to ensure both source and target nodes exist in the visible set
  const filteredEdges = rawEdges.filter((edge) => {
    return validNodeIds.has(edge.source) && validNodeIds.has(edge.target);
  });

  // Search matching: mark nodes that match query or connect to matching nodes
  let matchedCount = 0;
  if (query.length > 0) {
    filteredNodes.forEach((node) => {
      const labelMatch = node.label.toLowerCase().includes(query);
      const sublabelMatch = node.sublabel?.toLowerCase().includes(query) ?? false;
      const sectorMatch = node.sector?.toLowerCase().includes(query) ?? false;
      const districtMatch = node.district?.toLowerCase().includes(query) ?? false;
      const typeMatch = node.nodeType.toLowerCase().includes(query);

      const isDirectMatch = labelMatch || sublabelMatch || sectorMatch || districtMatch || typeMatch;
      if (isDirectMatch) {
        node.matched = true;
        matchedCount++;
      } else {
        node.matched = false;
      }
    });

    // Dim non-matching nodes if any matches exist
    if (matchedCount > 0) {
      const matchedNodeIds = new Set(filteredNodes.filter((n) => n.matched).map((n) => n.id));
      // Also highlight directly connected neighbor nodes
      filteredEdges.forEach((edge) => {
        if (matchedNodeIds.has(edge.source)) matchedNodeIds.add(edge.target);
        if (matchedNodeIds.has(edge.target)) matchedNodeIds.add(edge.source);
      });

      filteredNodes.forEach((node) => {
        node.isDimmed = !matchedNodeIds.has(node.id);
      });
    }
  } else {
    filteredNodes.forEach((node) => {
      node.matched = false;
      node.isDimmed = false;
    });
  }

  // 4. COMPUTE DETERMINISTIC 2D POSITIONS (Hierarchical / Stratified Flow)
  // Group by node type to arrange into logical tiers:
  // Tier 0 (x: 50):   District
  // Tier 1 (x: 400):  Training Center & Employer
  // Tier 2 (x: 820):  Course & Job Role
  // Tier 3 (x: 1240): Module & Trainer
  // Tier 4 (x: 1680): Skill (Central Nexus)
  const nodeTypeXPosition: Record<GraphNodeType, number> = {
    district: 60,
    training_center: 400,
    employer: 400,
    course: 780,
    job_role: 780,
    module: 1180,
    trainer: 1180,
    skill: 1600,
  };

  const currentYByType: Record<GraphNodeType, number> = {
    district: 80,
    training_center: 60,
    employer: 480,
    course: 60,
    job_role: 500,
    module: 60,
    trainer: 420,
    skill: 80,
  };

  const ySpacingByType: Record<GraphNodeType, number> = {
    district: 180,
    training_center: 200,
    employer: 190,
    course: 190,
    job_role: 180,
    module: 140,
    trainer: 170,
    skill: 150,
  };

  const skillGraphNodes: SkillGraphNode[] = filteredNodes.map((node) => {
    const x = nodeTypeXPosition[node.nodeType] || 100;
    const y = currentYByType[node.nodeType] || 100;
    currentYByType[node.nodeType] = y + (ySpacingByType[node.nodeType] || 150);

    return {
      id: node.id,
      type: "custom",
      position: { x, y },
      data: node,
    };
  });

  // 5. CALCULATE SUMMARY
  const byNodeType: Record<GraphNodeType, number> = {
    district: 0,
    training_center: 0,
    course: 0,
    module: 0,
    trainer: 0,
    employer: 0,
    job_role: 0,
    skill: 0,
  };
  filteredNodes.forEach((n) => {
    byNodeType[n.nodeType] = (byNodeType[n.nodeType] || 0) + 1;
  });

  const byEdgeType: Record<GraphEdgeType, number> = {
    requires_skill: 0,
    teaches_skill: 0,
    has_skill: 0,
    offers_course: 0,
    contains_center: 0,
    has_module: 0,
    employs_trainer: 0,
    posts_job: 0,
    contains_employer: 0,
  };
  filteredEdges.forEach((e) => {
    byEdgeType[e.data.relationType] = (byEdgeType[e.data.relationType] || 0) + 1;
  });

  const sectors = Array.from(
    new Set([
      ...DB_COURSES.map((c) => c.tradeSector),
      ...DB_EMPLOYERS.map((e) => e.sector),
    ])
  ).sort();

  const districts = DB_DISTRICTS.map((d) => d.name).sort();

  return {
    nodes: skillGraphNodes,
    edges: filteredEdges,
    summary: {
      totalNodes: skillGraphNodes.length,
      totalEdges: filteredEdges.length,
      byNodeType,
      byEdgeType,
      sectors,
      districts,
    },
    sectors,
    districts,
  };
}

// ============================================================================
// NODE DETAIL INSPECTOR
// ============================================================================

export function inspectNode(
  nodeId: string,
  nodes: SkillGraphNode[],
  edges: SkillGraphEdge[]
): NodeDetailInspection | null {
  const targetNode = nodes.find((n) => n.id === nodeId);
  if (!targetNode) return null;

  const nodeMap = new Map<string, GraphNodeData>();
  nodes.forEach((n) => nodeMap.set(n.id, n.data));

  const incomingEdges: { edge: SkillGraphEdge; sourceNode: GraphNodeData }[] = [];
  const outgoingEdges: { edge: SkillGraphEdge; targetNode: GraphNodeData }[] = [];
  const connectedNodeIds = new Set<string>();

  edges.forEach((edge) => {
    if (edge.target === nodeId) {
      const sourceData = nodeMap.get(edge.source);
      if (sourceData) {
        incomingEdges.push({ edge, sourceNode: sourceData });
        connectedNodeIds.add(edge.source);
      }
    }
    if (edge.source === nodeId) {
      const targetData = nodeMap.get(edge.target);
      if (targetData) {
        outgoingEdges.push({ edge, targetNode: targetData });
        connectedNodeIds.add(edge.target);
      }
    }
  });

  return {
    node: targetNode.data,
    incomingEdges,
    outgoingEdges,
    relatedNodesCount: connectedNodeIds.size,
  };
}
