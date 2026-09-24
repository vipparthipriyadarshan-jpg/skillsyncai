/**
 * Skill Sync AI - AI Skill Intelligence Test Suite (Phase 4)
 * 
 * Verifies:
 * 1. Skill Normalization & Canonical Deduplication (ML, Machine Learning, Machine-Learning -> Machine Learning)
 * 2. PII Sanitization (Redacts emails, phone numbers, recruiter URLs)
 * 3. Role & Sector Classification (classifyJobRole)
 * 4. Structured Extraction with Grounded Evidence (extractJobSkills)
 * 5. Grounding Verification & Hallucination Flagging (needsReview on low confidence / ungrounded claims)
 * 6. Malformed AI response handling & schema validation
 * 7. Secret Redaction & Safe Error Logging
 */

import { normalizeSkill, classifyJobRole, extractJobSkills } from "../src/lib/ai/service";
import { scrubPII } from "../src/lib/ai/sanitizer";
import { redactSecrets, AIProvider } from "../src/lib/ai/provider";

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

async function runAIIntelligenceTests() {
  console.log("=============================================================");
  console.log("   Skill Sync AI: AI Skill Intelligence Test Suite (Phase 4)");
  console.log("=============================================================\n");

  // --------------------------------------------------------------------------
  // Test Group 1: Skill Normalization & Canonical Deduplication
  // --------------------------------------------------------------------------
  console.log("[Test Group 1] Skill Normalization & Alias Deduplication");

  const mlVariations = ["ML", "Machine Learning", "Machine-Learning", "machinelearning"];
  for (const variant of mlVariations) {
    const res = await normalizeSkill(variant);
    assert(
      res.canonicalName === "Machine Learning" && res.slug === "machine-learning",
      `Variant "${variant}" maps to canonical "Machine Learning"`,
      `Got name: "${res.canonicalName}", slug: "${res.slug}"`
    );
    assert(res.isCanonical === true, `Variant "${variant}" is marked canonical`);
  }

  const bmsRes = await normalizeSkill("bms");
  assert(
    bmsRes.canonicalName === "Battery Management Systems (BMS)",
    'Alias "bms" maps to "Battery Management Systems (BMS)"',
    `Got "${bmsRes.canonicalName}"`
  );

  const cncRes = await normalizeSkill("5 axis cnc");
  assert(
    cncRes.canonicalName === "5-Axis CNC Milling",
    'Alias "5 axis cnc" maps to "5-Axis CNC Milling"',
    `Got "${cncRes.canonicalName}"`
  );

  const canRes = await normalizeSkill("can-bus");
  assert(
    canRes.canonicalName === "Automotive CAN Bus Protocol",
    'Alias "can-bus" maps to "Automotive CAN Bus Protocol"',
    `Got "${canRes.canonicalName}"`
  );

  // Non-taxonomy skill test
  const customSkill = await normalizeSkill("Quantum Photonic Logic Gate");
  assert(
    customSkill.canonicalName === "Quantum Photonic Logic Gate",
    "Unregistered skill keeps clean name",
    `Got "${customSkill.canonicalName}"`
  );
  assert(customSkill.isCanonical === false, "Unregistered skill isCanonical is false");

  // --------------------------------------------------------------------------
  // Test Group 2: PII Sanitization & Redaction
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 2] PII Sanitization (Emails, Phones, URLs)");

  const textWithPII = `
    Job Title: Senior EV Engineer
    Contact HR Manager Priya Sharma at priya.sharma@tatamotors-ev.com or +91 9876543210.
    For direct enquiries call 1-800-555-0199 or visit https://linkedin.com/in/priya-sharma-recruiter.
    Requirements: Candidate must have 3+ years experience in BMS and ISO 26262 compliance.
  `;

  const piiResult = scrubPII(textWithPII);
  assert(piiResult.piiDetected === true, "PII detected successfully");
  assert(piiResult.redactedCount >= 3, `Multiple PII entities caught (count: ${piiResult.redactedCount})`);
  assert(!piiResult.scrubbedText.includes("priya.sharma@tatamotors-ev.com"), "Email address redacted from text");
  assert(piiResult.scrubbedText.includes("[EMAIL REDACTED]"), "[EMAIL REDACTED] placeholder inserted");
  assert(!piiResult.scrubbedText.includes("+91 9876543210"), "Phone number redacted from text");
  assert(piiResult.scrubbedText.includes("[PHONE REDACTED]"), "[PHONE REDACTED] placeholder inserted");
  assert(!piiResult.scrubbedText.includes("linkedin.com/in/priya-sharma-recruiter"), "Profile URL redacted");
  assert(piiResult.scrubbedText.includes("[PROFILE URL REDACTED]"), "[PROFILE URL REDACTED] placeholder inserted");
  assert(piiResult.scrubbedText.includes("ISO 26262"), "Technical standards preserved untouched");

  // --------------------------------------------------------------------------
  // Test Group 3: Role & Sector Classification
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 3] Role & Sector Classification (classifyJobRole)");

  const evRole = await classifyJobRole(
    "Junior EV Battery Technician",
    "Requirements: 0-2 years experience in electric vehicle battery pack assembly, cell balancing, and CAN bus diagnostics."
  );
  assert(evRole.sector === "automotive_ev", "EV role classified into automotive_ev sector", `got ${evRole.sector}`);
  assert(evRole.experienceLevel === "entry_level", "0-2 years experience mapped to entry_level", `got ${evRole.experienceLevel}`);
  assert(evRole.minYearsEstimated === 0 && evRole.maxYearsEstimated === 2, "Experience years estimated correctly (0-2)");

  const cncRole = await classifyJobRole(
    "Lead CNC Machinist",
    "Requirements: 5+ years operating 5-axis CNC milling machines, G-code optimization, and aerospace titanium machining."
  );
  assert(cncRole.sector === "manufacturing_cnc", "CNC role classified into manufacturing_cnc sector", `got ${cncRole.sector}`);
  assert(cncRole.experienceLevel === "senior", "5+ years mapped to senior level", `got ${cncRole.experienceLevel}`);
  assert(cncRole.minYearsEstimated === 5, "Min years estimated correctly (5)");

  // --------------------------------------------------------------------------
  // Test Group 4: Structured Job Extraction with Grounded Evidence
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 4] Structured Job Extraction (extractJobSkills)");

  const sampleEVJob = `
    Job Role: EV Battery Diagnostic Technician
    Location: Pune, Maharashtra
    Employer: Tata AutoComp Systems
    Contact: recruiter@tatacomp.com / +91-9822012345
    Description:
    We are seeking an EV Battery Diagnostic Technician for our Pune EV battery pack testing facility.
    The candidate will be responsible for:
    - Running diagnostic scans on Lithium-ion traction battery packs.
    - BMS configuration and cell balancing under high-voltage safety standards.
    - Capturing vehicle telemetry via Automotive CAN bus protocols.
    - High-voltage isolation safety compliance (ISO 6469).
    Experience: 0-2 years experience in EV maintenance or electrical diploma.
  `;

  const evExtraction = await extractJobSkills(sampleEVJob);

  assert(evExtraction.piiDetected === true, "PII detected and flagged in extraction result");
  assert(!evExtraction.scrubbedDescription.includes("recruiter@tatacomp.com"), "PII scrubbed from payload");
  assert(evExtraction.industry === "automotive_ev", 'Industry detected as "automotive_ev"', `got ${evExtraction.industry}`);
  assert(evExtraction.location === "Pune", 'Location detected as "Pune"', `got ${evExtraction.location}`);
  assert(evExtraction.role.experienceLevel === "entry_level", 'Experience level detected as "entry_level"', `got ${evExtraction.role.experienceLevel}`);
  assert(evExtraction.skills.length >= 3, `Extracted ${evExtraction.skills.length} skills (expected >= 3)`);

  // Verify skills have grounded evidence
  const bmsSkill = evExtraction.skills.find((s) => s.canonical.slug === "bms-configuration");
  assert(!!bmsSkill, "BMS skill identified and mapped to canonical entity");
  if (bmsSkill) {
    assert(bmsSkill.isGroundedInText === true, "BMS skill is confirmed grounded in text");
    assert(bmsSkill.evidence.length > 5, `BMS evidence quote captured: ${bmsSkill.evidence}`);
    assert(bmsSkill.confidenceScore >= 0.8, `BMS skill confidence high (${bmsSkill.confidenceScore})`);
  }

  const canSkill = evExtraction.skills.find((s) => s.canonical.slug === "can-bus-protocol");
  assert(!!canSkill, "CAN bus skill identified and mapped to canonical entity");
  if (canSkill) {
    assert(canSkill.isGroundedInText === true, "CAN bus skill confirmed grounded in text");
  }

  assert(evExtraction.overallConfidence >= 0.80, `High overall extraction confidence (${evExtraction.overallConfidence})`);
  assert(evExtraction.needsReview === false, "No manual review needed for well-grounded extraction");

  // Sample 2: CNC Operator
  const sampleCNCJob = `
    Job Role: 5-Axis CNC Machine Operator
    Location: Coimbatore, Tamil Nadu
    Requirements:
    Operate Mazak 5-axis CNC milling machines for aerospace components.
    Expertise in G-code programming, tool offsets, and ISO GD&T inspection.
    Minimum 5+ years experience required.
  `;

  const cncExtraction = await extractJobSkills(sampleCNCJob);
  assert(cncExtraction.industry === "manufacturing_cnc", 'CNC industry detected as "manufacturing_cnc"');
  assert(cncExtraction.location === "Coimbatore", 'Location detected as "Coimbatore"');
  assert(cncExtraction.role.experienceLevel === "senior", 'Experience level detected as "senior"');
  assert(cncExtraction.skills.some((s) => s.canonical.slug === "5-axis-cnc-milling"), "5-axis CNC identified");

  // --------------------------------------------------------------------------
  // Test Group 5: Grounding Verification & Hallucination Flagging
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 5] Grounding Verification & Hallucination Flagging");

  // Create a mock provider that hallucinates skills completely absent from source text
  const hallucinatingProvider: AIProvider = {
    name: "mock_hallucinating_ai",
    async generateStructured() {
      return {
        role: "General Assembly Operator",
        industry: "manufacturing_cnc",
        location: "Bengaluru",
        experience_level: "entry_level",
        skills: [
          {
            name: "Deep Quantum Neural Networks", // Absent from source text
            category: "technical",
            proficiency: "expert",
            evidence: "Invented topological quantum circuits on silicon photonics", // Fabricated quote
          },
        ],
      };
    },
  };

  const cleanSimpleText = "Looking for an entry level workshop helper in Bengaluru for basic tool cleanup and sorting.";
  
  const hallucinatedResult = await extractJobSkills(cleanSimpleText, {
    customProvider: hallucinatingProvider,
  });

  const ungroundedSkill = hallucinatedResult.skills[0];
  assert(ungroundedSkill.isGroundedInText === false, "Ungrounded hallucinated skill detected as isGroundedInText === false");
  assert(ungroundedSkill.confidenceScore <= 0.5, `Ungrounded skill confidence heavily penalized (${ungroundedSkill.confidenceScore})`);
  assert(hallucinatedResult.needsReview === true, "Result flagged with needsReview === true");
  assert(
    hallucinatedResult.reviewReasons.some((r) => r.includes("lacks direct verbatim evidence")),
    "Specific audit reason logged for missing evidence quote"
  );

  // --------------------------------------------------------------------------
  // Test Group 6: Malformed Output Schema Validation & Error Handling
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 6] Malformed Output Schema Handling & Retries");

  let attemptCounter = 0;
  const malformedThenSuccessProvider: AIProvider = {
    name: "mock_recovering_ai",
    async generateStructured() {
      attemptCounter++;
      if (attemptCounter === 1) {
        // Return malformed object missing required fields (e.g. missing skills array)
        return { invalid_field: 123 };
      }
      return {
        role: "Maintenance Technician",
        industry: "automotive_ev",
        location: "Pune",
        experience_level: "entry_level",
        skills: [
          {
            name: "EV Battery Diagnostics",
            category: "technical",
            proficiency: "intermediate",
            evidence: "routine EV battery testing",
          },
        ],
      };
    },
  };

  const recoveredResult = await extractJobSkills(
    "Job description for routine EV battery testing in Pune facility.",
    {
      customProvider: malformedThenSuccessProvider,
      maxRetries: 2,
    }
  );

  assert(attemptCounter === 2, "AI service caught malformed schema on attempt 1 and retried successfully");
  assert(recoveredResult.skills.length === 1, "Extracted recovered skill after retry");

  // --------------------------------------------------------------------------
  // Test Group 7: Secret Redaction & Safe Error Logging
  // --------------------------------------------------------------------------
  console.log("\n[Test Group 7] Secret Redaction & Safe Error Logging");
  const errorWithSecret = "Groq API error: 401 Unauthorized for gsk_99a8b7c6d5e4f3a2b1c0 and sk-proj998877665544 with Bearer secret_token_xyz";
  const redacted = redactSecrets(errorWithSecret);

  assert(!redacted.includes("gsk_99a8b7c6d5e4f3a2b1c0"), "Groq API key redacted");
  assert(redacted.includes("[GROQ_KEY_REDACTED]"), "[GROQ_KEY_REDACTED] placeholder applied");
  assert(!redacted.includes("sk-proj998877665544"), "OpenAI API key redacted");
  assert(redacted.includes("[OPENAI_KEY_REDACTED]"), "[OPENAI_KEY_REDACTED] placeholder applied");
  assert(!redacted.includes("secret_token_xyz"), "Bearer token redacted");
  assert(redacted.includes("Bearer [TOKEN_REDACTED]"), "Bearer [TOKEN_REDACTED] placeholder applied");

  // --------------------------------------------------------------------------
  // Summary
  // --------------------------------------------------------------------------
  console.log("\n=============================================================");
  console.log(`   AI Skill Intelligence Test Summary: ${passedCount} PASSED, ${failedCount} FAILED`);
  console.log("=============================================================\n");

  if (failedCount > 0) {
    process.exit(1);
  }
}

runAIIntelligenceTests().catch((err) => {
  console.error("Test execution failed:", err);
  process.exit(1);
});
