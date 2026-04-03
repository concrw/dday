# Task Summary: Database migration — countdowns table with RLS and updated_at trigger

**Task ID:** 98e03854-b19b-4aff-a273-840f1e5ddbae
**Status:** SUCCESS

## What was done

### Migration file rewritten: `supabase/migrations/20260403000001_create_countdowns.sql`

**Table `countdowns`:**

| Column | Type | Constraints |
|---|---|---|
| `id` | uuid | PRIMARY KEY DEFAULT gen_random_uuid() |
| `user_id` | uuid | NOT NULL, FK auth.users(id) ON DELETE CASCADE |
| `emoji` | text | NOT NULL DEFAULT '🎉' |
| `title` | text | NOT NULL CHECK char_length <= 100 |
| `target_date` | date | NOT NULL |
| `notes` | text | CHECK char_length <= 500 |
| `created_at` | timestamptz | NOT NULL DEFAULT now() |
| `updated_at` | timestamptz | NOT NULL DEFAULT now() |

**Index:** composite `(user_id, target_date)` — supports the primary list query pattern.

**Trigger:** `trg_countdowns_updated_at` BEFORE UPDATE calls `set_updated_at()` to stamp `updated_at = now()`.

**RLS:** Enabled. Four active policies scoped to `auth.uid() = user_id`:
- SELECT: USING clause
- INSERT: WITH CHECK clause
- UPDATE: both USING and WITH CHECK
- DELETE: USING clause

### Types updated: `src/lib/supabase.ts`

- Added `emoji: string` to `Countdown`, `CountdownInsert`, `CountdownUpdate`
- Renamed `description` → `notes` across all interfaces
- Removed `share_token` (not in spec)
- Removed `supabaseAnon` export (no share-token flow in spec)

## Spec deviations corrected from prior migration

| Item | Before | After |
|---|---|---|
| `emoji` column | missing | added, NOT NULL DEFAULT '🎉' |
| column name | `description` | `notes` |
| `title` CHECK | <= 120 | <= 100 |
| `share_token` column | present | removed |
| `share_token` trigger/function | present | removed |
| Index | separate single-column indexes | composite `(user_id, target_date)` |
| RLS policies | commented-out examples | 4 active policies |

## Next actions
1. Apply migration to Supabase project
2. Implement `src/services/countdowns.ts` using the exported `supabase` client
3. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env`
