/**
 * Skill Demand Radar Service
 * Deterministic Labour Market Analytics Engine for Next.js
 * 
 * Provides:
 * 1. Filtered skill demand aggregations (district, industry, time range, search)
 * 2. Deterministic mathematical calculations (frequencies, vacancies, demand %, growth/decline rates)
 * 3. Trajectory classification (emerging, growing, stable, declining) with multi-employer guardrails
 * 4. Multi-month time-series trend points for charts
 * 5. Comprehensive Skill Profile inspection (roles, industries, districts, proficiency, related skills, supporting job postings with evidence)
 */

export interface SkillRequirement {
  name: string;
  slug: string;
  category: "technical" | "tool" | "soft_skill" | "domain_knowledge" | "compliance_standard";
  proficiency: "introductory" | "intermediate" | "advanced" | "expert";
  evidenceQuote: string;
  confidenceScore: number;
}

export interface StoredJobPosting {
  id: string;
  title: string;
  company: string;
  district: string;
  industry: string;
  role: string;
  vacancies: number;
  salaryMin: number;
  salaryMax: number;
  postedAt: string; // YYYY-MM-DD
  rawDescription: string;
  skills: SkillRequirement[];
}

export interface SkillRadarItem {
  slug: string;
  name: string;
  category: string;
  postingCount: number;
  vacancyCount: number;
  demandPercentage: number; // fraction of total vacancies in period
  currentDemand: number;
  previousDemand: number;
  growthRate: number; // percentage
  declineRate: number; // percentage (0 if positive)
  trajectory: "emerging" | "growing" | "stable" | "declining" | "insufficient_data";
  isEmergingCandidate: boolean;
  uniqueEmployers: number;
  topDistrict: string;
  topIndustry: string;
  qualificationNotes: string[];
}

export interface TimeSeriesPoint {
  period: string; // YYYY-MM
  label: string; // e.g. "Nov 2025"
  vacancies: number;
  postings: number;
  growthRatePct?: number;
}

export interface SupportingJobPosting {
  id: string;
  title: string;
  company: string;
  district: string;
  industry: string;
  vacancies: number;
  salaryRange: string;
  postedAt: string;
  evidenceQuote: string;
  confidenceScore: number;
}

export interface SkillProfileDetail {
  slug: string;
  name: string;
  category: string;
  trajectory: "emerging" | "growing" | "stable" | "declining" | "insufficient_data";
  growthRate: number;
  totalVacancies: number;
  totalPostings: number;
  demandPercentage: number;
  uniqueEmployers: number;
  averageConfidence: number;
  
  trendHistory: TimeSeriesPoint[];
  
  districtBreakdown: Array<{
    district: string;
    vacancies: number;
    postings: number;
    percentage: number;
  }>;
  
  industryBreakdown: Array<{
    industry: string;
    vacancies: number;
    postings: number;
    percentage: number;
  }>;
  
  roleBreakdown: Array<{
    role: string;
    vacancies: number;
    postings: number;
    percentage: number;
  }>;
  
  proficiencyBreakdown: {
    introductory: number;
    intermediate: number;
    advanced: number;
    expert: number;
    dominant: string;
  };
  
  relatedSkills: Array<{
    name: string;
    slug: string;
    coOccurrenceCount: number;
  }>;
  
  supportingJobPostings: SupportingJobPosting[];
}

export interface RadarFilterOptions {
  district?: string;
  industry?: string;
  timeRange?: "30d" | "90d" | "180d" | "1y" | "all";
  trajectory?: "all" | "emerging" | "growing" | "stable" | "declining";
  search?: string;
  page?: number;
  pageSize?: number;
}

export interface RadarResponse {
  metadata: {
    source: string;
    calculatedAt: string;
    population: {
      totalPostings: number;
      totalVacancies: number;
      uniqueEmployers: number;
      uniqueSkills: number;
    };
    activeFilters: {
      district: string;
      industry: string;
      timeRange: string;
      trajectory: string;
      search: string;
    };
  };
  kpis: {
    totalVacancies: number;
    totalPostings: number;
    emergingCount: number;
    growingCount: number;
    stableCount: number;
    decliningCount: number;
  };
  skills: SkillRadarItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalItems: number;
    totalPages: number;
  };
  filterLookups: {
    districts: string[];
    industries: string[];
  };
}

