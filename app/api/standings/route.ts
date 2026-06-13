import { NextResponse } from "next/server";
import { getStandings } from "../../lib/matches";

export const revalidate = 30;

export async function GET() {
  try {
    const standings = await getStandings();
    return NextResponse.json(standings);
  } catch (error) {
    console.error("Standings API route error:", error);
    return NextResponse.json({ error: "Failed to fetch standings" }, { status: 500 });
  }
}