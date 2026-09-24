import { NextRequest, NextResponse } from "next/server";
import { sanitizeFilename } from "@/lib/ingestion/sanitizer";
import { parseCsv, parseXlsx } from "@/lib/ingestion/parser";
import { validateDataset } from "@/lib/ingestion/validator";
import { DatasetType } from "@/lib/ingestion/types";
import { DATASET_SCHEMAS } from "@/lib/ingestion/schemas";
import { checkRateLimit, getClientIp } from "@/lib/security/rate-limiter";
import { verifyApiAuth } from "@/lib/security/auth-guard";

export const dynamic = "force-dynamic";

// Strict file limits
const MAX_FILE_SIZE_BYTES = 25 * 1024 * 1024; // 25 MB max limit

export async function POST(request: NextRequest) {
  // 1. Rate Limiting: Max 20 file validation requests per minute
  const clientIp = getClientIp(request);
  const rateLimit = checkRateLimit(`ingest-val:${clientIp}`, { limit: 20, windowMs: 60 * 1000 });
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { error: "Too many file upload validation requests. Please wait." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(rateLimit.resetMs / 1000)) } }
    );
  }

  // 2. Authorization Guard: Admin, Government, or Institution role required
  const auth = await verifyApiAuth(request, ["admin", "government", "institution"]);
  if (!auth.authorized) {
    return NextResponse.json(
      { error: auth.errorResponse?.error || "Unauthorized to upload datasets." },
      { status: auth.errorResponse?.status || 403 }
    );
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const datasetType = formData.get("dataset_type") as DatasetType | null;

    if (!file) {
      return NextResponse.json(
        { error: "No file was uploaded." },
        { status: 400 }
      );
    }

    // 3. Strict File Size Validation (DoS Defense)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      return NextResponse.json(
        {
          error: `File size exceeds maximum allowed limit (25 MB). Received: ${(file.size / (1024 * 1024)).toFixed(2)} MB.`,
        },
        { status: 413 }
      );
    }

    if (!datasetType || !DATASET_SCHEMAS[datasetType]) {
      return NextResponse.json(
        { error: `Invalid dataset type: "${datasetType}".` },
        { status: 400 }
      );
    }

    // 4. Sanitize Filename & Extension
    let filenameInfo;
    try {
      filenameInfo = sanitizeFilename(file.name);
    } catch (err: unknown) {
      return NextResponse.json(
        { error: err instanceof Error ? err.message : "Invalid filename." },
        { status: 400 }
      );
    }

    // 5. Read Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 6. Magic Bytes / MIME Signature Verification
    if (filenameInfo.extension === "xlsx") {
      // XLSX must be a ZIP container starting with PK\x03\x04
      const isZip =
        buffer.length >= 4 &&
        buffer[0] === 0x50 &&
        buffer[1] === 0x4b &&
        (buffer[2] === 0x03 || buffer[2] === 0x05 || buffer[2] === 0x07) &&
        (buffer[3] === 0x04 || buffer[3] === 0x06 || buffer[3] === 0x08);

      if (!isZip) {
        return NextResponse.json(
          { error: "Invalid file contents. The uploaded file is not a valid Excel (.xlsx) workbook." },
          { status: 400 }
        );
      }
    } else if (filenameInfo.extension === "csv") {
      // Reject binary executables renamed to .csv (check first 1024 bytes for null bytes)
      const sample = buffer.subarray(0, Math.min(buffer.length, 1024));
      if (sample.includes(0x00)) {
        return NextResponse.json(
          { error: "Invalid CSV format. Binary files disguised as CSV are rejected." },
          { status: 400 }
        );
      }
    }

    // 7. Parse safely
    let parsedData;
    if (filenameInfo.extension === "csv") {
      const text = buffer.toString("utf-8");
      parsedData = parseCsv(text);
    } else {
      parsedData = parseXlsx(buffer);
    }

    // 8. Validate against domain schema
    const validationResult = validateDataset(parsedData, datasetType, file.size);

    return NextResponse.json(
      {
        success: true,
        filename: filenameInfo.sanitized,
        originalFilename: filenameInfo.original,
        datasetType,
        validation: validationResult,
      },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("[Security Audit] File validation error:", err);
    return NextResponse.json(
      {
        error: "Server encountered an error while processing the dataset.",
        details: err instanceof Error ? err.message : "Internal processing error",
      },
      { status: 500 }
    );
  }
}
