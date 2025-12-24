import Link from "next/link";

import { getEzziConfig } from "@/lib/config";
import { SupplyMeter } from "@/components/widgets/SupplyMeter";
import { MintTierCard } from "@/components/mint/MintTierCard";

export const metadata = {
  title: "Characters",
  description: "Collect Characters across 4 rarity tiers. Your identity, multipliers, and status in EZZI World.",
};

const TIERS = [
  { name: "Common", price: 23, add: 0, perk: "Base identity + starter multipliers." },
  { name: "Rare", price: 31, add: 8, perk: "Higher multipliers + better route access." },
  { name: "Epic", price: 39, add: 16, perk: "Prestige badge + stronger boosts." },
  { name: "Legendary", price: 47, add: 24, perk: "Maximum status + holder perks." },
];

export default async function CharactersPage() {
  const cfg = await getEzziConfig();

  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="grid2" style={{ alignItems: "start" }}>
            <div className="stack" style={{ gap: 12 }}>
              <span className="pill"><span className="pillDot" style={{ background: "var(--accent2)", boxShadow: "0 0 0 5px rgba(153,107,255,0.08)" }} /> Persistent Identity</span>
              <h1>Characters</h1>
              <p>
                Characters are your persistent identity in EZZI World — multipliers, status badges, and progression perks that show up in leaderboards.
                You&apos;re not just a player. You&apos;re a holder.
              </p>
              <div className="row">
                <Link className="btn btnPrimary" href="/leaderboard"><strong>View Leaderboards</strong></Link>
                <Link className="btn" href="/play">Play Now</Link>
                <a className="btn btnGhost" href="https://t.me/Ezziworld" target="_blank" rel="noreferrer">Join Telegram</a>
              </div>
              <div className="card" style={{ boxShadow: "none" }}>
                <strong>Genesis Supply</strong>
                <p style={{ marginTop: 6 }}>
                  Only 2,300 Characters exist in Genesis. Supply never increases — tiers shape both utility and social status.
                </p>
                <div className="divider" />
                <SupplyMeter label="Characters" sold={cfg.supply.charactersSold} total={cfg.supply.charactersTotal} />
              </div>
            </div>

            <div className="stack" style={{ gap: 12 }}>
              <div className="card">
                <strong>Pricing (tier anchor)</strong>
                <p style={{ marginTop: 6 }}>Starts at $23. +$8 per tier. Higher tiers are limited.</p>
                <div className="divider" />
                <div className="stack">
                  {TIERS.map((t) => (
                    <MintTierCard
                      key={t.name}
                      kind="character"
                      tier={t.name.toLowerCase() as any}
                      priceUsd={t.price}
                      note={`${t.perk} Tier +$${t.add}.`}
                    />
                  ))}
                </div>
              </div>

              <div className="card" style={{ borderColor: "rgba(0,255,156,0.20)" }}>
                <strong>Holder Psychology</strong>
                <p style={{ marginTop: 6 }}>
                  We surface your edge: phase badge, portfolio panel, streaks, and milestone unlocks. You feel like an early investor — not a customer.
                </p>
                <div className="row" style={{ marginTop: 10 }}>
                  <Link className="btn btnGhost" href="/docs">Read the docs</Link>
                  <Link className="btn" href="/calculator">Revenue calculator</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
