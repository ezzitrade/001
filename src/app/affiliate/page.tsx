import Link from "next/link";

export const metadata = {
  title: "Affiliate",
  description: "Affiliate + referral system blueprint for EZZI World: 10% off + 10% token boost.",
};

export default function AffiliatePage() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 12 }}>
              <span className="pill"><span className="pillDot" /> High‑conversion referrals</span>
              <h1>Affiliate + Referral Boost</h1>
              <p>
                EZZI World uses a simple incentive loop designed for viral sharing: the buyer saves money, gains a boost, and the referrer grows influence.
              </p>
              <div className="row">
                <a className="btn btnPrimary" href="https://discord.gg/mPMzZ6CC" target="_blank" rel="noreferrer"><strong>Get a Referral Code</strong></a>
                <a className="btn btnGhost" href="https://x.com/Ezzitrade" target="_blank" rel="noreferrer">Follow on X</a>
                <Link className="btn" href="/play">Play Now</Link>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Buyer advantage</strong>
                <p style={{ marginTop: 6 }}>
                  Enter a valid referral at mint/buy: <strong style={{ color: "var(--text)" }}>10% off</strong> + <strong style={{ color: "var(--text)" }}>10% token boost</strong>.
                </p>
                <div className="divider" />
                <strong>Referrer advantage</strong>
                <p style={{ marginTop: 6 }}>Earn commission or boost points per verified buyer. Higher tiers unlock better payouts.</p>
              </div>
            </div>

            <div className="stack" style={{ gap: 12 }}>
              <div className="card">
                <strong>Incentive matrix</strong>
                <div className="divider" />
                <table>
                  <thead>
                    <tr>
                      <th>Role</th>
                      <th>Gets</th>
                      <th>Why it works</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Buyer</td>
                      <td>10% off + 10% boost</td>
                      <td>Immediate win + progress speed</td>
                    </tr>
                    <tr>
                      <td>Referrer</td>
                      <td>Commission / boost ladder</td>
                      <td>Status + compounding incentives</td>
                    </tr>
                    <tr>
                      <td>Partner</td>
                      <td>Commission per buyer</td>
                      <td>Clear ROI for promotions</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="card" style={{ borderColor: "rgba(255,255,255,0.14)" }}>
                <strong>How we prevent abuse</strong>
                <p style={{ marginTop: 6 }}>
                  One referral per wallet, no self‑referrals, daily caps per code, and cooldowns. Verified conversion is wallet‑based.
                </p>
                <div className="row" style={{ marginTop: 10 }}>
                  <Link className="btn btnGhost" href="/docs">Read rules</Link>
                  <Link className="btn" href="/roadmap">See rollout</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
