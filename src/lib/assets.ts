export type RarityTier = "common" | "rare" | "epic" | "legendary";

export type AssetKind = "capsule" | "character";

export type EzziAsset = {
  id: string;
  kind: AssetKind;
  tier: RarityTier;
  name: string;
  mintedTs: number;
  image?: string;
  perks?: {
    tokenBoostPct?: number;
  };
  referralCode?: string;
};

export type WalletProfile = {
  wallet: string;
  createdTs: number;
  assets: EzziAsset[];
};

export const rarityOrder: Record<RarityTier, number> = {
  common: 0,
  rare: 1,
  epic: 2,
  legendary: 3,
};

export function clampTier(t: string): RarityTier {
  const x = String(t).toLowerCase();
  if (x === "rare" || x === "epic" || x === "legendary") return x;
  return "common";
}

export function capsulePriceUsd(tier: RarityTier) {
  const base = 23;
  const add = tier === "rare" ? 6 : tier === "epic" ? 12 : tier === "legendary" ? 18 : 0;
  return base + add;
}

export function characterPriceUsd(tier: RarityTier) {
  const base = 23;
  const add = tier === "rare" ? 8 : tier === "epic" ? 16 : tier === "legendary" ? 24 : 0;
  return base + add;
}

export function boostForTier(kind: AssetKind, tier: RarityTier): number {
  // Lightweight perk model (can be replaced with on-chain metadata later)
  if (kind === "capsule") {
    return tier === "legendary" ? 20 : tier === "epic" ? 15 : tier === "rare" ? 10 : 5;
  }
  return tier === "legendary" ? 25 : tier === "epic" ? 18 : tier === "rare" ? 12 : 8;
}

export function holderTierFromAssets(assets: EzziAsset[]): RarityTier | undefined {
  if (!assets?.length) return undefined;
  let best: RarityTier = "common";
  for (const a of assets) {
    if (rarityOrder[a.tier] > rarityOrder[best]) best = a.tier;
  }
  return best;
}

export function holderBoostFromAssets(assets: EzziAsset[]): number {
  if (!assets?.length) return 0;
  let best = 0;
  for (const a of assets) {
    best = Math.max(best, Number(a.perks?.tokenBoostPct || 0));
  }
  return best;
}
