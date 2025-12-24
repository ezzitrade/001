import { kv } from "@vercel/kv";

export async function rateLimit(key: string, limit: number, windowSec: number) {
  const k = `rl:${key}`;
  const count = await kv.incr(k);
  if (count === 1) await kv.expire(k, windowSec);
  return count <= limit;
}
