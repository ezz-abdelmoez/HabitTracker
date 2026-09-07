# FULL PROJECT PROMPT — عاداتي · منصة تتبع العادات (Next.js + Mock-first API)

> **How to use this file**
> Copy everything below the horizontal rule into your AI coding assistant (Cursor / Windsurf / Claude Code / ChatGPT) as the complete project prompt.
> It merges two sources:
> 1. The reference frontend architecture (the "existing strategy" — same as the educational-platform prompt): transport-adapter API layer, mock/http modes, contracts + Zod, TanStack Query modules, fixture store, thin App-Router pages, Vitest mock-workflow tests.
> 2. The product specification for a personal **Habit Tracker** — Arabic-first (RTL) — built directly from `happit-tracker-basic-info.txt`: the user's real habits (German A1, English B1→B2, HappyShare development, the Baccalaureate web project, Hawai'i ICT cloud course, portfolio building, job hunting) plus his operating principles (Tuesday-evening planning, flow matching, the 50 h/week cap, cue–response scripts, recovery optimization).
>
> Do not start coding until you have read this entire document. Follow the phases in order. Every phase gate must pass before moving on.

---

# 1. Role & Mission

You are building **"عاداتي"** — a modern, Arabic-first (RTL) **habit-tracking platform** for a single dedicated user who is juggling language learning, real product development, a competition track, career building, and school — and needs one system that keeps every commitment **alive, measured, and humane**.

The product must feel like a real habit platform, not a to-do list: structured habit categories, per-habit schedules (daily / N-per-week / fixed day), fast daily **check-in** (done / partial / skipped + minutes + energy + note), **streaks** that reward "جزء" over zero, a weekly **heatmap**, a **Tuesday-evening planning ritual** (goals → weekly tasks → if–then scripts), a week **review** screen, and a local dashboard that guards the **50 h/week hard cap** (flow matching).

**Hard constraint for v1:** Frontend-only. No backend, no database, no real authentication, no external API. All data comes from local JSON fixtures + a deterministic seeded history generator. **But the architecture must be built exactly as if a backend will be introduced tomorrow** — the UI must never touch JSON directly.

The architecture you must reproduce is the **mock-first transport-adapter pattern**:

```txt
UI
 ↓  (@tanstack/react-query hooks / server functions)
Endpoint Factory  (typed operations, Zod-validated)
 ↓
Transport         (mock transport  ←→  fetch transport)
 ↓
Contract + Schema + Fixture (JSON)  →  future REST API
```

Switching from demo data to a real API is **an environment-flag change only** (`NEXT_PUBLIC_API_MODE=mock` → `http`). No UI component is rewritten.

---

# 2. Technology Stack (exact)

| Category | Package | Notes |
|---|---|---|
| Framework | `next` **15+** (App Router) | Use latest stable; default TypeScript |
| Language | `typescript` ^5.x | `strict: true` |
| UI | `react` 19.x, `react-dom` 19.x | |
| Styles | `tailwindcss` ^4.x + `@tailwindcss/postcss` + `tw-animate-css` | CSS-first via `app/globals.css` |
| UI kit | shadcn/ui (`components.json`: style `new-york`, `rsc: true`, `tsx: true`, base color `neutral`, css variables `true`) + `radix-ui`/individual `@radix-ui/react-*` primitives | Install only what's used |
| Icons | `lucide-react` | |
| Data fetching | `@tanstack/react-query` ^5 + `@tanstack/react-query-devtools` | Required |
| Validation | `zod` ^3.24 | Request + response contracts |
| Forms | `react-hook-form` ^7 + `@hookform/resolvers` | Check-in form + week-plan form |
| Theme | `next-themes` | Dark/light/system |
| Toasts | `sonner` | |
| Markdown | `react-markdown` + `remark-gfm` + `rehype-slug` | Habit notes + plan text; **no** code-highlight stack (this is not a coding platform) |
| Dates | `date-fns` | Week math, ISO date keys |
| Debounce | `use-debounce` | Habit search |
| Misc helpers | `clsx`, `tailwind-merge`, `class-variance-authority` | |
| HTTP | native `fetch` (transport uses fetch) | |
| Test | `vitest` ^4 + `@types/node` | Mock workflow suite |
| Package manager | `pnpm` | |

**Do NOT use:** Express, NestJS, MongoDB, PostgreSQL, Prisma, Firebase, Supabase, tRPC, any external backend, any CSS framework other than Tailwind, **any chart library** (heatmap / sparklines / gauges are hand-built from divs + Tailwind), no service-worker PWA in v1 (manifest + meta tags only, optional).

## 2.1 Project setup (run first, at the repo root)

```bash
pnpm create next-app@latest aadati-habit-tracker \
  --ts --tailwind --eslint --app --src-dir --import-alias "@/*" --use-pnpm
cd aadati-habit-tracker
pnpm dlx shadcn@latest init        # style: new-york, base color: neutral, css variables: true
pnpm dlx shadcn@latest add button card badge breadcrumb skeleton tabs accordion dialog sheet
pnpm dlx shadcn@latest add progress checkbox radio-group select input label form separator textarea tooltip popover alert
pnpm add @tanstack/react-query @tanstack/react-query-devtools zod next-themes sonner lucide-react
pnpm add react-markdown remark-gfm rehype-slug use-debounce date-fns react-hook-form @hookform/resolvers
pnpm add -D vitest @types/node
```

## 2.2 `package.json` scripts

```json
{
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint .",
    "test:mock": "vitest run tests/mock-workflows.test.ts",
    "test:unit": "vitest run tests/streak-engine.test.ts tests/date-utils.test.ts"
  }
}
```

## 2.3 `tsconfig.json` paths (same aliases as the reference project)

```json
{
  "compilerOptions": {
    "strict": true,
    "paths": {
      "@/*": ["./src/*"],
      "@/components/*": ["./src/components/*"],
      "@/lib/*": ["./src/lib/*"],
      "@/lib/api/*": ["./src/lib/api/*"],
      "@/hooks/*": ["./src/hooks/*"],
      "@/constants/*": ["./src/constants/*"],
      "@/types/*": ["./src/types/*"],
      "@/utils/*": ["./src/utils/*"]
    }
  }
}
```

## 2.4 PostCSS + Tailwind 4

`postcss.config.mjs`:

```js
const config = { plugins: { "@tailwindcss/postcss": {} } };
export default config;
```

`app/globals.css` starts with:

```css
@import "tailwindcss";
@import "tw-animate-css";

@custom-variant dark (&:is(.dark *));

@theme inline {
  --font-sans: var(--font-cairo), Tahoma, Arial, ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-jetbrains), ui-monospace, SFMono-Regular, Menlo, monospace;
  /* shadcn color tokens mapped from :root / .dark CSS variables */
}
```

## 2.5 `next.config.ts`

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT set typescript.ignoreBuildErrors — TypeScript must be clean.
  images: { unoptimized: true }, // static mock assets served from /public
};

export default nextConfig;
```

---

# 3. Environment Configuration

```dotenv
# mock keeps the full frontend functional without a backend.
# http switches the same endpoint modules to a real API later.
NEXT_PUBLIC_API_MODE=mock

# Browser requests must remain relative for production, previews, and mobile.
NEXT_PUBLIC_API_BASE_PATH=/api

# Server-only URL for the future backend. Never expose secrets with NEXT_PUBLIC_.
API_INTERNAL_URL=http://localhost:5067
API_TIMEOUT_MS=15000

# Local drafts/settings persistence: local (localStorage) now; api later.
NEXT_PUBLIC_APP_STATE_MODE=local

# Mock check-in history seeding (demo realism; ignored in http mode).
NEXT_PUBLIC_MOCK_HISTORY_WEEKS=8
```

`src/lib/api/config.ts`:

```ts
export type ApiMode = "mock" | "http";
export type AppStateMode = "local" | "api";

