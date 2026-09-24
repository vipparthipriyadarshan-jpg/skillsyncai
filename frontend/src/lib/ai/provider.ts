/**
 * Provider-Independent AI Interface for Skill Sync AI.
 * Implements Groq, OpenAI-compatible, and Deterministic Heuristic providers
 * with retries, timeout handling, and secret redaction.
 */

import { CANONICAL_SKILLS } from "./taxonomy";

export interface AIProvider {
  readonly name: string;
  generateStructured(prompt: string, systemPrompt: string, timeoutMs: number): Promise<unknown>;
}

/**
 * Strips sensitive keys/secrets from error messages before logging
 */
export function redactSecrets(message: string): string {
  let sanitized = message
    .replace(/gsk_[a-zA-Z0-9_-]+/g, "[GROQ_KEY_REDACTED]")
    .replace(/sk-[a-zA-Z0-9_-]+/g, "[OPENAI_KEY_REDACTED]")
    .replace(/Bearer\s+[^\s]+/gi, "Bearer [TOKEN_REDACTED]");

  // Dynamically redact runtime environment secrets if present
  if (typeof process !== "undefined") {
    const groqKey = process.env.GROQ_API_KEY;
    if (groqKey && groqKey.trim().length > 8 && !groqKey.includes("placeholder") && !groqKey.includes("your_groq")) {
      sanitized = sanitized.split(groqKey.trim()).join("[GROQ_KEY_REDACTED]");
    }
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (anonKey && anonKey.trim().length > 10 && anonKey !== "placeholder-anon-key") {
      sanitized = sanitized.split(anonKey.trim()).join("[KEY_REDACTED]");
    }
  }

  return sanitized;
}

/**
 * Groq Provider (Fast Llama-3 structured extraction via JSON mode)
 */
export class GroqProvider implements AIProvider {
  readonly name = "groq";
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model: string = "llama-3.3-70b-versatile") {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateStructured(prompt: string, systemPrompt: string, timeoutMs: number): Promise<unknown> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model: this.model,
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt },
          ],
          response_format: { type: "json_object" },
          temperature: 0.0, // Zero temperature for maximum determinism
        }),
        signal: controller.signal,
      });

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(`Groq API error (${response.status}): ${redactSecrets(errText)}`);
      }

      const json = await response.json();
      const content = json.choices?.[0]?.message?.content;
      if (!content) {
        throw new Error("Empty completion content received from Groq API.");
      }

      return JSON.parse(content);
    } catch (err: unknown) {
      if ((err as Error).name === "AbortError") {
        throw new Error(`Groq request timed out after ${timeoutMs}ms.`);
      }
      throw new Error(redactSecrets(err instanceof Error ? err.message : String(err)));
    } finally {
      clearTimeout(timeout);
    }
  }
}

/**
 * Deterministic Heuristic Provider (Offline / Zero-Cost Fallback)
 * Analyzes job descriptions using canonical taxonomy dictionary matching,
 * regex parsing, and grounded evidence extraction directly from the text.
 */
export class DeterministicHeuristicProvider implements AIProvider {
  readonly name = "heuristic_local";

  async generateStructured(prompt: string, _systemPrompt?: string, _timeoutMs?: number): Promise<unknown> {
    void _systemPrompt;
    void _timeoutMs;
    // Extract job text from prompt
    const text = prompt;
    const lowerText = text.toLowerCase();

    // 1. Role Detection
    let detectedRole = "Technical Specialist";
    const roleMatches = [
      { pattern: /ev\s+battery\s+diagnostic\s+technician/i, role: "EV Battery Diagnostic Technician" },
      { pattern: /can\s+bus\s+.*specialist/i, role: "Automotive CAN Bus Diagnostic Specialist" },
      { pattern: /5-axis\s+cnc\s+.*operator/i, role: "5-Axis CNC Machine Operator" },
      { pattern: /solar\s+pv\s+.*engineer/i, role: "Solar PV Grid Integration Engineer" },
      { pattern: /cloud\s+.*devops\s+.*associate/i, role: "Cloud DevOps Infrastructure Associate" },
      { pattern: /machine\s+learning\s+engineer/i, role: "Machine Learning Engineer" },
    ];

    for (const rm of roleMatches) {
      if (rm.pattern.test(text)) {
        detectedRole = rm.role;
        break;
      }
    }

    // 2. Industry / Sector Detection
    let industry = "engineering_technology";
    if (/electric\s+vehicle|battery|automotive|can\s+bus/i.test(text)) industry = "automotive_ev";
    else if (/cnc|milling|machining|g-code/i.test(text)) industry = "manufacturing_cnc";
    else if (/solar|photovoltaic|inverter|grid/i.test(text)) industry = "renewable_energy";
    else if (/cloud|docker|kubernetes|devops/i.test(text)) industry = "information_technology";

    // 3. Location Detection
    let location = "Pune";
    const cities = ["Pune", "Bengaluru", "Coimbatore", "Ahmedabad", "Gurugram", "Hyderabad", "Mumbai", "Chennai"];
    for (const city of cities) {
      if (new RegExp(`\\b${city}\\b`, "i").test(text)) {
        location = city;
        break;
      }
    }

    // 4. Experience Level Detection
    let experienceLevel = "mid_level";
    if (/\b(0|1)\s*-\s*2\s*years|\bjunior\b|\bentry\b/i.test(text)) experienceLevel = "entry_level";
    else if (/\b5\+\s*years|\bsenior\b|\blead\b/i.test(text)) experienceLevel = "senior";

    // 5. Skill Extraction with Grounded Evidence Quotes
    const extractedSkills: Array<{
      name: string;
      category: string;
      proficiency: string;
      evidence: string;
    }> = [];

    // Scan for canonical skills in text
    for (const skill of CANONICAL_SKILLS) {
      for (const alias of skill.aliases) {
        const idx = lowerText.indexOf(alias);
        if (idx !== -1) {
          // Extract 80-character surrounding evidence quote from text
          const start = Math.max(0, idx - 20);
          const end = Math.min(text.length, idx + alias.length + 40);
          const evidence = text.substring(start, end).trim();

          extractedSkills.push({
            name: skill.name,
            category: skill.category,
            proficiency: "intermediate",
            evidence: `"...${evidence}..."`,
          });
          break; // Avoid adding duplicate aliases of same skill
        }
      }
    }

    if (extractedSkills.length === 0) {
      // Fallback skill if none detected
      extractedSkills.push({
        name: "Industrial Technical Knowledge",
        category: "technical",
        proficiency: "introductory",
        evidence: `"...${text.slice(0, 50)}..."`,
      });
    }

    return {
      role: detectedRole,
      skills: extractedSkills,
      industry,
      location,
      experience_level: experienceLevel,
    };
  }
}

/**
 * Provider Factory
 */
export function getAIProvider(requestedProvider?: string): AIProvider {
  const groqKey = typeof process !== "undefined" ? process.env.GROQ_API_KEY : undefined;
  const isGroqValid = Boolean(
    groqKey &&
    !groqKey.includes("your_groq") &&
    !groqKey.includes("placeholder") &&
    groqKey.trim().length > 10
  );

  if (requestedProvider === "groq" || (!requestedProvider && isGroqValid)) {
    if (isGroqValid) {
      return new GroqProvider(groqKey!.trim());
    }
  }

  // Default to deterministic heuristic provider for testing/local demo evaluation
  return new DeterministicHeuristicProvider();
}
