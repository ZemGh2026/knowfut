// app/components/WatchLinks.tsx

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

const FREE_CHANNELS = [
  { name: "FOX", note: "70 matches · Free over air" },
  { name: "FS1", note: "34 matches · Cable/antenna" },
  { name: "Telemundo", note: "Spanish · Free over air" },
  { name: "Universo", note: "Spanish · Cable" },
];

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
    affiliateUrl: "https://www.fubo.tv/welcome",
    active: true,
    note: "Free trial · FOX + FS1",
  },
  {
    name: "Hulu Live",
    logo: "🟢",
    color: "#1CE783",
    textColor: "#000",
    affiliateUrl: "https://www.hulu.com/live-tv",
    active: true,
    note: "FOX + FS1 included",
  },
  {
    name: "YouTube TV",
    logo: "▶️",
    color: "#FF0000",
    textColor: "#fff",
    affiliateUrl: "https://tv.youtube.com/",
    active: true,
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

const VPNS: VpnService[] = [
  {
    name: "NordVPN",
    logo: "🔒",
    color: "#4687FF",
    textColor: "#fff",
    affiliateUrl: "https://go.nordvpn.net/aff_c?offer_id=15&aff_id=150196&url_id=902",
    active: true,
    note: "68% off + 3 months free",
  },
  {
    name: "ExpressVPN",
    logo: "🛡️",
    color: "#DA3940",
    textColor: "#fff",
    affiliateUrl: "https://www.expressvpn.com/",
    active: false,
    note: "30-day money back",
  },
];

export default function WatchLinks({ teams, group, compact = false }: WatchLinksProps) {
  const activeStreaming = STREAMING.filter((s) => s.active);
  const activeVpns = VPNS.filter((v) => v.active);

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

  return (
    <div className="mt-3 flex flex-col gap-3">

      {/* 1. FREE channels */}
      <div className="bg-[#1A6B3A] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-black uppercase tracking-wide">
            ON TV
          </span>
          <span className="text-sm font-bold">Watch on television (US)</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-2">
          {FREE_CHANNELS.map((ch) => (
            <div key={ch.name} className="bg-[#0A3D1F] rounded-lg px-3 py-2 flex flex-col">
              <span className="font-black text-sm text-white">{ch.name}</span>
              <span className="text-xs text-[#AACCB8] mt-0.5">{ch.note}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-[#AACCB8]">
          📡 FOX and Telemundo may be available over-the-air in the US with a compatible antenna. Cable and satellite subscribers may have access through their provider. Check your local listings for availability.
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
      </div>

      {/* 3. VPN — reworded for compliance */}
      <div className="bg-[#0A3D1F] border border-[#1A6B3A] rounded-xl p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded font-black uppercase tracking-wide">
            OUTSIDE THE US?
          </span>
        </div>
        <p className="text-xs text-[#AACCB8] mb-3">
          Some broadcasters and streaming services may only be available in certain countries.
          Please check the official broadcaster or streaming provider available in your location.
          VPN availability depends on each service&apos;s terms and local regulations.
        </p>
        {activeVpns.length > 0 && (
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
        )}
      </div>

      {/* Disclaimers */}
      <div className="flex flex-col gap-1.5 px-1">
        <p className="text-xs text-[#AACCB8]">
          ⚠️ KnowFut does not stream any matches. We are an independent football match guide that helps fans find official TV and streaming options.
        </p>
        <p className="text-xs text-[#AACCB8]">
          * Some links may be affiliate links. KnowFut may earn a small commission at no extra cost to you.
        </p>
      </div>

    </div>
  );
}