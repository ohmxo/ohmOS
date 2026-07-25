# PLAN.md

## Phase 0 — Foundation ✅
- [x] Fork ryos, get `bun run dev` running locally
- [x] Remotes set up: `origin` → `ohmxo/ryos`, `upstream` → `ryokun6/ryos`
- [x] Read AGENTS.md + docs/ before making changes
- [ ] Strip apps you won't use — decision deferred (27 apps remain, all visible)

## Phase 1 — De-risk the AI chat feature ✅
- [x] Remove/neutralize Redis-dependent auth + rate limiting — done via `NoopRedisAdapter`
- [x] Hide Chats app from UI (`hidden: true` in registry, code stays on disk)
- [x] Remove Assistant overlay from AppManagerView (code stays on disk)
- [x] Fork and remotes configured
- [ ] Confirm which AI provider keys to use and set via `.env` — still pending
- [ ] Decide on Pusher realtime wiring — still pending

## Phase 1.5 — Branding cleanup ✅
- [x] Replace all user-facing "ryOS" → "OHMXO" in locales, About dialogs, boot screen, errors
- [x] Replace Ryo Lu/Cursor references in default contacts, bookmarks, TV app defaults
- [x] Swap favicon, OG images, brand mark SVGs
- [x] Update package.json, index.html metadata
- [x] All docs updated (PROJECT_STATUS.md, README.md, TASK.md)

## Phase 2 — Make it yours (blocked on brand assets)
- [ ] Collect official OHMXO logo/brand mark files
- [ ] Confirm font strategy (Humane/Neue Montreal vs alternatives)
- [ ] Choose default wallpaper / theme direction
- [ ] Define AI assistant identity (name, personality)
- [ ] Set privacy/terms policy URLs
- [ ] Apply collected assets to OS chrome (themes, icons, wallpapers)
- [ ] Wire AI assistant with OHMXO personality

## Phase 3 — Optional apps (parking lot)
- Studio app — campaign case studies as "files" (Fasina, Réayo, etc.)
- Chartmetric-style stats widget
- Branded voice assistant (built on surviving AI chat pipeline)
- Pre-save/DSP pitch generator applet
- Ad ROI calculator (retro calculator skin, real math)
- Showreel via existing Videos app
- Books → Music Resource Library (seed EPUB guides)
- Run-log widget
- History/economics timeline app (riff on Internet Explorer's time-travel concept)

## Phase 4 — Ship
- Pick Vercel or self-host (Docker/Coolify)
- Point ohmxo.com DNS at the new deployment
- Keep old site reachable at a subpath for a few weeks