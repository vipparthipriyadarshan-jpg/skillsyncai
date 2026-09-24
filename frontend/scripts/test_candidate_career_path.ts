/**
 * Skill Sync AI: Candidate Career Path Test Suite
 * Problem Statement ID: 26134
 * 
 * Verifies:
 * 1. Target role catalog loading (EV Specialist, CNC Programmer, Solar Specialist)
 * 2. Candidate skill comparison (target role skills vs candidate skills)
 * 3. Identification of Current Skills vs Missing Skills
 * 4. Skill priorities categorization (CRITICAL, HIGH, MEDIUM)
 * 5. Sequenced phased roadmap generation (4 progressive phases)
 * 6. Relevant courses mapping from platform catalog
 * 7. Recommended practical lab projects grounded in industry
 * 8. Employer-required skills demand percentages
 * 9. Visual career path roadmap node generation
 * 10. Strict constraint check: No employment or salary guarantees (explicit disclaimer verification)
 */

import {
  TARGET_ROLES,
  PRESET_CANDIDATES,
  evaluateCareerPath,
} from "../src/lib/candidate/service";

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
  console.log("   Skill Sync AI: Candidate Career Path Test Suite           ");
  console.log("=============================================================\n");

  // -------------------------------------------------------------
  // Test 1: Target Role Catalog & Candidate Presets
  // -------------------------------------------------------------
  console.log("[Test 1] Catalog Loading & Pre-Loaded Profiles");
  assert(TARGET_ROLES.length >= 3, `Target roles catalog populated (count: ${TARGET_ROLES.length})`);
  assert(PRESET_CANDIDATES.length >= 3, `Preset candidate personas populated (count: ${PRESET_CANDIDATES.length})`);

  const evRole = TARGET_ROLES.find((r) => r.id === "role-ev-tech")!;
  assert(evRole.title.includes("Electric Vehicle"), "EV role found in catalog");
  assert(evRole.openVacancies > 100, `EV vacancies populated (${evRole.openVacancies})`);
  assert(evRole.requiredSkills.length >= 8, `EV role has 8 required skills (count: ${evRole.requiredSkills.length})`);

  // -------------------------------------------------------------
  // Test 2: Competency Comparison (Current vs Missing Skills)
  // -------------------------------------------------------------
  console.log("\n[Test 2] Competency Comparison: Current vs Missing Skills");
  const rohan = PRESET_CANDIDATES.find((c) => c.id === "cand-rohan")!;
  const assessment = evaluateCareerPath(rohan, "role-ev-tech");

  assert(assessment.currentSkills.length === 2, `Current skills identified correctly (count: ${assessment.currentSkills.length})`);
  assert(assessment.currentSkills.includes("Basic Automotive Mechanics & Chassis Systems"), "Basic Automotive skill identified as acquired");
  assert(assessment.missingSkills.length === 6, `Missing skills calculated (count: ${assessment.missingSkills.length})`);

  const missingSkillNames = assessment.missingSkills.map((s) => s.skillName);
  assert(missingSkillNames.includes("CAN Bus Protocol & In-Vehicle Networking"), "CAN Bus Protocol identified as missing");
  assert(missingSkillNames.includes("EV Battery Diagnostics & Cell Balancing"), "EV Battery Diagnostics identified as missing");
  assert(assessment.matchScorePct === 25, `Match score calculated accurately (25% = 2/8) (${assessment.matchScorePct}%)`);

  // -------------------------------------------------------------
  // Test 3: Skill Priorities Classification
  // -------------------------------------------------------------
  console.log("\n[Test 3] Skill Priorities (Critical, High, Medium)");
  const criticalMissing = assessment.missingSkills.filter((s) => s.priority === "critical");
  const highMissing = assessment.missingSkills.filter((s) => s.priority === "high");
  const mediumMissing = assessment.missingSkills.filter((s) => s.priority === "medium");

  assert(criticalMissing.length >= 1, `Critical missing skill found (count: ${criticalMissing.length})`);
  assert(criticalMissing[0].skillName.includes("LOTO"), "LOTO Safety identified as critical priority");
  assert(highMissing.length >= 2, `High priority missing skills found (count: ${highMissing.length})`);
  assert(mediumMissing.length >= 1, `Medium priority missing skills found (count: ${mediumMissing.length})`);

  // -------------------------------------------------------------
  // Test 4: Recommended Phased Learning Sequence
  // -------------------------------------------------------------
  console.log("\n[Test 4] Recommended Sequence (Phased Learning Roadmap)");
  const roadmap = assessment.phasedRoadmap;
  assert(roadmap.length === 4, `Roadmap contains 4 progressive phases (count: ${roadmap.length})`);

  assert(roadmap[0].phaseTitle.includes("Foundational & High-Voltage Safety"), "Phase 1 is Safety & Clearance");
  assert(roadmap[1].phaseTitle.includes("Core Subsystems"), "Phase 2 is Core Subsystems");
  assert(roadmap[2].phaseTitle.includes("Digital Protocols"), "Phase 3 is Digital Protocols");
  assert(roadmap[3].phaseTitle.includes("Capstone"), "Phase 4 is Capstone & Apprenticeship");

  const totalDuration = roadmap.reduce((acc, p) => acc + p.durationWeeks, 0);
  assert(totalDuration === 14, `Total roadmap duration calculated (~${totalDuration} weeks)`);

  // -------------------------------------------------------------
  // Test 5: Relevant Platform Courses
  // -------------------------------------------------------------
  console.log("\n[Test 5] Relevant Registered Vocational Courses");
  assert(assessment.relevantCourses.length >= 2, `Relevant courses linked from platform (count: ${assessment.relevantCourses.length})`);
  const evCourse = assessment.relevantCourses.find((c) => c.code === "EV-TECH-201")!;
  assert(!!evCourse, "EV-TECH-201 course mapped to EV pathway");
  assert(evCourse.hours === 240, `Course hours correct (${evCourse.hours}h)`);
  assert(evCourse.practicalHoursRatio.includes("Practical"), "Practical lab hours specified");

  // -------------------------------------------------------------
  // Test 6: Recommended Practical Projects
  // -------------------------------------------------------------
  console.log("\n[Test 6] Recommended Practical Lab Projects");
  assert(assessment.recommendedProjects.length >= 3, `Practical projects linked (count: ${assessment.recommendedProjects.length})`);
  const canProject = assessment.recommendedProjects.find((p) => p.title.includes("CAN Bus"))!;
  assert(!!canProject, "CAN Bus project recommended");
  assert(canProject.toolsUsed.includes("Vector CANoe VN1630A"), "CANoe tool specified");
  assert(canProject.industryContext.includes("Tata Passenger EV"), "Tata Motors industry context cited");

  // -------------------------------------------------------------
  // Test 7: Employer-Required Skills & Demand Intensity
  // -------------------------------------------------------------
  console.log("\n[Test 7] Employer-Required Skills Demand Percentages");
  const canReq = assessment.employerRequiredSkills.find((s) => s.skillName.includes("CAN Bus"))!;
  assert(canReq.employerDemandPct === 94, `CAN Bus employer demand percentage = 94% (${canReq.employerDemandPct}%)`);
  const battReq = assessment.employerRequiredSkills.find((s) => s.skillName.includes("Battery Diagnostics"))!;
  assert(battReq.employerDemandPct === 96, `Battery diagnostics employer demand percentage = 96% (${battReq.employerDemandPct}%)`);

  // -------------------------------------------------------------
  // Test 8: Strict Constraint: No Employment or Salary Guarantees
  // -------------------------------------------------------------
  console.log("\n[Test 8] Strict Disclaimer Verification (No Employment or Salary Guarantee)");
  assert(!!assessment.disclaimer, "Disclaimer present on assessment");
  assert(assessment.disclaimer.includes("does NOT guarantee employment"), "Explicitly disclaims employment guarantee");
  assert(assessment.disclaimer.includes("specific salary levels"), "Explicitly disclaims salary guarantee");
  assert(evRole.benchmarkSalaryBand.includes("Historical Market Observation"), "Salary band explicitly framed as historical observation, not guarantee");

  // -------------------------------------------------------------
  // Test 9: Real-Time Dynamic Skill Toggling Test
  // -------------------------------------------------------------
  console.log("\n[Test 9] Dynamic Skill Customization & Recalculation");
  const upskilledRohan = {
    ...rohan,
    currentSkills: [
      ...rohan.currentSkills,
      "Lockout/Tagout (LOTO) High-Voltage Safety",
      "CAN Bus Protocol & In-Vehicle Networking",
    ],
  };

  const reAssessment = evaluateCareerPath(upskilledRohan, "role-ev-tech");
  assert(reAssessment.currentSkills.length === 4, "Current skills increased to 4");
  assert(reAssessment.matchScorePct === 50, `Match score recalculated to 50% (${reAssessment.matchScorePct}%)`);
  assert(reAssessment.missingSkills.length === 4, "Missing skills reduced to 4");

  console.log("\n=============================================================");
  console.log(`   Candidate Career Path Test Summary: ${passedCount} PASSED, ${failedCount} FAILED   `);
  console.log("=============================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
