# CLAUDE.md

## Project
Personal desktop-OS-style site for Jacob Adeshiyan / OHMXO Agency, forked from ryokun6/ryos.
Goal: a curated set of custom apps on top of the existing window/theme engine, showcasing
digital architecture for music × tech.

## Stack (inherited, don't relitigate)
React 19, TypeScript, Tailwind v4, shadcn/ui, Zustand, Vite, Bun. Backend: Vercel serverless
functions under `api/`, or the Bun standalone server for self-host.

## Hard rules
- Don't reintroduce Redis. It's neutralized via `NoopRedisAdapter` in `api/_utils/redis.ts`.
- Don't touch the tool-calling pipeline in `api/chat.ts` (Zod schemas, `onToolCall`) —
  that logic is independent of Redis and must keep working.
- Before adding any new app, check `src/apps/<existing-app>/` for the pattern to follow
  (folder structure, registration, multi-instance support).
- Cosmetic/theme changes go in `src/themes/` and `public/`, not scattered into app logic.
- Prefer hiding unused built-in apps via `hidden: true` in appRegistry over deleting code.
- This repo is AGPL-3.0. Don't strip or alter license headers/notices without being asked.
- Internet Explorer simplified to start page + new tab launcher. Every site blocks iframing.
  Don't try to re-add iframe loading without the backend proxy.
- Before touching IE navigation logic, read TASK.md for context on the simplification.

## Commands
- `bun install` — install deps
- `bun run dev` — full stack local dev (API + Vite)
- `bun run dev:vite` — frontend only (no API)
- `bun run build` — production build
- `bun run typecheck` — TypeScript compiler check
- `bun run lint` — eslint static analysis
- `bun run test:unit` — unit tests, no server needed

## Style
- Concise commits/PRs, no filler explanation in code comments.
- Single consolidated terminal commands over multi-step instructions when giving setup steps.
- Output docs/config as plain markdown/text — no unnecessary scaffolding beyond what's asked.

## Known decisions log
- Redis: neutralized via `NoopRedisAdapter`. Do not re-add without explicit requirement.
- Chats app: hidden via `hidden: true` in appRegistry. Code stays on disk.
- Assistant overlay: removed from AppManagerView. Files kept on disk.
- App roster: preserved as inherited (27 apps). All visible except Chats.
- Branding: all user-facing "ryOS" → "OHMXO" in Phase 1.5. Internal keys/classes untouched.
- IE: simplified to start page + new tab launcher. No iframe loading. Store version 8.
- Fork: `origin` → `ohmxo/ohmOS`, `upstream` → `ryokun6/ryos`. Push to `origin` to publish,
  pull from `upstream` for updates.
- Documentation: TASK.md is the session handoff source of truth. PROJECT_STATUS.md tracks
  phased migration progress. README.md is the public-facing overview.