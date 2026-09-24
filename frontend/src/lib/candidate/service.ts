/**
 * Skill Sync AI - Candidate Career Path Service
 * Problem Statement ID: 26134
 * 
 * Compares candidate competencies against industry role requirements,
 * computes missing skill priorities, and constructs a sequenced visual career pathway.
 * 
 * Strict Constraint:
 * Do NOT guarantee employment or salary.
 */

import {
  TargetRole,
  CandidateProfile,
  CandidateCareerPathAssessment,
  RoleSkillRequirement,
  CareerPathPhase,
  RelevantCourse,
  PracticalProject,
} from "./types";

export const TARGET_ROLES: TargetRole[] = [
  {
    id: "role-ev-tech",
    title: "Electric Vehicle Service & Diagnostics Specialist",
    sector: "automotive_ev",
    district: "Pune",
    openVacancies: 184,
    description: "Inspects, troubleshoots, and services high-voltage battery packs, powertrain inverters, and in-vehicle digital CAN bus networks.",
    benchmarkSalaryBand: "₹3.8L - ₹5.4L PA (Historical Market Observation)",
    requiredSkills: [
      {
        skillName: "Lockout/Tagout (LOTO) High-Voltage Safety",
        category: "compliance_standard",
        priority: "critical",
        employerDemandPct: 98,
        requiredProficiency: "advanced",
        isPrerequisite: true,
      },
      {
        skillName: "Digital Multimeter Diagnostics & Insulation Testing",
        category: "tool",
        priority: "critical",
        employerDemandPct: 92,
        requiredProficiency: "intermediate",
        isPrerequisite: true,
      },
      {
        skillName: "EV Battery Diagnostics & Cell Balancing",
        category: "technical",
        priority: "high",
        employerDemandPct: 96,
        requiredProficiency: "advanced",
      },
      {
        skillName: "CAN Bus Protocol & In-Vehicle Networking",
        category: "technical",
        priority: "high",
        employerDemandPct: 94,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "BMS Configuration & Thermal Isolation",
        category: "domain_knowledge",
        priority: "high",
        employerDemandPct: 88,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Vector CANoe Diagnostics & DBC Logging",
        category: "tool",
        priority: "medium",
        employerDemandPct: 78,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Electric Powertrain Inverter Systems",
        category: "technical",
        priority: "medium",
        employerDemandPct: 74,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Basic Automotive Mechanics & Chassis Systems",
        category: "technical",
        priority: "critical",
        employerDemandPct: 90,
        requiredProficiency: "intermediate",
        isPrerequisite: true,
      },
    ],
  },
  {
    id: "role-cnc-prog",
    title: "5-Axis CNC Precision Programmer & Operator",
    sector: "manufacturing_cnc",
    district: "Coimbatore",
    openVacancies: 142,
    description: "Programs multi-axis CNC milling centers, simulates 5-axis simultaneous toolpaths in Mastercam, and conducts precision quality audits.",
    benchmarkSalaryBand: "₹3.6L - ₹5.2L PA (Historical Market Observation)",
    requiredSkills: [
      {
        skillName: "G-Code & M-Code Programming",
        category: "technical",
        priority: "critical",
        employerDemandPct: 96,
        requiredProficiency: "advanced",
        isPrerequisite: true,
      },
      {
        skillName: "Blueprint Reading & Engineering Drawings",
        category: "domain_knowledge",
        priority: "critical",
        employerDemandPct: 94,
        requiredProficiency: "intermediate",
        isPrerequisite: true,
      },
      {
        skillName: "5-Axis CNC Milling & Post-Processing",
        category: "technical",
        priority: "high",
        employerDemandPct: 92,
        requiredProficiency: "advanced",
      },
      {
        skillName: "CAD/CAM Toolpath Simulation (Mastercam)",
        category: "tool",
        priority: "high",
        employerDemandPct: 88,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Geometric Dimensioning & Tolerancing (GD&T)",
        category: "domain_knowledge",
        priority: "high",
        employerDemandPct: 86,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Coordinate Measuring Machine (CMM) Inspection",
        category: "tool",
        priority: "medium",
        employerDemandPct: 72,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Conventional Lathe & Turning Operations",
        category: "technical",
        priority: "medium",
        employerDemandPct: 65,
        requiredProficiency: "intermediate",
      },
    ],
  },
  {
    id: "role-solar-spec",
    title: "Grid-Tied Solar Photovoltaic & Inverter Specialist",
    sector: "renewable_energy",
    district: "Ahmedabad",
    openVacancies: 118,
    description: "Designs rooftop solar PV arrays, configures grid-tied string and micro-inverters, and tests telemetry synchronization.",
    benchmarkSalaryBand: "₹3.2L - ₹4.8L PA (Historical Market Observation)",
    requiredSkills: [
      {
        skillName: "Single-Phase & Three-Phase Electrical Wiring",
        category: "technical",
        priority: "critical",
        employerDemandPct: 95,
        requiredProficiency: "intermediate",
        isPrerequisite: true,
      },
      {
        skillName: "Grid-Tied Inverter Synchronization & Testing",
        category: "technical",
        priority: "high",
        employerDemandPct: 92,
        requiredProficiency: "advanced",
      },
      {
        skillName: "Solar PV Rooftop Array Sizing & Tilt Angles",
        category: "domain_knowledge",
        priority: "high",
        employerDemandPct: 88,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "SCADA & Solar Telemetry Monitoring",
        category: "tool",
        priority: "medium",
        employerDemandPct: 80,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Anti-Islanding Protection & Safety Clearance",
        category: "compliance_standard",
        priority: "high",
        employerDemandPct: 86,
        requiredProficiency: "intermediate",
      },
      {
        skillName: "Net Metering & DISCOM Interconnection Standards",
        category: "compliance_standard",
        priority: "medium",
        employerDemandPct: 75,
        requiredProficiency: "introductory",
      },
    ],
  },
];

