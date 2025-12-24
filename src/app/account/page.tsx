"use client";

import { useEffect, useMemo, useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import Link from "next/link";
import type { EzziAsset } from "@/lib/assets";

type Profile = {
  ok: boolean;
  playerId: string;
  wallet: string | null;
  assets: EzziAsset[];
  perks: { tokenBoostPct: number; holderTier?: string };
};

export default function AccountPage() {
  const { publicKey } = useWallet();
  const wallet = useMemo(() => (publicKey ? publicKey.toBase58() : ""), [publicKey]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        if (wallet) {
          await fetch("/api/player/bind-wallet", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ wallet }),
          });
        }
        const r = await fetch("/api/player/profile", { cache: "no-store" });
        const j = (await r.json()) as Profile;
        if (alive) setProfile(j);
      } catch {
        if (alive) setProfile(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [wallet]);

  return (
    <main className="container" style={{ paddingTop: 24 }}>
      <div className="grid2" style={{ alignItems: "start" }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="stack" style={{ gap: 10 }}>
            <span className="pill"><span className="pillDot" /> Portfolio</span>
            <h1 style={{ marginBottom: 0 }}>Your Account</h1>
            <p className="muted2">
              Your assets live in your wallet profile (off-chain intents for now). Holder perks apply instantly in the game.
            </p>
            <div className="divider" />
            {loading ? (
              <p className="muted2">Loading…</p>
            ) : !profile?.wallet ? (
              <div className="stack" style={{ gap: 10 }}>
                <p className="muted2">Connect a wallet to see your holder badge and assets.</p>
                <div className="row">
                  <Link className="btn btnPrimary" href="/capsules"><strong>Mint Capsules</strong></Link>
                  <Link className="btn" href="/characters">Mint Characters</Link>
                </div>
              </div>
            ) : (
              <div className="stack" style={{ gap: 10 }}>
                <div className="row" style={{ justifyContent: "space-between", flexWrap: "wrap" }}>
                  <span className="pill"><span className="pillDot" /> Holder tier: <strong style={{ textTransform: "capitalize" }}>{profile.perks?.holderTier || "common"}</strong></span>
                  <span className="pill"><span className="pillDot" /> Boost: <strong>+{profile.perks?.tokenBoostPct || 0}%</strong></span>
                </div>
                <div className="row">
                  <Link className="btn btnPrimary" href="/play"><strong>▶ Play with perks</strong></Link>
                  <Link className="btn" href="/marketplace">Marketplace</Link>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="card" style={{ boxShadow: "none" }}>
          <strong>Your Assets</strong>
          <p className="muted2" style={{ marginTop: 6 }}>
            {profile?.assets?.length ? "Newest first." : "Mint to populate your portfolio."}
          </p>
          <div className="divider" />
          {profile?.assets?.length ? (
            <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
              {profile.assets.slice(0, 24).map((a) => (
                <div key={a.id} className="card" style={{ width: 220, padding: 10, boxShadow: "none" }}>
                  {a.image ? <img src={a.image} alt={a.name} style={{ width: "100%", borderRadius: 14 }} /> : null}
                  <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                    <span className="pill">{a.kind}</span>
                    <span className="pill" style={{ textTransform: "capitalize" }}>{a.tier}</span>
                  </div>
                  <div style={{ marginTop: 6 }}>
                    <strong style={{ fontSize: 14 }}>{a.name}</strong>
                    <p className="muted2" style={{ marginTop: 6 }}>
                      Boost: +{a.perks?.tokenBoostPct || 0}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="muted2">No assets yet.</p>
          )}
        </div>
      </div>
    </main>
  );
}
