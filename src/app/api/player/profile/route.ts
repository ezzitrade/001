import { NextResponse } from "next/server";
import { getOrCreatePlayerId } from "../../_lib/playerId";
import { storage } from "../../_lib/storage";
import { getWalletProfile } from "@/app/api/_lib/walletProfile";
import { holderBoostFromAssets, holderTierFromAssets } from "@/lib/assets";

export const runtime = "nodejs";

export async function GET() {
  const pid = getOrCreatePlayerId();
  const binding = await storage.get<any>("players", `pid:${pid}:wallet`);
  const wallet = binding?.wallet ? String(binding.wallet) : "";
  if (!wallet) {
    return NextResponse.json({ ok: true, playerId: pid, wallet: null, assets: [], perks: { tokenBoostPct: 0 } }, { headers: { "cache-control": "no-store" } });
  }

  const profile = await getWalletProfile(wallet);
  const assets = profile.assets ?? [];
  const perks = {
    tokenBoostPct: holderBoostFromAssets(assets),
    holderTier: holderTierFromAssets(assets),
  };

  return NextResponse.json({ ok: true, playerId: pid, wallet, assets, perks }, { headers: { "cache-control": "no-store" } });
}
