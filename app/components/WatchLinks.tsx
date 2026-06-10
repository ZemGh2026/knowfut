// app/components/WatchLinks.tsx
// ─────────────────────────────────────────────────────────────────────────────
// "Where to Watch" + "Can't access it? Use a VPN" affiliate component
//
// TO ACTIVATE:
// 1. Replace affiliateUrl with your real link
// 2. Set active: true
//
// Apply for VPN affiliates:
// - NordVPN:    affiliates.nordvpn.com  (accepts Bahamas ✅)
// - ExpressVPN: expressvpn.com/affiliates (accepts Bahamas ✅)
// ─────────────────────────────────────────────────────────────────────────────

interface WatchLinksProps {
    teams?: string[];
    group?: string;
    compact?: boolean;
  }
  
  interface StreamingService {
    name: string;
    logo: string;
    color: string;
    textColor: string;
    affiliateUrl: string;
    active: boolean;
    note?: string;
  }
  
  interface VpnService {
    name: string;
    logo: string;
    tagline: string;
    color: string;
    textColor: string;
    affiliateUrl: string;
    active: boolean;
    note?: string;
  }
  
  const STREAMING: StreamingService[] = [
    {
      name: "FuboTV",
      logo: "📺",
      color: "#7B2FBE",
      textColor: "#fff",
      affiliateUrl: "https://www.fubo.tv/welcome", // ← your affiliate URL
      active: false,
      note: "Free trial",
    },
    {
      name: "ESPN+",
      logo: "🏈",
      color: "#CC0000",
      textColor: "#fff",
      affiliateUrl: "https://plus.espn.com/", // ← your affiliate URL
      active: false,
      note: "From $10.99/mo",
    },
    {
      name: "DAZN",
      logo: "⚡",
      color: "#F8FF00",
      textColor: "#000",
      affiliateUrl: "https://www.dazn.com/", // ← your affiliate URL
      active: false,
      note: "200+ countries",
    },
    {
      name: "Peacock",
      logo: "🦚",
      color: "#000000",
      textColor: "#fff",
      affiliateUrl: "https://www.peacocktv.com/", // ← your affiliate URL
      active: false,
      note: "From $7.99/mo",
    },
  ];
  
  const VPNS: VpnService[] = [
    {
      name: "NordVPN",
      logo: "🔒",
      tagline: "Unblock streams from anywhere",
      color: "#4687FF",
      textColor: "#fff",
      affiliateUrl: "https://nordvpn.com/", // ← replace: affiliates.nordvpn.com
      active: false,
      note: "68% off + 3 months free",
    },
    {
      name: "ExpressVPN",
      logo: "🛡️",
      tagline: "Watch any match, any country",
      color: "#DA3940",
      textColor: "#fff",
      affiliateUrl: "https://www.expressvpn.com/", // ← replace: expressvpn.com/affiliates
      active: false,
      note: "30-day money back",
    },
  ];
  
  export default function WatchLinks({ teams, group, compact = false }: WatchLinksProps) {
    const activeStreaming = STREAMING.filter((s) => s.active);
    const activeVpns = VPNS.filter((v) => v.active);
    const pendingStreaming = STREAMING.filter((s) => !s.active);
  
    // ── COMPACT mode (match cards) ──────────────────────────────────────────
    if (compact) {
      if (activeStreaming.length === 0 && activeVpns.length === 0) {
        return (
          <div className="flex items-center gap-2 mt-2 pt-2 border-t border-[#0A3D1F]">
            <span className="text-xs text-[#AACCB8]">📺 Streaming links coming soon</span>
          </div>
        );
      }
      return (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#0A3D1F]">
          <span className="text-xs text-[#AACCB8]">📺 Watch on:</span>
          {activeStreaming.map((s) => (
            <a
              key={s.name}
              href={s.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-bold px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{ backgroundColor: s.color, color: s.textColor }}
            >
              {s.name}
            </a>
          ))}
          {activeVpns.map((v) => (
            <a
              key={v.name}
              href={v.affiliateUrl}
              target="_blank"
              rel="noopener noreferrer sponsored"
              className="text-xs font-bold px-2 py-0.5 rounded hover:opacity-80 transition-opacity"
              style={{ backgroundColor: v.color, color: v.textColor }}
            >
              🔒 {v.name}
            </a>
          ))}
        </div>
      );
    }
  
    // ── FULL mode (expanded in fixtures / match detail) ──────────────────────
    return (
      <div className="mt-3 flex flex-col gap-3">
  
        {/* Streaming services */}
        <div className="bg-[#1A6B3A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-bold">📺 Where to Watch</span>
            {group && <span className="text-xs text-[#AACCB8]">· {group}</span>}
          </div>
  
          {activeStreaming.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeStreaming.map((s) => (
                <a
                  key={s.name}
                  href={s.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-2 px-4 py-2 rounded-lg font-bold text-sm transition-transform hover:scale-105"
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
          ) : (
            <div className="flex flex-wrap gap-2">
              {pendingStreaming.map((s) => (
                <div
                  key={s.name}
                  className="flex items-center gap-2 bg-[#0A3D1F] px-3 py-1.5 rounded-lg opacity-40 cursor-not-allowed"
                >
                  <span className="text-sm">{s.logo}</span>
                  <span className="text-xs font-bold text-[#AACCB8]">{s.name}</span>
                </div>
              ))}
              <p className="w-full text-xs text-[#AACCB8] mt-1">
                ⚡ Streaming links coming soon.
              </p>
            </div>
          )}
        </div>
  
        {/* VPN section */}
        <div className="bg-[#0A3D1F] border border-[#1A6B3A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-bold text-[#F5C518]">🔒 Can't access it in your country?</span>
          </div>
          <p className="text-xs text-[#AACCB8] mb-3">
            A VPN lets you watch any match from anywhere — legally, safely, and in seconds.
          </p>
  
          {activeVpns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeVpns.map((v) => (
                <a
                  key={v.name}
                  href={v.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-sm transition-transform hover:scale-105 flex-1 min-w-[180px]"
                  style={{ backgroundColor: v.color, color: v.textColor }}
                >
                  <span className="text-lg">{v.logo}</span>
                  <div>
                    <div>{v.name}</div>
                    <div className="text-xs font-normal opacity-90">{v.note}</div>
                  </div>
                </a>
              ))}
            </div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {VPNS.map((v) => (
                <div
                  key={v.name}
                  className="flex items-center gap-2 bg-[#1A6B3A] px-3 py-1.5 rounded-lg opacity-40 cursor-not-allowed flex-1 min-w-[140px]"
                >
                  <span>{v.logo}</span>
                  <span className="text-xs font-bold text-[#AACCB8]">{v.name}</span>
                  <span className="text-xs text-[#AACCB8] ml-auto">Soon</span>
                </div>
              ))}
              <p className="w-full text-xs text-[#AACCB8] mt-1">
                🔒 VPN links coming soon — apply at affiliates.nordvpn.com
              </p>
            </div>
          )}
        </div>
  
        <p className="text-xs text-[#AACCB8] px-1">
          * Affiliate links — KnowFut may earn a small commission at no extra cost to you.
        </p>
      </div>
    );
  }