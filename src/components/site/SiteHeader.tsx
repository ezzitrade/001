import Link from "next/link";
import { WalletButton } from "@/components/wallet/WalletButton";

const SOCIAL = {
  x: "https://x.com/Ezzitrade",
  discord: "https://discord.gg/mPMzZ6CC",
  telegram: "https://t.me/Ezziworld",
};

export function SiteHeader() {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        backdropFilter: "blur(14px)",
        background: "rgba(7, 8, 18, 0.55)",
        borderBottom: "1px solid var(--border2)",
      }}
    >
      <div className="container" style={{ display: "flex", alignItems: "center", gap: 14, flexWrap: "wrap" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <img src="/brand/logo.png" alt="EZZI" width={38} height={38} style={{ borderRadius: 12, boxShadow: "var(--shadow2)" }} />
          <div style={{ display: "grid", lineHeight: 1.05 }}>
            <strong style={{ letterSpacing: "-0.02em" }}>EZZI World</strong>
            <small className="muted2">Explore • Mine • Solve • Evolve</small>
          </div>
        </Link>

        <nav className="row" style={{ marginLeft: "auto", alignItems: "center" }}>
          <Link className="btn btnGhost" href="/capsules">Capsules</Link>
          <Link className="btn btnGhost" href="/characters">Characters</Link>
          <Link className="btn btnGhost" href="/marketplace">Marketplace</Link>
          <Link className="btn btnGhost" href="/buy">Buy EZZI</Link>
          <Link className="btn btnGhost" href="/account">Account</Link>
          <Link className="btn btnGhost" href="/roadmap">Roadmap</Link>
          <Link className="btn btnGhost" href="/docs">Docs</Link>

          <a className="btn btnGhost" href={SOCIAL.x} target="_blank" rel="noreferrer">X</a>
          <a className="btn btnGhost" href={SOCIAL.discord} target="_blank" rel="noreferrer">Discord</a>
          <a className="btn btnGhost" href={SOCIAL.telegram} target="_blank" rel="noreferrer">Telegram</a>

          <WalletButton />

          <Link className="btn btnPrimary" href="/play" style={{ paddingInline: 16 }}>
            <strong>▶ Play</strong>
          </Link>
        </nav>
      </div>
    </header>
  );
}
