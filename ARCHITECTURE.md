# ARCHITECTURE.md

## 1. What this is
A fork of ryOS (github.com/ryokun6/ryos) — a browser-based desktop OS (React 19 + TypeScript)
repurposed as a personal site/portfolio for Jacob Adeshiyan (GNRE). Retains the windowing/theme
engine, strips or replaces app content to be personal rather than a generic OS demo.

## 2. Layered structure (as inherited from ryOS)
- **Desktop Environment Layer** — window manager, drag/resize/minimize, theme switching
  (System 7 / Aqua / Windows XP / Windows 98), wallpaper system.
- **Application Framework Layer** — every app is a self-contained module under `src/apps/<name>/`,
  launched via `useLaunchApp()` → `useAppStore.launchApp()`. Supports multi-instance windows
  (e.g. multiple TextEdit docs) via `instanceId`.
- **AI Integration Layer** — `/api/chat` (serverless, Vercel Edge) streams responses from
  OpenAI/Anthropic/Google via Vercel AI SDK, and can call structured "tools" (Zod-validated
  functions) that manipulate app state directly — e.g. `launchApp`, `switchTheme`,
  `textEditInsertText`. This is what makes it "agentic" rather than a static desktop skin.
- **Shared Services Layer** — virtual file system (`useFilesStore`, metadata in Zustand,
  content in IndexedDB), audio engine (Tone.js/WaveSurfer), UI primitives (shadcn/ui).

## 3. State management
Zustand stores per-domain: `useAppStore` (window/app state), `useFilesStore` (VFS),
`useThemeStore` (active theme), `useTextEditStore`, etc. Persistence is IndexedDB/localStorage —
no backend database for personal data; it lives in the visitor's browser.

## 4. Backend surface (`/api`)
Deployed as Vercel serverless functions (or the Bun standalone server for self-hosting):
- `api/chat.ts` — the AI chat endpoint. Handles origin validation, (optionally) auth,
  (optionally) rate limiting, model selection, system-state injection into the prompt,
  tool-call execution, streaming response.
- Speech-to-text / text-to-speech endpoints for voice features.
- `api/ie-generate.ts` — AI HTML generation for Internet Explorer time-travel app.
- `api/iframe-check.ts` — Wayback Machine proxying, CORS proxy, AI cache for IE.

## 5. What depends on Redis (and what doesn't)
Redis (Upstash) is used ONLY for:
- `chat:token:*` keys — multi-user auth token storage/refresh for the Chats app.
- AI message rate-limit counters (per-user/IP, 5-hour sliding window).
- IE page generation cache (`api/ie-generate.ts`, `api/iframe-check.ts`).
- Analytics events, geo caching, timezone storage, room management, etc.

**Redis was neutralized via noop adapter** — see REDIS_REMOVAL.md. A `NoopRedisAdapter` in
`api/_utils/redis.ts` implements the full `RedisLike` interface with no-op methods.
`createRedis()` returns it when no Redis env vars are set. All existing call sites still
compile and run — they just get empty/default values back instead of real data.

Redis is NOT used for: window management, themes, file system, tool-calling itself, or any
of the non-chat apps. Removing it only affects the Chats app's multi-user auth/throttling
and IE's backend caching — everything else is unaffected.

Pusher (realtime pub/sub for multi-user chat rooms) is a separate concern — not addressed
in Phase 1. Still wired in the codebase, will no-op if not configured.

## 6. Where your customization lives
- `src/apps/` — add new apps here (Studio, Chartmetric widget, etc.), each gets its own folder,
  icon, and entry in the app registry.
- `src/themes/` — cosmetic changes (colors, wallpaper defaults) without touching logic.
- `public/` — icons, sounds, default wallpapers, fonts.
- `api/chat.ts` — only touch this for new tool calls for a custom app; Redis/auth changes
  were handled at the handler level (see REDIS_REMOVAL.md).

## 7. Deployment
Two supported paths: Vercel (serverless, matches the original repo's design) or self-host via
the single Bun production server (Docker/Coolify). Self-host avoids any Vercel KV/Redis
coupling by default.

## 8. Licensing — read this before shipping publicly
ryOS is AGPL-3.0 licensed. See LICENSE_NOTES.md for details.