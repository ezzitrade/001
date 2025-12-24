import { storage } from "@/app/api/_lib/storage";

export type EzziConfig = {
  buyOnlyEnabled: boolean;
  tokenSale: {
    saleEnabled: boolean;
    dailyCapTokens: number;
    dailySoldTokens: number;
    dailyResetYmd: string;
  };
  phase: {
    id: string;
    name: string;
    priceUsd: number;
    targetPriceUsd: number;
  };
  supply: {
    capsulesTotal: number;
    charactersTotal: number;
    tokensTargetSold: number;
    capsulesSold: number;
    charactersSold: number;
    tokensSold: number;
  };
  drops: {
    nextDropIso: string;
  };
};

export const DEFAULT_CONFIG: EzziConfig = {
  buyOnlyEnabled: true,
  tokenSale: {
    saleEnabled: true,
    dailyCapTokens: 1_000_000,
    dailySoldTokens: 0,
    dailyResetYmd: new Date().toISOString().slice(0, 10),
  },
  phase: {
    id: "genesis",
    name: "Genesis Phase",
    priceUsd: 0.023,
    targetPriceUsd: 0.07,
  },
  supply: {
    capsulesTotal: 2300,
    charactersTotal: 2300,
    tokensTargetSold: 50_000_000,
    capsulesSold: 0,
    charactersSold: 0,
    tokensSold: 0,
  },
  drops: {
    // Default: 72 hours from build time (will be overridden in KV if set)
    nextDropIso: new Date(Date.now() + 72 * 60 * 60 * 1000).toISOString(),
  },
};

export async function getEzziConfig(): Promise<EzziConfig> {
  const stored = await storage.get("seeds", "config");
  if (!stored) return DEFAULT_CONFIG;
  try {
    const merged = { ...DEFAULT_CONFIG, ...(stored as any) } as EzziConfig;
    // Daily reset for token sale counters.
    const today = new Date().toISOString().slice(0, 10);
    if (!merged.tokenSale) merged.tokenSale = { ...DEFAULT_CONFIG.tokenSale };
    if (merged.tokenSale.dailyResetYmd !== today) {
      merged.tokenSale.dailyResetYmd = today;
      merged.tokenSale.dailySoldTokens = 0;
      await storage.set("seeds", "config", merged);
    }
    return merged;
  } catch {
    return DEFAULT_CONFIG;
  }
}

export async function setEzziConfig(partial: Partial<EzziConfig>) {
  const existing = await getEzziConfig();
  await storage.set("seeds", "config", { ...existing, ...partial });
}
