"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getFlagCode } from "../../lib/countryFlags";
import WatchLinks from "../../components/WatchLinks";
import Footer from "../../components/Footer";
import type { ApiFixture, GroupStandings, StandingRow, MatchEvent, TeamStat } from "../../lib/matches";
import { fixtureSlug, slugToFixtureId } from "../../lib/matches";
import MatchPoll from "../../components/MatchPoll";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function toLocalDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function toLocalDateKey(iso: string): string {
  const d = new Date(iso);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function todayKey(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

// ─── Flag ─────────────────────────────────────────────────────────────────────

function Flag({ team, size = "lg" }: { team: string; size?: "sm" | "lg" }) {
  const code = getFlagCode(team);
  const dims =
    size === "lg"
      ? { width: "5rem", height: "3.5rem" }
      : { width: "1.2rem", height: "0.9rem" };
  if (!code)
    return <span className={size === "lg" ? "text-6xl" : "text-base"}>🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ ...dims, display: "inline-block", borderRadius: "4px", flexShrink: 0 }}
    />
  );
}

// ─── Live indicator ───────────────────────────────────────────────────────────

function LiveBadge({ status }: { status: ApiFixture["status"] }) {
  const { short, elapsed } = status;
  if (short === "1H" || short === "2H") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-green-400 font-bold text-sm">
          LIVE {elapsed ? `${elapsed}′` : ""}
        </span>
      </div>
    );
  }
  if (short === "HT") {
    return (
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 bg-orange-400 rounded-full" />
        <span className="text-orange-400 font-bold text-sm">HALF TIME</span>
      </div>
    );
  }
  if (short === "FT") return <span className="text-[#AACCB8] text-sm font-semibold">Full Time</span>;
  if (short === "AET") return <span className="text-[#AACCB8] text-sm font-semibold">After Extra Time</span>;
  if (short === "PEN") return <span className="text-[#AACCB8] text-sm font-semibold">After Penalties</span>;
  if (short === "PST") return <span className="text-orange-400 text-sm font-semibold">Postponed</span>;
  if (short === "CANC") return <span className="text-red-400 text-sm font-semibold">Cancelled</span>;
  return null;
}

// ─── Event icon ───────────────────────────────────────────────────────────────

function eventIcon(type: string, detail: string): string {
  if (type === "Goal") {
    if (detail === "Own Goal") return "⚽🔴";
    if (detail === "Penalty") return "⚽ (P)";
    return "⚽";
  }
  if (type === "Card") {
    if (detail === "Red Card") return "🟥";
    if (detail === "Yellow Card") return "🟨";
    if (detail === "Yellow Red Card") return "🟨🟥";
  }
  if (type === "Subst") return "🔄";
  if (type === "Var") return "📺";
  return "•";
}

// ─── Match Events ─────────────────────────────────────────────────────────────

