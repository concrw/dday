# Task Summary — Supabase client, anonymous auth, and app router setup

**Task ID:** f41c39c6-6c0d-4551-9b22-02d9345f1a83  
**Status:** SUCCESS

## What was done

### `src/context/AuthContext.tsx` (new)
- `AuthProvider` checks for an existing Supabase session on mount via `getSession()`
- If no session, calls `supabase.auth.signInAnonymously()` automatically
- Exposes `userId: string | null` through `useAuth()` hook
- Renders a full-screen loading state (`bg-[#0F172A]`) while the session initialises
- Subscribes to `onAuthStateChange` to keep `userId` in sync across tab events

### `src/constants/text.ts` (new)
- Centralises all user-facing strings (`LOADING_TEXT`) per the no-hardcoded-text quality rule

### `src/pages/Home.tsx` (new)
- Minimal scaffold; receives content in subsequent tasks (CountdownList, FloatingAddButton, etc.)

### `src/pages/CreateEdit.tsx` (new)
- Minimal scaffold; receives content in subsequent tasks (EmojiPicker, TitleInput, DateInput, etc.)

### `src/App.tsx` (updated)
- Both page components lazy-imported (`React.lazy`)
- Routes defined: `/ → Home`, `/new → CreateEdit`, `/edit/:id → CreateEdit`
- `<Suspense>` wraps all routes with a full-screen `PageLoader` fallback

### `src/main.tsx` (updated)
- `<AuthProvider>` inserted between `<BrowserRouter>` and `<App>` so auth state is available app-wide

## Architecture notes
- `supabase.ts` (previous task) remains unchanged — typed client already in place
- Anonymous session is initialised once at app boot; all downstream data calls use the persisted JWT
- Lazy loading ensures page chunks are only fetched when routes are first visited

## Next actions
1. Implement Home page: `CountdownList`, `CountdownCard`, `EmptyState`, `FloatingAddButton`, `DeleteConfirmDialog`
2. Implement CreateEdit page: `BackButton`, `EmojiPicker`, `TitleInput`, `DateInput`, `NotesTextarea`, `SubmitButton`
3. Add `src/services/countdowns.ts` with CRUD operations using the `supabase` client
4. Add RLS policies for anonymous users on the `countdowns` table
