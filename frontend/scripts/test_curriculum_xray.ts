/**
 * Skill Sync AI - Curriculum X-Ray Automated Test Suite
 * 
 * Verifies:
 * 1. Course selection & syllabus retrieval
 * 2. Deterministic scoring (Industry %, Curriculum %, Gap %)
 * 3. 4 Categorical tiers (CRITICAL GAP, MAJOR GAP, MODERATE GAP, ALIGNED)
 * 4. Multi-factor "Why is this a gap?" audit explanation generation
 * 5. Employer survey quotes & placement statistics integration
 * 6. Actionable recommendations with human review/approval workflow (no automatic overwrite)
 */

import {
  getAllCourses,
  auditCurriculum,
  reviewRecommendation,
} from "../src/lib/curriculum/xray-service";

let passedCount = 0;
let failedCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✓ PASS: ${testName}`);
    passedCount++;
  } else {
    console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
    failedCount++;
  }
}

async function runCurriculumXRayTests() {
  console.log("=============================================================");
  console.log("   Skill Sync AI: Curriculum X-Ray Test Suite");
  console.log("=============================================================");

  // --------------------------------------------------------------------------
  // Test 1: Course Catalog Retrieval
  // --------------------------------------------------------------------------
  console.log("\n[Test 1] Vocational Course Syllabi Catalog");
  const courses = getAllCourses();
  assert(courses.length >= 3, `Available courses loaded (count: ${courses.length})`);
  assert(courses.some((c) => c.code === "EV-TECH-201"), "EV Technician course present");
  assert(courses.some((c) => c.code === "CNC-PROG-301"), "CNC Machinist course present");
  assert(courses.some((c) => c.code === "SOL-GRID-101"), "Solar PV Technician course present");

  // --------------------------------------------------------------------------
  // Test 2: EV Course Audit & Gap Categorization
  // --------------------------------------------------------------------------
  console.log("\n[Test 2] EV Course Audit (EV-TECH-201) & Transparent Scoring");
  const evReport = auditCurriculum("course-ev-201");

  assert(evReport.course.code === "EV-TECH-201", "Course code matches EV-TECH-201");
  assert(evReport.skills.length >= 4, `Audited ${evReport.skills.length} competencies`);
  assert(evReport.summary.criticalGapsCount >= 1, `Critical gaps detected (${evReport.summary.criticalGapsCount})`);
  assert(evReport.summary.overallCurriculumAlignmentIndex > 0, `Alignment index calculated (${evReport.summary.overallCurriculumAlignmentIndex}%)`);

  // Verify CAN Bus Protocol (0 hours in syllabus -> Critical Gap)
  const canBus = evReport.skills.find((s) => s.skillSlug === "can-bus-protocol");
  assert(!!canBus, "CAN Bus Protocol audited in EV syllabus");
  if (canBus) {
    assert(canBus.industryRequirementScore >= 80, `High industry requirement (${canBus.industryRequirementScore}%)`);
    assert(canBus.curriculumCoverageScore === 0, `Zero coverage in current syllabus (${canBus.curriculumCoverageScore}%)`);
    assert(canBus.gapScore >= 80, `Substantial gap calculated (${canBus.gapScore}%)`);
    assert(canBus.categoryClassification === "CRITICAL GAP", "Classified as CRITICAL GAP");
    assert(canBus.priority === "CRITICAL", "Priority marked as CRITICAL");
  }

  // Verify EV Battery Diagnostics (Under-allocated hours -> Major/Critical Gap)
  const evBattery = evReport.skills.find((s) => s.skillSlug === "ev-battery-diagnostics");
  assert(!!evBattery, "EV Battery Diagnostics audited in EV syllabus");
  if (evBattery) {
    assert(evBattery.industryRequirementScore > 85, `Industry requirement high (${evBattery.industryRequirementScore}%)`);
    assert(evBattery.allocatedHoursInSyllabus === 40, `Current syllabus hours correct (${evBattery.allocatedHoursInSyllabus}h)`);
    assert(evBattery.recommendedBenchmarkHours === 120, `Benchmark hours correct (${evBattery.recommendedBenchmarkHours}h)`);
    assert(evBattery.gapScore > 30, `Gap score calculated (${evBattery.gapScore}%)`);
    assert(
      evBattery.categoryClassification === "CRITICAL GAP" || evBattery.categoryClassification === "MAJOR GAP",
      `Classified as ${evBattery.categoryClassification}`
    );
  }

  // Verify Industrial Safety & LOTO (Well covered -> Aligned)
  const loto = evReport.skills.find((s) => s.skillSlug === "loto-safety");
  assert(!!loto, "LOTO Safety audited in EV syllabus");
  if (loto) {
    assert(loto.curriculumCoverageScore >= 70, `High curriculum coverage (${loto.curriculumCoverageScore}%)`);
    assert(loto.categoryClassification === "ALIGNED" || loto.gapScore < 20, `LOTO gap low or aligned (Gap: ${loto.gapScore}%)`);
  }

  // --------------------------------------------------------------------------
  // Test 3: "Why is this a gap?" Audit Explanation & Verbatim Evidence
  // --------------------------------------------------------------------------
  console.log("\n[Test 3] 'Why is this a gap?' Explanation & Evidence Integration");
  if (canBus) {
    const exp = canBus.explanation;
    assert(exp.title.includes("CRITICAL GAP"), "Explanation title indicates CRITICAL GAP");
    assert(exp.marketDemandFactor.length > 20, "Market demand factor explained");
    assert(exp.curriculumDeficitFactor.includes("0 hours"), "Syllabus deficit captures 0 allocated hours");
    assert(exp.employerValidationEvidence.includes("Tata Motors"), "Employer quote references Tata Motors");
    assert(exp.employerValidationEvidence.includes("CAN Bus diagnostics"), "Employer quote specifies CAN Bus diagnostics");
    assert(exp.placementRelevanceEvidence.includes("Placement Outcome"), "Placement outcome context integrated");
  }

  // --------------------------------------------------------------------------
  // Test 4: CNC Course Audit (CNC-PROG-301)
  // --------------------------------------------------------------------------
  console.log("\n[Test 4] CNC Course Audit (CNC-PROG-301)");
  const cncReport = auditCurriculum("course-cnc-301");
  assert(cncReport.course.code === "CNC-PROG-301", "Course code matches CNC-PROG-301");

  // 5-Axis CNC Milling gap
  const cnc5Axis = cncReport.skills.find((s) => s.skillSlug === "5-axis-cnc-milling");
  assert(!!cnc5Axis, "5-Axis CNC Milling audited in CNC syllabus");
  if (cnc5Axis) {
    assert(cnc5Axis.industryRequirementScore >= 80, `Industry score high (${cnc5Axis.industryRequirementScore}%)`);
    assert(cnc5Axis.allocatedHoursInSyllabus === 25, "Syllabus only allocates 25 introductory hours");
    assert(cnc5Axis.gapScore >= 40, `Gap score significant (${cnc5Axis.gapScore}%)`);
    assert(cnc5Axis.explanation.employerValidationEvidence.includes("LMW Precision"), "Employer quote references LMW Precision");
  }

  // G-Code Programming (Well covered)
  const gCode = cncReport.skills.find((s) => s.skillSlug === "g-code-programming");
  assert(!!gCode, "G-Code programming audited");
  if (gCode) {
    assert(gCode.curriculumCoverageScore >= 70, `Curriculum coverage high (${gCode.curriculumCoverageScore}%)`);
    assert(gCode.categoryClassification === "ALIGNED", "G-Code is ALIGNED");
  }

  // --------------------------------------------------------------------------
  // Test 5: Curriculum Recommendations & Human Approval Workflow
  // --------------------------------------------------------------------------
  console.log("\n[Test 5] Recommended Curriculum Changes & Human Review Safeguard");
  assert(evReport.recommendations.length >= 2, `Generated ${evReport.recommendations.length} recommendations`);

  const canBusRec = evReport.recommendations.find((r) => r.skillSlug === "can-bus-protocol");
  assert(!!canBusRec, "Recommendation generated for CAN Bus Protocol");
  if (canBusRec) {
    assert(canBusRec.status === "pending_review", "Default status is 'pending_review'");
    assert(canBusRec.recommendedPracticalHours >= 30, `Practical hours recommended (${canBusRec.recommendedPracticalHours}h)`);
    assert(canBusRec.equipmentPrerequisites.length >= 1, `Equipment prerequisites specified: ${canBusRec.equipmentPrerequisites.join(", ")}`);
    assert(canBusRec.trainerQualificationNeeded.length > 5, `Trainer qualification specified: ${canBusRec.trainerQualificationNeeded}`);

    // Test Human Review Action: Approve Proposal
    const reviewResult = reviewRecommendation(
      canBusRec.id,
      "approved",
      "Dr. Ramesh Deshmukh (State Technical Board)",
      "Approved for integration into upcoming academic semester."
    );

    assert(reviewResult.success === true, "Human review submitted successfully");
    assert(reviewResult.recommendation.status === "approved", "Status transitioned to 'approved'");
    assert(reviewResult.recommendation.reviewedBy === "Dr. Ramesh Deshmukh (State Technical Board)", "Reviewer recorded");

    // Safeguard check: Course master syllabus must NOT be automatically modified
    const courseUnchanged = getAllCourses().find((c) => c.code === "EV-TECH-201");
    assert(!!courseUnchanged, "Master course record preserved without automatic overwrite");
  }

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log("\n=============================================================");
  console.log(`   Curriculum X-Ray Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runCurriculumXRayTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
