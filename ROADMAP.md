# Implementation Roadmap — GNRE/ohmxo ryOS Fork

## Current State

- **28 apps** registered, 27 visible (Chats hidden)
- **4 retro OS themes** (System 7 / Aqua / XP / 98), default: Aqua
- **Branding**: all ryOS — site name, OG tags, favicon, tagline, brand mark
- **AI pipeline**: intact but needs provider keys; Chats hidden, Assistant overlay removed
- **Redis**: neutralized via `NoopRedisAdapter`
- **Deployment**: Docker/Coolify (no Vercel config found)
- **Dependencies**: React 19, Zustand, Tailwind v4, Motion, i18n, 10 Radix UI primitives, AI SDK, TipTap, Three.js, Tone.js, WaveSurfer, 30+ font files, S3 storage, Pusher (wired)

---

## Quick Wins (minutes, single-file changes)

### 1. Branding Swap — Site Name & Meta Tags
- `index.html`: Change `ryOS` → site name, update `og:title`, `og:site_name`, `twitter:title`, description tag, apple-mobile-web-app-title
- `package.json`: Update `productName`, `homepage`, `description`, `author`

### 2. Favicon & OG Image
- Replace `public/favicon.ico`, `public/apple-touch-icon.png`, `public/icons/mac-512.png`, `public/icons/mac-192.png` with GNRE branding
- Update `index.html` `og:image` URL

### 3. Hide Non-Essential Apps
In `appRegistry.tsx`, set `hidden: true` for apps that don't fit a music/portfolio OS:
- **Hide:** Internet Explorer, Paint, Minesweeper, Infinite Mac, Virtual PC, Applet Store, Books, Maps
- **Keep visible:** Finder, Terminal, TextEdit, Preview, Control Panels, Stickies, Calculator, Calendar, Contacts, Dashboard, Photo Booth
- **Music core:** iPod, Synth, Soundboard, Karaoke, Winamp, Videos, TV
- **Admin:** keep `adminOnly: true` as-is

### 4. Set AI Provider Keys
- Create `.env` with at least one API key (Anthropic recommended — it's the fork's native AI SDK provider)
- Re-enable the AI chat endpoint for your personal assistant use

### 5. Replace ryOS References in the Shell
- `AppleMenu.tsx` / dock component — any "About ryOS" text
- `CursorBrandMark.tsx` — swap Cursor brand for GNRE brand
- Boot splash text if present

---

## Medium Improvements (a few files each, 1-2 sessions)

### 6. Default Wallpaper & Theme
- Change default wallpaper from Aqua abstract to a GNRE-branded wallpaper
- Change default theme from Aqua to your preferred default (or keep Aqua and just swap wallpaper)
- Set default accent color to your brand color

### 7. Custom Theme Pass
- Add a GNRE accent color to `accents.ts` (or just set the default accent)
- Tweak `tokens.css` defaults if you want a non-retro default look
- Or: add a 5th theme that's a modern dark/minimal "GNRE" theme (bigger effort, see below)

### 8. Portfolio Content — "Studio" Section
- Repurpose an existing app (Stickies, Preview, or a new "Studio" app) to display campaign case studies
- Content to port from ohmxo.com/studio: Fasina, Réayo, other campaign stats
- This could be as simple as converting the VFS to serve markdown/HTML files visible in Finder, or building a dedicated app

### 9. App Roster Polish
- Re-label the dock to only show a curated set of apps
- Custom app icons for the music-related apps (iPod, Synth, Winamp, etc.)
- Remove unused stores from persistence (e.g. `useInternetExplorerStore` if IE is hidden)

### 10. Disconnect Pusher
- Pusher is still wired in code but unused. Either no-op it like Redis, or remove the wiring. Low priority since it won't crash — just unused WebSocket connections.

---

## Bigger Features (multi-session, architectural)

### 11. Custom "GNRE" Theme
A modern dark minimalist theme with:
- New theme ID (`"gnre"` or `"ohmxo"`)
- CSS custom properties in `tokens.css`
- Entry in `themes/index.ts`
- Custom wallpaper set
- Dark mode by default
- Support for wallpaper-derived accent colors
- This is the most impactful visual change — the site goes from "retro OS demo" to "music exec's command center"

### 12. Custom Studio App (Phase 3)
Full-blown campaign case study app:
- Browseable portfolio "files" with rich media (video/music embeds, stats)
- Launchable from dock, opens in a window like any other app
- Uses the existing window framework, so it gets resize/minimize/move for free
- Could integrate with the AI pipeline: "Show me the Réayo campaign"

### 13. Chartmetric-Style Stats Widget (Phase 3)
- Dashboard widget showing streaming stats, audience growth, playlist adds
- Could live in the existing Dashboard app as a new widget, or be its own app
- Would need an API backend (or static data for now)

### 14. Branded Voice Assistant (Phase 3)
- Replace the generic "Assistant" with a GNRE-branded AI agent
- Custom system prompt with knowledge of your campaigns, music industry context
- Voice input via the existing speech-to-text pipeline
- Accessible from a keyboard shortcut or dock icon

### 15. Pre-Save / DSP Pitch Generator (Phase 3)
- A form-based tool that generates pitch decks for DSPs (Spotify, Apple Music playlists)
- Retro calculator or text-editor skin, real output

---

## Recommended Order

1. **Quick wins** (items 1-5) — get your name on it, hide noise, make it usable
2. **Medium** (items 6-8) — make it feel like YOURS, not a fork
3. **Medium** (items 9-10) — polish the edges
4. **Bigger** (items 11-15) — the custom theme and Studio app are the crown jewels

Want to start with the quick wins or skip to a specific section?
