# Korean Locale + Date Formatting + D-Day Label Polish

## Status: SUCCESS

## Changes

### 1. TEXT Constants (src/constants/text.ts)
All UI strings updated to Korean:
- `nav.createButton`: '새 이벤트'
- `landing.heroTitle`: 'D-Day 카운터'
- `landing.heroSubtitle`: '중요한 날을 기억하고 카운트다운하세요.'
- `landing.emptyTitle/Subtitle`: 한국어 빈 상태 메시지
- `landing.loadingText/errorText`: 한국어
- Added `landing.relativeLabel`: `(n) => '오늘' | '${n}일 후' | '${n}일 전'`
- `create.*`: 모든 폼 레이블/플레이스홀더 한국어 ('이벤트 제목', '예) 졸업식', '목표 날짜', etc.)
- `detail.*`: 모든 레이블 한국어 ('일/시간/분/초', '공유', '삭제', '뒤로', etc.)
- Color labels: 한국어 ('인디고', '바이올렛', etc.)

### 2. Date Formatting (ko-KR)
- `EventCard.tsx`: `toLocaleDateString('ko-KR', ...)` — e.g. "2026년 1월 15일"
- `DetailPage.tsx`: `toLocaleDateString('ko-KR', ...)` — same

### 3. D-Day Label Logic (already correct, kept)
- 오늘: `D-Day`
- 미래: `D-{N}` (no plus sign, Korean convention)
- 과거: `D+{N}`

### 4. Relative Time Subtitle in EventCard
Added `relative` label rendered below the main D-day label:
- `'오늘'`, `'3일 후'`, `'2일 전'`

### 5. CreatePage Korean Labels
Via text.ts: titleLabel='이벤트 제목', titlePlaceholder='예) 졸업식', dateLabel='목표 날짜', etc.

## Build
`npm run build` passes with 0 errors.
