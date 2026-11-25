-- Kwa Mathe: per-user cloud data store
-- Apply this migration to the Neon production branch only after reviewing it.
-- This intentionally stores the existing local application state as one JSONB
-- document first, so migration is lossless. Normalized tables can follow later.

CREATE TABLE IF NOT EXISTS public.kwa_mathe_user_data (
  user_id TEXT PRIMARY KEY,
  data JSONB NOT NULL DEFAULT '{}'::jsonb,
  schema_version INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CONSTRAINT kwa_mathe_user_data_object CHECK (jsonb_typeof(data) = 'object')
);

CREATE INDEX IF NOT EXISTS kwa_mathe_user_data_updated_at_idx
  ON public.kwa_mathe_user_data (updated_at DESC);

-- RLS is enabled now so the table is never accidentally exposed through a
-- future browser-facing API without an ownership policy.
ALTER TABLE public.kwa_mathe_user_data ENABLE ROW LEVEL SECURITY;

-- Access policies will be added with the chosen authenticated data-access
-- path. Until then, direct access is restricted to the database owner/server.
