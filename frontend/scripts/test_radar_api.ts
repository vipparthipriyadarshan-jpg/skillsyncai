/**
 * Skill Sync AI - Skill Demand Radar Automated Test Suite
 * 
 * Verifies all 10 core features:
 * 1. Emerging skills (velocity >= 25% across multi-employers)
 * 2. Growing skills (10% to 25%)
 * 3. Stable skills (-10% to 10%)
 * 4. Declining skills (< -10%)
 * 5. Demand percentage calculations
 * 6. Job posting count calculations
 * 7. Trend chart time-series data
 * 8. District filter (Pune, Coimbatore, Ahmedabad, etc.)
 * 9. Industry filter (automotive_ev, manufacturing_cnc, renewable_energy, etc.)
 * 10. Time-range filter (30d, 90d, 180d, all)
 * 
 * Verifies Skill Profile inspection:
 * - demand, trend, roles, industries, districts, proficiency,
 *   related skills, supporting job postings with verbatim evidence, and confidence.
 */

import { getSkillRadarData, getSkillProfile } from "../src/lib/analytics/radar-service";

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

async function runRadarTests() {
  console.log("=============================================================");
  console.log("   Skill Sync AI: Skill Demand Radar Test Suite");
  console.log("=============================================================\n");

  // --------------------------------------------------------------------------
  // Test 1: Full Radar Overview & Trajectory Categorization
  // --------------------------------------------------------------------------
  console.log("[Test 1] Radar Overview & Trajectory Breakdown");
  const radarData = getSkillRadarData();

  assert(radarData.kpis.totalVacancies > 100, `Total vacancy demand calculated (${radarData.kpis.totalVacancies})`);
  assert(radarData.kpis.totalPostings > 10, `Total job listings counted (${radarData.kpis.totalPostings})`);
  assert(radarData.kpis.emergingCount >= 2, `Emerging skills identified (${radarData.kpis.emergingCount})`);
  assert(radarData.kpis.growingCount >= 1, `Growing skills identified (${radarData.kpis.growingCount})`);
  assert(radarData.kpis.stableCount >= 1, `Stable skills identified (${radarData.kpis.stableCount})`);
  assert(radarData.kpis.decliningCount >= 1, `Declining skills identified (${radarData.kpis.decliningCount})`);

  // Verify EV Battery Diagnostics is emerging
  const evBattery = radarData.skills.find((s) => s.slug === "ev-battery-diagnostics");
  assert(!!evBattery, "EV Battery Diagnostics present in radar");
  if (evBattery) {
    assert(evBattery.trajectory === "emerging", "EV Battery Diagnostics trajectory is 'emerging'");
    assert(evBattery.isEmergingCandidate === true, "EV Battery Diagnostics is marked as emerging candidate");
    assert(evBattery.uniqueEmployers >= 2, `Distributed across multiple employers (${evBattery.uniqueEmployers})`);
    assert(evBattery.growthRate > 50.0, `High growth rate (+${evBattery.growthRate}%)`);
    assert(evBattery.demandPercentage > 0, `Demand percentage calculated (${evBattery.demandPercentage}%)`);
    assert(evBattery.postingCount >= 3, `Posting count calculated (${evBattery.postingCount})`);
  }

  // Verify Carburetor Tuning is declining
  const carburetor = radarData.skills.find((s) => s.slug === "carburetor-tuning");
  assert(!!carburetor, "Carburetor Tuning present in radar");
  if (carburetor) {
    assert(carburetor.trajectory === "declining", "Carburetor Tuning trajectory is 'declining'");
    assert(carburetor.growthRate < -10.0, `Negative growth rate (${carburetor.growthRate}%)`);
    assert(carburetor.declineRate > 10.0, `Decline magnitude calculated (${carburetor.declineRate}%)`);
  }

  // Verify SMAW Welding is stable
  const smaw = radarData.skills.find((s) => s.slug === "smaw-welding");
  assert(!!smaw, "SMAW Welding present in radar");
  if (smaw) {
    assert(smaw.trajectory === "stable", "SMAW Welding trajectory is 'stable'");
    assert(smaw.growthRate === 0.0, `Zero growth fluctuation (${smaw.growthRate}%)`);
  }

  // --------------------------------------------------------------------------
  // Test 2: Dimensional Filtering (District Filter)
  // --------------------------------------------------------------------------
  console.log("\n[Test 2] District Filter (Pune vs Coimbatore)");
  const puneData = getSkillRadarData({ district: "Pune" });
  assert(
    puneData.skills.every((s) => s.topDistrict === "Pune" || s.topDistrict === "Multiple"),
    "Pune filter isolates Pune-demanded competencies"
  );
  assert(
    puneData.skills.some((s) => s.slug === "ev-battery-diagnostics"),
    "EV battery diagnostics high in Pune"
  );
  assert(
    !puneData.skills.some((s) => s.slug === "5-axis-cnc-milling" && s.topDistrict === "Coimbatore"),
    "Coimbatore-exclusive CNC milling filtered out from Pune view"
  );

  const cbeData = getSkillRadarData({ district: "Coimbatore" });
  assert(
    cbeData.skills.some((s) => s.slug === "5-axis-cnc-milling"),
    "Coimbatore filter captures 5-Axis CNC Milling"
  );

  // --------------------------------------------------------------------------
  // Test 3: Industry Filter (automotive_ev vs renewable_energy)
  // --------------------------------------------------------------------------
  console.log("\n[Test 3] Industry Filter");
  const evIndustryData = getSkillRadarData({ industry: "automotive_ev" });
  assert(
    evIndustryData.skills.some((s) => s.slug === "ev-battery-diagnostics"),
    "Automotive EV industry contains EV Battery Diagnostics"
  );
  assert(
    evIndustryData.skills.some((s) => s.slug === "bms-configuration"),
    "Automotive EV industry contains BMS Configuration"
  );
  assert(
    !evIndustryData.skills.some((s) => s.slug === "solar-pv-installation"),
    "Solar PV Installation excluded from automotive_ev filter"
  );

  const solarData = getSkillRadarData({ industry: "renewable_energy" });
  assert(
    solarData.skills.some((s) => s.slug === "grid-tie-inverter-sizing"),
    "Renewable Energy industry captures Solar Inverter Sizing"
  );

  // --------------------------------------------------------------------------
  // Test 4: Time Range Filter (30d vs 180d)
  // --------------------------------------------------------------------------
  console.log("\n[Test 4] Time Range Filter");
  const recent30d = getSkillRadarData({ timeRange: "30d" });
  const allTime = getSkillRadarData({ timeRange: "all" });

  assert(
    recent30d.metadata.population.totalPostings <= allTime.metadata.population.totalPostings,
    "30-day time window contains subset of total postings"
  );
  assert(
    recent30d.metadata.population.totalVacancies <= allTime.metadata.population.totalVacancies,
    "30-day time window contains subset of total vacancies"
  );

  // --------------------------------------------------------------------------
  // Test 5: Trajectory Filter Tabs (Emerging Only vs Declining Only)
  // --------------------------------------------------------------------------
  console.log("\n[Test 5] Trajectory Tab Filters");
  const emergingOnly = getSkillRadarData({ trajectory: "emerging" });
  assert(
    emergingOnly.skills.every((s) => s.trajectory === "emerging"),
    "Emerging tab returns exclusively emerging skills"
  );

  const decliningOnly = getSkillRadarData({ trajectory: "declining" });
  assert(
    decliningOnly.skills.every((s) => s.trajectory === "declining"),
    "Declining tab returns exclusively declining skills"
  );

  // --------------------------------------------------------------------------
  // Test 6: Skill Profile Modal Inspection
  // --------------------------------------------------------------------------
  console.log("\n[Test 6] Skill Profile Modal Data Inspection");
  const evProfile = getSkillProfile("ev-battery-diagnostics");
  assert(!!evProfile, "Skill Profile retrieved successfully for 'ev-battery-diagnostics'");

  if (evProfile) {
    // 1. Demand & Trajectory
    assert(evProfile.totalVacancies >= 40, `Total vacancies populated (${evProfile.totalVacancies})`);
    assert(evProfile.demandPercentage > 0, `Demand percentage populated (${evProfile.demandPercentage}%)`);
    assert(evProfile.trajectory === "emerging", "Profile trajectory is emerging");
    assert(evProfile.uniqueEmployers >= 3, `Multiple hiring employers (${evProfile.uniqueEmployers})`);

    // 2. Trend History
    assert(evProfile.trendHistory.length >= 6, `Trend timeline points generated (${evProfile.trendHistory.length} months)`);
    assert(evProfile.trendHistory.some((t) => t.vacancies > 0), "Trend timeline has non-zero observations");

    // 3. District Breakdown
    assert(evProfile.districtBreakdown.length >= 2, `District distribution populated (${evProfile.districtBreakdown.length} districts)`);
    assert(evProfile.districtBreakdown.some((d) => d.district === "Pune"), "Pune is primary district for EV");

    // 4. Industry Breakdown
    assert(evProfile.industryBreakdown.length >= 1, "Industry breakdown populated");
    assert(evProfile.industryBreakdown[0].industry === "automotive_ev", "Top industry is automotive_ev");

    // 5. Roles
    assert(evProfile.roleBreakdown.length >= 1, "Target occupational roles populated");
    assert(evProfile.roleBreakdown.some((r) => r.role === "EV Battery Diagnostic Technician"), "EV role found");

    // 6. Proficiency Breakdown
    assert(evProfile.proficiencyBreakdown.advanced > 0, "Advanced proficiency tier populated");
    assert(evProfile.proficiencyBreakdown.intermediate > 0, "Intermediate proficiency tier populated");
    assert(!!evProfile.proficiencyBreakdown.dominant, `Dominant tier identified (${evProfile.proficiencyBreakdown.dominant})`);

    // 7. Related Skills
    assert(evProfile.relatedSkills.length >= 1, "Related / co-occurring skills identified");
    assert(
      evProfile.relatedSkills.some((rs) => rs.slug === "bms-configuration" || rs.slug === "can-bus-protocol"),
      "BMS or CAN Bus identified as co-occurring skill"
    );

    // 8. Supporting Job Postings with Verbatim Evidence Quotes
    assert(evProfile.supportingJobPostings.length >= 3, `Supporting postings listed (${evProfile.supportingJobPostings.length} postings)`);
    const firstPosting = evProfile.supportingJobPostings[0];
    assert(firstPosting.evidenceQuote.length > 10, `Verbatim evidence quote present: "${firstPosting.evidenceQuote}"`);
    assert(firstPosting.confidenceScore >= 0.90, `Evidence confidence high (${firstPosting.confidenceScore})`);
    assert(firstPosting.company.length > 2, `Hiring company specified: ${firstPosting.company}`);
    assert(firstPosting.salaryRange.includes("₹"), `Salary range formatted: ${firstPosting.salaryRange}`);
  }

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log("\n=============================================================");
  console.log(`   Skill Demand Radar Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runRadarTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