export const PRESET_CANDIDATES: CandidateProfile[] = [
  {
    id: "cand-rohan",
    name: "Rohan Shinde",
    currentTrade: "ITI Motor Vehicle Mechanic (Conventional)",
    currentSkills: [
      "Basic Automotive Mechanics & Chassis Systems",
      "Digital Multimeter Diagnostics & Insulation Testing",
    ],
    experienceYears: 1,
  },
  {
    id: "cand-karthik",
    name: "Karthik Raja",
    currentTrade: "Conventional Machinist / Turner",
    currentSkills: [
      "Conventional Lathe & Turning Operations",
      "G-Code & M-Code Programming",
      "Blueprint Reading & Engineering Drawings",
    ],
    experienceYears: 2,
  },
  {
    id: "cand-pooja",
    name: "Pooja Parmar",
    currentTrade: "Diploma Electrical Technician",
    currentSkills: [
      "Single-Phase & Three-Phase Electrical Wiring",
    ],
    experienceYears: 0.5,
  },
];

const RELEVANT_COURSES_CATALOG: Record<string, RelevantCourse[]> = {
  "role-ev-tech": [
    {
      code: "EV-TECH-201",
      name: "Electric Vehicle Service & Diagnostics",
      hours: 240,
      provider: "Government ITI Aundh (Pune Centre of Excellence)",
      practicalHoursRatio: "70% Practical Lab / 30% Theory",
    },
    {
      code: "AUTO-MECH-102",
      name: "Modular Bridge: High-Voltage Electrical Systems",
      hours: 80,
      provider: "Tata Motors Skill Development Centre",
      practicalHoursRatio: "85% Practical Lab / 15% Theory",
    },
  ],
  "role-cnc-prog": [
    {
      code: "CNC-PROG-301",
      name: "Advanced CNC Machinist & Multi-Axis Programmer",
      hours: 260,
      provider: "Coimbatore Precision Tooling Institute",
      practicalHoursRatio: "75% Practical Machine Time",
    },
  ],
  "role-solar-spec": [
    {
      code: "SOL-GRID-101",
      name: "Grid-Tied Solar Photovoltaic & Inverter Specialist",
      hours: 180,
      provider: "Gujarat Energy Research Institute (Ahmedabad)",
      practicalHoursRatio: "65% Rooftop Array Lab",
    },
  ],
};