// Master Industrial Labor Market Dataset (Multi-Month Ground Truth)
const MASTER_JOB_POSTINGS: StoredJobPosting[] = [
  // 1. Tata Motors EV - EV Battery Diagnostics & BMS (Pune)
  {
    id: "jp-001",
    title: "Senior EV Battery Diagnostic Lead",
    company: "Tata Motors Passenger Electric Vehicles",
    district: "Pune",
    industry: "automotive_ev",
    role: "EV Battery Diagnostic Technician",
    vacancies: 25,
    salaryMin: 350000,
    salaryMax: 500000,
    postedAt: "2026-08-15",
    rawDescription: "Lead diagnostics on Lithium-ion traction battery packs, cell balancing, and BMS telemetry analysis. High-voltage isolation safety compliance required.",
    skills: [
      {
        name: "EV Battery Diagnostics",
        slug: "ev-battery-diagnostics",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Lead diagnostics on Lithium-ion traction battery packs, cell balancing",
        confidenceScore: 0.98,
      },
      {
        name: "Battery Management Systems (BMS)",
        slug: "bms-configuration",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "BMS telemetry analysis and state-of-health parameter tuning",
        confidenceScore: 0.96,
      },
      {
        name: "Automotive CAN Bus Protocol",
        slug: "can-bus-protocol",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "Vehicle telemetry decoding using CAN bus analyzers",
        confidenceScore: 0.94,
      },
    ],
  },
  // 2. Bharat Forge - CAN Bus & Telemetry (Pune)
  {
    id: "jp-002",
    title: "CAN Bus Harness & Telemetry Specialist",
    company: "Bharat Forge Advanced Mobility Div",
    district: "Pune",
    industry: "automotive_ev",
    role: "Automotive CAN Bus Diagnostic Specialist",
    vacancies: 18,
    salaryMin: 380000,
    salaryMax: 580000,
    postedAt: "2026-08-18",
    rawDescription: "Vehicle harness routing, Vector CANoe protocol analysis, and automotive communication bus debugging for next-gen electric chassis.",
    skills: [
      {
        name: "Automotive CAN Bus Protocol",
        slug: "can-bus-protocol",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Vector CANoe protocol analysis, and automotive communication bus debugging",
        confidenceScore: 0.97,
      },
      {
        name: "Industrial Safety & Lockout/Tagout",
        slug: "loto-safety",
        category: "compliance_standard",
        proficiency: "intermediate",
        evidenceQuote: "Adhere to strict high-voltage lockout/tagout protocols",
        confidenceScore: 0.91,
      },
    ],
  },
  // 3. Mahindra Electric - EV Battery Diagnostics & BMS (Pune)
  {
    id: "jp-003",
    title: "Traction Battery Pack Assembly Technician",
    company: "Mahindra Electric Automobile Ltd",
    district: "Pune",
    industry: "automotive_ev",
    role: "EV Battery Diagnostic Technician",
    vacancies: 20,
    salaryMin: 320000,
    salaryMax: 460000,
    postedAt: "2026-07-28",
    rawDescription: "Assembly and quality testing of high-voltage battery modules, cell voltage balancing, and thermal management sensor installation.",
    skills: [
      {
        name: "EV Battery Diagnostics",
        slug: "ev-battery-diagnostics",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "quality testing of high-voltage battery modules, cell voltage balancing",
        confidenceScore: 0.95,
      },
      {
        name: "Battery Management Systems (BMS)",
        slug: "bms-configuration",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "thermal management sensor installation and BMS harness connection",
        confidenceScore: 0.93,
      },
    ],
  },
  // 4. Ather Energy - EV Battery Diagnostics & CAN Bus (Bengaluru)
  {
    id: "jp-004",
    title: "Field Quality Diagnostic Engineer",
    company: "Ather Energy",
    district: "Bengaluru Urban",
    industry: "automotive_ev",
    role: "EV Battery Diagnostic Technician",
    vacancies: 15,
    salaryMin: 400000,
    salaryMax: 600000,
    postedAt: "2026-07-15",
    rawDescription: "Diagnose battery degradation and BMS field incidents using remote telemetry and CAN bus diagnostic logs.",
    skills: [
      {
        name: "EV Battery Diagnostics",
        slug: "ev-battery-diagnostics",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Diagnose battery degradation and BMS field incidents",
        confidenceScore: 0.96,
      },
      {
        name: "Automotive CAN Bus Protocol",
        slug: "can-bus-protocol",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "CAN bus diagnostic logs and bus trace analysis",
        confidenceScore: 0.92,
      },
    ],
  },
  // 5. LMW Precision - 5-Axis CNC Milling (Coimbatore)
  {
    id: "jp-005",
    title: "Senior 5-Axis CNC Mill Operator",
    company: "LMW Precision Machine Works",
    district: "Coimbatore",
    industry: "manufacturing_cnc",
    role: "5-Axis CNC Machine Operator",
    vacancies: 22,
    salaryMin: 400000,
    salaryMax: 620000,
    postedAt: "2026-08-10",
    rawDescription: "Programming and operating 5-axis DMG MORI machining centers. Advanced multi-axis kinematics and ISO G-code optimization for titanium components.",
    skills: [
      {
        name: "5-Axis CNC Milling",
        slug: "5-axis-cnc-milling",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "operating 5-axis DMG MORI machining centers. Advanced multi-axis kinematics",
        confidenceScore: 0.98,
      },
      {
        name: "G-Code & M-Code Programming",
        slug: "g-code-programming",
        category: "tool",
        proficiency: "advanced",
        evidenceQuote: "ISO G-code optimization for titanium components",
        confidenceScore: 0.95,
      },
    ],
  },
  // 6. Roots Precision - 5-Axis CNC Milling (Coimbatore)
  {
    id: "jp-006",
    title: "Multi-Axis CNC Machinist",
    company: "Roots Precision Machining",
    district: "Coimbatore",
    industry: "manufacturing_cnc",
    role: "5-Axis CNC Machine Operator",
    vacancies: 14,
    salaryMin: 360000,
    salaryMax: 520000,
    postedAt: "2026-07-20",
    rawDescription: "Workholding fixtures setup, precision 5-axis CNC milling, and micron-level CMM dimensional inspection.",
    skills: [
      {
        name: "5-Axis CNC Milling",
        slug: "5-axis-cnc-milling",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "precision 5-axis CNC milling, and micron-level inspection",
        confidenceScore: 0.94,
      },
      {
        name: "G-Code & M-Code Programming",
        slug: "g-code-programming",
        category: "tool",
        proficiency: "intermediate",
        evidenceQuote: "G-code editing and work coordinate offset tuning",
        confidenceScore: 0.92,
      },
    ],
  },
  // 7. Adani Solar - Solar PV Inverter & Grid Integration (Ahmedabad)
  {
    id: "jp-007",
    title: "Solar PV Grid Integration Engineer",
    company: "Adani Solar Manufacturing Ltd",
    district: "Ahmedabad",
    industry: "renewable_energy",
    role: "Solar PV Grid Integration Engineer",
    vacancies: 30,
    salaryMin: 340000,
    salaryMax: 500000,
    postedAt: "2026-08-05",
    rawDescription: "Commissioning solar PV inverters, utility grid-tie synchronization, IEEE 1547 anti-islanding testing, and array DC wiring.",
    skills: [
      {
        name: "Grid-Tie Solar Inverter Sizing",
        slug: "grid-tie-inverter-sizing",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Commissioning solar PV inverters, utility grid-tie synchronization",
        confidenceScore: 0.96,
      },
      {
        name: "Solar PV Array Installation",
        slug: "solar-pv-installation",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "array DC wiring and string combiners",
        confidenceScore: 0.93,
      },
      {
        name: "Industrial Safety & Lockout/Tagout",
        slug: "loto-safety",
        category: "compliance_standard",
        proficiency: "intermediate",
        evidenceQuote: "compliance with high-voltage DC lockout safety rules",
        confidenceScore: 0.90,
      },
    ],
  },
  // 8. Tata Power Solar - Solar PV Installation (Ahmedabad)
  {
    id: "jp-008",
    title: "Solar Installation Site Supervisor",
    company: "Tata Power Renewables",
    district: "Ahmedabad",
    industry: "renewable_energy",
    role: "Solar PV Grid Integration Engineer",
    vacancies: 18,
    salaryMin: 320000,
    salaryMax: 480000,
    postedAt: "2026-07-10",
    rawDescription: "Mechanical array mounting, string sizing, inverter wiring, and grounding system installation for MW-scale solar farms.",
    skills: [
      {
        name: "Solar PV Array Installation",
        slug: "solar-pv-installation",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Mechanical array mounting, string sizing, and inverter wiring",
        confidenceScore: 0.95,
      },
      {
        name: "Grid-Tie Solar Inverter Sizing",
        slug: "grid-tie-inverter-sizing",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "inverter wiring, and grounding system installation",
        confidenceScore: 0.91,
      },
    ],
  },
  // 9. Wipro Digital - Cloud DevOps & Kubernetes (Gurugram)
  {
    id: "jp-009",
    title: "Cloud Infrastructure & DevOps Associate",
    company: "Wipro Digital Solutions",
    district: "Gurugram",
    industry: "information_technology",
    role: "Cloud DevOps Infrastructure Associate",
    vacancies: 35,
    salaryMin: 450000,
    salaryMax: 700000,
    postedAt: "2026-08-12",
    rawDescription: "Containerizing microservices via Docker, managing Kubernetes production clusters, and automating CI/CD release pipelines.",
    skills: [
      {
        name: "Kubernetes Orchestration",
        slug: "kubernetes-orchestration",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "managing Kubernetes production clusters and Helm charts",
        confidenceScore: 0.97,
      },
      {
        name: "Docker & Containerization",
        slug: "docker-containerization",
        category: "tool",
        proficiency: "intermediate",
        evidenceQuote: "Containerizing microservices via Docker",
        confidenceScore: 0.96,
      },
    ],
  },
  // 10. Tata Consultancy Services - Docker & Kubernetes (Gurugram)
  {
    id: "jp-010",
    title: "Site Reliability Engineer",
    company: "Tata Consultancy Services",
    district: "Gurugram",
    industry: "information_technology",
    role: "Cloud DevOps Infrastructure Associate",
    vacancies: 25,
    salaryMin: 500000,
    salaryMax: 780000,
    postedAt: "2026-07-22",
    rawDescription: "High-availability cloud operations, Docker image vulnerability scanning, Kubernetes ingress configuration, and observability.",
    skills: [
      {
        name: "Docker & Containerization",
        slug: "docker-containerization",
        category: "tool",
        proficiency: "advanced",
        evidenceQuote: "Docker image vulnerability scanning and multi-stage builds",
        confidenceScore: 0.95,
      },
      {
        name: "Kubernetes Orchestration",
        slug: "kubernetes-orchestration",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "Kubernetes ingress configuration and service mesh",
        confidenceScore: 0.94,
      },
    ],
  },
  // 11. Legacy Automotive Service - Declining Carburetor Tuning (Ahmedabad)
  {
    id: "jp-011",
    title: "Two-Wheeler Carburetor Mechanic",
    company: "Old City Auto Works",
    district: "Ahmedabad",
    industry: "automotive",
    role: "Automotive Mechanic",
    vacancies: 3,
    salaryMin: 180000,
    salaryMax: 240000,
    postedAt: "2026-08-01",
    rawDescription: "Carburetor float adjustments, jet cleaning, and manual 2-stroke engine tuneups.",
    skills: [
      {
        name: "Carburetor Tuning & Jetting",
        slug: "carburetor-tuning",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "Carburetor float adjustments, jet cleaning, and manual tuneups",
        confidenceScore: 0.88,
      },
    ],
  },
  // 12. Conventional Lathe Operator - Declining Manual Turning (Pune)
  {
    id: "jp-012",
    title: "Manual Lathe Machinist",
    company: "Deccan Engineering Works",
    district: "Pune",
    industry: "manufacturing_cnc",
    role: "Conventional Machinist",
    vacancies: 4,
    salaryMin: 200000,
    salaryMax: 280000,
    postedAt: "2026-08-02",
    rawDescription: "Manual step turning, thread cutting on conventional engine lathe, and manual caliper inspection.",
    skills: [
      {
        name: "Conventional Manual Lathe Turning",
        slug: "conventional-lathe-turning",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "step turning, thread cutting on conventional engine lathe",
        confidenceScore: 0.89,
      },
    ],
  },
  // 13. Historical comparison record (2025-Q4) - High Carburetor demand
  {
    id: "jp-hist-01",
    title: "Workshop Service Specialist",
    company: "Bajaj Two Wheeler Network",
    district: "Ahmedabad",
    industry: "automotive",
    role: "Automotive Mechanic",
    vacancies: 20,
    salaryMin: 200000,
    salaryMax: 260000,
    postedAt: "2025-11-15",
    rawDescription: "High-volume carburetor overhauls and intake manifold adjustments.",
    skills: [
      {
        name: "Carburetor Tuning & Jetting",
        slug: "carburetor-tuning",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "High-volume carburetor overhauls and intake manifold adjustments",
        confidenceScore: 0.90,
      },
    ],
  },
  // 14. Historical comparison record (2025-Q4) - High Manual Lathe demand
  {
    id: "jp-hist-02",
    title: "General Lathe Craftsman",
    company: "Standard Machining Cluster",
    district: "Pune",
    industry: "manufacturing_cnc",
    role: "Conventional Machinist",
    vacancies: 18,
    salaryMin: 220000,
    salaryMax: 300000,
    postedAt: "2025-11-20",
    rawDescription: "Conventional lathe turning operations and manual tooling setups.",
    skills: [
      {
        name: "Conventional Manual Lathe Turning",
        slug: "conventional-lathe-turning",
        category: "technical",
        proficiency: "advanced",
        evidenceQuote: "Conventional lathe turning operations and manual tooling setups",
        confidenceScore: 0.91,
      },
    ],
  },
  // 15. Historical comparison record (2025-Q4) - Low/Nascent EV Battery demand
  {
    id: "jp-hist-03",
    title: "EV Prototype Helper",
    company: "Tata Motors EV R&D",
    district: "Pune",
    industry: "automotive_ev",
    role: "EV Battery Diagnostic Technician",
    vacancies: 6,
    salaryMin: 320000,
    salaryMax: 420000,
    postedAt: "2025-11-25",
    rawDescription: "Early stage EV prototype battery testing under supervision.",
    skills: [
      {
        name: "EV Battery Diagnostics",
        slug: "ev-battery-diagnostics",
        category: "technical",
        proficiency: "introductory",
        evidenceQuote: "Early stage EV prototype battery testing under supervision",
        confidenceScore: 0.92,
      },
      {
        name: "Battery Management Systems (BMS)",
        slug: "bms-configuration",
        category: "technical",
        proficiency: "introductory",
        evidenceQuote: "BMS logging assistance",
        confidenceScore: 0.90,
      },
    ],
  },
  // 16. Historical comparison record (2025-Q4) - Stable SMAW Welding
  {
    id: "jp-hist-04",
    title: "Structural Welder",
    company: "L&T Heavy Engineering",
    district: "Coimbatore",
    industry: "manufacturing_cnc",
    role: "Welder",
    vacancies: 15,
    salaryMin: 250000,
    salaryMax: 350000,
    postedAt: "2025-11-10",
    rawDescription: "Shielded metal arc welding on heavy structural I-beams and joints.",
    skills: [
      {
        name: "Shielded Metal Arc Welding (SMAW)",
        slug: "smaw-welding",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "Shielded metal arc welding on heavy structural I-beams",
        confidenceScore: 0.94,
      },
    ],
  },
  // 16b. Historical comparison record (2025-Q4) - G-Code Programming
  {
    id: "jp-hist-05",
    title: "CNC Machine Operator",
    company: "Textile Machinery Works",
    district: "Coimbatore",
    industry: "manufacturing_cnc",
    role: "5-Axis CNC Machine Operator",
    vacancies: 31,
    salaryMin: 320000,
    salaryMax: 480000,
    postedAt: "2025-11-28",
    rawDescription: "G-code editing and work coordinate setup for 3-axis and 5-axis machines.",
    skills: [
      {
        name: "G-Code & M-Code Programming",
        slug: "g-code-programming",
        category: "tool",
        proficiency: "intermediate",
        evidenceQuote: "G-code editing and work coordinate setup for CNC machines",
        confidenceScore: 0.93,
      },
    ],
  },
  // 17. Current period (2026-Q3) - Stable SMAW Welding
  {
    id: "jp-017",
    title: "SMAW Certified Welder",
    company: "BHEL Subcontracting",
    district: "Coimbatore",
    industry: "manufacturing_cnc",
    role: "Welder",
    vacancies: 15,
    salaryMin: 260000,
    salaryMax: 360000,
    postedAt: "2026-08-08",
    rawDescription: "SMAW multipass fillet and groove welding per AWS D1.1 structural standards.",
    skills: [
      {
        name: "Shielded Metal Arc Welding (SMAW)",
        slug: "smaw-welding",
        category: "technical",
        proficiency: "intermediate",
        evidenceQuote: "SMAW multipass fillet and groove welding per AWS D1.1",
        confidenceScore: 0.95,
      },
    ],
  },
];

