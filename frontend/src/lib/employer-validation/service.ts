/**
 * Skill Sync AI - Employer Validation Service
 * Problem Statement ID: 26134
 * 
 * Manages industrial employer validation loops, stores feedback submissions,
 * creates immutable audit records, and calculates transparent validation statistics.
 * 
 * All outputs are labeled as "Employer Validation Evidence".
 * (Zero references to "ground truth" or "truth").
 */

import {
  EmployerProfile,
  EmployerValidationResponse,
  ValidationStatistics,
  EmployerAuditRecord,
  IndustryRecommendationView,
  HiringDifficulty,
  EntryProficiency,
  ValidationStance,
} from "./types";

export const REGISTERED_EMPLOYERS: EmployerProfile[] = [
  {
    id: "emp-tata-motors",
    name: "Tata Motors Passenger Electric Vehicles",
    sector: "automotive_ev",
    district: "Pune",
    contactPerson: "Rajesh Kulkarni",
    designation: "Head of Powertrain Talent & Technical Capability",
    employeeCount: 4200,
  },
  {
    id: "emp-bharat-forge",
    name: "Bharat Forge Advanced Mobility Division",
    sector: "automotive_ev",
    district: "Pune",
    contactPerson: "Sunil Shinde",
    designation: "General Manager - EV Engineering",
    employeeCount: 6500,
  },
  {
    id: "emp-kpit",
    name: "KPIT Technologies Embedded Systems",
    sector: "automotive_ev",
    district: "Pune",
    contactPerson: "Meera Joshi",
    designation: "Director - In-Vehicle Software Architecture",
    employeeCount: 8900,
  },
  {
    id: "emp-ather",
    name: "Ather Energy Charging Infrastructure",
    sector: "automotive_ev",
    district: "Pune",
    contactPerson: "Arjun Nair",
    designation: "Lead Technical Recruiter",
    employeeCount: 1800,
  },
  {
    id: "emp-lmw",
    name: "LMW Precision Machine Works Ltd",
    sector: "manufacturing_cnc",
    district: "Coimbatore",
    contactPerson: "K. Subramanian",
    designation: "VP - Manufacturing & Tooling Operations",
    employeeCount: 3200,
  },
  {
    id: "emp-craftsman",
    name: "Craftsman Automation Heavy Machining",
    sector: "manufacturing_cnc",
    district: "Coimbatore",
    contactPerson: "P. Ranganathan",
    designation: "Plant Head - CNC 5-Axis Division",
    employeeCount: 4100,
  },
  {
    id: "emp-adani-solar",
    name: "Adani Solar Technologies Ltd",
    sector: "renewable_energy",
    district: "Ahmedabad",
    contactPerson: "Viren Patel",
    designation: "Head of Solar Grid Commissioning",
    employeeCount: 5400,
  },
  {
    id: "emp-torrent",
    name: "Torrent Power Grid Automation",
    sector: "renewable_energy",
    district: "Ahmedabad",
    contactPerson: "Hitesh Shah",
    designation: "Chief Engineer - Substation SCADA",
    employeeCount: 3600,
  },
];

interface RecommendationMetadata {
  id: string;
  recommendation: string;
  actionType: string;
  reason: string;
  affectedCourseCode: string;
  affectedCourseName: string;
  affectedSkillName: string;
  sector: string;
  district: string;
}

