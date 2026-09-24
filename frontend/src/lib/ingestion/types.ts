/**
 * Type definitions for Skill Sync AI Data Ingestion Module
 */

export type DatasetType =
  | "job_postings"
  | "courses"
  | "curriculum"
  | "trainers"
  | "equipment"
  | "placements"
  | "employer_surveys";

export interface ColumnDefinition {
  name: string;
  label: string;
  required: boolean;
  type: "string" | "number" | "integer" | "date" | "boolean";
  description: string;
  example: string;
  validator?: (value: unknown, row: Record<string, unknown>, index: number) => string | null;
}

export interface DatasetSchema {
  id: DatasetType;
  title: string;
  description: string;
  targetTable: string;
  requiredColumns: string[];
  columns: ColumnDefinition[];
  uniqueKeys: string[];
}

export interface RowValidationError {
  row: number; // 1-indexed row number
  column?: string;
  message: string;
  rawData?: Record<string, unknown>;
}

export interface FileValidationResult {
  isValid: boolean;
  fileErrors: string[];
  totalRows: number;
  validRows: number;
  invalidRows: number;
  headers: string[];
  missingColumns: string[];
  unexpectedColumns: string[];
  rowErrors: RowValidationError[];
  previewRows: Record<string, unknown>[];
  sanitizedData: Record<string, unknown>[];
  processingDurationMs: number;
}

export interface IngestionJobRecord {
  id: string;
  datasetType: DatasetType;
  filename: string;
  fileSizeBytes: number;
  status: "pending" | "validating" | "processing" | "completed" | "failed";
  totalRows: number;
  validRows: number;
  invalidRows: number;
  importedRows: number;
  processingDurationMs: number;
  errorSummary?: string;
  createdAt: string;
}
