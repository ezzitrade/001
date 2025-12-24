"use client";

import { useMemo, useState } from "react";

function clamp(n: number, lo: number, hi: number) {
  return Math.min(hi, Math.max(lo, n));
}

export function CalculatorClient() {
  const [tokensSold, setTokensSold] = useState(5_000_000);
  const [tokenPrice, setTokenPrice] = useState(0.023);
  const [capsulesSold, setCapsulesSold] = useState(600);
  const [capsulesAvg, setCapsulesAvg] = useState(29);
  const [charactersSold, setCharactersSold] = useState(400);
  const [charactersAvg, setCharactersAvg] = useState(31);
  const [partnerPayoutPct, setPartnerPayoutPct] = useState(7);
  const [referralDiscountPct, setReferralDiscountPct] = useState(10);
  const [referralSharePct, setReferralSharePct] = useState(35);

  const res = useMemo(() => {
    const tokenRev = tokensSold * tokenPrice;
    const capsuleRev = capsulesSold * capsulesAvg;
    const characterRev = charactersSold * charactersAvg;
    const gross = tokenRev + capsuleRev + characterRev;

    const referralCost = (capsuleRev + characterRev) * (referralSharePct / 100) * (referralDiscountPct / 100);
    const partnerCost = (gross - referralCost) * (partnerPayoutPct / 100);
    const net = gross - referralCost - partnerCost;

    return { tokenRev, capsuleRev, characterRev, gross, referralCost, partnerCost, net };
  }, [tokensSold, tokenPrice, capsulesSold, capsulesAvg, charactersSold, charactersAvg, partnerPayoutPct, referralDiscountPct, referralSharePct]);

  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="stack" style={{ gap: 14 }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="pill"><span className="pillDot" /> Realistic scenarios</span>
              <h1 style={{ fontSize: "clamp(34px, 3.6vw, 52px)" }}>Revenue Calculator</h1>
              <p>Model sales targets and costs: partners + referrals. Adjust assumptions to plan the 50M token sold goal.</p>
            </div>

            <div className="grid2" style={{ alignItems: "start" }}>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Inputs</strong>
                <div className="divider" />
                <div className="stack">
                  <label className="stack" style={{ gap: 6 }}>
                    <small>Tokens sold</small>
                    <input type="number" value={tokensSold} onChange={(e) => setTokensSold(clamp(Number(e.target.value), 0, 200_000_000))} />
                  </label>
                  <label className="stack" style={{ gap: 6 }}>
                    <small>Token price (USD)</small>
                    <input type="number" step="0.001" value={tokenPrice} onChange={(e) => setTokenPrice(clamp(Number(e.target.value), 0, 10))} />
                  </label>
                  <div className="grid2">
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Capsules sold</small>
                      <input type="number" value={capsulesSold} onChange={(e) => setCapsulesSold(clamp(Number(e.target.value), 0, 1_000_000))} />
                    </label>
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Avg capsule price (USD)</small>
                      <input type="number" value={capsulesAvg} onChange={(e) => setCapsulesAvg(clamp(Number(e.target.value), 0, 10_000))} />
                    </label>
                  </div>
                  <div className="grid2">
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Characters sold</small>
                      <input type="number" value={charactersSold} onChange={(e) => setCharactersSold(clamp(Number(e.target.value), 0, 1_000_000))} />
                    </label>
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Avg character price (USD)</small>
                      <input type="number" value={charactersAvg} onChange={(e) => setCharactersAvg(clamp(Number(e.target.value), 0, 10_000))} />
                    </label>
                  </div>
                  <div className="grid3">
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Partner payout (%)</small>
                      <input type="number" value={partnerPayoutPct} onChange={(e) => setPartnerPayoutPct(clamp(Number(e.target.value), 0, 50))} />
                    </label>
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Referral discount (%)</small>
                      <input type="number" value={referralDiscountPct} onChange={(e) => setReferralDiscountPct(clamp(Number(e.target.value), 0, 50))} />
                    </label>
                    <label className="stack" style={{ gap: 6 }}>
                      <small>Orders using referral (%)</small>
                      <input type="number" value={referralSharePct} onChange={(e) => setReferralSharePct(clamp(Number(e.target.value), 0, 100))} />
                    </label>
                  </div>
                </div>
              </div>

              <div className="stack" style={{ gap: 12 }}>
                <div className="card" style={{ boxShadow: "none" }}>
                  <strong>Results</strong>
                  <div className="divider" />
                  <div className="stack" style={{ gap: 10 }}>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="muted">Token revenue</span>
                      <span className="mono" style={{ color: "var(--text)" }}>${res.tokenRev.toLocaleString()}</span>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="muted">Capsules revenue</span>
                      <span className="mono" style={{ color: "var(--text)" }}>${res.capsuleRev.toLocaleString()}</span>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="muted">Characters revenue</span>
                      <span className="mono" style={{ color: "var(--text)" }}>${res.characterRev.toLocaleString()}</span>
                    </div>
                    <div className="divider" />
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <strong>Gross</strong>
                      <strong className="mono">${res.gross.toLocaleString()}</strong>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="muted">Referral discount cost</span>
                      <span className="mono">-${res.referralCost.toLocaleString()}</span>
                    </div>
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <span className="muted">Partner payouts</span>
                      <span className="mono">-${res.partnerCost.toLocaleString()}</span>
                    </div>
                    <div className="divider" />
                    <div className="row" style={{ justifyContent: "space-between" }}>
                      <strong>Net</strong>
                      <strong className="mono" style={{ color: "var(--accent)" }}>${res.net.toLocaleString()}</strong>
                    </div>
                  </div>
                </div>

                <div className="card" style={{ borderColor: "rgba(0,255,156,0.22)", boxShadow: "none" }}>
                  <strong>50M token sold target</strong>
                  <p style={{ marginTop: 6 }}>
                    At ${tokenPrice.toFixed(3)} per token, selling 50,000,000 tokens implies ${ (50_000_000 * tokenPrice).toLocaleString() } token revenue.
                    Adjust pricing phases to plan liquidity and demand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
