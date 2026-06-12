import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { getFlagCode } from "../lib/countryFlags";
import { getStandings, GroupStandings, StandingRow } from "../lib/matches";

export const revalidate = 300; // revalidate every 5 minutes

// ─── Flag component ───────────────────────────────────────────────────────────
function Flag({ team }: { team: string }) {
  const code = getFlagCode(team);
  if (!code) return <span className="text-sm">🏳️</span>;
  return (
    <span
      className={`fi fi-${code}`}
      style={{
        width: "1.2rem",
        height: "0.9rem",
        display: "inline-block",
        borderRadius: "2px",
        flexShrink: 0,
      }}
    />
  );
}

// ─── Group Table ─────────────────────────────────────────────────────────────
function GroupTable({
  group,
  rows,
  hasResults,
}: {
  group: string;
  rows: StandingRow[];
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
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => {
              const isQualifying = i < 2;
              const isThird = i === 2;
              return (
                <tr
                  key={row.team}
                  className={`border-b border-[#0A3D1F] last:border-0 transition-colors hover:bg-[#1f7d44] ${
                    isQualifying
                      ? "border-l-2 border-l-[#F5C518]"
                      : isThird
                      ? "border-l-2 border-l-[#AACCB8]"
                      : ""
                  }`}
                >
                  <td className="px-4 py-2.5 text-[#AACCB8] text-xs">{row.rank}</td>
                  <td className="px-2 py-2.5">
                    <div className="flex items-center gap-2">
                      <Flag team={row.team} />
                      <span className="font-semibold text-sm truncate max-w-[120px]">
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
                  <td
                    className={`px-2 py-2.5 text-center text-xs ${
                      row.gd > 0
                        ? "text-green-400"
                        : row.gd < 0
                        ? "text-red-400"
                        : "text-[#AACCB8]"
                    }`}
                  >
                    {row.gd > 0 ? `+${row.gd}` : row.gd}
                  </td>
                  <td className="px-2 py-2.5 text-center font-black text-[#F5C518]">
                    {row.pts}
                  </td>
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
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function StandingsPage() {
  let groups: GroupStandings[] = [];
  let error = false;

  try {
    groups = await getStandings();
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
        <div className="max-w-5xl mx-auto flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">🏅</span>
              <h1 className="text-2xl md:text-3xl font-black">Standings</h1>
            </div>
            <p className="text-[#AACCB8] text-sm">
              FIFA World Cup 2026 · Group Stage
            </p>
          </div>
          {!error && (
            <div className="text-right">
              <div className="text-xs text-[#AACCB8]">Last updated</div>
              <div className="text-xs text-[#F5C518] font-bold">{now}</div>
            </div>
          )}
        </div>
      </div>

      {/* Pre-tournament banner */}
      {!hasResults && !error && groups.length > 0 && (
        <div className="px-6 pt-6">
          <div className="max-w-5xl mx-auto bg-[#1A6B3A] rounded-xl px-5 py-4 flex items-center gap-3">
            <span className="text-2xl">⏳</span>
            <div>
              <p className="font-bold text-sm text-[#F5C518]">
                Tournament hasn&apos;t started yet
              </p>
              <p className="text-xs text-[#AACCB8] mt-0.5">
                Standings will update automatically once matches kick off on
                June 11.
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
              <p className="text-sm mt-1">Check back once the draw is confirmed.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {groups.map(({ group, rows }) => (
                <GroupTable
                  key={group}
                  group={group}
                  rows={rows}
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