import Link from "next/link";
import { getEzziConfig } from "@/lib/config";
import { SupplyMeter } from "@/components/widgets/SupplyMeter";
import { MintTierCard } from "@/components/mint/MintTierCard";

export const metadata = {
  title: "Capsules",
  description: "Mint limited Capsules to unlock boosts, rarity chances, and early‑phase advantages.",
};

const TIERS = [
  { name: "Common", price: 23, add: 0, note: "Entry capsule. Solid odds." },
  { name: "Rare", price: 29, add: 6, note: "Better odds + extra boosts." },
  { name: "Epic", price: 35, add: 12, note: "High tension, higher reward ceilings." },
  { name: "Legendary", price: 41, add: 18, note: "Limited. Maximum early advantage." },
];

export default async function CapsulesPage() {
  const cfg = await getEzziConfig();

  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 12 }}>
              <span className="pill"><span className="pillDot" /> Limited Drop</span>
              <h1>Capsules</h1>
              <p>
                Capsules are limited‑supply drops that unlock progression multipliers and chances at higher rarity outcomes.
                Minting early is about securing phase advantage — not just collecting items.
              </p>
              <div className="row">
                <Link className="btn btnPrimary" href="/play"><strong>▶ Play First</strong></Link>
                <Link className="btn" href="/marketplace">View Marketplace</Link>
                <a className="btn btnGhost" href="https://discord.gg/mPMzZ6CC" target="_blank" rel="noreferrer">Get a Referral</a>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Genesis Supply</strong>
                <p style={{ marginTop: 6 }}>Supply never increases. Watch the meter move — milestone events unlock at 25/50/75/100% sold.</p>
                <div className="divider" />
                <SupplyMeter label="Capsules" sold={cfg.supply.capsulesSold} total={cfg.supply.capsulesTotal} />
              </div>
            </div>

            <div className="stack" style={{ gap: 12 }}>
              <div className="card">
                <strong>Pricing (psychological ramp)</strong>
                <p style={{ marginTop: 6 }}>Starts at $23. +$6 per tier. Higher tiers are limited.</p>
                <div className="divider" />
                <div className="stack">
                  {TIERS.map((t) => (
                    <MintTierCard
                      key={t.name}
                      kind="capsule"
                      tier={t.name.toLowerCase() as any}
                      priceUsd={t.price}
                      note={`${t.note} Tier +$${t.add}.`}
                    />
                  ))}
                </div>
              </div>

              <div className="card" style={{ borderColor: "rgba(153,107,255,0.22)" }}>
                <strong>Early Holder Perks</strong>
                <p style={{ marginTop: 6 }}>
                  Holders unlock: higher multipliers, drop priority, holder badge in leaderboards, and access to limited routes.
                </p>
                <div className="row" style={{ marginTop: 10 }}>
                  <Link className="btn btnGhost" href="/docs">How it works</Link>
                  <Link className="btn" href="/roadmap">See roadmap</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
