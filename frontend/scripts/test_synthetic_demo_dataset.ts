/**
 * Skill Sync AI: Synthetic Demonstration Dataset Verification Test Suite
 * Validates internal consistency, relational integrity, coverage of high/stable/declining skills,
 * gaps (curriculum, trainer, equipment, capacity), and synthetic labeling compliance.
 */

import fs from "fs";
import path from "path";

const DATASET_DIR = path.resolve(__dirname, "../../data/synthetic_demo_dataset");
const JSON_BUNDLE_PATH = path.join(DATASET_DIR, "synthetic_demo_dataset.json");
const README_PATH = path.join(DATASET_DIR, "README.md");

const REQUIRED_CSV_FILES = [
  "districts.csv",
  "employers.csv",
  "skills.csv",
  "courses.csv",
  "curriculum.csv",
  "trainers.csv",
  "equipment.csv",
  "job_postings.csv",
  "placements.csv",
  "employer_surveys.csv",
];

const REQUIRED_DISCLAIMER = "Synthetic Demo Data — for demonstration only.";

let passCount = 0;
let failCount = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  if (condition) {
    console.log(`  ✅ PASS: ${testName}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${testName} ${detail ? `(${detail})` : ""}`);
    failCount++;
  }
}

function parseCsv(filepath: string): Record<string, string>[] {
  const content = fs.readFileSync(filepath, "utf-8");
  const lines = content.split("\n").filter((line) => line.trim().length > 0 && !line.trim().startsWith("#"));
  if (lines.length < 2) return [];

  const headers = lines[0].split(",").map((h) => h.trim());
  const rows: Record<string, string>[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    // Simple CSV row parser taking quotes into account
    const values: string[] = [];
    let current = "";
    let inQuotes = false;

    for (let c = 0; c < line.length; c++) {
      const char = line[c];
      if (char === '"' || char === "'") {
        inQuotes = !inQuotes;
      } else if (char === "," && !inQuotes) {
        values.push(current.trim());
        current = "";
      } else {
        current += char;
      }
    }
    values.push(current.trim());

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || "";
    });
    rows.push(row);
  }

  return rows;
}

