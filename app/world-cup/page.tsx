import { getAllMatches } from "../lib/matches";
import Navbar from "../components/Navbar";

type Match = {
  date: string;
  time: string;
  team1: string;
  team2: string;
  group: string;
  ground: string;
  round: string;
  score?: {
    ft: number[];
  };
};

export default async function WorldCup() {
  const matches = await getAllMatches();

  // Group matches by group name
  const groups: { [key: string]: Match[] } = {};
  matches.forEach((match: Match) => {
    if (match.group) {
      if (!groups[match.group]) {
        groups[match.group] = [];
      }
      groups[match.group].push(match);
    }
  });

  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      {/* Navigation */}
      <Navbar />

      {/* Header */}
      <div className="border-b border-[#1A6B3A] px-6 py-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🌍</span>
            <h1 className="text-xl md:text-4xl font-black">
              FIFA World Cup 2026
            </h1>
          </div>
          <p className="text-[#AACCB8] text-lg max-w-xl">
            Canada · USA · Mexico - June 11 to July 19, 2026
          </p>
          <div className="flex flex-wrap gap-3 mt-4">
            <div className="bg-[#1A6B3A] rounded-lg px-4 py-2 text-sm">
              <span className="text-[#F5C518] font-bold">48</span>
              <span className="text-[#AACCB8] ml-1">Teams</span>
            </div>
            <div className="bg-[#1A6B3A] rounded-lg px-4 py-2 text-sm">
              <span className="text-[#F5C518] font-bold">104</span>
              <span className="text-[#AACCB8] ml-1">Matches</span>
            </div>
            <div className="bg-[#1A6B3A] rounded-lg px-4 py-2 text-sm">
              <span className="text-[#F5C518] font-bold">16</span>
              <span className="text-[#AACCB8] ml-1">Groups</span>
            </div>
            <div className="bg-[#1A6B3A] rounded-lg px-4 py-2 text-sm">
              <span className="text-[#F5C518] font-bold">3</span>
              <span className="text-[#AACCB8] ml-1">Host Countries</span>
            </div>
          </div>
        </div>
      </div>

      {/* Group Stage */}
      <div className="px-6 py-8">
        <div className="max-w-6xl mx-auto">
        <h2 className="text-lg md:text-xl font-black uppercase tracking-wider mb-6 text-[#F5C518]">
          Group Stage Fixtures
        </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {Object.entries(groups).map(([groupName, groupMatches]) => (
              <div key={groupName} className="bg-[#0E4A23] rounded-xl overflow-hidden">
                {/* Group Header */}
                <div className="bg-[#1A6B3A] px-4 py-3 flex items-center justify-between">
                  <span className="font-black text-[#F5C518] uppercase tracking-wide">
                    {groupName}
                  </span>
                  <span className="text-xs text-[#AACCB8]">
                    {groupMatches.length} matches
                  </span>
                </div>

                {/* Matches in group */}
                <div className="divide-y divide-[#1A6B3A]">
                  {groupMatches.map((match, i) => (
                    <div key={i} className="px-4 py-3 hover:bg-[#1A6B3A] transition-colors">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1">
                          <span className="font-bold text-sm w-24 text-right">
                            {match.team1}
                          </span>
                          <div className="text-center w-16">
                            {match.score ? (
                              <span className="text-[#F5C518] font-black">
                                {match.score.ft[0]} - {match.score.ft[1]}
                              </span>
                            ) : (
                              <span className="text-[#AACCB8] text-xs font-bold">vs</span>
                            )}
                          </div>
                          <span className="font-bold text-sm w-24">
                            {match.team2}
                          </span>
                        </div>
                        <div className="text-right ml-4">
                          <div className="text-[#F5C518] text-xs font-bold">
                            {match.date}
                          </div>
                          <div className="text-[#AACCB8] text-xs">
                            {match.ground}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Where to Watch Banner */}
      <div className="px-6 py-6">
        <div className="max-w-6xl mx-auto bg-[#F5C518] rounded-xl p-5 flex items-center justify-between">
          <div>
            <div className="text-[#0A3D1F] font-black text-lg">
              Watch every World Cup match legally
            </div>
            <div className="text-[#0A3D1F] text-sm mt-1">
              Find streaming options for your country - Fox, Telemundo, BBC, ViX and more.
            </div>
          </div>
          <button className="bg-[#0A3D1F] text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-[#1A6B3A] transition-colors whitespace-nowrap">
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