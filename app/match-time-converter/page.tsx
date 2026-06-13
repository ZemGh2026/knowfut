"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFlagCode } from "../lib/countryFlags";
import type { ApiFixture } from "../lib/matches";
import { fixtureSlug } from "../lib/matches";

// ─── Timezone list ────────────────────────────────────────────────────────────

const TIMEZONES = [
  { label: "🇺🇸 USA — New York (ET)", tz: "America/New_York" },
  { label: "🇺🇸 USA — Chicago (CT)", tz: "America/Chicago" },
  { label: "🇺🇸 USA — Denver (MT)", tz: "America/Denver" },
  { label: "🇺🇸 USA — Los Angeles (PT)", tz: "America/Los_Angeles" },
  { label: "🇨🇦 Canada — Toronto", tz: "America/Toronto" },
  { label: "🇨🇦 Canada — Vancouver", tz: "America/Vancouver" },
  { label: "🇬🇧 UK — London", tz: "Europe/London" },
  { label: "🇵🇹 Portugal — Lisbon", tz: "Europe/Lisbon" },
  { label: "🇧🇷 Brazil — São Paulo", tz: "America/Sao_Paulo" },
  { label: "🇲🇿 Mozambique — Maputo", tz: "Africa/Maputo" },
  { label: "🇿🇦 South Africa — Johannesburg", tz: "Africa/Johannesburg" },
  { label: "🇧🇸 Bahamas — Nassau", tz: "America/Nassau" },
  { label: "🇲🇽 Mexico — Mexico City", tz: "America/Mexico_City" },
  { label: "🇦🇷 Argentina — Buenos Aires", tz: "America/Argentina/Buenos_Aires" },
  { label: "🇪🇸 Spain — Madrid", tz: "Europe/Madrid" },
  { label: "🇫🇷 France — Paris", tz: "Europe/Paris" },
  { label: "🇩🇪 Germany — Berlin", tz: "Europe/Berlin" },
  { label: "🇳🇱 Netherlands — Amsterdam", tz: "Europe/Amsterdam" },
  { label: "🇦🇺 Australia — Sydney", tz: "Australia/Sydney" },
  { label: "🇯🇵 Japan — Tokyo", tz: "Asia/Tokyo" },
  { label: "🇰🇷 South Korea — Seoul", tz: "Asia/Seoul" },
  { label: "🇮🇳 India — Mumbai", tz: "Asia/Kolkata" },
  { label: "🇦🇪 UAE — Dubai", tz: "Asia/Dubai" },
  { label: "🇸🇦 Saudi Arabia — Riyadh", tz: "Asia/Riyadh" },
  { label: "🇳🇬 Nigeria — Lagos", tz: "Africa/Lagos" },
  { label: "🇰🇪 Kenya — Nairobi", tz: "Africa/Nairobi" },
  { label: "🇨🇴 Colombia — Bogotá", tz: "America/Bogota" },
];