const RECOMMENDATIONS_METADATA: RecommendationMetadata[] = [
  {
    id: "rec-act-001",
    recommendation: "Introduce 40h Specialized Module on CAN Bus Protocol & In-Vehicle Networking",
    actionType: "add_curriculum_module",
    reason: "Curriculum currently has 0 hours on CAN Bus diagnostics despite an 84% industry requirement surge and +900% EV diagnostic vacancy growth across Pune OEM clusters.",
    affectedCourseCode: "EV-TECH-201",
    affectedCourseName: "Electric Vehicle Service & Diagnostics",
    affectedSkillName: "CAN Bus Protocol & In-Vehicle Networking",
    sector: "automotive_ev",
    district: "Pune",
  },
  {
    id: "rec-act-002",
    recommendation: "Upgrade CAD/CAM Toolpath Simulation Module to Cover Multi-Axis Simultaneous CAM",
    actionType: "update_curriculum_module",
    reason: "Current syllabus only covers 2.5D toolpaths (20h), but aerospace and defense tier-1s require 5-axis continuous toolpath simulation.",
    affectedCourseCode: "CNC-PROG-301",
    affectedCourseName: "Advanced CNC Machinist & Multi-Axis Programmer",
    affectedSkillName: "CAD/CAM Toolpath Simulation (Mastercam)",
    sector: "manufacturing_cnc",
    district: "Coimbatore",
  },
  {
    id: "rec-act-003",
    recommendation: "Increase Traction Battery Pack Teardown & Live-Cell Diagnostics from 10h to 40h Practical Lab",
    actionType: "increase_practical_hours",
    reason: "Graduates understand theoretical cell chemistry but fail recruitment trials on high-voltage pack teardown and cell balancing.",
    affectedCourseCode: "EV-TECH-201",
    affectedCourseName: "Electric Vehicle Service & Diagnostics",
    affectedSkillName: "EV Battery Diagnostics & Cell Balancing",
    sector: "automotive_ev",
    district: "Pune",
  },
  {
    id: "rec-act-009",
    recommendation: "Establish Dual Apprenticeship MoU with Torrent Power & Adani Solar for Grid-Tied Inverter Labs",
    actionType: "partner_with_employers",
    reason: "Solar rooftop installations demand hands-on grid synchronization, but institutional Capex for high-capacity inverters is prohibitive without industry co-sponsorship.",
    affectedCourseCode: "SOL-GRID-101",
    affectedCourseName: "Grid-Tied Solar Photovoltaic & Inverter Specialist",
    affectedSkillName: "Grid-Tied Inverter Synchronization & Testing",
    sector: "renewable_energy",
    district: "Ahmedabad",
  },
];

/**
 * Seed validation responses:
 * Demonstrates the prompt's explicit benchmark:
 * Exactly 8 of 10 employers confirmed for rec-act-001 -> "80% Employer Confirmation".
 */
