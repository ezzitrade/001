export type EngineHandle = { destroy: () => void };

import { getSession } from "./runtime/session";

type RegionId = "mystic" | "crystal" | "inferno" | "neon" | "shadow";

type RegionDef = {
  id: RegionId;
  name: string;
  // preview image for the universe map
  preview: string;
  // 2.5D tile images
  tiles: { key: string; src: string }[];
};

const REGIONS: RegionDef[] = [
  {
    id: "mystic",
    name: "Mystic Mountains",
    preview: "/assets/maps/mystic-mountains/nc.png",
    tiles: [
      { key: "nw", src: "/assets/maps/mystic-mountains/nw.png" },
      { key: "nc", src: "/assets/maps/mystic-mountains/nc.png" },
      { key: "ne", src: "/assets/maps/mystic-mountains/ne.png" },
      { key: "east", src: "/assets/maps/mystic-mountains/east.png" }
    ]
  },
  {
    id: "crystal",
    name: "Crystal Canyon",
    preview: "/assets/maps/crystal-canyon/nc.png",
    tiles: [
      { key: "nw", src: "/assets/maps/crystal-canyon/nw.png" },
      { key: "nc", src: "/assets/maps/crystal-canyon/nc.png" },
      { key: "ne", src: "/assets/maps/crystal-canyon/ne.png" },
      { key: "east", src: "/assets/maps/crystal-canyon/east.png" }
    ]
  },
  {
    id: "inferno",
    name: "Inferno Isle",
    preview: "/assets/maps/inferno-isle/nc.png",
    tiles: [
      { key: "nw", src: "/assets/maps/inferno-isle/nw.png" },
      { key: "nc", src: "/assets/maps/inferno-isle/nc.png" },
      { key: "ne", src: "/assets/maps/inferno-isle/ne.png" },
      { key: "east", src: "/assets/maps/inferno-isle/east.png" }
    ]
  },
  {
    id: "neon",
    name: "Neon Nexus",
    preview: "/assets/maps/neon-nexus/nc.png",
    tiles: [
      { key: "nw", src: "/assets/maps/neon-nexus/nw.png" },
      { key: "nc", src: "/assets/maps/neon-nexus/nc.png" },
      { key: "ne", src: "/assets/maps/neon-nexus/ne.png" },
      { key: "east", src: "/assets/maps/neon-nexus/east.png" }
    ]
  },
  {
    id: "shadow",
    name: "Shadow Sanctum",
    preview: "/assets/maps/shadow-sanctum/ce.png",
    tiles: [
      { key: "west", src: "/assets/maps/shadow-sanctum/west.png" },
      { key: "cw", src: "/assets/maps/shadow-sanctum/cw.png" },
      { key: "ce", src: "/assets/maps/shadow-sanctum/ce.png" },
      { key: "east", src: "/assets/maps/shadow-sanctum/east.png" }
    ]
  }
];

const CHARACTER_PREVIEWS: string[] = [
  "/assets/characters/common/Common1.png",
  "/assets/characters/rare/Rare1.png",
  "/assets/characters/epic/Epic1.png",
  "/assets/characters/legendary/Legendary1.png"
];

async function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error(`failed_image:${src}`));
    img.src = src;
  });
}

class ImgCache {
  private map = new Map<string, Promise<HTMLImageElement>>();
  get(src: string) {
    let p = this.map.get(src);
    if (!p) {
      p = loadImage(src);
      this.map.set(src, p);
    }
    return p;
  }
}

function resizeCanvas(canvas: HTMLCanvasElement, maxDpr = 2) {
  const rect = canvas.getBoundingClientRect();
  const dpr = Math.min(maxDpr, window.devicePixelRatio || 1);
  const w = Math.max(1, Math.floor(rect.width * dpr));
  const h = Math.max(1, Math.floor(rect.height * dpr));
  const changed = canvas.width !== w || canvas.height !== h;
  if (changed) {
    canvas.width = w;
    canvas.height = h;
  }
  return { dpr, changed };
}

