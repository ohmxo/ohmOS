# CLAUDE.md

## Project
Personal desktop-OS-style site for Jacob Adeshiyan (GNRE), forked from ryokun6/ryos.
Goal: quality over quantity — a small, curated set of custom apps on top of the existing
window/theme engine, not a reproduction of every ryOS feature.

## Stack (inherited, don't relitigate)
React 19, TypeScript, Tailwind v4, shadcn/ui, Zustand, Vite, Bun. Backend: Vercel serverless
functions under `api/`, or the Bun standalone server for self-host.

## Hard rules
- Don't reintroduce Redis for anything other than what's explicitly asked for. This project
  does not need multi-user auth tokens or per-IP rate limiting — it's a single-owner site.
  Redis is currently neutralized via `NoopRedisAdapter` in `api/_utils/redis.ts`.
- Don't touch the tool-calling pipeline in `api/chat.ts` (Zod schemas, `onToolCall`) when
  working on the Redis removal — that logic is independent of Redis and must keep working.
- Before adding any new app, check `src/apps/<existing-app>/` for the pattern to follow
  (folder structure, registration, multi-instance support) rather than inventing a new pattern.
- Cosmetic/theme changes go in `src/themes/` and `public/`, not scattered into app logic.
- Prefer hiding unused built-in apps via `hidden: true` in appRegistry over deleting code.
- This repo is AGPL-3.0. Don't strip or alter license headers/notices without being asked.

## Commands
- `bun install` — install deps
- `bun run dev` — full stack local dev (API + Vite)
- `bun run build` — production build
- `bun run typecheck` — TypeScript compiler check
- `bun run lint` — eslint static analysis
- `bun run test:unit` — unit tests, no server needed

## Style
- Concise commits/PRs, no filler explanation in code comments.
- Single consolidated terminal commands over multi-step instructions when giving setup steps.
- Output docs/config as plain markdown/text — no unnecessary scaffolding beyond what's asked.

## Known decisions log
- Redis: neutralized via `NoopRedisAdapter` in `redis.ts` — `createRedis()` returns noop adapter
  when no Redis env vars are set. Auth and rate-limiting calls still exist in code but degrade
  gracefully (returns empty/default values). Do not re-add Redis without an explicit requirement.
  See REDIS_REMOVAL.md for details.
- Chats app: hidden from UI via `hidden: true` in app registry in `appRegistry.tsx`. Code
  remains on disk and compiled — no deletions. Assistant overlay similarly removed from
  `AppManagerView.tsx` but files kept on disk.
- App roster: preserved as inherited pending decision (27 apps). Upstream updates merged
  via `git fetch upstream && git merge upstream/main`.
- Fork: `origin` → `ohmxo/ryos`, `upstream` → `ryokun6/ryos`. Push to `origin` to publish,
  pull from `upstream` for updates.