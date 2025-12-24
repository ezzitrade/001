import { NextResponse } from "next/server";
import { storage } from "@/app/api/_lib/storage";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const limit = Math.max(1, Math.min(50, Number(url.searchParams.get("limit") || 20)));

  const keys = await storage.listKeys("transactions", "evt_", limit * 3);
  const events: any[] = [];
  for (const k of keys) {
    const v = await storage.get<any>("transactions", k);
    if (v && typeof v.ts === "number" && String(v.id || k).startsWith("evt_")) {
      events.push(v);
    }
  }

  events.sort((a, b) => (b.ts ?? 0) - (a.ts ?? 0));
  return NextResponse.json(
    { ok: true, events: events.slice(0, limit) },
    { headers: { "cache-control": "no-store" } }
  );
}
