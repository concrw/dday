-- =============================================================================
-- Migration: 20260403000001_create_countdowns
-- Description: Create countdowns table with RLS policies and updated_at trigger
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ROLLBACK (run in reverse order to undo):
--
--   DROP POLICY IF EXISTS "Users can delete own countdowns" ON countdowns;
--   DROP POLICY IF EXISTS "Users can update own countdowns" ON countdowns;
--   DROP POLICY IF EXISTS "Users can insert own countdowns" ON countdowns;
--   DROP POLICY IF EXISTS "Users can view own countdowns" ON countdowns;
--   DROP TRIGGER IF EXISTS trg_countdowns_updated_at ON countdowns;
--   DROP FUNCTION IF EXISTS set_updated_at();
--   DROP TABLE IF EXISTS countdowns;
--
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
CREATE TABLE countdowns (
    id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id     uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    emoji       text        NOT NULL DEFAULT '🎉',
    title       text        NOT NULL CHECK (char_length(title) <= 100),
    target_date date        NOT NULL,
    notes       text        CHECK (char_length(notes) <= 500),
    created_at  timestamptz NOT NULL DEFAULT now(),
    updated_at  timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Index
-- ---------------------------------------------------------------------------
CREATE INDEX idx_countdowns_user_id_target_date ON countdowns (user_id, target_date);

-- ---------------------------------------------------------------------------
-- 3. set_updated_at() trigger function + BEFORE UPDATE trigger
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$;

CREATE TRIGGER trg_countdowns_updated_at
    BEFORE UPDATE ON countdowns
    FOR EACH ROW
    EXECUTE FUNCTION set_updated_at();

-- ---------------------------------------------------------------------------
-- 4. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own countdowns"
    ON countdowns FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own countdowns"
    ON countdowns FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own countdowns"
    ON countdowns FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own countdowns"
    ON countdowns FOR DELETE
    USING (auth.uid() = user_id);
