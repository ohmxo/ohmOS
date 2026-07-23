# PLAN.md
Status: DRAFT / BRAINSTORM — nothing below is committed. Re-order, cut, or ignore freely.

## Phase 0 — Foundation
- Fork ryos, get `bun run dev` running locally
- Read AGENTS.md + docs/ before making changes (repo expects AI-assisted edits to follow its
  own conventions)
- Strip apps you won't use down to: Finder, Terminal, Videos, (maybe) Photo Booth

## Phase 1 — De-risk the AI chat feature
- Remove/neutralize Redis-dependent auth + rate limiting in `api/chat.ts`
  (see REDIS_REMOVAL.md for exact steps)
- Decide: keep Chats app at all, or replace with a single simpler "ask me anything" assistant
  with no multi-user/token complexity
- Confirm which AI provider keys you're using and set them via `.env` (see .env.example)

## Phase 2 — Make it yours
- Swap wallpapers, icons, default theme to ohmxo/GNRE branding
- Port content currently on ohmxo.com/studio into the OS (case studies, campaign stats, contact)
- Decide which of the 4 themes (System 7 / Aqua / XP / 98) ship by default vs. as toggle options
- Confirm AGPL disclosure approach before going live (see LICENSE_NOTES.md)

## Phase 3 — Optional apps (parking lot, not a roadmap)
- Studio app — campaign case studies as "files" (Fasina, Réayo, etc.)
- Chartmetric-style stats widget
- Branded voice assistant (built on the surviving AI chat pipeline)
- Pre-save/DSP pitch generator applet
- Ad ROI calculator (retro calculator skin, real math)
- Showreel via existing Videos app
- Run-log widget
- History/economics timeline app (riff on Internet Explorer's time-travel concept)

## Phase 4 — Ship
- Pick Vercel or self-host (Docker/Coolify)
- Point ohmxo.com DNS at the new deployment once you're happy with parity
- Keep the old site reachable at a subpath or backup for a few weeks in case anything's missing
