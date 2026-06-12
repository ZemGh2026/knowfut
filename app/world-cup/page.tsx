"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlagCode } from "../lib/countryFlags";
import Footer from "../components/Footer";
import type { ApiFixture } from "../lib/matches";
import { fixtureSlug } from "../lib/matches";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function toLocalDateStr(isoString: string): string {
  return new Date(isoString).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function toLocalTimeStr(isoString: string): string {
  return new Date(isoString).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

/** True if this round is part of the group stage */
function isGroupStage(round: string): boolean {
  return round.toLowerCase().startsWith("group stage");
}

/** Extract group letter from round string e.g. "Group Stage - 1" → use team data
 *  API-Football doesn't put group letter in the round string, so we bucket by
 *  a synthetic group key derived from fixture IDs. Instead, group by the
 *  `round` value itself for now (e.g. "Group A" comes from standings, not fixtures).
 *  For the world-cup overview page we group by round matchday which is fine UX. */
function roundLabel(round: string): string {
  return round
    .replace("Group Stage - ", "Matchday ")
    .replace("Round of 32", "Round of 32")
    .replace("Round of 16", "Round of 16")
    .replace("Quarter-finals", "Quarter-finals")
    .replace("Semi-finals", "Semi-finals")
    .replace("3rd Place Final", "3rd Place Final")
    .replace("Final", "Final");
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

// ─── Score / Status ───────────────────────────────────────────────────────────

function MatchStatus({ fixture }: { fixture: ApiFixture }) {
  const { short, elapsed } = fixture.status;
  const isLive = short === "1H" || short === "2H" || short === "HT";
  const isDone = short === "FT" || short === "AET" || short === "PEN";
  const hasScore = fixture.homeGoals !== null && fixture.awayGoals !== null;

  if (isDone && hasScore) {
    return (
      <div className="text-right">
        <div className="text-white font-black text-base tabular-nums">
          {fixture.homeGoals} – {fixture.awayGoals}
        </div>
        <div className="text-[#AACCB8] text-xs">FT</div>
      </div>
    );
  }
  if (isLive && hasScore) {
    return (
      <div className="text-right">
        <div className="text-green-400 font-black text-base tabular-nums animate-pulse">
          {fixture.homeGoals} – {fixture.awayGoals}
        </div>
        <div className="text-green-400 text-xs font-bold">
          {short === "HT" ? "HT" : `${elapsed ?? ""}′`}
        </div>
      </div>
    );
  }
  if (short === "PST") {
    return <div className="text-orange-400 text-xs font-bold text-right">PST</div>;
  }
  return null;
}

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ fixture }: { fixture: ApiFixture }) {
  const slug = fixtureSlug(fixture);
  const isLive =
    fixture.status.short === "1H" ||
    fixture.status.short === "2H" ||
    fixture.status.short === "HT";

  return (
    <a
      href={`/match/${slug}`}
      className="bg-[#0A3D1F] rounded-xl overflow-hidden hover:bg-[#0d4a25] transition-colors block no-underline text-white"
    >
      {isLive && <div className="h-0.5 w-full bg-green-400" />}

      <div className="px-3 py-2.5 flex items-center gap-3">
        {/* Teams */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          <div className="flex items-center gap-2">
            <Flag team={fixture.homeTeam} />
            <span className="font-bold text-sm truncate">{fixture.homeTeam}</span>
          </div>
          <div className="flex items-center gap-2">
            <Flag team={fixture.awayTeam} />
            <span className="font-bold text-sm truncate">{fixture.awayTeam}</span>
          </div>
        </div>

        {/* Score or time */}
        <div className="flex-shrink-0 text-right">
          <MatchStatus fixture={fixture} />
          {fixture.status.short === "NS" && (
            <div>
              <div className="text-[#F5C518] font-bold text-xs">
                {toLocalTimeStr(fixture.date)}
              </div>
              <div className="text-[#AACCB8] text-xs mt-0.5">
                {toLocalDateStr(fixture.date)}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Venue */}
      {(fixture.city || fixture.venue) && (
        <div className="px-3 pb-2.5 border-t border-[#1A6B3A] pt-1.5">
          <span className="text-[#AACCB8] text-xs">
            🏟️ {fixture.city || fixture.venue}
          </span>
        </div>
      )}
    </a>
  );
}

// ─── Round Section ────────────────────────────────────────────────────────────

function RoundSection({
  round,
  fixtures,
}: {
  round: string;
  fixtures: ApiFixture[];
}) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#0A3D1F]">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          {roundLabel(round)}
        </h3>
        <span className="text-xs text-[#AACCB8]">{fixtures.length} matches</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {fixtures.map((f) => (
          <MatchCard key={f.id} fixture={f} />
        ))}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

type Tab = "group" | "knockout";

export default function WorldCupPage() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<Tab>("group");

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch("/api/fixtures");
        if (!res.ok) throw new Error("Failed");
        const data: ApiFixture[] = await res.json();
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

  // Split into group vs knockout
  const groupFixtures = fixtures.filter((f) => isGroupStage(f.round));
  const knockoutFixtures = fixtures.filter((f) => !isGroupStage(f.round));

  // Group by round
  function groupByRound(list: ApiFixture[]): Record<string, ApiFixture[]> {
    return list.reduce<Record<string, ApiFixture[]>>((acc, f) => {
      if (!acc[f.round]) acc[f.round] = [];
      acc[f.round].push(f);
      return acc;
    }, {});
  }

  const groupRounds = groupByRound(groupFixtures);
  const knockoutRounds = groupByRound(knockoutFixtures);

  const activeRounds =
    tab === "group"
      ? Object.entries(groupRounds).sort(([a], [b]) => a.localeCompare(b))
      : Object.entries(knockoutRounds).sort(([a], [b]) => a.localeCompare(b));

  const hasKnockout = knockoutFixtures.length > 0;

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl md:text-3xl font-black">FIFA World Cup 2026</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            June 11 – July 19, 2026 · USA, Canada &amp; Mexico · All times in your
            local timezone
          </p>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-6 pt-6">
        <div className="max-w-5xl mx-auto flex gap-2">
          <button
            onClick={() => setTab("group")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === "group"
                ? "bg-[#F5C518] text-[#0A3D1F]"
                : "bg-[#1A6B3A] text-white hover:bg-[#2E9E58]"
            }`}
          >
            Group Stage
          </button>
          <button
            onClick={() => setTab("knockout")}
            disabled={!hasKnockout}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === "knockout"
                ? "bg-[#F5C518] text-[#0A3D1F]"
                : hasKnockout
                ? "bg-[#1A6B3A] text-white hover:bg-[#2E9E58]"
                : "bg-[#1A6B3A] text-[#AACCB8] opacity-50 cursor-not-allowed"
            }`}
          >
            Knockout Stage
            {!hasKnockout && (
              <span className="ml-1.5 text-xs font-normal opacity-70">· TBD</span>
            )}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className="bg-[#1A6B3A] rounded-2xl p-4 animate-pulse h-64"
                />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load fixtures.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeRounds.map(([round, roundFixtures]) => (
                <RoundSection
                  key={round}
                  round={round}
                  fixtures={roundFixtures}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}