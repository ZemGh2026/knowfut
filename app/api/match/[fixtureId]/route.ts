import { NextResponse } from "next/server";
import { getMatchById, getStandings } from "../../../lib/matches";

export const revalidate = 60;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const id = parseInt(fixtureId, 10);

  if (isNaN(id)) {
    return NextResponse.json({ error: "Invalid fixture ID" }, { status: 400 });
  }

  try {
    const [fixture, allGroups] = await Promise.all([
      getMatchById(id),
      getStandings(),
    ]);

    if (!fixture) {
      return NextResponse.json({ error: "Fixture not found" }, { status: 404 });
    }

    const groupStandings =
      allGroups.find((g) =>
        g.rows.some(
          (r) => r.team === fixture.homeTeam || r.team === fixture.awayTeam
        )
      ) ?? null;

    return NextResponse.json({ fixture, groupStandings });
  } catch (error) {
    console.error("Match API route error:", error);
    return NextResponse.json({ error: "Failed to fetch match" }, { status: 500 });
  }
}