export const apiConfig = {
  mode: process.env.NEXT_PUBLIC_API_MODE === "http" ? ("http" as const) : ("mock" as const),
  browserBasePath: process.env.NEXT_PUBLIC_API_BASE_PATH || "/api",
  serverOrigin: process.env.API_INTERNAL_URL || "",
  timeoutMs: 15_000,
  appStateMode: process.env.NEXT_PUBLIC_APP_STATE_MODE === "api" ? ("api" as const) : ("local" as const),
} as const;
```

`src/constants/habits.ts` (single source of truth — never re-inline these numbers in components):

```ts
export const WEEK_START_DAY = 6;          // Saturday — first day of the week (JS getDay index)
export const PLANNING_DAY = 2;            // Tuesday — weekly planning ritual (evening)
export const CAP_WEEKLY_MINUTES = 3000;   // 50h/week — "50 hours per week is the highest" (flow-matching guardrail)
export const MINUTE_PRESETS = [15, 30, 45, 60, 90, 120];
export const ENERGY_LABELS = ["مثقل", "متعب", "عادي", "نشيط", "في حالة تدفق"] as const; // index 0..4 → energy 1..5
export const STORAGE_KEYS = {
  appState: "aadati-appstate-v1",
  mockDb: "aadati-mockdb-v1",
} as const;
```

---

# 4. Complete File Structure (target)

```txt
aadati-habit-tracker/
├── .env.example
├── .gitignore
├── components.json                      # shadcn config
├── eslint.config.mjs                    # eslint-config-next/core-web-vitals + typescript
├── next.config.ts
├── package.json
├── postcss.config.mjs
├── pnpm-lock.yaml
├── tsconfig.json
│
├── app/
│   ├── globals.css
│   ├── layout.tsx                       # <html lang="ar" dir="rtl"> + providers
│   ├── loading.tsx                      # global skeleton
│   ├── error.tsx                        # "use client" global error
│   ├── not-found.tsx                    # global 404
│   │
│   └── (public)/
│       ├── layout.tsx                   # SiteHeader + SiteFooter + breadcrumb container
│       ├── page.tsx                     # Home
│       ├── today/
│       │   ├── page.tsx                 # Today driver (client, useToday)
│       │   └── loading.tsx
│       ├── habits/
│       │   ├── page.tsx                 # Habit list + search + filters
│       │   └── [slug]/
│       │       ├── page.tsx             # Habit detail (server shell + client stats)
│       │       ├── not-found.tsx
│       │       ├── loading.tsx
│       │       └── checkin/
│       │           ├── page.tsx         # Check-in runner (server fetches template)
│       │           └── loading.tsx
│       ├── categories/
│       │   ├── page.tsx
│       │   └── [slug]/page.tsx
│       ├── planning/
│       │   └── page.tsx                 # Tuesday-evening week planner
│       ├── review/
│       │   ├── page.tsx                 # Redirects to current week
│       │   └── [weekStart]/page.tsx     # Week review (result + per-day review)
│       ├── dashboard/
│       │   ├── page.tsx
│       │   └── loading.tsx
│       └── about/
│           └── page.tsx                 # Static: mission + the operating method
│
├── public/
│   └── habits/
│       ├── german-a1/
│       │   ├── files/خطة-A1.pdf
│       │   ├── files/قائمة-تحقق-الكتابة.md
│       │   └── images/خريطة-السلسلة.png
│       └── happyshare-dev/files/خطة-السبرينت.md …
│
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── site-header.tsx
│   │   │   ├── site-footer.tsx
│   │   │   ├── mobile-nav.tsx
│   │   │   ├── theme-toggle.tsx
│   │   │   └── site-breadcrumbs.tsx
│   │   ├── habits/
│   │   │   ├── habit-card.tsx
│   │   │   ├── habit-grid.tsx
│   │   │   ├── habit-card-skeleton.tsx
│   │   │   ├── habit-filter-bar.tsx
│   │   │   ├── habit-search.tsx
│   │   │   ├── habit-detail.tsx             # client, consumes hooks
│   │   │   ├── habit-header.tsx
│   │   │   ├── habit-schedule-chip.tsx        # "5 أيام · 45 د"
│   │   │   ├── habit-content.tsx              # why / plan / cues / tips
│   │   │   ├── markdown-note.tsx              # react-markdown wrapper
│   │   │   ├── habit-resources.tsx
│   │   │   ├── resource-item.tsx
│   │   │   ├── streak-summary-card.tsx
│   │   │   ├── habit-navigation.tsx           # prev/next within category
│   │   │   └── week-heatmap.tsx               # div-grid, RTL-safe
│   │   ├── checkin/
│   │   │   ├── checkin-container.tsx          # client form shell
│   │   │   ├── checkin-field-status.tsx       # radio: done / partial / skipped
│   │   │   ├── checkin-field-multi.tsx        # checkbox group (skills…)
│   │   │   ├── checkin-field-number.tsx       # minutes / count + presets
│   │   │   ├── checkin-field-rating.tsx       # energy 1..5 big cards
│   │   │   ├── checkin-field-text.tsx         # note
│   │   │   ├── checkin-outcome.tsx            # streak went up! screen
│   │   │   └── today-habit-row.tsx            # row + inline quick-checkin dialog
│   │   ├── planning/
│   │   │   ├── week-planner.tsx               # client form (goals/tasks/if-then)
│   │   │   ├── plan-goals-section.tsx
│   │   │   ├── plan-tasks-section.tsx
│   │   │   └── plan-ifthen-section.tsx        # "لو … إذن …" scripts
│   │   ├── dashboard/
│   │   │   ├── dashboard-shell.tsx
│   │   │   ├── weekly-rate-card.tsx
│   │   │   ├── cap-gauge.tsx                  # minutes vs 50h cap (flow matching)
│   │   │   ├── best-streaks-card.tsx
│   │   │   ├── continue-habits.tsx            # "كمل من حيث وقفت"
│   │   │   └── recent-activity-list.tsx
│   │   ├── home/
│   │   │   ├── home-page.tsx
│   │   │   ├── hero-section.tsx
│   │   │   ├── today-pulse-section.tsx        # compact today preview
│   │   │   ├── stats-section.tsx
│   │   │   ├── categories-section.tsx
│   │   │   └── method-section.tsx             # the principles as feature cards
│   │   ├── shared/
│   │   │   ├── api-query-error.tsx
│   │   │   ├── empty-state.tsx
│   │   │   ├── page-header.tsx
│   │   │   ├── page-container.tsx
│   │   │   └── date-nav.tsx                   # prev/next week/month navigation
│   │   └── ui/                                # shadcn components only
│   │
│   ├── lib/
│   │   ├── utils.ts                           # cn()
│   │   ├── dates.ts                           # toISODate / addDays / startOfWeek / weekRange — pure
│   │   ├── site-config.ts                     # name, URL, nav, metadata defaults
│   │   ├── query-client.tsx                   # "use client" QueryProvider
│   │   ├── streaks/
│   │   │   └── streak-engine.ts               # pure compute/validate engine (unit-tested)
│   │   ├── app-state/
│   │   │   ├── app-state-repository.ts        # interface + factory
│   │   │   ├── local-app-state-repository.ts  # localStorage impl (drafts, settings, last visited)
│   │   │   └── storage.ts                     # safe read/write helpers
│   │   └── api/
│   │       ├── config.ts
│   │       ├── contracts/
│   │       │   ├── common.ts
│   │       │   ├── home.ts
│   │       │   ├── category.ts
│   │       │   ├── habit.ts
│   │       │   ├── checkin.ts
│   │       │   ├── plan.ts
│   │       │   └── stats.ts
│   │       ├── schemas/
│   │       │   ├── common.ts
│   │       │   └── habits.ts                  # Zod contracts for every DTO
│   │       ├── transport/
│   │       │   ├── types.ts                   # ApiTransport, ApiClient, RequestOptions
│   │       │   ├── fetch-transport.ts
│   │       │   ├── query.ts                   # withQuery()
│   │       │   └── errors.ts                  # ApiError, isApiError
│   │       ├── client/
│   │       │   ├── api-client.ts              # request/response Zod validation wrapper
│   │       │   ├── browser-client.ts          # picks mock vs fetch transport
│   │       │   ├── server-client.ts           # "server-only", cookies forwarding
│   │       │   └── scoped-client.ts           # personalApi
│   │       ├── mock/
│   │       │   ├── mock-transport.ts          # in-memory "backend"
│   │       │   ├── mock-store.ts              # fixture seeding + history seeding + sessionStorage persistence
│   │       │   ├── seed-rng.ts                # mulberry32 deterministic RNG (seed fixed in tests)
│   │       │   └── fixtures/
│   │       │       ├── home.json
│   │       │       ├── categories.json
│   │       │       ├── habits.json
│   │       │       ├── checkin-templates.json
│   │       │       ├── resources.json
│   │       │       └── plan.json
│   │       └── modules/
│   │           ├── home/        { endpoint.ts, hooks.ts, keys.ts, server.ts }
│   │           ├── categories/… # same 4 files
│   │           ├── habits/…
│   │           ├── checkins/…   # today, template, submit, undo, history, heatmap
│   │           ├── review/…     # week review
│   │           ├── plan/…       # week planner get/save
│   │           ├── stats/…      # dashboard stats
│   │           └── appstate/    # keys.ts + hooks.ts (local repository, not HTTP)
│   │
│   └── types/
│       └── index.ts                           # UI-safe view types (mapper output), no DTOs
│
├── tests/
│   ├── mock-workflows.test.ts                 # Vitest: full data-layer workflow suite
│   ├── streak-engine.test.ts                    # pure engine: streaks/rates/validation
│   └── date-utils.test.ts                     # week math starting Saturday
│
└── docs/
    └── backend-handoff/
        ├── README.md
        └── architecture/
            ├── HABITS_BACKEND_DATA_MODEL.md     # derived from contracts (written, not stubbed)
            ├── HABITS_BACKEND_API_CONTRACT.md   # derived from endpoint contract
            └── HABITS_BACKEND_BLUEPRINT.md      # phase-2 backend outline (sync, reminders)
