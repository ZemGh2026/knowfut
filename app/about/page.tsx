import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "About KnowFut | Independent Football Match Guide",
  description: "KnowFut is an independent football match guide helping fans find where to watch matches, follow live scores, and stay up to date with FIFA World Cup 2026.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">

        {/* Hero */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <span className="text-4xl">⚽</span>
            <h1 className="text-2xl md:text-3xl font-black">About KnowFut</h1>
          </div>
          <p className="text-lg text-[#F5C518] font-bold mb-3">
            Know what to watch. Where to watch it. Why it matters.
          </p>
          <p className="text-[#AACCB8] leading-relaxed">
            KnowFut is an independent football match guide built for fans who want
            to follow the game without the hassle of hunting for broadcast information,
            decoding complicated streaming rights, or missing a kickoff because they
            didn&apos;t know where to look.
          </p>
        </div>

        <div className="flex flex-col gap-8 text-[#AACCB8] leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-white mb-3">What we do</h2>
            <p>
              KnowFut aggregates fixture information, live scores, and group standings
              for major football tournaments - starting with FIFA World Cup 2026. For
              every match, we show you when it kicks off in your local timezone, which
              TV channels and streaming services are carrying it, and what the result
              means for the group standings.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">What we are not</h2>
            <p>
              KnowFut does not stream matches. We are not a broadcaster, a betting
              site, or an official partner of FIFA, any league, club, or streaming
              platform. We are an independent information guide that links to official
              sources and broadcasters. Think of us as a TV guide for football - we
              tell you what&apos;s on and where, but we don&apos;t show it ourselves.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">Community predictions</h2>
            <p>
              KnowFut hosts fan opinion polls on upcoming matches. These are strictly
              community-driven votes for entertainment purposes - they reflect what
              fans think, not any statistical prediction made by KnowFut. Results are
              visible after voting and locked at kickoff.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">How we stay free</h2>
            <p>
              KnowFut is free to use. Some links on the site are affiliate links,
              which means we may earn a small commission if you sign up for a
              streaming service or VPN through one of our links - at no extra cost
              to you. This is how we keep the lights on. We only list services we
              believe are genuinely useful to football fans.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">Get in touch</h2>
            <p>
              Have feedback, a question, or want to work with us? We&apos;d love to
              hear from you.
            </p>
            <a
              href="mailto:hello@knowfut.com"
              className="inline-block mt-3 bg-[#F5C518] text-[#0A3D1F] font-black px-6 py-3 rounded-xl hover:bg-yellow-400 transition-colors"
            >
              hello@knowfut.com
            </a>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}