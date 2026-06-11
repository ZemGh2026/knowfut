"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlagCode } from "../lib/countryFlags";
import Footer from "../components/Footer";

// ─── Types ───────────────────────────────────────────────────────────────────
interface ApiMatch {
  team1: string;
  team2: string;
  date: string;
  group?: string;
  score1?: number;
  score2?: number;
}

interface TeamRow {
  name: string;
  mp: number; // matches played
  w: number;
  d: number;
  l: number;
  gf: number; // goals for
  ga: number; // goals against
  gd: number; // goal difference
  pts: number;
}

// ─── Calculate standings from match results ───────────────────────────────────
function calculateStandings(matches: ApiMatch[]): Record<string, TeamRow[]> {
  const groups: Record<string, Record<string, TeamRow>> = {};

  // Only group stage matches (have a group field)
  const groupMatches = matches.filter((m) => m.group && !m.group.includes("Round"));

  for (const match of groupMatches) {
    const group = match.group!;
    if (!groups[group]) groups[group] = {};

    // Init teams if not seen
    for (const team of [match.team1, match.team2]) {
      if (!groups[group][team]) {
        groups[group][team] = { name: team, mp: 0, w: 0, d: 0, l: 0, gf: 0, ga: 0, gd: 0, pts: 0 };
      }
    }

    // Only process if result exists
    if (match.score1 !== undefined && match.score2 !== undefined) {
      const t1 = groups[group][match.team1];
      const t2 = groups[group][match.team2];
      t1.mp++;
      t2.mp++;
      t1.gf += match.score1;
      t1.ga += match.score2;
      t2.gf += match.score2;
      t2.ga += match.score1;
      t1.gd = t1.gf - t1.ga;
      t2.gd = t2.gf - t2.ga;

      if (match.score1 > match.score2) {
        t1.w++; t1.pts += 3;
        t2.l++;
      } else if (match.score1 < match.score2) {
        t2.w++; t2.pts += 3;
        t1.l++;
      } else {
        t1.d++; t1.pts++;
        t2.d++; t2.pts++;
      }
    }
  }

  // Convert to sorted arrays: pts desc → gd desc → gf desc
  const result: Record<string, TeamRow[]> = {};
  for (const [group, teams] of Object.entries(groups)) {
    result[group] = Object.values(teams).sort((a, b) => {
      if (b.pts !== a.pts) return b.pts - a.pts;
      if (b.gd !== a.gd) return b.gd - a.gd;
      return b.gf - a.gf;
    });
  }
  return result;
}

// ─── Flag component ───────────────────────────────────────────────────────────
function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-sm">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

// ─── Group Table ─────────────────────────────────────────────────────────────
function GroupTable({ name, rows, hasResults }: { name: string; rows: TeamRow[]; hasResults: boolean }) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">{name}</h3>
        {!hasResults && (
          <span className="text-xs text-[#AACCB8] italic">Pre-tournament</span>
        )}
      </div>

      {/* Table */}
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
              <th className="px-2 py-2 text-center">GF</th>
              <th className="px-2 py-2 text-center">GA</th>
              <th className="px-2 py-2 text-center">GD</th>
              <th className="px-2 py-2 text-center font-bold text-white">Pts</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isQualifying = i < 2; // top 2 qualify automatically
              const isThird = i === 2;    // 3rd place may qualify
              return (
                <tr
                  key={row.name}
                  className={`border-b border-[#0A3D1F] last:border-0 transition-colors hover:bg-[#1f7d44] ${
                    isQualifying ? "border-l-2 border-l-[#F5C518]" : 
                    isThird ? "border-l-2 border-l-[#AACCB8]" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-[#AACCB8] text-xs">{i + 1}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Flag team={row.name} />
                      <span className="font-semibold text-sm truncate max-w-[120px]">{row.name}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-[#AACCB8] text-xs">{row.mp}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.w}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.d}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.l}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.gf}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.ga}</td>
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

      {/* Legend */}
      <div className="px-4 py-2 flex items-center gap-4 border-t border-[#0A3D1F]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#F5C518] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">Qualify (Top 2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#AACCB8] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">3rd place (may qualify)</span>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function StandingsPage() {
  const [standings, setStandings] = useState<Record<string, TeamRow[]>>({});
  const [hasResults, setHasResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [lastUpdated, setLastUpdated] = useState("");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );
        const data = await res.json();
        const matches: ApiMatch[] = data.matches;

        // Check if any results exist
        const resultsExist = matches.some(
          (m) => m.score1 !== undefined && m.score2 !== undefined
        );
        setHasResults(resultsExist);
        setStandings(calculateStandings(matches));
        setLastUpdated(new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" }));
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const sortedGroups = Object.keys(standings).sort();

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏅</span>
              <h1 className="text-2xl md:text-3xl font-black">Standings</h1>
            </div>
            <p className="text-[#AACCB8] text-sm">
              FIFA World Cup 2026 · Group Stage
            </p>
          </div>
          {lastUpdated && (
            <div className="text-right">
              <div className="text-xs text-[#AACCB8]">Last updated</div>
              <div className="text-xs text-[#F5C518] font-bold">{lastUpdated}</div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-tournament banner */}
      {!hasResults && !loading && (
        <div className="px-6 pt-6">
          <div className="max-w-5xl mx-auto bg-[#1A6B3A] rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-sm text-[#F5C518]">Tournament hasn't started yet</p>
              <p className="text-xs text-[#AACCB8] mt-0.5">
                Standings will update automatically once matches kick off on June 11.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-2xl p-4 animate-pulse h-52" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load standings.</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {sortedGroups.map((group) => (
                <GroupTable
                  key={group}
                  name={group}
                  rows={standings[group]}
                  hasResults={hasResults}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}