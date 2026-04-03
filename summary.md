# Task Summary — Wire typed Supabase client

**Task ID:** 96c4e4b4-7012-4ca8-ab4d-2b40e6817e86  
**Status:** SUCCESS

## What was done

Created `src/lib/supabase.ts` — the single source of truth for all Supabase access in the app.

### Exported types

| Type | Purpose |
|------|---------|
| `Countdown` | Full row shape returned from SELECT |
| `CountdownInsert` | Shape required for INSERT (user_id, title, target_date required) |
| `CountdownUpdate` | Partial shape for UPDATE (all fields optional) |
| `Database` | Root generic passed to `createClient<Database>` |

All types mirror the `countdowns` table schema from migration `20260403000001_create_countdowns.sql`:
`id · user_id · title · target_date · description · share_token · created_at · updated_at`

### Exported clients

| Export | Auth session | Use case |
|--------|-------------|----------|
| `supabase` | persisted (default) | Authenticated CRUD — RLS enforced via user JWT |
| `supabaseAnon` | `persistSession: false`, `autoRefreshToken: false` | Unauthenticated share-token reads |

### Runtime env-var guards

Both `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` are checked at module load time. Missing values throw descriptive errors before any network call is made.

## Next actions
1. Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to `.env` (and `.env.example` for documentation)
2. Add concrete RLS policies for the countdowns table (stubs in migration file)
3. Implement `src/services/countdowns.ts` using the exported `supabase` / `supabaseAnon` clients
