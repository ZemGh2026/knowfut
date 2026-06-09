import { getTodayMatches, getUpcomingMatches } from "./lib/matches";
import Navbar from "./components/Navbar";

export default async function Home() {
  const matches = await getTodayMatches();
  const upcoming = matches.length === 0 ? await getUpcomingMatches(5) : [];

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Hero */}
      <div className="border-b border-[#1A6B3A] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-black mb-3">
            Know what to watch.<br />
            <span className="text-[#F5C518]">Where to watch it.</span><br />
            Why it matters.
          </h1>
          <p className="text-[#AACCB8] text-lg max-w-xl">
            Your daily match guide for European and Latin American football.
          </p>
        </div>
      </div>

      {/* Today's Matches */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse"></span>
            <h2 className="text-lg font-bold uppercase tracking-wider">Today&apos;s Matches</h2>
            <span className="text-sm text-[#AACCB8]">{today}</span>
          </div>

          {matches.length === 0 ? (
            <div>
              <div className="bg-[#1A6B3A] rounded-xl p-4 mb-4 text-center">
                <p className="text-[#F5C518] font-bold">⚽ World Cup starts June 11!</p>
                <p className="text-[#AACCB8] text-sm mt-1">No matches today - here are the upcoming fixtures:</p>
              </div>
              <div className="flex flex-col gap-3">
                {upcoming.map((match: any, index: number) => (
                  <div key={index} className="bg-[#1A6B3A] rounded-xl p-4 flex items-center justify-between hover:bg-[#2E9E58] transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 w-36">
                      <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-1 rounded font-bold">🌍 World Cup</span>
                    </div>
                    <div className="flex items-center gap-4 flex-1 justify-center">
                      <span className="font-bold text-right w-28">{match.team1}</span>
                      <span className="text-[#F5C518] font-black text-lg px-3">vs</span>
                      <span className="font-bold text-left w-28">{match.team2}</span>
                    </div>
                    <div className="text-right w-36">
                      <div className="text-[#F5C518] font-bold text-sm">{match.date}</div>
                      <div className="text-xs text-[#AACCB8] mt-1">{match.group} · {match.ground}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {matches.map((match: any, index: number) => (
                <div
                  key={index}
                  className="bg-[#1A6B3A] rounded-xl p-4 flex items-center justify-between hover:bg-[#2E9E58] transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3 w-32">
                    <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-1 rounded font-bold">
                      🌍 World Cup
                    </span>
                  </div>
                  <div className="flex items-center gap-4 flex-1 justify-center">
                    <span className="font-bold text-right w-28">{match.team1}</span>
                      <div className="text-center px-3">
                      {match.status === "completed" || match.status === "in progress" ? (
                        <span className="text-[#F5C518] font-black text-xl">
                          {match.home_team?.goals ?? 0} - {match.away_team?.goals ?? 0}
                        </span>
                      ) : (
                        <span className="text-[#F5C518] font-black text-lg">vs</span>
                      )}
                    </div>
                    <span className="font-bold text-left w-28">{match.team2}</span>
                  </div>
                  <div className="text-right w-32">
                    {match.status === "future" ? (
                      <div className="text-[#F5C518] font-bold text-sm">
                        {new Date(match.datetime).toLocaleTimeString("en-US", {
                          hour: "2-digit",
                          minute: "2-digit",
                          timeZoneName: "short",
                        })}
                      </div>
                    ) : (
                      <div className="text-[#F5C518] font-bold text-sm uppercase">{match.status}</div>
                    )}
                    <div className="text-xs text-[#AACCB8] mt-1">FIFA World Cup 2026</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Where to Watch Banner */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto bg-[#F5C518] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[#0A3D1F] font-black text-lg">Can&apos;t find where to watch?</div>
            <div className="text-[#0A3D1F] text-sm mt-1">We show you every legal streaming option by country.</div>
          </div>
          <button className="bg-[#0A3D1F] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#1A6B3A] transition-colors">
            Find Streams →
          </button>
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
