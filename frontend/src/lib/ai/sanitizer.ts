/**
 * Skill Sync AI - Security Sanitizer & AI Defense Layer
 * Problem Statement ID: 26134
 * 
 * 1. PII Scrubber: Redacts personal emails, phone numbers, and URLs.
 * 2. Prompt Injection Guard: Detects and neutralizes adversarial instruction jailbreaks,
 *    role overrides, delimiter breakouts, and system prompt tampering.
 */

export interface PiiScrubResult {
  scrubbedText: string;
  piiDetected: boolean;
  redactedCount: number;
}

export interface PromptInjectionDefenseResult {
  safeText: string;
  injectionDetected: boolean;
  patternsDetected: string[];
}

/**
 * Redacts personal identifiers before dispatching text to external AI models.
 */
export function scrubPII(text: string): PiiScrubResult {
  if (!text) {
    return { scrubbedText: "", piiDetected: false, redactedCount: 0 };
  }

  let scrubbed = text;
  let count = 0;

  // 1. Email pattern
  const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g;
  scrubbed = scrubbed.replace(emailRegex, () => {
    count++;
    return "[EMAIL REDACTED]";
  });

  // 2. Phone numbers (e.g. +91 9876543210, (123) 456-7890, +1-800-555-0199, 10-digit mobile)
  const phoneRegex = /(\+?\d{1,3}[-.\s]?)?(\(?\d{3}\)?[-.\s]?)?\d{3}[-.\s]?\d{4}\b/g;
  scrubbed = scrubbed.replace(phoneRegex, (match) => {
    const digitsOnly = match.replace(/\D/g, "");
    if (digitsOnly.length >= 7) {
      count++;
      return "[PHONE REDACTED]";
    }
    return match;
  });

  // 3. Direct personal contact handles / LinkedIn user URLs
  const socialHandleRegex = /https?:\/\/(www\.)?linkedin\.com\/in\/[A-Za-z0-9-_]+/gi;
  scrubbed = scrubbed.replace(socialHandleRegex, () => {
    count++;
    return "[PROFILE URL REDACTED]";
  });

  return {
    scrubbedText: scrubbed,
    piiDetected: count > 0,
    redactedCount: count,
  };
}

/**
 * Detects adversarial prompt injection attempts and wraps user content in defensive boundaries.
 */
export function sanitizePromptInjection(text: string): PromptInjectionDefenseResult {
  if (!text) {
    return { safeText: "", injectionDetected: false, patternsDetected: [] };
  }

  const detectedPatterns: string[] = [];

  // Adversarial jailbreak patterns
  const injectionPatterns: { regex: RegExp; label: string }[] = [
    { regex: /ignore\s+(all\s+)?(previous|prior|above)\s+instructions?/i, label: "instruction_override" },
    { regex: /disregard\s+(all\s+)?(previous|prior|system)\s+rules?/i, label: "rule_disregard" },
    { regex: /you\s+are\s+now\s+(a|an|the)\s+/i, label: "role_override" },
    { regex: /(system|assistant|developer)\s*:/i, label: "chatml_role_impersonation" },
    { regex: /<\|im_start\|>|<\|im_end\|>|<\|endoftext\|>/gi, label: "token_delimiter_injection" },
    { regex: /```\s*(?:json)?\s*[\r\n]+[\s\S]*?(approve|grant|bypass)/i, label: "structured_bypass_attempt" },
    { regex: /override\s+system\s+prompt/i, label: "prompt_override" },
  ];

  let neutralized = text;

  injectionPatterns.forEach(({ regex, label }) => {
    if (regex.test(neutralized)) {
      detectedPatterns.push(label);
      // Neutralize adversarial keywords with bracketed safe tokens
      neutralized = neutralized.replace(regex, (match) => `[UNTRUSTED_CONTENT_FILTERED: ${match}]`);
    }
  });

  // Escape XML-like tags to prevent delimiter confusion
  neutralized = neutralized
    .replace(/<\/?untrusted_document_content[^>]*>/gi, "")
    .replace(/<\/?system_instructions[^>]*>/gi, "");

  // Wrap in strict passive data enclosure
  const framedPayload = `
<untrusted_document_content role="passive_data_only">
${neutralized.trim()}
</untrusted_document_content>
`.trim();

  return {
    safeText: framedPayload,
    injectionDetected: detectedPatterns.length > 0,
    patternsDetected: detectedPatterns,
  };
}
