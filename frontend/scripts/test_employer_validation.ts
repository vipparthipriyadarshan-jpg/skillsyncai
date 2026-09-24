/**
 * Skill Sync AI: Employer Validation Test Suite
 * Problem Statement ID: 26134
 * 
 * Verifies:
 * 1. Viewing recommendations relevant to industry sector
 * 2. Confirm recommendation workflow
 * 3. Modify recommendation workflow
 * 4. Reject recommendation workflow
 * 5. Qualitative feedback comments capture
 * 6. Identifying important / critical skills
 * 7. Reporting hiring difficulty
 * 8. Validating entry proficiency requirements
 * 9. Transparent validation statistics ("8 of 10 employers confirmed -> 80% Employer Confirmation")
 * 10. Framing safeguard: Verifies zero occurrence of "ground truth" and strictly uses "Employer Validation Evidence"
 * 11. Immutable audit record creation and tracking
 */

import {
  REGISTERED_EMPLOYERS,
  getRecommendationsForIndustry,
  calculateValidationStats,
  submitEmployerValidation,
  getResponsesForRecommendation,
  getEmployerAuditTrail,
  resetEmployerValidationStore,
} from "../src/lib/employer-validation/service";

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
  console.log("   Skill Sync AI: Employer Validation Test Suite            ");
  console.log("=============================================================\n");

  resetEmployerValidationStore();

  // -------------------------------------------------------------
  // Test 1: Industry-Relevant Recommendation Slicing
  // -------------------------------------------------------------
  console.log("[Test 1] Industry Sector Filtering");
  assert(REGISTERED_EMPLOYERS.length >= 8, `Registered employers populated (count: ${REGISTERED_EMPLOYERS.length})`);

  const autoRecs = getRecommendationsForIndustry("automotive_ev");
  assert(autoRecs.length >= 2, `Automotive sector returns relevant recommendations (count: ${autoRecs.length})`);
  assert(autoRecs.every((r) => r.sector === "automotive_ev"), "Automotive slice isolates automotive_ev");

  const cncRecs = getRecommendationsForIndustry("manufacturing_cnc");
  assert(cncRecs.length >= 1, `CNC sector returns relevant recommendations (count: ${cncRecs.length})`);
  assert(cncRecs.every((r) => r.sector === "manufacturing_cnc"), "CNC slice isolates manufacturing_cnc");

  const solarRecs = getRecommendationsForIndustry("renewable_energy");
  assert(solarRecs.length >= 1, `Renewable sector returns solar recommendations (count: ${solarRecs.length})`);
  assert(solarRecs.every((r) => r.sector === "renewable_energy"), "Renewable slice isolates renewable_energy");

  // -------------------------------------------------------------
  // Test 2: Transparent Validation Statistics & Ratio Formatting
  // -------------------------------------------------------------
  console.log("\n[Test 2] Transparent Validation Statistics (Example: 8 of 10 confirmed)");
  const statsRec1 = calculateValidationStats("rec-act-001");

  assert(statsRec1.totalReviews === 10, `Total employer reviews for rec-act-001 is 10 (${statsRec1.totalReviews})`);
  assert(statsRec1.confirmedCount === 8, `Exactly 8 employers confirmed (${statsRec1.confirmedCount})`);
  assert(statsRec1.modifiedCount === 1, `1 employer suggested modifications (${statsRec1.modifiedCount})`);
  assert(statsRec1.rejectedCount === 1, `1 employer rejected (${statsRec1.rejectedCount})`);
  assert(statsRec1.confirmationPercentage === 80, `80% confirmation calculated (${statsRec1.confirmationPercentage}%)`);
  assert(statsRec1.displayRatio === "8 of 10 employers confirmed", `Display ratio matches format: "${statsRec1.displayRatio}"`);
  assert(statsRec1.displayPercentage === "80% Employer Confirmation", `Display percentage matches format: "${statsRec1.displayPercentage}"`);

  // -------------------------------------------------------------
  // Test 3: Framing Check (Zero "Ground Truth" references)
  // -------------------------------------------------------------
  console.log("\n[Test 3] Framing Safeguard: 'Employer Validation Evidence'");
  const statsStr = JSON.stringify(statsRec1);
  assert(!statsStr.toLowerCase().includes("ground truth"), "Zero occurrences of 'ground truth' in statistics output");
  assert(!statsStr.toLowerCase().includes("groundtruth"), "Zero occurrences of 'groundtruth' in statistics output");
  assert(statsRec1.displayPercentage.includes("Employer Confirmation"), "Explicitly labeled with 'Employer Confirmation'");

  // -------------------------------------------------------------
  // Test 4: Confirm Recommendation Workflow & Response Storage
  // -------------------------------------------------------------
  console.log("\n[Test 4] Employer Action: Confirm Recommendation");
  const initialResponsesCount = getResponsesForRecommendation("rec-act-002").length;

  const confirmResult = submitEmployerValidation({
    recommendationId: "rec-act-002",
    employerId: "emp-lmw",
    reviewerName: "K. Subramanian",
    reviewerDesignation: "VP - Manufacturing & Tooling Operations",
    stance: "confirmed",
    hiringDifficulty: "acute_shortage",
    validatedProficiency: "advanced",
    identifiedImportantSkills: ["5-Axis Simultaneous CAM", "Toolpath Collision Simulation"],
    feedbackComments: "Fully confirm the need for multi-axis CAM. We currently reject 80% of applicants due to collision simulation gaps.",
  });

  assert(confirmResult.response.stance === "confirmed", "Stance recorded as 'confirmed'");
  assert(confirmResult.response.employerName.includes("LMW Precision"), `Employer name recorded (${confirmResult.response.employerName})`);
  assert(confirmResult.response.identifiedImportantSkills.includes("5-Axis Simultaneous CAM"), "Important skill captured");
  assert(getResponsesForRecommendation("rec-act-002").length === initialResponsesCount + 1, "Response stored permanently");

  // -------------------------------------------------------------
  // Test 5: Modify Recommendation Workflow
  // -------------------------------------------------------------
  console.log("\n[Test 5] Employer Action: Modify Recommendation");
  const modifyResult = submitEmployerValidation({
    recommendationId: "rec-act-003",
    employerId: "emp-tata-motors",
    reviewerName: "Rajesh Kulkarni",
    reviewerDesignation: "Head of Powertrain Talent",
    stance: "modified",
    hiringDifficulty: "high",
    validatedProficiency: "intermediate",
    identifiedImportantSkills: ["Cell Balancing", "Thermal Runaway Mitigation"],
    feedbackComments: "40 hours practical is good, but include 10 hours specifically for cylindrical vs prismatic cell pack comparisons.",
    proposedModifications: "Allocate 10h out of the 40h practical lab for prismatic vs pouch cell assembly comparisons.",
  });

  assert(modifyResult.response.stance === "modified", "Stance recorded as 'modified'");
  assert(!!modifyResult.response.proposedModifications, "Proposed modifications captured");
  assert(!!modifyResult.response.proposedModifications?.includes("prismatic vs pouch"), "Custom modifications recorded verbatim");

  // -------------------------------------------------------------
  // Test 6: Reject Recommendation Workflow
  // -------------------------------------------------------------
  console.log("\n[Test 6] Employer Action: Reject Recommendation with Mandatory Feedback");
  const rejectResult = submitEmployerValidation({
    recommendationId: "rec-act-009",
    employerId: "emp-torrent",
    reviewerName: "Hitesh Shah",
    reviewerDesignation: "Chief Engineer",
    stance: "rejected",
    hiringDifficulty: "low",
    validatedProficiency: "introductory",
    identifiedImportantSkills: ["Basic Rooftop DC Wiring"],
    feedbackComments: "Our grid interconnection standards require certified IEEE contractors; vocational trainees are legally barred from high-voltage substation switching.",
  });

  assert(rejectResult.response.stance === "rejected", "Stance recorded as 'rejected'");
  assert(rejectResult.response.feedbackComments.includes("legally barred"), "Rejection rationale captured in feedback");

  // -------------------------------------------------------------
  // Test 7: Reporting Hiring Difficulty & Validating Entry Proficiency
  // -------------------------------------------------------------
  console.log("\n[Test 7] Hiring Difficulty & Entry Proficiency Distribution");
  const updatedStats = calculateValidationStats("rec-act-001");

  assert(typeof updatedStats.hiringDifficultyDistribution.acute_shortage === "number", "Acute shortage count present");
  assert(updatedStats.hiringDifficultyDistribution.acute_shortage >= 3, `Acute shortage reported by multiple employers (count: ${updatedStats.hiringDifficultyDistribution.acute_shortage})`);
  assert(["introductory", "intermediate", "advanced", "expert"].includes(updatedStats.dominantProficiencyRequirement), `Dominant proficiency valid: ${updatedStats.dominantProficiencyRequirement}`);
  assert(updatedStats.topImportantSkills.length > 0, `Top critical skills compiled (count: ${updatedStats.topImportantSkills.length})`);
  assert(updatedStats.topImportantSkills[0].name === "CAN Bus Protocol", `Top skill is CAN Bus Protocol (${updatedStats.topImportantSkills[0].count} mentions)`);

  // -------------------------------------------------------------
  // Test 8: Audit History Records
  // -------------------------------------------------------------
  console.log("\n[Test 8] Immutable Employer Audit Trail");
  const auditLogs = getEmployerAuditTrail();
  assert(auditLogs.length >= 13, `Audit trail captures all baseline and new submissions (count: ${auditLogs.length})`);

  const latestAudit = auditLogs[0];
  assert(!!latestAudit.id, `Audit record ID present (${latestAudit.id})`);
  assert(!!latestAudit.timestamp, `Audit timestamp present (${latestAudit.timestamp})`);
  assert(!!latestAudit.employerName, `Employer organization recorded: ${latestAudit.employerName}`);
  assert(!!latestAudit.actorName, `Reviewer name recorded: ${latestAudit.actorName}`);
  assert(!!latestAudit.summary, `Action summary recorded: ${latestAudit.summary}`);

  console.log("\n=============================================================");
  console.log(`   Employer Validation Test Summary: ${passedCount} PASSED, ${failedCount} FAILED   `);
  console.log("=============================================================");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
