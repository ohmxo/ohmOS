# TASK.md — Session Handoff

> **Date:** 2026-07-26
> **Session focus:** Internet Explorer wiring finalization + IDE diagnostic sweep
> **Next session:** Pick the next app polish item from `docs/superpowers/specs/`, or revisit IE live-loading UX

---

## What Was Done

### Internet Explorer — Final Wiring (`89dcdc68d`)

The IE app was simplified to **start page + iframe-based browsing** in prior sessions, but a small number of stale references to the time-travel machinery remained. Resolved all of them.

- `useInternetExplorerLogic.ts` — dropped unused `log` import and `isNavigatingHistory` destructure; exposed `normalizeUrlForHistory` as an alias of `normalizeUrlInline` for the favorites bar pass-through
- `InternetExplorerAppComponent.tsx` — added `normalizeUrlForHistory` to destructure + forward, dropped unused `errorDetails`
- `InternetExplorerToolbar.tsx` — added `normalizeUrlForHistory` to the props interface + destructure so it forwards to `InternetExplorerFavoritesBar`
- Verified: `handleNavigate` still routes through `/api/iframe-check?mode=proxy&url=<encoded>&theme=<theme>` with `sandbox="allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock"`

### IDE Diagnostic Sweep (`a2da18339` + this session)

Reduced the IDE "Problems" panel from **54 items → 0** (modulo stale caches for files deleted in git):

- **25 × `useLiteralKeys` in `appRegistry.tsx`** — converted `["app-name"]: { ... }` to `"app-name": { ... }` via `sed` (one regex, no per-line edits)
- **28 × `suggestCanonicalClasses` across 8 files** — bulk-applied Tailwind v4 canonical class names (`h-[2px]`→`h-0.5`, `max-h-[400px]`→`max-h-100`, `min-w-[12rem]`→`min-w-48`, `!text-[Npx]`→`text-[Npx]!`, `w-[180px]`→`w-45`, `h-[26px]`→`h-6.5`, `mt-[2px]`→`mt-0.5`, `z-[45]`→`z-45`, `!overflow-y-auto`→`overflow-y-auto!`, `break-words`→`wrap-break-word`, `border-[color:var(...)]`→`border-(...)` and the matching `border-[length:...]` form)
- **2 × non-null assertions in `appRegistry.tsx`** — replaced `minesweeperMetadata!.icon` and `terminalMetadata!.icon` with `?.icon ?? ""`
- **1 × `useTemplate` in `urlHelpers.ts`** — converted `"..."` suffix concat to a template literal
- **3 × `organizeImports` warnings** — auto-fixed by biome during the earlier run
- **33 × dead i18n keys in 11 locales** — removed `closeTimeMachine`, `openTimeMachine`, `showCachedVersionsTimeMachine` (and their translations) which referenced deleted components

### Known Stale Diagnostics (not real issues)

- **`api/tsconfig.json:12`** — IDE still reports `baseUrl` deprecation but the file already has `"ignoreDeprecations": "6.0"`. IDE cache lag; will clear on reload.
- **`IeMenuBarYearSubmenu.tsx`, `IeMenuBarLocationSubmenu.tsx`, `FutureSettingsDialog.tsx`** — IDE shows Tailwind warnings for files that are deleted (staged in the prior commit). They vanish on commit.
- **`useAiGeneration.ts`, `time-machine-view/*`, etc.** — IDE shows these in the file tree (they're deleted in git). Cosmetic.

## Verification

- `bun run typecheck` → **exit 0, no errors**
- `bun run build` → **227 precache entries, build succeeded**
- IE spec compliance (verified by direct file inspection):
  - Proxy URL routing intact
  - Sandbox attribute intact
  - Favorites, history, share, help, dialogs all wired
  - No time-travel stragglers in source code

## Latest Commits

```
a2da18339 style: silence tailwind/biome IDE warnings (canonical classes + non-null + template)
89dcdc68d fix(ie): finalize iframe proxy wiring, drop time-travel remnants
c11b91843 feat(ie): rewrite proxy — strip time-travel/Wayback/AI bloat, 1721 lines removed
```

## TypeScript: Clean ✅
`bun run typecheck` exits with code 0, zero errors.

## Technical Debt / Known Issues

### Internet Explorer — Sandbox Limitation
The iframe sandbox (`allow-scripts allow-forms allow-same-origin allow-popups allow-pointer-lock`) lets most sites load via the `/api/iframe-check` proxy. Sites that send `X-Frame-Options: DENY` or strict CSP `frame-ancestors` still won't load — that's a platform-level limit, not something the app can fix.

### Pending Brand Assets
From `docs/superpowers/specs/2026-07-24-brand-asset-requirements.md`:
1. Official OHMXO logo/brand mark (SVG)
2. Social links
3. Founder title/role wording
4. Privacy/terms URLs
5. Font licensing decision
6. Default wallpaper/direction
7. AI assistant name/personality

### Untracked Files (not committed)
- `.codex/agents/`, `.codex/prompts/`, `.codex/skills/` — local Codex config, not source
- `fix1.py`, `tmp_store_fix.py` — throwaway scripts from earlier debugging; safe to delete

## Project State

All work on `main` branch, pushed to `origin` (ohmxo/ohmOS).

```
origin → https://github.com/ohmxo/ohmOS.git
upstream → https://github.com/ryokun6/ryos.git
```

## Next Session Suggestions

1. **Polish the IE start page** — verify the search experience, check the favorites directory flow, make sure help/about dialogs look good in the macOS theme
2. **Add a `useInternetExplorer.ts` test** for the new `navigateToUrl` action and history semantics
3. **Clean up the untracked files** in repo root (`fix1.py`, `tmp_store_fix.py`)
4. **Move on to the next app** — see `docs/superpowers/specs/` for the queue
5. **Drop the `appRegistryData.ts` indirection** if the killed agent left a half-done split (verify by reading the file)
