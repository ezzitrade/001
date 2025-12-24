import { NextResponse } from "next/server";
import { storage } from "../../_lib/storage";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { rateLimit } from "../../_lib/rateLimit";
import { simpleHash } from "@/shared/crypto";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  const ok = await rateLimit(`runs:${pid}`, 25, 60);
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  if (!body?.runId || !body?.seed || !body?.digest || !body?.kind) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const seedKey = `${pid}:${body.seed}`;
  const seedData = await storage.get<any>("seeds", seedKey);
  if (!seedData || seedData.used) {
    return NextResponse.json({ error: "invalid_or_used_seed" }, { status: 400 });
  }

  const expected = simpleHash(
    String(body.seed) + JSON.stringify(body.inputs ?? {}) + JSON.stringify(body.outputs ?? {})
  );
  if (expected !== body.digest) {
    return NextResponse.json({ error: "digest_mismatch" }, { status: 400 });
  }

  seedData.used = true;
  await storage.set("seeds", seedKey, seedData);

  const run = {
    ...body,
    playerId: pid,
    createdAt: body.createdAt ?? new Date().toISOString()
  };
  await storage.set("runs", `${pid}:${body.runId}`, run);

  return NextResponse.json({ ok: true }, { status: 200 });
}
