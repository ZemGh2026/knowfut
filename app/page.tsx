"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { getFlagCode } from "./lib/countryFlags";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import WatchLinks from "./components/WatchLinks";
import type { ApiFixture } from "./lib/matches";
import { fixtureSlug } from "./lib/matches";

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

function toLongDate(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

// ─── Flag ─────────────────────────────────────────────────────────────────────

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

// ─── Match Card ───────────────────────────────────────────────────────────────

function MatchCard({ fixture, showDate = false }: { fixture: ApiFixture; showDate?: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const slug = fixtureSlug(fixture);
  const { short, elapsed } = fixture.status;
  const isLive = short === "1H" || short === "2H" || short === "HT";
  const isDone = short === "FT" || short === "AET" || short === "PEN";
  const hasScore = fixture.homeGoals !== null && fixture.awayGoals !== null;
  const homeWin = hasScore && fixture.homeGoals! > fixture.awayGoals!;
  const awayWin = hasScore && fixture.awayGoals! > fixture.homeGoals!;

  return (
    <div className="bg-[#1A6B3A] rounded-xl overflow-hidden">
      {isLive && <div className="h-0.5 w-full bg-green-400" />}

      <a href={`/match/${slug}`} className="block no-underline text-white hover:bg-[#1f7d44] transition-colors">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 pt-3 pb-2">
          <div className="flex items-center gap-2">
            <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-0.5 rounded font-bold">
              🏆 WC 2026
            </span>
            <span className="text-xs text-[#AACCB8] truncate max-w-[100px]">
              {fixture.round.startsWith("Group Stage") ? "Group Stage" : fixture.round}
            </span>
          </div>
          {isLive && (
            <span className="flex items-center gap-1 text-xs text-green-400 font-bold">
              <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
              {short === "HT" ? "HT" : `${elapsed ?? ""}′`}
            </span>
          )}
          {isDone && <span className="text-xs text-[#AACCB8] font-semibold">FT</span>}
        </div>

        {/* Teams + score */}
        <div className="px-4 pb-3 flex items-center gap-3">
          <div className="flex-1 flex flex-col gap-2 min-w-0">
            <div className="flex items-center gap-2">
              <Flag team={fixture.homeTeam} />
              <span className={`font-bold text-sm truncate ${awayWin ? "text-[#AACCB8]" : "text-white"}`}>
                {fixture.homeTeam}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Flag team={fixture.awayTeam} />
              <span className={`font-bold text-sm truncate ${homeWin ? "text-[#AACCB8]" : "text-white"}`}>
                {fixture.awayTeam}
              </span>
            </div>
          </div>
          <div className="flex-shrink-0 text-right">
            {hasScore ? (
              <div className={`font-black text-xl tabular-nums ${isLive ? "text-green-400" : "text-[#F5C518]"}`}>
                {fixture.homeGoals} – {fixture.awayGoals}
              </div>
            ) : (
              <div>
                <div className="text-[#F5C518] font-bold text-xs">{toLocalTime(fixture.date)}</div>
                {showDate && <div className="text-[#AACCB8] text-xs mt-0.5">{toShortDate(fixture.date)}</div>}
              </div>
            )}
          </div>
        </div>

        {fixture.city && (
          <div className="px-4 pb-2 border-t border-[#0A3D1F] pt-2">
            <span className="text-[#AACCB8] text-xs">🏟️ {fixture.city}</span>
          </div>
        )}
      </a>

      {/* Where to watch toggle */}
      <div className="border-t border-[#0A3D1F]">
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-full px-4 py-2 text-xs text-[#AACCB8] hover:text-white flex items-center justify-between transition-colors"
        >
          <span>📺 Where to watch</span>
          <span className={`transition-transform duration-200 ${expanded ? "rotate-180" : ""}`}>▼</span>
        </button>
        {expanded && (
          <div className="px-4 pb-4">
            <WatchLinks teams={[fixture.homeTeam, fixture.awayTeam]} group={fixture.round} compact={true} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Day Section ──────────────────────────────────────────────────────────────

function DaySection({ dateKey, fixtures, isToday }: { dateKey: string; fixtures: ApiFixture[]; isToday: boolean }) {
  const label = isToday ? `Today — ${toLongDate(fixtures[0].date)}` : toLongDate(fixtures[0].date);
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-4">
        <div className={`px-3 py-1 rounded-lg text-sm font-bold ${isToday ? "bg-[#F5C518] text-[#0A3D1F]" : "bg-[#1A6B3A] text-white"}`}>
          {isToday ? "🟡 " : ""}{label}
        </div>
        <span className="text-[#AACCB8] text-xs">{fixtures.length} match{fixtures.length !== 1 ? "es" : ""}</span>
        <div className="flex-1 h-px bg-[#1A6B3A]" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {fixtures.map((f) => <MatchCard key={f.id} fixture={f} showDate={false} />)}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function Home() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [loading, setLoading] = useState(true);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long", month: "long", day: "numeric",
  });

  const load = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    try {
      const res = await fetch("/api/fixtures");
      if (!res.ok) throw new Error("Failed");
      const data: ApiFixture[] = await res.json();
      data.sort((a, b) => a.date.localeCompare(b.date));
      setFixtures(data);
    } catch (e) {
      console.error(e);
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const hasLive = fixtures.some(
      (f) => f.status.short === "1H" || f.status.short === "2H" || f.status.short === "HT"
    );
    if (hasLive) {
      intervalRef.current = setInterval(() => load(true), 60_000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [fixtures, load]);

  const today_key = todayKey();

  const grouped = fixtures.reduce<Record<string, ApiFixture[]>>((acc, f) => {
    const key = toLocalDateKey(f.date);
    if (!acc[key]) acc[key] = [];
    acc[key].push(f);
    return acc;
  }, {});

  const sortedKeys = Object.keys(grouped).sort();
  const upcomingKeys = sortedKeys.filter((k) => k >= today_key);
  const displayKeys = upcomingKeys.slice(0, 3);
  const hasToday = grouped[today_key]?.length > 0;
  const liveCount = fixtures.filter(
    (f) => f.status.short === "1H" || f.status.short === "2H" || f.status.short === "HT"
  ).length;

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <div className="border-b border-[#1A6B3A] px-6 py-10">
        <div className="max-w-6xl mx-auto">

          {/* Main H1 — broader positioning */}
          <h1 className="text-2xl md:text-4xl font-black mb-3">
            Today&apos;s Football Matches
          </h1>
          <p className="text-[#AACCB8] text-lg max-w-2xl">
            Live scores, kickoff times, fixtures, and where to watch today&apos;s football matches -
            including <span className="text-[#F5C518] font-bold">World Cup 2026</span> and top
            competitions all year round.
          </p>

          {/* Live badge */}
          {liveCount > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 bg-green-900 text-green-400 px-4 py-2 rounded-lg text-sm font-bold">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              {liveCount} match{liveCount !== 1 ? "es" : ""} live right now
            </div>
          )}

          {/* Quick stats */}
          {!loading && fixtures.length > 0 && (
            <div className="flex flex-wrap gap-4 mt-5">
              <div className="flex items-center gap-2 text-sm text-[#AACCB8]">
                <span className="text-[#F5C518] font-black">{fixtures.length}</span> World Cup matches
              </div>
              <div className="flex items-center gap-2 text-sm text-[#AACCB8]">
                <span className="text-[#F5C518] font-black">48</span> teams
              </div>
              <div className="flex items-center gap-2 text-sm text-[#AACCB8]">
                <span className="text-[#F5C518] font-black">3</span> host countries
              </div>
              <div className="flex items-center gap-2 text-sm text-[#AACCB8]">
                <span className="text-[#F5C518] font-black">16</span> venues
              </div>
            </div>
          )}
        </div>
      </div>

      {/* ── World Cup Featured Block ──────────────────────────────────────── */}
      <div className="px-6 pt-6">
        <div className="max-w-6xl mx-auto">
          <div className="bg-[#1A6B3A] rounded-2xl px-5 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🏆</span>
              <div>
                <p className="font-black text-white text-sm">FIFA World Cup 2026</p>
                <p className="text-xs text-[#AACCB8]">June 11 – July 19 · USA, Canada &amp; Mexico</p>
              </div>
            </div>
            <div className="flex flex-wrap gap-2">
              <a href="/world-cup" className="bg-[#F5C518] text-[#0A3D1F] px-4 py-2 rounded-lg font-black text-xs hover:bg-yellow-400 transition-colors">
                Fixtures
              </a>
              <a href="/standings" className="bg-[#0A3D1F] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#1f7d44] transition-colors">
                Standings
              </a>
              <a href="/fixtures" className="bg-[#0A3D1F] text-white px-4 py-2 rounded-lg font-bold text-xs hover:bg-[#1f7d44] transition-colors">
                Schedule
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── Today's Matches ───────────────────────────────────────────────── */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 mb-6">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
              <h2 className="text-lg font-bold uppercase tracking-wider">
                {hasToday ? "Today's Matches" : "Upcoming Fixtures"}
              </h2>
            </div>
            <span className="text-sm text-[#AACCB8] pl-4 sm:pl-0">{today}</span>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-xl p-6 animate-pulse h-40" />
              ))}
            </div>
          ) : displayKeys.length === 0 ? (
            <div className="bg-[#1A6B3A] rounded-xl p-8 text-center">
              <p className="text-[#F5C518] font-bold text-lg">⚽ No upcoming matches</p>
              <p className="text-[#AACCB8] text-sm mt-1">Check back soon!</p>
            </div>
          ) : (
            <>
              {displayKeys.map((key) => (
                <DaySection key={key} dateKey={key} fixtures={grouped[key]} isToday={key === today_key} />
              ))}
              <div className="text-center mt-6 flex flex-wrap justify-center gap-3">
                <a href="/fixtures" className="inline-flex items-center gap-2 bg-[#1A6B3A] hover:bg-[#2E9E58] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                  📅 Full Schedule
                </a>
                <a href="/standings" className="inline-flex items-center gap-2 bg-[#1A6B3A] hover:bg-[#2E9E58] text-white px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                  🏅 Standings
                </a>
                <a href="/world-cup" className="inline-flex items-center gap-2 bg-[#F5C518] hover:bg-yellow-400 text-[#0A3D1F] px-6 py-3 rounded-xl font-bold text-sm transition-colors">
                  🏆 World Cup Hub
                </a>
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Coming Soon Leagues ───────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto">
          <div className="border border-[#1A6B3A] rounded-2xl px-5 py-5">
            <p className="text-xs text-[#AACCB8] uppercase tracking-wider font-bold mb-3">
              More competitions coming soon
            </p>
            <div className="flex flex-wrap gap-2">
              {[
                "🏴󠁧󠁢󠁥󠁮󠁧󠁿 Premier League",
                "⭐ Champions League",
                "🇪🇸 La Liga",
                "🇩🇪 Bundesliga",
                "🇮🇹 Serie A",
                "🇫🇷 Ligue 1",
                "🇺🇸 MLS",
                "🌎 Copa Libertadores",
              ].map((league) => (
                <span
                  key={league}
                  className="bg-[#1A6B3A] text-[#AACCB8] px-3 py-1.5 rounded-lg text-xs font-semibold"
                >
                  {league}
                </span>
              ))}
            </div>
            <p className="text-xs text-[#AACCB8] mt-3">
              KnowFut is expanding to cover year-round football after the World Cup.
            </p>
          </div>
        </div>
      </div>

      {/* ── Where to Watch Banner ─────────────────────────────────────────── */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto bg-[#F5C518] rounded-xl p-5 flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="text-[#0A3D1F] font-black text-lg">Can&apos;t find where to watch?</div>
            <div className="text-[#0A3D1F] text-sm mt-1">
              We show you every legal streaming option by country.
            </div>
          </div>
          <a href="/fixtures" className="bg-[#0A3D1F] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#1A6B3A] transition-colors">
            Find Streams →
          </a>
        </div>
      </div>

      <Footer />
    </div>
  );
}