// app/components/WatchLinks.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Reusable "Where to Watch" affiliate links component.
// Usage: <WatchLinks teams={["Mexico", "South Africa"]} group="Group A" />
//
// TO ACTIVATE AFFILIATE LINKS:
// 1. Replace the `affiliateUrl` value in each service with your real affiliate URL
// 2. Set `active: true` for each service once you're approved
// ─────────────────────────────────────────────────────────────────────────────

interface WatchLinksProps {
    teams?: string[];
    group?: string;
    compact?: boolean; // compact=true for match cards, false for detail pages
  }
  
  interface StreamingService {
    name: string;
    logo: string;       // emoji placeholder (swap for <img> once you have logos)
    color: string;      // brand color
    textColor: string;
    affiliateUrl: string;
    active: boolean;    // flip to true once affiliate link is live
    note?: string;      // e.g. "Free trial"
  }
  
  const SERVICES: StreamingService[] = [
    {
      name: "FuboTV",
      logo: "📺",
      color: "#7B2FBE",
      textColor: "#fff",
      affiliateUrl: "https://www.fubo.tv/welcome", // ← replace with your affiliate URL
      active: false,
      note: "Free trial",
    },
    {
      name: "ESPN+",
      logo: "🏈",
      color: "#CC0000",
      textColor: "#fff",
      affiliateUrl: "https://plus.espn.com/", // ← replace with your affiliate URL
      active: false,
      note: "From $10.99/mo",
    },
    {
      name: "DAZN",
      logo: "⚡",
      color: "#F8FF00",
      textColor: "#000",
      affiliateUrl: "https://www.dazn.com/", // ← replace with your affiliate URL
      active: false,
      note: "Free trial",
    },
    {
      name: "Peacock",
      logo: "🦚",
      color: "#000000",
      textColor: "#fff",
      affiliateUrl: "https://www.peacocktv.com/", // ← replace with your affiliate URL
      active: false,
      note: "From $7.99/mo",
    },
  ];
  
  export default function WatchLinks({ teams, group, compact = false }: WatchLinksProps) {
    const activeServices = SERVICES.filter((s) => s.active);
    const pendingServices = SERVICES.filter((s) => !s.active);
  
    // If no affiliates active yet, show a clean "coming soon" state
    if (activeServices.length === 0) {
      if (compact) {
        return (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#0A3D1F]">
            <span className="text-xs text-[#AACCB8]">📺 Where to watch:</span>
            <span className="text-xs bg-[#0A3D1F] text-[#F5C518] px-2 py-0.5 rounded font-bold">
              Coming soon
            </span>
          </div>
        );
      }
  
      return (
        <div className="bg-[#1A6B3A] rounded-xl p-4 mt-3">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold text-white">📺 Where to Watch</span>
            {group && <span className="text-xs text-[#AACCB8]">· {group}</span>}
          </div>
          <div className="flex flex-wrap gap-2">
            {pendingServices.map((s) => (
              <div
                key={s.name}
                className="flex items-center gap-1.5 bg-[#0A3D1F] px-3 py-1.5 rounded-lg opacity-50 cursor-not-allowed"
              >
                <span className="text-sm">{s.logo}</span>
                <span className="text-xs font-bold text-[#AACCB8]">{s.name}</span>
                <span className="text-xs text-[#AACCB8]">· Soon</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#AACCB8] mt-3">
            ⚡ Streaming links coming soon — we&apos;re setting up partnerships now.
          </p>
        </div>
      );
    }
  
    // Active affiliate links
    if (compact) {
      return (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#0A3D1F]">
          <span className="text-xs text-[#AACCB8]">📺 Watch on:</span>
          {activeServices.map((s) => (
            <a
              key={s.name}
              href={s.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-bold px-2 py-0.5 rounded transition-opacity hover:opacity-80"
              style={{ backgroundColor: s.color, color: s.textColor }}
            >
              {s.name}
              {s.note && <span className="ml-1 opacity-75 font-normal">· {s.note}</span>}
            </a>
          ))}
        </div>
      );
    }
  
    return (
      <div className="bg-[#1A6B3A] rounded-xl p-4 mt-3">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-sm font-bold text-white">📺 Where to Watch</span>
          {group && <span className="text-xs text-[#AACCB8]">· {group}</span>}
          {teams && teams.length === 2 && (
            <span className="text-xs text-[#AACCB8]">
              · {teams[0]} vs {teams[1]}
            </span>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          {activeServices.map((s) => (
            <a
              key={s.name}
              href={s.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-transform hover:scale-105 hover:shadow-lg"
              style={{ backgroundColor: s.color, color: s.textColor }}
            >
              <span>{s.logo}</span>
              <div>
                <div>{s.name}</div>
                {s.note && <div className="text-xs font-normal opacity-80">{s.note}</div>}
              </div>
            </a>
          ))}
        </div>
        <p className="text-xs text-[#AACCB8] mt-3">
          * Affiliate links — KnowFut may earn a commission at no cost to you.
        </p>
      </div>
    );
  }