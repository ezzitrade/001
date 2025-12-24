import Link from "next/link";

export const metadata = {
  title: "Docs",
  description: "How EZZI World works: gameplay loop, drops, referrals, buy-only mode, and system rules.",
};

export default function Docs() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="stack" style={{ gap: 14 }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="pill"><span className="pillDot" /> Read before you mint</span>
              <h1 style={{ fontSize: "clamp(34px, 3.6vw, 52px)" }}>Docs</h1>
              <p>Clear rules. Clear incentives. Designed for fairness and retention.</p>
            </div>

            <div className="grid2" style={{ alignItems: "start" }}>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Quick start</strong>
                <div className="divider" />
                <ol className="muted" style={{ margin: 0, paddingLeft: 18, lineHeight: 1.8 }}>
                  <li>
                    <Link href="/play">Play</Link> instantly (no wallet required).
                  </li>
                  <li>
                    Hit your first milestone (solve a stage / mine / appear on the leaderboard).
                  </li>
                  <li>
                    Mint a <Link href="/capsules">Capsule</Link> to unlock multipliers and limited routes.
                  </li>
                  <li>
                    Collect a <Link href="/characters">Character</Link> to establish identity + status.
                  </li>
                  <li>
                    Trade on the <Link href="/marketplace">Marketplace</Link>.
                  </li>
                </ol>
              </div>

              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Core loop</strong>
                <div className="divider" />
                <p>
                  Explore → Enter hotspot → Solve multi‑stage puzzle → Mine rewards → Leaderboard → Marketplace → Upgrade → Repeat.
                </p>
                <div className="divider" />
                <p>
                  EZZI World is built to make progress feel like ownership: badges, milestones, limited supply, and holder perks.
                </p>
              </div>
            </div>

            <div className="grid3">
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Buy‑only mode</strong>
                <p style={{ marginTop: 6 }}>
                  A founder‑controlled safety switch. When enabled, the economy stays buy‑only while the ecosystem stabilizes.
                </p>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Referrals</strong>
                <p style={{ marginTop: 6 }}>
                  A referral code gives buyers 10% off + a 10% token boost. Partners earn commission per verified buyer.
                </p>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Anti‑abuse</strong>
                <p style={{ marginTop: 6 }}>
                  One referral per wallet, no self‑referral, cooldowns, and caps. Leaderboard submissions use server validation.
                </p>
              </div>
            </div>

            <div className="card" style={{ boxShadow: "none" }}>
              <strong>Developer endpoints</strong>
              <p style={{ marginTop: 6 }}>These power the current demo and will expand with wallet + minting integrations.</p>
              <div className="divider" />
              <p className="muted">
                <kbd>/api/player/state</kbd> <kbd>/api/seed</kbd> <kbd>/api/runs/submit</kbd> <kbd>/api/leaderboard</kbd> <kbd>/api/market/listings</kbd> <kbd>/api/config</kbd>
              </p>
            </div>

            <small className="muted2" style={{ lineHeight: 1.6 }}>
              Nothing on this website is financial advice. Pricing phases and supply information are product configuration and may change.
            </small>
          </div>
        </div>
      </section>
    </main>
  );
}
