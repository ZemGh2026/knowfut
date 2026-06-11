export default function Footer() {
    return (
      <footer className="border-t border-[#1A6B3A] px-6 py-6 mt-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[#AACCB8]">
          <span>⚽ KnowFut - Know the game.</span>
          <span>© {new Date().getFullYear()} KnowFut</span>
        </div>
      </footer>
    );
  }