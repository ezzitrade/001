import { storage } from "./storage";

export type EventType =
  | "token_buy"
  | "capsule_mint"
  | "character_mint"
  | "market_buy"
  | "market_list";

export type EzziEvent = {
  id: string;
  type: EventType;
  ts: number;
  wallet?: string;
  playerId?: string;
  title: string;
  meta?: Record<string, any>;
};

export async function pushEvent(evt: Omit<EzziEvent, "id" | "ts"> & { id?: string; ts?: number }) {
  const ts = typeof evt.ts === "number" ? evt.ts : Date.now();
  const id = evt.id || `evt_${ts}_${Math.random().toString(16).slice(2)}`;
  const record: EzziEvent = {
    id,
    ts,
    type: evt.type,
    wallet: evt.wallet,
    playerId: evt.playerId,
    title: evt.title,
    meta: evt.meta ?? {},
  };
  // Store in transactions namespace for a unified activity feed.
  await storage.set("transactions", id, record, 60 * 60 * 24 * 30);
  return record;
}