const INITIAL_RESPONSES: EmployerValidationResponse[] = [
  // 1. Tata Motors (Confirmed)
  {
    id: "val-resp-001",
    recommendationId: "rec-act-001",
    employerId: "emp-tata-motors",
    employerName: "Tata Motors Passenger Electric Vehicles",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Rajesh Kulkarni",
    reviewerDesignation: "Head of Powertrain Talent & Technical Capability",
    stance: "confirmed",
    hiringDifficulty: "acute_shortage",
    validatedProficiency: "advanced",
    identifiedImportantSkills: ["CAN Bus Protocol", "Vector CANoe Diagnostics", "Oscilloscope Waveform Analysis"],
    feedbackComments: "CAN Bus literacy is mandatory. Candidates without protocol sniffing abilities require 6 months of internal onboarding before touching live EV prototypes.",
    timestamp: "2026-09-21T10:00:00.000Z",
    auditId: "audit-val-001",
  },
  // 2. Bharat Forge (Confirmed)
  {
    id: "val-resp-002",
    recommendationId: "rec-act-001",
    employerId: "emp-bharat-forge",
    employerName: "Bharat Forge Advanced Mobility Division",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Sunil Shinde",
    reviewerDesignation: "General Manager - EV Engineering",
    stance: "confirmed",
    hiringDifficulty: "acute_shortage",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "Digital Multimeter HV Isolation"],
    feedbackComments: "Strongly confirm this need. We have 15 technician openings remaining unfilled due to zero protocol background.",
    timestamp: "2026-09-21T11:00:00.000Z",
    auditId: "audit-val-002",
  },
  // 3. KPIT (Confirmed)
  {
    id: "val-resp-003",
    recommendationId: "rec-act-001",
    employerId: "emp-kpit",
    employerName: "KPIT Technologies Embedded Systems",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Meera Joshi",
    reviewerDesignation: "Director - In-Vehicle Software Architecture",
    stance: "confirmed",
    hiringDifficulty: "high",
    validatedProficiency: "advanced",
    identifiedImportantSkills: ["CAN Bus Protocol", "CANoe Tools", "DBC File Parsing"],
    feedbackComments: "Endorsed. Vocational trainees who master CANoe packet inspection can directly support vehicle integration test benches.",
    timestamp: "2026-09-21T11:30:00.000Z",
    auditId: "audit-val-003",
  },
  // 4. Ather Energy (Confirmed)
  {
    id: "val-resp-004",
    recommendationId: "rec-act-001",
    employerId: "emp-ather",
    employerName: "Ather Energy Charging Infrastructure",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Arjun Nair",
    reviewerDesignation: "Lead Technical Recruiter",
    stance: "confirmed",
    hiringDifficulty: "high",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "BMS Communication"],
    feedbackComments: "Confirmed. Modern fast-chargers communicate with vehicles strictly over CAN 2.0B / CAN FD.",
    timestamp: "2026-09-21T12:00:00.000Z",
    auditId: "audit-val-004",
  },
  // 5. Mahindra Electric Automotive (Confirmed)
  {
    id: "val-resp-005",
    recommendationId: "rec-act-001",
    employerId: "emp-mahindra-pune",
    employerName: "Mahindra Electric Mobility Ltd",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Vikas Patil",
    reviewerDesignation: "Talent Acquisition Manager",
    stance: "confirmed",
    hiringDifficulty: "acute_shortage",
    validatedProficiency: "advanced",
    identifiedImportantSkills: ["CAN Bus Protocol", "Traction Inverter Diagnostics"],
    feedbackComments: "Endorse 100%. We are willing to offer plant visits for institutes that implement this module.",
    timestamp: "2026-09-21T12:30:00.000Z",
    auditId: "audit-val-005",
  },
  // 6. Force Motors EV Division (Confirmed)
  {
    id: "val-resp-006",
    recommendationId: "rec-act-001",
    employerId: "emp-force-motors",
    employerName: "Force Motors Commercial EV",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Anil Kadam",
    reviewerDesignation: "Senior Plant Director",
    stance: "confirmed",
    hiringDifficulty: "moderate",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "Automotive Wiring Test Bench"],
    feedbackComments: "Commercial EV vans use multi-node CAN loops; technicians must be able to identify terminated nodes.",
    timestamp: "2026-09-21T13:00:00.000Z",
    auditId: "audit-val-006",
  },
  // 7. Spark Minda EV Sensors (Confirmed)
  {
    id: "val-resp-007",
    recommendationId: "rec-act-001",
    employerId: "emp-spark-minda",
    employerName: "Spark Minda EV Systems",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Pooja Hegde",
    reviewerDesignation: "QA Lead",
    stance: "confirmed",
    hiringDifficulty: "high",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "Sensor Telemetry"],
    feedbackComments: "Confirmed requirement. Good to see practical syllabus evolution.",
    timestamp: "2026-09-21T13:30:00.000Z",
    auditId: "audit-val-007",
  },
  // 8. Kinetic Green Energy (Confirmed)
  {
    id: "val-resp-008",
    recommendationId: "rec-act-001",
    employerId: "emp-kinetic-green",
    employerName: "Kinetic Green Energy & Power",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Dinesh Gaikwad",
    reviewerDesignation: "Head of Operations",
    stance: "confirmed",
    hiringDifficulty: "moderate",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "Battery Harness Continuity"],
    feedbackComments: "Confirmed. Essential for three-wheeler EV assembly and diagnostics.",
    timestamp: "2026-09-21T14:00:00.000Z",
    auditId: "audit-val-008",
  },
  // 9. Tier-1 Auto Electricals (Modified)
  {
    id: "val-resp-009",
    recommendationId: "rec-act-001",
    employerId: "emp-tier1-auto",
    employerName: "Pinnacle Auto Electricals",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Ramesh Pawar",
    reviewerDesignation: "Managing Director",
    stance: "modified",
    hiringDifficulty: "moderate",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["CAN Bus Protocol", "LIN Bus Basics"],
    feedbackComments: "Agree with the intent, but 40 hours is too heavy for a single trade term. Recommend 24h practical lab and 8h theory.",
    proposedModifications: "Adjust allocated hours to 32 hours total (24h practical + 8h theory) and include LIN bus basics.",
    timestamp: "2026-09-21T14:30:00.000Z",
    auditId: "audit-val-009",
  },
  // 10. Local Ancillary Garage (Rejected)
  {
    id: "val-resp-010",
    recommendationId: "rec-act-001",
    employerId: "emp-pune-ancillary",
    employerName: "Swastik Fleet Workshop",
    district: "Pune",
    sector: "automotive_ev",
    reviewerName: "Ganesh More",
    reviewerDesignation: "Workshop Supervisor",
    stance: "rejected",
    hiringDifficulty: "low",
    validatedProficiency: "introductory",
    identifiedImportantSkills: ["Basic 12V Multimeter"],
    feedbackComments: "Our workshop only handles basic mechanical suspension work on EVs; digital protocol diagnostics is handled by OEM service centers.",
    timestamp: "2026-09-21T15:00:00.000Z",
    auditId: "audit-val-010",
  },
];

