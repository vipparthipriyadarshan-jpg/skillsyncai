/**
 * Skill Sync AI - Ingestion Automated Test Suite
 * Tests:
 * 1. Valid CSV ingestion
 * 2. Missing columns detection
 * 3. Malformed data & row-level error reporting
 * 4. Duplicate records detection
 * 5. Empty file rejection
 * 6. Filename & text sanitization (security)
 * 7. In-memory XLSX workbook parsing
 */

import * as fs from "fs";
import * as path from "path";
import * as XLSX from "xlsx";
import { parseCsv, parseXlsx } from "../src/lib/ingestion/parser";
import { validateDataset } from "../src/lib/ingestion/validator";
import { sanitizeFilename, sanitizeText } from "../src/lib/ingestion/sanitizer";

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

async function runIngestionTests() {
  console.log("=== Skill Sync AI: Ingestion Engine Test Suite ===\n");

  const demoDir = path.resolve(__dirname, "../../data/demo");
  const testCasesDir = path.resolve(demoDir, "test_cases");

  // --------------------------------------------------------------------------
  // Test 1: Valid CSV Dataset
  // --------------------------------------------------------------------------
  console.log("[Test 1] Valid CSV Ingestion (job_postings_sample.csv)");
  const validCsvPath = path.join(demoDir, "job_postings_sample.csv");
  const validCsvText = fs.readFileSync(validCsvPath, "utf-8");
  const validParsed = parseCsv(validCsvText);
  const validResult = validateDataset(validParsed, "job_postings", validCsvText.length);

  assert(validResult.isValid === true, "Valid CSV flagged as valid");
  assert(validResult.totalRows === 5, "Total rows parsed correctly (5 rows)", `got ${validResult.totalRows}`);
  assert(validResult.validRows === 5, "All 5 rows valid", `got ${validResult.validRows}`);
  assert(validResult.invalidRows === 0, "Zero invalid rows", `got ${validResult.invalidRows}`);
  assert(validResult.rowErrors.length === 0, "Zero row errors logged");

  // --------------------------------------------------------------------------
  // Test 2: Missing Columns Detection
  // --------------------------------------------------------------------------
  console.log("\n[Test 2] Missing Columns Rejection (missing_columns.csv)");
  const missingColPath = path.join(testCasesDir, "missing_columns.csv");
  const missingColText = fs.readFileSync(missingColPath, "utf-8");
  const missingParsed = parseCsv(missingColText);
  const missingResult = validateDataset(missingParsed, "job_postings", missingColText.length);

  assert(missingResult.isValid === false, "Missing columns CSV rejected as invalid");
  assert(missingResult.missingColumns.length > 0, "Missing columns identified", missingResult.missingColumns.join(", "));
  assert(
    missingResult.missingColumns.includes("district") && missingResult.missingColumns.includes("raw_description"),
    "Specifically identified 'district' and 'raw_description' as missing"
  );

  // --------------------------------------------------------------------------
  // Test 3: Malformed Data & Row-Level Validation
  // --------------------------------------------------------------------------
  console.log("\n[Test 3] Malformed Data & Row-Level Messages (malformed_data.csv)");
  const malformedPath = path.join(testCasesDir, "malformed_data.csv");
  const malformedText = fs.readFileSync(malformedPath, "utf-8");
  const malformedParsed = parseCsv(malformedText);
  const malformedResult = validateDataset(malformedParsed, "job_postings", malformedText.length);

  assert(malformedResult.isValid === false, "Malformed dataset flagged as invalid");
  assert(malformedResult.rowErrors.length > 0, "Row-level validation errors captured");
  assert(
    malformedResult.rowErrors.some((e) => e.row === 2),
    "Captured row #2 error (invalid sector or negative vacancies)"
  );
  assert(
    malformedResult.rowErrors.some((e) => e.message.includes("Sector must be one of")),
    "Captured specific invalid sector error message"
  );

  // --------------------------------------------------------------------------
  // Test 4: Duplicate Records Detection
  // --------------------------------------------------------------------------
  console.log("\n[Test 4] Duplicate Records Detection (duplicate_records.csv)");
  const dupPath = path.join(testCasesDir, "duplicate_records.csv");
  const dupText = fs.readFileSync(dupPath, "utf-8");
  const dupParsed = parseCsv(dupText);
  const dupResult = validateDataset(dupParsed, "job_postings", dupText.length);

  assert(dupResult.isValid === false, "Duplicate dataset flagged as invalid");
  assert(
    dupResult.rowErrors.some((e) => e.message.includes("Duplicate record detected")),
    "Identified in-batch duplicate record with exact error message"
  );

  // --------------------------------------------------------------------------
  // Test 5: Empty File Handling
  // --------------------------------------------------------------------------
  console.log("\n[Test 5] Empty File Handling (empty_file.csv)");
  const emptyPath = path.join(testCasesDir, "empty_file.csv");
  const emptyText = fs.readFileSync(emptyPath, "utf-8");
  const emptyParsed = parseCsv(emptyText);
  const emptyResult = validateDataset(emptyParsed, "job_postings", emptyText.length);

  assert(emptyResult.isValid === false, "Empty file flagged as invalid");
  assert(
    emptyResult.fileErrors.some((e) => e.includes("no records")),
    "Reported empty records error"
  );

  // --------------------------------------------------------------------------
  // Test 6: Filename & Security Sanitization
  // --------------------------------------------------------------------------
  console.log("\n[Test 6] Filename & Input Sanitization (Security)");
  const maliciousName = "../../etc/passwd<script>alert(1)</script>.csv";
  const sanitized = sanitizeFilename(maliciousName);

  assert(!sanitized.sanitized.includes(".."), "Stripped directory traversal (..)");
  assert(!sanitized.sanitized.includes("<script>"), "Stripped XSS tags from filename");
  assert(sanitized.extension === "csv", "Correctly retained .csv extension");

  const dirtyText = "Safe text\x00 with null byte and <script>attack</script>";
  const cleanText = sanitizeText(dirtyText);
  assert(!cleanText.includes("\x00"), "Stripped null byte");
  assert(!cleanText.includes("<script>"), "Escaped script tags in text");

  // --------------------------------------------------------------------------
  // Test 7: XLSX Workbook Ingestion
  // --------------------------------------------------------------------------
  console.log("\n[Test 7] XLSX Parsing & Validation");
  const wb = XLSX.utils.book_new();
  const wsData = [
    ["title", "company_name", "district", "sector", "vacancies", "raw_description"],
    ["CNC Programmer", "LMW Precision", "Coimbatore", "manufacturing_cnc", 10, "5-axis milling"],
  ];
  const ws = XLSX.utils.aoa_to_sheet(wsData);
  XLSX.utils.book_append_sheet(wb, ws, "Sheet1");
  const xlsxBuffer = XLSX.write(wb, { type: "buffer", bookType: "xlsx" });

  const xlsxParsed = parseXlsx(xlsxBuffer);
  const xlsxResult = validateDataset(xlsxParsed, "job_postings", xlsxBuffer.length);

  assert(xlsxResult.isValid === true, "XLSX buffer parsed and validated successfully");
  assert(xlsxResult.validRows === 1, "Parsed 1 valid row from Excel sheet");

  // Summary
  console.log(`\n========================================`);
  console.log(`Tests Completed: ${passedCount + failedCount} | Passed: ${passedCount} | Failed: ${failedCount}`);
  console.log(`========================================`);

  if (failedCount > 0) {
    process.exit(1);
  }
}

runIngestionTests().catch((err) => {
  console.error("Test runner failed:", err);
  process.exit(1);
});
