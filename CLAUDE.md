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
- Don't touch the tool-calling pipeline in `api/chat.ts` (Zod schemas, `onToolCall`) when
  working on the Redis removal — that logic is independent of Redis and must keep working.
- Before adding any new app, check `src/apps/<existing-app>/` for the pattern to follow
  (folder structure, registration, multi-instance support) rather than inventing a new pattern.
- Cosmetic/theme changes go in `src/themes/` and `public/`, not scattered into app logic.
- Prefer removing/disabling unused built-in apps over leaving them half-wired — dead code that
  still appears in the Applications menu is worse than no app at all.
- This repo is AGPL-3.0. Don't strip or alter license headers/notices without being asked.

## When asked to remove/replace a dependency (e.g. Redis, Pusher)
1. Identify every call site first (grep, don't assume).
2. State what functionality will be lost before making the change.
3. Prefer the smallest change that satisfies the ask — don't refactor adjacent working code.

## Commands (adjust once repo is actually cloned)
- `bun install` — install deps
- `bun run dev` — full stack local dev (API + Vite)
- `bun run build` — production build
- `bun run lint` — lint
- `bun run test:unit` — unit tests, no server needed

## Style
- Concise commits/PRs, no filler explanation in code comments.
- Single consolidated terminal commands over multi-step instructions when giving setup steps.
- Output docs/config as plain markdown/text — no unnecessary scaffolding beyond what's asked.

## Known decisions log
- Redis: removed/neutralized for auth + rate limiting (see REDIS_REMOVAL.md). Do not re-add
  without an explicit new requirement.
- App roster: trimmed from full ryOS set — see PLAN.md Phase 0 for current keep-list.
