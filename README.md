# OHMXO — Digital Architecture OS

A browser-based desktop operating system forked from [ryOS](https://github.com/ryokun6/ryos), repurposed as a personal portfolio and digital architecture platform for [Jacob Adeshiyan](https://ohmxo.com) / OHMXO Agency.

Built with React 19, TypeScript, Tailwind v4, and Zustand. Features a windowed desktop environment with retro OS themes, virtual file system, and AI integration.

**[ohmxo.com](https://ohmxo.com)** — Digital architecture for music × tech.

---

## Quick Start

```bash
bun install
bun run dev              # Full stack (API + Vite)
# or
bun run dev:vite         # Frontend only (no API — most apps work)
```

- Open `http://localhost:5173` in your browser
- `bun run typecheck` — TypeScript check
- `bun run build` — Production build

---

## Current State

| Phase | Status |
|-------|--------|
| Phase 0: Foundation (fork, remotes, deps) | ✅ Complete |
| Phase 1: Redis neutralization, Chats hidden | ✅ Complete |
| Phase 1.5: Branding cleanup (ryOS→OHMXO) | ✅ Complete |
| Phase 2: Brand assets, themes, Studio app | ⏳ Awaiting assets/decisions |
| Phase 3: Custom music apps | 📋 Parking lot |
| Phase 4: Deployment | 📋 Not started |

See [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) for full details.

---

## Documentation

- [TASK.md](TASK.md) — Session handoff & current focus
- [PROJECT_STATUS.md](docs/PROJECT_STATUS.md) — Migration status & pending decisions
- [PLAN.md](PLAN.md) — High-level roadmap
- [ROADMAP.md](ROADMAP.md) — Implementation phases
- [ARCHITECTURE.md](docs/ARCHITECTURE.md) — System architecture
- [REDIS_REMOVAL.md](REDIS_REMOVAL.md) — Redis neutralization approach

### What's OHMXO?
OHMXO is a digital architecture firm at the intersection of music and technology. This OS serves as both a portfolio and a platform for exploring what a music-focused digital ecosystem can be. The three service pillars:

- **Nexus** — Web systems & digital platforms
- **Agentix** — AI automation & intelligent systems
- **Growth** — Performance marketing & data-led growth

---

## Apps

28 apps included, visible in the dock and Finder. Open any app by clicking its icon. Multi-instance support for apps like TextEdit (multiple documents), iPod, and Terminal.

### Music & Audio
- iPod — Classic click-wheel music player
- Synth — Virtual synthesizer (Tone.js)
- Winamp — Winamp media player
- Karaoke — Synced lyrics player
- Soundboard — Sound effects
- TV — Channel surf YouTube

### Creative Tools
- TextEdit — Rich text editor (TipTap)
- Paint — Drawing app
- Photo Booth — Camera effects
- Preview — Image/PDF viewer

### System
- Finder — File browser (virtual file system)
- Terminal — Command line
- Control Panels — System settings
- Dashboard — Widget dashboard
- Internet Explorer — Web browser (opens links in new tab)

### Productivity
- Calendar — Events calendar
- Contacts — Address book
- Stickies — Sticky notes
- Calculator — Basic/scientific calculator
- Books — EPUB reader (music resources planned)

### Games & Fun
- Minesweeper — Classic puzzle
- Infinite Mac — Classic Mac emulation
- Virtual PC — x86 emulation

---

## AI Integration

The chat endpoint (`/api/chat`) is wired but requires an AI provider key to function. The Chats app is currently hidden (`hidden: true` in app registry). To activate:

1. Set `ANTHROPIC_API_KEY` or `OPENAI_API_KEY` or `GOOGLE_GENERATIVE_AI_API_KEY`
2. Remove `hidden: true` from `src/config/appRegistry.tsx`
3. Wire the Assistant overlay component into the layout

---

## Remotes

```
origin   → https://github.com/ohmxo/ryos.git  (ohmxo fork)
upstream → https://github.com/ryokun6/ryos.git (original ryOS)
```

---

## License

AGPL-3.0-only. This project is a fork of [ryOS](https://github.com/ryokun6/ryos) by Ryo Lu.