```

---

# 5. Data Layer Architecture (the critical part)

## 5.1 Layering rule — never break this

```txt
Contract  →  Endpoint Factory  →  Transport  →  Hook / Server Function  →  UI
```

- **Contracts** (`src/lib/api/contracts/`) define DTOs and filters only. No logic.
- **Schemas** (`src/lib/api/schemas/`) are Zod mirrors of the contracts.
- **Endpoint factories** (`modules/*/endpoint.ts`) expose typed operations and return data directly.
- **Transports** are either `mock-transport` (fixtures + seeded history) or `fetch-transport` (future API) — chosen by `apiConfig.mode` inside `browser-client.ts` / `server-client.ts`.
- **Hooks** (`modules/*/hooks.ts`, `"use client"`) wrap endpoints in TanStack Query and are the ONLY way client components fetch data.
- **Server functions** (`modules/*/server.ts`, `"server-only"`) are the only way server components fetch data.
- **UI must never import fixture JSON, never import `mock-transport`, never call `fetch` directly.**

## 5.2 Shared transport types (`src/lib/api/transport/types.ts`)

```ts
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "HEAD";
export type ResponseSchema<TResponse> = ZodType<TResponse>;

export type RequestOptions<TBody = unknown, TResponse = unknown> = {
  method: HttpMethod;
  path: string;
  query?: Record<string, string | number | boolean | undefined>;
  body?: TBody;
  requestSchema?: ZodType<TBody>;
  headers?: HeadersInit;
  signal?: AbortSignal;
  cache?: RequestCache;
  next?: { revalidate?: number; tags?: string[] };
  responseSchema?: ResponseSchema<TResponse>;
};

export interface ApiTransport {
  request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse>;
}

export type ApiClient = {
  readonly scope: ApiScope;
  request<TResponse, TBody = unknown>(request: RequestOptions<TBody, TResponse>): Promise<TResponse>;
  get<TResponse>(path: string, options?: Omit<RequestOptions<never, TResponse>, "method" | "path" | "body">): Promise<TResponse>;
  post<TResponse, TBody>(path: string, body?: TBody, options?: Omit<RequestOptions<TBody, TResponse>, "method" | "path" | "body">): Promise<TResponse>;
  // put / patch / delete likewise
};
```

`ApiScope = "personal"` (extendable with `"coach"` later — a future accountability partner view). Scopes are observability context only, not authorization.

## 5.3 API client (`client/api-client.ts`)

Reproduce the reference behavior exactly:

1. `validateRequest` — if `requestSchema` present, `safeParse` the body before transport. Failure → `ApiError { status: 422, code: "INVALID_API_REQUEST", title: "بيانات غير صالحة", fields }` with Arabic field messages.
2. Send `X-Client-Surface: <scope>` header.
3. `validateResponse` — if `responseSchema` present, `safeParse` the decoded response. Failure → `ApiError { status: 502, code: "INVALID_API_RESPONSE" }` with a "did not match its contract" detail.
4. Unwrap `{ data }` envelopes; throw `ApiError` on non-2xx.

## 5.4 `fetch-transport.ts`

- Base URL from config: browser → relative `NEXT_PUBLIC_API_BASE_PATH` (`/api`), server → `API_INTERNAL_URL` with forwarded `cookie` header.
- `AbortController` timeout from `API_TIMEOUT_MS`, `credentials: "include"`, `Accept: application/json`, JSON body.
- Non-OK responses parsed as RFC-7807-style `ApiProblem { status, code, title, detail, fields, requestId }` and thrown as `ApiError`. Empty/invalid JSON falls back to text.

## 5.5 `fetch-transport` vs mock: the mode switch

```ts
const browserTransport = apiConfig.mode === "mock"
  ? createMockTransport()
  : createFetchTransport({ baseUrl: apiConfig.browserBasePath, timeoutMs: apiConfig.timeoutMs });
```

`createServerApiClient(scope)` mirrors this but uses `API_INTERNAL_URL` and forwards cookies. **No component code ever branches on mode.**

## 5.6 Mock store + transport

- `mock-store.ts` seeds a `MockDatabase` from the JSON fixtures, **parsing every fixture through its Zod schema at seed time** so an invalid fixture fails immediately at the fixture boundary.
- After seeding, it deterministically generates **8 weeks of check-in history** (`NEXT_PUBLIC_MOCK_HISTORY_WEEKS`) via `seed-rng.ts` (mulberry32, fixed seed) driven by a per-habit `seedProfile` embedded in `habits.json` (e.g. `{ doneProbability: 0.78, partialProbability: 0.1, avgMinutes: 40 }`). The generator only produces **contract-valid** DTOs (validated again through the Zod schema). Determinism: same seed → same history, in tests and demo.
- Store lives on `globalThis` (dev HMR safe); mutable state (check-ins, edits to the week plan) persists to `sessionStorage` under `STORAGE_KEYS.mockDb`, re-validated with schemas on load, and never treated as production persistence.
- `mock-transport.ts` implements every endpoint with a small latency (`~120ms`) so loading states are real. It supports filters, pagination (`PageResult`), and `notFound(path)` → `ApiError 404 NOT_FOUND`.
- All check-in mutations run through the **pure streak engine** (`src/lib/streaks/streak-engine.ts`) — the mock transport contains zero domain logic of its own.
- `resetMockDatabase(seed?)` exists for tests.

## 5.7 Mock transport endpoint routing — full API contract

| Method | Path | Query/Filter | Returns | Notes |
|---|---|---|---|---|
| GET | `/v1/home/content` | – | `HomeContentDto` | hero, method principles, features copy (presentation) |
| GET | `/v1/categories` | – | `CategoryDto[]` | ordered by `order` |
| GET | `/v1/categories/:idOrSlug` | – | `CategoryDto` (with `habits: HabitSummaryDto[]`) | 404 if missing |
| GET | `/v1/habits` | `search, categoryId, type, status, sort, page, pageSize` | `PageResult<HabitSummaryDto>` | search over title/titleEn/description/tags |
| GET | `/v1/habits/:slug` | – | `HabitDto` (full content + computed streak fields) | 404 if missing |
| GET | `/v1/habits/:slug/resources` | – | `ResourceDto[]` | always downloadable path |
| GET | `/v1/habits/:slug/history` | `from, to` (ISO dates) | `CheckInDto[]` ascending | per-habit raw history |
| GET | `/v1/habits/:slug/checkin-template` | – | `CheckInTemplateDto` (structure only — no engine outcome data) | what the running check-in receives |
| POST | `/v1/habits/:slug/checkins` | body `CheckInInputDto` | `CheckInOutcomeDto` | mock validates + recomputes streaks via the pure engine; future backend does the same server-side |
| DELETE | `/v1/habits/:slug/checkins/:checkinId` | – | `CheckInOutcomeDto` | undo — recompute after removal |
| GET | `/v1/today` | – | `TodayDto` | every active habit resolved for today: scheduled? status? streak? |
| GET | `/v1/heatmap` | `month=YYYY-MM` | `HeatmapMonthDto` | completion count + minutes per day |
| GET | `/v1/review/:weekStart` | – | `WeekReviewDto` | per-day × per-habit review + totals + insights |
| GET | `/v1/plan` | `week=<ISODate>` (default current) | `WeeklyPlanDto` | Tuesday ritual output |
| PUT | `/v1/plan` | body `WeeklyPlanInputDto` | `WeeklyPlanDto` | upsert whole week plan; requestSchema-validated |
| GET | `/v1/stats/dashboard` | `weekStart` optional | `DashboardStatsDto` | rates, cap gauge, best streaks |

`PageMeta { page, pageSize, total, totalPages }`, `PageResult<T> { items, meta }`, `ListFilter { page?, pageSize?, search? }`.

Every endpoint carries a `responseSchema`; POST/PUT endpoints also carry a `requestSchema` (Zod → `INVALID_API_REQUEST` on bad input).

---

# 6. Domain Model (contracts)

## 6.1 Common (`contracts/common.ts`)

```ts
export type ApiScope = "personal" | "coach";
export type PageMeta = { page: number; pageSize: number; total: number; totalPages: number };
export type PageResult<T> = { items: T[]; meta: PageMeta };
export type ApiProblem = { status: number; code: string; title: string; detail?: string; fields?: Record<string, string[]>; requestId?: string };
export type ListFilter = { page?: number; pageSize?: number; search?: string };

export type IsoDate = string; // "YYYY-MM-DD" — local calendar day, never a timestamp
export type IsoDateTime = string; // full ISO timestamp
```

## 6.2 Category (`contracts/category.ts`)

```ts
export interface CategoryDto {
  id: string;
  slug: string;
  order: number;
  title: string;              // "اللغات"
  description: string;
  icon: string;               // lucide icon name: "Languages" | "Rocket" | "Briefcase" | "Compass"
  color: "sky" | "emerald" | "violet" | "amber"; // card accent (presentation token)
  habitCount: number;         // computed by mock transport
  weeklyMinutesTarget: number; // computed: Σ schedule.minutesTarget × targetPerWeek
}

export interface CategoryDetailDto extends CategoryDto {
  habits: HabitSummaryDto[];
}
```

## 6.3 Habit (`contracts/habit.ts`)

```ts
export type HabitType = "binary" | "count" | "duration";
export type HabitStatus = "active" | "paused" | "archived";
export type HabitSort = "default" | "streak" | "weekly-target" | "recent";

export type ScheduleDto = {
  mode: "daily" | "perWeek" | "fixedDays";
  targetPerWeek: number;                 // daily ⇒ 7, fixedDays ⇒ days.length
  days?: number[];                       // mode=fixedDays: JS getDay indexes (0=Sun…6=Sat); "Tuesday planning" ⇒ [2]
  minutesTarget?: number;                // duration habits (type=binary|duration)
  countTarget?: number;                  // count habits (e.g. 2 applications per session)
};

export interface HabitSummaryDto {
  id: string;
  slug: string;
  title: string;               // "الألماني A1"
  titleEn?: string;            // "German A1" — shown secondary when different from title
  description: string;
  categoryId: string;
  categoryTitle: string;       // denormalized for cards
  type: HabitType;
  status: HabitStatus;
  tags: string[];
  weeklyTargetLabel: string;   // computed: "5 أيام/أسبوع" · "يوميًا" · "الثلاثاء أسبوعيًا"
  schedule: ScheduleDto;
  currentStreak: number;       // computed days/weeks by mock transport
  bestStreak: number;          // computed
  rate30: number;              // computed completion % over last 30 days (0-100)
  resourceCount: number;       // computed
  startDate: IsoDate;
  updatedAt: string;           // ISO date
}

export interface HabitContentDto {
  why: string;                       // markdown — "ليش هالعادة؟" (link to the bigger goal)
  plan: string;                      // markdown — how a typical session runs
  cues: { cue: string; response: string }[];   // cue–response scripts ("شعور كسل بالسكرول → …")
  skills?: string[];                 // language habits: ["reading","listening","speaking","writing"]
  tips: string[];
  reflectionPrompt: string;          // shown in the check-in note placeholder
}

export interface HabitDto extends HabitSummaryDto {
  categorySlug: string;
  content: HabitContentDto;
}

export interface HabitFilter extends ListFilter {
  categoryId?: string;
  type?: HabitType;
  status?: HabitStatus;      // filter available but list defaults to "active"
  sort?: HabitSort;
}

export interface ResourceDto {
  id: string;
  habitId: string;
  title: string;              // "خطة A1 الكاملة"
  type: "pdf" | "doc" | "checklist" | "link" | "image" | "zip";
  fileName: string;
  filePath: string;           // "/habits/german-a1/files/خطة-A1.pdf"
  size: string;               // "1.2 MB"
  description: string;
  downloadable: boolean;
  viewable: boolean;
}
```

## 6.4 Check-in (`contracts/checkin.ts`)

```ts
export type CheckInStatus = "done" | "partial" | "skipped";   // "missed" is NEVER stored — derived by the engine
export type FieldKind = "status" | "multi" | "number" | "rating" | "text";

export interface CheckInFieldOptionDto { id: string; text: string }

export interface CheckInFieldDto {
  id: string;                          // "status" | "skills" | "minutes" | "count" | "energy" | "note"
  kind: FieldKind;
  label: string;
  required: boolean;
  options?: CheckInFieldOptionDto[];   // status/multi
  min?: number; max?: number;          // number/rating bounds
  presets?: number[];                  // number quick-picks (MINUTE_PRESETS)
  default?: number;                    // e.g. minutesTarget prefill
  maxLength?: number;                  // text
}

/** What the running check-in form renders. Structure only — no computed/streak data. */
export interface CheckInTemplateDto {
  habitId: string;
  habitSlug: string;
  date: IsoDate;                       // the day being checked (defaults to today; backfill ≤ 3 days allowed)
  fields: CheckInFieldDto[];           // field[0] is ALWAYS kind "status"
  reflectionPrompt?: string;
}

export interface CheckInDto {
  id: string;
  habitId: string;
  date: IsoDate;
  status: CheckInStatus;               // done=full credit, partial=half-but-streak-safe, skipped=explicit skip
  minutes?: number;
  count?: number;
  skills?: string[];
  energy?: 1 | 2 | 3 | 4 | 5;
  note?: string;
  createdAt: IsoDateTime;
}

