export type PlayerState = {
  playerId: string;
  /** Optional wallet address (Solana). */
  wallet?: string;
  coins: number;
  inventory: Record<string, { id: string; name: string; rarity: string; qty: number }>;
  upgrades: Record<string, number>;
  characters: Record<string, { instanceId: string; defId: string; name: string; level: number; xp: number }>;
  activeCharacterId?: string;
  /** Holder perks (derived from owned NFTs / referrals). */
  perks?: {
    /** Extra reward boost (percentage, e.g. 10 => +10%). */
    tokenBoostPct?: number;
    /** Display-only tier badge (common/rare/epic/legendary). */
    holderTier?: "common" | "rare" | "epic" | "legendary";
  };
};

type Session = {
  player: PlayerState;
  cooldowns: Record<string, number>;
  capsuleNonce: number;
};

const defaultPlayer = (): PlayerState => ({
  playerId: "local-player",
  coins: 250,
  inventory: {
    cap_basic: { id: "cap_basic", name: "Basic Capsule", rarity: "common", qty: 2 },
    cap_rare: { id: "cap_rare", name: "Rare Capsule", rarity: "rare", qty: 1 }
  },
  upgrades: { pick_speed: 1, yield_boost: 0, risk_shield: 0, crit_chance: 0 },
  characters: {}
});

const session: Session = {
  player: defaultPlayer(),
  cooldowns: {},
  capsuleNonce: 1
};

export function getSession() {
  return session;
}

export function exportSession() {
  return {
    player: session.player,
    cooldowns: session.cooldowns,
    capsuleNonce: session.capsuleNonce
  };
}

export function importSession(data: any) {
  if (!data || typeof data !== "object") return;
  if (data.player) session.player = data.player;
  if (data.cooldowns) session.cooldowns = data.cooldowns;
  if (typeof data.capsuleNonce === "number") session.capsuleNonce = data.capsuleNonce;
}

/**
 * Apply holder perks coming from the website (wallet assets, referrals, etc.).
 * This is intentionally lightweight and backwards-compatible.
 */
export function applyHolderPerks(perks: PlayerState["perks"], wallet?: string) {
  session.player.perks = {
    ...(session.player.perks ?? {}),
    ...(perks ?? {})
  };
  if (wallet) session.player.wallet = wallet;
}

export function resetSession() {
  session.player = defaultPlayer();
  session.cooldowns = {};
  session.capsuleNonce = 1;
}
