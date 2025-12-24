import { NextResponse } from "next/server";
import { getEzziConfig } from "@/lib/config";
import { storage } from "@/app/api/_lib/storage";

export const runtime = "nodejs";

function isAuthorized(req: Request) {
  const expected = process.env.ADMIN_KEY;
  if (!expected) return true; // Dev-friendly: if not set, allow.
  const headerKey = req.headers.get("x-admin-key") || "";
  const url = new URL(req.url);
  const queryKey = url.searchParams.get("key") || "";
  return headerKey === expected || queryKey === expected;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  const cfg = await getEzziConfig();
  return NextResponse.json({ ok: true, config: cfg }, { headers: { "cache-control": "no-store" } });
}

export async function POST(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }
  let patch: any = null;
  try {
    patch = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  const cfg = await getEzziConfig();

  // Safe patching (only allow known knobs).
  if (typeof patch.buyOnlyEnabled === "boolean") cfg.buyOnlyEnabled = patch.buyOnlyEnabled;

  if (patch.phase && typeof patch.phase === "object") {
    if (typeof patch.phase.id === "string") cfg.phase.id = patch.phase.id;
    if (typeof patch.phase.name === "string") cfg.phase.name = patch.phase.name;
    if (typeof patch.phase.priceUsd === "number") cfg.phase.priceUsd = patch.phase.priceUsd;
    if (typeof patch.phase.targetPriceUsd === "number") cfg.phase.targetPriceUsd = patch.phase.targetPriceUsd;
  }

  if (patch.tokenSale && typeof patch.tokenSale === "object") {
    if (typeof patch.tokenSale.saleEnabled === "boolean") cfg.tokenSale.saleEnabled = patch.tokenSale.saleEnabled;
    if (typeof patch.tokenSale.dailyCapTokens === "number") cfg.tokenSale.dailyCapTokens = Math.max(0, patch.tokenSale.dailyCapTokens);
    if (typeof patch.tokenSale.dailySoldTokens === "number") cfg.tokenSale.dailySoldTokens = Math.max(0, patch.tokenSale.dailySoldTokens);
  }

  if (patch.drops && typeof patch.drops === "object") {
    if (typeof patch.drops.nextDropIso === "string") cfg.drops.nextDropIso = patch.drops.nextDropIso;
  }

  await storage.set("seeds", "config", cfg);
  return NextResponse.json({ ok: true, config: cfg }, { headers: { "cache-control": "no-store" } });
}
