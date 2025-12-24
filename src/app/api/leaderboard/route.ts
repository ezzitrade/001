import { NextResponse } from "next/server";
import { getOrCreatePlayerId } from "../_lib/playerId";
import { storage } from "../_lib/storage";
import { rateLimit } from "../_lib/rateLimit";

export const runtime = "nodejs";

// Minimal persistent leaderboard (KV keys). For scale, swap to Redis ZSET.

export async function GET() {
  const keys = await storage.listKeys("leaderboard", "s1:", 200);
  const items: any[] = [];
  for (const k of keys) {
    const v = await storage.get<any>("leaderboard", k);
    if (v) items.push(v);
  }
  items.sort((a, b) => (b.score ?? 0) - (a.score ?? 0));
  return NextResponse.json({ items: items.slice(0, 50) }, { status: 200 });
}

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  const ok = await rateLimit(`lb:${pid}`, 10, 60);
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  const score = Number(body?.score ?? 0);
  const stage = String(body?.stage ?? "S1");
  const runId = String(body?.runId ?? "");
  if (!runId || !Number.isFinite(score)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }
  if (score < 0 || score > 2_000_000) {
    return NextResponse.json({ error: "score_out_of_range" }, { status: 400 });
  }

  const entry = {
    runId,
    stage,
    score,
    playerId: pid,
    createdAt: new Date().toISOString()
  };

  await storage.set("leaderboard", `s1:${runId}`, entry);
  return NextResponse.json({ ok: true }, { status: 200 });
}
