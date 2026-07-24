# PLAN.md

## Phase 0 — Foundation ✅
- [x] Fork ryos, get `bun run dev` running locally
- [x] Remotes set up: `origin` → `ohmxo/ryos`, `upstream` → `ryokun6/ryos`
- [x] Read AGENTS.md + docs/ before making changes
- [ ] Strip apps you won't use down to: Finder, Terminal, Videos, (maybe) Photo Booth
      *(Not yet executed — 27 apps remain)*

## Phase 1 — De-risk the AI chat feature ✅
- [x] Remove/neutralize Redis-dependent auth + rate limiting — done via `NoopRedisAdapter`
- [x] Hide Chats app from UI (`hidden: true` in registry, code stays on disk)
- [x] Remove Assistant overlay from AppManagerView (code stays on disk)
- [x] Fork and remotes configured
- [ ] Confirm which AI provider keys to use and set via `.env`
- [ ] Decide on Pusher realtime wiring

## Phase 2 — Make it yours
- [ ] Swap wallpapers, icons, default theme to ohmxo/GNRE branding
- [ ] Port content from ohmxo.com/studio into the OS (case studies, campaign stats, contact)
- [ ] Decide which of the 4 themes (System 7 / Aqua / XP / 98) ship by default
- [ ] Confirm AGPL disclosure approach before going live (see LICENSE_NOTES.md)

## Phase 3 — Optional apps (parking lot)
- Studio app — campaign case studies as "files" (Fasina, Réayo, etc.)
- Chartmetric-style stats widget
- Branded voice assistant (built on surviving AI chat pipeline)
- Pre-save/DSP pitch generator applet
- Ad ROI calculator (retro calculator skin, real math)
- Showreel via existing Videos app
- Run-log widget
- History/economics timeline app (riff on Internet Explorer's time-travel concept)

## Phase 4 — Ship
- Pick Vercel or self-host (Docker/Coolify)
- Point ohmxo.com DNS at the new deployment
- Keep old site reachable at a subpath for a few weeks