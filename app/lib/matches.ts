/**
 * matches.ts — API-Football v3 data layer for KnowFut
 * League ID: 1 (FIFA World Cup), Season: 2026
 */

const API_BASE = "https://v3.football.api-sports.io";
const LEAGUE_ID = 1;
const SEASON = 2026;

function getHeaders() {
  const key = process.env.API_FOOTBALL_KEY;
  if (!key) throw new Error("API_FOOTBALL_KEY is not set");
  return {
    "x-apisports-key": key,
  };
}

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ApiFixture {
  id: number;
  date: string; // ISO string UTC
  status: {
    short: string; // "NS" | "1H" | "HT" | "2H" | "FT" | "AET" | "PEN" | "PST" | "CANC"
    elapsed: number | null;
  };
  round: string; // e.g. "Group Stage - 1" | "Round of 32"
  homeTeam: string;
  awayTeam: string;
  homeLogo: string;
  awayLogo: string;
  homeGoals: number | null;
  awayGoals: number | null;
  homeCountryCode: string;
  awayCountryCode: string;
  venue: string;
  city: string;
}

export interface StandingRow {
  rank: number;
  team: string;
  teamLogo: string;
  countryCode: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

export interface GroupStandings {
  group: string; // e.g. "Group A"
  rows: StandingRow[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function mapFixture(f: any): ApiFixture {
  return {
    id: f.fixture.id,
    date: f.fixture.date,
    status: {
      short: f.fixture.status.short,
      elapsed: f.fixture.status.elapsed,
    },
    round: f.league.round,
    homeTeam: f.teams.home.name,
    awayTeam: f.teams.away.name,
    homeLogo: f.teams.home.logo,
    awayLogo: f.teams.away.logo,
    homeGoals: f.goals.home,
    awayGoals: f.goals.away,
    // API-Football doesn't give country codes directly on team — derive from name
    homeCountryCode: "",
    awayCountryCode: "",
    venue: f.fixture.venue?.name ?? "",
    city: f.fixture.venue?.city ?? "",
  };
}

async function apiFetch(path: string, revalidate = 60): Promise<any> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: getHeaders(),
    next: { revalidate }, // configurable cache
  });

  if (!res.ok) {
    throw new Error(`API-Football error: ${res.status} ${res.statusText}`);
  }

  const json = await res.json();

  if (json.errors && Object.keys(json.errors).length > 0) {
    throw new Error(`API-Football response error: ${JSON.stringify(json.errors)}`);
  }

  return json.response;
}

// ─── Slug helpers ────────────────────────────────────────────────────────────

