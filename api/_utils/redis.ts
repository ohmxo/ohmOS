/**
 * Redis client factory
 *
 * Supports two backends:
 * - Upstash REST (`REDIS_KV_REST_API_URL` + `REDIS_KV_REST_API_TOKEN`)
 * - Standard Redis (`REDIS_URL`)
 *
 * We intentionally keep the public API close to @upstash/redis so existing
 * route code can keep working with minimal changes.
 */

import { Redis } from "@upstash/redis";
import IORedis from "ioredis";

export type { Redis };

export type RedisBackend = "upstash-rest" | "redis-url";

export interface RedisSetOptions {
  ex?: number;
  nx?: boolean;
}

export interface RedisScanOptions {
  match?: string;
  count?: number;
}

export interface RedisSortedSetEntry {
  score: number;
  member: string;
}

export interface RedisPipelineLike {
  get(key: string): this;
  set(key: string, value: unknown, options?: RedisSetOptions): this;
  del(...keys: string[]): this;
  type(key: string): this;
  ttl(key: string): this;
  sadd(key: string, ...members: string[]): this;
  srem(key: string, ...members: string[]): this;
  lpush(key: string, ...values: string[]): this;
  ltrim(key: string, start: number, stop: number): this;
  zremrangebyscore(key: string, min: number | string, max: number | string): this;
  zadd(key: string, entry: RedisSortedSetEntry): this;
  zcard(key: string): this;
  hincrby(key: string, field: string, increment: number): this;
  hset(key: string, fields: Record<string, unknown>): this;
  hgetall(key: string): this;
  pfadd(key: string, ...elements: string[]): this;
  pfcount(...keys: string[]): this;
  pfmerge(destinationKey: string, ...sourceKeys: string[]): this;
  expire(key: string, seconds: number): this;
  exec(): Promise<unknown[]>;
}

export interface RedisLike {
  get<T = unknown>(key: string): Promise<T | null>;
  set(key: string, value: unknown, options?: RedisSetOptions): Promise<unknown>;
  setnx(key: string, value: unknown): Promise<number>;
  del(...keys: string[]): Promise<number>;
  exists(...keys: string[]): Promise<number>;
  expire(key: string, seconds: number): Promise<number>;
  persist(key: string): Promise<number>;
  incr(key: string): Promise<number>;
  ttl(key: string): Promise<number>;
  type(key: string): Promise<string>;
  scan(
    cursor: number | string,
    options?: RedisScanOptions
  ): Promise<[string | number, string[]]>;
  pipeline(): RedisPipelineLike;
  smembers<T = string[]>(key: string): Promise<T>;
  scard(key: string): Promise<number>;
  sadd(key: string, ...members: string[]): Promise<number>;
  srem(key: string, ...members: string[]): Promise<number>;
  lpush(key: string, ...values: string[]): Promise<number>;
  lrange<T = unknown>(key: string, start: number, stop: number): Promise<T[]>;
  ltrim(key: string, start: number, stop: number): Promise<string>;
  lrem(key: string, count: number, value: string): Promise<number>;
  llen(key: string): Promise<number>;
  lindex<T = unknown>(key: string, index: number): Promise<T | null>;
  mget<T = unknown>(...keys: string[]): Promise<(T | null)[]>;
  hincrby(key: string, field: string, increment: number): Promise<number>;
  hgetall<T = Record<string, string>>(key: string): Promise<T | null>;
  hset(key: string, fields: Record<string, unknown>): Promise<number>;
  hget<T = unknown>(key: string, field: string): Promise<T | null>;
  hmget<T = unknown>(key: string, ...fields: string[]): Promise<(T | null)[]>;
  hdel(key: string, ...fields: string[]): Promise<number>;
  rpush(key: string, ...values: string[]): Promise<number>;
  pfadd(key: string, ...elements: string[]): Promise<number>;
  pfcount(...keys: string[]): Promise<number>;
  pfmerge(destinationKey: string, ...sourceKeys: string[]): Promise<"OK">;
  zadd(key: string, entry: RedisSortedSetEntry): Promise<number>;
  zrem(key: string, member: string): Promise<number>;
  zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string
  ): Promise<number>;
  zrange(key: string, start: number, stop: number): Promise<string[]>;
  zrangeWithScores(
    key: string,
    start: number,
    stop: number
  ): Promise<RedisSortedSetEntry[]>;
  zcard(key: string): Promise<number>;
  eval<T = unknown>(
    script: string,
    keys: string[],
    args: Array<string | number>
  ): Promise<T>;
}

