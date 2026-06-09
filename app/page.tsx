"use client";

import { useEffect, useState } from "react";
import { getFlagCode } from "./lib/countryFlags";
import Navbar from "./components/Navbar";

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

// Fixed time parser — handles hour overflow (e.g. 20 - (-7) = 27 → next day 03:00)
function parseTime(date: string, time: string): string {
  try {
    const m = time.match(/^(\d{2}):(\d{2})(?:\s+UTC([+-]\d+))?/);
    if (!m) return `${date}T00:00:00Z`;
    const localHours = parseInt(m[1]);
    const localMinutes = parseInt(m[2]);
    const offsetHours = m[3] ? parseInt(m[3]) : 0;

    // Build a real Date so JS handles day rollover automatically
    const baseDate = new Date(`${date}T00:00:00Z`);
    baseDate.setUTCHours(localHours - offsetHours, localMinutes, 0, 0);
    return baseDate.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}

// Pick one upcoming match per group (first match in each group)
function pickOnePerGroup(matches: any[]): any[] {
  const seen = new Set<string>();
  const result: any[] = [];
  for (const m of matches) {
    const key = m.group ?? "Other";
    if (!seen.has(key)) {
      seen.add(key);
      result.push(m);
    }
  }
  return result;
}

function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-lg">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: "1.5rem", height: "1.1rem", display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

function MatchCard({ match, showDate = false }: { match: Match; showDate?: boolean }) {
  const [localTime, setLocalTime] = useState<string>("");
  const [localDate, setLocalDate] = useState<string>("");

  useEffect(() => {
    if (match.utcTime) {
      const d = new Date(match.utcTime);
      setLocalTime(
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
      );
      setLocalDate(
        d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })
      );
    }
  }, [match.utcTime]);

  const isLive = match.status === "in progress";
  const isDone = match.status === "completed";

  return (
    <div className="bg-[#1A6B3A] rounded-xl overflow-hidden hover:bg-[#1f7d44] transition-colors cursor-pointer">
      {/* Top bar */}
      <div className="flex items-center justify-between px-4 pt-3 pb-2">
        <div className="flex items-center gap-2">
          <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-0.5 rounded font-bold">
            🌍 World Cup 2026
          </span>
          {match.group && (
            <span className="text-xs text-[#AACCB8]">{match.group}</span>
          )}
        </div>
        {isLive && (
          <span className="flex items-center gap-1 text-xs text-red-400 font-bold">
            <span className="w-1.5 h-1.5 bg-red-400 rounded-full animate-pulse" />
            LIVE
          </span>
        )}
      </div>

      {/* Teams — vertical stack */}
      <div className="px-4 pb-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Flag team={match.team1} />
          <span className="font-bold text-sm">{match.team1}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag team={match.team2} />
          <span className="font-bold text-sm">{match.team2}</span>
        </div>
      </div>

      {/* Bottom bar: time + venue */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-4 py-2 border-t border-[#0A3D1F]">
        {localTime && (
          <span className="text-[#F5C518] font-bold text-xs">
            🕐 {showDate && localDate ? `${localDate} · ` : ""}{localTime}
          </span>
        )}
        {match.ground && (
          <span className="text-[#AACCB8] text-xs">🏟️ Venue: {match.ground}</span>
        )}
      </div>
    </div>
  );
}

export default function Home() {
  const [matches, setMatches] = useState<Match[]>([]);
  const [upcoming, setUpcoming] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
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
          // Get future matches, then pick first match per group → one card per group
          const futureMatches = allMatches
            .filter((m) => m.date >= todayStr)
            .map((m) => ({ ...m, utcTime: parseTime(m.date, m.time ?? "") }));

          setUpcoming(pickOnePerGroup(futureMatches));
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const displayMatches = matches.length > 0 ? matches : upcoming;
  const showDate = matches.length === 0;

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
              <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {matches.length > 0 ? "Today's Matches" : "Upcoming Fixtures"}
              </h2>
            </div>
            <span className="text-sm text-[#AACCB8] pl-4 sm:pl-0">{today}</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-xl p-6 animate-pulse h-32" />
              ))}
            </div>
          ) : displayMatches.length === 0 ? (
            <div className="bg-[#1A6B3A] rounded-xl p-8 text-center">
              <p className="text-[#F5C518] font-bold text-lg">⚽ No matches today</p>
              <p className="text-[#AACCB8] text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <>
              {showDate && (
                <div className="bg-[#1A6B3A] rounded-xl p-4 mb-4 text-center">
                  <p className="text-[#F5C518] font-bold">⚽ World Cup starts June 11!</p>
                  <p className="text-[#AACCB8] text-sm mt-1">
                    No matches today — showing the next fixture per group:
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {displayMatches.map((match, i) => (
                  <MatchCard key={i} match={match} showDate={showDate} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Where to Watch Banner */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto bg-[#F5C518] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[#0A3D1F] font-black text-lg">Can&apos;t find where to watch?</div>
            <div className="text-[#0A3D1F] text-sm mt-1">We show you every legal streaming option by country.</div>
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