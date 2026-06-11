import Navbar from "../components/Navbar";

export const metadata = {
  title: "Privacy Policy | KnowFut",
  description: "KnowFut privacy policy - how we collect, use, and protect your data.",
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#0A3D1F] text-white">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 py-12">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-3xl font-black mb-2">Privacy Policy</h1>
          <p className="text-[#AACCB8] text-sm">Last updated: June 11, 2026</p>
        </div>

        <div className="flex flex-col gap-8 text-[#AACCB8] text-sm leading-relaxed">

          {/* Introduction */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">1. Introduction</h2>
            <p>
              Welcome to KnowFut ("we", "our", or "us"). KnowFut is a soccer match guide 
              available at knowfut.com. We are committed to protecting your privacy. This 
              Privacy Policy explains how we collect, use, and safeguard information when 
              you visit our website.
            </p>
          </section>

          {/* Information We Collect */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">2. Information We Collect</h2>
            <p className="mb-3">We do not require you to create an account or provide personal information to use KnowFut. However, we may collect the following automatically:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><span className="text-white font-semibold">Usage data</span> - pages visited, time spent, browser type, and device information via analytics tools.</li>
              <li><span className="text-white font-semibold">Cookies</span> - small files stored on your device to remember your preferences (such as cookie consent).</li>
              <li><span className="text-white font-semibold">Affiliate tracking</span> - if you click an affiliate link, our partners may set cookies to track referrals.</li>
            </ul>
          </section>

          {/* Cookies */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">3. Cookies</h2>
            <p className="mb-3">KnowFut uses cookies for the following purposes:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li><span className="text-white font-semibold">Functional cookies</span> - to remember your cookie consent preference.</li>
              <li><span className="text-white font-semibold">Analytics cookies</span> - to understand how visitors use our site (e.g. Google Analytics).</li>
              <li><span className="text-white font-semibold">Affiliate cookies</span> - set by third-party partners (NordVPN, ESPN+, etc.) when you click their links.</li>
            </ul>
            <p className="mt-3">You can decline cookies using the banner on your first visit. Note that declining may affect some site functionality.</p>
          </section>

          {/* Affiliate Links */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">4. Affiliate Links</h2>
            <p>
              KnowFut participates in affiliate programs. This means we may earn a commission 
              when you click a link and make a purchase - at no extra cost to you. We only 
              recommend services we believe are genuinely useful to soccer fans. Affiliate 
              relationships do not influence our match guides or editorial content.
            </p>
          </section>

          {/* Third Party Services */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">5. Third-Party Services</h2>
            <p className="mb-3">KnowFut may link to or integrate with third-party services including:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>NordVPN, ExpressVPN, FuboTV, ESPN+, Hulu, Peacock, DAZN, Paramount+, FOX One</li>
              <li>Google Analytics (website analytics)</li>
              <li>Google AdSense (advertising)</li>
            </ul>
            <p className="mt-3">These services have their own privacy policies which we encourage you to review.</p>
          </section>

          {/* Data Sharing */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">6. Data Sharing</h2>
            <p>
              We do not sell, trade, or rent your personal data to third parties. 
              We do not collect sensitive personal information such as names, email addresses, 
              or payment details directly on KnowFut.
            </p>
          </section>

          {/* GDPR */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">7. Your Rights (GDPR & CCPA)</h2>
            <p className="mb-3">Depending on your location, you may have the right to:</p>
            <ul className="list-disc pl-5 flex flex-col gap-2">
              <li>Access the data we hold about you</li>
              <li>Request deletion of your data</li>
              <li>Opt out of analytics tracking</li>
              <li>Withdraw cookie consent at any time by clearing your browser cookies</li>
            </ul>
          </section>

          {/* Children */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">8. Children's Privacy</h2>
            <p>
              KnowFut is not directed at children under the age of 13. We do not knowingly 
              collect personal information from children.
            </p>
          </section>

          {/* Changes */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">9. Changes to This Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted 
              on this page with an updated date. Continued use of KnowFut after changes 
              constitutes acceptance of the updated policy.
            </p>
          </section>

          {/* Contact */}
          <section>
            <h2 className="text-white font-bold text-lg mb-3">10. Contact Us</h2>
            <p>
              If you have any questions about this Privacy Policy, please contact us at:{" "}
              <span className="text-[#F5C518]">privacy (at) knowfut.com</span>
            </p>
          </section>

        </div>
      </div>

      <footer className="border-t border-[#1A6B3A] px-6 py-6 mt-8">
        <div className="max-w-3xl mx-auto flex items-center justify-between text-sm text-[#AACCB8]">
          <span>⚽ KnowFut - Know the game.</span>
          <span>© 2026 KnowFut</span>
        </div>
      </footer>
    </div>
  );
}