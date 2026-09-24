# Skill Sync AI

**Tagline:** Bridging Industry Demand and Workforce Skills  
**Problem Statement ID:** 26134  
**Category:** Evidence-Based Labor-Market Decision Support System  

---

## Overview

**Skill Sync AI** addresses the structural mismatch between rapidly evolving industry requirements and vocational training programs. It provides an automated, auditable platform that converts real-world labor-market signals into actionable curriculum revisions, trainer readiness diagnostics, and district-level workforce capacity plans.

---

## Multi-Stakeholder Roles

The system provides tailored, role-aware interfaces for 5 key personas:
1. **Admin:** System health, taxonomy governance, pipeline orchestration, and schema management.
2. **Government / Policymaker:** District intelligence heatmaps, resource allocation, and What-If workforce policy simulation.
3. **Training Institution:** Automated Curriculum X-Ray, trainer qualification gap audits, and equipment readiness tracking.
4. **Employer:** Curriculum validation loops, critical capability endorsements, and pre-aligned talent sourcing.
5. **Candidate:** Individual skill gap evaluations and personalized learning pathways.

---

## Tech Stack (Phase 1)

- **Frontend:** Next.js 14 (App Router), TypeScript (Strict), Tailwind CSS, shadcn/ui patterns, Lucide React
- **Backend / Edge:** Next.js Route Handlers (`/api/health`, `/auth/callback`)
- **Database & Auth:** Supabase PostgreSQL, Supabase Auth (`@supabase/ssr`), Row-Level Security (RLS)
- **Code Quality:** ESLint, strict TypeScript compiler checking

---

## Quickstart & Setup Instructions

### 1. Prerequisites
- **Node.js:** v18+ (tested on Node v24.14.0)
- **npm:** v9+
- A free **Supabase** account (https://supabase.com)

### 2. Environment Setup

1. Navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```

2. Copy the environment variables template:
   ```bash
   cp .env.example .env.local
   ```

3. Populate `.env.local` with your Supabase credentials:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. Supabase Database Migration

1. In your Supabase Dashboard, open the **SQL Editor**.
2. Run the script located at:
   ```
   database/migrations/001_initial_schema.sql
   ```
3. This creates the `user_role` enum, the `profiles` table, the automated trigger on `auth.users`, and Row Level Security (RLS) policies.

### 4. Running the Application

1. Install frontend dependencies:
   ```bash
   cd frontend
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to:
   - **Landing Page:** [http://localhost:3000](http://localhost:3000)
   - **Dashboard:** [http://localhost:3000/dashboard](http://localhost:3000/dashboard)
   - **Health Check API:** [http://localhost:3000/api/health](http://localhost:3000/api/health)

---

## Verification & Testing Commands

Run strict TypeScript typechecking and ESLint checks:
```bash
cd frontend
npm run lint
npx tsc --noEmit
```

To verify production compilation:
```bash
npm run build
```

---

## Roadmap & Status

- [x] **Phase 1: Foundation, Auth & Dashboard Shell** (Completed)
- [ ] **Phase 2: Job Ingestion & AI Skill Extraction**
- [ ] **Phase 3: Deterministic Curriculum X-Ray & Gap Engine**
- [ ] **Phase 4: District Intelligence & Interactive Visualizations**
- [ ] **Phase 5: What-If Workforce Simulator & Polish**