export interface CheckInInputDto {
  habitId: string;
  date: IsoDate;
  status: CheckInStatus;
  minutes?: number;
  count?: number;
  skills?: string[];
  energy?: 1 | 2 | 3 | 4 | 5;
  note?: string;
}

export interface StreakDto {
  current: number;                     // daily mode → consecutive days; perWeek/fixedDays → consecutive hit weeks
  longest: number;
  lastDoneAt?: IsoDate;
  rate7: number;                       // % completed vs scheduled, last 7 days
  rate30: number;
  state: "on-track" | "at-risk" | "broken";  // engine-derived, see §11
}

export interface CheckInOutcomeDto {          // analog of QuizResultDto
  checkInId: string;
  habitId: string;
  date: IsoDate;
  status: CheckInStatus;
  streak: StreakDto;
  weekProgress: { completed: number; target: number; percent: number }; // this habit, this week
  minutesThisWeek: number;                    // ALL habits combined — feeds the cap gauge
  capWeekMinutes: number;                     // 3000 from constants (echoed in contract for http mode parity)
  overload: boolean;                          // minutesThisWeek > capWeekMinutes
  consistencyScore: number;                   // 0-100 blended score (see §11)
  message: string;                            // Arabic engine copy: "🔥 سلسلتك صارت 12 يوم!"
}

export interface HeatmapDayDto { date: IsoDate; completed: number; scheduled: number; minutes: number }
export interface HeatmapMonthDto { month: string; firstWeekday: number; days: HeatmapDayDto[] }
```

## 6.5 Today (`contracts/stats.ts` — Today part)

```ts
export type TodayItemStatus = "completed" | "pending" | "planned" | "at-risk" | "rest";

export interface TodayItemDto {
  habitId: string;
  slug: string;
  title: string;
  titleEn?: string;
  categoryColor: CategoryDto["color"];
  scheduledToday: boolean;
  status: TodayItemStatus;   // completed: check-in exists · pending: scheduled, no check-in yet
                             // planned: not scheduled today, optional bonus · rest: fixed-day habit, not its day
  checkIn?: CheckInDto;
  streak: StreakDto;
  minutesTarget?: number;
}

export interface TodayDto {
  date: IsoDate;
  items: TodayItemDto[];                     // order: category order → habit order
  completedCount: number;
  scheduledCount: number;
  percent: number;                           // scheduled-only completion
  minutesLoggedWeek: number;
  overload: boolean;
}
```

## 6.6 Week review (`contracts/stats.ts` — Review part)

```ts
export interface ReviewDayDto {
  date: IsoDate;
  entries: { habitId: string; status: CheckInStatus | "missed" | null }[]; // null = not scheduled
}

export interface HabitWeekResultDto {
  habitId: string;
  slug: string;
  title: string;
  done: number; partial: number; skipped: number; missed: number; scheduled: number;
  minutes: number;
  percent: number;
  state: "on-track" | "at-risk" | "broken";
}

export interface WeekReviewDto {
  weekStart: IsoDate;
  weekEnd: IsoDate;
  days: ReviewDayDto[];                      // 7 days, Sat → Fri
  habits: HabitWeekResultDto[];
  totals: {
    completed: number; scheduled: number; percent: number;
    minutes: number; capMinutes: number; overload: boolean;
  };
  insights: string[];                        // Arabic computed copy (e.g. "أفضل يوم عندك السبت — ثقّل عليه")
}
```

## 6.7 Week plan (`contracts/plan.ts`) — the Tuesday-evening ritual

```ts
export interface PlanGoalDto { id: string; text: string; habitIds: string[] }          // "اكتب أهدافك"
export interface PlanTaskDto {
  id: string;
  title: string;                                                                        // "مهامك في الأسبوع"
  day?: number;                    // 0..6 (Sat=6 start-of-week handled by WEEK_START_DAY)
  habitId?: string;
  estimateMinutes?: number;
}
export interface IfThenDto { id: string; trigger: string; response: string }           // "scripted actions for high-risk tasks"

export interface WeeklyPlanDto {
  id: string;
  weekStart: IsoDate;
  goals: PlanGoalDto[];
  tasks: PlanTaskDto[];
  ifThen: IfThenDto[];
  intention?: string;                    // "intention → action" one-liner for the week
  updatedAt: IsoDateTime;
}

export type WeeklyPlanInputDto = Omit<WeeklyPlanDto, "id" | "updatedAt">;
```

## 6.8 Dashboard stats (`contracts/stats.ts`)

```ts
export interface DashboardStatsDto {
  weekStart: IsoDate;
  weekRate: number;                       // completed / scheduled, 0-100
  overallCurrentStreak: number;           // consecutive days with ≥1 done check-in (chain-of-days, not per habit)
  bestStreaks: { habitId: string; title: string; longest: number; current: number }[];   // top 5 by longest
  minutesWeek: number;
  capMinutes: number;                     // 3000 (50h) — from constants, echoed
  overload: boolean;
  categoriesBreakdown: { categoryId: string; title: string; color: CategoryDto["color"]; done: number; scheduled: number }[];
  bestDayOfWeek?: { day: number; label: string };   // most completions this period
  lastActivityAt?: IsoDateTime;
}
```

## 6.9 Home content (`contracts/home.ts`)

```ts
export interface HomeContentDto {
  hero: { title: string; subtitle: string; primaryCta: string; secondaryCta: string };
  methodIntro: string;                                  // markdown
  principles: { id: string; title: string; body: string; icon: string }[]; // from the txt: flow matching, 50h cap, if-then…
  features: { id: string; title: string; description: string; icon: string }[];
}
```

Zod schemas in `schemas/habits.ts` mirror **every** DTO 1:1 (same rule as the reference: response validation is not optional).

---

# 7. TanStack Query Conventions

## 7.1 Provider (`src/lib/query-client.tsx` — clone reference defaults)

```tsx
"use client";
export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000,
        gcTime: 5 * 60 * 1000,
        retry: 3,
        retryDelay: (i: number) => Math.min(1000 * 2 ** i, 30000),
        refetchOnWindowFocus: false,
        refetchOnReconnect: true,
        refetchOnMount: true,
        throwOnError: false,
      },
      mutations: {
        retry: 1,
        throwOnError: false,
        onError: (error: Error) => console.error("Mutation error:", error),
      },
    },
  }));
  return <QueryClientProvider client={queryClient}>{children}<ReactQueryDevtools initialIsOpen={false} /></QueryClientProvider>;
}
```

## 7.2 Keys convention (`modules/*/keys.ts`)

```ts
export const homeKeys = { all: ["home"] as const, content: () => [...homeKeys.all, "content"] as const };

export const categoryKeys = {
  all: ["categories"] as const,
  lists: () => [...categoryKeys.all, "list"] as const,
  detail: (idOrSlug: string) => [...categoryKeys.all, "detail", idOrSlug] as const,
};

export const habitKeys = {
  all: ["habits"] as const,
  lists: () => [...habitKeys.all, "list"] as const,
  list: (filter: HabitFilter = {}) => [...habitKeys.lists(), normalizedFilter(filter)] as const,
  detail: (slug: string) => [...habitKeys.all, "detail", slug] as const,
  resources: (slug: string) => [...habitKeys.detail(slug), "resources"] as const,
  history: (slug: string, from: string, to: string) => [...habitKeys.detail(slug), "history", from, to] as const,
  template: (slug: string, date: string) => [...habitKeys.detail(slug), "template", date] as const,
};

export const todayKeys = { all: ["today"] as const, snapshot: (date: string) => [...todayKeys.all, date] as const };

export const checkinKeys = {
  all: ["checkins"] as const,
  outcome: (checkInId: string) => [...checkinKeys.all, "outcome", checkInId] as const,
};

export const heatmapKeys = { all: ["heatmap"] as const, month: (month: string) => [...heatmapKeys.all, month] as const };
export const reviewKeys = { all: ["review"] as const, week: (weekStart: string) => [...reviewKeys.all, weekStart] as const };
export const planKeys = { all: ["plan"] as const, week: (weekStart: string) => [...planKeys.all, weekStart] as const };
export const statsKeys = { all: ["stats"] as const, dashboard: (weekStart?: string) => [...statsKeys.all, "dashboard", weekStart ?? "current"] as const };
export const appStateKeys = { all: ["app-state"] as const, root: () => [...appStateKeys.all] as const };
```

## 7.3 Hooks shape (`modules/*/hooks.ts`)

```ts
export const habitQueries = {
  list: (filter: HabitFilter = {}) => queryOptions({
    queryKey: habitKeys.list(filter),
    queryFn: () => personalApi.habits.list(filter),
    placeholderData: keepPreviousData,
    staleTime: 60 * 1000,
  }),
  detail: (slug: string) => queryOptions({
    queryKey: habitKeys.detail(slug),
    queryFn: () => personalApi.habits.get(slug),
    enabled: Boolean(slug),
    staleTime: 60 * 1000,
  }),
  // ...
};

