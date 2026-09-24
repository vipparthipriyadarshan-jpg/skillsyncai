/**
 * Skill Sync AI - What-If Workforce Simulation Engine
 * Problem Statement ID: 26134
 * 
 * Mathematical policy simulation engine synthesizing real-world telemetry baselines
 * with user-defined policy levers (e.g. Sector: Electric Vehicles, Demand Change: +30%).
 * 
 * Strict Guideline:
 * Distinguish ACTUAL DATA from HYPOTHETICAL SIMULATION.
 * Never present simulated outcomes as guaranteed real-world predictions.
 */

import {
  SimulatorScenarioInput,
  SimulationAssumptions,
  SimulationOutput,
  SavedScenario,
  ScenarioComparisonItem,
  SkillDemandItem,
  CourseImpactItem,
  SeatsImpactData,
  TrainersImpactData,
  EquipmentImpactData,
  DistrictImpactItem,
  EmployerDemandImpactData,
} from "./types";

export const DEFAULT_ASSUMPTIONS: Record<string, SimulationAssumptions> = {
  automotive_ev: {
    studentToTrainerRatio: 20,
    studentsPerBench: 4,
    benchUnitCostInr: 450000, // ₹4.5 Lakhs per Vector CANoe & High-Voltage Test Bench
    absorptionMonths: 6,
    completionRatePct: 90,
    trainerUpskillingCostPerFacultyInr: 65000,
  },
  manufacturing_cnc: {
    studentToTrainerRatio: 20,
    studentsPerBench: 4,
    benchUnitCostInr: 1200000, // ₹12 Lakhs per 5-Axis CNC Mill Simulator Station
    absorptionMonths: 6,
    completionRatePct: 92,
    trainerUpskillingCostPerFacultyInr: 85000,
  },
  renewable_energy: {
    studentToTrainerRatio: 20,
    studentsPerBench: 4,
    benchUnitCostInr: 350000, // ₹3.5 Lakhs per Grid Inverter Synchronization Bench
    absorptionMonths: 6,
    completionRatePct: 88,
    trainerUpskillingCostPerFacultyInr: 50000,
  },
};

interface SectorBaselineData {
  sectorLabel: string;
  baselineVacancies: number;
  baselineAnnualSeats: number;
  baselineCertifiedTrainers: number;
  baselineWorkstations: number;
  baselineEmployers: number;
  courses: { code: string; name: string; intake: number; practicalHours: number }[];
  skills: { name: string; category: string; demand: number }[];
  districts: { name: string; sharePct: number }[];
}

const SECTOR_BASELINES: Record<string, SectorBaselineData> = {
  automotive_ev: {
    sectorLabel: "Electric Vehicles & Clean Mobility",
    baselineVacancies: 244,
    baselineAnnualSeats: 120,
    baselineCertifiedTrainers: 6,
    baselineWorkstations: 30, // 30 benches * 4 students = 120 student capacity
    baselineEmployers: 14,
    courses: [
      { code: "EV-TECH-201", name: "Electric Vehicle Service & Diagnostics", intake: 80, practicalHours: 120 },
      { code: "AUTO-MECH-102", name: "Motor Vehicle Mechanic (EV Transition)", intake: 40, practicalHours: 80 },
    ],
    skills: [
      { name: "EV Battery Diagnostics & Cell Balancing", category: "technical", demand: 66 },
      { name: "CAN Bus Protocol & In-Vehicle Networking", category: "technical", demand: 60 },
      { name: "BMS Configuration & Thermal Isolation", category: "domain_knowledge", demand: 54 },
      { name: "Electric Powertrain Inverter Systems", category: "technical", demand: 42 },
      { name: "Lockout/Tagout (LOTO) High-Voltage Safety", category: "compliance_standard", demand: 22 },
    ],
    districts: [
      { name: "Pune", sharePct: 70 },
      { name: "Ahmedabad", sharePct: 20 },
      { name: "Coimbatore", sharePct: 10 },
    ],
  },
  manufacturing_cnc: {
    sectorLabel: "Precision Manufacturing & Multi-Axis CNC",
    baselineVacancies: 180,
    baselineAnnualSeats: 100,
    baselineCertifiedTrainers: 5,
    baselineWorkstations: 25,
    baselineEmployers: 12,
    courses: [
      { code: "CNC-PROG-301", name: "Advanced CNC Machinist & Multi-Axis Programmer", intake: 70, practicalHours: 140 },
      { code: "LATHE-OP-101", name: "Conventional Lathe & CNC Turning Operator", intake: 30, practicalHours: 60 },
    ],
    skills: [
      { name: "5-Axis CNC Milling & Post-Processing", category: "technical", demand: 58 },
      { name: "CAD/CAM Toolpath Simulation (Mastercam)", category: "tool", demand: 48 },
      { name: "G-Code & M-Code Programming", category: "technical", demand: 44 },
      { name: "Geometric Dimensioning & Tolerancing (GD&T)", category: "domain_knowledge", demand: 30 },
    ],
    districts: [
      { name: "Coimbatore", sharePct: 75 },
      { name: "Pune", sharePct: 25 },
    ],
  },
  renewable_energy: {
    sectorLabel: "Renewable Energy & Solar Grid Systems",
    baselineVacancies: 140,
    baselineAnnualSeats: 80,
    baselineCertifiedTrainers: 4,
    baselineWorkstations: 20,
    baselineEmployers: 9,
    courses: [
      { code: "SOL-GRID-101", name: "Grid-Tied Solar Photovoltaic & Inverter Specialist", intake: 80, practicalHours: 110 },
    ],
    skills: [
      { name: "Grid-Tied Inverter Synchronization", category: "technical", demand: 48 },
      { name: "Solar PV Rooftop Array Sizing", category: "domain_knowledge", demand: 42 },
      { name: "SCADA & Solar Telemetry Monitoring", category: "tool", demand: 32 },
      { name: "Net Metering & Electrical Protection", category: "compliance_standard", demand: 18 },
    ],
    districts: [
      { name: "Ahmedabad", sharePct: 80 },
      { name: "Pune", sharePct: 20 },
    ],
  },
};

