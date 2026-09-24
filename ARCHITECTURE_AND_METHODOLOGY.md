# Skill Sync AI: System Architecture, Methodology & Technology Stack Specification

**Product:** Skill Sync AI  
**Tagline:** Bridging Industry Demand and Workforce Skills  
**Document Version:** 2.4 Enterprise Edition  
**Platform Target:** Production TVET & State Labour-Market Intelligence Platform  

---

## 1. Executive Summary & Architectural Philosophy

Skill Sync AI is an enterprise-grade labor-market intelligence and workforce skill-alignment platform. Its core objective is to translate dynamic, fast-evolving industrial hiring demand into deterministic, actionable interventions across:
- **Vocational Curricula** (Syllabus updates, obsolete module deprecation)
- **Institutional Capacity** (Seat intake rebalancing, trade expansion)
- **Faculty Competencies** (Instructor upskilling, trade certification)
- **Workshop Equipment** (Machinery Capex planning, laboratory readiness)
- **Candidate Pathways** (Personalized, phased learning roadmaps)

### Core Architectural Tenets
1. **Deterministic Core Analytics:** Critical educational policy, funding allocations, and curriculum audits rely on pure, reproducible mathematical formulas rather than stochastic LLM outputs.
2. **Defensive AI Integration:** Large Language Models (LLMs) are restricted to unstructured-to-structured parsing tasks (job postings $\to$ competencies) with strict PII scrubbing, prompt injection isolation, schema validation, and verbatim evidence grounding.
3. **Relational Topological Integrity:** The entire ecosystem is mapped as a relational graph (via React Flow) linking employers, job roles, skills, courses, modules, instructors, training centers, and geographic districts without hardcoding.
4. **Resilient Multi-Mode Operation:** Built with a resilient dual-mode architecture: seamlessly connects to Supabase PostgreSQL and cloud AI inference (Groq Llama-3) when configured, while operating fully offline with zero 500 errors in verified local demonstration mode.

---

## 2. High-Level System Architecture

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                   CLIENT TIER (BROWSER)                                │
│  Next.js 14 App Router • React Flow Visualizer • Responsive Tailwind UI • Role Context │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │ HTTP / JSON (HTTPS, TLS 1.3)
                                            ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                       BACKEND-FOR-FRONTEND / API GATEWAY TIER                          │
│                                                                                        │
│   ┌───────────────────────┐  ┌───────────────────────────┐  ┌───────────────────────┐  │
│   │ Rate Limiting & CSRF  │  │ RBAC Session Guard        │  │ Secret Redaction      │  │
│   │ (Token Bucket & IP)   │  │ (Admin, Govt, Center, etc)│  │ (Dynamic Log Scrub)   │  │
│   └───────────┬───────────┘  └─────────────┬─────────────┘  └───────────┬───────────┘  │
│               │                            │                            │              │
│               ▼                            ▼                            ▼              │
│   ┌─────────────────────────────────────────────────────────────────────────────────┐  │
│   │                     Server Route Handlers (Next.js Dynamic API)                 │  │
│   │   • /api/ai/extract             • /api/curriculum/xray    • /api/simulator      │  │
│   │   • /api/analytics/radar        • /api/skill-gaps         • /api/career-path    │  │
│   │   • /api/graph                  • /api/employer-validation• /api/health         │  │
│   └────────────────────────────────────────┬────────────────────────────────────────┘  │
└────────────────────────────────────────────┼───────────────────────────────────────────┘
                                             │
                      ┌──────────────────────┴──────────────────────┐
                      ▼                                             ▼
