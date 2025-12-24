import Link from "next/link";

const SOCIAL = {
  x: "https://x.com/Ezzitrade",
  discord: "https://discord.gg/mPMzZ6CC",
  telegram: "https://t.me/Ezziworld",
};

export function SiteFooter() {
  return (
    <footer style={{ borderTop: "1px solid var(--border2)", marginTop: 30 }}>
      <div className="container">
        <div className="grid4" style={{ gap: 16 }}>
          <div className="stack">
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <img src="/brand/logo.png" alt="EZZI" width={36} height={36} style={{ borderRadius: 12 }} />
              <strong>EZZI World</strong>
            </div>
            <p className="muted" style={{ marginTop: 6 }}>
              A next‑gen 2.5D world built for community‑driven progression.
            </p>
            <div className="row" style={{ marginTop: 8 }}>
              <a className="btn btnGhost" href={SOCIAL.x} target="_blank" rel="noreferrer">X</a>
              <a className="btn btnGhost" href={SOCIAL.discord} target="_blank" rel="noreferrer">Discord</a>
              <a className="btn btnGhost" href={SOCIAL.telegram} target="_blank" rel="noreferrer">Telegram</a>
            </div>
          </div>

          <div className="stack">
            <strong>Product</strong>
            <Link href="/play" className="muted">Play</Link>
            <Link href="/marketplace" className="muted">Marketplace</Link>
            <Link href="/leaderboard" className="muted">Leaderboard</Link>
            <Link href="/capsules" className="muted">Capsules</Link>
            <Link href="/characters" className="muted">Characters</Link>
          </div>

          <div className="stack">
            <strong>Learn</strong>
            <Link href="/docs" className="muted">Docs</Link>
            <Link href="/roadmap" className="muted">Roadmap</Link>
            <Link href="/devlog" className="muted">Devlog</Link>
            <Link href="/calculator" className="muted">Revenue Calculator</Link>
          </div>

          <div className="stack">
            <strong>Legal</strong>
            <Link href="/terms" className="muted">Terms</Link>
            <Link href="/privacy" className="muted">Privacy</Link>
            <a href="/api/health" className="muted">Health</a>
            <small className="muted2" style={{ marginTop: 8, lineHeight: 1.5 }}>
              EZZI World is an entertainment product. Nothing on this site is financial advice.
            </small>
          </div>
        </div>

        <div className="divider" />

        <div style={{ display: "flex", justifyContent: "space-between", gap: 14, flexWrap: "wrap" }}>
          <small>© {new Date().getFullYear()} EZZI World</small>
          <small className="muted2">Built with Next.js • Deployable on Vercel</small>
        </div>
      </div>
    </footer>
  );
}
