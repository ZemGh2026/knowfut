"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlagCode } from "../lib/countryFlags";
import WatchLinks from "../components/WatchLinks";
import Footer from "../components/Footer";

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

function parseTime(date: string, time: string): string {
  try {
    const m = time.match(/^(\d{2}):(\d{2})(?:\s+UTC([+-]\d+))?/);
    if (!m) return `${date}T00:00:00Z`;
    const localHours = parseInt(m[1]);
    const localMinutes = parseInt(m[2]);
    const offsetHours = m[3] ? parseInt(m[3]) : 0;
    const baseDate = new Date(`${date}T00:00:00Z`);
    baseDate.setUTCHours(localHours - offsetHours, localMinutes, 0, 0);
    return baseDate.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}

function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-base">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: "1.4rem", height: "1rem", display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

function MatchRow({ match }: { match: Match }) {
  const [localTime, setLocalTime] = useState("");
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    if (match.utcTime) {
      const d = new Date(match.utcTime);
      setLocalTime(
        d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" })
      );
    }
  }, [match.utcTime]);

  return (
    <div
      className="bg-[#0A3D1F] rounded-xl overflow-hidden hover:bg-[#0d4a25] transition-colors"
    >
      {/* Main row — clickable to expand */}
      <div
        className="px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {/* Time */}
          <div className="w-28 flex-shrink-0">
            {localTime ? (
              <span className="text-[#F5C518] font-bold text-xs">{localTime}</span>
            ) : (
              <span className="text-[#AACCB8] text-xs">--:--</span>
            )}
          </div>

          {/* Teams */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Flag team={match.team1} />
              <span className="font-bold text-sm truncate">{match.team1}</span>
            </div>
            <div className="flex items-center gap-2">
              <Flag team={match.team2} />
              <span className="font-bold text-sm truncate">{match.team2}</span>
            </div>
          </div>

          {/* Group + venue */}
          <div className="text-right flex-shrink-0 hidden sm:block">
            {match.group && (
              <div className="text-[#F5C518] text-xs font-semibold">{match.group}</div>
            )}
            {match.ground && (
              <div className="text-[#AACCB8] text-xs mt-0.5">🏟️ {match.ground}</div>
            )}
          </div>

          {/* Expand chevron */}
          <div className={`text-[#AACCB8] text-xs ml-2 transition-transform ${expanded ? "rotate-180" : ""}`}>
            ▼
          </div>
        </div>

        {/* Mobile: group + venue */}
        <div className="sm:hidden mt-2 pt-2 border-t border-[#1A6B3A] flex items-center gap-3 flex-wrap">
          {match.group && <span className="text-[#F5C518] text-xs font-semibold">{match.group}</span>}
          {match.ground && <span className="text-[#AACCB8] text-xs">🏟️ {match.ground}</span>}
        </div>
      </div>

      {/* Expanded: Where to Watch */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1A6B3A]">
          <WatchLinks
            teams={[match.team1, match.team2]}
            group={match.group}
            compact={false}
          />
        </div>
      )}
    </div>
  );
}

function DaySection({
  dateLabel,
  matches,
  isToday,
}: {
  dateLabel: string;
  matches: Match[];
  isToday: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            isToday ? "bg-[#F5C518] text-[#0A3D1F]" : "bg-[#1A6B3A] text-white"
          }`}
        >
          {isToday ? "🟡 Today — " : ""}{dateLabel}
        </div>
        <span className="text-[#AACCB8] text-xs">
          {matches.length} match{matches.length !== 1 ? "es" : ""}
        </span>
        <div className="flex-1 h-px bg-[#1A6B3A]" />
      </div>
      <div className="flex flex-col gap-2">
        {matches.map((match, i) => (
          <MatchRow key={i} match={match} />
        ))}
      </div>
    </div>
  );
}

export default function FixturesPage() {
  const [groupedByDate, setGroupedByDate] = useState<
    { dateKey: string; dateLabel: string; isToday: boolean; matches: Match[] }[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<"all" | "upcoming" | "today">("upcoming");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(
          "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json"
        );
        const data = await res.json();
        const allMatches: any[] = data.matches;
        const todayStr = new Date().toISOString().split("T")[0];

        const enriched = allMatches
          .map((m) => ({ ...m, utcTime: parseTime(m.date, m.time ?? "") }))
          .sort((a, b) => a.utcTime.localeCompare(b.utcTime));

        const byDate: Record<string, Match[]> = {};
        enriched.forEach((m) => {
          if (!byDate[m.date]) byDate[m.date] = [];
          byDate[m.date].push(m);
        });

        const sections = Object.entries(byDate).map(([dateKey, matches]) => {
          const d = new Date(`${dateKey}T12:00:00Z`);
          const dateLabel = d.toLocaleDateString("en-US", {
            weekday: "long", month: "long", day: "numeric", year: "numeric",
          });
          return { dateKey, dateLabel, isToday: dateKey === todayStr, matches };
        });

        setGroupedByDate(sections);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const todayStr = new Date().toISOString().split("T")[0];

  const filtered = groupedByDate.filter((section) => {
    if (filter === "today") return section.dateKey === todayStr;
    if (filter === "upcoming") return section.dateKey >= todayStr;
    return true;
  });

  const totalMatches = filtered.reduce((sum, s) => sum + s.matches.length, 0);

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📅</span>
            <h1 className="text-2xl md:text-3xl font-black">Fixtures</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            FIFA World Cup 2026 · All times in your local timezone · Click any match to see where to watch
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            {(["upcoming", "today", "all"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
                  filter === f
                    ? "bg-[#F5C518] text-[#0A3D1F]"
                    : "bg-[#1A6B3A] text-white hover:bg-[#2E9E58]"
                }`}
              >
                {f === "upcoming" ? "Upcoming" : f === "today" ? "Today" : "All Fixtures"}
              </button>
            ))}
            <span className="ml-auto self-center text-[#AACCB8] text-sm">
              {totalMatches} match{totalMatches !== 1 ? "es" : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-xl p-4 animate-pulse h-20" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load fixtures.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-bold">No matches found.</p>
            </div>
          ) : (
            filtered.map((section) => (
              <DaySection
                key={section.dateKey}
                dateLabel={section.dateLabel}
                matches={section.matches}
                isToday={section.isToday}
              />
            ))
          )}
        </div>
      </div>

      // In return:
      <Footer />
    </div>
  );
}