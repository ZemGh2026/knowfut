import { NextResponse } from "next/server";
import { getStandings } from "../../lib/matches";

export const revalidate = 300;

export async function GET() {
  try {
    const standings = await getStandings();

    // Build { "Brazil": "Group C", "Morocco": "Group C", ... }
    const groupMap: Record<string, string> = {};
    for (const group of standings) {
      for (const row of group.rows) {
        groupMap[row.team] = group.group;
      }
    }

    return NextResponse.json(groupMap);
  } catch (error) {
    console.error("Group map error:", error);
    return NextResponse.json({}, { status: 500 });
  }
}