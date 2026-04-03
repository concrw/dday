# Task Summary — Create countdowns table migration

**Task ID:** f7a3a4da-f6ca-4f57-8b4a-d2c42abf3fd6  
**Status:** SUCCESS

## What was done

Created `supabase/migrations/20260403000001_create_countdowns.sql` with:

### Table: `countdowns`
| Column | Type | Constraints |
|--------|------|-------------|
| `id` | uuid | PRIMARY KEY, DEFAULT gen_random_uuid() |
| `user_id` | uuid | NOT NULL, FK → auth.users(id) ON DELETE CASCADE |
| `title` | text | NOT NULL, CHECK char_length <= 120 |
| `target_date` | date | NOT NULL |
| `description` | text | CHECK char_length <= 500 |
| `share_token` | text | UNIQUE (populated by trigger) |
| `created_at` | timestamptz | NOT NULL, DEFAULT now() |
| `updated_at` | timestamptz | NOT NULL, DEFAULT now() |

### Indexes
- `idx_countdowns_user_id` — B-tree on `user_id`
- `idx_countdowns_share_token` — UNIQUE B-tree on `share_token`
- `idx_countdowns_target_date` — B-tree on `target_date`

### Trigger functions
1. **`set_updated_at()`** — BEFORE UPDATE: sets `updated_at = now()`
2. **`generate_share_token()`** — BEFORE INSERT: generates URL-safe base64 token from `gen_random_bytes(24)`, retries up to 5 times on collision

### Security
- `ALTER TABLE countdowns ENABLE ROW LEVEL SECURITY;`
- RLS policy stubs documented in rollback comment block for follow-up

### Rollback
Rollback instructions included as a comment block at the top of the migration.

## Next actions
1. Apply migration via Supabase dashboard SQL editor or `supabase db push`
2. Add concrete RLS policies (SELECT/INSERT/UPDATE/DELETE) — stubs provided in the file
3. Run `mcp__claude_ai_Supabase__generate_typescript_types` to update `src/types/database.ts`
