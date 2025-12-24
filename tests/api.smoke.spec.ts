import { test, expect } from "@playwright/test";

function simpleHash(str: string): string {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24);
  }
  return (h >>> 0).toString(16);
}

test("health + player state roundtrip", async ({ request }) => {
  const h = await request.get("/api/health");
  expect(h.ok()).toBeTruthy();

  const g1 = await request.get("/api/player/state");
  expect(g1.ok()).toBeTruthy();
  const j1 = await g1.json();
  expect(j1.playerId).toBeTruthy();

  const p = await request.post("/api/player/state", { data: { hello: "world" } });
  expect(p.ok()).toBeTruthy();

  const g2 = await request.get("/api/player/state");
  const j2 = await g2.json();
  expect(j2.state).toBeTruthy();
});

test("seed single-use + digest verification", async ({ request }) => {
  const s = await request.post("/api/seed");
  expect(s.ok()).toBeTruthy();
  const { seed } = await s.json();

  const payload = {
    runId: "run_test_1",
    kind: "puzzle_s1",
    seed,
    inputs: { moves: [1, 2, 3] },
    outputs: { score: 1234 }
  };
  const digest = simpleHash(seed + JSON.stringify(payload.inputs) + JSON.stringify(payload.outputs));

  const ok = await request.post("/api/runs/submit", { data: { ...payload, digest } });
  expect(ok.ok()).toBeTruthy();

  const reuse = await request.post("/api/runs/submit", { data: { ...payload, runId: "run_test_2", digest } });
  expect(reuse.ok()).toBeFalsy();
  expect(reuse.status()).toBe(400);

  const s2 = await request.post("/api/seed");
  const { seed: seed2 } = await s2.json();

  const bad = await request.post("/api/runs/submit", {
    data: { runId: "run_bad", kind: "puzzle_s1", seed: seed2, inputs: { a: 1 }, outputs: { b: 2 }, digest: "deadbeef" }
  });
  expect(bad.ok()).toBeFalsy();
  expect(bad.status()).toBe(400);
});

test("market listing + atomic buy", async ({ request, browser }) => {
  const create = await request.post("/api/market/listings", { data: { itemId: "ore_common", qty: 1, priceAmount: 10 } });
  expect(create.ok()).toBeTruthy();
  const { listing } = await create.json();
  expect(listing?.listingId).toBeTruthy();

  const ctx1 = await browser.newContext();
  const ctx2 = await browser.newContext();

  // Race two buys
  const r1 = await ctx1.request.post("/api/market/buy", { data: { listingId: listing.listingId } });
  const r2 = await ctx2.request.post("/api/market/buy", { data: { listingId: listing.listingId } });

  const okCount = [r1.ok(), r2.ok()].filter(Boolean).length;
  expect(okCount).toBe(1);

  const fail = r1.ok() ? r2 : r1;
  expect([409, 400]).toContain(fail.status());

  await ctx1.close();
  await ctx2.close();
});
