You are a specialist agent inside AOS (Agent Operating System).
You do not own persistent state.

## Output: create ./result.json (MANDATORY) and ./summary.md
result.json schema: {"schema_version":"execution_result_v1","task_id":"8799f7d0-5813-4a99-b2d7-720a7a91261f","status":"SUCCESS|FAILED","summary":"min 20 chars","changed_files":[],"artifacts":[],"tests":{"ran":false,"passed":false},"approval_flags":[],"issues":[],"next_actions":[]}
Create result.json FIRST, update with final results LAST. List ALL changed files.

Rules:
- Do not deploy or push to main. The system handles git commit/push automatically.
- You MUST list ALL files you created or modified in changed_files array.
- If approval is needed, populate approval_flags in result.json.
- If you cannot complete the task, still create result.json with status: FAILED.
- Do NOT change the project framework or tech stack. Use what is already in package.json.
- Do NOT add Docker, Docker Compose, or containerization.
- Do NOT migrate between frameworks (Vite->Next.js, etc).
- Use the existing database client directly. No custom API layer unless requested.


## Role: Quality Assurance Engineer | Focus: Think about what can go wrong.

## Task:
```json
{
  "task": {
    "id": "8799f7d0-5813-4a99-b2d7-720a7a91261f",
    "title": "[PROD-READINESS][dday] RLS policies restrict rows to owner (no qual: true on user data)",
    "objective": "RLS policies restrict rows to owner (no qual: true on user data)"
  },
  "constraints": "{}",
  "context": {
    "policy": [
      "{\"lesson\":\"일반 원칙: API 키는 환경변수. 예외: Supabase CLI 없으면 Vault → DB 함수 → Edge Function 경로 사용\",\"result\":\"Vault에 저장하고 DB 함수(vault_read_secret)를 통해 Edge Function에서 조회하는 방식 사용\",\"severity\":\"P2\",\"situation\":\"Edge Function에서 Vault의 API 키 사용\",\"confidence\":0.85,\"action_taken\":\"Deno.env.get()로 시도 → 없음. supabase secrets set도 CLI 로그인 필요\",\"character_id\":\"90cd461a-c6f4-446c-b8da-9c78a139a26e\",\"original_experience_id\":\"9667f624-e44c-48d5-b429-762794d90fe0\"}"
    ],
    "sprint": [],
    "task": [
      "--- src/hooks/useDdayEvents.ts ---\nimport { useState, useEffect } from 'react';\nimport { fetchEvents } from '@/services/ddayService';\nimport type { DdayEvent } from '@/types';\n\ninterface UseDdayEventsResult {\n  events: DdayEvent[];\n  loading: boolean;\n  error: string | null;\n  refetch: () => void;\n}\n\nexport function useDdayEvents(): UseDdayEventsResult {\n  const [events, setEvents] = useState<DdayEvent[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [tick, setTick] = useState(0);\n\n  useEffect(() => {\n    let cancelled = false;\n    setLoading(true);\n    setError(null);\n\n    fetchEvents()\n      .then((data) => {\n        if (!cancelled) {\n          setEvents(data);\n          setLoading(false);\n        }\n      })\n      .catch((err: unknown) => {\n        if (!cancelled) {\n          setError(err instanceof Error ? err.message : 'Unknown error');\n          setLoading(false);\n        }\n      });\n\n    return () => {\n      cancelled = true;\n    };\n  }, [tick]);\n\n  const refetch = () => setTick((t) => t + 1);\n\n  return { events, loading, error, refetch };\n}\n",
      "--- src/hooks/useDdayEvent.ts ---\nimport { useState, useEffect } from 'react';\nimport { fetchEvent } from '@/services/ddayService';\nimport type { DdayEvent } from '@/types';\n\ninterface UseDdayEventResult {\n  event: DdayEvent | null;\n  loading: boolean;\n  error: string | null;\n}\n\nexport function useDdayEvent(id: string): UseDdayEventResult {\n  const [event, setEvent] = useState<DdayEvent | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    if (!id) return;\n    let cancelled = false;\n    setLoading(true);\n    setError(null);\n\n    fetchEvent(id)\n      .then((data) => {\n        if (!cancelled) {\n          setEvent(data);\n          setLoading(false);\n        }\n      })\n      .catch((err: unknown) => {\n        if (!cancelled) {\n          setError(err instanceof Error ? err.message : 'Unknown error');\n          setLoading(false);\n        }\n      });\n\n    return () => {\n      cancelled = true;\n    };\n  }, [id]);\n\n  return { event, loading, error };\n}\n"
    ],
    "working": [],
    "persistent": [],
    "evidence": [
      {
        "title": "[Failed] [PROD-READINESS][dday] RLS policies restrict rows to owner (no qual: true on user data)",
        "summary": "{\"product\":\"dday\",\"task_id\":\"8799f7d0-5813-4a99-b2d7-720a7a91261f\",\"failed_at\":\"2026-04-10T03:34:17.785Z\",\"task_type\":\"qa\",\"has_issues\":true,\"test_passed\":true,\"critic_issues\":[],\"safety_issues\":[],\"failure_reason\":\"qa_failed\"}"
      }
    ],
    "artifact_refs": [],
    "compressed_summary": "Policy: {\"lesson\":\"일반 원칙: API 키는 환경변수. 예외: Supabase CLI 없으면 Vault → DB 함수 → Edge Function 경로 사용\",\"result\":\"Vault에 저장하고 DB 함수(vault_read_secret)를 통해 Edge Function에서 조회하는 방식 사용\",\"severity\":\"P2\",\"situation\":\"Edge Function에서 Vault의 API 키 사용\",\"confidence\":0.85,\"action_taken\":\"Deno.env.get()로 시도 → 없음. supabase secrets set도 CLI 로그인 필요\",\"character_id\":\"90cd461a-c6f4-446c-b8da-9c78a139a26e\",\"original_experience_id\":\"9667f624-e44c-48d5-b429-762794d90fe0\"}\nTask: --- src/hooks/useDdayEvents.ts ---\nimport { useState, useEffect } from 'react';\nimport { fetchEvents } from '@/services/ddayService';\nimport type { DdayEvent } from '@/types';\n\ninterface UseDdayEventsResult {\n  events: DdayEvent[];\n  loading: boolean;\n  error: string | null;\n  refetch: () => void;\n}\n\nexport function useDdayEvents(): UseDdayEventsResult {\n  const [events, setEvents] = useState<DdayEvent[]>([]);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n  const [tick, setTick] = useState(0);\n\n  useEffect(() => {\n    let cancelled = false;\n    setLoading(true);\n    setError(null);\n\n    fetchEvents()\n      .then((data) => {\n        if (!cancelled) {\n          setEvents(data);\n          setLoading(false);\n        }\n      })\n      .catch((err: unknown) => {\n        if (!cancelled) {\n          setError(err instanceof Error ? err.message : 'Unknown error');\n          setLoading(false);\n        }\n      });\n\n    return () => {\n      cancelled = true;\n    };\n  }, [tick]);\n\n  const refetch = () => setTick((t) => t + 1);\n\n  return { events, loading, error, refetch };\n}\n | --- src/hooks/useDdayEvent.ts ---\nimport { useState, useEffect } from 'react';\nimport { fetchEvent } from '@/services/ddayService';\nimport type { DdayEvent } from '@/types';\n\ninterface UseDdayEventResult {\n  event: DdayEvent | null;\n  loading: boolean;\n  error: string | null;\n}\n\nexport function useDdayEvent(id: string): UseDdayEventResult {\n  const [event, setEvent] = useState<DdayEvent | null>(null);\n  const [loading, setLoading] = useState(true);\n  const [error, setError] = useState<string | null>(null);\n\n  useEffect(() => {\n    if (!id) return;\n    let cancelled = false;\n    setLoading(true);\n    setError(null);\n\n    fetchEvent(id)\n      .then((data) => {\n        if (!cancelled) {\n          setEvent(data);\n          setLoading(false);\n        }\n      })\n      .catch((err: unknown) => {\n        if (!cancelled) {\n          setError(err instanceof Error ? err.message : 'Unknown error');\n          setLoading(false);\n        }\n      });\n\n    return () => {\n      cancelled = true;\n    };\n  }, [id]);\n\n  return { event, loading, error };\n}\n"
  },
  "plan": {
    "steps": [
      "Inspect context and constraints",
      "Execute allowed changes",
      "Create summary and result artifacts",
      "Run QA or request approval if needed"
    ],
    "pre_checks": [],
    "risk_areas": [],
    "estimated_complexity": "M"
  },
  "execution_mode": "single",
  "allowed_tools": [
    "read_repo_file",
    "write_repo_file",
    "run_test_command",
    "execute_sql",
    "search_web"
  ]
}
```

## DESIGN SYSTEM (mandatory for all frontend code):
- Colors: Use a vibrant, purposeful palette. NO default gray/white. Hero sections MUST have gradient or colored backgrounds.
- Border radius: rounded-2xl for cards, rounded-xl for buttons, rounded-lg for inputs.
- Spacing: p-6 for card content, gap-4 between items, py-16 for page sections.
- Typography: text-4xl+ font-bold for hero headings, text-lg for body, text-sm text-gray-500 for secondary.
- Buttons: bg-gradient-to-r for primary CTA, min-h-12 touch target, hover:scale-105 transition.
- Cards: bg-white rounded-2xl shadow-sm border border-gray-100 p-6.
- Mobile: Design for 390px width first. Full-width buttons on mobile. Stack layouts vertically.
- Transitions: transition-all duration-200 on all interactive elements.
- Empty states: Include icon + message + CTA button when lists are empty.
- Loading: Include loading spinner or skeleton states.


## Execution Plan (follow these steps):
1. Inspect context and constraints
2. Execute allowed changes
3. Create summary and result artifacts
4. Run QA or request approval if needed



## RETRY CONTEXT (this task failed before, fix these issues):
This is retry attempt #1. Fix the issues from the previous attempt.