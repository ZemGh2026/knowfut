"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlag } from "../lib/countryFlags";

// ─── Types ───────────────────────────────────────────────────────────────────
interface Match {
  team1: string;
  team2: string;
  date: string;
  time?: string;
  utcTime?: string;
  ground?: string;
  group?: string;
  round?: string;
}

// ─── Time parser ─────────────────────────────────────────────────────────────
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

// ─── Match Card ──────────────────────────────────────────────────────────────
function MatchCard({ match }: { match: Match }) {
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
    <div className="bg-[#0A3D1F] rounded-xl overflow-hidden hover:bg-[#0d4a25] transition-colors cursor-pointer">
      {/* Round label */}
      {match.round && (
        <div className="px-3 pt-2 pb-0">
          <span className="text-xs text-[#AACCB8]">{match.round}</span>
        </div>
      )}

      {/* Teams */}
      <div className="flex items-center justify-between px-3 py-3 gap-2">
        {/* Team 1 */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-xl leading-none">{flag1}</span>
          <span className="font-bold text-sm truncate">{match.team1}</span>
        </div>

        {/* VS */}
        <span className="text-[#F5C518] font-black text-sm px-2 flex-shrink-0">vs</span>

        {/* Team 2 */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className="font-bold text-sm truncate text-right">{match.team2}</span>
          <span className="text-xl leading-none">{flag2}</span>
        </div>
      </div>

      {/* Time + Venue */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pb-3 border-t border-[#1A6B3A] pt-2">
        {localTime && (
          <div className="flex items-center gap-1">
            <span className="text-[#F5C518] text-xs">🕐</span>
            <span className="text-[#F5C518] font-bold text-xs">
              {localDate} · {localTime}
            </span>
          </div>
        )}
        {match.ground && (
          <div className="flex items-center gap-1">
            <span className="text-xs">🏟️</span>
            <span className="text-[#AACCB8] text-xs">Venue: {match.ground}</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Group Section ────────────────────────────────────────────────────────────
function GroupSection({ name, matches }: { name: string; matches: Match[] }) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      {/* Group header */}
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#0A3D1F]">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          {name}
        </h3>
        <span className="text-xs text-[#AACCB8]">{matches.length} matches</span>
      </div>

      {/* Matches */}
      <div className="p-3 flex flex-col gap-2">
        {matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default function WorldCupPage() {
  const [grouped, setGrouped] = useState<Record<string, Match[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );
        const data = await res.json();
        const matches: any[] = data.matches;

        // Attach parsed UTC time and group by group name
        const groups: Record<string, Match[]> = {};
        matches.forEach((m) => {
          const key = m.group ?? "Other";
          if (!groups[key]) groups[key] = [];
          groups[key].push({
            ...m,
            utcTime: parseTime(m.date, m.time ?? ""),
          });
        });

        // Sort group keys alphabetically (Group A, Group B, ...)
        const sorted: Record<string, Match[]> = {};
        Object.keys(groups)
          .sort()
          .forEach((k) => (sorted[k] = groups[k]));

        setGrouped(sorted);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl md:text-3xl font-black">FIFA World Cup 2026</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            June 11 – July 19, 2026 · USA, Canada & Mexico · All times in your local timezone
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-2xl p-4 animate-pulse h-64" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load fixtures.</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-[#F5C518] rounded-full"></span>
                <h2 className="text-lg font-bold uppercase tracking-wider">Group Stage</h2>
                <span className="text-[#AACCB8] text-sm ml-1">
                  · {Object.keys(grouped).length} Groups
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Object.entries(grouped).map(([groupName, matches]) => (
                  <GroupSection key={groupName} name={groupName} matches={matches} />
                ))}
              </div>
            </>
          )}
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