# OHMXO Migration — Project Status

> **Last updated:** 2026-07-24
> **Current phase:** Phase 1.5 — Branding Cleanup (Complete)
> **Next phase:** Phase 2 — Brand Asset Integration (Awaiting decisions/assets)

---

## Phase 1 — Foundation (Complete ✅)

Strip Redis dependency, hide Chats app, configure remotes.

### Changes
- Redis neutralized via `NoopRedisAdapter` in `api/_utils/redis.ts` — all Redis calls return empty/default values
- Chats app hidden via `hidden: true` in `src/config/appRegistry.tsx`
- Assistant overlay removed from `AppManagerView.tsx`
- Remotes configured: `origin` → ohmxo/ryos, `upstream` → ryokun6/ryos
- Docs updated: `ARCHITECTURE.md`, `CLAUDE.md`, `PLAN.md`, `REDIS_REMOVAL.md`

### Files modified
- `api/_utils/redis.ts` — NoopRedisAdapter
- `api/_utils/api-handler.ts` — safe Redis import
- `src/config/appRegistry.tsx` — chats hidden
- Various documentation files

---

## Phase 1.5 — User-Facing Branding Cleanup (Complete ✅)

Replace user-facing ryOS/Ryo/Cursor references with OHMXO/Jacob. Content-only — no themes, colors, layouts, or app structural changes.

### Commits
- `88895db0a` — Phase 1.5 branding cleanup (48 files)

### Files modified

| File | Change |
|------|--------|
| `index.html` | Title, OG/Twitter tags, description, site name → OHMXO |
| `package.json` | productName, description, author, homepage → OHMXO/Jacob |
| `src/components/dialogs/BootScreen.tsx` | ryOS X → OHMXO (Aqua), ry→OH OS→MXO (System 7) |
| `src/components/dialogs/AboutFinderDialog.tsx` | ryOS heading, © Ryo Lu → © Jacob |
| `src/components/dialogs/AboutDialog.tsx` | os.ryo.lu → ohmxo.com URL |
| `src/components/layout/StartMenu.tsx` | ryOS → OHMXO in Windows sidebar |
| `src/components/shared/CursorBrandMark.tsx` | Cursor cube → OHMXO brand mark SVGs |
| `src/lib/locales/en/shell.json` | 20+ ryOS strings → OHMXO; Cursor → debug/cloud agent |
| `src/apps/finder/metadata.ts` | "ryOS users" → "users" |
| `src/apps/chats/metadata.ts` | "ryOS features" → "the system" |
| `src/apps/videos/metadata.ts` | "ryOS fetches" → simplified |
| `src/apps/ipod/metadata.ts` | "ryOS links" → "links" |
| `src/apps/calculator/metadata.ts` | "ryOS API" → "the API" |
| `src/apps/books/metadata.ts` | "Sign in to ryOS" → "Sign in" |
| `src/components/screensavers/BouncingLogo.tsx` | ryOS → OHMXO SVG text |
| `src/apps/control-panels/components/ScreenSaverPicker.tsx` | ryOS → OHMXO canvas text |
| `src/components/errors/ErrorBoundaries.tsx` | ryOS title → OHMXO |
| `src/apps/control-panels/.../VersionDisplay.tsx` | ryOS → OHMXO, os.ryo.lu → ohmxo.com |
| `src/utils/contacts.ts` | Ryo Lu → Jacob, Cursor → OHMXO, ryo.lu → ohmxo.com |
| `src/stores/useInternetExplorerStore.ts` | Bookmarks: Ryo→OHMXO, ryOS Docs→Docs, Cursor→GitHub |
| `src/stores/useVideoStore.ts` | Removed Cursor channel default video |
| `src/apps/applet-viewer/hooks/useAppletViewerLogic.ts` | ryOS→OHMXO filter label |
| `src/utils/appletImportExport.ts` | ryOS→OHMXO filter label |
| `src/components/dialogs/TelegramLinkDialog.tsx` | ryOS→OHMXO alt text |

### Assets created/replaced
- `public/brands/ohmxo-mark-light.svg` — OHMXO brand mark (light bg)
- `public/brands/ohmxo-mark-dark.svg` — OHMXO brand mark (dark bg)
- `public/brands/ohmxo-nav-logo.svg` — OHMXO nav logo (downloaded from ohmxo.com)
- `public/favicon-32.png` — OHMXO favicon
- `public/apple-touch-icon.png` — Replaced with OHMXO icon
- `public/icons/mac-512.png` — Replaced with OHMXO OG image
- `public/icons/mac-192.png` — Replaced with OHMXO icon
- `public/brands/cursor-cube-2d-*.svg` — Deleted (orphaned)

