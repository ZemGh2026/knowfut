"use client";

import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getFlagCode } from "../lib/countryFlags";
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
    // Use setUTCHours so JS handles day rollover automatically
    const baseDate = new Date(`${date}T00:00:00Z`);
    baseDate.setUTCHours(localHours - offsetHours, localMinutes, 0, 0);
    return baseDate.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}

function slugify(team1: string, team2: string, date: string): string {
  const clean = (s: string) =>
    s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return `${clean(team1)}-vs-${clean(team2)}-${date}`;
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

function MatchCard({ match }: { match: Match }) {
  const [localTime, setLocalTime] = useState("");
  const [localDate, setLocalDate] = useState("");
  const slug = slugify(match.team1, match.team2, match.date);

  useEffect(() => {
    if (match.utcTime) {
      const d = new Date(match.utcTime);
      setLocalTime(d.toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZoneName: "short" }));
      setLocalDate(d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" }));
    }
  }, [match.utcTime]);

  return (
    <a href={`/match/${slug}`} className="bg-[#0A3D1F] rounded-xl overflow-hidden hover:bg-[#0d4a25] transition-colors cursor-pointer block no-underline text-white">
      {match.round && (
        <div className="px-3 pt-2">
          <span className="text-xs text-[#AACCB8]">{match.round}</span>
        </div>
      )}

      {/* Teams — vertical */}
      <div className="px-3 py-2 flex flex-col gap-2">
        <div className="flex items-center gap-2">
          <Flag team={match.team1} />
          <span className="font-bold text-sm">{match.team1}</span>
        </div>
        <div className="flex items-center gap-2">
          <Flag team={match.team2} />
          <span className="font-bold text-sm">{match.team2}</span>
        </div>
      </div>

      {/* Time + Venue */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 px-3 pb-3 border-t border-[#1A6B3A] pt-2">
        {localTime && (
          <span className="text-[#F5C518] font-bold text-xs">
            🕐 {localDate} · {localTime}
          </span>
        )}
        {match.ground && (
          <span className="text-[#AACCB8] text-xs">🏟️ Venue: {match.ground}</span>
        )}
      </div>
    </a>
  );
}

function GroupSection({ name, matches }: { name: string; matches: Match[] }) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 flex items-center justify-between border-b border-[#0A3D1F]">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">{name}</h3>
        <span className="text-xs text-[#AACCB8]">{matches.length} matches</span>
      </div>
      <div className="p-3 flex flex-col gap-2">
        {matches.map((match, i) => (
          <MatchCard key={i} match={match} />
        ))}
      </div>
    </div>
  );
}

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
        const groups: Record<string, Match[]> = {};
        data.matches.forEach((m: any) => {
          const key = m.group ?? "Other";
          if (!groups[key]) groups[key] = [];
          groups[key].push({ ...m, utcTime: parseTime(m.date, m.time ?? "") });
        });
        const sorted: Record<string, Match[]> = {};
        Object.keys(groups).sort().forEach((k) => (sorted[k] = groups[k]));
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

      <div className="px-6 py-8">
        <div className="max-w-5xl mx-auto">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="bg-[#1A6B3A] rounded-2xl p-4 animate-pulse h-64" />
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load fixtures.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center gap-2 mb-6">
                <span className="w-2 h-2 bg-[#F5C518] rounded-full" />
                <h2 className="text-lg font-bold uppercase tracking-wider">Group Stage</h2>
                <span className="text-[#AACCB8] text-sm ml-1">· {Object.keys(grouped).length} Groups</span>
              </div>

              {/* 2 columns */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(grouped).map(([groupName, matches]) => (
                  <GroupSection key={groupName} name={groupName} matches={matches} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      // In return:
      <Footer />
    </div>
  );
}