# OHMXO — Cloud Environment Guide

## Development Environment

This project uses **Bun** as the package manager and runtime. Local API testing should use the standalone Bun server + Vite proxy; production runs the same standalone Bun server via Docker on **Coolify** (self-hosted cloud).

### Package Manager

- **Bun** is required (version 1.3.5+)
- Use `bun install` to install dependencies
- Use `bun run <script>` to run package.json scripts

### Key Commands

```bash
# Development
bun run dev            # Start full stack (API + Vite with proxy) — the default
bun run dev:vite       # Start Vite dev server only (frontend-only, no API)
bun run dev:api        # Start standalone Bun API server only (port 3000)

# Build & Production
bun run build      # TypeScript compile + Vite build

# Testing
bun test           # Run all tests via bun:test (API tests require server running)
bun run test:unit  # Unit/wiring tests only (no server needed)
bun run test:api   # API integration tests only
```

### Running the Application

For **full functionality** (default):
```bash
bun run dev
```

For **frontend-only** development (no API):
```bash
bun run dev:vite
```

For **API server only** (e.g. to run tests against):
```bash
bun run dev:api
```

The frontend runs on port 5173 by default. The standalone API defaults to port 3000.

## Environment Variables

The following environment variables are required for full functionality:

### Required for Core Features
- Redis backend, either:
  - `REDIS_KV_REST_API_URL` + `REDIS_KV_REST_API_TOKEN` - Upstash Redis REST API
  - `REDIS_URL` - standard Redis / Valkey connection string (required for local WebSocket pub/sub)
- **Note:** Redis is neutralized via `NoopRedisAdapter` when not configured. The OS works without Redis.

### Required for AI Features
- AI provider API keys (at least one):
  - `OPENAI_API_KEY` — OpenAI (default model gpt-5.5)
  - `ANTHROPIC_API_KEY` — Anthropic (sonnet-4.6)
  - `GOOGLE_GENERATIVE_AI_API_KEY` — Google (gemini models)

### Required for Real-time Features
- Pusher mode (`REALTIME_PROVIDER=pusher`, default):
  - `PUSHER_APP_ID`
  - `PUSHER_KEY`
  - `PUSHER_SECRET`
  - `PUSHER_CLUSTER`
- Local WebSocket mode (`REALTIME_PROVIDER=local`): requires `REDIS_URL`; optional `REALTIME_WS_PATH` defaults to `/ws`.

### Optional Features
- `RESEND_API_KEY` + `RECOVERY_EMAIL_FROM` — email recovery
- `ELEVENLABS_API_KEY` — ElevenLabs API (text-to-speech)
- `YOUTUBE_API_KEY` — YouTube Data API (video metadata)
- `YOUTUBE_API_KEY_2` — YouTube Data API fallback
- `MAPKIT_TEAM_ID` / `MAPKIT_KEY_ID` / `MAPKIT_PRIVATE_KEY` / `MAPKIT_ORIGIN` — Apple MapKit (Maps app)
- `MUSICKIT_TEAM_ID` / `MUSICKIT_KEY_ID` / `MUSICKIT_PRIVATE_KEY` / `MUSICKIT_ORIGIN` — Apple MusicKit (iPod Apple Music mode)
- `GOOGLE_GENERATIVE_AI_API_KEY` — Google Generative AI (machine translation)
- `IP_GEOLOCATION_URL_TEMPLATE` / `IP_GEOLOCATION_DISABLED` — IP geolocation
- `CRON_SECRET` — cron job authentication
- `STANDALONE_API_PROXY_TARGET` — API proxy target for Vite dev

## Project Structure

```
src/
├── apps/              # 28 self-contained applications
│   ├── base/          # App framework types & AppManager
│   ├── finder/        # File browser
│   ├── ipod/          # Music player
│   ├── internet-explorer/  # Web browser (start page + new tab launcher)
│   ├── books/         # EPUB reader (music resources planned)
│   └── ...            # 22 more apps
├── components/        # Shared UI components
│   ├── dialogs/       # About, Boot, Login dialogs
│   ├── layout/        # Desktop, Dock, MenuBar, Taskbar
│   └── shared/        # ThemedIcon, HtmlPreview, etc.
├── stores/            # Zustand stores (48 stores)
├── themes/            # 4 retro OS themes (System 7, Aqua, XP, 98)
├── hooks/             # Custom React hooks
├── utils/             # Utility functions
├── config/            # App registry, theme config
└── lib/               # i18n, other libraries
api/                   # Backend API endpoints (serverless / standalone)
docs/                  # Architecture docs, specs, plans
public/                # Static assets (icons, fonts, wallpapers)
```

## Known Issues

### Internet Explorer
IE was simplified to a local start page that opens links in new tabs. No major website allows iframing (X-Frame-Options, CSP). To restore full browsing:
1. Deploy the API server with `/api/iframe-check` endpoint
2. The proxy strips frame-blocking headers from upstream responses
3. AI time-travel requires an AI provider key + Redis for caching

### Frontend-Only Mode
Running `bun run dev:vite` means:
- No API endpoints available (analytics, chat, speech, IE proxy)
- `/api/*` calls return 404 or HTML (Vite dev server)
- All core apps work (Finder, iPod, TextEdit, etc.)
- Internet Explorer shows start page (all links open in new tab)

## Testing

```bash
bun run typecheck       # TypeScript type check (zero errors expected)
bun run lint            # ESLint
bun run test:unit       # Unit tests (no server needed)
bun run dev:api && bun run test:api  # API tests (server required)
```

## Branching

- `main` — deployable, pushed to ohmxo/ryos
- `upstream/main` — original ryOS, merged periodically

```bash
git fetch upstream
git merge upstream/main
```