┌───────────────────────────────────────────┐ ┌───────────────────────────────────────────┐
│        AI SKILL INTELLIGENCE SERVICE      │ │       ANALYTICS & SIMULATION ENGINE       │
│                                           │ │                                           │
│  ┌─────────────────────────────────────┐  │ │  ┌─────────────────────────────────────┐  │
│  │ PII Sanitizer & Injection Defense   │  │ │  │ Skill Velocity & Trajectory Models  │  │
│  └──────────────────┬──────────────────┘  │ │  └──────────────────┬──────────────────┘  │
│                     ▼                     │ │                     ▼                     │
│  ┌─────────────────────────────────────┐  │ │  ┌─────────────────────────────────────┐  │
│  │ Canonical Taxonomy Deduplication    │  │ │  │ Curriculum Gap & Obsolete Deduction │  │
│  └──────────────────┬──────────────────┘  │ │  └──────────────────┬──────────────────┘  │
│                     ▼                     │ │                     ▼                     │
│  ┌──────────────────┴──────────────────┐  │ │  ┌──────────────────┴──────────────────┐  │
│  │ Groq Llama-3.3-70b (JSON Mode) OR   │  │ │  │ What-If Policy Simulation Matrix    │  │
│  │ Deterministic Heuristic Provider    │  │ │  │ (Budget, Seat Elasticity, TVET ROI) │  │
│  └─────────────────────────────────────┘  │ │  └─────────────────────────────────────┘  │
└───────────────────────────────────────────┘ └───────────────────────────────────────────┘
                      │                                             │
                      └──────────────────────┬──────────────────────┘
                                             │
                                             ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                              PERSISTENCE & REPOSITORIES                                │
│                                                                                        │
│   ┌───────────────────────────────────────────┐ ┌───────────────────────────────────┐  │
│   │ Supabase PostgreSQL 15 (Cloud/Live)       │ │ Verified Industry Demonstration   │  │
│   │ • 20 Normalized Relational Tables         │ │ Repository (Offline Resilient)    │  │
│   │ • Row-Level Security (RLS) Active         │ │ • Interconnected JSON & CSV Data  │  │
│   │ • Dual-Key Support (JWT Anon & Pub Key)   │ │ • Pre-Indexed Master Taxonomy     │  │
│   └───────────────────────────────────────────┘ └───────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Technology Stack Specification

| Tier / Layer | Technology | Version | Purpose & Architecture Rationale |
| :--- | :--- | :--- | :--- |
| **Frontend Framework** | **Next.js (App Router)** | `14.2.15` | Hybrid Server/Client rendering, optimized route code-splitting, streaming SSR, and secure BFF route handlers. |
| **Language** | **TypeScript** | `5.x` | Strict type safety across business logic, API contracts, Zod schemas, and relational database interfaces. |
| **UI & Styling** | **Tailwind CSS** | `3.4.1` | Utility-first, enterprise design system; zero extraneous CSS bundle overhead; responsive mobile-to-desktop layout. |
| **Component Primitives** | **Radix UI / Shadcn** | Latest | Accessible, headless UI primitives ensuring WAI-ARIA compliance, modal focus traps, and keyboard navigation. |
| **Icons & Visuals** | **Lucide React** | `0.446.0` | Consistent, lightweight SVG iconography across all 16 intelligence and planning screens. |
| **Graph Visualization** | **React Flow (`@xyflow/react`)** | `12.3.2` | High-performance canvas engine with stratified hierarchical layouts, minimap, full-text search, and node inspection. |
| **AI LLM Inference** | **Groq Llama-3.3-70b-versatile** | Cloud API | Fast JSON-mode structured extraction of competencies from raw unstructured text. Confined strictly to server runtime. |
| **AI Fallback Engine** | **Deterministic Heuristic Provider** | Native TS | Zero-latency, zero-cost, offline parsing engine matching canonical taxonomy dictionaries with verbatim text evidence quotes. |
| **Database & Auth** | **Supabase PostgreSQL 15** | Cloud / `@supabase/ssr` | ACID relational storage, Row-Level Security (RLS) authorization, and dual-key compatibility (legacy JWT and modern publishable keys). |
| **Backend Analytics** | **FastAPI / Python Microservice** | `3.12+` / `0.110.0` | High-performance numerical computations, Pandas data aggregation, and Pydantic schema validation. |
| **Schema Validation** | **Zod** | `3.23.8` | Runtime schema enforcement for API payloads, AI extraction outputs, and spreadsheet ingestion validation. |
| **File Parsing** | **XLSX / CSV Parse** | `0.18.5` | In-memory spreadsheet parsing, row-level validation, and duplicate detection for bulk industry job posting imports. |
| **Security Layer** | **Custom Cryptographic Guards** | Native Web Crypto | IP rate limiting, CSRF origin verification, path traversal sanitation, and dynamic runtime secret redaction. |

---

