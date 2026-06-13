"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFlagCode } from "../lib/countryFlags";
import type { ApiFixture, GroupStandings } from "../lib/matches";
import { fixtureSlug } from "../lib/matches";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function toLocalTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
}

function toShortDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

function getFTLabel(iso: string): string {
  const matchDate = toLocalDateKey(iso);
  const today = todayKey();
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayKey = [
    yesterday.getFullYear(),
    String(yesterday.getMonth() + 1).padStart(2, "0"),
    String(yesterday.getDate()).padStart(2, "0"),
  ].join("-");

  if (matchDate === today) return "FT · Today";
  if (matchDate === yesterdayKey) return "FT · Yesterday";
  return `FT · ${toShortDate(iso)}`;
}

// ─── Flag ─────────────────────────────────────────────────────────────────────

function Flag({ team, size = "sm" }: { team: string; size?: "sm" | "xs" }) {
  const code = getFlagCode(team);
  const dims = size === "sm"
    ? { width: "1.2rem", height: "0.9rem" }
    : { width: "1rem", height: "0.75rem" };
  if (!code) return <span className="text-sm">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ ...dims, display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

// ─── Group Card ───────────────────────────────────────────────────────────────

function GroupCard({
  group,
  fixtures,
}: {
  group: GroupStandings;
  fixtures: ApiFixture[];
}) {
  const sorted = [...fixtures].sort((a, b) => a.date.localeCompare(b.date));

  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#0A3D1F]">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          {group.group}
        </h3>
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
            {group.rows.map((row, i) => {
              const isQualifying = i < 2;
              const isThird = i === 2;
              return (
                <tr
                  key={row.team}
                  className={`border-b border-[#0A3D1F] last:border-0 hover:bg-[#1f7d44] transition-colors ${
                    isQualifying ? "border-l-2 border-l-[#F5C518]" :
                    isThird ? "border-l-2 border-l-[#AACCB8]" : ""
                  }`}
                >
                  <td className="px-4 py-2 text-[#AACCB8] text-xs">{row.rank}</td>
                  <td className="px-2 py-2">
                    <div className="flex items-center gap-2">
                      <Flag team={row.team} />
                      <span className="font-semibold text-xs truncate max-w-[100px]">{row.team}</span>
                    </div>
                  </td>
                  <td className="px-2 py-2 text-center text-xs text-[#AACCB8]">{row.mp}</td>
                  <td className="px-2 py-2 text-center text-xs">{row.w}</td>
                  <td className="px-2 py-2 text-center text-xs">{row.d}</td>
                  <td className="px-2 py-2 text-center text-xs">{row.l}</td>
                  <td className={`px-2 py-2 text-center text-xs ${
                    row.gd > 0 ? "text-green-400" : row.gd < 0 ? "text-red-400" : "text-[#AACCB8]"
                  }`}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-2 py-2 text-center font-black text-[#F5C518] text-xs">{row.pts}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="px-4 py-1.5 flex items-center gap-4 border-t border-[#0A3D1F] border-b border-b-[#0A3D1F]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#F5C518] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">Qualify (Top 2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#AACCB8] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">3rd place (may qualify)</span>
        </div>
      </div>

      {sorted.length > 0 && (
        <div className="p-3 flex flex-col gap-2">
          {sorted.map((fixture) => {
            const slug = fixtureSlug(fixture);
            const { short, elapsed } = fixture.status;
            const isLive = short === "1H" || short === "2H" || short === "HT";
            const isDone = short === "FT" || short === "AET" || short === "PEN";
            const hasScore = fixture.homeGoals !== null && fixture.awayGoals !== null;
            const homeWin = hasScore && fixture.homeGoals! > fixture.awayGoals!;
            const awayWin = hasScore && fixture.awayGoals! > fixture.homeGoals!;

            return (
              <a
                key={fixture.id}
                href={`/match/${slug}`}
                className="bg-[#0A3D1F] rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-[#0d4a25] transition-colors no-underline text-white"
              >
                {isLive && <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse flex-shrink-0" />}

                <div className="flex-1 flex flex-col gap-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <Flag team={fixture.homeTeam} size="xs" />
                    <span className={`text-xs font-bold truncate ${awayWin ? "text-[#AACCB8]" : "text-white"}`}>
                      {fixture.homeTeam}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Flag team={fixture.awayTeam} size="xs" />
                    <span className={`text-xs font-bold truncate ${homeWin ? "text-[#AACCB8]" : "text-white"}`}>
                      {fixture.awayTeam}
                    </span>
                  </div>
                </div>

                <div className="flex-shrink-0 text-right">
                  {hasScore ? (
                    <div>
                      <div className={`font-black text-sm tabular-nums ${isLive ? "text-green-400" : "text-[#F5C518]"}`}>
                        {fixture.homeGoals} – {fixture.awayGoals}
                      </div>
                      <div className="text-xs text-[#AACCB8]">
                        {isLive
                          ? (short === "HT" ? "HT" : `${elapsed ?? ""}′`)
                          : isDone
                          ? getFTLabel(fixture.date)
                          : "FT"}
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-[#F5C518] text-xs font-bold">{toLocalTime(fixture.date)}</div>
                      <div className="text-[#AACCB8] text-xs mt-0.5">{toShortDate(fixture.date)}</div>
                    </div>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function WorldCupPage() {
  const [standings, setStandings] = useState<GroupStandings[]>([]);
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [tab, setTab] = useState<"group" | "knockout">("group");

  useEffect(() => {
    async function load() {
      try {
        const [fixturesRes, standingsRes] = await Promise.all([
          fetch("/api/fixtures"),
          fetch("/api/standings"),
        ]);

        if (!fixturesRes.ok) throw new Error("fixtures failed");

        const fixturesData: ApiFixture[] = await fixturesRes.json();
        fixturesData.sort((a, b) => a.date.localeCompare(b.date));
        setFixtures(fixturesData);

        if (standingsRes.ok) {
          const standingsData: GroupStandings[] = await standingsRes.json();
          setStandings(standingsData);
        }
      } catch {
        setError(true);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const groupFixtures = fixtures.filter((f) =>
    f.round.toLowerCase().startsWith("group stage")
  );
  const knockoutFixtures = fixtures.filter(
    (f) => !f.round.toLowerCase().startsWith("group stage")
  );
  const hasKnockout = knockoutFixtures.length > 0;

  function fixturesForGroup(group: GroupStandings): ApiFixture[] {
    const teamNames = new Set(group.rows.map((r) => r.team));
    return groupFixtures.filter(
      (f) => teamNames.has(f.homeTeam) || teamNames.has(f.awayTeam)
    );
  }

  const knockoutByRound = knockoutFixtures.reduce<Record<string, ApiFixture[]>>(
    (acc, f) => {
      if (!acc[f.round]) acc[f.round] = [];
      acc[f.round].push(f);
      return acc;
    },
    {}
  );

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">🏆</span>
            <h1 className="text-2xl md:text-3xl font-black">FIFA World Cup 2026</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            June 11 – July 19, 2026 · USA, Canada &amp; Mexico · All times in your local timezone
          </p>
        </div>
      </div>

      <div className="px-6 pt-6">
        <div className="max-w-5xl mx-auto flex gap-2">
          <button
            onClick={() => setTab("group")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              tab === "group" ? "bg-[#F5C518] text-[#0A3D1F]" : "bg-[#1A6B3A] text-white hover:bg-[#2E9E58]"
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
            {!hasKnockout && <span className="ml-1.5 text-xs font-normal opacity-70">· TBD</span>}
          </button>
        </div>
      </div>

      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-2xl p-4 animate-pulse h-80" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load data.</p>
            </div>
          ) : tab === "group" ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {standings.map((group) => (
                <GroupCard
                  key={group.group}
                  group={group}
                  fixtures={fixturesForGroup(group)}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(knockoutByRound)
                .sort(([a], [b]) => a.localeCompare(b))
                .map(([round, roundFixtures]) => (
                  <div key={round} className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
                    <div className="px-4 py-3 border-b border-[#0A3D1F]">
                      <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                        {round}
                      </h3>
                    </div>
                    <div className="p-3 grid grid-cols-1 md:grid-cols-2 gap-2">
                      {roundFixtures.map((fixture) => {
                        const slug = fixtureSlug(fixture);
                        const { short, elapsed } = fixture.status;
                        const isLive = short === "1H" || short === "2H" || short === "HT";
                        const isDone = short === "FT" || short === "AET" || short === "PEN";
                        const hasScore = fixture.homeGoals !== null && fixture.awayGoals !== null;
                        const homeWin = hasScore && fixture.homeGoals! > fixture.awayGoals!;
                        const awayWin = hasScore && fixture.awayGoals! > fixture.homeGoals!;

                        return (
                          <a
                            key={fixture.id}
                            href={`/match/${slug}`}
                            className="bg-[#0A3D1F] rounded-xl px-3 py-2.5 flex items-center gap-3 hover:bg-[#0d4a25] transition-colors no-underline text-white"
                          >
                            <div className="flex-1 flex flex-col gap-1 min-w-0">
                              <div className="flex items-center gap-1.5">
                                <Flag team={fixture.homeTeam} size="xs" />
                                <span className={`text-xs font-bold truncate ${awayWin ? "text-[#AACCB8]" : "text-white"}`}>
                                  {fixture.homeTeam}
                                </span>
                              </div>
                              <div className="flex items-center gap-1.5">
                                <Flag team={fixture.awayTeam} size="xs" />
                                <span className={`text-xs font-bold truncate ${homeWin ? "text-[#AACCB8]" : "text-white"}`}>
                                  {fixture.awayTeam}
                                </span>
                              </div>
                            </div>
                            <div className="flex-shrink-0 text-right">
                              {hasScore ? (
                                <div>
                                  <div className={`font-black text-sm tabular-nums ${isLive ? "text-green-400" : "text-[#F5C518]"}`}>
                                    {fixture.homeGoals} – {fixture.awayGoals}
                                  </div>
                                  <div className="text-xs text-[#AACCB8]">
                                    {isLive
                                      ? (short === "HT" ? "HT" : `${elapsed ?? ""}′`)
                                      : isDone
                                      ? getFTLabel(fixture.date)
                                      : "FT"}
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div className="text-[#F5C518] text-xs font-bold">{toLocalTime(fixture.date)}</div>
                                  <div className="text-[#AACCB8] text-xs">{toShortDate(fixture.date)}</div>
                                </div>
                              )}
                            </div>
                          </a>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}