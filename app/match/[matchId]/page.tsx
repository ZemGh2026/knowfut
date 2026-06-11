"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Navbar from "../../components/Navbar";
import { getFlagCode } from "../../lib/countryFlags";
import WatchLinks from "../../components/WatchLinks";
import Footer from "../../components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────
interface Match {
  team1: string;
  team2: string;
  date: string;
  time?: string;
  utcTime?: string;
  ground?: string;
  group?: string;
  round?: string;
  score1?: number;
  score2?: number;
}

interface TeamRow {
  name: string;
  mp: number;
  w: number;
  d: number;
  l: number;
  gf: number;
  ga: number;
  gd: number;
  pts: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function parseTime(date: string, time: string): string {
  try {
    const m = time.match(/^(\d{2}):(\d{2})(?:\s+UTC([+-]\d+))?/);
    if (!m) return `${date}T00:00:00Z`;
    const baseDate = new Date(`${date}T00:00:00Z`);
    baseDate.setUTCHours(parseInt(m[1]) - (m[3] ? parseInt(m[3]) : 0), parseInt(m[2]), 0, 0);
    return baseDate.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}

function slugify(team1: string, team2: string, date: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${clean(team1)}-vs-${clean(team2)}-${date}`;
}

function calculateGroupStandings(matches: Match[], group: string): TeamRow[] {
  const teams: Record<string, TeamRow> = {};
  const groupMatches = matches.filter((m) => m.group === group);

  for (const match of groupMatches) {
    for (const team of [match.team1, match.team2]) {
      if (!teams[team]) {
        teams[team] = { name: team, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      }
    }
    if (match.score1 !== undefined && match.score2 !== undefined) {
      const t1 = teams[match.team1];
      const t2 = teams[match.team2];
      t1.mp++; t2.mp++;
      t1.gf += match.score1; t1.ga += match.score2;
      t2.gf += match.score2; t2.ga += match.score1;
      t1.gd = t1.gf - t1.ga; t2.gd = t2.gf - t2.ga;
      if (match.score1 > match.score2) { t1.w++; t1.pts += 3; t2.l++; }
      else if (match.score1 < match.score2) { t2.w++; t2.pts += 3; t1.l++; }
      else { t1.d++; t1.pts++; t2.d++; t2.pts++; }
    }
  }

  return Object.values(teams).sort((a, b) => {
    if (b.pts !== a.pts) return b.pts - a.pts;
    if (b.gd !== a.gd) return b.gd - a.gd;
    return b.gf - a.gf;
  });
}

// ─── Flag component ───────────────────────────────────────────────────────────
function Flag({ team, size = "lg" }: { team: string; size?: "sm" | "lg" }) {
  const code = getFlagCode(team);
  const dims = size === "lg"
    ? { width: "5rem", height: "3.5rem" }
    : { width: "1.4rem", height: "1rem" };
  if (!code) return <span className={size === "lg" ? "text-6xl" : "text-base"}>🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ ...dims, display: "inline-block", borderRadius: "4px", flexShrink: 0 }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function MatchPage() {
  const params = useParams();
  const matchId = params?.matchId as string;

  const [match, setMatch] = useState<Match | null>(null);
  const [allMatches, setAllMatches] = useState<Match[]>([]);
  const [standings, setStandings] = useState<TeamRow[]>([]);
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );
        const data = await res.json();
        const matches: Match[] = data.matches.map((m: any) => ({
          ...m,
          utcTime: parseTime(m.date, m.time ?? ""),
        }));

        setAllMatches(matches);

        // Find match by slug
        const found = matches.find(
          (m) => slugify(m.team1, m.team2, m.date) === matchId
        );

        if (!found) {
          setNotFound(true);
          return;
        }

        setMatch(found);

        // Local time
        if (found.utcTime) {
          const d = new Date(found.utcTime);
          setLocalTime(
            d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
          );
          setLocalDate(
            d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric", year: "numeric" })
          );
        }

        // Group standings
        if (found.group) {
          setStandings(calculateGroupStandings(matches, found.group));
        }
      } catch {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [matchId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A3D1F] text-white">
        <Navbar />
        <div className="flex items-center justify-center h-64">
          <div className="text-[#AACCB8] animate-pulse">Loading match...</div>
        </div>
      </div>
    );
  }

  if (notFound || !match) {
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

  const isCompleted = match.score1 !== undefined && match.score2 !== undefined;

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* ── Hero: Flag matchup ───────────────────────────────────────────── */}
      <div className="bg-[#1A6B3A] border-b border-[#0A3D1F]">
        <div className="max-w-3xl mx-auto px-6 py-10">

          {/* Competition + group */}
          <div className="flex items-center justify-center gap-2 mb-6">
            <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-3 py-1 rounded font-bold">
              🌍 FIFA World Cup 2026
            </span>
            {match.group && (
              <span className="text-xs text-[#AACCB8]">· {match.group}</span>
            )}
            {match.round && (
              <span className="text-xs text-[#AACCB8]">· {match.round}</span>
            )}
          </div>

          {/* Flags + score/vs */}
          <div className="flex items-center justify-center gap-6 md:gap-12">
            {/* Team 1 */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <Flag team={match.team1} size="lg" />
              <span className="font-black text-lg md:text-2xl text-center leading-tight">
                {match.team1}
              </span>
            </div>

            {/* Score or VS */}
            <div className="flex flex-col items-center flex-shrink-0">
              {isCompleted ? (
                <div className="text-[#F5C518] font-black text-4xl md:text-5xl">
                  {match.score1} – {match.score2}
                </div>
              ) : (
                <>
                  <div className="text-[#F5C518] font-black text-3xl md:text-4xl">VS</div>
                  {localTime && (
                    <div className="text-white font-bold text-sm mt-2 text-center">
                      {localTime}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Team 2 */}
            <div className="flex flex-col items-center gap-3 flex-1">
              <Flag team={match.team2} size="lg" />
              <span className="font-black text-lg md:text-2xl text-center leading-tight">
                {match.team2}
              </span>
            </div>
          </div>

          {/* Date + Venue */}
          <div className="flex items-center justify-center gap-4 mt-6 flex-wrap">
            {localDate && (
              <span className="text-[#AACCB8] text-sm">📅 {localDate}</span>
            )}
            {match.ground && (
              <span className="text-[#AACCB8] text-sm">🏟️ {match.ground}</span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-3xl mx-auto px-6 py-8 flex flex-col gap-6">

        {/* Where to Watch */}
        <WatchLinks
          teams={[match.team1, match.team2]}
          group={match.group}
          compact={false}
        />

        {/* Group Standings */}
        {standings.length > 0 && match.group && (
          <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                {match.group} Standings
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
                  {standings.map((row, i) => {
                    const isThisMatch = row.name === match.team1 || row.name === match.team2;
                    const isQualifying = i < 2;
                    return (
                      <tr
                        key={row.name}
                        className={`border-b border-[#0A3D1F] last:border-0 ${
                          isThisMatch ? "bg-[#0d4a25]" : ""
                        } ${isQualifying ? "border-l-2 border-l-[#F5C518]" : ""}`}
                      >
                        <td className="px-4 py-2.5 text-[#AACCB8] text-xs">{i + 1}</td>
                        <td className="px-2 py-2.5">
                          <div className="flex items-center gap-2">
                            <span
                              className={`fi fi-${getFlagCode(row.name) ?? ""}`}
                              style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px" }}
                            />
                            <span className={`text-sm truncate max-w-[120px] ${isThisMatch ? "font-black text-white" : "font-semibold"}`}>
                              {row.name}
                            </span>
                            {isThisMatch && (
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
        )}

        {/* Other matches in this group */}
        {match.group && (
          <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#0A3D1F]">
              <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                Other {match.group} Matches
              </span>
            </div>
            <div className="p-3 flex flex-col gap-2">
              {allMatches
                .filter(
                  (m) =>
                    m.group === match.group &&
                    !(m.team1 === match.team1 && m.team2 === match.team2 && m.date === match.date)
                )
                .map((m, i) => {
                  const slug = slugify(m.team1, m.team2, m.date);
                  const d = m.utcTime ? new Date(m.utcTime) : null;
                  const dateStr = d
                    ? d.toLocaleDateString("en-US", { month: "short", day: "numeric" })
                    : m.date;
                  return (
                    <a
                      key={i}
                      href={`/match/${slug}`}
                      className="bg-[#0A3D1F] rounded-xl px-4 py-3 flex items-center justify-between hover:bg-[#0d4a25] transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <div className="flex items-center gap-2">
                            <span
                              className={`fi fi-${getFlagCode(m.team1) ?? ""}`}
                              style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px" }}
                            />
                            <span className="text-sm font-bold">{m.team1}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span
                              className={`fi fi-${getFlagCode(m.team2) ?? ""}`}
                              style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px" }}
                            />
                            <span className="text-sm font-bold">{m.team2}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[#F5C518] text-xs font-bold">{dateStr}</div>
                        {m.ground && <div className="text-[#AACCB8] text-xs mt-0.5">🏟️ {m.ground}</div>}
                      </div>
                    </a>
                  );
                })}
            </div>
          </div>
        )}

        {/* Back link */}
        <a
          href="/fixtures"
          className="text-[#AACCB8] text-sm hover:text-white transition-colors text-center"
        >
          ← Back to all fixtures
        </a>
      </div>

      // In return:
      <Footer />
    </div>
  );
}