## 4. Algorithmic Methodology & Mathematical Formulations

### 4.1 Labour Market Demand & Skill Velocity Formulas
To eliminate speculative forecasting, skill trajectories are computed using historical and active vacancy-weighted demand signals over rolling observation windows ($T_{current}$ vs $T_{previous}$):

1. **Absolute Posting Frequency ($F_s$):**
   $$\text{F}_s = \sum_{p \in P} \mathbb{I}(s \in p.\text{skills})$$
   Where $P$ is the set of unique job postings in the observation window, and $\mathbb{I}$ is the indicator function.

2. **Vacancy-Weighted Demand ($D_s$):**
   $$\text{D}_s = \sum_{p \in P} (p.\text{vacancies} \cdot \mathbb{I}(s \in p.\text{skills}))$$

3. **Relative Market Demand Fraction ($R_s$):**
   $$\text{R}_s = \frac{\text{F}_s}{|P|}$$

4. **Velocity Growth Rate ($G_s$):**
   $$G_s = \begin{cases} 
   \frac{D_s(t) - D_s(t-1)}{D_s(t-1)} \times 100\% & \text{if } D_s(t-1) > 0 \\
   100.0\% & \text{if } D_s(t-1) = 0 \text{ and } D_s(t) > 0 \\
   0.0\% & \text{if } D_s(t-1) = 0 \text{ and } D_s(t) = 0
   \end{cases}$$

5. **Trajectory Categorization Rules:**
   - **Emerging:** $G_s \ge +150\%$ OR ($D_s(t-1) = 0$ with $D_s(t) \ge 10$ vacancies across $\ge 2$ distinct employers).
   - **Growing:** $+15\% \le G_s < +150\%$.
   - **Stable:** $-15\% \le G_s < +15\%$.
   - **Declining:** $G_s < -15\%$.

---

### 4.2 AI Skill Extraction, Normalization & Evidence Grounding
The AI ingestion pipeline converts noisy job listings into validated competencies through a 5-stage defensive sequence:

```
[Raw Job Description Text]
           │
           ▼
[Stage 1: PII Sanitization]
  • Redacts emails: [EMAIL REDACTED]
  • Redacts phone numbers: [PHONE REDACTED]
  • Redacts profile URLs: [PROFILE URL REDACTED]
           │
           ▼
[Stage 2: Prompt Injection Containment]
  • Isolates text within <untrusted_document_content> tags
  • Neutralizes system override instructions
           │
           ▼
[Stage 3: Structured Inference & Schema Enforcement]
  • Groq Llama-3.3-70b (JSON Mode) OR Deterministic Heuristic Provider
  • Zod schema validation (role, skills, category, proficiency, evidence)
           │
           ▼
[Stage 4: Canonical Entity Deduplication]
  • Strips punctuation, whitespace, and case variants
  • Resolves aliases: "can bus", "can-bus", "canbus" ➔ "Automotive CAN Bus Protocol"
           │
           ▼
[Stage 5: Verbatim Grounding Verification]
  • Verifies that skill.evidence appears verbatim in the source text
  • If evidence missing ➔ Flags isGroundedInText = false, confidence penalized to 0.35
```

---

### 4.3 Curriculum X-Ray & Alignment Diagnostics
Curriculum X-Ray audits compare the set of taught competencies in vocational course $C$ with the required competencies demanded by industry sector $I$:

1. **Curriculum Alignment Score ($A_C$):**
   $$A_C = \frac{|\text{Skills}(C) \cap \text{Skills}(I)|}{|\text{Skills}(I)|} \times 100\%$$

2. **Obsolete Instructional Hours ($H_{obsolete}$):**
   $$H_{obsolete} = \sum_{m \in \text{Modules}(C)} \text{Hours}(m) \cdot \mathbb{I}(\text{Skills}(m) \subseteq \text{DecliningSkills})$$
   *Example:* If an automotive course spends 60 practical hours on legacy carburetor tuning (a declining trade with -85% demand), $H_{obsolete} = 60\text{ hours}$.

3. **Critical Deficit Identification ($Gaps_C$):**
   $$\text{Gaps}_C = \{ s \in \text{Skills}(I) \mid s \notin \text{Skills}(C) \text{ and } \text{Trajectory}(s) \in \{\text{Emerging}, \text{Growing}\} \}$$

