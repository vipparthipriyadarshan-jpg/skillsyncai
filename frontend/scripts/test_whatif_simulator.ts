/**
 * Skill Sync AI: What-If Simulator Test Suite
 * Problem Statement ID: 26134
 * 
 * Verifies:
 * 1. Benchmark scenario calculation: Sector EV with +30% demand shift
 * 2. Complete 7-dimension impact calculation:
 *    - Required skills
 *    - Courses
 *    - Training seats
 *    - Trainers
 *    - Equipment
 *    - Districts
 *    - Employer demand
 * 3. 4-Element Result Structure on every dimension:
 *    - Baseline (ACTUAL DATA)
 *    - Scenario Input
 *    - Calculation Logic
 *    - Resulting Changes
 * 4. Distinct framing: ACTUAL DATA vs HYPOTHETICAL SIMULATION
 * 5. Display and verification of mathematical assumptions
 * 6. Saving scenarios to policy library
 * 7. Side-by-side scenario comparison matrix generation
 * 8. Contraction scenario handling (-35% demand)
 */

import {
  runWorkforceSimulation,
  saveSimulationScenario,
  getSavedScenarios,
  compareScenarios,
  resetSimulatorStore,
} from "../src/lib/simulator/engine";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, details?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName}${details ? ` - ${details}` : ""}`);
    failedCount++;
  }
}

async function runTestSuite() {
  console.log("=============================================================");
  console.log("   Skill Sync AI: What-If Simulator Test Suite               ");
  console.log("=============================================================\n");

  resetSimulatorStore();

  // -------------------------------------------------------------
  // Test 1: User Benchmark Scenario (EV +30% Demand Shift)
  // -------------------------------------------------------------
  console.log("[Test 1] Benchmark Scenario: Electric Vehicles (+30% Demand)");
  const simEv30 = runWorkforceSimulation({
    sector: "automotive_ev",
    demandChangePct: 30,
    districtScope: "all",
  });

  assert(simEv30.sector === "automotive_ev", "Sector is automotive_ev");
  assert(simEv30.demandChangePct === 30, "Demand change is +30%");
  assert(!!simEv30.scenarioId, `Scenario ID generated: ${simEv30.scenarioId}`);

  // -------------------------------------------------------------
  // Test 2: Verification of All 7 Output Dimensions
  // -------------------------------------------------------------
  console.log("\n[Test 2] 7-Dimension Mathematical Impact Verification");

  // Dimension 1: Employer Demand
  const empDemand = simEv30.employerDemandImpact;
  assert(empDemand.baseline.baselineVacancies === 244, `Actual baseline vacancies = 244 (${empDemand.baseline.baselineVacancies})`);
  assert(empDemand.simulatedValue.simulatedVacancies === 317, `Simulated vacancies = 317 (${empDemand.simulatedValue.simulatedVacancies})`);
  assert(empDemand.simulatedValue.netVacancyDelta === 73, `Net vacancy delta = +73 (${empDemand.simulatedValue.netVacancyDelta})`);
  assert(empDemand.simulatedValue.deltaPct === 30, "Demand shift matches +30%");

  // Dimension 2: Training Seats
  const seats = simEv30.seatsImpact;
  assert(seats.baseline.baselineAnnualSeats === 120, `Actual baseline annual seats = 120 (${seats.baseline.baselineAnnualSeats})`);
  assert(seats.simulatedValue.simulatedAnnualSeats === 156, `Simulated annual seats = 156 (${seats.simulatedValue.simulatedAnnualSeats})`);
  assert(seats.simulatedValue.seatDelta === 36, `Net seat delta = +36 (${seats.simulatedValue.seatDelta})`);
  assert(seats.simulatedValue.batchesNeeded === 8, `Batches needed = 8 cohorts (${seats.simulatedValue.batchesNeeded})`);

  // Dimension 3: Trainers
  const trainers = simEv30.trainersImpact;
  assert(trainers.baseline.baselineCertifiedTrainers === 6, `Actual baseline certified trainers = 6 (${trainers.baseline.baselineCertifiedTrainers})`);
  assert(trainers.simulatedValue.simulatedTrainersNeeded === 8, `Simulated trainers needed = 8 (${trainers.simulatedValue.simulatedTrainersNeeded})`);
  assert(trainers.simulatedValue.trainerDeficit === 2, `Trainer deficit = 2 instructors (${trainers.simulatedValue.trainerDeficit})`);
  assert(trainers.simulatedValue.upskillingHoursRequired === 160, `Upskilling hours = 160h (${trainers.simulatedValue.upskillingHoursRequired}h)`);

  // Dimension 4: Equipment & Capex
  const equipment = simEv30.equipmentImpact;
  assert(equipment.baseline.baselineWorkstations === 30, `Actual baseline workstations = 30 (${equipment.baseline.baselineWorkstations})`);
  assert(equipment.simulatedValue.simulatedWorkstationsNeeded === 39, `Simulated workstations = 39 (${equipment.simulatedValue.simulatedWorkstationsNeeded})`);
  assert(equipment.simulatedValue.benchShortfall === 9, `Bench shortfall = 9 benches (${equipment.simulatedValue.benchShortfall})`);
  assert(equipment.simulatedValue.estimatedCapexDeficitInr === 4050000, `Capex deficit = ₹40,50,000 (${equipment.simulatedValue.estimatedCapexDeficitInr})`);
  assert(equipment.simulatedValue.formattedCapex.includes("40.5"), `Formatted Capex string = "₹40.50 Lakhs" ("${equipment.simulatedValue.formattedCapex}")`);

  // Dimension 5: Required Skills
  const skills = simEv30.skillsImpact;
  assert(skills.simulatedValue.length >= 5, `Skills impact includes 5 competencies (count: ${skills.simulatedValue.length})`);
  const evBatt = skills.simulatedValue.find((s) => s.skillName.includes("Battery Diagnostics"))!;
  assert(evBatt.baselineDemand === 66, `EV Battery baseline demand = 66 (${evBatt.baselineDemand})`);
  assert(evBatt.simulatedDemand === 86, `EV Battery simulated demand = 86 (${evBatt.simulatedDemand})`);
  assert(evBatt.delta === 20, `EV Battery delta = +20 (${evBatt.delta})`);

  // Dimension 6: Courses
  const courses = simEv30.coursesImpact;
  assert(courses.simulatedValue.length === 2, `Courses affected = 2 (count: ${courses.simulatedValue.length})`);
  const evTechCourse = courses.simulatedValue.find((c) => c.courseCode === "EV-TECH-201")!;
  assert(evTechCourse.baselineAnnualIntake === 80, `EV-TECH-201 baseline intake = 80 (${evTechCourse.baselineAnnualIntake})`);
  assert(evTechCourse.simulatedAnnualIntake === 104, `EV-TECH-201 simulated intake = 104 (${evTechCourse.simulatedAnnualIntake})`);
  assert(evTechCourse.deltaSeats === 24, `EV-TECH-201 seat delta = +24 (${evTechCourse.deltaSeats})`);

  // Dimension 7: Districts
  const districts = simEv30.districtsImpact;
  assert(districts.simulatedValue.length === 3, `Regional districts mapped = 3 (${districts.simulatedValue.length})`);
  const puneDist = districts.simulatedValue.find((d) => d.districtName === "Pune")!;
  assert(puneDist.regionalAbsorptionSharePct === 70, `Pune absorbs 70% of EV demand (${puneDist.regionalAbsorptionSharePct}%)`);
  assert(puneDist.baselineVacancies === 171, `Pune baseline vacancies = 171 (${puneDist.baselineVacancies})`);
  assert(puneDist.simulatedVacancies === 222, `Pune simulated vacancies = 222 (${puneDist.simulatedVacancies})`);
  assert(puneDist.vacancyDelta === 51, `Pune vacancy delta = +51 (${puneDist.vacancyDelta})`);

  // -------------------------------------------------------------
  // Test 3: 4-Element Result Structure on Every Dimension
  // -------------------------------------------------------------
  console.log("\n[Test 3] 4-Element Result Structure Verification");
  const dimensions = [
    simEv30.employerDemandImpact,
    simEv30.seatsImpact,
    simEv30.trainersImpact,
    simEv30.equipmentImpact,
    simEv30.skillsImpact,
    simEv30.coursesImpact,
    simEv30.districtsImpact,
  ];

  for (const dim of dimensions) {
    assert(dim.baseline !== undefined, `[${dim.dimensionName}] Element 1: Baseline present`);
    assert(dim.scenarioInput.length > 5, `[${dim.dimensionName}] Element 2: Scenario Input present`);
    assert(dim.calculationLogic.length > 5, `[${dim.dimensionName}] Element 3: Calculation Logic present`);
    assert(dim.simulatedValue !== undefined, `[${dim.dimensionName}] Element 4: Resulting Changes present`);
  }

  // -------------------------------------------------------------
  // Test 4: Assumptions Display Verification
  // -------------------------------------------------------------
  console.log("\n[Test 4] Transparent Mathematical Assumptions");
  const asm = simEv30.assumptions;
  assert(asm.studentToTrainerRatio === 20, `Trainee-to-faculty ratio = 20:1 (${asm.studentToTrainerRatio})`);
  assert(asm.studentsPerBench === 4, `Students per workstation = 4:1 (${asm.studentsPerBench})`);
  assert(asm.benchUnitCostInr === 450000, `EV bench unit cost = ₹4,50,000 (${asm.benchUnitCostInr})`);
  assert(asm.absorptionMonths === 6, `Absorption timeframe = 6 months (${asm.absorptionMonths})`);

  // -------------------------------------------------------------
  // Test 5: Distinct Framing & Disclaimer Verification
  // -------------------------------------------------------------
  console.log("\n[Test 5] Strict Distinction: Actual Data vs Simulation");
  assert(!!simEv30.disclaimer, `Disclaimer present: "${simEv30.disclaimer.slice(0, 50)}..."`);
  assert(!simEv30.disclaimer.toLowerCase().includes("prediction guaranteed"), "Zero claims of guaranteed prediction");
  assert(simEv30.disclaimer.includes("mathematical policy projections"), "Explicitly declares mathematical projections");

  // -------------------------------------------------------------
  // Test 6: Save Policy Scenario & Retrieve from Library
  // -------------------------------------------------------------
  console.log("\n[Test 6] Saving Policy Scenario");
  const initialSavedCount = getSavedScenarios().length;

  const saved = saveSimulationScenario({
    title: "Mission Clean Mobility 2027 (+30% EV Demand)",
    author: "Joint Secretary of Skills",
    authorRole: "Ministry of Skill Development & Entrepreneurship",
    notes: "Approved for FY27 budget review with focus on Pune automotive cluster.",
    output: simEv30,
  });

  assert(saved.title.includes("Mission Clean Mobility"), "Scenario title saved correctly");
  assert(saved.author === "Joint Secretary of Skills", "Author recorded");
  assert(getSavedScenarios().length === initialSavedCount + 1, "Scenario added to policy library");

  // -------------------------------------------------------------
  // Test 7: Side-by-Side Scenario Comparison Matrix
  // -------------------------------------------------------------
  console.log("\n[Test 7] Side-by-Side Comparative Matrix");
  const comparison = compareScenarios([saved.id, "scen-ev-15"]);

  assert(comparison.length >= 6, `Comparison matrix generated with 7 metric rows (count: ${comparison.length})`);
  
  const vacancyRow = comparison.find((r) => r.metricKey === "vacancies")!;
  assert(vacancyRow.baselineActual === 244, `Baseline vacancies in comparison = 244 (${vacancyRow.baselineActual})`);
  assert(vacancyRow.scenarios[saved.id] === 317, `Saved scenario vacancies = 317 (${vacancyRow.scenarios[saved.id]})`);

  const seatsRow = comparison.find((r) => r.metricKey === "seats")!;
  assert(seatsRow.baselineActual === 120, `Baseline seats in comparison = 120 (${seatsRow.baselineActual})`);
  assert(seatsRow.scenarios[saved.id] === 156, `Saved scenario seats = 156 (${seatsRow.scenarios[saved.id]})`);

  // -------------------------------------------------------------
  // Test 8: Contraction Scenario Handling (-35% Demand)
  // -------------------------------------------------------------
  console.log("\n[Test 8] Industrial Contraction Modeling (-35% CNC Demand)");
  const simContraction = runWorkforceSimulation({
    sector: "manufacturing_cnc",
    demandChangePct: -35,
    districtScope: "all",
  });

  assert(simContraction.employerDemandImpact.simulatedValue.simulatedVacancies < 180, "Vacancies decrease in contraction");
  assert(simContraction.seatsImpact.simulatedValue.seatDelta === -35, `Seat delta is negative (-35 seats)`);
  assert(simContraction.trainersImpact.simulatedValue.trainerDeficit === 0, "No trainer deficit during contraction");
  assert(simContraction.equipmentImpact.simulatedValue.benchShortfall === 0, "No equipment Capex deficit during contraction");

  console.log("\n=============================================================");
  console.log(`   What-If Simulator Test Summary: ${passedCount} PASSED, ${failedCount} FAILED   `);
  console.log("=============================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
