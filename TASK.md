# TASK.md — Session Handoff

> **Date:** 2026-07-25
> **Session focus:** Docs migration, .codex setup, AGPL footer wire-up, tsconfig fix
> **Next session:** Decide which app to tackle next — or restore IE backend proxy

---

## What Was Done

### AGPL-3.0 Compliance Footer
- `src/components/layout/AgplFooter.tsx` — new fixed-bottom footer with source link
- Wired in `src/App.tsx` alongside ScreenSaverOverlay
- Repo URL corrected from `ohmxo/ryos` to `ohmxo/ohmOS`

### .codex/ Setup
- `.codex/` folder initialized with project-specific hooks, agents, and config

### Docs Migration
- 443 instances of "ryOS" renamed to "ohmOS" across 63 markdown files in `docs/`
- `api/tsconfig.json` — added `ignoreDeprecations: "6.0"` for TypeScript 7.0 compat
- `.env.example` committed

### Previous Work

#### Phase 1.5 — Branding Cleanup (Complete ✅)
- All user-facing "ryOS" → "OHMXO" in i18n files, About dialogs, boot screen, error screens
- Default contact replaced (Ryo Lu → Jacob Adeshiyan)
- IE bookmarks replaced (ryo.lu → ohmxo.com, Cursor → GitHub)
- Cursor brand assets deleted, OHMXO brand mark SVGs added

#### Internet Explorer — Simplified
IE was reworked from a complex proxy + AI system to a local UI-only experience:

**What works:**
- Start page renders with search box + favorites grid
- Search queries open DuckDuckGo in a new browser tab
- Favorites/bookmarks open in new tab
- URLs typed into address bar open in new tab
- Stale localStorage state is wiped via store migration (v8)

**What doesn't work (by design):**
- Loading ANY website in the iframe — every site blocks iframing
- Time-travel / AI generation — requires backend + AI key
- Wayback Machine proxy — removed

### Latest Commits
```
6da55c770 fix: wire AGPL footer into app shell and correct repo URL
7b0d69a48 chore: rename repo to ohmOS
cf0b4d8ec docs: comprehensive project documentation update
16dba48d8 fix(ie): remove search engines from passthrough list
303aa40ec fix(ie): open non-passthrough URLs in new tab
38fbc0c63 fix(ie): silence fetchCachedYears and remove orphaned code
e39a2ca30 chore(ie): remove dead code from navigation cleanup
e7d9d9c8b fix(ie): bump store to v8 so migrate clears stale state
9edc8e2fa fix(ie): add store migration to reset stale state on version bump
4416eafda fix(ie): search now opens DuckDuckGo in new tab
671fb7596 fix(ie): rewrite as local start page + new tab browser
88895db0a feat(branding): Phase 1.5 branding cleanup
79e6e0432 docs: add PROJECT_STATUS.md
```

## TypeScript: Clean ✅
`bun run typecheck` exits with code 0, zero errors.

## Technical Debt / Known Issues

### Internet Explorer — Fundamental Limitation
IE cannot display web pages in an iframe. No major website allows iframing. The app is now a functional **start page + link launcher** that opens everything in new tabs.

### IDE Diagnostics (non-blocking)
- `api/tsconfig.json` — `baseUrl` deprecated in TS 7.0 (suppressed with `ignoreDeprecations: "6.0"`)
- Tailwind CSS v4 canonical class suggestions (minor, style-only)
- Biome lint warnings in `appRegistry.tsx` (useLiteralKeys suggestions)
- `DebugLogOverlay.tsx` — 2 non-null assertions flagged by Biome

### Pending Brand Assets
From `docs/superpowers/specs/2026-07-24-brand-asset-requirements.md`:
1. Official OHMXO logo/brand mark (SVG)
2. Social links
3. Founder title/role wording
4. Privacy/terms URLs
5. Font licensing decision
6. Default wallpaper/direction
7. AI assistant name/personality

## Project State

All work on `main` branch, pushed to `origin` (ohmxo/ohmOS).

```
origin → https://github.com/ohmxo/ohmOS.git
upstream → https://github.com/ryokun6/ryos.git
```