/**
 * Filter job postings by district, industry, and time range
 */
export function filterPostings(
  postings: StoredJobPosting[],
  options: RadarFilterOptions
): StoredJobPosting[] {
  let filtered = [...postings];

  // 1. District Filter
  if (options.district && options.district !== "all") {
    const targetDistrict = options.district.toLowerCase();
    filtered = filtered.filter((p) => p.district.toLowerCase() === targetDistrict);
  }

  // 2. Industry Filter
  if (options.industry && options.industry !== "all") {
    const targetIndustry = options.industry.toLowerCase();
    filtered = filtered.filter((p) => p.industry.toLowerCase() === targetIndustry);
  }

  // 3. Time Range Filter (relative to anchor date 2026-08-31)
  if (options.timeRange && options.timeRange !== "all") {
    const anchorDate = new Date("2026-08-31");
    let cutoffDays = 365;
    if (options.timeRange === "30d") cutoffDays = 30;
    else if (options.timeRange === "90d") cutoffDays = 90;
    else if (options.timeRange === "180d") cutoffDays = 180;

    const cutoffTime = anchorDate.getTime() - cutoffDays * 24 * 60 * 60 * 1000;
    filtered = filtered.filter((p) => new Date(p.postedAt).getTime() >= cutoffTime);
  }

  // 4. Keyword Search
  if (options.search && options.search.trim()) {
    const query = options.search.toLowerCase().trim();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(query) ||
        p.company.toLowerCase().includes(query) ||
        p.skills.some((s) => s.name.toLowerCase().includes(query) || s.slug.includes(query))
    );
  }

  return filtered;
}

