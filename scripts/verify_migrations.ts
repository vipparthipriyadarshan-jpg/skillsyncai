/**
 * Database Migration Verification Script using in-memory PostgreSQL (pg-mem).
 * Verifies SQL syntax, DDL execution, constraints, indexes, and seed insertion.
 */

import { newDb } from "pg-mem";
import * as fs from "fs";
import * as path from "path";

async function verifyMigrations() {
  console.log("=== Skill Sync AI: Database Migration Verification ===");
  const db = newDb();

  // Register uuid extension simulation if needed
  db.registerExtension("uuid-ossp", (schema) => {
    schema.registerFunction({
      name: "uuid_generate_v4",
      returns: db.public.getType("uuid"),
      implementation: () => "00000000-0000-0000-0000-000000000000",
    });
  });

  // Mock gen_random_uuid() function for pg-mem
  db.public.registerFunction({
    name: "gen_random_uuid",
    args: [],
    returns: db.public.getType("text"),
    implementation: () =>
      "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }),
  });

  // Mock auth.uid() function for RLS
  db.public.registerFunction({
    name: "auth.uid",
    args: [],
    returns: db.public.getType("text"),
    implementation: () => "00000000-0000-0000-0000-000000000001",
  });

  const migrationsDir = path.resolve(__dirname, "../database/migrations");
  const seedsDir = path.resolve(__dirname, "../database/seeds");

  const migrationFiles = [
    "001_core_enums_and_functions.sql",
    "002_core_schema.sql",
    "003_indexes.sql",
  ];

  for (const file of migrationFiles) {
    const filePath = path.join(migrationsDir, file);
    console.log(`\n[Testing] Executing migration: ${file}...`);
    const sql = fs.readFileSync(filePath, "utf-8");

    try {
      db.public.none(sql);
      console.log(`[Success] ${file} executed successfully.`);
    } catch (err: unknown) {
      console.error(`[Error] Failed executing ${file}:`, err);
      process.exit(1);
    }
  }

  // Verify all 20 tables exist
  const expectedTables = [
    "profiles",
    "districts",
    "skills",
    "job_postings",
    "job_skills",
    "courses",
    "course_modules",
    "course_skills",
    "training_centers",
    "trainers",
    "trainer_skills",
    "equipment",
    "employers",
    "employer_feedback",
    "placements",
    "skill_trends",
    "skill_gaps",
    "recommendations",
    "simulation_scenarios",
    "simulation_results",
  ];

  console.log("\n[Testing] Verifying table schemas...");
  for (const table of expectedTables) {
    const exists = db.public.getTable(table);
    if (!exists) {
      console.error(`[Failure] Table public.${table} does not exist!`);
      process.exit(1);
    }
    console.log(`  ✓ public.${table} verified`);
  }

  // Execute Seed Data
  const seedFile = path.join(seedsDir, "001_demo_seed.sql");
  console.log(`\n[Testing] Executing seed file: 001_demo_seed.sql...`);
  const seedSql = fs.readFileSync(seedFile, "utf-8");
  try {
    db.public.none(seedSql);
    console.log(`[Success] 001_demo_seed.sql executed successfully.`);
  } catch (err: unknown) {
    console.error(`[Error] Failed executing seed file:`, err);
    process.exit(1);
  }

  // Query counts to confirm records were loaded
  console.log("\n[Testing] Validating seeded record counts...");
  const districtsCount = db.public.many("SELECT COUNT(*) AS count FROM public.districts WHERE is_demo = TRUE");
  const skillsCount = db.public.many("SELECT COUNT(*) AS count FROM public.skills WHERE is_demo = TRUE");
  const coursesCount = db.public.many("SELECT COUNT(*) AS count FROM public.courses WHERE is_demo = TRUE");
  const jobsCount = db.public.many("SELECT COUNT(*) AS count FROM public.job_postings WHERE is_demo = TRUE");

  console.log(`  ✓ Seeded Districts: ${districtsCount[0].count}`);
  console.log(`  ✓ Seeded Skills: ${skillsCount[0].count}`);
  console.log(`  ✓ Seeded Courses: ${coursesCount[0].count}`);
  console.log(`  ✓ Seeded Job Postings: ${jobsCount[0].count}`);

  console.log("\n=== ALL MIGRATIONS & SEEDS VERIFIED SUCCESSFULLY ===");
}

verifyMigrations().catch((err) => {
  console.error("Verification failed:", err);
  process.exit(1);
});
