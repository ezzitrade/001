import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { storage } from "../_lib/storage";
import { getOrCreatePlayerId } from "../_lib/playerId";

export const runtime = "nodejs";

export async function POST() {
  const pid = getOrCreatePlayerId();
  const seed = `s_${randomUUID().replaceAll("-", "")}`;
  await storage.set("seeds", `${pid}:${seed}`, { issuedAt: Date.now(), used: false }, 60 * 5);
  return NextResponse.json({ seed }, { status: 200 });
}