async function runTests() {
  console.log("================================================================");
  console.log(" Skill Sync AI: Synthetic Demonstration Dataset Test Suite");
  console.log("================================================================\n");

  // 1. Files & Disclaimers Check
  console.log("Test Group 1: Dataset Files & Synthetic Disclaimers");
  assert(fs.existsSync(DATASET_DIR), "Dataset directory exists", DATASET_DIR);
  assert(fs.existsSync(JSON_BUNDLE_PATH), "Consolidated JSON bundle exists");
  assert(fs.existsSync(README_PATH), "README documentation exists");

  const readmeContent = fs.readFileSync(README_PATH, "utf-8");
  assert(readmeContent.includes(REQUIRED_DISCLAIMER), "README includes mandatory disclaimer banner");

  REQUIRED_CSV_FILES.forEach((filename) => {
    const fullPath = path.join(DATASET_DIR, filename);
    const exists = fs.existsSync(fullPath);
    assert(exists, `File ${filename} exists`);
    if (exists) {
      const fileContent = fs.readFileSync(fullPath, "utf-8");
      assert(fileContent.includes(REQUIRED_DISCLAIMER), `${filename} includes mandatory synthetic disclaimer comment`);
    }
  });

  // 2. Load Parsed Records
  const districts = parseCsv(path.join(DATASET_DIR, "districts.csv"));
  const employers = parseCsv(path.join(DATASET_DIR, "employers.csv"));
  const skills = parseCsv(path.join(DATASET_DIR, "skills.csv"));
  const courses = parseCsv(path.join(DATASET_DIR, "courses.csv"));
  const curriculum = parseCsv(path.join(DATASET_DIR, "curriculum.csv"));
  const trainers = parseCsv(path.join(DATASET_DIR, "trainers.csv"));
  const equipment = parseCsv(path.join(DATASET_DIR, "equipment.csv"));
  const jobPostings = parseCsv(path.join(DATASET_DIR, "job_postings.csv"));
  const placements = parseCsv(path.join(DATASET_DIR, "placements.csv"));
  const employerSurveys = parseCsv(path.join(DATASET_DIR, "employer_surveys.csv"));

  console.log("\nTest Group 2: Volume & Entity Sanity");
  assert(districts.length >= 5, `Districts volume is sufficient (Found: ${districts.length})`);
  assert(employers.length >= 10, `Employers volume is sufficient (Found: ${employers.length})`);
  assert(skills.length >= 15, `Skills taxonomy volume is sufficient (Found: ${skills.length})`);
  assert(courses.length >= 5, `Courses volume is sufficient (Found: ${courses.length})`);
  assert(curriculum.length >= 10, `Curriculum modules volume is sufficient (Found: ${curriculum.length})`);
  assert(trainers.length >= 7, `Trainers volume is sufficient (Found: ${trainers.length})`);
  assert(equipment.length >= 10, `Equipment inventory volume is sufficient (Found: ${equipment.length})`);
  assert(jobPostings.length >= 10, `Job postings volume is sufficient (Found: ${jobPostings.length})`);
  assert(placements.length >= 10, `Placements volume is sufficient (Found: ${placements.length})`);
  assert(employerSurveys.length >= 5, `Employer surveys volume is sufficient (Found: ${employerSurveys.length})`);

  // 3. Referential Consistency Tests
  console.log("\nTest Group 3: Interconnected Relational Integrity");
  const validDistrictNames = new Set(districts.map((d) => d.name));
  const validEmployerNames = new Set(employers.map((e) => e.company_name));
  const validCourseCodes = new Set(courses.map((c) => c.course_code));
  const validSkillNames = new Set(skills.map((s) => s.name));
  const validCenterCodes = new Set(courses.map((c) => c.training_center_code));

  // Employers -> Districts
  let allEmployersValidDistrict = true;
  employers.forEach((emp) => {
    if (!validDistrictNames.has(emp.district)) {
      allEmployersValidDistrict = false;
    }
  });
  assert(allEmployersValidDistrict, "All employers belong to valid, registered districts");

  // Job Postings -> Employers & Districts
  let allJobPostingsValidEmployer = true;
  let allJobPostingsValidDistrict = true;
  jobPostings.forEach((job) => {
    if (!validEmployerNames.has(job.company_name)) allJobPostingsValidEmployer = false;
    if (!validDistrictNames.has(job.district)) allJobPostingsValidDistrict = false;
  });
  assert(allJobPostingsValidEmployer, "All job postings reference registered employers");
  assert(allJobPostingsValidDistrict, "All job postings reference registered districts");

  // Courses -> Centers
  let allTrainersValidCenter = true;
  trainers.forEach((tr) => {
    if (!validCenterCodes.has(tr.training_center_code)) allTrainersValidCenter = false;
  });
  assert(allTrainersValidCenter, "All trainers belong to registered training centers");

  // Equipment -> Centers
  let allEquipmentValidCenter = true;
  equipment.forEach((eq) => {
    if (!validCenterCodes.has(eq.training_center_code)) allEquipmentValidCenter = false;
  });
  assert(allEquipmentValidCenter, "All equipment units belong to registered training centers");

  // Curriculum -> Courses
  let allCurriculumValidCourse = true;
  curriculum.forEach((mod) => {
    if (!validCourseCodes.has(mod.course_code)) allCurriculumValidCourse = false;
  });
  assert(allCurriculumValidCourse, "All curriculum modules reference registered courses");

  // Placements -> Courses
  let allPlacementsValidCourse = true;
  let allPlacementsValidMath = true;
  placements.forEach((pl) => {
    if (!validCourseCodes.has(pl.course_code)) allPlacementsValidCourse = false;
    const total = Number(pl.total_graduates);
    const placed = Number(pl.placed_graduates);
    if (placed > total || placed < 0) allPlacementsValidMath = false;
  });
  assert(allPlacementsValidCourse, "All placement records reference registered courses");
  assert(allPlacementsValidMath, "All placement graduate counts satisfy (placed <= total)");

  // Equipment Operational Math
  let allEquipmentValidMath = true;
  equipment.forEach((eq) => {
    const total = Number(eq.quantity_total);
    const op = Number(eq.quantity_operational);
    if (op > total || op < 0) allEquipmentValidMath = false;
  });
  assert(allEquipmentValidMath, "All equipment inventories satisfy (operational <= total)");

  // 4. Skills Taxonomy Coverage
  console.log("\nTest Group 4: High Demand, Stable, and Declining Skills Coverage");
  const highDemandSkills = skills.filter((s) => s.demand_status === "high_demand");
  const stableSkills = skills.filter((s) => s.demand_status === "stable");
  const decliningSkills = skills.filter((s) => s.demand_status === "declining");

  assert(highDemandSkills.length >= 6, `High-demand skills represented (Count: ${highDemandSkills.length})`);
  assert(stableSkills.length >= 5, `Stable skills represented (Count: ${stableSkills.length})`);
  assert(decliningSkills.length >= 3, `Declining/low-demand skills represented (Count: ${decliningSkills.length})`);

  const hasRobotics = skills.some((s) => s.name.includes("Robotics"));
  const hasEvBattery = skills.some((s) => s.name.includes("EV Battery"));
  const hasCarburetor = skills.some((s) => s.name.includes("Carburetor"));
  assert(hasRobotics, "Robotics skill exists in taxonomy");
  assert(hasEvBattery, "EV Battery Diagnostics skill exists in taxonomy");
  assert(hasCarburetor, "Declining Carburetor skill exists in taxonomy");

  // 5. Gap Realism Verification
  console.log("\nTest Group 5: Gap Scenarios Verification");

  // Curriculum Gap: EV Course missing CAN Bus
  const evModules = curriculum.filter((m) => m.course_code === "EV-TECH-201");
  const evTeachesCanBus = evModules.some((m) => m.skills_covered.includes("Automotive CAN Bus Protocol"));
  assert(!evTeachesCanBus, "Verified Curriculum Gap: EV-TECH-201 syllabus does NOT teach Automotive CAN Bus Protocol");

  // Trainer Gap: Trainers lacking certification
  const puneTrainers = trainers.filter((t) => t.training_center_code === "ITI-MH-PUN-01");
  const puneTrainerHasCanBus = puneTrainers.some((t) => t.skills.includes("Automotive CAN Bus Protocol"));
  assert(!puneTrainerHasCanBus, "Verified Trainer Gap: No trainer at ITI Pune has certified CAN Bus competency");

  // Equipment Gap: Needs Maintenance or Non-Operational
  const faultyEquipment = equipment.filter((eq) => eq.condition_rating === "needs_maintenance" || eq.condition_rating === "non_operational");
  assert(faultyEquipment.length >= 3, `Verified Equipment Gaps: Faulty or down machinery identified (Count: ${faultyEquipment.length})`);

  // Capacity Gap: ROB-CNC-301 capacity vs Robotics job vacancies
  const robCourse = courses.find((c) => c.course_code === "ROB-CNC-301");
  const roboticsJobs = jobPostings.filter((j) => j.title.includes("Robotics") || j.raw_description.includes("Robotics"));
  const totalRoboticsVacancies = roboticsJobs.reduce((acc, j) => acc + Number(j.vacancies), 0);
  assert(
    robCourse !== undefined && totalRoboticsVacancies > Number(robCourse.annual_capacity) * 0.5,
    `Verified Capacity Gap: Robotics vacancies (${totalRoboticsVacancies}) severely constrain course capacity (${robCourse?.annual_capacity})`
  );

  // Declining Course Placement
  const legacyPlacements = placements.filter((p) => p.course_code === "ENG-LEG-101");
  const recentLegacy = legacyPlacements.find((p) => p.batch_year === "2025");
  const legacyPlacementRate = recentLegacy ? (Number(recentLegacy.placed_graduates) / Number(recentLegacy.total_graduates)) * 100 : 100;
  assert(
    legacyPlacementRate < 40,
    `Verified Declining Trade: Legacy Carburetor placement rate has collapsed to ${legacyPlacementRate.toFixed(1)}% (< 40%)`
  );

  // 6. JSON Bundle Consistency
  console.log("\nTest Group 6: JSON Bundle Integrity");
  const jsonRaw = fs.readFileSync(JSON_BUNDLE_PATH, "utf-8");
  const parsedJson = JSON.parse(jsonRaw);
  assert(parsedJson.dataset_metadata !== undefined, "JSON bundle contains dataset_metadata");
  assert(parsedJson.dataset_metadata.disclaimer === REQUIRED_DISCLAIMER, "JSON bundle has exact required disclaimer");
  assert(Array.isArray(parsedJson.skills) && parsedJson.skills.length === skills.length, "JSON skills match CSV volume");
  assert(Array.isArray(parsedJson.courses) && parsedJson.courses.length === courses.length, "JSON courses match CSV volume");
  assert(Array.isArray(parsedJson.equipment) && parsedJson.equipment.length === equipment.length, "JSON equipment match CSV volume");

  console.log("\n================================================================");
  console.log(` SYNTHETIC DATASET TEST SUMMARY: ${passCount} PASSED, ${failCount} FAILED`);
  console.log("================================================================\n");

  if (failCount > 0) {
    process.exit(1);
  } else {
    console.log("🎉 ALL SYNTHETIC DEMONSTRATION DATASET TESTS PASSED CLEANLY!");
  }
}

runTests();
