"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";

type Config = {
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
    tokensTargetSold: number;
    tokensSold: number;
  };
};

export default function BuyPage() {
  const { publicKey, connected } = useWallet();
  const walletAddr = publicKey?.toBase58() || "";

  const [cfg, setCfg] = useState<Config | null>(null);
  const [loading, setLoading] = useState(true);
  const [tokens, setTokens] = useState(1000);
  const [ref, setRef] = useState("");
  const [status, setStatus] = useState<string>("");
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const r = await fetch("/api/config", { cache: "no-store" });
        const j = await r.json();
        if (alive) setCfg(j);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  const priceUsd = cfg?.phase.priceUsd ?? 0.023;
  const totalUsd = useMemo(() => Number((Math.max(0, tokens) * priceUsd).toFixed(6)), [tokens, priceUsd]);
  const remainingToday = useMemo(() => {
    if (!cfg) return 0;
    return Math.max(0, cfg.tokenSale.dailyCapTokens - cfg.tokenSale.dailySoldTokens);
  }, [cfg]);

  async function onBuy() {
    setStatus("");
    if (!cfg) return;
    if (!cfg.tokenSale.saleEnabled) {
      setStatus("Token sale is currently paused.");
      return;
    }
    if (!connected || !walletAddr) {
      setStatus("Connect your wallet to continue.");
      return;
    }

    const amt = Math.floor(Number(tokens || 0));
    if (amt <= 0) {
      setStatus("Enter a valid token amount.");
      return;
    }
    if (amt > remainingToday) {
      setStatus(`Daily cap exceeded. Remaining today: ${remainingToday}`);
      return;
    }

    setBusy(true);
    try {
      const r = await fetch("/api/token/buy", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ tokens: amt, referralCode: ref.trim(), wallet: walletAddr }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setStatus(j?.error || "Purchase failed");
        return;
      }
      setStatus(`✅ Intent recorded: ${j.id}. Amount: ${j.tokens} EZZI ($${j.usd}).`);
      // refresh config to update daily sold + progress
      const rr = await fetch("/api/config", { cache: "no-store" });
      const jj = await rr.json();
      setCfg(jj);
    } catch {
      setStatus("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="container" style={{ paddingTop: 28, paddingBottom: 68 }}>
      <div className="stack" style={{ gap: 14 }}>
        <div className="card" style={{ padding: 22 }}>
          <div className="row" style={{ justifyContent: "space-between", alignItems: "center", flexWrap: "wrap" }}>
            <div>
              <h1 style={{ margin: 0, letterSpacing: "-0.03em" }}>Buy EZZI Coin</h1>
              <p className="muted" style={{ marginTop: 6 }}>
                A buy-only phase can be enabled by the founder for fairness. Trading UX is intentionally withheld while the ecosystem stabilizes.
              </p>
            </div>
            <Link className="btn btnGhost" href="/docs">Read Docs</Link>
          </div>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 14 }}>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Phase</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{cfg?.phase.name ?? "Genesis Phase"}</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Price: <strong>${priceUsd}</strong> / EZZI • Target: ${cfg?.phase.targetPriceUsd ?? 0.07}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Sale Status</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {loading ? "Loading…" : cfg?.tokenSale.saleEnabled ? "Live" : "Paused"}
              </div>
              <div className="muted" style={{ marginTop: 6 }}>
                Buy-only mode: <strong>{cfg?.buyOnlyEnabled ? "ON" : "OFF"}</strong>
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Daily Cap</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>{cfg ? remainingToday.toLocaleString() : "—"} EZZI remaining</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Resets daily • Today: {cfg?.tokenSale.dailyResetYmd ?? "—"}
              </div>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Genesis Progress</div>
              <div style={{ fontSize: 18, fontWeight: 700 }}>
                {cfg ? `${cfg.supply.tokensSold.toLocaleString()} / ${cfg.supply.tokensTargetSold.toLocaleString()}` : "—"}
              </div>
              <div className="bar" style={{ marginTop: 10 }}>
                <div
                  className="barFill"
                  style={{
                    width: cfg ? `${Math.min(100, (cfg.supply.tokensSold / cfg.supply.tokensTargetSold) * 100)}%` : "0%",
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: 22 }}>
          <h2 style={{ marginTop: 0 }}>Purchase</h2>
          <p className="muted" style={{ marginTop: 6 }}>
            This endpoint records an off-chain purchase intent in KV. Replace it with your Solana program / on-chain swap when you’re ready.
          </p>

          <div className="grid" style={{ gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 12, marginTop: 12 }}>
            <label className="field">
              <span className="muted2">Token amount</span>
              <input
                className="input"
                type="number"
                min={1}
                step={1}
                value={tokens}
                onChange={(e) => setTokens(Math.max(0, Math.floor(Number(e.target.value || 0))))}
              />
            </label>

            <label className="field">
              <span className="muted2">Referral code (optional)</span>
              <input className="input" value={ref} onChange={(e) => setRef(e.target.value)} placeholder="EZZI10" />
            </label>

            <div className="card" style={{ padding: 14 }}>
              <div className="muted2">Estimated total</div>
              <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: "-0.02em" }}>${totalUsd}</div>
              <div className="muted" style={{ marginTop: 6 }}>
                Wallet: <strong>{connected ? walletAddr.slice(0, 4) + "…" + walletAddr.slice(-4) : "Not connected"}</strong>
              </div>
            </div>
          </div>

          <div className="row" style={{ marginTop: 14, gap: 10, flexWrap: "wrap" }}>
            <button className="btn btnPrimary" onClick={onBuy} disabled={busy || loading}>
              {busy ? "Processing…" : "Confirm Buy"}
            </button>
            <Link className="btn btnGhost" href="/affiliate">Get a referral link</Link>
            <Link className="btn btnGhost" href="/play">Play first</Link>
          </div>

          {status ? (
            <div className="notice" style={{ marginTop: 14 }}>
              {status}
            </div>
          ) : null}
        </div>
      </div>
    </main>
  );
}