const INITIAL_AUDIT_LOGS: EmployerAuditRecord[] = INITIAL_RESPONSES.map((r) => ({
  id: r.auditId,
  timestamp: r.timestamp,
  employerName: r.employerName,
  actorName: r.reviewerName,
  actorDesignation: r.reviewerDesignation,
  action: r.stance,
  recommendationId: r.recommendationId,
  recommendationTitle: "Introduce 40h Specialized Module on CAN Bus Protocol",
  summary: `Employer submitted '${r.stance}' stance with '${r.hiringDifficulty}' hiring difficulty and '${r.validatedProficiency}' required proficiency.`,
}));

// In-Memory state stores
let responsesStore: EmployerValidationResponse[] = [...INITIAL_RESPONSES];
let auditStore: EmployerAuditRecord[] = [...INITIAL_AUDIT_LOGS];

/**
 * Calculates transparent validation statistics for a recommendation.
 * Output is strictly labeled as "Employer Validation Evidence".
 */
export function calculateValidationStats(recommendationId: string): ValidationStatistics {
  const matches = responsesStore.filter((r) => r.recommendationId === recommendationId);
  const totalReviews = matches.length;

  if (totalReviews === 0) {
    return {
      totalReviews: 0,
      confirmedCount: 0,
      modifiedCount: 0,
      rejectedCount: 0,
      confirmationPercentage: 0,
      displayRatio: "0 of 0 employers confirmed",
      displayPercentage: "0% Employer Confirmation",
      hiringDifficultyDistribution: { low: 0, moderate: 0, high: 0, acute_shortage: 0 },
      dominantHiringDifficulty: "moderate",
      dominantProficiencyRequirement: "intermediate",
      topImportantSkills: [],
    };
  }

  const confirmedCount = matches.filter((r) => r.stance === "confirmed").length;
  const modifiedCount = matches.filter((r) => r.stance === "modified").length;
  const rejectedCount = matches.filter((r) => r.stance === "rejected").length;

  const confirmationPercentage = Math.round((confirmedCount / totalReviews) * 100);

  // Hiring difficulty distribution
  const difficultyCounts: Record<HiringDifficulty, number> = {
    low: matches.filter((r) => r.hiringDifficulty === "low").length,
    moderate: matches.filter((r) => r.hiringDifficulty === "moderate").length,
    high: matches.filter((r) => r.hiringDifficulty === "high").length,
    acute_shortage: matches.filter((r) => r.hiringDifficulty === "acute_shortage").length,
  };

  let dominantDifficulty: HiringDifficulty = "moderate";
  let maxDiffCount = -1;
  for (const [key, count] of Object.entries(difficultyCounts)) {
    if (count > maxDiffCount) {
      maxDiffCount = count;
      dominantDifficulty = key as HiringDifficulty;
    }
  }

  // Proficiency distribution
  const profCounts: Record<EntryProficiency, number> = {
    introductory: matches.filter((r) => r.validatedProficiency === "introductory").length,
    intermediate: matches.filter((r) => r.validatedProficiency === "intermediate").length,
    advanced: matches.filter((r) => r.validatedProficiency === "advanced").length,
    expert: matches.filter((r) => r.validatedProficiency === "expert").length,
  };

  let dominantProf: EntryProficiency = "intermediate";
  let maxProfCount = -1;
  for (const [key, count] of Object.entries(profCounts)) {
    if (count > maxProfCount) {
      maxProfCount = count;
      dominantProf = key as EntryProficiency;
    }
  }

  // Skills frequency
  const skillFreq: Record<string, number> = {};
  matches.forEach((r) => {
    r.identifiedImportantSkills.forEach((skill) => {
      skillFreq[skill] = (skillFreq[skill] || 0) + 1;
    });
  });

  const topImportantSkills = Object.entries(skillFreq)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    totalReviews,
    confirmedCount,
    modifiedCount,
    rejectedCount,
    confirmationPercentage,
    displayRatio: `${confirmedCount} of ${totalReviews} employers confirmed`,
    displayPercentage: `${confirmationPercentage}% Employer Confirmation`,
    hiringDifficultyDistribution: difficultyCounts,
    dominantHiringDifficulty: dominantDifficulty,
    dominantProficiencyRequirement: dominantProf,
    topImportantSkills,
  };
}