/**
 * Get aggregated radar metrics and skill list
 */
export function getSkillRadarData(options: RadarFilterOptions = {}): RadarResponse {
  // Current observation window (2026 onwards)
  const currentMasterPostings = MASTER_JOB_POSTINGS.filter(
    (p) => new Date(p.postedAt).getTime() >= new Date("2026-01-01").getTime()
  );

  // Previous comparison window (prior to 2026)
  const prevPeriodPostings = MASTER_JOB_POSTINGS.filter(
    (p) => new Date(p.postedAt).getTime() < new Date("2026-01-01").getTime()
  );

  const currentPostings = filterPostings(currentMasterPostings, options);

  const totalVacancies = currentPostings.reduce((sum, p) => sum + p.vacancies, 0);
  const totalPostings = currentPostings.length;
  const uniqueEmployers = new Set(currentPostings.map((p) => p.company.toLowerCase())).size;

  // Extract and aggregate skills
  const skillAggregates: Map<
    string,
    {
      name: string;
      category: string;
      postingCount: number;
      vacancyCount: number;
      employers: Set<string>;
      districtCounts: Map<string, number>;
      industryCounts: Map<string, number>;
    }
  > = new Map();

  for (const p of currentPostings) {
    for (const s of p.skills) {
      if (!skillAggregates.has(s.slug)) {
        skillAggregates.set(s.slug, {
          name: s.name,
          category: s.category,
          postingCount: 0,
          vacancyCount: 0,
          employers: new Set(),
          districtCounts: new Map(),
          industryCounts: new Map(),
        });
      }

      const agg = skillAggregates.get(s.slug)!;
      agg.postingCount += 1;
      agg.vacancyCount += p.vacancies;
      agg.employers.add(p.company.toLowerCase());

      agg.districtCounts.set(
        p.district,
        (agg.districtCounts.get(p.district) || 0) + p.vacancies
      );
      agg.industryCounts.set(
        p.industry,
        (agg.industryCounts.get(p.industry) || 0) + p.vacancies
      );
    }
  }

  // Compute velocities and trajectories
  const radarItems: SkillRadarItem[] = [];

  skillAggregates.forEach((agg, slug) => {
    // Current demand (vacancies)
    const currentDemand = agg.vacancyCount;

    // Previous demand from prevPeriodPostings matching this slug
    const previousDemand = prevPeriodPostings
      .filter((p) => p.skills.some((s) => s.slug === slug))
      .reduce((sum, p) => sum + p.vacancies, 0);

    // Deterministic mathematical growth rate
    let growthRate = 0;
    if (previousDemand > 0) {
      growthRate = parseFloat(
        (((currentDemand - previousDemand) / previousDemand) * 100).toFixed(1)
      );
    } else if (currentDemand > 0) {
      growthRate = 100.0; // new entrant index
    }

    const declineRate = growthRate < 0 ? Math.abs(growthRate) : 0;
    const demandPercentage =
      totalVacancies > 0
        ? parseFloat(((currentDemand / totalVacancies) * 100).toFixed(1))
        : 0;

    // Deterministic Trajectory Classification
    let trajectory: SkillRadarItem["trajectory"] = "stable";
    let isEmergingCandidate = false;
    const qualificationNotes: string[] = [];

    const uniqueEmployersCount = agg.employers.size;
    const totalVolume = currentDemand + previousDemand;

    if (totalVolume < 2) {
      trajectory = "insufficient_data";
      qualificationNotes.push("Total observation volume below minimum threshold (2).");
    } else if (growthRate >= 25.0 && currentDemand >= 3) {
      if (uniqueEmployersCount >= 2) {
        trajectory = "emerging";
        isEmergingCandidate = true;
        qualificationNotes.push(
          `Rapid velocity (+${growthRate}%) distributed across ${uniqueEmployersCount} distinct employers.`
        );
      } else {
        trajectory = "growing";
        isEmergingCandidate = false;
        qualificationNotes.push(
          `High growth (+${growthRate}%), but held as 'growing' due to single-employer concentration.`
        );
      }
    } else if (growthRate >= 10.0) {
      trajectory = "growing";
      qualificationNotes.push(`Expansion velocity of +${growthRate}%.`);
    } else if (growthRate <= -10.0) {
      trajectory = "declining";
      qualificationNotes.push(`Demand contraction of -${declineRate}%.`);
    } else {
      trajectory = "stable";
      qualificationNotes.push(`Equilibrium fluctuation of ${growthRate}%.`);
    }

    // Determine Top District
    let topDistrict = "Multiple";
    let maxDistVac = -1;
    agg.districtCounts.forEach((count, dist) => {
      if (count > maxDistVac) {
        maxDistVac = count;
        topDistrict = dist;
      }
    });

    // Determine Top Industry
    let topIndustry = "General";
    let maxIndVac = -1;
    agg.industryCounts.forEach((count, ind) => {
      if (count > maxIndVac) {
        maxIndVac = count;
        topIndustry = ind;
      }
    });

    radarItems.push({
      slug,
      name: agg.name,
      category: agg.category,
      postingCount: agg.postingCount,
      vacancyCount: agg.vacancyCount,
      demandPercentage,
      currentDemand,
      previousDemand,
      growthRate,
      declineRate,
      trajectory,
      isEmergingCandidate,
      uniqueEmployers: uniqueEmployersCount,
      topDistrict,
      topIndustry,
      qualificationNotes,
    });
  });

  // Filter by trajectory tab if requested
  let filteredSkills = radarItems;
  if (options.trajectory && options.trajectory !== "all") {
    filteredSkills = filteredSkills.filter((s) => s.trajectory === options.trajectory);
  }

  // Sort: Emerging first, then highest vacancy demand
  filteredSkills.sort((a, b) => {
    if (a.trajectory === "emerging" && b.trajectory !== "emerging") return -1;
    if (b.trajectory === "emerging" && a.trajectory !== "emerging") return 1;
    return b.vacancyCount - a.vacancyCount;
  });

  // KPI counts across all radar items (independent of active trajectory tab)
  const emergingCount = radarItems.filter((s) => s.trajectory === "emerging").length;
  const growingCount = radarItems.filter((s) => s.trajectory === "growing").length;
  const stableCount = radarItems.filter((s) => s.trajectory === "stable").length;
  const decliningCount = radarItems.filter((s) => s.trajectory === "declining").length;

  // Pagination
  const page = Math.max(1, options.page || 1);
  const pageSize = options.pageSize !== undefined ? Math.max(1, options.pageSize) : 50;
  const totalItems = filteredSkills.length;
  const totalPages = Math.ceil(totalItems / pageSize) || 1;
  const paginatedSkills = filteredSkills.slice((page - 1) * pageSize, page * pageSize);

  // Filter Lookups
  const allDistricts = Array.from(
    new Set(MASTER_JOB_POSTINGS.map((p) => p.district))
  ).sort();
  const allIndustries = Array.from(
    new Set(MASTER_JOB_POSTINGS.map((p) => p.industry))
  ).sort();

  return {
    metadata: {
      source: "Skill Sync AI / Labour Market Analytics Engine (Problem Statement ID 26134)",
      calculatedAt: new Date().toISOString(),
      population: {
        totalPostings,
        totalVacancies,
        uniqueEmployers,
        uniqueSkills: skillAggregates.size,
      },
      activeFilters: {
        district: options.district || "all",
        industry: options.industry || "all",
        timeRange: options.timeRange || "all",
        trajectory: options.trajectory || "all",
        search: options.search || "",
      },
    },
    kpis: {
      totalVacancies,
      totalPostings,
      emergingCount,
      growingCount,
      stableCount,
      decliningCount,
    },
    skills: paginatedSkills,
    pagination: {
      currentPage: page,
      pageSize,
      totalItems,
      totalPages,
    },
    filterLookups: {
      districts: allDistricts,
      industries: allIndustries,
    },
  };
}