/**
 * Check whether Redis credentials are available without throwing.
 */
export function isRedisConfigured(): boolean {
  return !!(getRedisUrl() || getUpstashConfig());
}

/** Safe version of getRedisBackend that returns a fallback string instead of throwing. */
export function getRedisBackendSafe(): string {
  try {
    return getRedisBackend();
  } catch {
    return "none";
  }
}

/**
 * No-op Redis adapter returned when no Redis backend is configured.
 * Every method returns empty/default values so downstream handlers don't crash.
 */
class NoopRedisPipelineAdapter implements RedisPipelineLike {
  get(_key: string): this { return this; }
  set(_key: string, _value: unknown, _options?: RedisSetOptions): this { return this; }
  del(..._keys: string[]): this { return this; }
  type(_key: string): this { return this; }
  ttl(_key: string): this { return this; }
  sadd(_key: string, ..._members: string[]): this { return this; }
  srem(_key: string, ..._members: string[]): this { return this; }
  lpush(_key: string, ..._values: string[]): this { return this; }
  ltrim(_key: string, _start: number, _stop: number): this { return this; }
  zremrangebyscore(_key: string, _min: number | string, _max: number | string): this { return this; }
  zadd(_key: string, _entry: RedisSortedSetEntry): this { return this; }
  zcard(_key: string): this { return this; }
  hincrby(_key: string, _field: string, _increment: number): this { return this; }
  hset(_key: string, _fields: Record<string, unknown>): this { return this; }
  hgetall(_key: string): this { return this; }
  pfadd(_key: string, ..._elements: string[]): this { return this; }
  pfcount(..._keys: string[]): this { return this; }
  pfmerge(_destinationKey: string, ..._sourceKeys: string[]): this { return this; }
  expire(_key: string, _seconds: number): this { return this; }
  async exec(): Promise<unknown[]> { return []; }
}

class NoopRedisAdapter implements RedisLike {
  async get<T = unknown>(_key: string): Promise<T | null> { return null; }
  async set(_key: string, _value: unknown, _options?: RedisSetOptions): Promise<unknown> { return "OK"; }
  async setnx(_key: string, _value: unknown): Promise<number> { return 0; }
  async del(..._keys: string[]): Promise<number> { return 0; }
  async exists(..._keys: string[]): Promise<number> { return 0; }
  async expire(_key: string, _seconds: number): Promise<number> { return 0; }
  async persist(_key: string): Promise<number> { return 0; }
  async incr(_key: string): Promise<number> { return 1; }
  async ttl(_key: string): Promise<number> { return -2; }
  async type(_key: string): Promise<string> { return "none"; }
  async scan(_cursor: number | string, _options?: RedisScanOptions): Promise<[string | number, string[]]> { return [0, []]; }
  pipeline(): RedisPipelineLike { return new NoopRedisPipelineAdapter(); }
  async smembers<T = string[]>(_key: string): Promise<T> { return [] as T; }
  async scard(_key: string): Promise<number> { return 0; }
  async sadd(_key: string, ..._members: string[]): Promise<number> { return 0; }
  async srem(_key: string, ..._members: string[]): Promise<number> { return 0; }
  async lpush(_key: string, ..._values: string[]): Promise<number> { return 0; }
  async lrange<T = unknown>(_key: string, _start: number, _stop: number): Promise<T[]> { return []; }
  async ltrim(_key: string, _start: number, _stop: number): Promise<string> { return "OK"; }
  async lrem(_key: string, _count: number, _value: string): Promise<number> { return 0; }
  async llen(_key: string): Promise<number> { return 0; }
  async lindex<T = unknown>(_key: string, _index: number): Promise<T | null> { return null; }
  async mget<T = unknown>(..._keys: string[]): Promise<(T | null)[]> { return []; }
  async hincrby(_key: string, _field: string, _increment: number): Promise<number> { return 0; }
  async hgetall<T = Record<string, string>>(_key: string): Promise<T | null> { return null; }
  async hset(_key: string, _fields: Record<string, unknown>): Promise<number> { return 0; }
  async hget<T = unknown>(_key: string, _field: string): Promise<T | null> { return null; }
  async hmget<T = unknown>(_key: string, ..._fields: string[]): Promise<(T | null)[]> { return []; }
  async hdel(_key: string, ..._fields: string[]): Promise<number> { return 0; }
  async rpush(_key: string, ..._values: string[]): Promise<number> { return 0; }
  async pfadd(_key: string, ..._elements: string[]): Promise<number> { return 0; }
  async pfcount(..._keys: string[]): Promise<number> { return 0; }
  async pfmerge(_destinationKey: string, ..._sourceKeys: string[]): Promise<"OK"> { return "OK"; }
  async zadd(_key: string, _entry: RedisSortedSetEntry): Promise<number> { return 0; }
  async zrem(_key: string, _member: string): Promise<number> { return 0; }
  async zremrangebyscore(_key: string, _min: number | string, _max: number | string): Promise<number> { return 0; }
  async zrange(_key: string, _start: number, _stop: number): Promise<string[]> { return []; }
  async zrangeWithScores(_key: string, _start: number, _stop: number): Promise<RedisSortedSetEntry[]> { return []; }
  async zcard(_key: string): Promise<number> { return 0; }
  async eval<T = unknown>(_script: string, _keys: string[], _args: Array<string | number>): Promise<T> { return null as T; }
}

