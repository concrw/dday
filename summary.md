# Task Summary: Scaffold Create.tsx

## What was done

Replaced `src/pages/Create.tsx` with a clean scaffold that satisfies the task spec exactly.

### State declarations
| Hook | Initial value |
|------|--------------|
| `title` | `""` |
| `date` | `""` |
| `emoji` | `"🎂"` |
| `color` | `"violet"` |
| `submitting` | `false` |
| `error` | `null` |

### Layout
- Outer wrapper: `min-h-screen bg-slate-950 flex items-center justify-center px-4`
- Card: `max-w-md w-full bg-slate-900 rounded-2xl p-6 flex flex-col gap-5`
- Heading: **"New Countdown"** (`text-xl font-bold text-slate-100`)

### Placeholder sections (comments / empty fragments)
- `{/* TitleInput */}`
- `{/* DatePicker */}`
- `{/* EmojiPicker */}`
- `{/* ColorPicker */}`
- `{/* ErrorBanner */}`
- `{/* SubmitButton */}`

### Explicitly excluded (per task spec)
- No `onChange` handlers
- No submit logic / form `onSubmit`
- No Supabase calls

## Files changed
- `src/pages/Create.tsx` — rewritten as scaffold
