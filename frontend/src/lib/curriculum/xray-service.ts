/**
 * Curriculum X-Ray Service
 * Deterministic syllabus audit engine comparing vocational curricula with real-time industry demand.
 * 
 * Features:
 * 1. Side-by-side skill comparison (Industry Requirement %, Curriculum Coverage %, Gap %)
 * 2. 4 Categorical tiers: CRITICAL GAP, MAJOR GAP, MODERATE GAP, ALIGNED
 * 3. Transparent mathematical scoring logic (no arbitrary AI scores)
 * 4. "Why is this a gap?" explanation generator backed by employer survey feedback and placement statistics
 * 5. Actionable recommended curriculum changes with human approval safeguards (no auto-overwriting)
 */

export interface CourseModule {
  moduleNumber: number;
  title: string;
  theoryHours: number;
  practicalHours: number;
  description: string;
}

export interface CourseSkillRequirement {
  skillName: string;
  skillSlug: string;
  category: "technical" | "tool" | "soft_skill" | "domain_knowledge" | "compliance_standard";
  allocatedHours: number;
  targetProficiency: "introductory" | "intermediate" | "advanced" | "expert";
  isCore: boolean;
}

export interface CourseProfile {
  id: string;
  code: string;
  name: string;
  trainingCenter: string;
  district: string;
  tradeSector: string;
  totalHours: number;
  durationMonths: number;
  annualCapacity: number;
  currentEnrollment: number;
  modules: CourseModule[];
  skills: CourseSkillRequirement[];
  employerFeedback: {
    employerName: string;
    relevanceScore: number; // 1 - 5
    curriculumModernityScore: number; // 1 - 5
    practicalReadinessScore: number; // 1 - 5
    hiringCommitmentCount: number;
    verbatimFeedback: string;
  };
  placementStatistics: {
    recentBatchYear: number;
    graduatesCount: number;
    placedCount: number;
    placementRatePct: number;
    averageSalaryMonthly: number;
    primaryPlacementPartner: string;
  };
}

export interface SkillGapAnalysisItem {
  skillName: string;
  skillSlug: string;
  category: string;
  industryRequirementScore: number; // 0 - 100%
  curriculumCoverageScore: number;   // 0 - 100%
  gapScore: number;                  // 0 - 100%
  priority: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  categoryClassification: "CRITICAL GAP" | "MAJOR GAP" | "MODERATE GAP" | "ALIGNED";
  industryProficiencyRequired: "introductory" | "intermediate" | "advanced" | "expert";
  curriculumProficiencyProvided: "none" | "introductory" | "intermediate" | "advanced" | "expert";
  allocatedHoursInSyllabus: number;
  recommendedBenchmarkHours: number;
  explanation: {
    title: string;
    summary: string;
    marketDemandFactor: string;
    curriculumDeficitFactor: string;
    proficiencyMismatchFactor: string;
    employerValidationEvidence: string;
    placementRelevanceEvidence: string;
  };
}

