import { NextResponse } from "next/server";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { storage } from "../../_lib/storage";

export const runtime = "nodejs";

export async function GET() {
  const pid = getOrCreatePlayerId();
  const state = await storage.get<any>("players", pid);
  return NextResponse.json({ playerId: pid, state }, { status: 200 });
}

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  const body = await req.json();
  const raw = JSON.stringify(body);
  if (raw.length > 250_000) {
    return NextResponse.json({ error: "payload_too_large" }, { status: 413 });
  }
  await storage.set("players", pid, body);
  return NextResponse.json({ ok: true }, { status: 200 });
}
