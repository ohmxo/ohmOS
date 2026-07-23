# REDIS_REMOVAL.md

Concrete checklist for pulling Redis out of `api/chat.ts` without breaking tool-calling.

## What Redis currently does here
1. **Auth tokens** — `validateAuthToken()` looks up keys like `chat:token:user:{username}:{token}`,
   `chat:token:{username}` (legacy), and `chat:token:last:{username}` (grace-period fallback).
2. **Rate limiting** — `checkAndIncrementAIMessageCount()` keeps a Redis-backed counter per
   user/IP on a 5-hour sliding window.

Nothing else in `api/chat.ts` touches Redis. The Zod tool schemas, `onToolCall` handler,
`generateDynamicSystemPrompt()`, and system-state collection are all independent of it.

## Steps
1. **Grep first, don't assume**: search the repo for `redis`, `Redis`, `UPSTASH`, `kv.` to
   confirm every call site before touching anything.
2. **Auth**: since this is a single-owner site, replace `validateAuthToken()` with one of:
   - a static shared-secret header check against an env var, or
   - remove auth entirely and lock down access via Vercel deployment protection / your own
     domain-level auth, or
   - if you self-host, put it behind a simple reverse-proxy auth rule.
3. **Rate limiting**: replace `checkAndIncrementAIMessageCount()` with either:
   - nothing (you control cost via your OpenAI/Anthropic dashboard usage caps), or
   - an in-memory counter (resets on redeploy/cold start — acceptable for one user).
4. **Env vars to remove** once confirmed unused: `REDIS_URL`, `REDIS_KV_REST_API_URL`,
   `REDIS_KV_REST_API_TOKEN`.
5. **Multi-user chat rooms / Pusher**: if you're not keeping public chat rooms, remove the
   Pusher realtime wiring in the same pass — it's a separate system from Redis but usually
   gets cut together for a personal site.
6. **Test**: confirm `/api/chat` still streams a response and still executes at least one
   tool call (e.g. `launchApp`) after the change, before removing the old code paths entirely.

## What NOT to touch
- `SystemState` interface and its population
- The 12 Zod-defined tools and their handlers in `src/apps/chats/hooks/useAiChat.ts`
- `generateDynamicSystemPrompt()`

These are unrelated to Redis and are the core of the "agentic" behavior — breaking them loses
the actual AI-controls-the-desktop feature, not just chat.
