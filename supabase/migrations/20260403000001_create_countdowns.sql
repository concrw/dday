-- =============================================================================
-- Migration: 20260403000001_create_countdowns
-- Description: Create countdowns table with share_token trigger, updated_at
--              trigger, indexes, and RLS
-- =============================================================================

-- ---------------------------------------------------------------------------
-- ROLLBACK BLOCK (run in reverse order to undo this migration):
--
--   DROP TRIGGER IF EXISTS trg_countdowns_updated_at ON countdowns;
--   DROP TRIGGER IF EXISTS trg_countdowns_share_token ON countdowns;
--   DROP FUNCTION IF EXISTS generate_share_token();
--   DROP FUNCTION IF EXISTS set_updated_at();
--   DROP TABLE IF EXISTS countdowns;
--
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- 1. Table
-- ---------------------------------------------------------------------------
CREATE TABLE countdowns (
    id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id      uuid        NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title        text        NOT NULL CHECK (char_length(title) <= 120),
    target_date  date        NOT NULL,
    description  text        CHECK (char_length(description) <= 500),
    share_token  text        UNIQUE,
    created_at   timestamptz NOT NULL DEFAULT now(),
    updated_at   timestamptz NOT NULL DEFAULT now()
);

-- ---------------------------------------------------------------------------
-- 2. Indexes
-- ---------------------------------------------------------------------------
CREATE INDEX idx_countdowns_user_id     ON countdowns (user_id);
CREATE UNIQUE INDEX idx_countdowns_share_token ON countdowns (share_token);
CREATE INDEX idx_countdowns_target_date ON countdowns (target_date);

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
-- 4. generate_share_token() trigger function + BEFORE INSERT trigger
--
--    Generates a URL-safe base64 token from 24 random bytes (32 chars).
--    Retries up to 5 times on unique-key conflict, then raises an exception.
-- ---------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION generate_share_token()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
    candidate  text;
    attempts   int := 0;
    max_tries  constant int := 5;
BEGIN
    -- Only generate if caller did not supply one
    IF NEW.share_token IS NOT NULL THEN
        RETURN NEW;
    END IF;

    LOOP
        attempts := attempts + 1;

        -- encode 24 random bytes as base64, then make URL-safe:
        --   +  ->  -
        --   /  ->  _
        --   =  ->  stripped (padding)
        candidate := replace(replace(replace(
            encode(gen_random_bytes(24), 'base64'),
            '+', '-'),
            '/', '_'),
            '=', '');

        BEGIN
            NEW.share_token := candidate;
            -- Attempt to detect collision by checking the unique index
            PERFORM 1
            FROM countdowns
            WHERE share_token = candidate;

            IF NOT FOUND THEN
                -- No collision, accept the token
                RETURN NEW;
            END IF;
        EXCEPTION
            WHEN unique_violation THEN
                NULL; -- will retry
        END;

        IF attempts >= max_tries THEN
            RAISE EXCEPTION 'generate_share_token: could not generate unique token after % attempts', max_tries;
        END IF;
    END LOOP;
END;
$$;

CREATE TRIGGER trg_countdowns_share_token
    BEFORE INSERT ON countdowns
    FOR EACH ROW
    EXECUTE FUNCTION generate_share_token();

-- ---------------------------------------------------------------------------
-- 5. Row Level Security
-- ---------------------------------------------------------------------------
ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;

-- Note: Specific RLS policies (SELECT/INSERT/UPDATE/DELETE) should be added
-- in a follow-up migration or alongside the application's auth setup.
-- Example policies to add later:
--
--   CREATE POLICY "Users can view own countdowns"
--       ON countdowns FOR SELECT
--       USING (auth.uid() = user_id);
--
--   CREATE POLICY "Users can view shared countdowns by token"
--       ON countdowns FOR SELECT
--       USING (share_token IS NOT NULL);
--
--   CREATE POLICY "Users can insert own countdowns"
--       ON countdowns FOR INSERT
--       WITH CHECK (auth.uid() = user_id);
--
--   CREATE POLICY "Users can update own countdowns"
--       ON countdowns FOR UPDATE
--       USING (auth.uid() = user_id)
--       WITH CHECK (auth.uid() = user_id);
--
--   CREATE POLICY "Users can delete own countdowns"
--       ON countdowns FOR DELETE
--       USING (auth.uid() = user_id);
