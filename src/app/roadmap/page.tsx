import Link from "next/link";

export const metadata = {
  title: "Roadmap",
  description: "EZZI World roadmap: Genesis drop, full progression, seasons, partners, and economy hardening.",
};

const PHASES = [
  {
    tag: "Phase 0",
    title: "Genesis Launch",
    points: [
      "AAA landing + conversion widgets (supply, countdown, phase pricing)",
      "Playable demo (/play) + persistence + leaderboard + marketplace",
      "Affiliate + referral boosts (10% off + 10% boost)",
      "Buy‑only safety mode configurable",
    ],
  },
  {
    tag: "Phase 1",
    title: "Full Progression",
    points: [
      "Quest log + milestones + streak system",
      "Daily challenge seed + reward schedule",
      "Holder perks: multipliers + limited routes + badges",
      "Anti‑abuse validation for runs + leaderboard",
    ],
  },
  {
    tag: "Phase 2",
    title: "Seasons & Events",
    points: [
      "Weekly seasons + resets + reward distribution",
      "Limited drops + sold‑out milestones unlock events",
      "Share cards + viral loops",
      "Expanded content packs (regions, puzzles, characters)",
    ],
  },
  {
    tag: "Phase 3",
    title: "Scale & Partners",
    points: [
      "Partner dashboards + UTM tracking",
      "Liquidity tools + buy‑only toggle policies",
      "Market hardening (atomic ops, audit logs)",
      "Performance budgets + telemetry",
    ],
  },
];

export default function RoadmapPage() {
  return (
    <main>
      <section className="container" style={{ paddingTop: 28 }}>
        <div className="cardGlass" style={{ position: "relative", overflow: "hidden" }}>
          <div className="glow" />
          <div className="stack" style={{ gap: 14 }}>
            <div className="stack" style={{ gap: 6 }}>
              <span className="pill"><span className="pillDot" /> Execution roadmap</span>
              <h1 style={{ fontSize: "clamp(34px, 3.6vw, 52px)" }}>Roadmap</h1>
              <p>Designed for conversion, retention, and economy stability.</p>
            </div>

            <div className="grid2" style={{ alignItems: "start" }}>
              {PHASES.map((p) => (
                <div key={p.tag} className="card" style={{ boxShadow: "none" }}>
                  <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                    <span className="pill"><span className="pillDot" /> {p.tag}</span>
                    <span className="pill" style={{ borderColor: "rgba(255,255,255,0.14)" }}>In progress</span>
                  </div>
                  <h2 style={{ marginTop: 12 }}>{p.title}</h2>
                  <ul className="muted" style={{ margin: "10px 0 0 0", paddingLeft: 18, lineHeight: 1.8 }}>
                    {p.points.map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="card" style={{ boxShadow: "none", borderColor: "rgba(0,255,156,0.18)" }}>
              <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
                <div className="stack" style={{ gap: 4 }}>
                  <strong>Ready to dive in?</strong>
                  <small className="muted2">Play the demo, then explore Capsules & Characters.</small>
                </div>
                <div className="row">
                  <Link className="btn btnPrimary" href="/play"><strong>▶ Play</strong></Link>
                  <Link className="btn" href="/capsules">Capsules</Link>
                  <Link className="btn btnGhost" href="/characters">Characters</Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
