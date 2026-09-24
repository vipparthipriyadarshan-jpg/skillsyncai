import { DatasetType, FileValidationResult, RowValidationError } from "./types";
import { DATASET_SCHEMAS } from "./schemas";
import { sanitizeValue } from "./sanitizer";
import { ParsedFileData } from "./parser";

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50MB

export function validateDataset(
  parsed: ParsedFileData,
  datasetType: DatasetType,
  fileSizeBytes: number
): FileValidationResult {
  const startTime = Date.now();
  const fileErrors: string[] = [];
  const rowErrors: RowValidationError[] = [];
  const schema = DATASET_SCHEMAS[datasetType];

  if (!schema) {
    return {
      isValid: false,
      fileErrors: [`Unknown or unsupported dataset type: "${datasetType}".`],
      totalRows: 0,
      validRows: 0,
      invalidRows: 0,
      headers: [],
      missingColumns: [],
      unexpectedColumns: [],
      rowErrors: [],
      previewRows: [],
      sanitizedData: [],
      processingDurationMs: Date.now() - startTime,
    };
  }

  // 1. File Size Check
  if (fileSizeBytes > MAX_FILE_SIZE_BYTES) {
    fileErrors.push(
      `File exceeds maximum limit of 50MB (actual: ${(fileSizeBytes / (1024 * 1024)).toFixed(2)}MB).`
    );
  }

  // 2. Empty Content Check
  if (parsed.totalRawRows === 0 || parsed.headers.length === 0) {
    fileErrors.push("File contains no records or valid tabular data headers.");
  }

  // 3. Required Headers Check
  const presentHeaders = new Set(parsed.headers);
  const missingColumns = schema.requiredColumns.filter((col) => !presentHeaders.has(col));
  const schemaColumnNames = new Set(schema.columns.map((c) => c.name));
  const unexpectedColumns = parsed.headers.filter((h) => !schemaColumnNames.has(h));

  if (missingColumns.length > 0) {
    fileErrors.push(
      `Missing required column(s): ${missingColumns.map((c) => `"${c}"`).join(", ")}.`
    );
  }

  // If there are structural file-level errors, bail out early
  if (fileErrors.length > 0) {
    return {
      isValid: false,
      fileErrors,
      totalRows: parsed.totalRawRows,
      validRows: 0,
      invalidRows: parsed.totalRawRows,
      headers: parsed.headers,
      missingColumns,
      unexpectedColumns,
      rowErrors,
      previewRows: parsed.rows.slice(0, 10),
      sanitizedData: [],
      processingDurationMs: Date.now() - startTime,
    };
  }

  // 4. Row-Level Validation & Deduplication
  const seenUniqueKeys = new Set<string>();
  const sanitizedRows: Record<string, unknown>[] = [];
  let validRowsCount = 0;
  let invalidRowsCount = 0;

  parsed.rows.forEach((rawRow, idx) => {
    const rowNumber = idx + 2; // +1 for 1-indexing, +1 for header row
    const rowIssues: string[] = [];
    const sanitizedRow: Record<string, unknown> = {};

    // Validate and sanitize each defined column
    for (const colDef of schema.columns) {
      const rawVal = rawRow[colDef.name];

      // Check required fields
      if (colDef.required) {
        if (rawVal === undefined || rawVal === null || String(rawVal).trim() === "") {
          const msg = `Missing required field: "${colDef.label}" (${colDef.name})`;
          rowIssues.push(msg);
          rowErrors.push({
            row: rowNumber,
            column: colDef.name,
            message: msg,
            rawData: rawRow,
          });
          continue;
        }
      }

      // Sanitize value according to expected type
      const cleanVal = sanitizeValue(rawVal, colDef.type);
      sanitizedRow[colDef.name] = cleanVal;

      // Type-specific verification
      if (colDef.type === "integer" || colDef.type === "number") {
        if (rawVal !== undefined && rawVal !== null && rawVal !== "" && cleanVal === null) {
          const msg = `Column "${colDef.name}" must be a valid ${colDef.type}. Found: "${rawVal}"`;
          rowIssues.push(msg);
          rowErrors.push({
            row: rowNumber,
            column: colDef.name,
            message: msg,
            rawData: rawRow,
          });
        }
      }

      // Custom column validator
      if (colDef.validator && cleanVal !== null && cleanVal !== undefined) {
        const customErr = colDef.validator(cleanVal, rawRow, idx);
        if (customErr) {
          rowIssues.push(customErr);
          rowErrors.push({
            row: rowNumber,
            column: colDef.name,
            message: customErr,
            rawData: rawRow,
          });
        }
      }
    }

    // In-batch Duplicate Check based on schema.uniqueKeys
    if (schema.uniqueKeys && schema.uniqueKeys.length > 0) {
      const uniqueSignature = schema.uniqueKeys
        .map((k) => String(sanitizedRow[k] ?? "").toLowerCase().trim())
        .join("::");

      if (uniqueSignature && seenUniqueKeys.has(uniqueSignature)) {
        const msg = `Duplicate record detected within dataset (Matching keys: ${schema.uniqueKeys.join(", ")})`;
        rowIssues.push(msg);
        rowErrors.push({
          row: rowNumber,
          message: msg,
          rawData: rawRow,
        });
      } else if (uniqueSignature) {
        seenUniqueKeys.add(uniqueSignature);
      }
    }

    if (rowIssues.length === 0) {
      validRowsCount++;
      sanitizedRows.push(sanitizedRow);
    } else {
      invalidRowsCount++;
    }
  });

  const isValid = fileErrors.length === 0 && rowErrors.length === 0;

  return {
    isValid,
    fileErrors,
    totalRows: parsed.totalRawRows,
    validRows: validRowsCount,
    invalidRows: invalidRowsCount,
    headers: parsed.headers,
    missingColumns,
    unexpectedColumns,
    rowErrors,
    previewRows: parsed.rows.slice(0, 10),
    sanitizedData: sanitizedRows,
    processingDurationMs: Date.now() - startTime,
  };
}