function cleanSlugPart(s: string): string {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

/**
 * Build a URL slug from a fixture: "{id}-{homeTeam}-vs-{awayTeam}"
 * The numeric ID prefix means we can always parse it back cheaply.
 */
export function fixtureSlug(fixture: ApiFixture): string {
  return `${fixture.id}-${cleanSlugPart(fixture.homeTeam)}-vs-${cleanSlugPart(fixture.awayTeam)}`;
}

/**
 * Parse the fixture ID out of a slug. Returns NaN if invalid.
 */
export function slugToFixtureId(slug: string): number {
  return parseInt(slug.split("-")[0], 10);
}

// ─── Formatters ───────────────────────────────────────────────────────────────

/**
 * Formats a UTC ISO string into the visitor's local time.
 * e.g. "3:00 PM EST"
 */
export function formatLocalTime(isoString: string): string {
  try {
    return new Date(isoString).toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "";
  }
}

/**
 * Formats a UTC ISO string into a short local date.
 * e.g. "Thu, Jun 11"
 */
export function formatLocalDate(isoString: string): string {
  try {
    return new Date(isoString).toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// ─── API Functions ────────────────────────────────────────────────────────────

/**
 * Fetch all fixtures for WC 2026.
 */
export async function getAllMatches(): Promise<ApiFixture[]> {
  const data = await apiFetch(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}`, 60
  );
  return (data as any[]).map(mapFixture);
}

/**
 * Fetch today's fixtures.
 */
export async function getTodayMatches(): Promise<ApiFixture[]> {
  const today = new Date().toISOString().split("T")[0];
  const data = await apiFetch(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}&date=${today}`
  );
  return (data as any[]).map(mapFixture);
}

/**
 * Fetch the next N upcoming fixtures (status = NS).
 */
export async function getUpcomingMatches(count = 5): Promise<ApiFixture[]> {
  const data = await apiFetch(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}&status=NS`
  );
  return (data as any[]).slice(0, count).map(mapFixture);
}

/**
 * Fetch live fixtures only.
 */
export async function getLiveMatches(): Promise<ApiFixture[]> {
  const data = await apiFetch(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}&live=all`
  );
  return (data as any[]).map(mapFixture);
}

/**
 * Fetch a single fixture by ID with full stats.
 */
export async function getMatchById(fixtureId: number): Promise<ApiFixture | null> {
  const data = await apiFetch(`/fixtures?id=${fixtureId}`);
  if (!data || data.length === 0) return null;
  return mapFixture(data[0]);
}

/**
 * Fetch group stage standings.
 * Returns an array of GroupStandings sorted A–F (or however many groups).
 */
export async function getStandings(): Promise<GroupStandings[]> {
  const data = await apiFetch(
    `/standings?league=${LEAGUE_ID}&season=${SEASON}`, 30
  );

  // data[0].league.standings is an array of groups (each group = array of team rows)
  const leagueData = data[0]?.league;
  if (!leagueData?.standings) return [];

  const groups: GroupStandings[] = leagueData.standings.map((group: any[]) => {
    const firstRow = group[0];
    // Strip "Group Stage - " prefix e.g. "Group Stage - Group A" -> "Group A"
    const raw: string = firstRow?.group ?? "";
    const groupName = raw.replace(/^Group Stage\s*-\s*/i, "").trim() || raw;

    const rows: StandingRow[] = group.map((entry: any) => ({
      rank: entry.rank,
      team: entry.team.name,
      teamLogo: entry.team.logo,
      countryCode: "",
      mp: entry.all.played,
      w: entry.all.win,
      d: entry.all.draw,
      l: entry.all.lose,
      gf: entry.all.goals.for,
      ga: entry.all.goals.against,
      gd: entry.goalsDiff,
      pts: entry.points,
    }));

    return { group: groupName, rows };
  });

  // Filter to proper groups only (e.g. "Group A") and sort alphabetically
  return groups
    .filter((g) => /^Group [A-Z]$/i.test(g.group))
    .sort((a, b) => a.group.localeCompare(b.group));
}

/**
 * Fetch fixtures for a specific round (e.g. "Group Stage - 1").
 */
export async function getFixturesByRound(round: string): Promise<ApiFixture[]> {
  const encoded = encodeURIComponent(round);
  const data = await apiFetch(
    `/fixtures?league=${LEAGUE_ID}&season=${SEASON}&round=${encoded}`
  );
  return (data as any[]).map(mapFixture);
}

/**
 * Fetch all available rounds for the tournament.
 */
export async function getRounds(): Promise<string[]> {
  const data = await apiFetch(
    `/fixtures/rounds?league=${LEAGUE_ID}&season=${SEASON}`
  );
  return data as string[];
}
// ─── Add these types to matches.ts ───────────────────────────────────────────

export interface MatchEvent {
  minute: number;
  extraMinute: number | null;
  team: string;
  player: string;
  assist: string | null;
  type: "Goal" | "Card" | "Subst" | "Var";
  detail: string; // e.g. "Normal Goal", "Yellow Card", "Red Card", "Penalty"
}

export interface TeamStat {
  label: string;
  home: string | number | null;
  away: string | number | null;
}

export interface MatchStats {
  events: MatchEvent[];
  stats: TeamStat[];
}

// ─── Add these functions to matches.ts ───────────────────────────────────────

/**
 * Fetch match events (goals, cards, subs) for a fixture.
 */
export async function getMatchEvents(fixtureId: number): Promise<MatchEvent[]> {
  try {
    const data = await apiFetch(`/fixtures/events?fixture=${fixtureId}`, 60);
    return (data as any[]).map((e: any) => ({
      minute: e.time.elapsed,
      extraMinute: e.time.extra ?? null,
      team: e.team.name,
      player: e.player.name ?? "",
      assist: e.assist?.name ?? null,
      type: e.type,
      detail: e.detail,
    }));
  } catch {
    return [];
  }
}

/**
 * Fetch match statistics (possession, shots, etc.) for a fixture.
 */
export async function getMatchStatistics(fixtureId: number): Promise<TeamStat[]> {
  try {
    const data = await apiFetch(`/fixtures/statistics?fixture=${fixtureId}`, 60);
    if (!data || data.length < 2) return [];

    const homeStats = data[0].statistics as { type: string; value: any }[];
    const awayStats = data[1].statistics as { type: string; value: any }[];

    return homeStats.map((s, i) => ({
      label: s.type,
      home: s.value,
      away: awayStats[i]?.value ?? null,
    }));
  } catch {
    return [];
  }
}