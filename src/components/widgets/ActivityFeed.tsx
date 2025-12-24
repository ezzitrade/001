"use client";

import { useEffect, useState } from "react";

type Event = {
  id: string;
  type: string;
  ts: number;
  title: string;
  wallet?: string;
  meta?: Record<string, any>;
};

function shortWallet(w: string) {
  if (!w) return "";
  return w.length <= 10 ? w : `${w.slice(0, 4)}…${w.slice(-4)}`;
}

export function ActivityFeed({ limit = 10, title = "Recent Activity" }: { limit?: number; title?: string }) {
  const [items, setItems] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        setLoading(true);
        const r = await fetch(`/api/events/recent?limit=${limit}`, { cache: "no-store" });
        const j = await r.json();
        if (alive) setItems(Array.isArray(j?.events) ? j.events : []);
      } catch {
        if (alive) setItems([]);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [limit]);

  return (
    <div className="card" style={{ boxShadow: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12 }}>
        <strong>{title}</strong>
        <span className="muted2 mono">live</span>
      </div>
      <div className="divider" />
      {loading ? (
        <p className="muted2">Loading…</p>
      ) : items.length === 0 ? (
        <p className="muted2">No events yet. Mint, buy, or trade to start the feed.</p>
      ) : (
        <div className="stack" style={{ gap: 10 }}>
          {items.map((e) => (
            <div key={e.id} className="row" style={{ justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}>
              <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
                <span className="pill"><span className="pillDot" />{String(e.type).replace("_", " ")}</span>
                <span>{e.title}</span>
              </div>
              <div className="row" style={{ gap: 10, opacity: 0.85 }}>
                {e.wallet ? <span className="mono muted2">{shortWallet(e.wallet)}</span> : null}
                <span className="mono muted2">{new Date(e.ts).toLocaleString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
