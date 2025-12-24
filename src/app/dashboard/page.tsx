"use client";

import { useEffect, useState } from "react";

type StateRes = { playerId: string; state: any };

type RunsRes = { items: any[] };

type LBRes = { items: any[] };

type MarketRes = { items: any[] };

export default function Dashboard() {
  const [ps, setPs] = useState<StateRes | null>(null);
  const [runs, setRuns] = useState<RunsRes | null>(null);
  const [lb, setLb] = useState<LBRes | null>(null);
  const [market, setMarket] = useState<MarketRes | null>(null);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const [a, b, c, d] = await Promise.all([
          fetch("/api/player/state", { cache: "no-store" }),
          fetch("/api/runs/list", { cache: "no-store" }),
          fetch("/api/leaderboard", { cache: "no-store" }),
          fetch("/api/market/listings", { cache: "no-store" })
        ]);
        if (!a.ok) throw new Error("player_state_failed");
        setPs(await a.json());
        if (b.ok) setRuns(await b.json());
        if (c.ok) setLb(await c.json());
        if (d.ok) setMarket(await d.json());
      } catch (e: any) {
        setErr(e?.message ?? "dashboard_failed");
      }
    })();
  }, []);

  const coins = ps?.state?.player?.coins ?? ps?.state?.coins ?? 0;
  const inv = ps?.state?.player?.inventory ?? ps?.state?.inventory ?? {};
  const invCount = Object.keys(inv).length;

  return (
    <main className="container">
      <h1>Dashboard</h1>
      <p>Overview of your saved state (KV persisted on Vercel).</p>

      <div className="row">
        <a className="btn" href="/play"><span style={{ color: "var(--accent)" }}>▶ Play</span></a>
        <a className="btn" href="/docs">Docs</a>
        <a className="btn" href="/roadmap">Roadmap</a>
        <a className="btn" href="/devlog">Devlog</a>
      </div>

      {err ? (
        <div className="card" style={{ marginTop: 16 }}>
          <h2>Error</h2>
          <p>{err}</p>
        </div>
      ) : null}

      <div className="row" style={{ marginTop: 16 }}>
        <div className="card" style={{ flex: "1 1 240px" }}>
          <h2>PlayerId</h2>
          <p style={{ color: "var(--text)" }}>{ps?.playerId ?? "..."}</p>
        </div>
        <div className="card" style={{ flex: "1 1 240px" }}>
          <h2>Coins</h2>
          <p style={{ fontSize: 28, color: "var(--text)" }}>{coins}</p>
        </div>
        <div className="card" style={{ flex: "1 1 240px" }}>
          <h2>Inventory items</h2>
          <p style={{ fontSize: 28, color: "var(--text)" }}>{invCount}</p>
        </div>
        <div className="card" style={{ flex: "1 1 240px" }}>
          <h2>Recent runs</h2>
          <p style={{ fontSize: 28, color: "var(--text)" }}>{runs?.items?.length ?? 0}</p>
        </div>
      </div>

      <div className="row" style={{ marginTop: 16 }}>
        <div className="card" style={{ flex: "1 1 480px" }}>
          <h2>Inventory snapshot</h2>
          <table>
            <thead>
              <tr><th>Item</th><th>Rarity</th><th>Qty</th></tr>
            </thead>
            <tbody>
              {Object.values(inv).slice(0, 8).map((it: any) => (
                <tr key={it.id}><td style={{ color: "var(--text)" }}>{it.name ?? it.id}</td><td>{it.rarity ?? "-"}</td><td>{it.qty ?? 0}</td></tr>
              ))}
            </tbody>
          </table>
          {Object.values(inv).length === 0 ? <p>No items yet. Play to earn items.</p> : null}
        </div>

        <div className="card" style={{ flex: "1 1 480px" }}>
          <h2>Leaderboard</h2>
          <table>
            <thead><tr><th>#</th><th>Score</th><th>Stage</th></tr></thead>
            <tbody>
              {(lb?.items ?? []).slice(0, 8).map((e: any, idx: number) => (
                <tr key={e.runId ?? idx}><td>{idx + 1}</td><td style={{ color: "var(--text)" }}>{e.score}</td><td>{e.stage ?? "S1"}</td></tr>
              ))}
            </tbody>
          </table>
          {(lb?.items ?? []).length === 0 ? <p>No leaderboard entries yet.</p> : null}
        </div>
      </div>

      <div className="card" style={{ marginTop: 16 }}>
        <h2>Market (latest listings)</h2>
        <table>
          <thead><tr><th>Item</th><th>Qty</th><th>Price</th><th>Seller</th></tr></thead>
          <tbody>
            {(market?.items ?? []).slice(0, 10).map((l: any) => (
              <tr key={l.listingId}><td style={{ color: "var(--text)" }}>{l.itemId}</td><td>{l.qty}</td><td>{l.price?.amount ?? l.priceAmount}</td><td><small>{String(l.sellerId ?? "").slice(0, 10)}</small></td></tr>
            ))}
          </tbody>
        </table>
        {(market?.items ?? []).length === 0 ? <p>No listings yet. Create one via API (Phase J demo).</p> : null}
      </div>
    </main>
  );
}