export function useHabits(filter: HabitFilter = {}) { return useQuery(habitQueries.list(filter)); }
export function useHabit(slug: string) { return useQuery(habitQueries.detail(slug)); }
export function useHabitResources(slug: string) { return useQuery(habitQueries.resources(slug)); }
export function useHabitHistory(slug: string, from: string, to: string) { return useQuery(habitQueries.history(slug, from, to)); }
export function useToday() { return useQuery({ queryKey: todayKeys.snapshot(todayISO()), queryFn: () => personalApi.today.get(), staleTime: 10_000 }); }
export function useCheckInTemplate(slug: string, date?: string) { /* personalApi.checkins.template(slug, date) */ }
export function useSubmitCheckIn(slug: string) {
  return useMutation({
    mutationFn: (input: CheckInInputDto) => personalApi.checkins.submit(slug, input),
    onSuccess: (outcome) => {
      queryClient.setQueryData(checkinKeys.outcome(outcome.checkInId), outcome);
      void queryClient.invalidateQueries({ queryKey: todayKeys.all });
      void queryClient.invalidateQueries({ queryKey: habitKeys.all });
      void queryClient.invalidateQueries({ queryKey: heatmapKeys.all });
      void queryClient.invalidateQueries({ queryKey: reviewKeys.all });
      void queryClient.invalidateQueries({ queryKey: statsKeys.all });
    },
  });
}
export function useUndoCheckIn(slug: string) { /* personalApi.checkins.undo(slug, id) → same invalidations */ }
export function useWeekReview(weekStart: string) { /* personalApi.review.week(weekStart) */ }
export function useWeekPlan(weekStart: string) { /* personalApi.plan.get(weekStart) */ }
export function useSaveWeekPlan() { /* mutation → personalApi.plan.save(input) → invalidate planKeys */ }
export function useHeatmap(month: string) { /* personalApi.heatmap.month(month) */ }
export function useDashboardStats() { /* personalApi.stats.dashboard() */ }
```

App-state hooks use `queryFn`/mutation calling the **app-state repository**, not an HTTP endpoint, so swapping the backend later only changes the repository factory:

```ts
export function useAppState() { return useQuery({ queryKey: appStateKeys.root(), queryFn: () => appStateRepository.get() }); }
export function useSaveCheckInDraft() { /* mutation → repo.saveDraft(slug, draft) → invalidate appStateKeys */ }
export function useClearCheckInDraft() { /* … */ }
export function useSetLastVisitedHabit() { /* … */ }
```

## 7.4 Server vs client rule

- **Server components** call `listCategoriesForServer()`, `getHabitForServer(slug)`, `getCheckInTemplateForServer(slug)`, `getWeekPlanForServer(weekStart)` etc. from `modules/*/server.ts` (which import `server-only` and build a `createServerApiClient("personal")`).
- **Client components** call hooks. Never call a React Query hook from a server component; never expose the internal URL through `NEXT_PUBLIC_`.
- **Dynamic-data caveat:** habit *content* may be statically generated, but *streak/today numbers* are mutable local data — pages that render them (`/today`, dashboard, habit detail stat cards) must render them via client hooks after a server-fetched static shell. Never bake "currentStreak: 12" into an SSG page that will go stale.

---

# 8. App State System (localStorage, backend-swappable)

`src/lib/app-state/app-state-repository.ts`:

```ts
export interface AppStateDto {
  version: 1;
  drafts: Record<string, /* habit slug */ Partial<CheckInInputDto>>;   // check-in form autosave (note text must survive refresh)
  lastVisitedHabitSlug?: string;
  settings: {
    quickCheckInDefaultMinutes: number;      // prefill in the today-dialog
    showEnglishTitles: boolean;
  };
  updatedAt: IsoDateTime;
}

export interface AppStateRepository {
  get(): Promise<AppStateDto>;
  saveDraft(slug: string, draft: Partial<CheckInInputDto>): Promise<AppStateDto>;
  clearDraft(slug: string): Promise<AppStateDto>;
  setLastVisitedHabit(slug: string): Promise<AppStateDto>;
  updateSettings(patch: Partial<AppStateDto["settings"]>): Promise<AppStateDto>;
  reset(): Promise<AppStateDto>;
}

export function getAppStateRepository(): AppStateRepository {
  return apiConfig.appStateMode === "api"
    ? remoteAppStateRepository()      // future: fetch('/v1/app-state', …)
    : createLocalAppStateRepository();
}
```

- storage key: `STORAGE_KEYS.appState` (`aadati-appstate-v1`); safe `JSON.parse` with Zod validation (corrupt data → reset to default, never crash).
- Drafts: the check-in form autosaves on change (debounced 500 ms) and clears on successful submit — recovering an unfinished check-in is exactly the "optimizing recovery" principle, so it must feel free, never nagging.
- Check-in *history itself* does NOT live here — it goes through the mock transport (future backend), so the data flow stays contract-first.
- The today page resumes: `lastVisitedHabitSlug` powers the "كمل من حيث وقفت" card on the home/dashboard.

---

# 9. Demo Data Spec (the user's REAL life — not a placeholder)

Source of truth: `happit-tracker-basic-info.txt` at the repository root. Reproduce its content faithfully (Arabic titles, English proper names). Create **4 categories, 9 habits, 1–3 resources per habit, 1 check-in template per habit, 1 starter week plan**.

## 9.1 Categories (`categories.json`)

1. `cat-languages` — **اللغات** — ألماني وإنجليزي بأربع مهارات، كل يوم شوية — icon `Languages`, color `sky`
2. `cat-build` — **البناء** — مشاريع بتتبني باليد: Happy Share، مشروع البكالوريا، مسار هاواي ICT — icon `Rocket`, color `emerald`
3. `cat-career` — **المهنة** — بورتفوليو وطلبات عمل على upwork/freelancer/مستقل/Navizly و wuzzuf/linkedin/indeed/glassdoor — icon `Briefcase`, color `violet`
4. `cat-operating-system` — **نظام التشغيل الشخصي** — تخطيط الثلاثاء، ضبط التدفق، الاستشفاء — icon `Compass`, color `amber`

## 9.2 Habits (`habits.json`) — sample entry

```json
{
  "id": "habit-german-a1",
  "slug": "german-a1",
  "title": "الألماني A1",
  "titleEn": "German A1",
  "description": "قراءة واستماع وتحدث وكتابة — أربع مهارات، هدف صغير كل يوم أهم من جلسة كبيرة كل شهر.",
  "categoryId": "cat-languages",
  "type": "duration",
  "status": "active",
  "tags": ["ألماني", "Goethe", "A1", "لغات"],
  "schedule": { "mode": "perWeek", "targetPerWeek": 5, "minutesTarget": 45 },
  "startDate": "2026-06-01",
  "resourceIds": ["res-de-1", "res-de-2"],
  "updatedAt": "2026-09-01",
  "seedProfile": { "doneProbability": 0.78, "partialProbability": 0.10, "avgMinutes": 42 },
  "content": {
    "why": "## ليش؟\nA1 معتمد يفتح مسار الدراسة في ألمانيا…",
    "plan": "## روتين الجلسة\n1. 10 دقائق استماع (Nicos Weg)\n2. 15 دقيقة قراءة وكتابة جمل…",
    "cues": [{ "cue": "بعد صلاة العشاء أفتح الموبايل للسكرول", "response": "أفتح تطبيق الألماني 10 دقايق الأول" }],
    "skills": ["reading", "listening", "speaking", "writing"],
    "tips": ["ما تكسر السلسلة: 10 دقائق أحسن من صفر"],
    "reflectionPrompt": "إيه أكثر حاجة علّقتك النهاردة؟"
  }
}
```

Full habit list (keep English slugs, Arabic titles; the table mirrors the txt 1:1):

| # | Slug | Title | Category | Type | Schedule | Minutes | Template extras |
|---|---|---|---|---|---|---|---|
| 1 | `german-a1` | الألماني A1 — German A1 | languages | duration | 5/week | 45 | skills multi |
| 2 | `english-b1-to-b2` | الإنجليزي B1 ← B2 — English B1→B2 | languages | duration | 5/week | 45 | skills multi |
| 3 | `happyshare-dev` | تطوير Happy Share | build | duration | 6/week | 120 | — |
| 4 | `baccalaureate-web-project` | مشروع البكالوريا — تطبيق الويب | build | duration | 4/week | 60 | — |
| 5 | `hawaii-ict-cloud` | مسار هاواي ICT — كورس السحابة | build | duration | 4/week | 60 | — |
| 6 | `portfolio-uplift` | رفع البورتفوليو (Upwork · Freelancer · مستقل · Navizly) | career | duration | 3/week | 40 | — |
| 7 | `job-hunt` | تقديمات الشغل (Wuzzuf · LinkedIn · Indeed · Glassdoor) | career | **count** | 5/week | 30 | `count` field, countTarget 2 |
| 8 | `tuesday-planning` | طقس تخطيط الأسبوع (الثلاثاء مساءً) | operating-system | **binary** | fixedDays `[2]` | 45 | links to `/planning` |
| 9 | `flow-recovery` | ضبط التدفق والاستشفاء | operating-system | binary | 2/week | 20 | note required-ish (recovery log) |

`seedProfile` is consumed only by `mock-store.ts` history seeding; it is **not** part of any endpoint response (keep it out of public DTOs — the Zod habit schema `strip`s it at the fixture boundary but keeps it in the internal store record).

## 9.3 Resources (`resources.json`) — per habit

Language habits get a plan PDF + a checklist; build habits get a sprint-plan markdown; `tuesday-planning` gets the printable **planning sheet**; 1–3 per habit is enough. Every habit has ≥ 1.

```json
{
  "id": "res-plan-tue",
  "habitId": "habit-tuesday-planning",
  "title": "ورقة التخطيط الأسبوعية",
  "type": "pdf",
  "fileName": "تخطيط-الثلاثاء.pdf",
  "filePath": "/habits/tuesday-planning/files/تخطيط-الثلاثاء.pdf",
  "size": "0.4 MB",
  "description": "ورقة جاهزة: أهداف الأسبوع، المهام، وسكريبتات «لو… إذن…».",
  "downloadable": true,
  "viewable": true
}
```

Placeholder files live under `public/habits/<slug>/files|images/…` (small dummy PDF/MD/PNG are fine; JSON stores only paths).

## 9.4 Check-in templates (`checkin-templates.json`) — every habit

Field kinds mirror the old question types: `status` = single-choice radios, `multi` = checkboxes (skills), `rating` = 1–5 big cards (energy), plus `number` (minutes/count) and `text` (note). **`status` field is always first and always required.**

```json
{
  "habitId": "habit-german-a1",
  "habitSlug": "german-a1",
  "date": "auto:today",
  "fields": [
    { "id": "status", "kind": "status", "label": "إيه حالة جلسة الألماني النهاردة؟", "required": true,
      "options": [
        { "id": "done", "text": "خلصت الجلسة كاملة" },
        { "id": "partial", "text": "نصها أحسن من صفر" },
        { "id": "skipped", "text": "تخطيت — وفيه سبب" }
      ] },
    { "id": "skills", "kind": "multi", "label": "المهارات اللي اتدرّبت عليها", "required": true,
      "options": [
        { "id": "reading", "text": "قراءة" }, { "id": "listening", "text": "استماع" },
        { "id": "speaking", "text": "تحدث" }, { "id": "writing", "text": "كتابة" } ] },
    { "id": "minutes", "kind": "number", "label": "عدد الدقايق", "required": true, "min": 5, "max": 480, "default": 45, "presets": [15, 30, 45, 60, 90, 120] },
    { "id": "energy", "kind": "rating", "label": "طاقة إيه بعد الجلسة؟", "required": false, "min": 1, "max": 5 },
    { "id": "note", "kind": "text", "label": "ملاحظة سريعة (اختياري)", "required": false, "maxLength": 500 }
  ],
  "reflectionPrompt": "إيه أكتر حاجة علّقتك النهاردة وبكرا هتجربها؟"
}
```

`job-hunt` template replaces `minutes` with `{ "id": "count", "kind": "number", "label": "كام طلب/رسالة بعت النهاردة؟", "min": 1, "max": 25, "default": 2 }`. `tuesday-planning` template adds `{ "id": "planLinked", "kind": "text", "label": "نوّص على أهداف الأسبوع اللي كتبتها…", "maxLength": 500 }` plus a button linking to `/planning`.

## 9.5 Week plan (`plan.json`) — seeded current week

Real content from the txt: goals = [A1 exam prep milestone, ship HappyShare v1 core flow, finish 2 cloud-course modules, 10 quality applications, portfolio revamp]; sample tasks per day with `estimateMinutes` that **sum under the 50 h cap**; if–then scripts = [«لو حسّيت بإني كسلان بدل السكرول → أمشي 10 دقايق», «لو طلعت من التدفق → أقفل اللابتوب وأشرب مية», «لو فاتتني جلسة ألماني → 10 دقايق تعويضية قبل النوم»].

## 9.6 Home content (`home.json`)

Hero: **«عادات صغيرة · التزام كبير»** + subtitle about keeping 7 real-life tracks alive at once + CTAs `سجّل إنجاز النهاردة` / `استعرض العادات`.
`principles` (the bottom section of the txt — these are the product's soul, surface them as cards on Home + /about):

1. `define-productivity` — **عرّف الإنتاجية بنفسك** — مش كل حاجة مهمة… (icon `Target`)
2. `flow-matching` — **طابق مجهودك مع تدفقك** — جودة ساعات أهم من عدّها (icon `Waves`)
3. `fifty-hour-cap` — **سقف 50 ساعة أسبوعيًا** — أعلى رقم مسموح، لا تتجاوزه أبدًا (icon `Gauge`) — feeds the dashboard cap gauge
4. `tuesday-planning` — **تخطيط الثلاثاء مساءً** — اكتب الأهداف → مهام الأسبوع → سكريبتات «لو… إذن…» (icon `CalendarDays`)
5. `cue-response` — **معمارية الفعل (إشارة ← استجابة)** — استبدال سلوك الكسل بحركة جاهزة (icon `Zap`)
6. `recovery-first` — **حسّن الاستشفاء للعودة** — اللي بيكسر السلسلة بيرجّعها أسرع (icon `HeartPulse`)
7. `intention-action` — **نيّة ← فعل** — كل عادة مربوطة بنيّة واضحة في صفحة «ليش؟» (icon `Sparkles`)

`features`: `سلاسل مرنة` (partial ما بيكسرش السلسلة)، `خريطة حرارية أسبوعية`، `مؤشر سقف الساعات`، `تسجيل سريع خلال 15 ثانية`، `مراجعة الأسبوع`، `خطة الثلاثاء`. **Stats (عدد العادات/الوحدات/سلاسل حالية/دقايق الأسبوع) are computed dynamically from fixtures + seeded history — never hard-coded.**

---

# 10. Pages Specification

All pages live under `app/(public)/` except the global `layout.tsx`. Pages are **thin**: server page renders a named component; interactivity lives in client components using hooks.

## 10.1 Root layout (`app/layout.tsx`)

```tsx
<html lang="ar" dir="rtl" suppressHydrationWarning className="h-full antialiased">
  <body className="min-h-full flex flex-col font-sans" suppressHydrationWarning>
    {/* Skip link to #main-content */}
    <QueryProvider>
      <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
        {children}
        <Toaster position="top-center" richColors closeButton />
      </ThemeProvider>
    </QueryProvider>
  </body>
