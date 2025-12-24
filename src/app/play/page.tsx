"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { useWallet } from "@solana/wallet-adapter-react";
import { bootEngine, type EngineHandle } from "@/engine";
import { exportSession, importSession, applyHolderPerks } from "@/engine/runtime/session";

async function loadState() {
  const r = await fetch("/api/player/state", { cache: "no-store" });
  if (!r.ok) throw new Error("load_state_failed");
  return (await r.json()) as { state: any };
}

async function saveState(state: any) {
  await fetch("/api/player/state", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(state)
  });
}

export default function PlayPage() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const engineRef = useRef<EngineHandle | null>(null);
  const { publicKey } = useWallet();
  const wallet = useMemo(() => (publicKey ? publicKey.toBase58() : ""), [publicKey]);
  const [perks, setPerks] = useState<{ tokenBoostPct: number; holderTier?: string } | null>(null);

  useEffect(() => {
    let alive = true;
    const canvas = canvasRef.current;
    if (!canvas) return;

    (async () => {
      try {
        const { state } = await loadState();
        if (alive && state) importSession(state);
      } catch {}
      const debug = process.env.NEXT_PUBLIC_EZZI_DEBUG === "1";
      engineRef.current = bootEngine({ canvas, debug });
    })();

    const t = setInterval(() => {
      const s = exportSession();
      saveState(s).catch(() => {});
    }, 3000);

    return () => {
      alive = false;
      clearInterval(t);
      engineRef.current?.destroy();
      engineRef.current = null;
      const s = exportSession();
      saveState(s).catch(() => {});
    };
  }, []);

  // Wallet binding + perks can update without re-booting the engine.
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
        const pr = await fetch("/api/player/profile", { cache: "no-store" });
        const pj = await pr.json();
        if (!alive) return;
        if (pj?.perks) {
          setPerks(pj.perks);
          applyHolderPerks(pj.perks, pj.wallet || wallet || undefined);
        } else {
          setPerks({ tokenBoostPct: 0 });
          applyHolderPerks({ tokenBoostPct: 0 }, wallet || undefined);
        }
      } catch {
        if (!alive) return;
        setPerks({ tokenBoostPct: 0 });
      }
    })();
    return () => {
      alive = false;
    };
  }, [wallet]);

  return (
    <main className="container" style={{ paddingTop: 18 }}>
      <div className="row" style={{ justifyContent: "space-between", alignItems: "baseline", flexWrap: "wrap", gap: 12 }}>
        <div>
          <h1 style={{ marginBottom: 6 }}>Play</h1>
          <p className="muted2" style={{ marginTop: 0 }}>
            Tap top bar to switch modes. Holder perks apply to rewards instantly.
          </p>
        </div>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          <span className="pill"><span className="pillDot" /> Holder tier: <strong style={{ textTransform: "capitalize" }}>{perks?.holderTier || "none"}</strong></span>
          <span className="pill"><span className="pillDot" /> Boost: <strong>+{perks?.tokenBoostPct || 0}%</strong></span>
          <Link className="btn btnGhost" href="/account">Portfolio</Link>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: "hidden", position: "relative" }}>
        <canvas ref={canvasRef} style={{ width: "100%", height: 540, display: "block" }} />
        <div style={{ position: "absolute", right: 10, bottom: 10, pointerEvents: "none" }}>
          <span className="pill" style={{ backdropFilter: "blur(12px)", background: "rgba(7,8,18,0.55)", borderColor: "rgba(255,255,255,0.12)" }}>
            Autosave ON
          </span>
        </div>
      </div>
    </main>
  );
}
