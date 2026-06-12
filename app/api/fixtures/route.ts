import { NextResponse } from "next/server";
import { getAllMatches } from "../../lib/matches";

export const revalidate = 300; // 5-minute ISR cache

export async function GET() {
    console.log("KEY:", process.env.API_FOOTBALL_KEY ? "✓ found" : "✗ MISSING");
    try {
      const fixtures = await getAllMatches();
      return NextResponse.json(fixtures);
    } catch (error) {
      console.error("Fixtures error detail:", error);
      return NextResponse.json({ error: "Failed to fetch fixtures" }, { status: 500 });
    }
  }
