export function SupplyMeter({
  label,
  sold,
  total,
}: {
  label: string;
  sold: number;
  total: number;
}) {
  const pct = total > 0 ? Math.min(100, (sold / total) * 100) : 0;
  return (
    <div className="stack" style={{ gap: 8 }}>
      <div style={{ display: "flex", justifyContent: "space-between", gap: 10, flexWrap: "wrap" }}>
        <strong style={{ fontSize: 14 }}>{label}</strong>
        <small className="muted2">
          {sold.toLocaleString()} / {total.toLocaleString()}
        </small>
      </div>
      <div
        style={{
          height: 10,
          borderRadius: 999,
          border: "1px solid var(--border2)",
          background: "rgba(255,255,255,0.04)",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "100%",
            width: `${pct}%`,
            background:
              "linear-gradient(90deg, rgba(0,255,156,0.75), rgba(153,107,255,0.75), rgba(255,72,124,0.65))",
          }}
        />
      </div>
    </div>
  );
}
