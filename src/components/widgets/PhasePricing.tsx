export function PhasePricing({
  phaseName,
  priceUsd,
  targetUsd,
}: {
  phaseName: string;
  priceUsd: number;
  targetUsd: number;
}) {
  const up = Math.max(0, targetUsd - priceUsd);
  const multiple = priceUsd > 0 ? targetUsd / priceUsd : 0;
  return (
    <div className="pill" style={{ alignItems: "center" }}>
      <span className="pillDot" style={{ background: "var(--accent2)", boxShadow: "0 0 0 5px rgba(153,107,255,0.08)" }} />
      <span style={{ display: "inline-flex", gap: 10, alignItems: "baseline", flexWrap: "wrap" }}>
        <strong style={{ color: "var(--text)" }}>{phaseName}</strong>
        <span className="mono" style={{ color: "var(--muted)" }}>
          EZZI = ${priceUsd.toFixed(3)}
        </span>
        <small className="muted2">
          target ${targetUsd.toFixed(2)} • Δ ${up.toFixed(3)} • {multiple.toFixed(1)}×
        </small>
      </span>
    </div>
  );
}