const redisClientCache = globalThis as typeof globalThis & {
  __ryosStandardRedis?: IORedis;
  __ryosUpstashRedis?: Redis;
};

const redisPubSubCache = globalThis as typeof globalThis & {
  __ryosStandardRedisPub?: IORedis;
  __ryosStandardRedisSub?: IORedis;
};

function getRedisUrl(): string | null {
  return process.env.REDIS_URL?.trim() || null;
}

function getUpstashConfig(): { url: string; token: string } | null {
  const url = process.env.REDIS_KV_REST_API_URL?.trim();
  const token = process.env.REDIS_KV_REST_API_TOKEN?.trim();

  if (!url || !token) {
    return null;
  }

  return { url, token };
}

export function getRedisBackend(): RedisBackend {
  const explicit = process.env.REDIS_PROVIDER?.trim().toLowerCase();
  if (explicit === "redis-url" || explicit === "redis" || explicit === "standard") {
    if (!getRedisUrl()) {
      throw new Error(
        "REDIS_PROVIDER requests standard Redis, but REDIS_URL is not set."
      );
    }
    return "redis-url";
  }

  if (explicit === "upstash-rest" || explicit === "upstash") {
    if (!getUpstashConfig()) {
      throw new Error(
        "REDIS_PROVIDER requests Upstash REST, but REDIS_KV_REST_API_URL / REDIS_KV_REST_API_TOKEN are not set."
      );
    }
    return "upstash-rest";
  }

  if (getRedisUrl()) {
    return "redis-url";
  }

  if (getUpstashConfig()) {
    return "upstash-rest";
  }

  throw new Error(
    "Missing Redis configuration. Set REDIS_URL for standard Redis or REDIS_KV_REST_API_URL + REDIS_KV_REST_API_TOKEN for Upstash REST."
  );
}

function serializeRedisValue(value: unknown): string {
  if (value === undefined) return "undefined";
  if (value === null) return "null";
  if (typeof value === "string") return value;
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return JSON.stringify(value);
}

class StandardRedisPipelineAdapter implements RedisPipelineLike {
  constructor(private readonly pipelineClient: ReturnType<IORedis["pipeline"]>) {}

  get(key: string): this {
    this.pipelineClient.get(key);
    return this;
  }

  set(key: string, value: unknown, options?: RedisSetOptions): this {
    const serialized = serializeRedisValue(value);
    if (options?.nx && options?.ex) {
      this.pipelineClient.set(key, serialized, "EX", options.ex, "NX");
      return this;
    }
    if (options?.nx) {
      this.pipelineClient.set(key, serialized, "NX");
      return this;
    }
    if (options?.ex) {
      this.pipelineClient.set(key, serialized, "EX", options.ex);
      return this;
    }
    this.pipelineClient.set(key, serialized);
    return this;
  }