### Decisions made
| Decision | Value |
|----------|-------|
| Brand name | OHMXO |
| Founder | Jacob Adeshiyan |
| Positioning | Digital architecture × music × technology |
| Domain | ohmxo.com |
| Tagline | "Digital architecture for artists, brands, and creative enterprises." |
| OG description | "Digital architecture for music × tech" |

---

## Items Intentionally Left Untouched

| Category | Reason |
|----------|--------|
| App metadata `creator: { name: "Ryo Lu" }` | Original attribution — pending decision on OHMXO ownership vs preserved credits |
| `ryos:*` localStorage keys | Internal state persistence — changing would break all user state |
| `[ryOS]` console.log/warn prefixes | Internal debugging — not user-facing |
| `ryos-*` CSS classes | Styling — would need comprehensive theme rebuild |
| `data-ryos-*` DOM attributes | Internal markers — not user-facing |
| `DB_NAME = "ryOS"` in IndexedDB | Internal database name |
| AI assistant "Ryo" name | Pending OHMXO assistant identity decision |
| `os.ryo.lu` internal config URLs | Internal only — update when domain migration requires it |
| Architecture/API documentation | Pending broader docs pass |
| AGENTS.md | Internal developer documentation |
| GitHub repo attribution | Correct code origin |
| All app metadata GitHub links | Correct upstream source — keep as `ryokun6/ryos` |

---

## Pending Brand Assets & Decisions

Reference: `docs/superpowers/specs/2026-07-24-brand-asset-requirements.md`

| # | Item | Type | Required For |
|---|------|------|-------------|
| 1 | Official OHMXO logo/brand mark (SVG) | Asset | Brand mark in OS, favicon, social cards |
| 2 | Social links (Twitter/X, LinkedIn, Instagram, GitHub) | Information | Default contacts, bookmarks, footer |
| 3 | Founder title/role wording | Decision | About dialog, contact info |
| 4 | Privacy policy URL / terms of service URL | Decision | Legal footer, About dialog |
| 5 | Font licensing decision (Humane, Neue Montreal vs alternatives) | Decision | Theme system, UI typography |
| 6 | Default wallpaper / theme direction | Decision | Boot screen, desktop background |
| 7 | AI assistant name and personality | Decision | AI chat, assistant overlay |

---

## AI Integration Status

| Feature | Status | What's Required |
|---------|--------|----------------|
| Chat endpoint `/api/chat` | Wired, blocked | At least one AI provider key |
| Chats app | `hidden: true` | Remove hidden flag when ready |
| Assistant overlay | Dead code (not rendered) | Wire into layout and define OHMXO persona |
| TTS `/api/speech` | Wired, blocked | `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` |
| STT `/api/audio-transcribe` | Wired, blocked | `OPENAI_API_KEY` |
| Rate limiting | Disabled (NoopRedisAdapter bypass) | Enable if Redis is configured |
| Conversation persistence | Disabled | Requires Redis |
| IE generation `/api/ie-generate` | Wired but app visible | AI key + Redis for caching |
| Applet AI `/api/applet-ai` | Wired | `GOOGLE_GENERATIVE_AI_API_KEY` |

Key finding: With just one AI provider key (e.g., `ANTHROPIC_API_KEY`), chat works immediately for single-session use. Full functionality (history, persistence) requires Redis. Pusher is optional (graceful fallback).

---

## Recommended Next Steps

### Phase 2 — Brand Asset Integration (blocked on decisions above)
1. Collect official OHMXO logo files and social links
2. Confirm font strategy (licenses or alternatives)
3. Choose default wallpaper / theme direction
4. Define AI assistant identity
5. Set privacy/terms policy URLs
6. Apply collected assets to OS chrome (themes, icons, wallpapers)
7. Wire AI assistant with OHMXO personality

### Phase 3 — Portfolio Content
8. Studio app — campaign case studies (Works.csv data)
9. Chartmetric-style stats widget
10. Branded voice assistant

### Phase 4 — Deployment
11. Set AI provider keys in production
12. Configure domain (ohmxo.com DNS)
13. Privacy/AGPL disclosure

---

## Quick Reference

```bash
# Development
bun run dev              # Full stack (API + Vite)
bun run dev:vite         # Frontend only
bun run typecheck        # TypeScript check
bun run lint             # ESLint
bun run build            # Production build
```
