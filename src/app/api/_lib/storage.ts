import type { KVNamespace, StorageAdapter } from "@/shared/storage";

// Prefer Vercel KV in production; fallback to in-memory for local dev without KV.
let kv: any = null;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  kv = require("@vercel/kv").kv;
} catch {
  kv = null;
}

const mem = globalThis as any;
mem.__EZZI_MEM__ ||= new Map<string, any>();
const MEM: Map<string, any> = mem.__EZZI_MEM__;

const key = (ns: KVNamespace, k: string) => `ezzi:${ns}:${k}`;

// Expose raw KV + MEM for strict atomic ops (market Lua eval) and local fallback.
export const kvRaw = kv;
export const memRaw = MEM;
export const makeKey = key;

async function kvGet(full: string) {
  if (!kv) return MEM.get(full) ?? null;
  try {
    return (await kv.get(full)) ?? null;
  } catch {
    return MEM.get(full) ?? null;
  }
}

async function kvSet(full: string, value: any, ttlSec?: number) {
  if (!kv) {
    MEM.set(full, value);
    return;
  }
  try {
    if (ttlSec) await kv.set(full, value, { ex: ttlSec });
    else await kv.set(full, value);
  } catch {
    MEM.set(full, value);
  }
}

async function kvDel(full: string) {
  if (!kv) {
    MEM.delete(full);
    return;
  }
  try {
    await kv.del(full);
  } catch {
    MEM.delete(full);
  }
}

async function kvKeys(pattern: string) {
  if (!kv) {
    const out: string[] = [];
    for (const k of MEM.keys()) {
      if (k.startsWith(pattern.replace("*", ""))) out.push(k);
    }
    return out;
  }
  try {
    return (await kv.keys(pattern)) as string[];
  } catch {
    const out: string[] = [];
    for (const k of MEM.keys()) {
      if (k.startsWith(pattern.replace("*", ""))) out.push(k);
    }
    return out;
  }
}

export const storage: StorageAdapter = {
  async get(ns, k) {
    return (await kvGet(key(ns, k))) as any;
  },
  async set(ns, k, v, ttlSec) {
    await kvSet(key(ns, k), v, ttlSec);
  },
  async del(ns, k) {
    await kvDel(key(ns, k));
  },
  async listKeys(ns, prefix, limit) {
    const keys = await kvKeys(key(ns, `${prefix}*`));
    return keys.slice(0, limit).map((x) => String(x).split(`ezzi:${ns}:`)[1]);
  }
};