  del(...keys: string[]): this {
    if (keys.length > 0) {
      this.pipelineClient.del(...keys);
    }
    return this;
  }

  type(key: string): this {
    this.pipelineClient.type(key);
    return this;
  }

  ttl(key: string): this {
    this.pipelineClient.ttl(key);
    return this;
  }

  sadd(key: string, ...members: string[]): this {
    if (members.length > 0) {
      this.pipelineClient.sadd(key, ...members);
    }
    return this;
  }

  srem(key: string, ...members: string[]): this {
    if (members.length > 0) {
      this.pipelineClient.srem(key, ...members);
    }
    return this;
  }

  lpush(key: string, ...values: string[]): this {
    if (values.length > 0) {
      this.pipelineClient.lpush(key, ...values);
    }
    return this;
  }

  ltrim(key: string, start: number, stop: number): this {
    this.pipelineClient.ltrim(key, start, stop);
    return this;
  }

  zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string
  ): this {
    this.pipelineClient.zremrangebyscore(key, min, max);
    return this;
  }

  zadd(key: string, entry: RedisSortedSetEntry): this {
    this.pipelineClient.zadd(key, entry.score, entry.member);
    return this;
  }

  zcard(key: string): this {
    this.pipelineClient.zcard(key);
    return this;
  }

  hincrby(key: string, field: string, increment: number): this {
    this.pipelineClient.hincrby(key, field, increment);
    return this;
  }

  hset(key: string, fields: Record<string, unknown>): this {
    if (Object.keys(fields).length > 0) {
      this.pipelineClient.hset(key, fields);
    }
    return this;
  }

  hgetall(key: string): this {
    this.pipelineClient.hgetall(key);
    return this;
  }

  pfadd(key: string, ...elements: string[]): this {
    if (elements.length > 0) {
      this.pipelineClient.pfadd(key, ...elements);
    }
    return this;
  }

  pfcount(...keys: string[]): this {
    if (keys.length > 0) {
      this.pipelineClient.pfcount(...keys);
    }
    return this;
  }

  pfmerge(destinationKey: string, ...sourceKeys: string[]): this {
    this.pipelineClient.pfmerge(destinationKey, ...sourceKeys);
    return this;
  }

  expire(key: string, seconds: number): this {
    this.pipelineClient.expire(key, seconds);
    return this;
  }

  async exec(): Promise<unknown[]> {
    const results = await this.pipelineClient.exec();
    if (!results) return [];
    return results.map((entry) => entry?.[1]);
  }
}

class StandardRedisAdapter implements RedisLike {
  constructor(private readonly client: IORedis) {}

  async get<T = unknown>(key: string): Promise<T | null> {
    return (await this.client.get(key)) as T | null;
  }

  async set(
    key: string,
    value: unknown,
    options?: RedisSetOptions
  ): Promise<unknown> {
    const serialized = serializeRedisValue(value);
    if (options?.nx && options?.ex) {
      return await this.client.set(key, serialized, "EX", options.ex, "NX");
    }
    if (options?.nx) {
      return await this.client.set(key, serialized, "NX");
    }
    if (options?.ex) {
      return await this.client.set(key, serialized, "EX", options.ex);
    }
    return await this.client.set(key, serialized);
  }

  async setnx(key: string, value: unknown): Promise<number> {
    return await this.client.setnx(key, serializeRedisValue(value));
  }

  async del(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await this.client.del(...keys);
  }

  async exists(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await this.client.exists(...keys);
  }

  async expire(key: string, seconds: number): Promise<number> {
    return await this.client.expire(key, seconds);
  }

