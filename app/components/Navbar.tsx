"use client";
import { useState } from "react";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A3D1F] border-b border-[#1A6B3A] px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">

          {/* Logo */}
          <a href="/" className="flex items-center gap-1">
            <span className="text-2xl">⚽</span>
            <span className="text-3xl font-black tracking-tight text-white">KnowFut</span>
          </a>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm text-[#AACCB8]">
            <a href="/" className="hover:text-white transition-colors">Today</a>
            <a href="/fixtures" className="hover:text-white transition-colors">Fixtures</a>
            <a href="/standings" className="hover:text-white transition-colors">Standings</a>
            <a
              href="/world-cup"
              className="flex items-center gap-1 bg-[#F5C518] text-[#0A3D1F] px-3 py-1 rounded-lg font-black text-xs hover:bg-yellow-400 transition-colors"
            >
              🏆 World Cup 2026
            </a>
            <a href="/match-time-converter" className="hover:text-white transition-colors">⏰ Time Converter</a>
          </div>

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-[#AACCB8]">EN</span>
              <span className="text-[#AACCB8]">|</span>
              <span className="text-[#F5C518] font-medium cursor-pointer">ES</span>
            </div>
            <button
              className="md:hidden flex flex-col gap-1.5 p-1"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`} />
              <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A3D1F] border-b border-[#1A6B3A] z-50">
            <div className="flex flex-col px-6 py-4 gap-4">
              <a href="/" className="text-white font-medium py-2 border-b border-[#1A6B3A]" onClick={() => setMenuOpen(false)}>
                ⚽ Today&apos;s Matches
              </a>
              <a href="/fixtures" className="text-[#AACCB8] hover:text-white py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>
                📅 Fixtures
              </a>
              <a href="/standings" className="text-[#AACCB8] hover:text-white py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>
                🏅 Standings
              </a>
              <a href="/world-cup" className="text-[#F5C518] font-black py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>
                🏆 World Cup 2026
              </a>
              <a href="/match-time-converter" className="text-[#AACCB8] hover:text-white py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>
                ⏰ Time Converter
              </a>
              <a href="/about" className="text-[#AACCB8] hover:text-white py-2 transition-colors" onClick={() => setMenuOpen(false)}>
                ℹ️ About KnowFut
              </a>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer */}
      <div className="h-[73px]" />
    </>
  );
}