/**
 * Format INR currency with Indian commas (Lakhs / Crores)
 */
function formatInrCurrency(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  }
  if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(2)} Lakhs`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

/**
 * Executes a deterministic workforce simulation across all 7 dimensions.
 */
export function runWorkforceSimulation(input: SimulatorScenarioInput): SimulationOutput {
  const baseline = SECTOR_BASELINES[input.sector] || SECTOR_BASELINES["automotive_ev"];
  const assumptions = DEFAULT_ASSUMPTIONS[input.sector] || DEFAULT_ASSUMPTIONS["automotive_ev"];

  const multiplier = 1 + input.demandChangePct / 100;
  const sign = input.demandChangePct >= 0 ? "+" : "";

  // 1. Employer Demand Impact
  const simulatedVacancies = Math.max(0, Math.round(baseline.baselineVacancies * multiplier));
  const netVacancyDelta = simulatedVacancies - baseline.baselineVacancies;
  const employerDemandData: EmployerDemandImpactData = {
    baselineVacancies: baseline.baselineVacancies,
    simulatedVacancies,
    netVacancyDelta,
    deltaPct: input.demandChangePct,
    projectedActiveHiringEmployers: Math.round(baseline.baselineEmployers * (multiplier >= 1 ? 1 + (multiplier - 1) * 0.5 : multiplier)),
    estimatedAbsorptionMonths: assumptions.absorptionMonths,
  };

  // 2. Training Seats Impact
  const simulatedAnnualSeats = Math.max(0, Math.round(baseline.baselineAnnualSeats * multiplier));
  const seatDelta = simulatedAnnualSeats - baseline.baselineAnnualSeats;
  const batchesNeeded = Math.ceil(simulatedAnnualSeats / assumptions.studentToTrainerRatio);
  const seatsData: SeatsImpactData = {
    baselineAnnualSeats: baseline.baselineAnnualSeats,
    simulatedAnnualSeats,
    seatDelta,
    deltaPct: input.demandChangePct,
    batchesNeeded,
  };

  // 3. Trainers Impact
  const simulatedTrainersNeeded = Math.ceil(simulatedAnnualSeats / assumptions.studentToTrainerRatio);
  const trainerDeficit = Math.max(0, simulatedTrainersNeeded - baseline.baselineCertifiedTrainers);
  const upskillingHoursRequired = trainerDeficit * 80; // 80h certification per faculty
  const estimatedFacultyUpskillingBudgetInr = trainerDeficit * assumptions.trainerUpskillingCostPerFacultyInr;
  const trainersData: TrainersImpactData = {
    baselineCertifiedTrainers: baseline.baselineCertifiedTrainers,
    simulatedTrainersNeeded,
    trainerDeficit,
    upskillingHoursRequired,
    estimatedFacultyUpskillingBudgetInr,
  };

  // 4. Equipment Impact
  const simulatedWorkstationsNeeded = Math.ceil(simulatedAnnualSeats / assumptions.studentsPerBench);
  const benchShortfall = Math.max(0, simulatedWorkstationsNeeded - baseline.baselineWorkstations);
  const estimatedCapexDeficitInr = benchShortfall * assumptions.benchUnitCostInr;
  const equipmentData: EquipmentImpactData = {
    baselineWorkstations: baseline.baselineWorkstations,
    simulatedWorkstationsNeeded,
    benchShortfall,
    benchUnitCostInr: assumptions.benchUnitCostInr,
    estimatedCapexDeficitInr,
    formattedCapex: formatInrCurrency(estimatedCapexDeficitInr),
  };

  // 5. Skills Impact
  const skillsData: SkillDemandItem[] = baseline.skills.map((s) => {
    const simDemand = Math.max(0, Math.round(s.demand * multiplier));
    return {
      skillName: s.name,
      category: s.category,
      baselineDemand: s.demand,
      simulatedDemand: simDemand,
      delta: simDemand - s.demand,
      deltaPct: input.demandChangePct,
    };
  });

  // 6. Courses Impact
  const coursesData: CourseImpactItem[] = baseline.courses.map((c) => {
    const simIntake = Math.max(0, Math.round(c.intake * multiplier));
    return {
      courseCode: c.code,
      courseName: c.name,
      baselineAnnualIntake: c.intake,
      simulatedAnnualIntake: simIntake,
      deltaSeats: simIntake - c.intake,
      recommendedPracticalHoursDelta: input.demandChangePct > 0 ? Math.round(c.practicalHours * 0.25) : 0,
    };
  });

  // 7. Districts Impact
  const districtsData: DistrictImpactItem[] = baseline.districts.map((d) => {
    const baseVac = Math.round((baseline.baselineVacancies * d.sharePct) / 100);
    const simVac = Math.round((simulatedVacancies * d.sharePct) / 100);
    return {
      districtName: d.name,
      baselineVacancies: baseVac,
      simulatedVacancies: simVac,
      regionalAbsorptionSharePct: d.sharePct,
      vacancyDelta: simVac - baseVac,
    };
  });

  const scenarioId = `sim-${input.sector}-${Date.now()}`;

  return {
    scenarioId,
    sector: input.sector,
    sectorLabel: baseline.sectorLabel,
    demandChangePct: input.demandChangePct,
    districtScope: input.districtScope,
    assumptions,
    employerDemandImpact: {
      dimensionName: "Employer Demand & Hiring Volume",
      baseline: employerDemandData,
      scenarioInput: `${sign}${input.demandChangePct}% Demand Shift across ${baseline.sectorLabel}`,
      calculationLogic: "Simulated Vacancies = Baseline Vacancies × (1 + Δ% / 100)",
      simulatedValue: employerDemandData,
      deltaSummary: `${sign}${netVacancyDelta} vacancies (${sign}${input.demandChangePct}%)`,
      deltaNumeric: netVacancyDelta,
    },
    seatsImpact: {
      dimensionName: "Institutional Training Capacity (Seats)",
      baseline: seatsData,
      scenarioInput: `${sign}${input.demandChangePct}% Demand Target`,
      calculationLogic: "Simulated Seats = Baseline Seats × (1 + Δ% / 100); Batches = ⌈Simulated Seats / 20⌉",
      simulatedValue: seatsData,
      deltaSummary: `${sign}${seatDelta} seats (${batchesNeeded} cohorts)`,
      deltaNumeric: seatDelta,
    },
    trainersImpact: {
      dimensionName: "Faculty & Trainer Readiness",
      baseline: trainersData,
      scenarioInput: `Faculty Ratio: 1 Certified Instructor per ${assumptions.studentToTrainerRatio} Students`,
      calculationLogic: "Required Trainers = ⌈Simulated Seats / 20⌉; Deficit = max(0, Required - Certified Baseline)",
      simulatedValue: trainersData,
      deltaSummary: trainerDeficit > 0 ? `${trainerDeficit} additional trainers needed (${upskillingHoursRequired}h upskilling)` : "Current faculty capacity adequate",
      deltaNumeric: trainerDeficit,
    },
    equipmentImpact: {
      dimensionName: "Lab Equipment & Infrastructure Capex",
      baseline: equipmentData,
      scenarioInput: `Bench Station Ratio: 1 Workstation per ${assumptions.studentsPerBench} Students at ${formatInrCurrency(assumptions.benchUnitCostInr)}/unit`,
      calculationLogic: "Workstations Needed = ⌈Simulated Seats / 4⌉; Capex Deficit = Bench Shortfall × Bench Unit Cost",
      simulatedValue: equipmentData,
      deltaSummary: benchShortfall > 0 ? `${benchShortfall} additional benches (${formatInrCurrency(estimatedCapexDeficitInr)} Capex)` : "Existing lab apparatus adequate",
      deltaNumeric: estimatedCapexDeficitInr,
    },
    skillsImpact: {
      dimensionName: "Key Competence Requirements",
      baseline: skillsData,
      scenarioInput: `Sector-wide ${sign}${input.demandChangePct}% Scaling Factor`,
      calculationLogic: "Simulated Skill Need = Baseline Openings × (1 + Δ% / 100)",
      simulatedValue: skillsData,
      deltaSummary: `${skillsData.length} competencies scaled by ${sign}${input.demandChangePct}%`,
      deltaNumeric: input.demandChangePct,
    },
    coursesImpact: {
      dimensionName: "Vocational Syllabi & Batch Sizing",
      baseline: coursesData,
      scenarioInput: `${sign}${input.demandChangePct}% Cohort Scaling across ${coursesData.length} Courses`,
      calculationLogic: "Course Intake = Baseline Intake × (1 + Δ% / 100)",
      simulatedValue: coursesData,
      deltaSummary: `${coursesData.length} courses affected (${sign}${seatDelta} net seats)`,
      deltaNumeric: seatDelta,
    },
    districtsImpact: {
      dimensionName: "Regional District Distribution",
      baseline: districtsData,
      scenarioInput: `Cluster Weighting: ${districtsData.map((d) => `${d.districtName} (${d.regionalAbsorptionSharePct}%)`).join(", ")}`,
      calculationLogic: "District Vacancies = Simulated Sector Vacancies × Regional Absorption Share %",
      simulatedValue: districtsData,
      deltaSummary: `Distributed across ${districtsData.length} regional industrial clusters`,
      deltaNumeric: districtsData.length,
    },
    computedAt: new Date().toISOString(),
    disclaimer:
      "NOTICE: Simulated outcomes are mathematical policy projections for exploratory planning. They are NOT real-world predictions or guaranteed forecasts.",
  };
}

/**
 * Pre-seeded saved scenarios for immediate policymaker exploration.
 */
const INITIAL_SAVED_SCENARIOS: SavedScenario[] = [
  {
    id: "scen-ev-30",
    title: "Aggressive EV Transition Policy (+30% Demand)",
    author: "Directorate of Technical Education",
    authorRole: "State Vocational Planning Board",
    sector: "automotive_ev",
    demandChangePct: 30,
    districtScope: "all",
    notes: "Modeled to explore Pune EV cluster expansion under the National Electric Mobility Mission. Calculates faculty and Vector CANoe Capex shortfall.",
    createdAt: "2026-09-21T09:00:00.000Z",
    output: runWorkforceSimulation({
      sector: "automotive_ev",
      demandChangePct: 30,
      districtScope: "all",
    }),
  },
  {
    id: "scen-ev-15",
    title: "Moderate EV Market Expansion (+15% Demand)",
    author: "Automotive Sector Skill Council",
    authorRole: "Industry Research Analyst",
    sector: "automotive_ev",
    demandChangePct: 15,
    districtScope: "all",
    notes: "Conservative growth scenario based on quarterly OEM vehicle registration telemetry.",
    createdAt: "2026-09-21T10:30:00.000Z",
    output: runWorkforceSimulation({
      sector: "automotive_ev",
      demandChangePct: 15,
      districtScope: "all",
    }),
  },
  {
    id: "scen-cnc-40",
    title: "Aerospace Precision Ramp-Up (+40% CNC Demand)",
    author: "Tamil Nadu Skill Development Mission",
    authorRole: "Planning Officer",
    sector: "manufacturing_cnc",
    demandChangePct: 40,
    districtScope: "Coimbatore",
    notes: "Models Coimbatore defense corridor investments and 5-axis DMG MORI training center requirements.",
    createdAt: "2026-09-21T11:45:00.000Z",
    output: runWorkforceSimulation({
      sector: "manufacturing_cnc",
      demandChangePct: 40,
      districtScope: "Coimbatore",
    }),
  },
];

let savedScenariosStore: SavedScenario[] = [...INITIAL_SAVED_SCENARIOS];

/**
 * Save a new simulation scenario.
 */
export function saveSimulationScenario(params: {
  title: string;
  author: string;
  authorRole: string;
  notes: string;
  output: SimulationOutput;
}): SavedScenario {
  const id = `scen-${Date.now()}`;
  const newScenario: SavedScenario = {
    id,
    title: params.title.trim() || `Simulation (${params.output.sectorLabel} ${params.output.demandChangePct > 0 ? "+" : ""}${params.output.demandChangePct}%)`,
    author: params.author.trim() || "Policy Planning Officer",
    authorRole: params.authorRole.trim() || "Government Administrator",
    sector: params.output.sector,
    demandChangePct: params.output.demandChangePct,
    districtScope: params.output.districtScope,
    notes: params.notes.trim() || "Generated in What-If Simulator.",
    createdAt: new Date().toISOString(),
    output: params.output,
  };

  savedScenariosStore.unshift(newScenario);
  return newScenario;
}

/**
 * Retrieve saved scenarios list.
 */
export function getSavedScenarios(): SavedScenario[] {
  return savedScenariosStore;
}

/**
 * Retrieve a single saved scenario by ID.
 */
export function getSavedScenarioById(id: string): SavedScenario | null {
  return savedScenariosStore.find((s) => s.id === id) || null;
}

/**
 * Generate side-by-side comparative matrix between Baseline (Actual) and selected scenarios.
 */
export function compareScenarios(scenarioIds: string[]): ScenarioComparisonItem[] {
  const selectedScenarios = savedScenariosStore.filter((s) => scenarioIds.includes(s.id));
  if (selectedScenarios.length === 0) return [];

  const first = selectedScenarios[0].output;
  const sector = first.sector;
  const baseline = SECTOR_BASELINES[sector] || SECTOR_BASELINES["automotive_ev"];

  const comparisonRows: ScenarioComparisonItem[] = [
    {
      metricKey: "vacancies",
      dimension: "Employer Demand",
      metricLabel: "Total Industry Vacancies",
      unit: "openings",
      baselineActual: baseline.baselineVacancies,
      scenarios: {},
    },
    {
      metricKey: "seats",
      dimension: "Training Capacity",
      metricLabel: "Annual Student Intake Seats",
      unit: "seats",
      baselineActual: baseline.baselineAnnualSeats,
      scenarios: {},
    },
    {
      metricKey: "batches",
      dimension: "Training Capacity",
      metricLabel: "Batches Required (20/batch)",
      unit: "cohorts",
      baselineActual: Math.ceil(baseline.baselineAnnualSeats / 20),
      scenarios: {},
    },
    {
      metricKey: "trainers",
      dimension: "Faculty Readiness",
      metricLabel: "Instructors Needed",
      unit: "trainers",
      baselineActual: baseline.baselineCertifiedTrainers,
      scenarios: {},
    },
    {
      metricKey: "trainer_deficit",
      dimension: "Faculty Readiness",
      metricLabel: "Faculty Deficit to Upskill",
      unit: "trainers",
      baselineActual: 0,
      scenarios: {},
    },
    {
      metricKey: "workstations",
      dimension: "Equipment Planning",
      metricLabel: "Lab Benches Needed",
      unit: "workstations",
      baselineActual: baseline.baselineWorkstations,
      scenarios: {},
    },
    {
      metricKey: "capex_deficit",
      dimension: "Equipment Planning",
      metricLabel: "Equipment Capex Shortfall",
      unit: "INR",
      baselineActual: "₹0 (Baseline)",
      scenarios: {},
    },
  ];

  selectedScenarios.forEach((scen) => {
    const o = scen.output;
    comparisonRows[0].scenarios[scen.id] = o.employerDemandImpact.simulatedValue.simulatedVacancies;
    comparisonRows[1].scenarios[scen.id] = o.seatsImpact.simulatedValue.simulatedAnnualSeats;
    comparisonRows[2].scenarios[scen.id] = o.seatsImpact.simulatedValue.batchesNeeded;
    comparisonRows[3].scenarios[scen.id] = o.trainersImpact.simulatedValue.simulatedTrainersNeeded;
    comparisonRows[4].scenarios[scen.id] = o.trainersImpact.simulatedValue.trainerDeficit;
    comparisonRows[5].scenarios[scen.id] = o.equipmentImpact.simulatedValue.simulatedWorkstationsNeeded;
    comparisonRows[6].scenarios[scen.id] = o.equipmentImpact.simulatedValue.formattedCapex;
  });

  return comparisonRows;
}

/**
 * Reset store to seed baseline (for tests).
 */
export function resetSimulatorStore(): void {
  savedScenariosStore = JSON.parse(JSON.stringify(INITIAL_SAVED_SCENARIOS));
}
