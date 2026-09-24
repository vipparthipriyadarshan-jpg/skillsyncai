/**
 * Skill Sync AI - What-If Simulator Types
 * Problem Statement ID: 26134
 * 
 * Strict Guideline:
 * Clearly distinguish ACTUAL DATA (baseline telemetry) from SIMULATION (policy exploration).
 * Never present simulated outcomes as guaranteed real-world predictions.
 */

export interface SimulatorScenarioInput {
  sector: "automotive_ev" | "manufacturing_cnc" | "renewable_energy";
  demandChangePct: number; // e.g. +30 for +30%, -35 for -35%
  districtScope: "all" | "Pune" | "Coimbatore" | "Ahmedabad";
  policyTitle?: string;
  notes?: string;
}

export interface SimulationAssumptions {
  studentToTrainerRatio: number; // e.g. 20 students per instructor
  studentsPerBench: number; // e.g. 4 students per lab apparatus bench
  benchUnitCostInr: number; // e.g. ₹4,50,000 for CANoe bench
  absorptionMonths: number; // e.g. 6 months hiring lag
  completionRatePct: number; // e.g. 90% pass rate
  trainerUpskillingCostPerFacultyInr: number; // e.g. ₹65,000
}

export interface DimensionImpact<T> {
  dimensionName: string;
  baseline: T; // ACTUAL DATA
  scenarioInput: string; // e.g. "+30% Demand Shift in Automotive EV"
  calculationLogic: string; // Transparent mathematical formula
  simulatedValue: T; // HYPOTHETICAL SIMULATION
  deltaSummary: string; // e.g. "+36 seats (+30%)"
  deltaNumeric: number;
}

export interface SkillDemandItem {
  skillName: string;
  category: string;
  baselineDemand: number;
  simulatedDemand: number;
  delta: number;
  deltaPct: number;
}

export interface CourseImpactItem {
  courseCode: string;
  courseName: string;
  baselineAnnualIntake: number;
  simulatedAnnualIntake: number;
  deltaSeats: number;
  recommendedPracticalHoursDelta: number;
}

export interface SeatsImpactData {
  baselineAnnualSeats: number;
  simulatedAnnualSeats: number;
  seatDelta: number;
  deltaPct: number;
  batchesNeeded: number; // at 20 students/batch
}

export interface TrainersImpactData {
  baselineCertifiedTrainers: number;
  simulatedTrainersNeeded: number;
  trainerDeficit: number;
  upskillingHoursRequired: number; // e.g. 80h per faculty
  estimatedFacultyUpskillingBudgetInr: number;
}

export interface EquipmentImpactData {
  baselineWorkstations: number;
  simulatedWorkstationsNeeded: number;
  benchShortfall: number;
  benchUnitCostInr: number;
  estimatedCapexDeficitInr: number;
  formattedCapex: string;
}

export interface DistrictImpactItem {
  districtName: string;
  baselineVacancies: number;
  simulatedVacancies: number;
  regionalAbsorptionSharePct: number;
  vacancyDelta: number;
}

export interface EmployerDemandImpactData {
  baselineVacancies: number;
  simulatedVacancies: number;
  netVacancyDelta: number;
  deltaPct: number;
  projectedActiveHiringEmployers: number;
  estimatedAbsorptionMonths: number;
}

export interface SimulationOutput {
  scenarioId: string;
  sector: string;
  sectorLabel: string;
  demandChangePct: number;
  districtScope: string;
  assumptions: SimulationAssumptions;
  skillsImpact: DimensionImpact<SkillDemandItem[]>;
  coursesImpact: DimensionImpact<CourseImpactItem[]>;
  seatsImpact: DimensionImpact<SeatsImpactData>;
  trainersImpact: DimensionImpact<TrainersImpactData>;
  equipmentImpact: DimensionImpact<EquipmentImpactData>;
  districtsImpact: DimensionImpact<DistrictImpactItem[]>;
  employerDemandImpact: DimensionImpact<EmployerDemandImpactData>;
  computedAt: string;
  disclaimer: string;
}

export interface SavedScenario {
  id: string;
  title: string;
  author: string;
  authorRole: string;
  sector: string;
  demandChangePct: number;
  districtScope: string;
  notes: string;
  createdAt: string;
  output: SimulationOutput;
}

export interface ScenarioComparisonItem {
  metricKey: string;
  dimension: string;
  metricLabel: string;
  unit: string;
  baselineActual: string | number;
  scenarios: Record<string, string | number>; // scenarioId -> value
}
