"use client";

import { useEffect, useState } from "react";

type Entry = {
  runId: string;
  stage: string;
  score: number;
  playerId: string;
  createdAt: string;
};

export default function LeaderboardPage() {
  const [items, setItems] = useState<Entry[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch("/api/leaderboard", { cache: "no-store" })
      .then((r) => r.json())
      .then((j) => {
        if (!alive) return;
        setItems(Array.isArray(j?.items) ? j.items : []);
      })
      .catch(() => {
        if (!alive) return;
        setErr("Failed to load leaderboard.");
      });
    return () => {
      alive = false;
    };
  }, []);

  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="stack" style={{ gap: 14 }}>
            <div className="row" style={{ alignItems: "baseline", justifyContent: "space-between" }}>
              <div className="stack" style={{ gap: 6 }}>
                <span className="pill"><span className="pillDot" /> Competitive Progress</span>
                <h1 style={{ fontSize: "clamp(34px, 3.6vw, 52px)" }}>Leaderboards</h1>
                <p>Climb the rankings. Earn status. Unlock rewards.</p>
              </div>
              <a className="btn btnPrimary" href="/play"><strong>▶ Play</strong></a>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              {err ? <p style={{ color: "var(--danger)" }}>{err}</p> : null}
              <table>
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Stage</th>
                    <th>Score</th>
                    <th>Player</th>
                    <th>Time</th>
                  </tr>
                </thead>
                <tbody>
                  {items.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="muted">
                        No entries yet. Be the first.
                      </td>
                    </tr>
                  ) : (
                    items.map((it, idx) => (
                      <tr key={it.runId}>
                        <td>{idx + 1}</td>
                        <td className="mono">{it.stage}</td>
                        <td className="mono" style={{ color: "var(--text)" }}>{Number(it.score).toLocaleString()}</td>
                        <td className="mono" style={{ color: "var(--muted)" }}>{it.playerId.slice(0, 6)}…{it.playerId.slice(-4)}</td>
                        <td className="muted2">{new Date(it.createdAt).toLocaleString()}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="grid2">
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Holder badges (next)</strong>
                <p style={{ marginTop: 6 }}>Genesis holder icons and rarity badges will appear next to your player tag.</p>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Seasons (next)</strong>
                <p style={{ marginTop: 6 }}>Weekly seasons reset rankings and distribute rewards with anti‑abuse checks.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
