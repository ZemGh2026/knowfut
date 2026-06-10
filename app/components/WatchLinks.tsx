// app/components/WatchLinks.tsx
// ─────────────────────────────────────────────────────────────────────────────
// Three sections:
// 1. FREE options (FOX, FS1, Telemundo -no affiliate, just info)
// 2. STREAMING (paid, affiliate links)
// 3. VPN (for fans outside the US)
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
    color: string;
    textColor: string;
    affiliateUrl: string;
    active: boolean;
    note?: string;
  }
  
  // ── FREE channels (no affiliate needed, just info) ────────────────────────
  const FREE_CHANNELS = [
    { name: "FOX", note: "70 matches · Free over air", logo: "📡" },
    { name: "FS1", note: "34 matches · Cable/antenna", logo: "📡" },
    { name: "Telemundo", note: "Spanish · Free over air", logo: "📡" },
    { name: "Universo", note: "Spanish · Cable", logo: "📡" },
  ];
  
  // ── PAID streaming (affiliate links) ─────────────────────────────────────
  const STREAMING: StreamingService[] = [
    {
      name: "FOX One",
      logo: "🦊",
      color: "#003087",
      textColor: "#fff",
      affiliateUrl: "https://www.fox.com/foxone/",
      active: true,
      note: "$19.99/mo · All 104 matches",
    },
    {
      name: "FuboTV",
      logo: "📺",
      color: "#7B2FBE",
      textColor: "#fff",
      affiliateUrl: "https://www.fubo.tv/welcome", // ← replace with affiliate URL when approved
      active: false,
      note: "Free trial · FOX + FS1",
    },
    {
      name: "Hulu Live",
      logo: "🟢",
      color: "#1CE783",
      textColor: "#000",
      affiliateUrl: "https://www.hulu.com/live-tv", // ← replace with affiliate URL when approved
      active: false,
      note: "FOX + FS1 included",
    },
    {
      name: "YouTube TV",
      logo: "▶️",
      color: "#FF0000",
      textColor: "#fff",
      affiliateUrl: "https://tv.youtube.com/", // ← replace with affiliate URL when approved
      active: false,
      note: "FOX + FS1 included",
    },
    {
      name: "Peacock",
      logo: "🦚",
      color: "#000000",
      textColor: "#fff",
      affiliateUrl: "https://www.peacocktv.com/",
      active: true,
      note: "$7.99/mo · Spanish coverage",
    },
    {
      name: "DAZN",
      logo: "⚡",
      color: "#F8FF00",
      textColor: "#000",
      affiliateUrl: "https://www.dazn.com/",
      active: true,
      note: "200+ countries",
    },
  ];
  
  // ── VPN (affiliate links -apply at affiliates.nordvpn.com & expressvpn.com/affiliates)
  const VPNS: VpnService[] = [
      {
        name: "NordVPN",
        logo: "🔒",
        color: "#4687FF",
        textColor: "#fff",
        affiliateUrl: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150196&url_id=902", // ← your real link
        active: true, // ← flip to true
        note: "68% off + 3 months free",
      },
    {
      name: "ExpressVPN",
      logo: "🛡️",
      color: "#DA3940",
      textColor: "#fff",
      affiliateUrl: "https://www.expressvpn.com/", // ← replace with your ExpressVPN affiliate URL
      active: false,
      note: "30-day money back",
    },
  ];
  
  export default function WatchLinks({ teams, group, compact = false }: WatchLinksProps) {
    const activeStreaming = STREAMING.filter((s) => s.active);
    const activeVpns = VPNS.filter((v) => v.active);
  
    // ── COMPACT mode ──────────────────────────────────────────────────────────
    if (compact) {
      return (
        <div className="flex flex-wrap items-center gap-2 mt-2 pt-2 border-t border-[#0A3D1F]">
          <span className="text-xs text-[#AACCB8]">📺</span>
          <span className="text-xs bg-[#0A3D1F] text-white px-2 py-0.5 rounded font-bold">FOX</span>
          <span className="text-xs bg-[#0A3D1F] text-white px-2 py-0.5 rounded font-bold">FS1</span>
          <span className="text-xs bg-[#0A3D1F] text-[#AACCB8] px-2 py-0.5 rounded">Telemundo</span>
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
  
    // ── FULL mode ─────────────────────────────────────────────────────────────
    return (
      <div className="mt-3 flex flex-col gap-3">
  
        {/* 1. FREE channels */}
        <div className="bg-[#1A6B3A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-wide">
              FREE
            </span>
            <span className="text-sm font-bold">Watch for free (US)</span>
          </div>
          <div className="flex flex-wrap gap-2 mb-2">
            {FREE_CHANNELS.map((ch) => (
              <div
                key={ch.name}
                className="bg-[#0A3D1F] rounded-lg px-3 py-2 flex flex-col"
              >
                <span className="font-black text-sm text-white">{ch.name}</span>
                <span className="text-xs text-[#AACCB8] mt-0.5">{ch.note}</span>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#AACCB8]">
            📡 FOX & Telemundo are free with a TV antenna in the US. No subscription needed.
          </p>
        </div>
  
        {/* 2. PAID streaming */}
        <div className="bg-[#1A6B3A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs bg-[#F5C518] text-[#0A3D1F] px-2 py-0.5 rounded font-black uppercase tracking-wide">
              STREAMING
            </span>
            <span className="text-sm font-bold">Watch online (subscription)</span>
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
            <>
              <div className="flex flex-wrap gap-2">
                {STREAMING.map((s) => (
                  <div
                    key={s.name}
                    className="flex items-center gap-2 bg-[#0A3D1F] px-3 py-1.5 rounded-lg opacity-40 cursor-not-allowed"
                  >
                    <span className="text-sm">{s.logo}</span>
                    <div>
                      <div className="text-xs font-bold text-[#AACCB8]">{s.name}</div>
                      {s.note && <div className="text-xs text-[#AACCB8] opacity-75">{s.note}</div>}
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#AACCB8] mt-2">
                ⚡ Direct streaming links coming soon.
              </p>
            </>
          )}
        </div>
  
        {/* 3. VPN */}
        <div className="bg-[#0A3D1F] border border-[#1A6B3A] rounded-xl p-4">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wide">
              OUTSIDE US?
            </span>
            <span className="text-sm font-bold text-[#F5C518]">Unlock any stream with a VPN</span>
          </div>
          <p className="text-xs text-[#AACCB8] mb-3">
            FOX, FS1 and Telemundo are geo-blocked outside the US. A VPN connects you through a US server so you can watch any match -legally and safely.
          </p>
          {activeVpns.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {activeVpns.map((v) => (
                <a
                  key={v.name}
                  href={v.affiliateUrl}
                  target="_blank"
                  rel="noopener noreferrer sponsored"
                  className="flex items-center gap-3 px-4 py-2.5 rounded-lg font-bold text-sm transition-transform hover:scale-105 flex-1 min-w-[160px]"
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
            <>
              <div className="flex flex-wrap gap-2">
                {VPNS.map((v) => (
                  <div
                    key={v.name}
                    className="flex items-center gap-2 bg-[#1A6B3A] px-3 py-2 rounded-lg opacity-40 cursor-not-allowed flex-1 min-w-[140px]"
                  >
                    <span>{v.logo}</span>
                    <div>
                      <div className="text-xs font-bold">{v.name}</div>
                      <div className="text-xs text-[#AACCB8]">{v.note}</div>
                    </div>
                  </div>
                ))}
              </div>
              <p className="text-xs text-[#AACCB8] mt-2">
                🔒 VPN links coming soon -approvals pending.
              </p>
            </>
          )}
        </div>
  
        <p className="text-xs text-[#AACCB8] px-1">
          * Streaming and VPN links may be affiliate links -KnowFut may earn a small commission at no extra cost to you.
        </p>
      </div>
    );
  }