---

### 4.4 Employer Validation Consensus & Audit Logging
To prevent speculative curriculum changes, algorithmic recommendations undergo industry review:

1. **Employer Confirmation Ratio ($CR_r$):**
   $$CR_r = \frac{N_{confirmed}}{N_{total\_reviews}} \times 100\%$$
   *Display Format:* `"8 of 10 employers confirmed"` (Transparent evidence fraction).

2. **Hiring Difficulty Index ($HDI_r$):**
   $$HDI_r = \frac{\sum_{i=1}^{n} w_{difficulty}(i)}{n}, \quad w \in \{\text{low: 1, moderate: 2, high: 3, acute\_shortage: 4}\}$$

3. **Immutable Audit Trail:**
   Every review action creates a tamper-evident record:
   $$\text{AuditEntry} = \langle \text{Timestamp}, \text{EmployerID}, \text{Reviewer}, \text{Stance}, \text{Modifications}, \text{IP} \rangle$$

---

### 4.5 What-If Policy Simulation Mathematical Model
The simulator models the downstream economic impact of public TVET budget reallocations:

1. **Capacity Shift Elasticity:**
   $$\Delta \text{Graduates} = \sum_{t \in \text{Trades}} \Delta \text{Seats}_t \times \text{CompletionRate}_t$$

2. **Projected Placement Rate Lift ($\Delta PR$):**
   $$\Delta PR = \sum_{t \in \text{Trades}} \left( \frac{\Delta \text{Seats}_t}{\text{TotalSeats}} \times (PR_{target}(t) - PR_{baseline}) \times \beta_{equipment} \times \beta_{faculty} \right)$$
   Where:
   - $\beta_{equipment} = 1.0 + (0.15 \times \text{ModernizedRatio})$
   - $\beta_{faculty} = 1.0 + (0.12 \times \text{UpskilledTrainerRatio})$

3. **Public TVET Return on Investment (ROI):**
   $$\text{ROI}_{3yr} = \frac{\sum_{i=1}^{\Delta \text{Placed}} (\text{AnnualWage}_i \times 3) - \text{TotalCapex}}{\text{TotalCapex}} \times 100\%$$

---

### 4.6 Skill Graph Topological Stratification
The React Flow Skill Graph structures the vocational ecosystem into 8 relational tiers:

```
[District] ──contains──▶ [Training Center] ──offers──▶ [Course] ──composed_of──▶ [Module]
                                │                                                    │
                             employs                                              teaches
                                ▼                                                    ▼
                            [Trainer] ──────certified_in──────▶ [ SKILL ] ◀──demanded── [ Job Role ]
                                                                    ▲                        ▲
                                                                    │                     publishes
                                                                requires                     │
                                                                    └─────────── [ Employer ]
```

* **Relational Integrity:** Zero hardcoded connections; every edge originates from database junction tables (`course_skills`, `job_skills`, `trainer_skills`, `training_centers.district_id`).
* **Performance:** Rendered using React Flow viewport virtualization (`onlyRenderVisibleElements={true}`) and pre-computed layered layout coordinates.

---

### 4.7 Candidate Career Path Sequencing
The candidate pathway algorithm compares a candidate's profile against an occupational target:

1. **Competency Match Score ($CMS$):**
   $$CMS = \frac{|\text{AcquiredSkills} \cap \text{RequiredSkills}|}{|\text{RequiredSkills}|} \times 100\%$$

2. **Phased Pedagogical Sequencing:**
   Missing skills are ordered into a 4-phase pedagogical curriculum:
   - **Phase 1: Safety, Compliance & Standards** (Prerequisites, LOTO, ISO standards)
   - **Phase 2: Core Physical Subsystems** (Mechanical assembly, diagnostics)
   - **Phase 3: Digital Protocols & Electronics** (CAN Bus, BMS telemetry, G-code)
   - **Phase 4: Capstone Apprenticeship & Integration** (End-to-end industrial project)

---

## 5. End-to-End Operational Workflows

### Workflow 1: Labour Market Signal Ingestion to Curriculum Diagnostic