export interface CurriculumRecommendation {
  id: string;
  courseId: string;
  skillSlug: string;
  skillName: string;
  gapCategory: "CRITICAL GAP" | "MAJOR GAP" | "MODERATE GAP";
  recommendationType: "NEW_MODULE" | "EXPAND_HOURS" | "EQUIPMENT_UPGRADE" | "PROFICIENCY_ELEVATION";
  proposedModuleTitle: string;
  recommendedTheoryHours: number;
  recommendedPracticalHours: number;
  equipmentPrerequisites: string[];
  trainerQualificationNeeded: string;
  rationale: string;
  status: "pending_review" | "approved" | "rejected";
  reviewedBy?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface CurriculumXRayReport {
  course: {
    id: string;
    code: string;
    name: string;
    trainingCenter: string;
    district: string;
    tradeSector: string;
    totalHours: number;
    durationMonths: number;
    annualCapacity: number;
    currentEnrollment: number;
    employerRelevanceRating: number;
    placementRatePct: number;
  };
  summary: {
    totalSkillsAudited: number;
    criticalGapsCount: number;
    majorGapsCount: number;
    moderateGapsCount: number;
    alignedSkillsCount: number;
    overallCurriculumAlignmentIndex: number; // 0 - 100%
  };
  skills: SkillGapAnalysisItem[];
  recommendations: CurriculumRecommendation[];
  metadata: {
    calculatedAt: string;
    engine: string;
    policyConstraint: string;
  };
}

// Master Course Syllabi Repository
const MASTER_COURSES: CourseProfile[] = [
  // 1. Electric Vehicle Service & Maintenance Technician
  {
    id: "course-ev-201",
    code: "EV-TECH-201",
    name: "Electric Vehicle Service & Maintenance Technician",
    trainingCenter: "Government ITI Aundh (Pune)",
    district: "Pune",
    tradeSector: "automotive_ev",
    totalHours: 1200,
    durationMonths: 12,
    annualCapacity: 60,
    currentEnrollment: 58,
    modules: [
      {
        moduleNumber: 1,
        title: "EV Fundamentals & Workshop Safety",
        theoryHours: 40,
        practicalHours: 60,
        description: "High-voltage workshop safety, personal protective equipment (PPE), and electrical hazard isolation.",
      },
      {
        moduleNumber: 2,
        title: "Traction Battery Pack Basics & Assembly",
        theoryHours: 60,
        practicalHours: 140,
        description: "Introduction to lithium-ion cell chemistries, pack construction, and mechanical mounting.",
      },
      {
        moduleNumber: 3,
        title: "Electric Motor Drives & Inverters",
        theoryHours: 50,
        practicalHours: 150,
        description: "BLDC and PMSM motor principles, motor controllers, and regenerative braking circuits.",
      },
      {
        moduleNumber: 4,
        title: "Conventional Chassis & Mechanical Maintenance",
        theoryHours: 80,
        practicalHours: 220,
        description: "Steering, suspension, mechanical disc brakes, and tyre servicing.",
      },
    ],
    skills: [
      {
        skillName: "EV Battery Diagnostics",
        skillSlug: "ev-battery-diagnostics",
        category: "technical",
        allocatedHours: 40, // Low coverage vs 120h industry benchmark
        targetProficiency: "introductory", // Industry expects advanced
        isCore: true,
      },
      {
        skillName: "Battery Management Systems (BMS)",
        skillSlug: "bms-configuration",
        category: "technical",
        allocatedHours: 20, // Very low coverage vs 80h benchmark
        targetProficiency: "introductory",
        isCore: false,
      },
      {
        skillName: "Automotive CAN Bus Protocol",
        skillSlug: "can-bus-protocol",
        category: "technical",
        allocatedHours: 0, // 0 hours in syllabus! Complete blindspot!
        targetProficiency: "introductory",
        isCore: false,
      },
      {
        skillName: "Industrial Safety & Lockout/Tagout",
        skillSlug: "loto-safety",
        category: "compliance_standard",
        allocatedHours: 60, // Well covered
        targetProficiency: "intermediate",
        isCore: true,
      },
      {
        skillName: "Automotive Electrical Wiring",
        skillSlug: "automotive-wiring",
        category: "technical",
        allocatedHours: 120, // Well covered
        targetProficiency: "intermediate",
        isCore: true,
      },
    ],
    employerFeedback: {
      employerName: "Tata Motors Passenger Electric Vehicles",
      relevanceScore: 3.2,
      curriculumModernityScore: 2.8,
      practicalReadinessScore: 3.0,
      hiringCommitmentCount: 25,
      verbatimFeedback:
        "The course covers baseline electrical wiring well, but urgently requires 30+ dedicated practical hours on CAN Bus diagnostics and BMS telemetry fault codes. Candidates currently struggle with diagnostic scan tools on live shopfloor testing.",
    },
    placementStatistics: {
      recentBatchYear: 2025,
      graduatesCount: 56,
      placedCount: 46,
      placementRatePct: 82.1,
      averageSalaryMonthly: 27500,
      primaryPlacementPartner: "Tata Motors EV & Bharat Forge",
    },
  },

  // 2. CNC Machinist & Multi-Axis Programmer
  {
    id: "course-cnc-301",
    code: "CNC-PROG-301",
    name: "CNC Machinist & Multi-Axis Programmer",
    trainingCenter: "Government Polytechnic Coimbatore",
    district: "Coimbatore",
    tradeSector: "manufacturing_cnc",
    totalHours: 1600,
    durationMonths: 18,
    annualCapacity: 80,
    currentEnrollment: 74,
    modules: [
      {
        moduleNumber: 1,
        title: "Engineering Drawing & GD&T Inspection",
        theoryHours: 80,
        practicalHours: 120,
        description: "Orthographic projections, datum references, and CMM inspection standards.",
      },
      {
        moduleNumber: 2,
        title: "2-Axis CNC Turning & Lathe Operations",
        theoryHours: 70,
        practicalHours: 230,
        description: "Fanuc turning canned cycles, threading, grooving, and tool offset calibration.",
      },
      {
        moduleNumber: 3,
        title: "3-Axis Vertical Machining Center Operations",
        theoryHours: 80,
        practicalHours: 260,
        description: "3-axis G-code milling, face milling, pocketing, and work coordinate presets.",
      },
      {
        moduleNumber: 4,
        title: "Multi-Axis Machining Introduction",
        theoryHours: 30,
        practicalHours: 50,
        description: "Introductory overview of 4th and 5th rotary axes kinematics.",
      },
    ],
    skills: [
      {
        skillName: "5-Axis CNC Milling",
        skillSlug: "5-axis-cnc-milling",
        category: "technical",
        allocatedHours: 25, // Industry expects 100h practical simulation
        targetProficiency: "introductory", // Industry expects intermediate/advanced
        isCore: false,
      },
      {
        skillName: "G-Code & M-Code Programming",
        skillSlug: "g-code-programming",
        category: "tool",
        allocatedHours: 180, // Substantial coverage
        targetProficiency: "advanced",
        isCore: true,
      },
      {
        skillName: "Conventional Manual Lathe Turning",
        skillSlug: "conventional-lathe-turning",
        category: "technical",
        allocatedHours: 140, // Over-allocated legacy skill!
        targetProficiency: "advanced",
        isCore: true,
      },
      {
        skillName: "GD&T Dimensional Inspection",
        skillSlug: "gdt-inspection",
        category: "compliance_standard",
        allocatedHours: 60,
        targetProficiency: "intermediate",
        isCore: true,
      },
    ],
    employerFeedback: {
      employerName: "LMW Precision Machine Works",
      relevanceScore: 3.6,
      curriculumModernityScore: 3.1,
      practicalReadinessScore: 3.4,
      hiringCommitmentCount: 30,
      verbatimFeedback:
        "Students have solid G-code fundamentals, but our aerospace lines now run 5-axis DMG MORI and Mazak centers. Students need hands-on multi-axis collision avoidance simulation rather than spending 140 hours on manual engine lathes.",
    },
    placementStatistics: {
      recentBatchYear: 2025,
      graduatesCount: 70,
      placedCount: 58,
      placementRatePct: 82.9,
      averageSalaryMonthly: 29000,
      primaryPlacementPartner: "LMW Precision & Roots Auto",
    },
  },

  // 3. Solar Photovoltaic Installation & Smart Grid Tech
  {
    id: "course-sol-101",
    code: "SOL-GRID-101",
    name: "Solar Photovoltaic Installation & Smart Grid Tech",
    trainingCenter: "Gujarat Skill Training Academy (Ahmedabad)",
    district: "Ahmedabad",
    tradeSector: "renewable_energy",
    totalHours: 800,
    durationMonths: 6,
    annualCapacity: 50,
    currentEnrollment: 48,
    modules: [
      {
        moduleNumber: 1,
        title: "Solar Fundamentals & PV Array Mounting",
        theoryHours: 40,
        practicalHours: 110,
        description: "Mechanical anchoring, roof racking, and module string wiring.",
      },
      {
        moduleNumber: 2,
        title: "DC Inverters & Electrical Disconnects",
        theoryHours: 30,
        practicalHours: 70,
        description: "Inverter basics, combiner boxes, and surge protection devices.",
      },
      {
        moduleNumber: 3,
        title: "Grid Synchronization & SCADA Basics",
        theoryHours: 20,
        practicalHours: 30,
        description: "Overview of grid interconnection standards and net metering.",
      },
    ],
    skills: [
      {
        skillName: "Solar PV Array Installation",
        skillSlug: "solar-pv-installation",
        category: "technical",
        allocatedHours: 90,
        targetProficiency: "advanced",
        isCore: true,
      },
      {
        skillName: "Grid-Tie Solar Inverter Sizing",
        skillSlug: "grid-tie-inverter-sizing",
        category: "technical",
        allocatedHours: 30, // Low vs 80h industry expectation
        targetProficiency: "introductory",
        isCore: false,
      },
      {
        skillName: "Industrial Safety & Lockout/Tagout",
        skillSlug: "loto-safety",
        category: "compliance_standard",
        allocatedHours: 40,
        targetProficiency: "intermediate",
        isCore: true,
      },
    ],
    employerFeedback: {
      employerName: "Adani Solar Manufacturing Ltd",
      relevanceScore: 3.8,
      curriculumModernityScore: 3.5,
      practicalReadinessScore: 3.6,
      hiringCommitmentCount: 20,
      verbatimFeedback:
        "Array mechanical mounting is taught very well. However, utility-scale projects now require engineers who understand string inverter MPPT matching and IEEE 1547 anti-islanding compliance testing.",
    },
    placementStatistics: {
      recentBatchYear: 2025,
      graduatesCount: 48,
      placedCount: 42,
      placementRatePct: 87.5,
      averageSalaryMonthly: 26000,
      primaryPlacementPartner: "Adani Solar & Tata Power Renewables",
    },
  },
];

// In-memory Recommendation Review Store (Ensures changes never silently overwrite master courses)
const IN_MEMORY_RECOMMENDATIONS: CurriculumRecommendation[] = [];

/**
 * Standard benchmark required hours by technical complexity
 */
const TECHNICAL_BENCHMARKS: Record<string, { recommendedHours: number; requiredProficiency: "introductory" | "intermediate" | "advanced" | "expert" }> = {
  "ev-battery-diagnostics": { recommendedHours: 120, requiredProficiency: "advanced" },
  "bms-configuration": { recommendedHours: 80, requiredProficiency: "advanced" },
  "can-bus-protocol": { recommendedHours: 70, requiredProficiency: "intermediate" },
  "5-axis-cnc-milling": { recommendedHours: 100, requiredProficiency: "advanced" },
  "grid-tie-inverter-sizing": { recommendedHours: 75, requiredProficiency: "advanced" },
  "g-code-programming": { recommendedHours: 120, requiredProficiency: "advanced" },
  "solar-pv-installation": { recommendedHours: 80, requiredProficiency: "intermediate" },
  "loto-safety": { recommendedHours: 40, requiredProficiency: "intermediate" },
  "conventional-lathe-turning": { recommendedHours: 30, requiredProficiency: "introductory" }, // Legacy skill has low industry benchmark
  "automotive-wiring": { recommendedHours: 80, requiredProficiency: "intermediate" },
  "gdt-inspection": { recommendedHours: 50, requiredProficiency: "intermediate" },
};

/**
 * Industry Demand Weights (derived from verified job postings market volume)
 */
const INDUSTRY_REQUIREMENT_BENCHMARKS: Record<string, number> = {
  "ev-battery-diagnostics": 92, // Top hiring demand in EV
  "bms-configuration": 86,
  "can-bus-protocol": 84,
  "5-axis-cnc-milling": 88,
  "grid-tie-inverter-sizing": 82,
  "g-code-programming": 75,
  "solar-pv-installation": 72,
  "loto-safety": 78,
  "conventional-lathe-turning": 18, // Declining legacy trade
  "automotive-wiring": 68,
  "gdt-inspection": 70,
};

/**
 * Get all available courses
 */
export function getAllCourses(): Array<{ id: string; code: string; name: string; district: string; sector: string }> {
  return MASTER_COURSES.map((c) => ({
    id: c.id,
    code: c.code,
    name: c.name,
    district: c.district,
    sector: c.tradeSector,
  }));
}

/**
 * Executes transparent mathematical Curriculum X-Ray audit
 */
export function auditCurriculum(courseId: string): CurriculumXRayReport {
  const course = MASTER_COURSES.find((c) => c.id === courseId || c.code === courseId);
  if (!course) {
    throw new Error(`Course with ID '${courseId}' was not found.`);
  }

  // Combine course skills and relevant sector industry skills
  const auditedSkillsMap: Set<string> = new Set();
  course.skills.forEach((s) => auditedSkillsMap.add(s.skillSlug));

  // Also include sector-specific high demand skills that might be totally missing from course
  if (course.tradeSector === "automotive_ev") {
    auditedSkillsMap.add("can-bus-protocol");
    auditedSkillsMap.add("bms-configuration");
    auditedSkillsMap.add("ev-battery-diagnostics");
  } else if (course.tradeSector === "manufacturing_cnc") {
    auditedSkillsMap.add("5-axis-cnc-milling");
  } else if (course.tradeSector === "renewable_energy") {
    auditedSkillsMap.add("grid-tie-inverter-sizing");
  }

  const items: SkillGapAnalysisItem[] = [];
  const generatedRecommendations: CurriculumRecommendation[] = [];

  for (const slug of Array.from(auditedSkillsMap)) {
    const courseSkill = course.skills.find((s) => s.skillSlug === slug);
    const benchmark = TECHNICAL_BENCHMARKS[slug] || { recommendedHours: 60, requiredProficiency: "intermediate" };

    // 1. Industry Requirement Score (Is: 0 - 100%)
    const industryRequirementScore = INDUSTRY_REQUIREMENT_BENCHMARKS[slug] ?? 65;

    // 2. Curriculum Coverage Score (Cs: 0 - 100%)
    let curriculumCoverageScore = 0;
    const allocatedHours = courseSkill ? courseSkill.allocatedHours : 0;
    const targetProficiency = courseSkill ? courseSkill.targetProficiency : "none";

    if (courseSkill && allocatedHours > 0) {
      // Hours coverage ratio (capped at 70 points)
      const hoursRatio = Math.min(1.0, allocatedHours / benchmark.recommendedHours);
      const hoursScore = hoursRatio * 70;

      // Proficiency alignment ratio (30 points)
      let profScore = 15;
      if (courseSkill.targetProficiency === benchmark.requiredProficiency) {
        profScore = 30;
      } else if (courseSkill.targetProficiency === "advanced" && benchmark.requiredProficiency === "intermediate") {
        profScore = 30;
      } else if (courseSkill.targetProficiency === "introductory" && benchmark.requiredProficiency === "advanced") {
        profScore = 8;
      }

      curriculumCoverageScore = Math.min(100, Math.round(hoursScore + profScore));
    }

    // 3. Gap Score (Gs: 0 - 100%)
    const rawGap = Math.max(0, industryRequirementScore - curriculumCoverageScore);
    const gapScore = Math.min(100, Math.round(rawGap));

    // 4. Categorization & Priority
    let categoryClassification: SkillGapAnalysisItem["categoryClassification"] = "ALIGNED";
    let priority: SkillGapAnalysisItem["priority"] = "LOW";

    if (gapScore >= 50 || (industryRequirementScore >= 70 && curriculumCoverageScore <= 15)) {
      categoryClassification = "CRITICAL GAP";
      priority = "CRITICAL";
    } else if (gapScore >= 30) {
      categoryClassification = "MAJOR GAP";
      priority = "HIGH";
    } else if (gapScore >= 15) {
      categoryClassification = "MODERATE GAP";
      priority = "MEDIUM";
    } else {
      categoryClassification = "ALIGNED";
      priority = "LOW";
    }

    // 5. Build Transparent "Why is this a gap?" Explanation
    const skillName = courseSkill ? courseSkill.skillName : slug.replace(/-/g, " ").replace(/\b\w/g, (c: string) => c.toUpperCase());
    const category = courseSkill ? courseSkill.category : "technical";

    let summaryText = "";
    if (categoryClassification === "CRITICAL GAP") {
      summaryText = `Substantial mismatch: Industry requirement is ${industryRequirementScore}%, while current syllabus provides only ${curriculumCoverageScore}% coverage.`;
    } else if (categoryClassification === "MAJOR GAP") {
      summaryText = `Significant shortfall: Syllabus hours or depth lag current employer expectations by ${gapScore}%.`;
    } else if (categoryClassification === "MODERATE GAP") {
      summaryText = `Moderate alignment variance: Minor adjustment to lab hours or equipment required to meet standard.`;
    } else {
      summaryText = `Competency is well-covered with current allocation of ${allocatedHours} hours meeting industry benchmarks.`;
    }

    // Employer Survey Feedback matching
    const employerQuote = course.employerFeedback.verbatimFeedback;
    const placementContext = `${course.placementStatistics.primaryPlacementPartner} hired ${course.placementStatistics.placedCount} graduates in ${course.placementStatistics.recentBatchYear}, but requires elevated practical competency.`;

    const explanation = {
      title: `${categoryClassification}: ${skillName} (${gapScore}% Deficit)`,
      summary: summaryText,
      marketDemandFactor: `Industry requirement index stands at ${industryRequirementScore}% with high hiring volume across regional manufacturing hubs.`,
      curriculumDeficitFactor: `Syllabus allocates ${allocatedHours} hours vs. recommended benchmark of ${benchmark.recommendedHours} hours (Deficit: ${Math.max(0, benchmark.recommendedHours - allocatedHours)} hours).`,
      proficiencyMismatchFactor: `Employers mandate '${benchmark.requiredProficiency}' level troubleshooting, whereas current syllabus targets '${targetProficiency}'.`,
      employerValidationEvidence: `Employer Survey (${course.employerFeedback.employerName}): "${employerQuote}"`,
      placementRelevanceEvidence: `Placement Outcome (${course.placementStatistics.recentBatchYear}): ${placementContext}`,
    };

    items.push({
      skillName,
      skillSlug: slug,
      category,
      industryRequirementScore,
      curriculumCoverageScore,
      gapScore,
      priority,
      categoryClassification,
      industryProficiencyRequired: benchmark.requiredProficiency,
      curriculumProficiencyProvided: targetProficiency,
      allocatedHoursInSyllabus: allocatedHours,
      recommendedBenchmarkHours: benchmark.recommendedHours,
      explanation,
    });

    // 6. Generate Actionable Recommendation if Gap >= 15%
    if (categoryClassification !== "ALIGNED") {
      const recId = `rec-${course.id}-${slug}`;
      const existing = IN_MEMORY_RECOMMENDATIONS.find((r) => r.id === recId);

      let proposedTitle = `Advanced ${skillName} Hands-On Lab`;
      let theoryH = 15;
      let practicalH = 35;
      let equipment = ["Multimeter", "Safety PPE"];
      let trainerReq = "Certified Technical Instructor";

      if (slug === "can-bus-protocol") {
        proposedTitle = "Module 5: Automotive CAN Bus Diagnostics & Network Telemetry";
        theoryH = 20;
        practicalH = 40;
        equipment = ["Vector CANoe Protocol Analyzer VN1630A", "Automotive Wiring Test Bench", "Digital Storage Oscilloscope"];
        trainerReq = "Automotive Electronics Master Trainer with CANoe Certification";
      } else if (slug === "ev-battery-diagnostics") {
        proposedTitle = "Module 2B: Traction Battery Pack Diagnostics & Cell Balancing";
        theoryH = 25;
        practicalH = 55;
        equipment = ["400V 60A Automated Battery Cycler", "Cell Voltage Balancer", "High-Voltage Isolation Tester"];
        trainerReq = "EV Battery System Specialist (Level 5 Certified)";
      } else if (slug === "bms-configuration") {
        proposedTitle = "Module 3B: BMS Telemetry & Thermal Fault Code Analysis";
        theoryH = 20;
        practicalH = 40;
        equipment = ["BMS Diagnostic Interface Cable", "Thermal Imaging Camera", "CAN Bus Data Logger"];
        trainerReq = "Automotive Embedded Systems Instructor";
      } else if (slug === "5-axis-cnc-milling") {
        proposedTitle = "Module 4B: 5-Axis Multi-Axis CNC Programming & CAM Simulation";
        theoryH = 20;
        practicalH = 60;
        equipment = ["5-Axis CNC Milling Simulator", "Mastercam / Siemens NX CAM Stations", "Renishaw Touch Probe"];
        trainerReq = "Certified Multi-Axis Machinist Trainer";
      } else if (slug === "grid-tie-inverter-sizing") {
        proposedTitle = "Module 3B: Utility Grid-Tie Inverter Synchronization & Testing";
        theoryH = 20;
        practicalH = 40;
        equipment = ["Solar Inverter Grid Simulator", "IEEE 1547 Anti-Islanding Rig", "DC Power Quality Analyzer"];
        trainerReq = "Smart Grid Renewable Energy Specialist";
      }

      generatedRecommendations.push({
        id: recId,
        courseId: course.id,
        skillSlug: slug,
        skillName,
        gapCategory: categoryClassification as CurriculumRecommendation["gapCategory"],
        recommendationType: allocatedHours === 0 ? "NEW_MODULE" : "EXPAND_HOURS",
        proposedModuleTitle: proposedTitle,
        recommendedTheoryHours: theoryH,
        recommendedPracticalHours: practicalH,
        equipmentPrerequisites: equipment,
        trainerQualificationNeeded: trainerReq,
        rationale: `Bridges ${gapScore}% competency gap identified by ${course.employerFeedback.employerName} feedback and regional vacancy growth.`,
        status: existing ? existing.status : "pending_review",
        reviewedBy: existing?.reviewedBy,
        reviewedAt: existing?.reviewedAt,
        reviewerNotes: existing?.reviewerNotes,
      });
    }
  }

  // Sort skills: CRITICAL first, then MAJOR, then MODERATE, then ALIGNED
  const priorityOrder: Record<string, number> = {
    "CRITICAL GAP": 1,
    "MAJOR GAP": 2,
    "MODERATE GAP": 3,
    "ALIGNED": 4,
  };
  items.sort((a, b) => priorityOrder[a.categoryClassification] - priorityOrder[b.categoryClassification] || b.gapScore - a.gapScore);

  // Calculate summary metrics
  const criticalCount = items.filter((i) => i.categoryClassification === "CRITICAL GAP").length;
  const majorCount = items.filter((i) => i.categoryClassification === "MAJOR GAP").length;
  const moderateCount = items.filter((i) => i.categoryClassification === "MODERATE GAP").length;
  const alignedCount = items.filter((i) => i.categoryClassification === "ALIGNED").length;

  const totalCoverage = items.reduce((sum, i) => sum + i.curriculumCoverageScore, 0);
  const totalIndustry = items.reduce((sum, i) => sum + i.industryRequirementScore, 0);
  const overallAlignmentIndex = totalIndustry > 0 ? Math.round((totalCoverage / totalIndustry) * 100) : 70;

  return {
    course: {
      id: course.id,
      code: course.code,
      name: course.name,
      trainingCenter: course.trainingCenter,
      district: course.district,
      tradeSector: course.tradeSector,
      totalHours: course.totalHours,
      durationMonths: course.durationMonths,
      annualCapacity: course.annualCapacity,
      currentEnrollment: course.currentEnrollment,
      employerRelevanceRating: course.employerFeedback.relevanceScore,
      placementRatePct: course.placementStatistics.placementRatePct,
    },
    summary: {
      totalSkillsAudited: items.length,
      criticalGapsCount: criticalCount,
      majorGapsCount: majorCount,
      moderateGapsCount: moderateCount,
      alignedSkillsCount: alignedCount,
      overallCurriculumAlignmentIndex: Math.min(100, Math.max(0, overallAlignmentIndex)),
    },
    skills: items,
    recommendations: generatedRecommendations,
    metadata: {
      calculatedAt: new Date().toISOString(),
      engine: "Skill Sync AI Curriculum X-Ray (Problem Statement ID 26134)",
      policyConstraint: "Recommendations are advisory proposals requiring human review; master curriculum is preserved.",
    },
  };
}

/**
 * Human Review / Approval Action for a Curriculum Recommendation
 * Enforces the policy safeguard: recommendations require human review and NEVER automatically overwrite.
 */
export function reviewRecommendation(
  recommendationId: string,
  decision: "approved" | "rejected",
  reviewerName: string,
  reviewerNotes: string
): { success: boolean; recommendation: CurriculumRecommendation } {
  // Find or instantiate in store
  let rec = IN_MEMORY_RECOMMENDATIONS.find((r) => r.id === recommendationId);

  if (!rec) {
    // Generate fresh from audit to populate store
    for (const course of MASTER_COURSES) {
      const report = auditCurriculum(course.id);
      const matched = report.recommendations.find((r) => r.id === recommendationId);
      if (matched) {
        rec = { ...matched };
        IN_MEMORY_RECOMMENDATIONS.push(rec);
        break;
      }
    }
  }

  if (!rec) {
    throw new Error(`Recommendation with ID '${recommendationId}' not found.`);
  }

  rec.status = decision;
  rec.reviewedBy = reviewerName;
  rec.reviewedAt = new Date().toISOString();
  rec.reviewerNotes = reviewerNotes;

  return {
    success: true,
    recommendation: rec,
  };
}
