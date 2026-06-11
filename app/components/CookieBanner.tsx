"use client";

import { useState, useEffect } from "react";

export default function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem("cookieConsent");
    if (!accepted) setVisible(true);
  }, []);

  const accept = () => {
    localStorage.setItem("cookieConsent", "true");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem("cookieConsent", "false");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-[#0A3D1F] border-t border-[#1A6B3A] px-6 py-4">
      <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1">
          <p className="text-sm text-white font-semibold mb-1">🍪 We use cookies</p>
          <p className="text-xs text-[#AACCB8]">
            KnowFut uses cookies to improve your experience and to support affiliate tracking.
            We do not sell your data. By continuing you agree to our use of cookies.{" "}
            <a href="/privacy" className="text-[#F5C518] underline hover:no-underline">
              Privacy Policy
            </a>
          </p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          <button
            onClick={decline}
            className="text-xs text-[#AACCB8] hover:text-white transition-colors px-3 py-1.5 rounded border border-[#1A6B3A] hover:border-[#AACCB8]"
          >
            Decline
          </button>
          <button
            onClick={accept}
            className="text-xs bg-[#F5C518] text-[#0A3D1F] font-black px-4 py-1.5 rounded hover:bg-yellow-400 transition-colors"
          >
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}