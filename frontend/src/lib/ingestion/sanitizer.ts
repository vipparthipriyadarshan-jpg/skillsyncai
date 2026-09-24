/**
 * Input & Filename Sanitization for Skill Sync AI Data Ingestion Module.
 * Prevents malicious filenames, path traversals, XSS injection, and control characters.
 */

export function sanitizeFilename(rawFilename: string): {
  sanitized: string;
  original: string;
  extension: "csv" | "xlsx";
} {
  if (!rawFilename || typeof rawFilename !== "string") {
    throw new Error("Invalid or empty filename provided.");
  }

  // 1. Strip path traversal and path separators
  const name = rawFilename.replace(/^.*[\\\/]/, "").trim();

  // 2. Extract and validate extension
  const extMatch = name.match(/\.(csv|xlsx)$/i);
  if (!extMatch) {
    throw new Error("Unsupported file extension. Only .csv and .xlsx files are supported.");
  }
  const extension = extMatch[1].toLowerCase() as "csv" | "xlsx";

  // 3. Remove extension for base sanitization
  const baseName = name.slice(0, -extMatch[0].length);

  // 4. Sanitize base name: allow only alphanumerics, hyphens, and underscores
  const cleanBase = baseName
    .replace(/[^a-zA-Z0-9_\-\s]/g, "")
    .replace(/\s+/g, "_")
    .slice(0, 80); // Cap length

  if (!cleanBase) {
    throw new Error("Filename contains no safe characters.");
  }

  // 5. Generate collision-resistant, deterministic safe filename
  const timestamp = Date.now();
  const sanitized = `${cleanBase}_${timestamp}.${extension}`;

  return {
    sanitized,
    original: name,
    extension,
  };
}

export function sanitizeText(val: unknown): string {
  if (val === null || val === undefined) return "";
  let str = String(val);

  // Strip null bytes and ASCII control characters (keep \r, \n, \t)
  str = str.replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "");

  // Prevent basic HTML/Script injection in free text
  str = str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");

  // Prevent CSV Formula Injection (CWE-1236): Neutralize leading formula triggers (=, +, -, @, \t, \r)
  const trimmed = str.trim();
  if (/^[=+\-@\t\r]/.test(trimmed)) {
    return `'${trimmed}`;
  }

  return trimmed;
}

export function sanitizeValue(val: unknown, type: "string" | "number" | "integer" | "date" | "boolean"): unknown {
  if (val === null || val === undefined || val === "") {
    return null;
  }

  switch (type) {
    case "string":
      return sanitizeText(val);

    case "number": {
      const num = Number(String(val).replace(/[^0-9.-]/g, ""));
      return isNaN(num) ? null : num;
    }

    case "integer": {
      const int = parseInt(String(val).replace(/[^0-9-]/g, ""), 10);
      return isNaN(int) ? null : int;
    }

    case "boolean": {
      const s = String(val).toLowerCase().trim();
      return s === "true" || s === "1" || s === "yes";
    }

    case "date": {
      const d = new Date(String(val));
      return isNaN(d.getTime()) ? null : d.toISOString().split("T")[0];
    }

    default:
      return sanitizeText(val);
  }
}
