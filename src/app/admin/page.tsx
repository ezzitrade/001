"use client";

import { useEffect, useState } from "react";

type Config = any;

export default function AdminConfigPage() {
  const [key, setKey] = useState("");
  const [cfg, setCfg] = useState<Config | null>(null);
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  async function load() {
    setStatus("");
    setBusy(true);
    try {
      const r = await fetch(`/api/admin/config${key ? `?key=${encodeURIComponent(key)}` : ""}`, { cache: "no-store" });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setStatus(j?.error || "Failed to load");
        return;
      }
      setCfg(j.config);
    } catch {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
  }

  useEffect(() => {
    // no auto load by default (admin key might be required)
  }, []);

  async function save() {
    if (!cfg) return;
    setStatus("");
    setBusy(true);
    try {
      const r = await fetch("/api/admin/config", {
        method: "POST",
        headers: {
          "content-type": "application/json",
          ...(key ? { "x-admin-key": key } : {}),
        },
        body: JSON.stringify({
          buyOnlyEnabled: cfg.buyOnlyEnabled,
          phase: cfg.phase,
          tokenSale: cfg.tokenSale,
          drops: cfg.drops,
        }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setStatus(j?.error || "Save failed");
        return;
      }
      setCfg(j.config);
      setStatus("✅ Saved");
    } catch {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 28, paddingBottom: 80 }}>
      <div className="card" style={{ padding: 22 }}>
        <h1 style={{ marginTop: 0 }}>Admin • Config</h1>
        <p className="muted" style={{ marginTop: 6 }}>
          Toggle buy-only mode, phase pricing, daily caps, and the next drop countdown. Set <code>ADMIN_KEY</code> on Vercel to protect this page.
        </p>

        <div className="row" style={{ gap: 10, flexWrap: "wrap", marginTop: 12 }}>
          <input className="input" placeholder="ADMIN_KEY (optional)" value={key} onChange={(e) => setKey(e.target.value)} style={{ minWidth: 280 }} />
          <button className="btn btnGhost" onClick={load} disabled={busy}>Load</button>
          <button className="btn btnPrimary" onClick={save} disabled={busy || !cfg}>Save</button>
        </div>

        {!cfg ? (
          <div className="notice" style={{ marginTop: 14 }}>
            Load the current config first.
          </div>
        ) : (
          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 12, marginTop: 14 }}>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Soft Lock</div>
              <label className="row" style={{ gap: 10, marginTop: 8 }}>
                <input type="checkbox" checked={!!cfg.buyOnlyEnabled} onChange={(e) => setCfg({ ...cfg, buyOnlyEnabled: e.target.checked })} />
                <span>Buy-only mode enabled</span>
              </label>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Sale</div>
              <label className="row" style={{ gap: 10, marginTop: 8 }}>
                <input type="checkbox" checked={!!cfg.tokenSale?.saleEnabled} onChange={(e) => setCfg({ ...cfg, tokenSale: { ...cfg.tokenSale, saleEnabled: e.target.checked } })} />
                <span>Sale enabled</span>
              </label>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Daily cap (tokens)</span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step={1}
                  value={cfg.tokenSale?.dailyCapTokens ?? 0}
                  onChange={(e) => setCfg({ ...cfg, tokenSale: { ...cfg.tokenSale, dailyCapTokens: Math.max(0, Math.floor(Number(e.target.value || 0))) } })}
                />
              </div>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Daily sold (tokens)</span>
                <input
                  className="input"
                  type="number"
                  min={0}
                  step={1}
                  value={cfg.tokenSale?.dailySoldTokens ?? 0}
                  onChange={(e) => setCfg({ ...cfg, tokenSale: { ...cfg.tokenSale, dailySoldTokens: Math.max(0, Math.floor(Number(e.target.value || 0))) } })}
                />
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Phase</div>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Phase name</span>
                <input className="input" value={cfg.phase?.name ?? ""} onChange={(e) => setCfg({ ...cfg, phase: { ...cfg.phase, name: e.target.value } })} />
              </div>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Price (USD)</span>
                <input className="input" type="number" step="0.001" min={0} value={cfg.phase?.priceUsd ?? 0} onChange={(e) => setCfg({ ...cfg, phase: { ...cfg.phase, priceUsd: Number(e.target.value || 0) } })} />
              </div>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Target price (USD)</span>
                <input className="input" type="number" step="0.001" min={0} value={cfg.phase?.targetPriceUsd ?? 0} onChange={(e) => setCfg({ ...cfg, phase: { ...cfg.phase, targetPriceUsd: Number(e.target.value || 0) } })} />
              </div>
            </div>

            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Drops</div>
              <div className="field" style={{ marginTop: 10 }}>
                <span className="muted2">Next drop (ISO)</span>
                <input className="input" value={cfg.drops?.nextDropIso ?? ""} onChange={(e) => setCfg({ ...cfg, drops: { ...cfg.drops, nextDropIso: e.target.value } })} />
              </div>
              <p className="muted" style={{ marginTop: 8 }}>
                Example: <code>{new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()}</code>
              </p>
            </div>
          </div>
        )}

        {status ? <div className="notice" style={{ marginTop: 14 }}>{status}</div> : null}
      </div>
    </main>
  );
}