function MatchEvents({
  events,
  homeTeam,
  awayTeam,
}: {
  events: MatchEvent[];
  homeTeam: string;
  awayTeam: string;
}) {
  if (events.length === 0) return null;

  // Only show goals and cards — skip subs for cleanliness
  const keyEvents = events.filter(
    (e) => e.type === "Goal" || e.type === "Card"
  );

  if (keyEvents.length === 0) return null;

  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#0A3D1F]">
        <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          Match Events
        </span>
      </div>
      <div className="divide-y divide-[#0A3D1F]">
        {keyEvents.map((event, i) => {
          const isHome = event.team === homeTeam;
          return (
            <div
              key={i}
              className={`px-4 py-2.5 flex items-center gap-3 ${
                isHome ? "flex-row" : "flex-row-reverse"
              }`}
            >
              {/* Minute */}
              <span className="text-[#F5C518] font-black text-sm w-10 flex-shrink-0 text-center">
                {event.minute}{event.extraMinute ? `+${event.extraMinute}` : ""}′
              </span>

              {/* Icon */}
              <span className="text-base flex-shrink-0">
                {eventIcon(event.type, event.detail)}
              </span>

              {/* Player info */}
              <div className={`flex-1 ${isHome ? "text-left" : "text-right"}`}>
                <span className="text-sm font-bold text-white">{event.player}</span>
                {event.assist && (
                  <span className="text-xs text-[#AACCB8] ml-1">
                    (assist: {event.assist})
                  </span>
                )}
                {event.detail === "Own Goal" && (
                  <span className="text-xs text-red-400 ml-1">(OG)</span>
                )}
              </div>

              {/* Team flag */}
              <Flag team={event.team} size="sm" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Match Stats ──────────────────────────────────────────────────────────────

function MatchStatistics({
  stats,
  homeTeam,
  awayTeam,
}: {
  stats: TeamStat[];
  homeTeam: string;
  awayTeam: string;
}) {
  if (stats.length === 0) return null;

  // Pick the most useful stats
  const priority = [
    "Ball Possession",
    "Total Shots",
    "Shots on Goal",
    "Shots off Goal",
    "Corner Kicks",
    "Fouls",
    "Yellow Cards",
    "Red Cards",
    "Offsides",
    "Goalkeeper Saves",
    "Total passes",
    "Passes accurate",
  ];

  const filtered = stats.filter((s) =>
    priority.some((p) => s.label.toLowerCase().includes(p.toLowerCase()))
  );

  const display = filtered.length > 0 ? filtered : stats.slice(0, 10);

  function parseVal(val: string | number | null): number {
    if (val === null || val === undefined) return 0;
    return parseFloat(String(val).replace("%", "")) || 0;
  }

  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between">
        <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          Match Statistics
        </span>
      </div>

      {/* Team headers */}
      <div className="px-4 py-2 flex items-center justify-between border-b border-[#0A3D1F]">
        <div className="flex items-center gap-2">
          <Flag team={homeTeam} size="sm" />
          <span className="text-xs font-bold truncate max-w-[80px]">{homeTeam}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold truncate max-w-[80px]">{awayTeam}</span>
          <Flag team={awayTeam} size="sm" />
        </div>
      </div>

      <div className="divide-y divide-[#0A3D1F]">
        {display.map((stat, i) => {
          const homeVal = parseVal(stat.home);
          const awayVal = parseVal(stat.away);
          const total = homeVal + awayVal;
          const homePct = total > 0 ? (homeVal / total) * 100 : 50;
          const isPossession = stat.label.toLowerCase().includes("possession");

          return (
            <div key={i} className="px-4 py-2.5">
              {/* Label */}
              <div className="text-center text-xs text-[#AACCB8] mb-1.5">
                {stat.label}
              </div>

              {/* Values + bar */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-black text-white w-10 text-right">
                  {stat.home ?? 0}{isPossession ? "%" : ""}
                </span>

                {/* Progress bar */}
                <div className="flex-1 h-2 bg-[#0A3D1F] rounded-full overflow-hidden flex">
                  <div
                    className="h-full bg-[#F5C518] rounded-l-full transition-all duration-500"
                    style={{ width: `${homePct}%` }}
                  />
                  <div
                    className="h-full bg-blue-400 rounded-r-full transition-all duration-500"
                    style={{ width: `${100 - homePct}%` }}
                  />
                </div>

                <span className="text-sm font-black text-white w-10 text-left">
                  {stat.away ?? 0}{isPossession ? "%" : ""}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="px-4 py-2 border-t border-[#0A3D1F] flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-[#F5C518] rounded-sm" />
          <span className="text-xs text-[#AACCB8] truncate max-w-[100px]">{homeTeam}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 bg-blue-400 rounded-sm" />
          <span className="text-xs text-[#AACCB8] truncate max-w-[100px]">{awayTeam}</span>
        </div>
      </div>
    </div>
  );
}

// ─── Group standings mini-table ───────────────────────────────────────────────

function MiniStandings({
  groupStandings,
  homeTeam,
  awayTeam,
  isMatchToday,
}: {
  groupStandings: GroupStandings;
  homeTeam: string;
  awayTeam: string;
  isMatchToday: boolean;
}) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center gap-2">
        <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          {groupStandings.group} Standings
        </span>
        <span className="text-xs text-[#AACCB8]">· What this match means</span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-[#AACCB8] text-xs border-b border-[#0A3D1F]">
              <th className="text-left px-4 py-2 w-6">#</th>
              <th className="text-left px-2 py-2">Team</th>
              <th className="px-2 py-2 text-center">MP</th>
              <th className="px-2 py-2 text-center">W</th>
              <th className="px-2 py-2 text-center">D</th>
              <th className="px-2 py-2 text-center">L</th>
              <th className="px-2 py-2 text-center">GD</th>
              <th className="px-2 py-2 text-center font-bold text-white">Pts</th>
            </tr>
          </thead>
          <tbody>
            {groupStandings.rows.map((row: StandingRow, i: number) => {
              const isThisMatch = row.team === homeTeam || row.team === awayTeam;
              const isQualifying = i < 2;
              return (
                <tr
                  key={row.team}
                  className={`border-b border-[#0A3D1F] last:border-0 ${
                    isThisMatch ? "bg-[#0d4a25]" : ""
                  } ${isQualifying ? "border-l-2 border-l-[#F5C518]" : ""}`}
                >
                  <td className="px-4 py-2.5 text-[#AACCB8] text-xs">{row.rank}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Flag team={row.team} size="sm" />
                      <span className={`text-sm truncate max-w-[120px] ${isThisMatch ? "font-black text-white" : "font-semibold"}`}>
                        {row.team}
                      </span>
                      {isThisMatch && isMatchToday && (
                        <span className="text-xs bg-[#F5C518] text-[#0A3D1F] px-1 rounded font-bold">
                          TODAY
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-xs text-[#AACCB8]">{row.mp}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.w}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.d}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.l}</td>
                  <td className={`px-2 py-2.5 text-center text-xs ${row.gd > 0 ? "text-green-400" : row.gd < 0 ? "text-red-400" : "text-[#AACCB8]"}`}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-2 py-2.5 text-center font-black text-[#F5C518]">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchPage() {
  const params = useParams();
  const slug = params?.matchId as string;

  const [fixture, setFixture] = useState<ApiFixture | null>(null);
  const [groupStandings, setGroupStandings] = useState<GroupStandings | null>(null);
  const [allGroupFixtures, setAllGroupFixtures] = useState<ApiFixture[]>([]);
  const [events, setEvents] = useState<MatchEvent[]>([]);
  const [stats, setStats] = useState<TeamStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fixtureId = slugToFixtureId(slug);

  const load = useCallback(async () => {
    if (isNaN(fixtureId)) { setNotFound(true); setLoading(false); return; }

    try {
      const res = await fetch(`/api/match/${fixtureId}`);
      if (res.status === 404) { setNotFound(true); return; }
      if (!res.ok) throw new Error("Failed");

      const data: {
        fixture: ApiFixture;
        groupStandings: GroupStandings | null;
        events: MatchEvent[];
        stats: TeamStat[];
      } = await res.json();

      setFixture(data.fixture);
      setGroupStandings(data.groupStandings);
      setEvents(data.events ?? []);
      setStats(data.stats ?? []);

      if (data.groupStandings) {
        const fixturesRes = await fetch("/api/fixtures");
        if (fixturesRes.ok) {
          const all: ApiFixture[] = await fixturesRes.json();
          const groupTeams = new Set(data.groupStandings.rows.map((r) => r.team));
          setAllGroupFixtures(
            all.filter(
              (f) =>
                f.id !== fixtureId &&
                f.round.toLowerCase().startsWith("group stage") &&
                (groupTeams.has(f.homeTeam) || groupTeams.has(f.awayTeam))
            )
          );
        }
      }
    } catch {
      setNotFound(true);
    } finally {
      setLoading(false);
    }
  }, [fixtureId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    if (!fixture) return;
    const { short } = fixture.status;
    const isLive = short === "1H" || short === "2H" || short === "HT";
    if (!isLive) return;
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, [fixture, load]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A3D1F] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#AACCB8] animate-pulse text-sm">Loading match…</div>
        </div>
      </div>
    );
  }

  if (notFound || !fixture) {
    return (
      <div className="min-h-screen bg-[#0A3D1F] text-white">
        <Navbar />
        <div className="text-center py-20 text-[#AACCB8]">
          <p className="text-4xl mb-4">⚽</p>
          <p className="font-bold text-lg">Match not found.</p>
          <a href="/fixtures" className="text-[#F5C518] text-sm mt-2 inline-block hover:underline">
            ← Back to fixtures
          </a>
        </div>
      </div>
    );
  }

  const isCompleted =
    (fixture.status.short === "FT" ||
      fixture.status.short === "AET" ||
      fixture.status.short === "PEN") &&
    fixture.homeGoals !== null;

  const isLive =
    fixture.status.short === "1H" ||
    fixture.status.short === "2H" ||
    fixture.status.short === "HT";

  const hasScore = fixture.homeGoals !== null && fixture.awayGoals !== null;
  const homeWin = hasScore && fixture.homeGoals! > fixture.awayGoals!;
  const awayWin = hasScore && fixture.awayGoals! > fixture.homeGoals!;

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <div className="bg-[#1A6B3A] border-b border-[#0A3D1F]">
        {isLive && <div className="h-1 w-full bg-green-400" />}

        <div className="max-w-3xl mx-auto px-6 py-10">
          <div className="flex items-center justify-center gap-2 mb-4 flex-wrap">
            <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-3 py-1 rounded font-bold">
              🌍 FIFA World Cup 2026
            </span>
            <span className="text-xs text-[#AACCB8]">· {fixture.round}</span>
          </div>

          <div className="flex justify-center mb-4">
            <LiveBadge status={fixture.status} />
          </div>

          <div className="flex items-center justify-center gap-6 md:gap-12">
            <div className="flex flex-col items-center gap-3 flex-1">
              <Flag team={fixture.homeTeam} size="lg" />
              <span className={`font-black text-lg md:text-2xl text-center leading-tight ${awayWin ? "text-[#AACCB8]" : "text-white"}`}>
                {fixture.homeTeam}
              </span>
            </div>

            <div className="flex flex-col items-center gap-1 flex-shrink-0">
              {hasScore ? (
                <div className={`font-black text-4xl md:text-5xl tabular-nums ${isLive ? "text-green-400" : "text-[#F5C518]"}`}>
                  {fixture.homeGoals} – {fixture.awayGoals}
                </div>
              ) : (
                <>
                  <div className="text-[#F5C518] font-black text-3xl md:text-4xl">VS</div>
                  <div className="text-white font-bold text-sm mt-1 text-center">
                    {toLocalTime(fixture.date)}
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-3 flex-1">
              <Flag team={fixture.awayTeam} size="lg" />
              <span className={`font-black text-lg md:text-2xl text-center leading-tight ${homeWin ? "text-[#AACCB8]" : "text-white"}`}>
                {fixture.awayTeam}
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            <span className="text-[#AACCB8] text-sm">📅 {toLocalDate(fixture.date)}</span>
            {(fixture.venue || fixture.city) && (
              <span className="text-[#AACCB8] text-sm">
                🏟️ {fixture.venue}{fixture.city ? `, ${fixture.city}` : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Where to Watch */}
        <WatchLinks
          teams={[fixture.homeTeam, fixture.awayTeam]}
          group={fixture.round}
          compact={false}
        />

        {/* Community Prediction Poll */}
        <MatchPoll
          fixtureId={fixture.id}
          homeTeam={fixture.homeTeam}
          awayTeam={fixture.awayTeam}
          kickoff={fixture.date}
          isLive={isLive}
          isFinished={isCompleted}
          homeGoals={fixture.homeGoals}
          awayGoals={fixture.awayGoals}
        />

        {/* Match Events */}
        {(isLive || isCompleted) && events.length > 0 && (
          <MatchEvents
            events={events}
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
          />
        )}

        {/* Match Statistics */}
        {(isLive || isCompleted) && stats.length > 0 && (
          <MatchStatistics
            stats={stats}
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
          />
        )}

        {/* Group Standings */}
        {groupStandings && (
          <MiniStandings
            groupStandings={groupStandings}
            homeTeam={fixture.homeTeam}
            awayTeam={fixture.awayTeam}
            isMatchToday={toLocalDateKey(fixture.date) === todayKey()}
          />
        )}

        {/* Other matches in this group */}
        {allGroupFixtures.length > 0 && (
          <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between">
              <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                Other Group Matches
              </span>
              <span className="text-xs text-[#AACCB8]">
                {groupStandings?.group ?? ""}
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {allGroupFixtures.map((f) => {
                const siblingSlug = fixtureSlug(f);
                const hasResult = f.homeGoals !== null && f.awayGoals !== null;
                return (
                  <a
                    key={f.id}
                    href={`/match/${siblingSlug}`}
                    className="bg-[#0A3D1F] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-[#0d4a25] transition-colors"
                  >
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <Flag team={f.homeTeam} size="sm" />
                        <span className="text-sm font-bold">{f.homeTeam}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Flag team={f.awayTeam} size="sm" />
                        <span className="text-sm font-bold">{f.awayTeam}</span>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {hasResult ? (
                        <div className="text-white font-black text-base tabular-nums">
                          {f.homeGoals} – {f.awayGoals}
                        </div>
                      ) : (
                        <div className="text-[#F5C518] text-xs font-bold">
                          {toShortDate(f.date)}
                        </div>
                      )}
                      {f.city && (
                        <div className="text-[#AACCB8] text-xs mt-0.5">🏟️ {f.city}</div>
                      )}
                    </div>
                  </a>
                );
              })}
            </div>
          </div>
        )}

        <a href="/fixtures" className="text-[#AACCB8] text-sm hover:text-white transition-colors text-center">
          ← Back to all fixtures
        </a>
      </div>

      <Footer />
    </div>
  );
}