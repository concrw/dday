# RLS Owner Policies — Implementation Summary

## Status: SUCCESS

## Problem
The `dday_events` table had no user-scoped RLS (effectively `USING (true)`), allowing any authenticated user to read and mutate every other user's events.

## Changes

### `supabase/migrations/20260410000000_rls_owner_policies.sql` (new)
- Adds `user_id uuid REFERENCES auth.users(id)` column (idempotent `ADD COLUMN IF NOT EXISTS`)
- Enables RLS on `dday_events`
- Drops ALL existing policies via a `pg_policies` loop (eliminates any leftover `USING (true)` policy)
- Creates four owner-scoped policies:
  - **SELECT** `USING (auth.uid() = user_id)`
  - **INSERT** `WITH CHECK (auth.uid() = user_id)`
  - **UPDATE** `USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id)`
  - **DELETE** `USING (auth.uid() = user_id)`

### `src/types/index.ts`
- Added `user_id: string` to `DdayEvent` interface to match the new column

### `src/services/ddayService.ts`
- `createEvent` now calls `supabase.auth.getUser()` and injects `user_id: user.id` into the insert payload
- Throws `'Not authenticated'` if no session, preventing a silent RLS rejection

## Build
`npm run build` — 89 modules transformed, 0 errors, built in 148ms.
