import { NextResponse } from "next/server";
import { storage } from "../../_lib/storage";
import { getOrCreatePlayerId } from "../../_lib/playerId";

export const runtime = "nodejs";

export async function GET() {
  const pid = getOrCreatePlayerId();
  const keys = await storage.listKeys("runs", `${pid}:`, 200);
  const items: any[] = [];
  for (const k of keys) {
    const v = await storage.get<any>("runs", k);
    if (v) items.push(v);
  }
  items.sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return NextResponse.json({ items: items.slice(0, 50) }, { status: 200 });
}
