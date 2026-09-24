import Papa from "papaparse";
import * as XLSX from "xlsx";

export interface ParsedFileData {
  headers: string[];
  rows: Record<string, unknown>[];
  totalRawRows: number;
}

/**
 * Normalizes header keys to lowercase snake_case for consistent schema matching.
 */
export function normalizeHeader(header: string): string {
  return header
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "_");
}

/**
 * Parses CSV text content into normalized header-row objects.
 */
export function parseCsv(csvText: string): ParsedFileData {
  if (!csvText || !csvText.trim()) {
    return { headers: [], rows: [], totalRawRows: 0 };
  }

  const result = Papa.parse(csvText, {
    header: true,
    skipEmptyLines: "greedy",
    transformHeader: (h) => normalizeHeader(h),
  });

  const headers = result.meta.fields || [];
  const rows = (result.data as Record<string, unknown>[]).filter((row) =>
    Object.values(row).some((val) => val !== null && val !== undefined && String(val).trim() !== "")
  );

  return {
    headers,
    rows,
    totalRawRows: rows.length,
  };
}

/**
 * Parses XLSX buffer into normalized header-row objects from the primary worksheet.
 */
export function parseXlsx(buffer: ArrayBuffer | Buffer): ParsedFileData {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
    return { headers: [], rows: [], totalRawRows: 0 };
  }

  const firstSheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[firstSheetName];

  // Convert sheet to json array of objects
  const rawRows: Record<string, unknown>[] = XLSX.utils.sheet_to_json(worksheet, {
    defval: "",
    raw: false,
  });

  if (rawRows.length === 0) {
    return { headers: [], rows: [], totalRawRows: 0 };
  }

  // Extract raw headers from keys of the first row
  const rawHeaders = Object.keys(rawRows[0] || {});
  const headers = rawHeaders.map((h) => normalizeHeader(h));

  // Remap row keys to normalized headers with Prototype Pollution defense (CWE-1321)
  const rows = rawRows.map((row) => {
    const normalizedRow: Record<string, unknown> = {};
    for (const [key, val] of Object.entries(row)) {
      const cleanKey = normalizeHeader(key);
      if (cleanKey === "__proto__" || cleanKey === "constructor" || cleanKey === "prototype") {
        continue; // Block prototype pollution attempt
      }
      normalizedRow[cleanKey] = val;
    }
    return normalizedRow;
  });

  return {
    headers,
    rows,
    totalRawRows: rows.length,
  };
}