const PRACTICAL_PROJECTS_CATALOG: Record<string, PracticalProject[]> = {
  "role-ev-tech": [
    {
      id: "proj-ev-01",
      title: "High-Voltage LOTO Safety & Battery Isolation",
      description: "Execute simulated lockout-tagout on a 400V EV traction system using CAT-III 1000V insulated multimeters and verified zero-energy state checks.",
      toolsUsed: ["Fluke 1587 FC Insulation Multimeter", "CAT-III 1000V PPE", "HV Safety Plug"],
      estimatedHours: 16,
      industryContext: "Tata Motors & Mahindra Electric mandatory workshop entry compliance.",
    },
    {
      id: "proj-ev-02",
      title: "Live Cell Balancing & Pack Diagnostics",
      description: "Teardown a 48V/72V modular lithium-ion battery pack, measure internal resistance across 16S cells, and configure active cell balancing thresholds.",
      toolsUsed: ["Modular Battery Test Rig", "Active Balancer Module", "Thermal Imager"],
      estimatedHours: 24,
      industryContext: "Ather Energy battery assembly qualification benchmark.",
    },
    {
      id: "proj-ev-03",
      title: "CAN Bus Packet Sniffing & OBD-II Fault Tracing",
      description: "Tap into an automotive CAN bus network at 500 kbps, trace broadcast packet IDs using Vector CANoe, and isolate simulated sensor faults.",
      toolsUsed: ["Vector CANoe VN1630A", "Digital Storage Oscilloscope", "Automotive Wiring Test Bench"],
      estimatedHours: 32,
      industryContext: "Tata Passenger EV and KPIT Technologies vehicle integration benchmark.",
    },
  ],
  "role-cnc-prog": [
    {
      id: "proj-cnc-01",
      title: "Mastercam Multi-Axis Toolpath Simulation",
      description: "Generate 5-axis continuous toolpath for an impeller blade, verify collision clearance against rotary table trunnion, and export NC post-processor files.",
      toolsUsed: ["Mastercam 2026", "DMG MORI Virtual Machine Simulator"],
      estimatedHours: 30,
      industryContext: "LMW Precision aerospace supplier standard.",
    },
    {
      id: "proj-cnc-02",
      title: "CMM Geometric Tolerancing (GD&T) Inspection",
      description: "Inspect milled titanium component on a CNC coordinate measuring machine, validating true position and surface profile within ±10 microns.",
      toolsUsed: ["Zeiss CNC CMM", "Calypso Metrology Software"],
      estimatedHours: 20,
      industryContext: "Craftsman Automation precision QA requirement.",
    },
  ],
  "role-solar-spec": [
    {
      id: "proj-sol-01",
      title: "Grid Inverter Synchronization & Anti-Islanding Trip",
      description: "Wire a 5kW string inverter to a 415V three-phase grid simulator, measure THD harmonic distortion, and record trip time upon grid disconnect.",
      toolsUsed: ["Grid Simulator Bench", "Power Quality Analyzer", "Solar String Inverter"],
      estimatedHours: 24,
      industryContext: "Adani Solar and Torrent Power DISCOM interconnection compliance.",
    },
  ],
};

/**
 * Evaluates candidate competencies against target role requirements.
 * Constructs an evidence-based roadmap with zero employment guarantees.
 */