  async persist(key: string): Promise<number> {
    return await this.client.persist(key);
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key);
  }

  async ttl(key: string): Promise<number> {
    return await this.client.ttl(key);
  }

  async type(key: string): Promise<string> {
    return await this.client.type(key);
  }

  async scan(
    cursor: number | string,
    options?: RedisScanOptions
  ): Promise<[string | number, string[]]> {
    const cursorKey = String(cursor);
    if (options?.match && typeof options.count === "number") {
      return await this.client.scan(
        cursorKey,
        "MATCH",
        options.match,
        "COUNT",
        options.count
      );
    }
    if (options?.match) {
      return await this.client.scan(cursorKey, "MATCH", options.match);
    }
    if (typeof options?.count === "number") {
      return await this.client.scan(cursorKey, "COUNT", options.count);
    }
    return await this.client.scan(cursorKey);
  }

  pipeline(): RedisPipelineLike {
    return new StandardRedisPipelineAdapter(this.client.pipeline());
  }

  async smembers<T = string[]>(key: string): Promise<T> {
    return (await this.client.smembers(key)) as T;
  }

  async scard(key: string): Promise<number> {
    return await this.client.scard(key);
  }

  async sadd(key: string, ...members: string[]): Promise<number> {
    if (members.length === 0) return 0;
    return await this.client.sadd(key, ...members);
  }

  async srem(key: string, ...members: string[]): Promise<number> {
    if (members.length === 0) return 0;
    return await this.client.srem(key, ...members);
  }

  async lpush(key: string, ...values: string[]): Promise<number> {
    if (values.length === 0) return await this.client.llen(key);
    return await this.client.lpush(key, ...values);
  }

  async lrange<T = unknown>(
    key: string,
    start: number,
    stop: number
  ): Promise<T[]> {
    return (await this.client.lrange(key, start, stop)) as T[];
  }

  async ltrim(key: string, start: number, stop: number): Promise<string> {
    return await this.client.ltrim(key, start, stop);
  }

  async lrem(key: string, count: number, value: string): Promise<number> {
    return await this.client.lrem(key, count, value);
  }

  async llen(key: string): Promise<number> {
    return await this.client.llen(key);
  }

  async lindex<T = unknown>(key: string, index: number): Promise<T | null> {
    return (await this.client.lindex(key, index)) as T | null;
  }

  async mget<T = unknown>(...keys: string[]): Promise<(T | null)[]> {
    if (keys.length === 0) return [];
    return (await this.client.mget(...keys)) as (T | null)[];
  }

  async hincrby(key: string, field: string, increment: number): Promise<number> {
    return await this.client.hincrby(key, field, increment);
  }

  async hgetall<T = Record<string, string>>(key: string): Promise<T | null> {
    const result = await this.client.hgetall(key);
    if (!result || Object.keys(result).length === 0) return null;
    return result as T;
  }

  async hset(key: string, fields: Record<string, unknown>): Promise<number> {
    const entries = Object.entries(fields);
    if (entries.length === 0) return 0;
    const args: string[] = [];
    for (const [field, value] of entries) {
      args.push(field, serializeRedisValue(value));
    }
    return await this.client.hset(key, ...args);
  }

  async hget<T = unknown>(key: string, field: string): Promise<T | null> {
    return (await this.client.hget(key, field)) as T | null;
  }

  async hmget<T = unknown>(key: string, ...fields: string[]): Promise<(T | null)[]> {
    if (fields.length === 0) return [];
    return (await this.client.hmget(key, ...fields)) as (T | null)[];
  }

  async hdel(key: string, ...fields: string[]): Promise<number> {
    if (fields.length === 0) return 0;
    return await this.client.hdel(key, ...fields);
  }

  async rpush(key: string, ...values: string[]): Promise<number> {
    if (values.length === 0) return await this.client.llen(key);
    return await this.client.rpush(key, ...values);
  }

  async pfadd(key: string, ...elements: string[]): Promise<number> {
    if (elements.length === 0) return 0;
    return await this.client.pfadd(key, ...elements);
  }

  async pfcount(...keys: string[]): Promise<number> {
    if (keys.length === 0) return 0;
    return await this.client.pfcount(...keys);
  }

  async pfmerge(destinationKey: string, ...sourceKeys: string[]): Promise<"OK"> {
    return await this.client.pfmerge(destinationKey, ...sourceKeys);
  }

  async zadd(key: string, entry: RedisSortedSetEntry): Promise<number> {
    return await this.client.zadd(key, entry.score, entry.member);
  }

  async zrem(key: string, member: string): Promise<number> {
    return await this.client.zrem(key, member);
  }

  async zremrangebyscore(
    key: string,
    min: number | string,
    max: number | string
  ): Promise<number> {
    return await this.client.zremrangebyscore(key, min, max);
  }

  async zrange(key: string, start: number, stop: number): Promise<string[]> {
    return await this.client.zrange(key, start, stop);
  }

  async zrangeWithScores(
    key: string,
    start: number,
    stop: number
  ): Promise<RedisSortedSetEntry[]> {
    const raw = await this.client.zrange(key, start, stop, "WITHSCORES");
    const entries: RedisSortedSetEntry[] = [];
    for (let index = 0; index < raw.length; index += 2) {
      const member = raw[index];
      const score = Number(raw[index + 1]);
      if (member !== undefined && Number.isFinite(score)) {
        entries.push({ member, score });
      }
    }
    return entries;
  }

  async zcard(key: string): Promise<number> {
    return await this.client.zcard(key);
  }

  async eval<T = unknown>(
    script: string,
    keys: string[],
    args: Array<string | number>
  ): Promise<T> {
    return (await this.client.eval(
      script,
      keys.length,
      ...keys,
      ...args.map(String)
    )) as T;
  }
}