```
[HR Postings / Spreadsheets]
             │
             ▼
[Data Ingestion Engine] ──(Validates Schema & Sanitizes)──▶ [DB: job_postings]
                                                                  │
             ┌────────────────────────────────────────────────────┘
             ▼
[AI Skill Extractor] ──(PII Scrubbing, Deduplication, Grounding)──▶ [DB: job_skills]
                                                                          │
             ┌────────────────────────────────────────────────────────────┘
             ▼
[Analytics Velocity Engine] ──(Calculates Growth Rates & Trajectories)──▶ [DB: skill_trends]
                                                                                │
             ┌──────────────────────────────────────────────────────────────────┘
             ▼
[Curriculum X-Ray] ──(Audits Syllabi vs Trajectories)──▶ [Actionable Modernization Checklist]
```

### Workflow 2: Employer Validation to Executive Policy Brief

```
[Identified Curriculum Shortfall]
             │
             ▼
[Employer Validation Portal]
  • Review by Tata Motors, LMW, etc.
  • Stances: Confirm (80%+), Modify, Reject
             │
             ▼
[What-If Policy Simulator]
  • Adjust Budget: +₹15 Cr Capex
  • Shift Seats: -40 Legacy ➔ +60 EV Tech
  • Computes: +14.2% Placement Lift
             │
             ▼
[Policy Decision Engine]
  • Generates Phased Implementation Blueprint
  • Allocates Institutional Budgets & Deadlines
  • Ready-to-Sign Brief for State Directors
```

---

## 6. Security, Privacy & Reliability Guarantees

| Security Domain | Architectural Mechanism | Implementation Standard |
| :--- | :--- | :--- |
| **API Secret Protection** | Strict server-side confinement; zero `NEXT_PUBLIC_` prefixes on secrets. | `GROQ_API_KEY` and service role keys are excluded from browser client bundles. |
| **Dynamic Secret Redaction** | `redactSecrets()` sanitizes error messages, logs, and API payloads. | Automatically strips `gsk_*`, `sk-*`, `Bearer *`, and active runtime keys. |
| **PII Scrubbing** | Regex-based detection & redaction before LLM inference. | Replaces emails, phone numbers, and URLs with `[REDACTED]` tokens. |
| **Prompt Injection Defense** | Passive context tag encapsulation. | Encloses untrusted inputs in `<untrusted_document_content>` tags. |
| **Safe Health Check** | `/api/health` reports status without secret leakage. | Returns only boolean status flags (`supabase_configured: bool`). |
| **Rate Limiting** | Token-bucket IP rate limiter on sensitive endpoints. | Restricts AI extraction (20 req/min) and batch imports (20 req/min). |
| **CSRF Defense** | Origin and Host header verification on state-changing requests. | Blocks cross-origin POST, PUT, DELETE requests to `/api/*`. |

---

## 7. Verification & Production Test Suite

Skill Sync AI includes 11 automated test suites comprising **516 total tests**:

```text
========================================================================
             Skill Sync AI — Automated Verification Matrix
========================================================================
  ✓ TypeScript Compilation (npx tsc --noEmit)   : 0 Errors (100% clean)
  ✓ ESLint Static Analysis (npm run lint)       : 0 Warnings, 0 Errors
  ✓ Next.js Production Build (npm run build)    : 100% SUCCESS (27 routes)
------------------------------------------------------------------------
  Test Suite                                      Results
  1. test_synthetic_demo_dataset.ts             : 59 / 59 PASSED
  2. test_skill_graph.ts                        : 49 / 49 PASSED
  3. test_decision_engine.ts                    : 52 / 52 PASSED
  4. test_curriculum_xray.ts                    : 48 / 48 PASSED
  5. test_whatif_simulator.ts                   : 80 / 80 PASSED
  6. test_candidate_career_path.ts              : 38 / 38 PASSED
  7. test_employer_validation.ts                : 37 / 37 PASSED
  8. test_ai_intelligence.ts                    : 58 / 58 PASSED
  9. test_ingestion.ts                          : 23 / 23 PASSED
  10. test_radar_api.ts                         : 55 / 55 PASSED
  11. test_environment_config.ts                : 17 / 17 PASSED
========================================================================
  TOTAL AUTOMATED TESTS VERIFIED                : 516 PASSED / 0 FAILED
========================================================================
```