export function evaluateCareerPath(
  candidate: CandidateProfile,
  targetRoleId: string
): CandidateCareerPathAssessment {
  const role = TARGET_ROLES.find((r) => r.id === targetRoleId) || TARGET_ROLES[0];

  const currentSkills = candidate.currentSkills;

  // Split role skills into acquired vs missing
  const acquired: RoleSkillRequirement[] = [];
  const missing: RoleSkillRequirement[] = [];

  role.requiredSkills.forEach((req) => {
    const hasSkill = currentSkills.some(
      (c) => c.toLowerCase().trim() === req.skillName.toLowerCase().trim()
    );
    if (hasSkill) {
      acquired.push(req);
    } else {
      missing.push(req);
    }
  });

  // Calculate Match Score percentage
  const matchScorePct = Math.round((acquired.length / role.requiredSkills.length) * 100);

  // Sort missing skills by priority: critical -> high -> medium
  const priorityOrder: Record<string, number> = { critical: 1, high: 2, medium: 3 };
  missing.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);

  // Construct phased roadmap
  const relevantCourses = RELEVANT_COURSES_CATALOG[role.id] || [];
  const relevantProjects = PRACTICAL_PROJECTS_CATALOG[role.id] || [];

  const phases: CareerPathPhase[] = [
    {
      phaseNumber: 1,
      phaseTitle: "Foundational & High-Voltage Safety Clearance",
      durationWeeks: 2,
      learningObjectives: [
        "Master Lockout/Tagout (LOTO) protocols and insulation testing standards.",
        "Attain certified zero-energy verification credentials.",
      ],
      skillsCovered: missing.filter((s) => s.priority === "critical").map((s) => s.skillName),
      recommendedCourse: relevantCourses[0],
      practicalProject: relevantProjects[0],
      status: acquired.some((s) => s.isPrerequisite) ? "in_progress" : "upcoming",
    },
    {
      phaseNumber: 2,
      phaseTitle: "Core Subsystems & Hands-On Diagnostics",
      durationWeeks: 4,
      learningObjectives: [
        "Conduct live apparatus disassembly, teardown, and modular testing.",
        "Perform precision calibration and parameter tuning.",
      ],
      skillsCovered: missing.filter((s) => s.priority === "high" && s.category === "technical").map((s) => s.skillName),
      recommendedCourse: relevantCourses[0],
      practicalProject: relevantProjects[1] || relevantProjects[0],
      status: "upcoming",
    },
    {
      phaseNumber: 3,
      phaseTitle: "Digital Protocols, Networking & Telemetry",
      durationWeeks: 4,
      learningObjectives: [
        "Capture and decode real-time bus telemetry packets.",
        "Diagnose sensor anomalies using advanced software analyzers.",
      ],
      skillsCovered: missing.filter((s) => s.category === "tool" || s.category === "domain_knowledge").map((s) => s.skillName),
      recommendedCourse: relevantCourses[1] || relevantCourses[0],
      practicalProject: relevantProjects[2] || relevantProjects[0],
      status: "upcoming",
    },
    {
      phaseNumber: 4,
      phaseTitle: "Industry Capstone & Employer Apprenticeship",
      durationWeeks: 4,
      learningObjectives: [
        "Complete integrated end-to-end industrial troubleshooting scenario.",
        "Submit portfolio of verified practical lab project work to employer partners.",
      ],
      skillsCovered: [`${role.title} Capstone Integration`],
      status: "upcoming",
    },
  ];

  return {
    candidate,
    targetRole: role,
    matchScorePct,
    currentSkills,
    missingSkills: missing,
    employerRequiredSkills: role.requiredSkills,
    phasedRoadmap: phases,
    relevantCourses,
    recommendedProjects: relevantProjects,
    disclaimer:
      "NOTICE: Career pathways and skill recommendations are educational guideposts derived from platform job vacancy telemetry and employer validation evidence. Skill Sync AI does NOT guarantee employment, job placement, interview calls, or specific salary levels. Hiring decisions remain at the sole discretion of employers.",
  };
}