// Default display timezones shown in the converter table
const DEFAULT_DISPLAY = [
  "America/New_York",
  "America/Los_Angeles",
  "Europe/London",
  "Europe/Lisbon",
  "America/Sao_Paulo",
  "Africa/Maputo",
  "Africa/Johannesburg",
  "America/Nassau",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatInTz(iso: string, tz: string): string {
  try {
    return new Date(iso).toLocaleString("en-US", {
      timeZone: tz,
      weekday: "short",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "—";
  }
}

function toLocalDateKey(iso: string): string {
  const d = new Date(iso);
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

function todayKey(): string {
  const d = new Date();
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, "0"), String(d.getDate()).padStart(2, "0")].join("-");
}

// ─── Flag ─────────────────────────────────────────────────────────────────────

function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span>🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function MatchTimeConverterPage() {
  const [fixtures, setFixtures] = useState<ApiFixture[]>([]);
  const [groupMap, setGroupMap] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [selectedFixture, setSelectedFixture] = useState<ApiFixture | null>(null);
  const [selectedTzs, setSelectedTzs] = useState<string[]>(DEFAULT_DISPLAY);
  const [filter, setFilter] = useState<"today" | "upcoming">("upcoming");

  useEffect(() => {
    async function load() {
      try {
        const [fixturesRes, groupMapRes] = await Promise.all([
          fetch("/api/fixtures"),
          fetch("/api/group-map"),
        ]);
        if (fixturesRes.ok) {
          const data: ApiFixture[] = await fixturesRes.json();
          data.sort((a, b) => a.date.localeCompare(b.date));
          // Only upcoming/today
          const today = todayKey();
          const upcoming = data.filter((f) => toLocalDateKey(f.date) >= today && f.status.short === "NS");
          setFixtures(upcoming);
          if (upcoming.length > 0) setSelectedFixture(upcoming[0]);
        }
        if (groupMapRes.ok) setGroupMap(await groupMapRes.json());
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  function toggleTz(tz: string) {
    setSelectedTzs((prev) =>
      prev.includes(tz) ? prev.filter((t) => t !== tz) : [...prev, tz]
    );
  }

  const displayTzs = TIMEZONES.filter((t) => selectedTzs.includes(t.tz));
  const todayFixtures = fixtures.filter((f) => toLocalDateKey(f.date) === todayKey());
  const upcomingFixtures = fixtures.filter((f) => toLocalDateKey(f.date) > todayKey());
  const displayFixtures = filter === "today" ? todayFixtures : upcomingFixtures;

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">🕐</span>
            <h1 className="text-2xl md:text-3xl font-black">Match Time Converter</h1>
          </div>
          <p className="text-[#AACCB8] text-sm">
            See kickoff times for any World Cup 2026 match in your country and timezone.
          </p>
        </div>
      </div>

      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto flex flex-col gap-6">

          {/* Step 1 — Pick a match */}
          <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between flex-wrap gap-2">
              <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                1. Select a Match
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => setFilter("today")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filter === "today" ? "bg-[#F5C518] text-[#0A3D1F]" : "bg-[#0A3D1F] text-white"}`}
                >
                  Today
                </button>
                <button
                  onClick={() => setFilter("upcoming")}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${filter === "upcoming" ? "bg-[#F5C518] text-[#0A3D1F]" : "bg-[#0A3D1F] text-white"}`}
                >
                  Upcoming
                </button>
              </div>
            </div>

            {loading ? (
              <div className="p-4 animate-pulse h-32 bg-[#0A3D1F] m-3 rounded-xl" />
            ) : displayFixtures.length === 0 ? (
              <div className="p-6 text-center text-[#AACCB8] text-sm">
                No matches found. Try switching to Upcoming.
              </div>
            ) : (
              <div className="p-3 flex flex-col gap-2 max-h-64 overflow-y-auto">
                {displayFixtures.map((f) => {
                  const group = groupMap[f.homeTeam] || groupMap[f.awayTeam] || "";
                  const isSelected = selectedFixture?.id === f.id;
                  return (
                    <button
                      key={f.id}
                      onClick={() => setSelectedFixture(f)}
                      className={`w-full text-left px-4 py-3 rounded-xl flex items-center gap-3 transition-colors ${
                        isSelected
                          ? "bg-[#F5C518] text-[#0A3D1F]"
                          : "bg-[#0A3D1F] hover:bg-[#0d4a25] text-white"
                      }`}
                    >
                      <div className="flex items-center gap-2 flex-1 min-w-0">
                        <Flag team={f.homeTeam} />
                        <span className="font-bold text-sm truncate">{f.homeTeam}</span>
                        <span className={`text-xs ${isSelected ? "text-[#0A3D1F]" : "text-[#AACCB8]"}`}>vs</span>
                        <Flag team={f.awayTeam} />
                        <span className="font-bold text-sm truncate">{f.awayTeam}</span>
                      </div>
                      {group && (
                        <span className={`text-xs font-semibold flex-shrink-0 ${isSelected ? "text-[#0A3D1F]" : "text-[#AACCB8]"}`}>
                          {group}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Step 2 — Select timezones */}
          <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
            <div className="px-4 py-3 border-b border-[#0A3D1F]">
              <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                2. Select Countries / Timezones
              </span>
            </div>
            <div className="p-3 flex flex-wrap gap-2">
              {TIMEZONES.map((tz) => {
                const active = selectedTzs.includes(tz.tz);
                return (
                  <button
                    key={tz.tz}
                    onClick={() => toggleTz(tz.tz)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
                      active
                        ? "bg-[#F5C518] text-[#0A3D1F]"
                        : "bg-[#0A3D1F] text-[#AACCB8] hover:text-white"
                    }`}
                  >
                    {tz.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 3 — Results */}
          {selectedFixture && displayTzs.length > 0 && (
            <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#0A3D1F]">
                <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
                  3. Kickoff Times
                </span>
              </div>

              {/* Match title */}
              <div className="px-4 py-3 bg-[#0A3D1F] mx-3 mt-3 rounded-xl flex items-center gap-3 flex-wrap">
                <Flag team={selectedFixture.homeTeam} />
                <span className="font-black text-white">{selectedFixture.homeTeam}</span>
                <span className="text-[#AACCB8] text-sm">vs</span>
                <Flag team={selectedFixture.awayTeam} />
                <span className="font-black text-white">{selectedFixture.awayTeam}</span>
                <a
                  href={`/match/${fixtureSlug(selectedFixture)}`}
                  className="ml-auto text-xs text-[#F5C518] hover:underline font-bold"
                >
                  Match page →
                </a>
              </div>

              {/* Timezone table */}
              <div className="p-3 flex flex-col gap-2">
                {displayTzs.map((tz) => (
                  <div
                    key={tz.tz}
                    className="bg-[#0A3D1F] rounded-xl px-4 py-3 flex items-center justify-between gap-3"
                  >
                    <span className="text-sm text-[#AACCB8]">{tz.label}</span>
                    <span className="text-sm font-black text-[#F5C518] text-right">
                      {formatInTz(selectedFixture.date, tz.tz)}
                    </span>
                  </div>
                ))}
              </div>

              {/* Share */}
              <div className="px-4 pb-4">
                <button
                  onClick={() => {
                    const text = displayTzs
                      .map((tz) => `${tz.label}: ${formatInTz(selectedFixture.date, tz.tz)}`)
                      .join("\n");
                    const full = `⚽ ${selectedFixture.homeTeam} vs ${selectedFixture.awayTeam} — FIFA World Cup 2026\n\n${text}\n\nWatch: knowfut.com/match/${fixtureSlug(selectedFixture)}`;
                    navigator.clipboard.writeText(full);
                    alert("Kickoff times copied to clipboard!");
                  }}
                  className="w-full mt-2 bg-[#F5C518] text-[#0A3D1F] font-black py-2.5 rounded-xl text-sm hover:bg-yellow-400 transition-colors"
                >
                  📋 Copy All Kickoff Times
                </button>
              </div>
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  );
}