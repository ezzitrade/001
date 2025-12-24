import { storage } from "./storage";
import type { WalletProfile } from "@/lib/assets";

const key = (wallet: string) => `wallet:${wallet}:profile`;

export async function getWalletProfile(wallet: string): Promise<WalletProfile> {
  const w = String(wallet).trim();
  const existing = await storage.get<WalletProfile>("players", key(w));
  if (existing && existing.wallet) return existing;
  const created: WalletProfile = {
    wallet: w,
    createdTs: Date.now(),
    assets: [],
  };
  await storage.set("players", key(w), created);
  return created;
}

export async function saveWalletProfile(profile: WalletProfile) {
  await storage.set("players", key(profile.wallet), profile);
}
