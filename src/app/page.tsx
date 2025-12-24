import Link from "next/link";

import { getEzziConfig } from "@/lib/config";
import { Countdown } from "@/components/widgets/Countdown";
import { PhasePricing } from "@/components/widgets/PhasePricing";
import { SupplyMeter } from "@/components/widgets/SupplyMeter";
import { FAQ } from "@/components/widgets/FAQ";
import { ActivityFeed } from "@/components/widgets/ActivityFeed";

export const metadata = {
  title: "Home",
  description:
    "EZZI World — Explore a next‑gen 2.5D world, open Capsules, collect Characters, solve puzzles, mine rewards, and trade on the marketplace.",
};

export default async function HomePage() {
  const cfg = await getEzziConfig();
  const capsulesRemaining = Math.max(0, cfg.supply.capsulesTotal - cfg.supply.capsulesSold);
  const charsRemaining = Math.max(0, cfg.supply.charactersTotal - cfg.supply.charactersSold);

  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="row" style={{ alignItems: "flex-start", justifyContent: "space-between" }}>
            <div className="stack" style={{ gap: 12, maxWidth: 720 }}>
              <div className="row" style={{ alignItems: "center" }}>
                <span className="pill">
                  <span className="pillDot" />
                  <span>Genesis Supply • 2,300 Capsules • 2,300 Characters</span>
                </span>
                <Countdown toIso={cfg.drops.nextDropIso} />
              </div>

              <h1>
                Explore. Mine.
                <br />
                Solve. Evolve.
              </h1>
              <p style={{ fontSize: 16 }}>
                EZZI World is a high‑stakes 2.5D adventure where progress becomes ownership: open Capsules, collect Characters, solve multi‑stage puzzles,
                mine rewards, climb leaderboards, and trade on the marketplace.
              </p>

              <div className="row" style={{ marginTop: 6 }}>
                <Link className="btn btnPrimary" href="/play" style={{ paddingInline: 18 }}>
                  <strong>▶ Play Now</strong>
                </Link>
                <Link className="btn" href="/capsules">Mint Capsules</Link>
                <Link className="btn btnGhost" href="/docs">Read Docs</Link>
              </div>

              <div className="row" style={{ marginTop: 8 }}>
                <PhasePricing phaseName={cfg.phase.name} priceUsd={cfg.phase.priceUsd} targetUsd={cfg.phase.targetPriceUsd} />
                <span className="pill">
                  <span className="pillDot" style={{ background: "var(--danger)", boxShadow: "0 0 0 5px rgba(255,72,124,0.08)" }} />
                  <span>
                    Buy‑only mode: <strong style={{ color: cfg.buyOnlyEnabled ? "var(--accent)" : "var(--danger)" }}>{cfg.buyOnlyEnabled ? "ON" : "OFF"}</strong>
                  </span>
                </span>
              </div>
            </div>

            <div className="stack" style={{ minWidth: 320, maxWidth: 360 }}>
              <div className="card" style={{ position: "relative" }}>
                <strong>Early‑Mover Advantage</strong>
                <p style={{ marginTop: 6 }}>
                  Genesis supply is fixed. Early explorers lock in lower phase pricing, higher progression multipliers, and priority access to limited drops.
                </p>
                <div className="divider" />
                <SupplyMeter label="Capsules" sold={cfg.supply.capsulesSold} total={cfg.supply.capsulesTotal} />
                <div style={{ height: 10 }} />
                <SupplyMeter label="Characters" sold={cfg.supply.charactersSold} total={cfg.supply.charactersTotal} />
                <div className="divider" />
                <div className="row" style={{ alignItems: "baseline", justifyContent: "space-between" }}>
                  <small className="muted2">Available now</small>
                  <strong className="mono" style={{ color: "var(--text)" }}>
                    {capsulesRemaining.toLocaleString()} capsules • {charsRemaining.toLocaleString()} characters
                  </strong>
                </div>
              </div>

              <div className="card" style={{ borderColor: "rgba(0,255,156,0.18)" }}>
                <strong>Affiliate Boost</strong>
                <p style={{ marginTop: 6 }}>
                  Use a referral to get <strong style={{ color: "var(--text)" }}>10% off</strong> + a <strong style={{ color: "var(--text)" }}>10% token boost</strong>.
                  Partners earn commission per buyer.
                </p>
                <div className="row" style={{ marginTop: 10 }}>
                  <Link className="btn btnGhost" href="/affiliate">How it works</Link>
                  <a className="btn" href="https://discord.gg/mPMzZ6CC" target="_blank" rel="noreferrer">Get a code</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 18 }}>
        <div className="grid3">
          <div className="card">
            <span className="pill"><span className="pillDot" /> 01 • Explore</span>
            <h2 style={{ marginTop: 10 }}>A living 2.5D world</h2>
            <p style={{ marginTop: 8 }}>
              Travel across regions, follow road nodes, uncover hotspots, and navigate fog, decoys, and alerts.
            </p>
          </div>
          <div className="card">
            <span className="pill"><span className="pillDot" style={{ background: "var(--accent2)", boxShadow: "0 0 0 5px rgba(153,107,255,0.08)" }} /> 02 • Play</span>
            <h2 style={{ marginTop: 10 }}>Multi‑stage puzzles</h2>
            <p style={{ marginTop: 8 }}>
              Drag‑path stages, wrong‑move distortions, cinematic intros, and combo/heat mechanics for skill‑based progression.
            </p>
          </div>
          <div className="card">
            <span className="pill"><span className="pillDot" style={{ background: "var(--danger)", boxShadow: "0 0 0 5px rgba(255,72,124,0.08)" }} /> 03 • Earn</span>
            <h2 style={{ marginTop: 10 }}>Rewards with real tension</h2>
            <p style={{ marginTop: 8 }}>
              Mine rewards, climb leaderboards, unlock boosts, and trade assets on a strict, on‑chain‑inspired marketplace.
            </p>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 18 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="grid2" style={{ alignItems: "center" }}>
            <div className="stack" style={{ gap: 12 }}>
              <span className="pill"><span className="pillDot" /> Game Loop</span>
              <h2>From curiosity to ownership</h2>
              <p>
                Start playing instantly. When you hit your first milestone, mint a Capsule to unlock progression multipliers and limited routes. The longer you
                stay, the more your identity matters: rarity, streaks, and holder perks shape your path.
              </p>
              <div className="grid2">
                <div className="card" style={{ boxShadow: "none" }}>
                  <strong>Daily Challenge</strong>
                  <p style={{ marginTop: 6 }}>New seed + new puzzle route. Compete for leaderboard rewards.</p>
                </div>
                <div className="card" style={{ boxShadow: "none" }}>
                  <strong>Limited Drops</strong>
                  <p style={{ marginTop: 6 }}>Countdown + supply meter + sold‑out milestones that unlock world events.</p>
                </div>
              </div>
            </div>
            <div className="card" style={{ overflow: "hidden", position: "relative" }}>
              <div
                style={{
                  borderRadius: 18,
                  border: "1px solid rgba(255,255,255,0.10)",
                  background:
                    "radial-gradient(600px 260px at 30% 20%, rgba(0,255,156,0.16), transparent 55%), radial-gradient(600px 280px at 70% 10%, rgba(153,107,255,0.20), transparent 55%), linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03))",
                  padding: 18,
                }}
              >
                <strong>Milestones</strong>
                <p style={{ marginTop: 6 }}>Feel the progress. See the phase. Watch supply move.</p>
                <div className="divider" />
                <div className="stack" style={{ gap: 10 }}>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="muted">25% Sold</span>
                    <span className="pill">New Region Preview</span>
                  </div>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="muted">50% Sold</span>
                    <span className="pill">Special Event</span>
                  </div>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="muted">75% Sold</span>
                    <span className="pill">Partner Drop</span>
                  </div>
                  <div className="row" style={{ justifyContent: "space-between" }}>
                    <span className="muted">100% Sold</span>
                    <span className="pill">Next Phase Unlock</span>
                  </div>
                </div>
                <div className="divider" />
                <div className="row">
                  <Link className="btn btnPrimary" href="/roadmap"><strong>View Roadmap</strong></Link>
                  <Link className="btn" href="/marketplace">Open Marketplace</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container" style={{ paddingTop: 18 }}>
        <div className="grid2" style={{ alignItems: "start" }}>
          <div className="card" style={{ boxShadow: "none" }}>
            <strong>Live activity</strong>
            <p style={{ marginTop: 6 }} className="muted2">
              Social proof that refreshes automatically: mints, token buy intents, and marketplace events.
            </p>
            <div className="divider" />
            <div className="row">
              <Link className="btn btnPrimary" href="/capsules"><strong>Mint Capsules</strong></Link>
              <Link className="btn" href="/characters">Mint Characters</Link>
              <Link className="btn btnGhost" href="/leaderboard">See Leaderboard</Link>
            </div>
          </div>
          <ActivityFeed limit={8} />
        </div>
      </section>

      <section className="container" style={{ paddingTop: 18, paddingBottom: 28 }}>
        <div className="grid2" style={{ alignItems: "start" }}>
          <div className="stack" style={{ gap: 12 }}>
            <span className="pill"><span className="pillDot" /> FAQ</span>
            <h2>Everything you need to start</h2>
            <p>
              You can play without a wallet. Wallet connect is only required for minting, buying, and claiming.
            </p>
            <div className="row">
              <a className="btn btnGhost" href="https://x.com/Ezzitrade" target="_blank" rel="noreferrer">Follow on X</a>
              <a className="btn btnGhost" href="https://discord.gg/mPMzZ6CC" target="_blank" rel="noreferrer">Join Discord</a>
              <a className="btn btnGhost" href="https://t.me/Ezziworld" target="_blank" rel="noreferrer">Join Telegram</a>
            </div>
          </div>
          <FAQ
            items={[
              {
                q: "Can I play without buying anything?",
                a: "Yes. Play instantly with no wallet. Buying unlocks multipliers, limited routes, and holder perks.",
              },
              {
                q: "What are Capsules and Characters?",
                a: "Capsules are limited drops that can reveal higher‑rarity rewards. Characters are your persistent identity with progression multipliers.",
              },
              {
                q: "What is EZZI Coin?",
                a: "EZZI Coin powers progression and rewards. Pricing is managed in phases and can be gated with buy‑only mode for fairness.",
              },
              {
                q: "How does the affiliate boost work?",
                a: "Use a referral to get 10% off plus a 10% token boost. Partners can earn commission per buyer.",
              },
            ]}
          />
        </div>
      </section>
    </main>
  );
}
