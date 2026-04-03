# Task Summary: Wire Create Form Fields

## What was done

Fully wired `src/pages/Create.tsx` with controlled inputs, validation, and Supabase insert.

### New files
- **`src/lib/supabase.ts`** — Supabase client using `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` env vars (no secrets in source)
- **`src/services/countdowns.ts`** — `insertCountdown(data)` service function; components never call Supabase directly
- **`src/constants/text.ts`** — All user-facing UI strings; no hardcoded text in components

### Modified files
- **`src/pages/Create.tsx`** — Fully wired form:
  - `TitleInput`: controlled `<input type="text">` with `onChange`
  - `DatePicker`: controlled `<input type="date">` with `min=today` constraint
  - `EmojiPicker`: uses existing `EmojiSelector` component
  - `ColorPicker`: 5 color swatches (violet/rose/sky/amber/emerald) with active ring state
  - `ErrorBanner`: renders `error` state with red themed styling
  - `SubmitButton`: disabled while submitting, shows "Creating..." feedback
  - `handleSubmit`: validates title non-empty + date strictly > today, calls `insertCountdown`, navigates to `/` on success, sets error state on DB failure

## Validation logic
- Title empty: "Title is required."
- Date missing or <= today: "Please choose a future date."
- DB error: "Something went wrong. Please try again."

## Session handling
- `session_id` persisted in `localStorage` (created once per browser, reused across visits)
- `share_token` is a new `crypto.randomUUID()` per submission
