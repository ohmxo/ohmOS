# REDIS_REMOVAL.md

Phase 1 outcome: Redis was **neutralized via a no-op adapter** rather than surgically extracted from each call site. The old checklist (below) is preserved for reference should you ever want to fully remove Redis from the codebase.

## Actual approach (implemented)

A `NoopRedisAdapter` class was added to `api/_utils/redis.ts` that implements the full `RedisLike` interface — every method returns empty/default values (`null`, `0`, `[]`, `"OK"`, etc.). `createRedis()` now returns this adapter when no Redis env vars are configured:

```
REDIS_URL + REDIS_KV_REST_API_URL + REDIS_KV_REST_API_TOKEN → all absent
→ isRedisConfigured() returns false
→ createRedis() returns NoopRedisAdapter
→ All existing Redis call sites still compile and run, they just no-op
```

A safe logging helper `getRedisBackendSafe()` was added to avoid the throw in `getRedisBackend()` when no backend is configured.

**What was NOT changed:**
- `api/chat.ts` — still imports and calls Redis-based functions (rate-limiting, geo-caching, conversation persistence). With the noop adapter these return empty results rather than crashing.
- `api/ie-generate.ts`, `api/iframe-check.ts` — still use Redis for caching. With noop adapter, cache lookups return `null` and writes no-op. IE works uncached.
- `api/admin.ts` — still uses Redis for room/user management. Will return empty results.
- Pusher — not addressed. Still wired in the codebase.
- No env vars were removed — they're just optional now.

## Original checklist (surgical removal reference)

The original plan was to surgically pull Redis out of `api/chat.ts`. This was not done — the noop adapter approach was chosen instead for minimal risk and maximum compatibility with future Reactivation. Preserved here for reference:

### What Redis does in `api/chat.ts`
1. **Auth tokens** — `validateAuthToken()` looks up keys like `chat:token:user:{username}:{token}`,
   `chat:token:{username}` (legacy), and `chat:token:last:{username}` (grace-period fallback).
2. **Rate limiting** — `checkAndIncrementAIMessageCount()` keeps a Redis-backed counter per
   user/IP on a 5-hour sliding window.

Nothing else in `api/chat.ts` touches Redis. The Zod tool schemas, `onToolCall` handler,
`generateDynamicSystemPrompt()`, and system-state collection are all independent of it.

### Original steps (not executed — kept for future reference)
1. Grep first, don't assume
2. Auth: replace with static shared-secret or remove entirely
3. Rate limiting: replace with no-op or in-memory counter
4. Remove env vars: `REDIS_URL`, `REDIS_KV_REST_API_URL`, `REDIS_KV_REST_API_TOKEN`
5. Multi-user chat / Pusher: remove if not keeping public chat rooms
6. Test: confirm `/api/chat` still streams

### What NOT to touch
- `SystemState` interface and its population
- The 12 Zod-defined tools and their handlers in `src/apps/chats/hooks/useAiChat.ts`
- `generateDynamicSystemPrompt()`