import { ActivityFeed } from "@/components/widgets/ActivityFeed";

export const metadata = { title: "Marketplace" };

const CHAR_SETS = [
  { label: "Common", dir: "common", files: ["Common1.png", "common2.png", "common3.png", "common4.png"] },
  { label: "Rare", dir: "rare", files: ["Rare1.png", "Rare2.png", "Rare3.png", "Rare4.png"] },
  { label: "Epic", dir: "epic", files: ["Epic1.png", "Epic2.png", "Epic3.png", "Epic4.png"] },
  { label: "Legendary", dir: "legendary", files: ["Legendary1.png", "Legendary2.png", "Legendary3.png", "Legendary4.png"] },
];

export default function Marketplace() {
  return (
    <main className="container">
      <div className="grid2" style={{ alignItems: "start" }}>
        <div className="card">
        <h1>Marketplace</h1>
        <p style={{ opacity: 0.8, marginTop: 6 }}>
          Trade characters and items. The trading engine is implemented server-side with strict atomic Redis scripts.
        </p>
        <div className="row" style={{ marginTop: 12 }}>
          <a className="btn" href="/dashboard">Open Dashboard</a>
          <a className="btn" href="/play">Play</a>
        </div>
        </div>
        <ActivityFeed limit={8} title="Live events" />
      </div>

      {CHAR_SETS.map((set) => (
        <section key={set.dir} className="card" style={{ marginTop: 14 }}>
          <div className="row" style={{ alignItems: "center", justifyContent: "space-between" }}>
            <h2 style={{ margin: 0 }}>{set.label} Characters</h2>
            <span className="pill">{set.files.length}</span>
          </div>

          <div className="row" style={{ gap: 10, flexWrap: "wrap", marginTop: 10 }}>
            {set.files.map((f) => {
              const src = `/assets/characters/${set.dir}/${f}`;
              return (
                <div key={src} className="card" style={{ width: 220, padding: 10 }}>
                  <img src={src} alt={f} style={{ width: "100%", borderRadius: 14 }} />
                  <div className="row" style={{ justifyContent: "space-between", marginTop: 8 }}>
                    <span className="pill">{set.label}</span>
                    <small style={{ opacity: 0.75 }}>{f.replace(".png", "")}</small>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ))}

      <section className="card" style={{ marginTop: 14 }}>
        <h2 style={{ marginTop: 0 }}>How trading works</h2>
        <ul style={{ marginTop: 10 }}>
          <li>Listings are created server-side and stored in KV/Redis.</li>
          <li>Buying is strict atomic: a listing can only be consumed once.</li>
          <li>Admin tools exist for audit, rollback, and economy freeze (emergencies).</li>
        </ul>
      </section>
    </main>
  );
}