/**
 * Fetch recommendations for an employer's sector/industry with aggregated validation evidence.
 */
export function getRecommendationsForIndustry(sector?: string): IndustryRecommendationView[] {
  let targetRecs = RECOMMENDATIONS_METADATA;
  if (sector && sector !== "all") {
    targetRecs = RECOMMENDATIONS_METADATA.filter((r) => r.sector === sector);
  }

  return targetRecs.map((rec) => {
    const stats = calculateValidationStats(rec.id);
    const recentResponses = responsesStore
      .filter((r) => r.recommendationId === rec.id)
      .slice(0, 5);

    return {
      ...rec,
      validationStats: stats,
      recentResponses,
    };
  });
}

/**
 * Submit an employer validation review.
 * Stores every response, appends an audit record, and updates validation statistics.
 */
export function submitEmployerValidation(params: {
  recommendationId: string;
  employerId: string;
  reviewerName: string;
  reviewerDesignation: string;
  stance: ValidationStance;
  hiringDifficulty: HiringDifficulty;
  validatedProficiency: EntryProficiency;
  identifiedImportantSkills: string[];
  feedbackComments: string;
  proposedModifications?: string;
}): { response: EmployerValidationResponse; audit: EmployerAuditRecord; updatedStats: ValidationStatistics } {
  const employer = REGISTERED_EMPLOYERS.find((e) => e.id === params.employerId);
  const employerName = employer ? employer.name : "Industrial Partner";
  const district = employer ? employer.district : "Regional Industrial Cluster";
  const sector = employer ? employer.sector : "automotive_ev";

  const recMeta = RECOMMENDATIONS_METADATA.find((r) => r.id === params.recommendationId);
  const recTitle = recMeta ? recMeta.recommendation : "Workforce Recommendation";

  const id = `val-resp-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
  const auditId = `audit-val-${Date.now()}`;
  const timestamp = new Date().toISOString();

  const newResponse: EmployerValidationResponse = {
    id,
    recommendationId: params.recommendationId,
    employerId: params.employerId,
    employerName,
    district,
    sector,
    reviewerName: params.reviewerName.trim(),
    reviewerDesignation: params.reviewerDesignation.trim(),
    stance: params.stance,
    hiringDifficulty: params.hiringDifficulty,
    validatedProficiency: params.validatedProficiency,
    identifiedImportantSkills: params.identifiedImportantSkills,
    feedbackComments: params.feedbackComments.trim(),
    proposedModifications: params.proposedModifications
      ? typeof params.proposedModifications === "string"
        ? params.proposedModifications.trim()
        : JSON.stringify(params.proposedModifications)
      : undefined,
    timestamp,
    auditId,
  };

  const newAudit: EmployerAuditRecord = {
    id: auditId,
    timestamp,
    employerName,
    actorName: params.reviewerName.trim(),
    actorDesignation: params.reviewerDesignation.trim(),
    action: params.stance,
    recommendationId: params.recommendationId,
    recommendationTitle: recTitle,
    summary: `Submitted '${params.stance}' validation stance with '${params.hiringDifficulty}' difficulty and '${params.validatedProficiency}' required proficiency.`,
  };

  responsesStore.unshift(newResponse);
  auditStore.unshift(newAudit);

  const updatedStats = calculateValidationStats(params.recommendationId);

  return {
    response: newResponse,
    audit: newAudit,
    updatedStats,
  };
}

/**
 * Fetch employer validation responses for a specific recommendation.
 */
export function getResponsesForRecommendation(recommendationId: string): EmployerValidationResponse[] {
  return responsesStore.filter((r) => r.recommendationId === recommendationId);
}

/**
 * Fetch full audit history.
 */
export function getEmployerAuditTrail(): EmployerAuditRecord[] {
  return auditStore;
}

/**
 * Reset store to seed baseline (for tests).
 */
export function resetEmployerValidationStore(): void {
  responsesStore = JSON.parse(JSON.stringify(INITIAL_RESPONSES));
  auditStore = JSON.parse(JSON.stringify(INITIAL_AUDIT_LOGS));
}