function getStandardRedisClient(): IORedis {
  if (!redisClientCache.__ryosStandardRedis) {
    const redisUrl = getRedisUrl();
    if (!redisUrl) {
      throw new Error(
        "Missing REDIS_URL for standard Redis mode."
      );
    }

    redisClientCache.__ryosStandardRedis = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: false,
    });
  }

  return redisClientCache.__ryosStandardRedis;
}

function createUpstashRedis(): Redis {
  if (!redisClientCache.__ryosUpstashRedis) {
    const config = getUpstashConfig();
    if (!config) {
      throw new Error(
        "Missing Redis configuration. Set REDIS_KV_REST_API_URL and REDIS_KV_REST_API_TOKEN environment variables."
      );
    }

    // Cache one client per process (mirrors the ioredis path) and enable
    // auto-pipelining so Promise.all of Redis commands collapses into fewer
    // HTTPS round trips on Upstash REST.
    redisClientCache.__ryosUpstashRedis = new Redis({
      ...config,
      enableAutoPipelining: true,
    });
  }

  return redisClientCache.__ryosUpstashRedis;
}

/**
 * Create a Redis client using the configured backend.
 *
 * The return type intentionally stays `Redis` for compatibility with the
 * existing codebase. In standard Redis mode, we return an adapter that matches
 * the subset of methods the app currently uses.
 */
export function createRedis(): Redis {
  if (!isRedisConfigured()) {
    return new NoopRedisAdapter() as unknown as Redis;
  }

  if (getRedisBackend() === "upstash-rest") {
    return createUpstashRedis();
  }

  return new StandardRedisAdapter(getStandardRedisClient()) as unknown as Redis;
}

function getSharedPubSubClient(slot: "__ryosStandardRedisPub" | "__ryosStandardRedisSub"): IORedis {
  const redisUrl = getRedisUrl();
  if (!redisUrl) {
    throw new Error("REDIS_URL is required for Redis pub/sub.");
  }

  if (!redisPubSubCache[slot]) {
    redisPubSubCache[slot] = new IORedis(redisUrl, {
      maxRetriesPerRequest: null,
      enableReadyCheck: true,
      lazyConnect: false,
    });
  }

  return redisPubSubCache[slot];
}

export function supportsRedisPubSub(): boolean {
  return getRedisBackend() === "redis-url";
}

export function createRedisPublisher(): IORedis {
  if (!supportsRedisPubSub()) {
    throw new Error("Redis pub/sub requires standard Redis mode (REDIS_URL).");
  }
  return getSharedPubSubClient("__ryosStandardRedisPub");
}

export function createRedisSubscriber(): IORedis {
  if (!supportsRedisPubSub()) {
    throw new Error("Redis pub/sub requires standard Redis mode (REDIS_URL).");
  }
  return getSharedPubSubClient("__ryosStandardRedisSub");
}

/**
 * Default export for convenience.
 */
export default createRedis;
