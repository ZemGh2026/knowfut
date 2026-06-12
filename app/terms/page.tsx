import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export const metadata = {
  title: "Terms & Disclaimer | KnowFut",
  description: "Terms of use and disclaimer for KnowFut, an independent football match guide.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-black mb-2">Terms &amp; Disclaimer</h1>
        <p className="text-[#AACCB8] text-sm mb-10">Last updated: June 2026</p>

        <div className="flex flex-col gap-8 text-[#AACCB8] leading-relaxed">

          <section>
            <h2 className="text-lg font-black text-white mb-3">1. About KnowFut</h2>
            <p>
              KnowFut is an independent football information and match guide. We provide
              fixtures, live scores, standings, and information about where to watch matches
              on official TV and streaming platforms. KnowFut is not affiliated with FIFA,
              any broadcaster, streaming platform, football club, league, or tournament
              organizer unless clearly stated.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">2. No Streaming</h2>
            <p>
              KnowFut does not host, stream, or distribute any football matches or
              broadcast content. We are a match guide only. All links on this site
              direct users to official third-party broadcasters and streaming services.
              We have no control over the content, availability, or pricing of those
              external services.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">3. Broadcast Availability</h2>
            <p>
              Broadcasting rights vary by country and region. The TV and streaming
              options listed on KnowFut are provided as general information only and
              may not reflect availability in your specific location. Always check
              with your local broadcaster or streaming provider to confirm availability
              and pricing in your region.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">4. VPN Information</h2>
            <p>
              Any VPN services mentioned on KnowFut are listed for informational
              purposes only. The use of a VPN to access geo-restricted content may
              violate the terms of service of the broadcaster or streaming platform
              in question. It is your responsibility to ensure compliance with
              applicable laws and service terms in your location. KnowFut does not
              encourage or endorse bypassing any geo-restrictions.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">5. Affiliate Links</h2>
            <p>
              Some links on KnowFut may be affiliate links. This means we may earn a
              small commission if you purchase a product or service through one of
              these links, at no extra cost to you. Affiliate relationships do not
              influence our editorial content or the accuracy of the information
              we provide.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">6. Community Predictions</h2>
            <p>
              The community prediction polls on KnowFut are fan opinion polls only.
              They are not predictions made by KnowFut, nor are they based on any
              statistical model or algorithm. KnowFut accepts no responsibility for
              the accuracy of community predictions. These polls are strictly for
              entertainment purposes and must not be used for any betting or
              gambling activity.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">7. Accuracy of Information</h2>
            <p>
              KnowFut makes every effort to provide accurate and up-to-date match
              information, scores, and fixtures. However, we cannot guarantee the
              accuracy or completeness of this information at all times. Match data
              is sourced from third-party APIs and may be subject to delays or errors.
              Always refer to official sources for confirmed match results and schedules.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">8. Limitation of Liability</h2>
            <p>
              KnowFut is provided on an &quot;as is&quot; basis without any warranties of any
              kind. We are not liable for any direct or indirect damages arising from
              the use of this site or reliance on the information provided herein.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">9. Changes to These Terms</h2>
            <p>
              We may update these terms from time to time. Continued use of KnowFut
              after any changes constitutes your acceptance of the updated terms.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-black text-white mb-3">10. Contact</h2>
            <p>
              If you have any questions about these terms, please contact us at{" "}
              <a href="mailto:hello@knowfut.com" className="text-[#F5C518] hover:underline">
                hello@knowfut.com
              </a>
            </p>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}