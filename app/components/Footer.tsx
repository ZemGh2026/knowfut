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

        {/* Bottom bar */}
        <div className="flex items-center justify-between pt-2 border-t border-[#1A6B3A]">
          <span className="text-xs text-[#AACCB8]">⚽ KnowFut - Know what to watch. Where to watch it. Why it matters.</span>
          <span className="text-xs text-[#AACCB8]">© {new Date().getFullYear()} KnowFut</span>
        </div>

      </div>
    </footer>
  );
}