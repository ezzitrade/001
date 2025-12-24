import { NextResponse } from "next/server";
import { storage, kvRaw, memRaw, makeKey } from "../../_lib/storage";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { rateLimit } from "../../_lib/rateLimit";
import { pushEvent } from "../../_lib/events";

export const runtime = "nodejs";

// Strict atomic buy: GET listing + DELETE listing happens in one Redis script.
// Returns the JSON listing string (or nil). Works on Vercel KV.
const LUA_ATOMIC_BUY = `
local listing = redis.call('GET', KEYS[1])
if not listing then return nil end
redis.call('DEL', KEYS[1])
return listing
`;

export async function POST(req: Request) {
  const pid = getOrCreatePlayerId();
  const ok = await rateLimit(`market:buy:${pid}`, 20, 60);
  if (!ok) return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  const body = await req.json();
  const listingId = String(body?.listingId ?? "");
  if (!listingId) return NextResponse.json({ error: "invalid_payload" }, { status: 400 });

  const listingKey = `listing:${listingId}`;

  // Vercel KV path (strict)
  if (kvRaw?.eval) {
    const fullKey = makeKey("market", listingKey);
    const raw = (await kvRaw.eval(LUA_ATOMIC_BUY, {
      keys: [fullKey],
      arguments: []
    })) as any;

    if (!raw) return NextResponse.json({ error: "already_sold" }, { status: 409 });

    // @vercel/kv may return parsed JSON or a string depending on driver; normalize.
    const listing = typeof raw === "string" ? JSON.parse(raw) : raw;
    if (listing?.sellerId === pid) {
      // Put back listing to avoid griefing by seller clicking buy on own listing.
      await storage.set("market", listingKey, listing);
      return NextResponse.json({ error: "self_buy" }, { status: 400 });
    }

    await pushEvent({
      type: "market_buy",
      playerId: pid,
      title: `Marketplace buy: ${String(listing?.name || listing?.itemId || listingId)}`,
      meta: { listingId, price: listing?.price, sellerId: listing?.sellerId }
    });

    return NextResponse.json({ ok: true, listing }, { status: 200 });
  }

  // Local dev fallback (in-memory strict-ish): lock + delete.
  const full = makeKey("market", listingKey);
  const lockKey = `${full}::lock`;
  if (memRaw.has(lockKey)) return NextResponse.json({ error: "already_sold" }, { status: 409 });
  memRaw.set(lockKey, 1);
  try {
    const listing = await storage.get<any>("market", listingKey);
    if (!listing) return NextResponse.json({ error: "already_sold" }, { status: 409 });
    if (listing.sellerId === pid) return NextResponse.json({ error: "self_buy" }, { status: 400 });
    await storage.del("market", listingKey);
    await pushEvent({
      type: "market_buy",
      playerId: pid,
      title: `Marketplace buy: ${String(listing?.name || listing?.itemId || listingId)}`,
      meta: { listingId, price: listing?.price, sellerId: listing?.sellerId }
    });
    return NextResponse.json({ ok: true, listing }, { status: 200 });
  } finally {
    memRaw.delete(lockKey);
  }
}