</html>
```

Metadata: `title.template = "%s | عاداتي"`, `metadataBase = new URL("https://aadati.example.com")`, Open Graph + Twitter with `locale: "ar_EG"`, Arabic keywords, description. Header nav: `اليوم · العادات · التصنيفات · التخطيط · المراجعة · لوحة المتابعة`. Mobile bottom nav (`mobile-nav.tsx`): اليوم / العادات / تسجيل سريع / لوحة المتابعة.

## 10.2 Home `/`

Sections (each a small component, one source of truth = hooks):
1. `HeroSection` — title/subtitle/CTAs from home content.
2. `TodayPulseSection` — compact `useToday()` list (max 5 pending + progress bar) with per-row ✅ opening the quick check-in dialog; empty state when the day is fully done: **«خلّصت النهاردة كلها 🔥 — استشفى!»**.
3. `StatsSection` — derives `useCategories()` + `useHabits()` + `useDashboardStats()`; shows عدد العادات، عدد التصنيفات، أطول سلسلة، دقايق الأسبوع / السقف.
4. `CategoriesSection` — `useCategories()` cards linking to `/categories/[slug]`.
5. `MethodSection` — the 7 principles as cards (`HomeContentDto.principles`).

SEO: static metadata. Empty/loading states for every section.

## 10.3 Habits `/habits`

- Client `HabitsPage` with `useHabits(filter)`.
- Debounced search (`useDebounce` ~300 ms) over title/titleEn/description/tags; header shows `نتائج البحث عن: «…»` + `وجدنا N عادة`.
- Filters: category select, type select (نعم/لا · عدد · مدة), status (only `active` by default: نشط/موقوف/مؤرشف), sort (افتراضي · الأطول سلسلة · أعلى أسبوعي · الأحدث).
- `keepPreviousData` so the grid doesn't flash during refetch; results header shows total from `meta.total`.
- Cards (`HabitCard`): badge category color، title (+ titleEn secondary if `showEnglishTitles`)، description، schedule chip (`habit-schedule-chip`: 🔥 12 يوم · 5 أيام/أسبوع · ⏱ 45 د)، rate30 mini bar، `متابعة` + `تسجيل اليوم` buttons.
- Empty state: `لم نجد أي نتائج` + `جرّب البحث بكلمة أخرى.`; loading = `HabitCardSkeleton` grid.

## 10.4 Habit detail `/habits/[slug]`

Server shell (static content via `getHabitForServer`) + client stats block (hooks):
- `getHabitForServer(slug)` + `getHabitResourcesForServer(slug)`; `notFound()` if missing.
- `generateStaticParams()` from `listHabitsForServer()` for the **shell only**; streak/today numbers render client-side (see §7.4 caveat); `generateMetadata()` → `الألماني A1 | عاداتي` + description + canonical + OG/Twitter.
- Renders: `SiteBreadcrumbs` (الرئيسية / العادات / التصنيف / العادة), `HabitHeader` (title, titleEn, schedule chips, tags, status badge), `StreakSummaryCard` (🔥 current / 🏆 best / rate7 / rate30 / state badge), `HabitContent` (`ليش؟` markdown, `روتين الجلسة`, cues list rendered as «لو … إذن …» rows, tips, reflectionPrompt), `WeekHeatmap` of the last 12 weeks (`useHeatmap` + `useHabitHistory` for per-day status dots), `HabitResources` (icon per type, name, size, `عرض` when viewable, `تحميل` always), `HabitNavigation` (السابق/التالي within the same category, wraps at ends).
- CTA `سجّل النهاردة` → `/habits/[slug]/checkin`.
- `useSetLastVisitedHabit` fires on mount (client wrapper).

## 10.5 Check-in `/habits/[slug]/checkin`

Server page fetches **template only** (`/checkin-template`) and passes it to client `CheckInContainer`:

- Header: habit title + editable `date` (native `<input type="date">`, backfill up to 3 days, never future) + `السقف` live chip (minutes this week / 3000).
- One field group per template field, in template order; `status` → radio cards (أنجزت / نصها / تخطيت), `multi` → checkbox chips, `number` → input + preset chips, `rating` → 5 emoji-labeled cards (ENERGY_LABELS), `text` → textarea.
- **Autosave draft** to the app-state repository (debounced 500 ms); on mount, if a draft exists → banner `لقينا تسجيل ناقص من قبل — كمّل ولا امسح؟` with `كمّل` / `امسح` (recovery-first, no guilt copy).
- Client-side mirror of engine rules for instant feedback (Arabic, non-blocking until submit): partial/skipped require note when engine requires; number within min/max.
- Submit → `useSubmitCheckIn` → show `CheckInOutcome` inline: `message` (e.g. "🔥 سلسلتك صارت 12 يوم"), streak before→after, week progress bar for this habit, minutes/cap bar, buttons `طيب` (→ `/today`), `اتراجع` (→ undo → back to form), `مراجعة الأسبوع` (→ `/review/<currentWeekStart>`).
- Server validation errors (422 `INVALID_API_REQUEST` / engine `CHECKIN_REJECTED`) render inside `ApiQueryError`/field errors with the Arabic detail.

## 10.6 Categories `/categories` + `/categories/[slug]`

Categories grid (icon, title, habit count, weekly minutes target, CTA). Category detail shows its habits via `CategoryDetailDto.habits` with the same `HabitCard` grid + a category minutes subtotal chip.

## 10.7 Planning `/planning`

Client page from `useWeekPlan(currentWeekStart)` + `useSaveWeekPlan` (react-hook-form + Zod):
- `PlanGoalsSection` — `اكتب أهداف الأسبوع` (repeatable rows; each goal links to habits via multi-select `habitIds`).
- `PlanTasksSection` — `مهام الأسبوع` (repeatable rows: title، day chips السبت→الجمعة، estimateMinutes, habitId optional); footer shows **Σ estimate vs 50h cap** — turning red when > 3000 min with the exact copy `أنت فوق سقف الـ50 ساعة — اشيل حاجة من الخطة`.
- `PlanIfThenSection` — `لو … إذن …` repeatable pairs (high-risk task scripts).
- `IntentionInput` — one-line `النيّة` for the week.
- Dirty-state guard (confirm dialog on leave), sonner toast on save, `updatedAt` display. Draft fields persist via app-state repository too.

## 10.8 Review `/review` + `/review/[weekStart]`

`/review` → redirect to `/review/<currentWeekStart>`. Week navigation (`DateNav`: `← الأسبوع اللي فات | الأسبوع الجاي →`).
- Grid: rows = habits, columns = 7 days (Sat→Fri, RTL direction), cell = status color block (done ✅ emerald, partial ◐ amber, skipped ○ muted, missed ✕ rose, not-scheduled —); `role="grid"` + full `aria-label` per cell (`الألماني A1 — السبت 6 سبتمبر: أنجزت، 45 دقيقة`).
- Per-habit row totals + `state` badge.
- `TotalsCard`: `X / Y إنجاز · Z%`، minutes gauge vs cap (overload = destructive + copy `الأسبوع ده عدّى الـ50 ساعة — راجع الـflow matching`).
- `InsightsSection`: engine-computed Arabic strings (§11).
- `EmptyState` for fully empty week: `أسبوع فاضي — احكي ليه وسجّل تاني` (never shame copy).

## 10.9 Dashboard `/dashboard`

Client page from `useDashboardStats()` + `useToday()` + habits data:
- `WeeklyRateCard` — `نسبة انتظامك الأسبوع ده` + progress bar + %.
- `CapGauge` — دقايق الأسبوع / 3000 with zones (green < 80%, amber < 100%, red ≥) + Arabic hint at overload.
- `BestStreaksCard` — top 5 `currentStreak` with 🔥 and state badges.
- `ContinueHabits` — `كمل من حيث وقفت` (`lastVisitedHabitSlug`) + pending-today list with quick-checkin dialogs.
- `RecentActivityList` — last 8 check-ins (status icon, habit, relative date via date-fns `formatDistanceToNow` ar locale), undo per row (`useUndoCheckIn`) with confirm dialog.
- `EmptyState` when no data: `لسه في أول الأسبوع — ابدأ من الدرس… لأ، من أول عادة` + `ابدأ من اليوم`.

## 10.10 About `/about`

Static Arabic page: the platform mission + the full **منهجية الانتظام** (the §9.6 principles expanded, faithful to the txt: define productivity, flow matching, 50h cap, Tuesday planning, cue–response, recovery optimization, intention–action) + how the 4 categories map to real life. No fixtures required (copy is fine to hard-code here since it is marketing text, per reference rule).

---

# 11. Streak & Check-in Engine (`src/lib/streaks/streak-engine.ts`)

Pure functions, no React, no I/O — unit-testable:

```ts
export function validateCheckIn(template: CheckInTemplateDto, input: CheckInInputDto, today: IsoDate): { ok: true; normalized: CheckInInputDto } | { ok: false; issues: Record<string, string[]> };

