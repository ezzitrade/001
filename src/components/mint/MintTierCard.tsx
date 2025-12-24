"use client";

import { useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import type { RarityTier } from "@/lib/assets";

type Kind = "capsule" | "character";

export function MintTierCard({ kind, tier, priceUsd, note }: { kind: Kind; tier: RarityTier; priceUsd: number; note: string }) {
  const { publicKey, connected } = useWallet();
  const wallet = useMemo(() => (publicKey ? publicKey.toBase58() : ""), [publicKey]);

  const [referralCode, setReferralCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<string | null>(null);
  const [assetId, setAssetId] = useState<string | null>(null);

  async function mint() {
    if (!wallet) {
      setMsg("Connect wallet to mint.");
      return;
    }
    setBusy(true);
    setMsg(null);
    setAssetId(null);
    try {
      const endpoint = kind === "capsule" ? "/api/mint/capsule" : "/api/mint/character";
      const r = await fetch(endpoint, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ wallet, tier, referralCode: referralCode.trim() || undefined }),
      });
      const j = await r.json();
      if (!r.ok || !j.ok) {
        setMsg(j?.error ? String(j.error) : "Mint failed");
      } else {
        setAssetId(j.asset?.id || null);
        setMsg("Mint intent recorded. Your holder perks apply instantly in /play.");
      }
    } catch {
      setMsg("Network error");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="card" style={{ boxShadow: "none" }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <strong style={{ textTransform: "capitalize" }}>{tier}</strong>
        <span className="mono" style={{ color: "var(--text)" }}>${priceUsd}</span>
      </div>
      <p style={{ marginTop: 6 }} className="muted2">{note}</p>
      <div className="row" style={{ marginTop: 10, alignItems: "center" }}>
        <button className="btn btnPrimary" type="button" onClick={mint} disabled={busy || !connected} title={!connected ? "Connect wallet first" : ""}>
          {busy ? "Minting…" : "Mint"}
        </button>
        <input
          value={referralCode}
          onChange={(e) => setReferralCode(e.target.value)}
          placeholder="Referral code (optional)"
          className="input"
          style={{ minWidth: 200 }}
        />
      </div>
      {msg ? (
        <div className="pill" style={{ marginTop: 10, borderColor: "rgba(153,107,255,0.3)" }}>
          <span className="pillDot" />
          <span>{msg}{assetId ? ` (ID: ${assetId})` : ""}</span>
        </div>
      ) : null}
    </div>
  );
}