export function bootEngine(opts: { canvas: HTMLCanvasElement; debug?: boolean }): EngineHandle {
  const { canvas, debug } = opts;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("2d ctx missing");

  let raf = 0;
  let alive = true;
  const session = getSession();

  const cache = new ImgCache();

  // preload critical assets (fire and forget)
  for (const r of REGIONS) {
    cache.get(r.preview).catch(() => {});
    for (const t of r.tiles) cache.get(t.src).catch(() => {});
  }
  for (const c of CHARACTER_PREVIEWS) cache.get(c).catch(() => {});

  const state = {
    view: "universe" as "universe" | "region" | "mining" | "economy" | "puzzle",
    regionId: "mystic" as RegionId,
    msg: "",
    // simple player position inside a region (0..1 normalized)
    px: 0.25,
    py: 0.65
  };

  const toLocal = (e: PointerEvent) => {
    const rect = canvas.getBoundingClientRect();
    return { x: e.clientX - rect.left, y: e.clientY - rect.top };
  };

  canvas.style.touchAction = "none";

  const onPointerDown = (e: PointerEvent) => {
    const p = toLocal(e);
    const cssW = canvas.getBoundingClientRect().width;
    const cssH = canvas.getBoundingClientRect().height;

    // top bar quick modes
    if (p.y < 72) {
      if (p.x < cssW / 3) state.view = "puzzle";
      else if (p.x < (2 * cssW) / 3) state.view = "mining";
      else state.view = "economy";
      return;
    }

    // back button area
    if (p.x < 110 && p.y < 130) {
      if (state.view === "region") state.view = "universe";
      else state.view = "universe";
      return;
    }

    if (state.view === "universe") {
      // region cards grid
      const cards = layoutUniverseCards(cssW, cssH);
      const hit = cards.find((c) => p.x >= c.x && p.x <= c.x + c.w && p.y >= c.y && p.y <= c.y + c.h);
      if (hit) {
        state.regionId = hit.region.id;
        state.view = "region";
        // reset player position a bit differently per region for variety
        state.px = 0.25 + (hit.index % 3) * 0.12;
        state.py = 0.65;
      }
      return;
    }

    if (state.view === "region") {
      // click to move (normalized)
      const margin = 16;
      const header = 140;
      const x0 = margin;
      const y0 = header;
      const w = cssW - margin * 2;
      const h = cssH - header - margin;
      if (p.x >= x0 && p.x <= x0 + w && p.y >= y0 && p.y <= y0 + h) {
        state.px = (p.x - x0) / w;
        state.py = (p.y - y0) / h;
      }
      return;
    }

    // in modes, tap anywhere returns to current map
    if (state.view === "puzzle" || state.view === "mining" || state.view === "economy") {
      state.view = "universe";
    }
  };

  canvas.addEventListener("pointerdown", onPointerDown);

  const drawUniverse = () => {
    const { coins } = session.player;
    drawHeader("EZZI WORLD", `Coins: ${coins}  |  Tap top bar: Puzzle / Mining / Economy  |  Click a region to enter`);
    drawHotspotBoxes();
    drawUniverseCards();
    drawHint("Click any region card to enter. In region view: click to move your character.");
  };

  const drawRegion = () => {
    const r = REGIONS.find((x) => x.id === state.regionId) ?? REGIONS[0];
    const { coins } = session.player;
    drawHeader(r.name.toUpperCase(), `Coins: ${coins}  |  Click map to move  |  Top bar: modes  |  Back: top-left`);
    drawHotspotBoxes();
    drawRegionTiles(r);
    drawCharacterSprite();
    drawHint("Region: click to move. This is a visual 2.5D map preview integrated with your assets.");
  };

  const drawPuzzle = () => {
    const boostPct = Math.max(0, Number(session.player.perks?.tokenBoostPct ?? 0));
    const base = 10;
    const reward = Math.max(1, Math.round(base * (1 + boostPct / 100)));
    drawHeader("PUZZLE", `Tap anywhere to earn +${base} coins (demo). Holder boost applies. Tap below header to go back.`);
    session.player.coins += reward;
    state.msg = boostPct > 0 ? `Puzzle demo reward: +${reward} coins (includes +${boostPct}% holder boost)` : `Puzzle demo reward: +${reward} coins`;
    drawMsg();
  };

  const drawMining = () => {
    const boostPct = Math.max(0, Number(session.player.perks?.tokenBoostPct ?? 0));
    const base = 5;
    const reward = Math.max(1, Math.round(base * (1 + boostPct / 100)));
    drawHeader("MINING", `Tap anywhere to add ore_common x1 and +${base} coins (demo). Holder boost applies. Tap below header to go back.`);
    const it = session.player.inventory.ore_common ?? { id: "ore_common", name: "Stone Ore", rarity: "common", qty: 0 };
    it.qty += 1;
    session.player.inventory.ore_common = it;
    session.player.coins += reward;
    state.msg = boostPct > 0 ? `Mining demo: ore_common +1, coins +${reward} (includes +${boostPct}% holder boost)` : `Mining demo: ore_common +1, coins +${reward}`;
    drawMsg();
  };

  const drawEconomy = () => {
    drawHeader("ECONOMY", "Tap anywhere to consume cap_basic if you have it (demo) and grant ore_rare x1.");
    const cap = session.player.inventory.cap_basic;
    if (cap && cap.qty > 0) {
      cap.qty -= 1;
      if (cap.qty <= 0) delete session.player.inventory.cap_basic;
      const ore = session.player.inventory.ore_rare ?? { id: "ore_rare", name: "Amber Ore", rarity: "rare", qty: 0 };
      ore.qty += 1;
      session.player.inventory.ore_rare = ore;
      state.msg = "Opened Basic Capsule demo: ore_rare +1";
    } else {
      state.msg = "No Basic Capsule left";
    }
    drawMsg();
  };

  const drawHeader = (title: string, sub: string) => {
    const cssW = canvas.getBoundingClientRect().width;
    const cssH = canvas.getBoundingClientRect().height;
    ctx.save();
    ctx.fillStyle = "#0b0b0f";
    ctx.fillRect(0, 0, cssW, cssH);
    ctx.fillStyle = "rgba(255,255,255,0.92)";
    ctx.font = "18px system-ui";
    ctx.fillText(title, 16, 28);
    ctx.fillStyle = "rgba(255,255,255,0.65)";
    ctx.font = "13px system-ui";
    ctx.fillText(sub, 16, 52);
    // top bar
    ctx.strokeStyle = "rgba(255,255,255,0.12)";
    ctx.beginPath();
    ctx.moveTo(0, 70);
    ctx.lineTo(cssW, 70);
    ctx.stroke();
    // back button
    ctx.fillStyle = "rgba(255,255,255,0.08)";
    ctx.fillRect(12, 80, 92, 34);
    ctx.strokeStyle = "rgba(255,255,255,0.16)";
    ctx.strokeRect(12, 80, 92, 34);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "13px system-ui";
    ctx.fillText("← Back", 28, 102);
    ctx.restore();
  };

  const drawHotspotBoxes = () => {
    const w = canvas.getBoundingClientRect().width;
    ctx.save();
    const boxY = 76;
    const boxH = 40;
    const labels = ["Puzzle", "Mining", "Economy"];
    for (let i = 0; i < 3; i++) {
      const x = (w / 3) * i + 10;
      const bw = w / 3 - 20;
      ctx.fillStyle = "rgba(255,255,255,0.06)";
      ctx.fillRect(x, boxY, bw, boxH);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.strokeRect(x, boxY, bw, boxH);
      ctx.fillStyle = "rgba(0,255,156,0.85)";
      ctx.font = "14px system-ui";
      ctx.fillText(labels[i], x + 12, boxY + 25);
    }
    ctx.restore();
  };

  const drawHint = (text: string) => {
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(0, h - 42, w, 42);
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "12px system-ui";
    ctx.fillText(text, 16, h - 18);
    ctx.restore();
  };

  const layoutUniverseCards = (cssW: number, cssH: number) => {
    const margin = 16;
    const top = 140;
    const cols = cssW < 820 ? 2 : 3;
    const gap = 14;
    const cardW = Math.floor((cssW - margin * 2 - gap * (cols - 1)) / cols);
    const cardH = 150;
    const cards: { x: number; y: number; w: number; h: number; region: RegionDef; index: number }[] = [];
    for (let i = 0; i < REGIONS.length; i++) {
      const row = Math.floor(i / cols);
      const col = i % cols;
      const x = margin + col * (cardW + gap);
      const y = top + row * (cardH + gap);
      cards.push({ x, y, w: cardW, h: cardH, region: REGIONS[i], index: i });
    }
    return cards;
  };

  const drawUniverseCards = () => {
    const cssW = canvas.getBoundingClientRect().width;
    const cssH = canvas.getBoundingClientRect().height;
    const cards = layoutUniverseCards(cssW, cssH);
    ctx.save();
    for (const c of cards) {
      // card bg
      ctx.fillStyle = "rgba(255,255,255,0.05)";
      ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle = "rgba(255,255,255,0.12)";
      ctx.strokeRect(c.x, c.y, c.w, c.h);

      // preview image
      const pad = 8;
      const imgX = c.x + pad;
      const imgY = c.y + pad;
      const imgW = c.w - pad * 2;
      const imgH = c.h - 54;
      // async image draw (non-blocking)
      cache
        .get(c.region.preview)
        .then((img) => {
          if (!alive) return;
          ctx.save();
          ctx.globalAlpha = 0.92;
          ctx.drawImage(img, imgX, imgY, imgW, imgH);
          ctx.restore();
        })
        .catch(() => {});

      // label
      ctx.fillStyle = "rgba(255,255,255,0.9)";
      ctx.font = "14px system-ui";
      ctx.fillText(c.region.name, c.x + 12, c.y + c.h - 18);
      ctx.fillStyle = "rgba(0,255,156,0.75)";
      ctx.font = "12px system-ui";
      ctx.fillText("Enter →", c.x + c.w - 64, c.y + c.h - 18);
    }
    ctx.restore();
  };

  const drawRegionTiles = (r: RegionDef) => {
    const cssW = canvas.getBoundingClientRect().width;
    const cssH = canvas.getBoundingClientRect().height;
    const margin = 16;
    const header = 140;
    const x0 = margin;
    const y0 = header;
    const w = cssW - margin * 2;
    const h = cssH - header - margin;
    // 4 tiles across top row
    const tileW = w / 4;
    const tileH = h;

    // draw subtle depth shadow
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(x0 + 6, y0 + 10, w, h);
    ctx.restore();

    for (let i = 0; i < r.tiles.length; i++) {
      const t = r.tiles[i];
      const tx = x0 + i * tileW;
      const ty = y0;
      cache
        .get(t.src)
        .then((img) => {
          if (!alive) return;
          ctx.save();
          // fake depth: slight vertical offset per tile
          const yOff = i * 1.5;
          ctx.drawImage(img, tx, ty + yOff, tileW, tileH);
          ctx.restore();
        })
        .catch(() => {});

      // tile borders
      ctx.save();
      ctx.strokeStyle = "rgba(255,255,255,0.08)";
      ctx.strokeRect(tx, ty, tileW, tileH);
      ctx.restore();
    }
  };

  const drawCharacterSprite = () => {
    const cssW = canvas.getBoundingClientRect().width;
    const cssH = canvas.getBoundingClientRect().height;
    const margin = 16;
    const header = 140;
    const x0 = margin;
    const y0 = header;
    const w = cssW - margin * 2;
    const h = cssH - header - margin;

    const px = x0 + state.px * w;
    const py = y0 + state.py * h;

    // pick a sprite based on activeCharacterId if available, else cycle
    const idx = (session.player.activeCharacterId ? 2 : 0) + (Math.floor(session.player.coins / 100) % 4);
    const sprite = CHARACTER_PREVIEWS[Math.abs(idx) % CHARACTER_PREVIEWS.length];

    cache
      .get(sprite)
      .then((img) => {
        if (!alive) return;
        const size = 84;
        ctx.save();
        // shadow
        ctx.fillStyle = "rgba(0,0,0,0.35)";
        ctx.beginPath();
        ctx.ellipse(px, py + 24, 22, 10, 0, 0, Math.PI * 2);
        ctx.fill();
        // sprite
        ctx.drawImage(img, px - size / 2, py - size / 2, size, size);
        ctx.restore();
      })
      .catch(() => {});
  };

  const drawMsg = () => {
    const w = canvas.getBoundingClientRect().width;
    const h = canvas.getBoundingClientRect().height;
    ctx.save();
    ctx.fillStyle = "rgba(0,0,0,0.55)";
    ctx.fillRect(0, h - 60, w, 60);
    ctx.fillStyle = "rgba(0,255,156,0.9)";
    ctx.font = "14px system-ui";
    ctx.fillText(state.msg, 16, h - 26);
    ctx.restore();
  };

  const frame = () => {
    if (!alive) return;
    const { dpr, changed } = resizeCanvas(canvas, 2);
    if (changed) {
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
      if (debug) console.log("canvas resized", dpr);
    }

    if (state.view === "universe") drawUniverse();
    if (state.view === "region") drawRegion();
    if (state.view === "puzzle") drawPuzzle();
    if (state.view === "mining") drawMining();
    if (state.view === "economy") drawEconomy();

    raf = requestAnimationFrame(frame);
  };

  raf = requestAnimationFrame(frame);

  return {
    destroy: () => {
      alive = false;
      cancelAnimationFrame(raf);
      canvas.removeEventListener("pointerdown", onPointerDown);
    }
  };
}
