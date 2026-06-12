export default function Footer() {
  return (
    <footer className="border-t border-[#1A6B3A] px-6 py-8 mt-8">
      <div className="max-w-6xl mx-auto flex flex-col gap-4">

        {/* Disclaimer */}
        <p className="text-xs text-[#AACCB8] leading-relaxed">
          KnowFut is an independent football information site. We are not affiliated with FIFA,
          any broadcaster, streaming platform, team, or tournament organizer unless clearly stated.
          KnowFut does not stream any matches. We help fans find official TV and streaming options.
        </p>

        {/* Affiliate disclosure */}
        <p className="text-xs text-[#AACCB8]">
          Some links on this site may be affiliate links. KnowFut may earn a small commission
          at no extra cost to you.
        </p>

        {/* Links row */}
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
          <a href="/privacy" className="text-xs text-[#AACCB8] hover:text-white transition-colors">
            Privacy Policy
          </a>
          <a href="/terms" className="text-xs text-[#AACCB8] hover:text-white transition-colors">
            Terms &amp; Disclaimer
          </a>
          <a href="/about" className="text-xs text-[#AACCB8] hover:text-white transition-colors">
            About KnowFut
          </a>
          <a href="mailto:hello@knowfut.com" className="text-xs text-[#AACCB8] hover:text-white transition-colors">
            Contact
          </a>
        </div>

        {/* Social media */}
        <div className="flex items-center gap-3">
          <span className="text-xs text-[#AACCB8]">Follow us:</span>
          <a
            href="https://x.com/KnowFut"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-[#1A6B3A] hover:bg-[#2E9E58] px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" className="text-white">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.747l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
            </svg>
            <span className="text-xs text-white font-bold">@KnowFut</span>
          </a>
        </div>

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1A6B3A]">
          <span className="text-xs text-[#AACCB8]">⚽ KnowFut - Know what to watch. Where to watch it. Why it matters.</span>
          <span className="text-xs text-[#AACCB8]">© {new Date().getFullYear()} KnowFut</span>
        </div>

      </div>
    </footer>
  );
}