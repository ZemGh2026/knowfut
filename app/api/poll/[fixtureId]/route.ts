import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set");
  return neon(url);
}

// ─── GET /api/poll/[fixtureId] ────────────────────────────────────────────────
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const matchId = parseInt(fixtureId, 10);
  if (isNaN(matchId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  try {
    const sql = getDb();
    const rows = await sql`
      SELECT votes_home, votes_draw, votes_away, voter_names
      FROM match_polls
      WHERE match_id = ${matchId}
    `;

    if (rows.length === 0) {
      return NextResponse.json({
        votes_home: 0,
        votes_draw: 0,
        votes_away: 0,
        voter_names: [],
        total: 0,
      });
    }

    const row = rows[0];
    const total = row.votes_home + row.votes_draw + row.votes_away;
    // Return last 5 voter names for social proof
    const recent = (row.voter_names as string[]).slice(-5).reverse();

    return NextResponse.json({
      votes_home: row.votes_home,
      votes_draw: row.votes_draw,
      votes_away: row.votes_away,
      voter_names: recent,
      total,
    });
  } catch (error) {
    console.error("Poll GET error:", error);
    return NextResponse.json({ error: "Failed to fetch poll" }, { status: 500 });
  }
}

// ─── POST /api/poll/[fixtureId] ───────────────────────────────────────────────
export async function POST(
  req: Request,
  { params }: { params: Promise<{ fixtureId: string }> }
) {
  const { fixtureId } = await params;
  const matchId = parseInt(fixtureId, 10);
  if (isNaN(matchId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  let body: { vote: "home" | "draw" | "away"; name: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  const { vote, name } = body;
  if (!["home", "draw", "away"].includes(vote)) {
    return NextResponse.json({ error: "Invalid vote" }, { status: 400 });
  }

  // Sanitize name — max 20 chars, alphanumeric + spaces
  const cleanName = (name ?? "Anonymous")
    .trim()
    .slice(0, 20)
    .replace(/[^a-zA-Z0-9\s]/g, "");

  try {
    const sql = getDb();

    // Upsert — create row if not exists, increment the right counter
    if (vote === "home") {
      await sql`
        INSERT INTO match_polls (match_id, votes_home, voter_names)
        VALUES (${matchId}, 1, ARRAY[${cleanName}])
        ON CONFLICT (match_id) DO UPDATE SET
          votes_home  = match_polls.votes_home + 1,
          voter_names = array_append(match_polls.voter_names, ${cleanName}),
          updated_at  = NOW()
      `;
    } else if (vote === "draw") {
      await sql`
        INSERT INTO match_polls (match_id, votes_draw, voter_names)
        VALUES (${matchId}, 1, ARRAY[${cleanName}])
        ON CONFLICT (match_id) DO UPDATE SET
          votes_draw  = match_polls.votes_draw + 1,
          voter_names = array_append(match_polls.voter_names, ${cleanName}),
          updated_at  = NOW()
      `;
    } else {
      await sql`
        INSERT INTO match_polls (match_id, votes_away, voter_names)
        VALUES (${matchId}, 1, ARRAY[${cleanName}])
        ON CONFLICT (match_id) DO UPDATE SET
          votes_away  = match_polls.votes_away + 1,
          voter_names = array_append(match_polls.voter_names, ${cleanName}),
          updated_at  = NOW()
      `;
    }

    // Return updated totals
    const rows = await sql`
      SELECT votes_home, votes_draw, votes_away, voter_names
      FROM match_polls WHERE match_id = ${matchId}
    `;
    const row = rows[0];
    const total = row.votes_home + row.votes_draw + row.votes_away;
    const recent = (row.voter_names as string[]).slice(-5).reverse();

    return NextResponse.json({
      votes_home: row.votes_home,
      votes_draw: row.votes_draw,
      votes_away: row.votes_away,
      voter_names: recent,
      total,
    });
  } catch (error) {
    console.error("Poll POST error:", error);
    return NextResponse.json({ error: "Failed to save vote" }, { status: 500 });
  }
}