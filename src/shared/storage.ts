export type KVNamespace =
  | "players"
  | "leaderboard"
  | "market"
  | "runs"
  | "seeds"
  | "transactions";

export interface StorageAdapter {
  get<T>(ns: KVNamespace, key: string): Promise<T | null>;
  set<T>(ns: KVNamespace, key: string, value: T, ttlSec?: number): Promise<void>;
  del(ns: KVNamespace, key: string): Promise<void>;
  listKeys(ns: KVNamespace, prefix: string, limit: number): Promise<string[]>;
}
