# Design System: CSS Tokens + Pretendard Font + Inline Style Removal

## Status: SUCCESS

## Changes

### 1. Pretendard Font
- Installed `@fontsource/pretendard` (400/500/600/700 weights)
- Imported in `main.tsx` and set as default `font-family` in `index.css`
- Configured in Tailwind v4 `@theme` as `--font-sans`

### 2. CSS Custom Properties (Design Tokens)
Defined in both `:root` and `@theme` in `index.css`:
- `--color-primary: #6366F1` (indigo)
- `--color-primary-dark: #4F46E5`
- `--color-accent: #F59E0B` (amber)
- `--color-accent-dark: #D97706`
- `--color-bg: #F8FAFC`
- `--color-surface: #FFFFFF`
- `--color-text: #1F2937`
- `--color-text-secondary: #6B7280`
- `--color-text-muted: #9CA3AF`
- `--color-error: #EF4444`
- `--color-border: #E5E7EB`
- `--radius-card: 16px`, `--radius-button: 12px`
- `--shadow-card` for consistent card shadows

### 3. Inline Style Removal
Replaced all static `style={{}}` props across 7 components with Tailwind utility classes:
- `EventCard.tsx`, `LandingPage.tsx`, `DetailPage.tsx`, `CreatePage.tsx`, `NavBar.tsx`, `CountdownBlock.tsx`, `LoadingSpinner.tsx`

Only 4 inline styles remain for dynamic user-chosen accent colors (cannot be static).

### 4. Border Radius Consistency
- Cards: `rounded-2xl` (16px)
- Buttons: `rounded-xl` (12px)
- Inputs: `rounded-lg`

### 5. Color Palette Update
Updated default accent to `#6366F1` (indigo). Color picker options: Indigo, Violet, Amber, Red, Emerald, Pink, Cyan.

## Build
`npm run build` passes with 0 errors.
