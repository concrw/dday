-- Migration: enforce per-owner RLS on dday_events
-- Removes any qual:true (USING (true)) policies and replaces them with
-- user-scoped policies so each row is readable/writable only by its owner.

-- 1. Add user_id column (references auth.users) if it doesn't exist yet
ALTER TABLE public.dday_events
  ADD COLUMN IF NOT EXISTS user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Enable RLS (idempotent)
ALTER TABLE public.dday_events ENABLE ROW LEVEL SECURITY;

-- 3. Drop any existing permissive policies that use USING (true)
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN
    SELECT policyname
    FROM pg_policies
    WHERE schemaname = 'public' AND tablename = 'dday_events'
  LOOP
    EXECUTE format('DROP POLICY IF EXISTS %I ON public.dday_events', pol.policyname);
  END LOOP;
END $$;

-- 4. SELECT: users can only read their own events
CREATE POLICY "owners can select own events"
  ON public.dday_events
  FOR SELECT
  USING (auth.uid() = user_id);

-- 5. INSERT: users can only insert rows with their own user_id
CREATE POLICY "owners can insert own events"
  ON public.dday_events
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 6. UPDATE: users can only update their own events
CREATE POLICY "owners can update own events"
  ON public.dday_events
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. DELETE: users can only delete their own events
CREATE POLICY "owners can delete own events"
  ON public.dday_events
  FOR DELETE
  USING (auth.uid() = user_id);
