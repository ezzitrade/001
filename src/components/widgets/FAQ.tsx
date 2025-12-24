"use client";

import { useState } from "react";

export type FAQItem = { q: string; a: string };

export function FAQ({ items }: { items: FAQItem[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="stack">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <div key={it.q} className="card" style={{ padding: 0, overflow: "hidden" }}>
            <button
              type="button"
              onClick={() => setOpen((p) => (p === idx ? null : idx))}
              className="btn"
              style={{
                width: "100%",
                justifyContent: "space-between",
                border: "none",
                borderRadius: 0,
                background: "transparent",
                padding: "16px 16px",
              }}
            >
              <span style={{ fontWeight: 700 }}>{it.q}</span>
              <span className="mono" style={{ color: "var(--muted)" }}>{isOpen ? "—" : "+"}</span>
            </button>
            {isOpen ? (
              <div style={{ padding: "0 16px 16px 16px" }}>
                <p className="muted">{it.a}</p>
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
