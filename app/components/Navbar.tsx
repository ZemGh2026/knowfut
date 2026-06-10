"use client";
import { useState } from "react";
export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="border-b border-[#1A6B3A] px-6 py-4 relative">
      <div className="max-w-6xl mx-auto flex items-center justify-between">
        <a href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚽</span>
          <span className="text-2xl font-black tracking-tight text-white">KnowFut</span>
        </a>
        <div className="hidden md:flex items-center gap-6 text-sm text-[#AACCB8]">
          <a href="/" className="hover:text-white transition-colors">Today</a>
          <a href="/fixtures" className="hover:text-white transition-colors">Fixtures</a>
          <a href="/standings" className="hover:text-white transition-colors">Standings</a>
          <a href="/world-cup" className="hover:text-white transition-colors">World Cup</a>
        </div>
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
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "rotate-45 translate-y-2" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "opacity-0" : ""}`}></span>
            <span className={`block w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? "-rotate-45 -translate-y-2" : ""}`}></span>
          </button>
        </div>
      </div>
      {menuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-[#0A3D1F] border-b border-[#1A6B3A] z-50">
          <div className="flex flex-col px-6 py-4 gap-4">
            <a href="/" className="text-white font-medium py-2 border-b border-[#1A6B3A]" onClick={() => setMenuOpen(false)}>⚽ Today&apos;s Matches</a>
            <a href="/fixtures" className="text-[#AACCB8] hover:text-white py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>📅 Fixtures</a>
            <a href="/standings" className="text-[#AACCB8] hover:text-white py-2 border-b border-[#1A6B3A] transition-colors" onClick={() => setMenuOpen(false)}>🏆 Standings</a>
            <a href="/world-cup" className="text-[#AACCB8] hover:text-white py-2 transition-colors" onClick={() => setMenuOpen(false)}>🌍 World Cup 2026</a>
          </div>
        </div>
      )}
    </nav>
  );
}