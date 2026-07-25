# Implementation Roadmap — OHMXO OS Fork

## Current State

- **28 apps** registered, 27 visible (Chats hidden)
- **Branding**: all user-facing ryOS → OHMXO (Phase 1.5 complete)
- **IE**: simplified to start page + new tab launcher (iframe disabled — all sites block it)
- **AI pipeline**: wired but needs provider keys; Chats hidden, Assistant overlay not rendered
- **Redis**: neutralized via `NoopRedisAdapter`
- **Deployment**: Docker/Coolify only
- **Pending brand assets**: logo files, social links, fonts, wallpaper, AI assistant identity

---

## Quick Wins (complete)
- [x] Site name, meta tags, OG tags → OHMXO (`index.html`, `package.json`)
- [x] Boot screen, About dialogs, error screens → OHMXO branding
- [x] Default contacts, IE bookmarks, TV default video → Jacob/OHMXO
- [x] Brand mark SVGs (OHMXO), favicon, OG images replaced
- [x] Cursor brand assets deleted

## Medium Improvements
- [ ] Books → Music Resource Library (seed EPUB guides)
- [ ] AI assistant activation (set provider key, unhide Chats)
- [ ] Custom app icons for music apps
- [ ] App roster polish (curated dock, custom icons)

## Bigger Features
- Custom "OHMXO" theme (dark minimalist)
- Studio app — campaign case studies (Fasina, Réayo, etc.)
- Chartmetric-style stats widget
- Branded voice assistant
- Pre-save/DSP pitch generator
- Ad ROI calculator