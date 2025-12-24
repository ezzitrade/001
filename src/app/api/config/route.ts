import { NextResponse } from "next/server";
import { getEzziConfig } from "@/lib/config";

export const runtime = "nodejs";

export async function GET() {
  const cfg = await getEzziConfig();
  return NextResponse.json(cfg, {
    headers: {
      "cache-control": "no-store",
    },
  });
}
