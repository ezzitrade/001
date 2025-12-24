import { NextResponse } from "next/server";
import { randomUUID } from "crypto";
import { storage } from "../../_lib/storage";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { rateLimit } from "../../_lib/rateLimit";
import { pushEvent } from "../../_lib/events";

export const runtime = "nodejs";

export async function GET() {
  const keys = await storage.listKeys("market", "listing:", 200);
  const items: any[] = [];
  for (const k of keys) {
    const v = await storage.get<any>("market", k);
    if (v) items.push(v);
  }
  items.sort((a,b) => String(b.createdAt).localeCompare(String(a.createdAt)));
  return NextResponse.json({ items: items.slice(0, 100) }, { status: 200 });
}

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  const ok = await rateLimit(`market_list:${pid}`, 10, 60);
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });

  const body = await req.json();
  if (!body?.itemId || !Number.isFinite(body?.qty) || !Number.isFinite(body?.priceAmount)) {
    return NextResponse.json({ error: "invalid_payload" }, { status: 400 });
  }

  const listingId = `m_${randomUUID().replaceAll("-", "")}`;
  const listing = {
    listingId,
    sellerId: pid,
    itemId: String(body.itemId),
    qty: Math.max(1, Math.floor(body.qty)),
    priceAmount: Math.max(1, Math.floor(body.priceAmount)),
    currency: "coins",
    createdAt: new Date().toISOString()
  };

  await storage.set("market", `listing:${listingId}`, listing);
  await pushEvent({
    type: "market_list",
    playerId: pid,
    title: `Marketplace listing: ${listing.itemId} x${listing.qty}`,
    meta: { listingId, itemId: listing.itemId, qty: listing.qty, priceAmount: listing.priceAmount }
  });
  return NextResponse.json({ ok: true, listing }, { status: 200 });
}
