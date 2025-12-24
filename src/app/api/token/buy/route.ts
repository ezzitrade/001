import { NextResponse } from "next/server";
import { storage } from "@/app/api/_lib/storage";
import { getEzziConfig } from "@/lib/config";
import { pushEvent } from "@/app/api/_lib/events";

export const runtime = "nodejs";

type BuyBody = {
  tokens: number;
  referralCode?: string;
  wallet?: string;
};

function jsonError(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  let body: BuyBody;
  try {
    body = (await req.json()) as BuyBody;
  } catch {
    return jsonError("Invalid JSON payload");
  }

  const tokens = Math.floor(Number(body.tokens || 0));
  if (!Number.isFinite(tokens) || tokens <= 0) return jsonError("Invalid token amount");

  const wallet = String(body.wallet || "").trim();
  if (!wallet) return jsonError("Wallet is required");

  const cfg = await getEzziConfig();
  if (!cfg.tokenSale?.saleEnabled) return jsonError("Token sale is currently paused", 403);

  // Enforce daily cap.
  const remaining = Math.max(0, cfg.tokenSale.dailyCapTokens - cfg.tokenSale.dailySoldTokens);
  if (tokens > remaining) return jsonError(`Daily cap exceeded. Remaining today: ${remaining}`);

  const usd = Number((tokens * cfg.phase.priceUsd).toFixed(6));
  const referralCode = body.referralCode ? String(body.referralCode).trim() : "";

  // Record a purchase intent (off-chain). This is a placeholder that can be swapped for on-chain tx later.
  const id = `buy_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const record = {
    id,
    wallet,
    tokens,
    usd,
    referralCode,
    phase: cfg.phase.id,
    ts: Date.now(),
  };

  // Update config counters.
  cfg.tokenSale.dailySoldTokens += tokens;
  cfg.supply.tokensSold += tokens;
  await storage.set("seeds", "config", cfg);

  // Append to transactions feed.
  await storage.set("transactions", id, record, 60 * 60 * 24 * 30);

  await pushEvent({
    type: "token_buy",
    wallet,
    title: `Token buy intent: ${tokens.toLocaleString()} EZZI` ,
    meta: { tokens, usd, phase: cfg.phase.id }
  });

  return NextResponse.json(
    {
      ok: true,
      id,
      tokens,
      usd,
      priceUsd: cfg.phase.priceUsd,
      buyOnlyEnabled: cfg.buyOnlyEnabled,
      message:
        "Purchase intent recorded. Hook this endpoint to your Solana program / payment rail when ready.",
    },
    { headers: { "cache-control": "no-store" } }
  );
}
