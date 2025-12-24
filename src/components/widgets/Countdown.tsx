"use client";

import { useEffect, useMemo, useState } from "react";

function fmt(n: number) {
  return String(Math.max(0, Math.floor(n))).padStart(2, "0");
}

export function Countdown({ toIso }: { toIso: string }) {
  const target = useMemo(() => new Date(toIso).getTime(), [toIso]);
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const diff = Math.max(0, target - now);
  const s = Math.floor(diff / 1000);
  const d = Math.floor(s / 86400);
  const h = Math.floor((s % 86400) / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;

  return (
    <div className="pill" aria-label="Countdown">
      <span className="pillDot" />
      <span style={{ display: "inline-flex", gap: 8, alignItems: "baseline" }}>
        <strong style={{ color: "var(--text)" }}>Next Drop</strong>
        <span className="mono" style={{ color: "var(--muted)" }}>
          {d}d {fmt(h)}:{fmt(m)}:{fmt(ss)}
        </span>
      </span>
    </div>
  );
}