export function computeStreak(habit: HabitScheduleRecord, history: CheckInDto[], today: IsoDate): StreakDto;

export function buildCheckInOutcome(habit: HabitScheduleRecord, history: CheckInDto[], input: CheckInInputDto, today: IsoDate): CheckInOutcomeDto;

export function buildWeekReview(daysHistory: CheckInDto[], habits: HabitScheduleRecord[], weekStart: IsoDate): WeekReviewTotals & { insights: string[] };
```

Rules:
- **Validation:** `date` must be `today` or ≤ 3 days back, never future → issue `التاريخ مش صحيح`; `date ≥ habit.startDate`. `minutes` ∈ [field.min, field.max]; `count` same. `status=skipped` requires a `note` (≥ 3 chars) — **skipping is a decision, not a shrug**. `status=partial` requires `minutes ≥ 5` (duration) or `count ≥ 1` (count). `done` on a duration habit requires `minutes ≥ 0.5 × minutesTarget` else auto-downgrade to `partial` **with an Arabic `message`** (never silently reject). Required multi fields (`skills`) need ≥ 1 selection.
- One check-in per habit per day: POST replaces the day's existing entry (idempotent upsert; `checkInId` reused).
- **Streak counting:** a day counts if status ∈ {`done`, `partial`} — *"نصها أحسن من صفر"*. `daily` mode: consecutive calendar days back from `today` (missing today doesn't break until 23:59 passes; streak is `pending`, not broken, during the day). `perWeek`/`fixedDays`: consecutive **weeks** that hit `targetPerWeek` counted-days (partial counts, skipped/missed don't). `longest` ≥ `current` always.
- **State machine:** `at-risk` when scheduled-today pending (daily) OR remaining week days == weeks-units still needed; `broken` when a needed day/week was fully missed; else `on-track`.
- **Consistency score (0-100):** `0.5·rate30 + 0.3·min(currentStreak/30,1)·100 + 0.2·weekPercent` rounded — shown on habit cards.
- **Week review insights** (deterministic, computed not stored): best day of week, worst habit, minutes trend vs last week (`↑ 12%`), overload note when `Σ minutes > CAP_WEEKLY_MINUTES`.
- **This engine is called only by the mock transport (and tests).** In HTTP mode the backend runs the same contract; the client only renders `CheckInOutcomeDto`. The client form may *mirror* validation rules for UX but the **engine output is the single authority** (mirrored rules must be marked clearly and never mutate input).

---

# 12. Markdown, Data-Viz & RTL Rendering

- `MarkdownNote` wraps `react-markdown` + `remark-gfm` + `rehype-slug`, RTL-aware, `dir="rtl"`, styled headings/paragraphs/lists/tables/blockquotes via a small custom `.md-note` stylesheet (prose-like, no typography plugin required). Habit `why`/`plan`, plan text, note display all go through it. `react-markdown` default escaping is the HTML guard.
- **No chart library.** Hand-built:
  - `WeekHeatmap` — CSS grid of day cells (`role="grid"`, each cell `role="gridcell"` with `aria-label="السبت 6 سبتمبر — 5 من 7 عادات، 210 دقيقة"`), 4 intensity steps from status counts, `tabIndex=0` + tooltip on focus/hover; LTR-in-RTL-safe using logical grid (`grid-flow-col` with week rows) so the week reads right-to-left naturally.
  - `MiniBar` / `RateBar` — divs + width % transitions.
  - `CapGauge` — horizontal segmented bar (0/12.5h/25h/37.5h/50h ticks), zone colors, `aria-valuetext`.
- Numbers/minutes use `tabular-nums`; dates rendered via date-fns with `ar` locale (`السبت، 6 سبتمبر`). ISO keys (`YYYY-MM-DD`) are the only stable date identity in state/query keys — parse/format only at render edges, inside `src/lib/dates.ts` (pure, unit-tested: `startOfWeek` must respect `WEEK_START_DAY=6`).

---

# 13. Design System

- shadcn/ui, `new-york`, `neutral` base, CSS variables, radius tokens.
- Fonts: `next/font/google` — **Cairo** (body/display, Arabic) + **JetBrains Mono** (numbers, ISO dates in dev); expose as `--font-cairo`, `--font-jetbrains`; Tailwind `font-sans`/`font-mono` map them.
- Semantics: `primary` = calm teal/emerald family (consistency, growth; e.g. `#0E7C66`-ish with AA contrast), status tokens used by check-in states: `done`→success, `partial`→warning, `skipped`→muted, `missed`→destructive. Category accents (`sky/emerald/violet/amber`) only on chips/edges, never full-bleed backgrounds.
- **Tone of voice (product rule):** data, not guilt. Never write "فشلت/خسرت سلسلتك" copy; broken streak copy is `اتكسرت السلسلة — رجّعها النهاردة`. Recovery-oriented wording is part of the contract (see engine messages).
- Patterns: cards, badges, tabs, progress bars, accordions, breadcrumbs, alerts, dialogs/sheets, skeletons, tooltips. Avoid heavy gradients, excessive shadows, giant text, gratuitous animation.
- RTL: native `dir="rtl"` layout, `ps-*/pe-*/ms-*/me-*`/logical utilities, `text-start/end`, `start-*/end-*` positioning, icons mirrored only where semantically needed (chevrons, `←` week nav), LTR `dir` only inside ISO dates, URLs, English proper names (`HappyShare`, `Wuzzuf`) and file paths. Test 360, 390, 768, 1024, 1440.
- Dark mode: `next-themes` + `.dark` variables; heatmap steps, status dots, gauges and card states must be verified in both themes (heatmap steps stay distinguishable with `--muted → primary/20/50/80%`). `suppressHydrationWarning` on `<html>`.

---

# 14. SEO, A11y, Performance, Errors

## SEO
- `generateMetadata()` on habit/category detail; title template, canonical, `openGraph` (title, description, url, locale `ar_EG`, type `website`), `twitter` card; semantic `h1` per page, breadcrumbs with `Breadcrumb` + JSON-LD optionally.
- Static generation for the content shell of habit/category pages; dynamic numbers client-only (§7.4).

## Accessibility
- Keyboard navigable: real `<button>`/`<a>` only (no clickable divs), visible focus ring, Escape closes dialogs, focus return, `aria-expanded` on menus, `aria-label` on icon-only buttons, `aria-current` on nav, `role="alert"` on errors, form labels, `aria-live` for check-in feedback (polite) and outcome (assertive), skip link. Heatmap grid fully labeled (§12). Rating field: `role="radiogroup"` with arrow-key nav.
- Contrast ≥ WCAG AA; don't rely on color alone for check-in status (icon + text: ✅/◐/○/✕ with Arabic labels).

## Performance
- Server Components by default; `"use client"` only for interactivity; avoid `use client` in leaf presentational components.
- React Query caching; static generation; `next/image` (`unoptimized: true` config for local mock assets) with `alt`; debounced search; no layout shift (fixed heatmap cell size, skeletons); date inputs native.

## Error/Loading/Empty states (all mandatory)
- `app/loading.tsx`, `app/error.tsx` (`"use client"`, retry + home link), `app/not-found.tsx`, `app/(public)/habits/[slug]/not-found.tsx`.
- `ApiQueryError` shared component: Arabic title, detail, retry button; distinguishes `INVALID_API_RESPONSE` ("البيانات غير مطابقة للعقد"), `CHECKIN_REJECTED` (engine rule text + "صحّح وسجّل") and 404.
- Skeletons: habit cards grid, habit detail, check-in form, heatmap, dashboard, review grid.
- Empty states: no habits, no search results, no check-ins in period (`لسه مفيش تسجيلات`), no plan for this week (`عشان الثلاثاء ييجي وانت مرتاح — اكتب خطتك`) , fully-completed day (celebration, not empty).

---

# 15. Testing Strategy (Vitest)

`tests/mock-workflows.test.ts` — deterministic, `beforeEach(() => resetMockDatabase(42))`, drives the **same endpoint factories** the UI uses through a mock client:

```ts
function client(scope: ApiScope) { return createApiClient(createMockTransport(), scope); }
```

