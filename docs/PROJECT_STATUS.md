# OHMXO Migration — Project Status

> **Last updated:** 2026-07-25
> **Current phase:** Phase 1.5 — Branding Cleanup (Complete)
> **IE status:** Simplified to start page + new tab launcher
> **Docs:** Fully migrated from ryOS to ohmOS
> **Next phase:** Phase 2 — Brand Asset Integration (Awaiting decisions/assets)

---

## Quick Reference

```bash
bun run dev              # Full stack (API + Vite)
bun run dev:vite         # Frontend only
bun run typecheck        # TypeScript check (zero errors)
bun run lint             # ESLint (pre-existing warnings only)
bun run build            # Production build
```

---

## Phase 1 — Foundation (Complete ✅)

Strip Redis dependency, hide Chats app, configure remotes.

### Key files
- `api/_utils/redis.ts` — NoopRedisAdapter
- `api/_utils/api-handler.ts` — safe Redis import
- `src/config/appRegistry.tsx` — chats hidden

---

## Phase 1.5 — Branding Cleanup (Complete ✅)

Replace all user-facing ryOS/Ryo/Cursor references with OHMXO/Jacob.

### Commits
- `88895db0a` — Phase 1.5 branding cleanup (48 files)
- `6da55c770` — AGPL footer wire-up + repo URL fix
- `cf0b4d8ec` — comprehensive docs migration (443 "ryOS" → "ohmOS" in 63 files)

### What was changed
- `index.html` — title, OG/Twitter tags, description → OHMXO
- `package.json` — productName, description, author, homepage → OHMXO
- Boot screen, About dialogs, error screens, Start Menu → OHMXO
- `shell.json` — 20+ ryOS strings → OHMXO, Cursor → debug agent
- App metadata descriptions — "ryOS" removed from all
- Default contacts → Jacob/OHMXO (not Ryo Lu/Cursor)
- IE bookmarks → OHMXO, Docs, GitHub (not ryo.lu/os.ryo.lu)
- Cursor default video removed
- Brand mark SVGs, favicon, OG images replaced
- Cursor brand assets deleted
- AGPL-3.0 compliance footer with correct repo URL
- `docs/` — all 63 markdown files migrated, 443 instances of "ryOS" → "ohmOS"

### Not touched (by design)
- Internal `ryos:*` localStorage keys, CSS classes, DB names
- AI assistant "Ryo" name (pending OHMXO identity decision)
- App metadata creator credits ("Ryo Lu")
- `os.ryo.lu` internal config URLs

---

## Internet Explorer — Simplified

IE was reworked because it required a complex backend proxy + AI generation stack.

### What changed
| File | Change |
|------|--------|
| `IeStartPage.tsx` | New — local start page with search box + favorites grid |
| `useInternetExplorerLogic.ts` | ~250 lines removed — all proxy/Wayback/AI logic dropped. Navigation opens non-passthrough URLs in new tab |
| `InternetExplorerUrlBar.tsx` | Non-URL text → DuckDuckGo new tab. Search suggestions → DuckDuckGo new tab |
| `InternetExplorerContentPane.tsx` | Start page on idle, error page with "Open in Browser" button |
| `InternetExplorerToolbar.tsx` | Year selector hidden by default |
| `useInternetExplorerStore.ts` | Store v8 with migration reset. Passthrough domains reduced (every site blocks iframes) |
| `metadata.ts` | Help items updated for search engine focus |

### Current behavior
- **Start page** renders on cold start — search box + favorites grid
- **Type a search query** → DuckDuckGo in new tab
- **Type a URL** → opens in new tab, returns to start page
- **Click a favorite** → opens in new tab
- **No iframe errors** — nothing loads in the iframe (every site blocks iframing)
- **Time-travel** shows "not configured" placeholder

### Why it works this way
No major website allows iframing. Google, DuckDuckGo, Bing, GitHub, Apple all send `X-Frame-Options: DENY/SAMEORIGIN` or `frame-ancestors 'none'/'self'`. The only way to show real web pages in IE is via a server-side proxy that strips frame-blocking headers — which requires the full API backend deployed.

---

## .codex/ Project Config

The project now has a `.codex/` folder with project-specific OMX configuration including hooks registry and agent definitions.

---

## AGPL-3.0 Compliance

- `src/components/layout/AgplFooter.tsx` — fixed-bottom footer visible on every screen
- Wired into `src/App.tsx` alongside ScreenSaverOverlay
- Links to `https://github.com/ohmxo/ohmOS`

---

## IDE Diagnostics (Non-Blocking)

| Severity | File | Issue |
|----------|------|-------|
| Info | `api/tsconfig.json` | `baseUrl` deprecated in TypeScript 7.0 — suppressed with `ignoreDeprecations: "6.0"` |
| Info | `src/components/debug/DebugLogOverlay.tsx` | Tailwind CSS v4 canonical class suggestions (style-only) |
| Info | `src/config/appRegistry.tsx` | Biome `useLiteralKeys` suggestions, 2 non-null assertions |
| Warning | `tests/unit/chat/test-chat-row-render-counts.test.tsx` | Unused `useState`, `prefer-const` |

---

## Pending Brand Assets & Decisions

Reference: `docs/superpowers/specs/2026-07-24-brand-asset-requirements.md`

| # | Item | Type | Required For |
|---|------|------|-------------|
| 1 | Official OHMXO logo/brand mark (SVG) | Asset | Brand mark, favicon, social cards |
| 2 | Social links (Twitter/X, LinkedIn, IG, GitHub) | Info | Default contacts, bookmarks |
| 3 | Founder title/role wording | Decision | About dialog, contact info |
| 4 | Privacy policy URL / terms URL | Decision | Legal footer |
| 5 | Font licensing decision | Decision | Themes, UI typography |
| 6 | Default wallpaper / theme direction | Decision | Boot screen, desktop |
| 7 | AI assistant name and personality | Decision | AI chat, assistant overlay |

---

## AI Integration Status

| Feature | Status | What's Required |
|---------|--------|----------------|
| Chat endpoint `/api/chat` | Wired, blocked | At least one AI provider key |
| Chats app | `hidden: true` | Remove flag when ready |
| Assistant overlay | Dead code (not rendered) | Wire into layout, define OHMXO persona |
| TTS `/api/speech` | Wired, blocked | `ELEVENLABS_API_KEY` or `OPENAI_API_KEY` |
| STT `/api/audio-transcribe` | Wired, blocked | `OPENAI_API_KEY` |
| Rate limiting | Disabled (NoopRedisAdapter) | Enable if Redis configured |
| Conversation persistence | Disabled | Requires Redis |
| IE generation `/api/ie-generate` | Wired but IE simplified | AI key + Redis |
| Applet AI | Wired | `GOOGLE_GENERATIVE_AI_API_KEY` |

---

## Key Documents

- [TASK.md](TASK.md) — Session handoff & current focus
- [README.md](README.md) — Public-facing overview
- [CLAUDE.md](CLAUDE.md) — Claude Code project instructions
- [AGENTS.md](AGENTS.md) — Cloud environment guide
- [PLAN.md](PLAN.md) — High-level roadmap
- [ROADMAP.md](ROADMAP.md) — Implementation phases
