-- ==============================================================================
-- Skill Sync AI (Problem Statement ID 26134)
-- Migration 005: Data Ingestion Tracking Tables & Audit Logs
-- ==============================================================================

DO $$ BEGIN
  CREATE TYPE dataset_type_enum AS ENUM (
    'job_postings',
    'courses',
    'curriculum',
    'trainers',
    'equipment',
    'placements',
    'employer_surveys'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE ingestion_status_enum AS ENUM (
    'pending',
    'validating',
    'processing',
    'completed',
    'failed'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

CREATE TABLE IF NOT EXISTS public.ingestion_jobs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  dataset_type dataset_type_enum NOT NULL,
  filename TEXT NOT NULL,
  sanitized_filename TEXT NOT NULL,
  file_size_bytes BIGINT NOT NULL CHECK (file_size_bytes >= 0),
  file_hash_sha256 TEXT,
  storage_path TEXT,
  status ingestion_status_enum NOT NULL DEFAULT 'pending',
  total_rows INT NOT NULL DEFAULT 0 CHECK (total_rows >= 0),
  valid_rows INT NOT NULL DEFAULT 0 CHECK (valid_rows >= 0),
  invalid_rows INT NOT NULL DEFAULT 0 CHECK (invalid_rows >= 0),
  imported_rows INT NOT NULL DEFAULT 0 CHECK (imported_rows >= 0),
  processing_duration_ms INT NOT NULL DEFAULT 0 CHECK (processing_duration_ms >= 0),
  error_summary TEXT,
  is_demo BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TRIGGER trg_ingestion_jobs_updated_at
  BEFORE UPDATE ON public.ingestion_jobs
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TABLE IF NOT EXISTS public.ingestion_errors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id UUID NOT NULL REFERENCES public.ingestion_jobs(id) ON DELETE CASCADE,
  row_index INT NOT NULL CHECK (row_index >= 0),
  column_name TEXT,
  error_message TEXT NOT NULL,
  raw_data JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_status ON public.ingestion_jobs(status);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_created ON public.ingestion_jobs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ingestion_jobs_hash ON public.ingestion_jobs(file_hash_sha256);
CREATE INDEX IF NOT EXISTS idx_ingestion_errors_job ON public.ingestion_errors(job_id);

-- RLS
ALTER TABLE public.ingestion_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ingestion_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public Read: Ingestion jobs"
  ON public.ingestion_jobs FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage ingestion jobs"
  ON public.ingestion_jobs FOR ALL
  TO authenticated USING (public.is_admin_or_govt());

CREATE POLICY "Public Read: Ingestion errors"
  ON public.ingestion_errors FOR SELECT
  TO authenticated USING (true);

CREATE POLICY "Admin/Govt: Manage ingestion errors"
  ON public.ingestion_errors FOR ALL
  TO authenticated USING (public.is_admin_or_govt());
