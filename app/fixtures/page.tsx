"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlagCode } from "../lib/countryFlags";
import WatchLinks from "../components/WatchLinks";
import Footer from "../components/Footer";
import type { ApiFixture } from "../lib/matches";

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Extract YYYY-MM-DD from a UTC ISO string using local date */
function toLocalDateKey(isoString: string): string {
  const d = new Date(isoString);
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

function toLocalDateLabel(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function toLocalTime(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function todayLocalKey(): string {
  const d = new Date();
  return [
    d.getFullYear(),
    String(d.getMonth() + 1).padStart(2, "0"),
    String(d.getDate()).padStart(2, "0"),
  ].join("-");
}

/** Derive a display-friendly round label */
function roundLabel(round: string): string {
  // API-Football returns e.g. "Group Stage - 1", "Round of 32", "Quarter-finals"
  return round.replace(/^Group Stage - \d+$/, (r) => {
    const num = r.split(" - ")[1];
    const suffix = num === "1" ? "st" : num === "2" ? "nd" : num === "3" ? "rd" : "th";
    return `Group Stage · Matchday ${num}`;
  });
}

// ─── Status badge ─────────────────────────────────────────────────────────────

function StatusBadge({ fixture }: { fixture: ApiFixture }) {
  const { short, elapsed } = fixture.status;

  if (short === "FT" || short === "AET" || short === "PEN") {
    return (
      <span className="text-[#AACCB8] text-xs font-semibold">FT</span>
    );
  }
  if (short === "HT") {
    return <span className="text-orange-400 text-xs font-bold">HT</span>;
  }
  if (short === "1H" || short === "2H") {
    return (
      <span className="text-green-400 text-xs font-bold animate-pulse">
        {elapsed}&apos;
      </span>
    );
  }
  if (short === "PST") {
    return <span className="text-orange-400 text-xs font-semibold">PST</span>;
  }
  if (short === "CANC") {
    return <span className="text-red-400 text-xs font-semibold">CANC</span>;
  }
  // NS — not started
  return null;
}

// ─── Score display ────────────────────────────────────────────────────────────

function Score({ fixture }: { fixture: ApiFixture }) {
  const { short } = fixture.status;
  const isLive = short === "1H" || short === "2H" || short === "HT";
  const hasScore =
    fixture.homeGoals !== null && fixture.awayGoals !== null;

  if (!hasScore) return null;

  return (
    <div
      className={`flex items-center gap-1 text-base font-black tabular-nums ${
        isLive ? "text-green-400" : "text-white"
      }`}
    >
      <span>{fixture.homeGoals}</span>
      <span className="text-[#AACCB8] text-xs">–</span>
      <span>{fixture.awayGoals}</span>
    </div>
  );
}

// ─── Flag ─────────────────────────────────────────────────────────────────────

function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-base">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{
        width: "1.4rem",
        height: "1rem",
        display: "inline-block",
        borderRadius: "2px",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Match Row ────────────────────────────────────────────────────────────────

function MatchRow({ fixture }: { fixture: ApiFixture }) {
  const [expanded, setExpanded] = useState(false);
  const localTime = toLocalTime(fixture.date);
  const isLive =
    fixture.status.short === "1H" ||
    fixture.status.short === "2H" ||
    fixture.status.short === "HT";
  const hasScore =
    fixture.homeGoals !== null && fixture.awayGoals !== null;

  return (
    <div className="bg-[#0A3D1F] rounded-xl overflow-hidden hover:bg-[#0d4a25] transition-colors">
      {/* Live indicator strip */}
      {isLive && <div className="h-0.5 w-full bg-green-400" />}

      {/* Main row */}
      <div
        className="px-4 py-3 cursor-pointer"
        onClick={() => setExpanded((v) => !v)}
      >
        <div className="flex items-center gap-3">
          {/* Time / status */}
          <div className="w-20 flex-shrink-0 flex flex-col items-start gap-0.5">
            <span
              className={`font-bold text-xs ${
                isLive ? "text-green-400" : "text-[#F5C518]"
              }`}
            >
              {localTime}
            </span>
            <StatusBadge fixture={fixture} />
          </div>

          {/* Teams */}
          <div className="flex-1 flex flex-col gap-1.5 min-w-0">
            <div className="flex items-center gap-2">
              <Flag team={fixture.homeTeam} />
              <span
                className={`font-bold text-sm truncate ${
                  hasScore && fixture.homeGoals! > fixture.awayGoals!
                    ? "text-white"
                    : hasScore
                    ? "text-[#AACCB8]"
                    : "text-white"
                }`}
              >
                {fixture.homeTeam}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag team={fixture.awayTeam} />
              <span
                className={`font-bold text-sm truncate ${
                  hasScore && fixture.awayGoals! > fixture.homeGoals!
                    ? "text-white"
                    : hasScore
                    ? "text-[#AACCB8]"
                    : "text-white"
                }`}
              >
                {fixture.awayTeam}
              </span>
            </div>
          </div>

          {/* Score */}
          {hasScore && (
            <div className="flex-shrink-0">
              <Score fixture={fixture} />
            </div>
          )}

          {/* Round + venue — desktop */}
          <div className="text-right flex-shrink-0 hidden sm:block max-w-[140px]">
            <div className="text-[#F5C518] text-xs font-semibold truncate">
              {fixture.round}
            </div>
            {fixture.venue && (
              <div className="text-[#AACCB8] text-xs mt-0.5 truncate">
                🏟️ {fixture.city || fixture.venue}
              </div>
            )}
          </div>

          {/* Expand chevron */}
          <div
            className={`text-[#AACCB8] text-xs ml-2 transition-transform duration-200 ${
              expanded ? "rotate-180" : ""
            }`}
          >
            ▼
          </div>
        </div>

        {/* Mobile: round + venue */}
        <div className="sm:hidden mt-2 pt-2 border-t border-[#1A6B3A] flex items-center gap-3 flex-wrap">
          <span className="text-[#F5C518] text-xs font-semibold">
            {fixture.round}
          </span>
          {fixture.venue && (
            <span className="text-[#AACCB8] text-xs">
              🏟️ {fixture.city || fixture.venue}
            </span>
          )}
        </div>
      </div>

      {/* Expanded: Where to Watch */}
      {expanded && (
        <div className="px-4 pb-4 border-t border-[#1A6B3A]">
          <WatchLinks
            teams={[fixture.homeTeam, fixture.awayTeam]}
            group={fixture.round}
            compact={false}
          />
        </div>
      )}
    </div>
  );
}

// ─── Day Section ──────────────────────────────────────────────────────────────

function DaySection({
  dateLabel,
  fixtures,
  isToday,
}: {
  dateLabel: string;
  fixtures: ApiFixture[];
  isToday: boolean;
}) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-3 mb-3">
        <div
          className={`px-3 py-1 rounded-lg text-sm font-bold ${
            isToday
              ? "bg-[#F5C518] text-[#0A3D1F]"
              : "bg-[#1A6B3A] text-white"
          }`}
        >
          {isToday ? "🟡 Today — " : ""}
          {dateLabel}
        </div>
        <span className="text-[#AACCB8] text-xs">
          {fixtures.length} match{fixtures.length !== 1 ? "es" : ""}
        </span>
        <div className="flex-1 h-px bg-[#1A6B3A]" />
      </div>
      <div className="flex flex-col gap-2">
        {fixtures.map((fixture) => (
          <MatchRow key={fixture.id} fixture={fixture} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type FilterType = "upcoming" | "today" | "all";

export default function FixturesPage() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [filter, setFilter] = useState<FilterType>("upcoming");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/fixtures");
        if (!res.ok) throw new Error("Failed to fetch");
        const data: ApiFixture[] = await res.json();
        // Sort by date ascending
        data.sort((a, b) => a.date.localeCompare(b.date));
        setFixtures(data);
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const todayKey = todayLocalKey();

  // Group fixtures by local date
  const grouped = fixtures.reduce<
    Record<string, { label: string; isToday: boolean; fixtures: ApiFixture[] }>
  >((acc, fixture) => {
    const key = toLocalDateKey(fixture.date);
    if (!acc[key]) {
      acc[key] = {
        label: toLocalDateLabel(fixture.date),
        isToday: key === todayKey,
        fixtures: [],
      };
    }
    acc[key].fixtures.push(fixture);
    return acc;
  }, {});

  const allSections = Object.entries(grouped).sort(([a], [b]) =>
    a.localeCompare(b)
  );

  const filtered = allSections.filter(([key]) => {
    if (filter === "today") return key === todayKey;
    if (filter === "upcoming") return key >= todayKey;
    return true;
  });

  const totalMatches = filtered.reduce(
    (sum, [, s]) => sum + s.fixtures.length,
    0
  );

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📅</span>
            <h1 className="text-2xl md:text-3xl font-black">Fixtures</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            FIFA World Cup 2026 · All times in your local timezone · Click any
            match to see where to watch
          </p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="px-6 pt-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex gap-2 flex-wrap">
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
                {f === "upcoming"
                  ? "Upcoming"
                  : f === "today"
                  ? "Today"
                  : "All Fixtures"}
              </button>
            ))}
            {!loading && (
              <span className="ml-auto self-center text-[#AACCB8] text-sm">
                {totalMatches} match{totalMatches !== 1 ? "es" : ""}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-4xl mx-auto">
          {loading ? (
            <div className="flex flex-col gap-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A6B3A] rounded-xl p-4 animate-pulse h-20"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load fixtures.</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">📭</p>
              <p className="font-bold">No matches found.</p>
            </div>
          ) : (
            filtered.map(([key, section]) => (
              <DaySection
                key={key}
                dateLabel={section.label}
                fixtures={section.fixtures}
                isToday={section.isToday}
              />
            ))
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}