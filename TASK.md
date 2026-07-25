# TASK.md — Session Handoff

> **Date:** 2026-07-25
> **Session focus:** Branding cleanup (Phase 1.5) + Internet Explorer rework
> **Next session:** Decide which app to tackle next — or resume IE with a proper backend

---

## What Was Done

### Phase 1.5 — Branding Cleanup (Complete ✅)
- All user-facing "ryOS" → "OHMXO" in i18n files, About dialogs, boot screen, error screens
- Default contact replaced (Ryo Lu → Jacob Adeshiyan)
- IE bookmarks replaced (ryo.lu → ohmxo.com, Cursor → GitHub)
- Cursor brand assets deleted, OHMXO brand mark SVGs added
- All files: `index.html`, `package.json`, `BootScreen.tsx`, `AboutFinderDialog.tsx`, `AboutDialog.tsx`, `StartMenu.tsx`, `CursorBrandMark.tsx`, `shell.json`, `contacts.ts`, `useInternetExplorerStore.ts`, `useVideoStore.ts`, `metadata.ts` files, `ErrorBoundaries.tsx`, `BouncingLogo.tsx`, `ScreenSaverPicker.tsx`, `VersionDisplay.tsx`, `TelegramLinkDialog.tsx`, `appletImportExport.ts`

### Internet Explorer — Simplified (Done, but UI flow needs backend to render pages)

IE was reworked from a complex proxy + AI system to a local UI-only experience:

**What works:**
- Start page renders with search box + favorites grid
- Search queries open DuckDuckGo in a new browser tab
- Favorites/bookmarks open in new tab
- URLs typed into address bar open in new tab
- Stale localStorage state is wiped via store migration (v8)
- Dead code removed (~250 lines of proxy/Wayback/AI logic)

**What doesn't work (by design):**
- Loading ANY website in the iframe — every site blocks iframing (X-Frame-Options, CSP)
- Time-travel / AI generation — requires backend + AI key
- Wayback Machine proxy — removed
- `/api/iframe-check` calls — removed

**Key files modified:**
- `IeStartPage.tsx` — new local start page
- `useInternetExplorerLogic.ts` — simplified navigation, all URLs open in new tab
- `InternetExplorerUrlBar.tsx` — search opens DuckDuckGo in new tab
- `InternetExplorerContentPane.tsx` — renders start page on idle, error page with "Open in Browser"
- `InternetExplorerToolbar.tsx` — year selector hidden by default
- `useInternetExplorerStore.ts` — store version 8 with migration, removed passthrough domains

### What Remains Untouched
- All 28 apps still visible (no apps hidden beyond Chats)
- Books app — still EPUB-only
- Themes, wallpapers, colors — unchanged
- AI assistant "Ryo" — not renamed
- App metadata creator credits — still "Ryo Lu"
- Internal `ryos:*` keys, CSS classes, DB names — untouched
- Architecture docs, GitHub attribution — unchanged

---

## Technical Debt / Known Issues

### Internet Explorer — Fundamental Limitation
IE cannot display web pages in an iframe. No major website allows iframing. The app is now a functional **start page + link launcher** that opens everything in new tabs. The iframe still exists in the DOM but is never used since no domains are in the passthrough list.

**To make IE actually browse the web, two options:**
1. **Backend proxy** — Restore `/api/iframe-check` with a server-side fetch proxy that strips X-Frame-Options headers. Requires the API server running. This is what the original code did before simplification.
2. **Electron/desktop app** — Use the existing Electron build which could open a real browser window instead of an iframe.

### Store Persistence Cleanup
The store migration (v8) wipes stale state on first load. After that, IE persists `url`, `year`, `favorites`, `history` (50 items), `timelineSettings`, `language`, `location`, and debug toggles in localStorage under `ryos:internet-explorer`.

### Pending Brand Assets
From `docs/superpowers/specs/2026-07-24-brand-asset-requirements.md`:
1. Official OHMXO logo/brand mark (SVG)
2. Social links
3. Founder title/role wording
4. Privacy/terms URLs
5. Font licensing decision
6. Default wallpaper/direction
7. AI assistant name/personality

---

## Project State

All work on `main` branch, pushed to `origin` (ohmxo/ohmOS).

```
origin → https://github.com/ohmxo/ohmOS.git
upstream → https://github.com/ryokun6/ryos.git
```

### Latest Commits
```
16dba48d8 fix(ie): remove search engines from passthrough list
303aa40ec fix(ie): open non-passthrough URLs in new tab
38fbc0c63 fix(ie): silence fetchCachedYears and remove orphaned code
e39a2ca30 chore(ie): remove dead code from navigation cleanup
e7d9d9c8b fix(ie): bump store to v8 so migrate clears stale state
4416eafda fix(ie): search now opens DuckDuckGo in new tab
671fb7596 fix(ie): rewrite as local start page + new tab browser
88895db0a feat(branding): Phase 1.5 branding cleanup
79e6e0432 docs: add PROJECT_STATUS.md
```

### TypeScript: Clean ✅
`bun run typecheck` exits with code 0, zero errors.

---

## Recommended Next Steps

### Priority 1: Decide IE's Future
IE is a start page + link launcher right now. Decide if you want to:
- **Keep it as-is** — functional retro browser UI that opens links in real tabs
- **Restore backend proxy** — requires reinstating `/api/iframe-check` with a server-side fetch that strips frame-blocking headers, plus API server deployment
- **Remove/hide it** — if the simplified version isn't useful

### Priority 2: Books → Music Resource Library
The Books app reads EPUBs from the virtual file system. Seeding music industry guides as EPUBs requires zero code changes:
- Convert music marketing/business guides to EPUB
- Add them to `public/data/filesystem.json` under `/Books/`
- They appear automatically in the Books shelf

### Priority 3: Brand Assets (Blocked on You)
The 7 pending items from the asset requirements doc need your input before Phase 2 (themes, wallpapers, Studio app).

### Priority 4: AI Activation
With a single `ANTHROPIC_API_KEY` in `.env`, the chat endpoint `/api/chat` works immediately. The Chats app just needs `hidden: false` in the app registry. Unhiding it and wiring the assistant overlay would give the OS its AI assistant back.