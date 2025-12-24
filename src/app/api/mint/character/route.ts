import { NextResponse } from "next/server";
import { getEzziConfig } from "@/lib/config";
import { storage } from "@/app/api/_lib/storage";
import { getWalletProfile, saveWalletProfile } from "@/app/api/_lib/walletProfile";
import { boostForTier, characterPriceUsd, clampTier, type EzziAsset, type RarityTier } from "@/lib/assets";
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

const IMAGES: Record<RarityTier, string[]> = {
  common: [
    "/assets/characters/common/Common1.png",
    "/assets/characters/common/common2.png",
    "/assets/characters/common/common3.png",
    "/assets/characters/common/common4.png",
  ],
  rare: [
    "/assets/characters/rare/Rare1.png",
    "/assets/characters/rare/Rare2.png",
    "/assets/characters/rare/Rare3.png",
    "/assets/characters/rare/Rare4.png",
  ],
  epic: [
    "/assets/characters/epic/Epic1.png",
    "/assets/characters/epic/Epic2.png",
    "/assets/characters/epic/Epic3.png",
    "/assets/characters/epic/Epic4.png",
  ],
  legendary: [
    "/assets/characters/legendary/Legendary1.png",
    "/assets/characters/legendary/Legendary2.png",
    "/assets/characters/legendary/Legendary3.png",
    "/assets/characters/legendary/Legendary4.png",
  ],
};

function pick<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)];
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

  if (cfg.supply.charactersSold >= cfg.supply.charactersTotal) {
    return err("Characters sold out", 403);
  }

  const priceUsd = characterPriceUsd(tier);
  const referralCode = body.referralCode ? String(body.referralCode).trim() : "";

  const profile = await getWalletProfile(wallet);
  const id = `char_${Date.now()}_${Math.random().toString(16).slice(2)}`;
  const asset: EzziAsset = {
    id,
    kind: "character",
    tier,
    name: `${tier[0].toUpperCase()}${tier.slice(1)} Character`,
    mintedTs: Date.now(),
    image: pick(IMAGES[tier]),
    perks: { tokenBoostPct: boostForTier("character", tier) },
    referralCode: referralCode || undefined,
  };

  profile.assets = [asset, ...(profile.assets || [])].slice(0, 500);
  await saveWalletProfile(profile);

  cfg.supply.charactersSold += 1;
  await storage.set("seeds", "config", cfg);

  await pushEvent({
    type: "character_mint",
    wallet,
    title: `Character minted: ${asset.name}`,
    meta: { tier, priceUsd, referralCode: referralCode || undefined, assetId: id },
  });

  return NextResponse.json({ ok: true, asset, priceUsd, supply: cfg.supply }, { headers: { "cache-control": "no-store" } });
}