/**
 * Get comprehensive Skill Profile detail for inspection modal
 */
export function getSkillProfile(skillSlug: string): SkillProfileDetail | null {
  const slugLower = skillSlug.toLowerCase();
  
  // Find all postings referencing this skill
  const matchingPostings = MASTER_JOB_POSTINGS.filter((p) =>
    p.skills.some((s) => s.slug.toLowerCase() === slugLower)
  );

  if (matchingPostings.length === 0) {
    return null;
  }

  // Find skill specification from first occurrence
  const skillSample = matchingPostings[0].skills.find(
    (s) => s.slug.toLowerCase() === slugLower
  )!;

  const totalVacancies = matchingPostings.reduce((sum, p) => sum + p.vacancies, 0);
  const totalPostings = matchingPostings.length;
  const uniqueEmployers = new Set(matchingPostings.map((p) => p.company.toLowerCase())).size;

  // Total vacancies across all postings for relative percentage
  const totalMarketVacancies = MASTER_JOB_POSTINGS.reduce(
    (sum, p) => sum + p.vacancies,
    0
  );
  const demandPercentage =
    totalMarketVacancies > 0
      ? parseFloat(((totalVacancies / totalMarketVacancies) * 100).toFixed(1))
      : 0;

  // Previous window comparison
  const prevVacancies = MASTER_JOB_POSTINGS.filter(
    (p) =>
      new Date(p.postedAt).getTime() < new Date("2026-01-01").getTime() &&
      p.skills.some((s) => s.slug.toLowerCase() === slugLower)
  ).reduce((sum, p) => sum + p.vacancies, 0);

  const currVacancies = matchingPostings
    .filter((p) => new Date(p.postedAt).getTime() >= new Date("2026-01-01").getTime())
    .reduce((sum, p) => sum + p.vacancies, 0);

  let growthRate = 0;
  if (prevVacancies > 0) {
    growthRate = parseFloat((((currVacancies - prevVacancies) / prevVacancies) * 100).toFixed(1));
  } else if (currVacancies > 0) {
    growthRate = 100.0;
  }

  let trajectory: SkillProfileDetail["trajectory"] = "stable";
  if (growthRate >= 25.0 && uniqueEmployers >= 2 && currVacancies >= 3) {
    trajectory = "emerging";
  } else if (growthRate >= 10.0) {
    trajectory = "growing";
  } else if (growthRate <= -10.0) {
    trajectory = "declining";
  }

  // Time-Series Trend History (Aggregated by month)
  const monthMap: Map<string, { vacancies: number; postings: number; label: string }> = new Map([
    ["2025-11", { vacancies: 0, postings: 0, label: "Nov 2025" }],
    ["2025-12", { vacancies: 0, postings: 0, label: "Dec 2025" }],
    ["2026-01", { vacancies: 0, postings: 0, label: "Jan 2026" }],
    ["2026-02", { vacancies: 0, postings: 0, label: "Feb 2026" }],
    ["2026-07", { vacancies: 0, postings: 0, label: "Jul 2026" }],
    ["2026-08", { vacancies: 0, postings: 0, label: "Aug 2026" }],
  ]);

  matchingPostings.forEach((p) => {
    const monthKey = p.postedAt.slice(0, 7);
    if (monthMap.has(monthKey)) {
      const data = monthMap.get(monthKey)!;
      data.vacancies += p.vacancies;
      data.postings += 1;
    }
  });

  const trendHistory: TimeSeriesPoint[] = [];
  monthMap.forEach((val, key) => {
    trendHistory.push({
      period: key,
      label: val.label,
      vacancies: val.vacancies,
      postings: val.postings,
    });
  });

  // District Breakdown
  const districtMap: Map<string, { vacancies: number; postings: number }> = new Map();
  matchingPostings.forEach((p) => {
    if (!districtMap.has(p.district)) {
      districtMap.set(p.district, { vacancies: 0, postings: 0 });
    }
    const d = districtMap.get(p.district)!;
    d.vacancies += p.vacancies;
    d.postings += 1;
  });

  const districtBreakdown = Array.from(districtMap.entries())
    .map(([district, data]) => ({
      district,
      vacancies: data.vacancies,
      postings: data.postings,
      percentage: parseFloat(((data.vacancies / totalVacancies) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.vacancies - a.vacancies);

  // Industry Breakdown
  const industryMap: Map<string, { vacancies: number; postings: number }> = new Map();
  matchingPostings.forEach((p) => {
    if (!industryMap.has(p.industry)) {
      industryMap.set(p.industry, { vacancies: 0, postings: 0 });
    }
    const ind = industryMap.get(p.industry)!;
    ind.vacancies += p.vacancies;
    ind.postings += 1;
  });

  const industryBreakdown = Array.from(industryMap.entries())
    .map(([industry, data]) => ({
      industry,
      vacancies: data.vacancies,
      postings: data.postings,
      percentage: parseFloat(((data.vacancies / totalVacancies) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.vacancies - a.vacancies);

  // Role Breakdown
  const roleMap: Map<string, { vacancies: number; postings: number }> = new Map();
  matchingPostings.forEach((p) => {
    if (!roleMap.has(p.role)) {
      roleMap.set(p.role, { vacancies: 0, postings: 0 });
    }
    const r = roleMap.get(p.role)!;
    r.vacancies += p.vacancies;
    r.postings += 1;
  });

  const roleBreakdown = Array.from(roleMap.entries())
    .map(([role, data]) => ({
      role,
      vacancies: data.vacancies,
      postings: data.postings,
      percentage: parseFloat(((data.vacancies / totalVacancies) * 100).toFixed(1)),
    }))
    .sort((a, b) => b.vacancies - a.vacancies);

  // Proficiency Breakdown
  const profMap = { introductory: 0, intermediate: 0, advanced: 0, expert: 0 };
  let totalConfidence = 0;
  let countWithConfidence = 0;

  matchingPostings.forEach((p) => {
    const s = p.skills.find((sk) => sk.slug.toLowerCase() === slugLower);
    if (s) {
      profMap[s.proficiency] += p.vacancies;
      totalConfidence += s.confidenceScore;
      countWithConfidence++;
    }
  });

  const dominant = (Object.keys(profMap) as Array<keyof typeof profMap>).reduce((a, b) =>
    profMap[a] > profMap[b] ? a : b
  );

  const averageConfidence =
    countWithConfidence > 0 ? parseFloat((totalConfidence / countWithConfidence).toFixed(2)) : 0.95;

  // Related / Co-occurring Skills
  const coOccurringMap: Map<string, { name: string; count: number }> = new Map();
  matchingPostings.forEach((p) => {
    p.skills.forEach((s) => {
      if (s.slug.toLowerCase() !== slugLower) {
        if (!coOccurringMap.has(s.slug)) {
          coOccurringMap.set(s.slug, { name: s.name, count: 0 });
        }
        coOccurringMap.get(s.slug)!.count += 1;
      }
    });
  });

  const relatedSkills = Array.from(coOccurringMap.entries())
    .map(([slug, data]) => ({
      name: data.name,
      slug,
      coOccurrenceCount: data.count,
    }))
    .sort((a, b) => b.coOccurrenceCount - a.coOccurrenceCount)
    .slice(0, 6);

  // Supporting Job Postings with Verbatim Evidence Quotes
  const supportingJobPostings: SupportingJobPosting[] = matchingPostings.map((p) => {
    const s = p.skills.find((sk) => sk.slug.toLowerCase() === slugLower)!;
    return {
      id: p.id,
      title: p.title,
      company: p.company,
      district: p.district,
      industry: p.industry,
      vacancies: p.vacancies,
      salaryRange: `₹${(p.salaryMin / 100000).toFixed(1)}L - ₹${(p.salaryMax / 100000).toFixed(1)}L PA`,
      postedAt: p.postedAt,
      evidenceQuote: s.evidenceQuote,
      confidenceScore: s.confidenceScore,
    };
  });

  return {
    slug: skillSample.slug,
    name: skillSample.name,
    category: skillSample.category,
    trajectory,
    growthRate,
    totalVacancies,
    totalPostings,
    demandPercentage,
    uniqueEmployers,
    averageConfidence,
    trendHistory,
    districtBreakdown,
    industryBreakdown,
    roleBreakdown,
    proficiencyBreakdown: {
      ...profMap,
      dominant,
    },
    relatedSkills,
    supportingJobPostings,
  };
}
