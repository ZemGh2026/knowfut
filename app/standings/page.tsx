import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFlagCode } from "../lib/countryFlags";
import { getStandings, getAllMatches, GroupStandings, StandingRow, ApiFixture } from "../lib/matches";

export const revalidate = 30;

// ─── Flag ─────────────────────────────────────────────────────────────────────
function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-sm">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{ width: "1.2rem", height: "0.9rem", display: "inline-block", borderRadius: "2px", flexShrink: 0 }}
    />
  );
}

// ─── Form badge ───────────────────────────────────────────────────────────────
function FormBadge({ result }: { result: "W" | "D" | "L" }) {
  const colors = {
    W: "bg-green-500 text-white",
    D: "bg-[#AACCB8] text-[#0A3D1F]",
    L: "bg-red-500 text-white",
  };
  return (
    <span className={`inline-flex items-center justify-center w-5 h-5 rounded text-xs font-black ${colors[result]}`}>
      {result}
    </span>
  );
}

// ─── Calculate form for each team from fixtures ───────────────────────────────
function calculateForm(
  fixtures: ApiFixture[],
  teamName: string
): ("W" | "D" | "L")[] {
  const played = fixtures
    .filter(
      (f) =>
        (f.homeTeam === teamName || f.awayTeam === teamName) &&
        (f.status.short === "FT" || f.status.short === "AET" || f.status.short === "PEN") &&
        f.homeGoals !== null &&
        f.awayGoals !== null
    )
    .sort((a, b) => b.date.localeCompare(a.date)) // most recent first
    .slice(0, 3);

  return played.map((f) => {
    const isHome = f.homeTeam === teamName;
    const teamGoals = isHome ? f.homeGoals! : f.awayGoals!;
    const oppGoals = isHome ? f.awayGoals! : f.homeGoals!;
    if (teamGoals > oppGoals) return "W";
    if (teamGoals < oppGoals) return "L";
    return "D";
  });
}

// ─── Group Table ─────────────────────────────────────────────────────────────
function GroupTable({
  group,
  rows,
  fixtures,
  hasResults,
}: {
  group: string;
  rows: StandingRow[];
  fixtures: ApiFixture[];
  hasResults: boolean;
}) {
  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between">
        <h3 className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          {group}
        </h3>
        {!hasResults && (
          <span className="text-xs text-[#AACCB8] italic">Pre-tournament</span>
        )}
      </div>

      {/* Table */}
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
              <th className="px-2 py-2 text-center">GF</th>
              <th className="px-2 py-2 text-center">GA</th>
              <th className="px-2 py-2 text-center">GD</th>
              <th className="px-2 py-2 text-center font-bold text-white">Pts</th>
              {hasResults && (
                <th className="px-2 py-2 text-center text-[#AACCB8]">Form</th>
              )}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isQualifying = i < 2;
              const isThird = i === 2;
              const form = hasResults ? calculateForm(fixtures, row.team) : [];
              return (
                <tr
                  key={row.team}
                  className={`border-b border-[#0A3D1F] last:border-0 transition-colors hover:bg-[#1f7d44] ${
                    isQualifying ? "border-l-2 border-l-[#F5C518]" :
                    isThird ? "border-l-2 border-l-[#AACCB8]" : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-[#AACCB8] text-xs">{row.rank}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Flag team={row.team} />
                      <span className="font-semibold text-sm truncate max-w-[110px]">
                        {row.team}
                      </span>
                    </div>
                  </td>
                  <td className="px-2 py-2.5 text-center text-[#AACCB8] text-xs">{row.mp}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.w}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.d}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.l}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.gf}</td>
                  <td className="px-2 py-2.5 text-center text-xs">{row.ga}</td>
                  <td className={`px-2 py-2.5 text-center text-xs ${
                    row.gd > 0 ? "text-green-400" : row.gd < 0 ? "text-red-400" : "text-[#AACCB8]"
                  }`}>
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-2 py-2.5 text-center font-black text-[#F5C518]">
                    {row.pts}
                  </td>
                  {hasResults && (
                    <td className="px-2 py-2.5">
                      <div className="flex items-center gap-0.5 justify-center">
                        {form.length === 0 ? (
                          <span className="text-xs text-[#AACCB8]">—</span>
                        ) : (
                          form.map((r, idx) => <FormBadge key={idx} result={r} />)
                        )}
                      </div>
                    </td>
                  )}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="px-4 py-2 flex items-center gap-4 border-t border-[#0A3D1F]">
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#F5C518] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">Qualify (Top 2)</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-2 h-3 bg-[#AACCB8] rounded-sm" />
          <span className="text-xs text-[#AACCB8]">3rd place (may qualify)</span>
        </div>
        {hasResults && (
          <div className="flex items-center gap-1 ml-auto">
            <span className="inline-flex items-center justify-center w-4 h-4 rounded text-xs font-black bg-green-500 text-white">W</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded text-xs font-black bg-[#AACCB8] text-[#0A3D1F]">D</span>
            <span className="inline-flex items-center justify-center w-4 h-4 rounded text-xs font-black bg-red-500 text-white">L</span>
            <span className="text-xs text-[#AACCB8] ml-1">Form</span>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function StandingsPage() {
  let groups: GroupStandings[] = [];
  let fixtures: ApiFixture[] = [];
  let error = false;

  try {
    [groups, fixtures] = await Promise.all([
      getStandings(),
      getAllMatches(),
    ]);
  } catch (e) {
    console.error("Failed to load standings:", e);
    error = true;
  }

  const hasResults = groups.some((g) => g.rows.some((r) => r.mp > 0));

  const now = new Date().toLocaleString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
  });

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-8">
        <div className="max-w-5xl mx-auto flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏅</span>
              <h1 className="text-2xl md:text-3xl font-black">Group Standings</h1>
            </div>
            <p className="text-[#AACCB8] text-sm">
              FIFA World Cup 2026 · Full group stage statistics
            </p>
          </div>
          <div className="flex items-center gap-4">
            {!error && (
              <div className="text-right">
                <div className="text-xs text-[#AACCB8]">Last updated</div>
                <div className="text-xs text-[#F5C518] font-bold">{now}</div>
              </div>
            )}
            <a
              href="/world-cup"
              className="bg-[#F5C518] text-[#0A3D1F] px-4 py-2 rounded-lg font-black text-xs hover:bg-yellow-400 transition-colors"
            >
              🏆 View fixtures by group →
            </a>
          </div>
        </div>
      </div>

      {/* Pre-tournament banner */}
      {!hasResults && !error && groups.length > 0 && (
        <div className="px-6 pt-6">
          <div className="max-w-5xl mx-auto bg-[#1A6B3A] rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-sm text-[#F5C518]">Tournament in progress</p>
              <p className="text-xs text-[#AACCB8] mt-0.5">
                Standings update automatically after every match.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <div className="px-6 py-6">
        <div className="max-w-5xl mx-auto">
          {error ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">⚠️</p>
              <p className="font-bold">Could not load standings.</p>
              <p className="text-sm mt-1">Please try again later.</p>
            </div>
          ) : groups.length === 0 ? (
            <div className="text-center py-20 text-[#AACCB8]">
              <p className="text-4xl mb-4">📋</p>
              <p className="font-bold">No standings data yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(({ group, rows }) => (
                <GroupTable
                  key={group}
                  group={group}
                  rows={rows}
                  fixtures={fixtures}
                  hasResults={hasResults}
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