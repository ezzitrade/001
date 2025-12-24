import { NextResponse } from "next/server";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { storage } from "../../_lib/storage";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  let body: any = {};
  try {
    body = await req.json();
  } catch {}
  const wallet = String(body.wallet || "").trim();
  if (!wallet) {
    return NextResponse.json({ ok: false, error: "wallet_required" }, { status: 400 });
  }

  await storage.set("players", `pid:${pid}:wallet`, { wallet, ts: Date.now() });
  return NextResponse.json({ ok: true, playerId: pid, wallet }, { status: 200 });
}
