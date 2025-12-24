import { NextResponse } from "next/server";
import { getEzziConfig } from "@/lib/config";
import { storage } from "@/app/api/_lib/storage";
import { getWalletProfile, saveWalletProfile } from "@/app/api/_lib/walletProfile";
import { boostForTier, capsulePriceUsd, clampTier, type EzziAsset, type RarityTier } from "@/lib/assets";
import { pushEvent } from "@/app/api/_lib/events";

export const runtime = "nodejs";

type Body = {
  wallet?: string;
  tier?: string;
  referralCode?: string;
};

function err(message: string, status = 400) {
  return NextResponse.json({ ok: false, error: message }, { status });
}

export async function POST(req: Request) {
  let body: Body;
  try {
    body = (await req.json()) as Body;
  } catch {
    return err("Invalid JSON payload");
  }

  const wallet = String(body.wallet || "").trim();
  if (!wallet) return err("Wallet is required");

  const tier: RarityTier = clampTier(String(body.tier || "common"));
  const cfg = await getEzziConfig();

  if (cfg.supply.capsulesSold >= cfg.supply.capsulesTotal) {
    return err("Capsules sold out", 403);
  }

  const priceUsd = capsulePriceUsd(tier);
  const referralCode = body.referralCode ? String(body.referralCode).trim() : "";

  const profile = await getWalletProfile(wallet);
  const id = `cap_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const asset: EzziAsset = {
    id,
    kind: "capsule",
    tier,
    name: `${tier[0].toUpperCase()}${tier.slice(1)} Capsule`,
    mintedTs: Date.now(),
    image: "/assets/capsules/capsule.svg",
    perks: { tokenBoostPct: boostForTier("capsule", tier) },
    referralCode: referralCode || undefined,
  };

  profile.assets = [asset, ...(profile.assets || [])].slice(0, 500);
  await saveWalletProfile(profile);

  // Update global supply counters.
  cfg.supply.capsulesSold += 1;
  await storage.set("seeds", "config", cfg);

  // Record event for activity feed.
  await pushEvent({
    type: "capsule_mint",
    wallet,
    title: `Capsule minted: ${asset.name}`,
    meta: { tier, priceUsd, referralCode: referralCode || undefined, assetId: id },
  });

  return NextResponse.json({ ok: true, asset, priceUsd, supply: cfg.supply }, { headers: { "cache-control": "no-store" } });
}
