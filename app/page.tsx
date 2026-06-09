"use client";

import { useEffect, useState } from "react";
import { getFlag } from "./lib/countryFlags";
import Navbar from "./components/Navbar";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Match {
  team1: string;
  team2: string;
  date: string;
  time?: string;
  utcTime?: string;
  ground?: string;
  group?: string;
  status?: string;
  home_team?: { goals?: number };
  away_team?: { goals?: number };
}

// ─── Match Card ──────────────────────────────────────────────────────────────
function MatchCard({ match, showDate = false }: { match: Match; showDate?: boolean }) {
  const [localTime, setLocalTime] = useState<string>("");
  const [localDate, setLocalDate] = useState<string>("");

  useEffect(() => {
    if (match.utcTime) {
      const d = new Date(match.utcTime);
      setLocalTime(
        d.toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZoneName: "short",
        })
      );
      setLocalDate(
        d.toLocaleDateString("en-US", {
          weekday: "short",
          month: "short",
          day: "numeric",
        })
      );
    }
  }, [match.utcTime]);

  const flag1 = getFlag(match.team1);
  const flag2 = getFlag(match.team2);

  return (
    <div className="bg-[#1A6B3A] rounded-xl overflow-hidden hover:bg-[#1f7d44] transition-colors cursor-pointer group">
      {/* Top bar: competition + group */}
      <div className="flex items-center justify-between px-4 pt-3 pb-1">
        <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-1 rounded font-bold">
          🌍 World Cup 2026
        </span>
        {match.group && (
          <span className="text-xs text-[#AACCB8]">{match.group}</span>
        )}
      </div>

      {/* Teams row */}
      <div className="flex items-center justify-between px-4 py-3 gap-2">
        {/* Team 1 */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl leading-none">{flag1}</span>
          <span className="font-bold text-sm truncate">{match.team1}</span>
        </div>

        {/* Score or VS */}
        <div className="text-center px-3 flex-shrink-0">
          {match.status === "completed" || match.status === "in progress" ? (
            <span className="text-[#F5C518] font-black text-xl">
              {match.home_team?.goals ?? 0} – {match.away_team?.goals ?? 0}
            </span>
          ) : (
            <span className="text-[#F5C518] font-black text-base">vs</span>
          )}
        </div>

        {/* Team 2 */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-bold text-sm truncate text-right">{match.team2}</span>
          <span className="text-2xl leading-none">{flag2}</span>
        </div>
      </div>

      {/* Bottom bar: time + venue */}
      <div className="flex items-center gap-3 px-4 pb-3 border-t border-[#0A3D1F] pt-2 flex-wrap">
        {localTime && (
          <div className="flex items-center gap-1">
            <span className="text-[#F5C518] text-xs">🕐</span>
            <span className="text-[#F5C518] font-bold text-xs">
              {showDate && localDate ? `${localDate} · ` : ""}{localTime}
            </span>
          </div>
        )}
        {match.ground && (
          <div className="flex items-center gap-1">
            <span className="text-[#AACCB8] text-xs">🏟️</span>
            <span className="text-[#AACCB8] text-xs">Venue: {match.ground}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );
        const data = await res.json();
        const allMatches: any[] = data.matches;

        const todayStr = new Date().toISOString().split("T")[0];
        const todayMatches = allMatches
          .filter((m) => m.date === todayStr)
          .map((m) => ({ ...m, utcTime: parseTime(m.date, m.time ?? "") }));

        if (todayMatches.length > 0) {
          setMatches(todayMatches);
        } else {
          const upcomingMatches = allMatches
            .filter((m) => m.date >= todayStr)
            .slice(0, 6)
            .map((m) => ({ ...m, utcTime: parseTime(m.date, m.time ?? "") }));
          setUpcoming(upcomingMatches);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Hero */}
      <div className="border-b border-[#1A6B3A] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-2xl md:text-4xl font-black mb-3">
            Know what to watch.<br />
            <span className="text-[#F5C518]">Where to watch it.</span><br />
            Why it matters.
          </h1>
          <p className="text-[#AACCB8] text-lg max-w-xl">
            Your daily match guide for European and Latin American football.
          </p>
        </div>
      </div>

      {/* Matches */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse"></span>
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {matches.length > 0 ? "Today's Matches" : "Upcoming Fixtures"}
              </h2>
            </div>
            <span className="text-sm text-[#AACCB8] pl-4 sm:pl-0">{today}</span>
          </div>

          {loading ? (
            <div className="flex flex-col gap-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-xl p-6 animate-pulse h-24" />
              ))}
            </div>
          ) : matches.length > 0 ? (
            <div className="flex flex-col gap-3">
              {matches.map((match, i) => (
                <MatchCard key={i} match={match} />
              ))}
            </div>
          ) : (
            <div>
              <div className="bg-[#1A6B3A] rounded-xl p-4 mb-4 text-center">
                <p className="text-[#F5C518] font-bold">⚽ World Cup starts June 11!</p>
                <p className="text-[#AACCB8] text-sm mt-1">
                  No matches today — here are the upcoming fixtures:
                </p>
              </div>
              <div className="flex flex-col gap-3">
                {upcoming.map((match, i) => (
                  <MatchCard key={i} match={match} showDate />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Where to Watch Banner */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto bg-[#F5C518] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[#0A3D1F] font-black text-lg">
              Can&apos;t find where to watch?
            </div>
            <div className="text-[#0A3D1F] text-sm mt-1">
              We show you every legal streaming option by country.
            </div>
          </div>
          <button className="bg-[#0A3D1F] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#1A6B3A] transition-colors">
            Find Streams →
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-[#1A6B3A] px-6 py-6 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#AACCB8]">
          <span>⚽ KnowFut - Know the game.</span>
          <span>© 2026 KnowFut</span>
        </div>
      </footer>
    </div>
  );
}

// ─── Client-side time parser (mirrors matches.ts logic) ──────────────────────
function parseTime(date: string, time: string): string {
  try {
    const match = time.match(/^(\d{2}):(\d{2})(?:\s+UTC([+-]\d+))?/);
    if (!match) return `${date}T00:00:00Z`;
    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const offsetHours = match[3] ? parseInt(match[3]) : 0;
    const utcHours = hours - offsetHours;
    const dt = new Date(
      `${date}T${String(utcHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`
    );
    return dt.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}