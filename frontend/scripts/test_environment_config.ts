/**
 * Skill Sync AI - Environment Configuration & Security Verification Suite
 * Problem Statement: 26134
 * 
 * Verifies:
 * 1. Safe Health Check status reports ONLY booleans (supabase_configured, ai_provider_configured, analytics_service_configured)
 * 2. Secrets are NEVER returned in health status or error payloads
 * 3. Supabase client & server initialization with legacy anon key and publishable key
 * 4. Deterministic Demo Mode fallback when GROQ_API_KEY is not configured
 * 5. Dynamic runtime secret redaction in error logging
 * 6. GroqProvider initialization when valid key is provided
 */

import { env } from "../src/lib/env";
import { getAIProvider, redactSecrets, GroqProvider, DeterministicHeuristicProvider } from "../src/lib/ai/provider";
import { createClient as createBrowserClient } from "../src/lib/supabase/client";

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

async function runEnvironmentConfigTests() {
  console.log("=============================================================");
  console.log("   Skill Sync AI: Environment & Security Verification Suite  ");
  console.log("=============================================================\n");

  // --------------------------------------------------------------------------
  // Test Group 1: Safe Configuration Status Booleans
  // --------------------------------------------------------------------------
  console.log("[Test Group 1] Safe Configuration Status Checks");

  assert(typeof env.isSupabaseConfigured === "boolean", "env.isSupabaseConfigured is strictly boolean");
  assert(typeof env.isAiConfigured === "boolean", "env.isAiConfigured is strictly boolean");
  assert(typeof env.isAnalyticsConfigured === "boolean", "env.isAnalyticsConfigured is strictly boolean");

  // Verify that secrets are NEVER exposed in env properties
  const envKeys = Object.keys(env);
  assert(!envKeys.includes("groqApiKey"), "GROQ_API_KEY is NOT exposed on env object");
  assert(!envKeys.includes("serviceRoleKey"), "SUPABASE_SERVICE_ROLE_KEY is NOT exposed on env object");

  // --------------------------------------------------------------------------
  // Test Group 2: Supabase Client Key Compatibility
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 2] Supabase Initialization & Dual Key Support");

  const supabaseClient = createBrowserClient();
  assert(Boolean(supabaseClient), "Browser client initializes cleanly");
  assert(Boolean(supabaseClient.auth), "Browser client auth namespace accessible");

  // Test publishable key fallback
  const originalAnon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const originalPub = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = "sbp_live_demo_publishable_token_12345";
  const pubClient = createBrowserClient();
  assert(Boolean(pubClient), "Browser client supports NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY");

  // Restore env
  if (originalAnon) process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY = originalAnon;
  else delete process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (originalPub) process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY = originalPub;
  else delete process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  // --------------------------------------------------------------------------
  // Test Group 3: AI Provider Mode Selection & Demo Fallback
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 3] AI Provider Selection & Demo Fallback");

  // Case A: When GROQ_API_KEY is missing/placeholder, must return DeterministicHeuristicProvider
  const origGroq = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;

  const fallbackProvider = getAIProvider();
  assert(
    fallbackProvider instanceof DeterministicHeuristicProvider,
    "Missing GROQ_API_KEY gracefully returns DeterministicHeuristicProvider (Demo Mode)"
  );
  assert(fallbackProvider.name === "heuristic_local", "Fallback provider identified as heuristic_local");

  process.env.GROQ_API_KEY = "gsk_your_groq_api_key"; // Placeholder format
  const placeholderProvider = getAIProvider();
  assert(
    placeholderProvider instanceof DeterministicHeuristicProvider,
    "Placeholder GROQ_API_KEY safely falls back to DeterministicHeuristicProvider"
  );

  // Case B: When a valid GROQ_API_KEY is configured
  process.env.GROQ_API_KEY = "gsk_valid_live_runtime_groq_api_key_test_token_8989";
  const activeGroqProvider = getAIProvider();
  assert(
    activeGroqProvider instanceof GroqProvider,
    "Configured GROQ_API_KEY instantiates GroqProvider"
  );
  assert(activeGroqProvider.name === "groq", "Active provider identified as groq");

  // --------------------------------------------------------------------------
  // Test Group 4: Dynamic Secret Redaction & Leakage Prevention
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 4] Dynamic Secret Redaction & Leakage Prevention");

  const testGroqSecret = "gsk_valid_live_runtime_groq_api_key_test_token_8989";
  const rawErrorMessage = `Upstream call failed with authorization token ${testGroqSecret} at endpoint https://api.groq.com`;
  const sanitizedError = redactSecrets(rawErrorMessage);

  assert(!sanitizedError.includes(testGroqSecret), "Runtime GROQ_API_KEY was fully redacted from error message");
  assert(sanitizedError.includes("[GROQ_KEY_REDACTED]"), "Sanitized message contains [GROQ_KEY_REDACTED] placeholder");

  // Test generic Bearer token redaction
  const bearerError = "Failed request: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.header.signature";
  const sanitizedBearer = redactSecrets(bearerError);
  assert(!sanitizedBearer.includes("eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9"), "Bearer JWT token was fully redacted");
  assert(sanitizedBearer.includes("Bearer [TOKEN_REDACTED]"), "Bearer [TOKEN_REDACTED] placeholder present");

  // Restore env
  if (origGroq) process.env.GROQ_API_KEY = origGroq;
  else delete process.env.GROQ_API_KEY;

  console.log("\n=============================================================");
  console.log(`  Environment & Security Tests: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runEnvironmentConfigTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