Required scenarios:
1. Home content loads; hero title is Arabic; principles = 7, features ≥ 4; stats derived (no hard-coded numbers in DTOs).
2. Categories: 4 categories, ordered by `order`, `habitCount`/`weeklyMinutesTarget` computed.
3. Habits: 9 active; `list({ search: "German" })` and `list({ search: "ألماني" })` both return `german-a1`; category/type/status filters combine correctly; pagination meta correct; `weeklyTargetLabel` formats: `يوميًا` / `5 أيام/أسبوع` / `الثلاثاء أسبوعيًا`.
4. Habit detail by slug; unknown slug → `ApiError 404 NOT_FOUND`; seeded streaks satisfy `bestStreak ≥ currentStreak`; `rate30` ∈ [0,100].
5. Resources: every habit has ≥ 1; all `filePath` start with `/habits/`; download/viewable flags sane.
6. Templates: every habit has a template whose first field is `status`; every option id unique; number bounds sane (min < max, presets within bounds).
7. Check-in flow: submit `done` for today → outcome `streak.current` +1 (daily habit), `today` endpoint reflects `completed`; resubmit same day **replaces** (no duplicate); `undo` restores previous streak; submitting for a future date → `ApiError 422 INVALID_API_REQUEST`; `skipped` without note → 422 with `fields.note`; `done` with minutes < 50% target → auto-partial with message, **not** an error.
8. Streak engine unit cases (in `tests/streak-engine.test.ts`): daily consecutive-day math across month boundary; partial counts, skipped/missed break daily; weekly-mode streak = consecutive hit-weeks (5/week target with exactly 5 partials ⇒ streak +1); at-risk/on-track/broken transitions; consistencyScore formula exact values for 3 fixtures.
9. Heatmap & review: month cell totals equal seeded history; `review` for the seeded week: `completed ≤ scheduled`, statuses match per-cell, insights array non-empty on a week with ≥ 1 check-in; overload flag flips when minutes > 3000 (craft input that crosses the cap).
10. Plan: GET current week returns seeded plan; PUT with 3 goals/5 tasks/3 ifThen persists and returns re-validated DTO; PUT with task estimate summing > cap is **allowed but flagged by review/stats** (planner warns client-side only — data layer doesn't police the plan).
11. App-state repository: draft save/load/clear round-trip; `lastVisitedHabit` set; corrupted localStorage → resets to default (no throw).

`tests/date-utils.test.ts`: `startOfWeek` respects Saturday start across year/month boundaries; `weekRange` pairs; `toISODate` no TZ drift (UTC vs local — pin the rule: ISO date = **local** calendar day).

---

# 16. Backend Handoff Docs (write, don't stub)

Create `docs/backend-handoff/` with:
- `README.md` — mock-first explanation + how HTTP mode activates.
- `architecture/HABITS_BACKEND_DATA_MODEL.md` — ER-style model from contracts (Category, Habit, HabitSchedule, CheckIn, WeeklyPlan, PlanGoal/Task/IfThen, AppState, StreakView as a projection — never a stored truth).
- `architecture/HABITS_BACKEND_API_CONTRACT.md` — the §5.7 endpoint table + all Zod shapes, frozen.
- `architecture/HABITS_BACKEND_BLUEPRINT.md` — suggested stack (REST + Postgres), auth/session plan (single-user + optional coach), day-boundary rule (store `IsoDate` + IANA tz `Africa/Cairo`, compute "missed" server-side at end of local day), sync strategy for offline check-ins (optimistic local write → reconcile by `createdAt`), reminders/notification phase-2 scope, migration off sessionStorage/localStorage.

---

# 17. Build Phases (follow in order, gate each)

**Phase 1 — Scaffold + layout + theme + providers.** Next app, pnpm, shadcn, Tailwind 4, RTL root layout, fonts, QueryProvider, ThemeProvider, Toaster, site config, constants (`CAP_WEEKLY_MINUTES` etc.), `loading/error/not-found` shells, header/footer/mobile nav, `.env.example`, config files. *Gate: `pnpm dev` runs RTL Arabic shell with dark toggle; `pnpm lint` clean.*

**Phase 2 — Data layer.** Contracts + Zod schemas + fixtures (real Arabic content from the txt) + seed-rng + mock store (with 8-week history seeding) + mock transport + api client + browser/server/scoped clients + endpoint factories + keys + hooks + server functions. *Gate: every §5.7 endpoint works through mock transport; `tests/mock-workflows.test.ts` scenarios 1–6 pass.*

**Phase 3 — Home + Categories + Habits list.** Home sections incl. TodayPulse + method cards, stats computed from data, categories pages, habits page with debounced search/filters/sort/skeletons/empty states. *Gate: flows Home → العادات → اختيار التصنيف → اختيار العادة work; responsive at 360–1440.*

**Phase 4 — Habit detail + resources + heatmap + streak cards.** Server shell + metadata + breadcrumbs, content sections, markdown renderer, streak summary, 12-week heatmap grid, resources view/download, prev/next within category, last-visited wiring. *Gate: all 9 habits render; invalid slug → not-found; scenario 4 pass; downloads serve from `/public`.*

**Phase 5 — Check-in engine + form.** Template endpoint, pure engine (`validateCheckIn`, `computeStreak`, `buildCheckInOutcome`), CheckInContainer with all 5 field kinds, date backfill, draft autosave + resume banner. *Gate: scenarios 7–8 pass; engine rejects are the only authority; today page updates after submit.*

**Phase 6 — Outcome + undo + week review.** Outcome screen, undo mutation, `/review` with 7×9 grid, totals, insights. *Gate: scenario 9 pass; review grid matches heatmap data for the same week.*

**Phase 7 — Planning + Dashboard.** Week planner form (goals/tasks/if-then/intention + save), app-state repo + hooks, dashboard cards incl. cap gauge + best streaks + continue + recent activity. *Gate: scenarios 10–11 pass; saving a plan and submitting a check-in survive refresh (session/local storage); completing today flips home pulse.*

**Phase 8 — SEO/A11y/responsive.** Metadata everywhere, JSON-LD breadcrumbs, keyboard + ARIA pass (heatmap, rating group, dialogs), contrast, dark mode audit, breakpoints.

**Phase 9 — Perf + polish.** Static shells, skeletons, `ApiQueryError` coverage, tone-of-voice copy pass (§13 — scan all strings for guilt wording), no unnecessary client components, Lighthouse ≥ 90 mobile.

**Phase 10 — Final.** `pnpm build` clean, `pnpm lint` clean, `pnpm test:mock` + `pnpm test:unit` green, all routes tested, backend-handoff docs written. *Gate: full acceptance checklist below.*

---

# 18. Definition of Done — Acceptance Checklist

1. [ ] `pnpm build` succeeds (TypeScript strict, no ignored errors).
2. [ ] `pnpm lint` has zero errors.
3. [ ] `pnpm test:mock` and `pnpm test:unit` green — all 11 + 2 scenarios.
4. [ ] All routes work: `/`, `/today`, `/habits`, `/habits/[slug]`, `/habits/[slug]/checkin`, `/categories`, `/categories/[slug]`, `/planning`, `/review`, `/review/[weekStart]`, `/dashboard`, `/about`, `/habits/nonexistent` → 404.
5. [ ] Check-in works for all 5 field kinds; outcome shows streak before→after, week progress, minutes vs cap; undo fully restores the previous day state.
6. [ ] `done` with low minutes auto-downgrades to `partial` with a visible Arabic message; `skipped` without reason is rejected; future dates are rejected.
7. [ ] Streaks: daily math, weekly math, `longest ≥ current`, partial never breaks a streak — verified in engine tests and visible in UI.
8. [ ] Heatmap (12 weeks on habit detail + month navigation) and week review grid agree with the same underlying history.
9. [ ] Week planner saves goals/tasks/if-then; Σ estimate shows against 3000 min; overload state flips red when crossed; plan survives refresh.
10. [ ] Draft autosave + resume banner works: type a note, refresh, draft restored, banner offered, `امسح` clears it.
11. [ ] Debounced search (Arabic + English both hit `german-a1`); empty state for no results; filters combine.
12. [ ] Arabic RTL correct everywhere (layout, forms, heatmap direction, ISO dates and English names LTR-inside-RTL); tested at 360/390/768/1024/1440.
13. [ ] Dark/light mode readable for heatmap steps, status dots, gauges, cards; no contrast regressions; no guilt-tone copy anywhere.
14. [ ] `NEXT_PUBLIC_API_MODE=http` activates fetch transport and no component code changes are needed (verified by temporarily pointing at a stub).
15. [ ] No TODO/FIXME placeholders in core functionality; no clickable divs; icons have labels; backend-handoff docs exist and match the contracts exactly; all 9 real habits + 7 principles from `happit-tracker-basic-info.txt` are present and reachable.

---

# 19. Strategy Provenance (how this prompt maps to the reference architecture)

This prompt reuses the strategy from the reference platform prompt (`HappyShareFrontend` lineage) with a 1:1 domain mapping. Keep these invariants while building:

- `src/lib/api/{config,contracts,schemas,transport,client,mock,modules}` shape; per-domain `endpoint.ts / hooks.ts / keys.ts / server.ts` quartet.
- `mock-transport` implements the same endpoints as the future REST API; `fetch-transport` is the only HTTP path; the switch is `apiConfig.mode`.
- Fixtures are JSON under `mock/fixtures/`, parsed by Zod at seed; pages never import them. Seeded history is generated, not hand-written, and re-validated through schemas.
- Thin App Router pages under route groups render named components; interactive views are `"use client"` and fetch exclusively via hooks; server pages use `server.ts` functions + `generateMetadata`/`generateStaticParams` (shell-only).
- Client scopes (`personal`) + `X-Client-Surface` header; `ApiError` with Arabic `INVALID_API_REQUEST` (422, field errors) / `INVALID_API_RESPONSE` (502) semantics.
- Query defaults: `staleTime 60s`, `gcTime 5m`, `retry 3`, exponential `retryDelay`, `refetchOnWindowFocus: false`, `keepPreviousData` on filtered lists; mutation success invalidates the full key fan-out (today/habits/heatmap/review/stats).
- Skeleton-first loading, shared retry error state, deliberate empty states — never silent fallback to static data.
- Backend handoff is a documented, contract-derived artifact, not a placeholder.

**Domain mapping (old → new):** units → categories · lessons → habits · quiz runner → check-in form · `GradeQuizInput`→`CheckInInputDto` · `gradeQuiz` engine → `streak-engine` · quiz result → check-in outcome · answer review → week review grid · lesson resources → habit resources · progress repository → app-state repository (drafts/settings) · localStorage key `edu2bac-progress-v1` → `aadati-appstate-v1` + mock db `aadati-mockdb-v1` · `correctAnswers`-never-leaked rule → template-contains-structure-only + engine-is-the-single-authority rule · home stats always computed from data.
