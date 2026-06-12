"use client";

import { useEffect, useState, useRef } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PollData {
  votes_home: number;
  votes_draw: number;
  votes_away: number;
  voter_names: string[];
  total: number;
}

type VoteChoice = "home" | "draw" | "away";

interface Props {
  fixtureId: number;
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // ISO string
  isLive: boolean;
  isFinished: boolean;
  homeGoals: number | null;
  awayGoals: number | null;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function pct(votes: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((votes / total) * 100);
}

function storageKey(fixtureId: number) {
  return `knowfut_vote_${fixtureId}`;
}

function getStoredVote(fixtureId: number): VoteChoice | null {
  try {
    return localStorage.getItem(storageKey(fixtureId)) as VoteChoice | null;
  } catch {
    return null;
  }
}

function storeVote(fixtureId: number, vote: VoteChoice) {
  try {
    localStorage.setItem(storageKey(fixtureId), vote);
  } catch {}
}

function getStoredName(): string {
  try {
    return localStorage.getItem("knowfut_username") ?? "";
  } catch {
    return "";
  }
}

function storeName(name: string) {
  try {
    localStorage.setItem("knowfut_username", name);
  } catch {}
}

// ─── Countdown ────────────────────────────────────────────────────────────────

function useCountdown(kickoff: string) {
  const [secondsLeft, setSecondsLeft] = useState<number>(() => {
    return Math.max(0, Math.floor((new Date(kickoff).getTime() - Date.now()) / 1000));
  });

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const interval = setInterval(() => {
      const left = Math.max(0, Math.floor((new Date(kickoff).getTime() - Date.now()) / 1000));
      setSecondsLeft(left);
    }, 1000);
    return () => clearInterval(interval);
  }, [kickoff]);

  return secondsLeft;
}

function CountdownBadge({ seconds }: { seconds: number }) {
  if (seconds <= 0) return null;
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  // Only show within 30 minutes
  if (seconds > 30 * 60) return null;

  return (
    <div className="flex items-center justify-center gap-2 mb-4">
      <span className="w-2 h-2 bg-[#F5C518] rounded-full animate-pulse" />
      <span className="text-[#F5C518] font-bold text-sm">
        Voting closes in {h > 0 ? `${pad(h)}:` : ""}{pad(m)}:{pad(s)}
      </span>
    </div>
  );
}

// ─── Results Bar ──────────────────────────────────────────────────────────────

function ResultBar({
  label,
  votes,
  total,
  color,
  isMyVote,
  isWinner,
}: {
  label: string;
  votes: number;
  total: number;
  color: string;
  isMyVote: boolean;
  isWinner: boolean;
}) {
  const percentage = pct(votes, total);

  return (
    <div className={`rounded-xl p-3 ${isMyVote ? "bg-[#0d4a25] ring-2 ring-[#F5C518]" : "bg-[#0A3D1F]"}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold text-white truncate max-w-[120px]">
            {label}
          </span>
          {isMyVote && (
            <span className="text-xs bg-[#F5C518] text-[#0A3D1F] px-1.5 py-0.5 rounded font-bold">
              YOUR VOTE
            </span>
          )}
          {isWinner && total > 0 && (
            <span className="text-xs">👑</span>
          )}
        </div>
        <span className={`font-black text-lg tabular-nums ${color}`}>
          {percentage}%
        </span>
      </div>
      {/* Progress bar */}
      <div className="h-2 bg-[#1A6B3A] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ease-out ${
            color === "text-[#F5C518]"
              ? "bg-[#F5C518]"
              : color === "text-[#AACCB8]"
              ? "bg-[#AACCB8]"
              : "bg-blue-400"
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="text-xs text-[#AACCB8] mt-1">{votes} vote{votes !== 1 ? "s" : ""}</div>
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function MatchPoll({
  fixtureId,
  homeTeam,
  awayTeam,
  kickoff,
  isLive,
  isFinished,
  homeGoals,
  awayGoals,
}: Props) {
  const [poll, setPoll] = useState<PollData | null>(null);
  const [myVote, setMyVote] = useState<VoteChoice | null>(null);
  const [name, setName] = useState("");
  const [nameInput, setNameInput] = useState("");
  const [step, setStep] = useState<"name" | "vote" | "results">("name");
  const [submitting, setSubmitting] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const secondsLeft = useCountdown(kickoff);
  const pollLocked = isLive || isFinished || secondsLeft === 0;

  // Load stored name + vote on mount
  useEffect(() => {
    const storedName = getStoredName();
    const storedVote = getStoredVote(fixtureId);
    if (storedName) {
      setName(storedName);
      setNameInput(storedName);
    }
    if (storedVote) {
      setMyVote(storedVote);
      setStep("results");
      setRevealed(true);
    } else if (storedName) {
      setStep("vote");
    }
  }, [fixtureId]);

  // Fetch poll data
  useEffect(() => {
    async function fetchPoll() {
      try {
        const res = await fetch(`/api/poll/${fixtureId}`);
        if (res.ok) setPoll(await res.json());
      } catch {}
    }
    fetchPoll();
    // Refresh every 30s if locked (live/finished) to show live tallies
    if (pollLocked) {
      const interval = setInterval(fetchPoll, 30_000);
      return () => clearInterval(interval);
    }
  }, [fixtureId, pollLocked]);

  // If locked and no vote, still show results
  useEffect(() => {
    if (pollLocked && step !== "results") {
      setStep("results");
      setRevealed(true);
    }
  }, [pollLocked]);

  async function handleVote(choice: VoteChoice) {
    if (submitting || !name) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/poll/${fixtureId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vote: choice, name }),
      });
      if (res.ok) {
        const data = await res.json();
        setPoll(data);
        setMyVote(choice);
        storeVote(fixtureId, choice);
        setStep("results");
        // Small delay for animation
        setTimeout(() => setRevealed(true), 100);
      }
    } catch {}
    setSubmitting(false);
  }

  function handleNameSubmit() {
    const trimmed = nameInput.trim();
    if (!trimmed) return;
    storeName(trimmed);
    setName(trimmed);
    setStep("vote");
  }

  const total = poll?.total ?? 0;
  const homePct = pct(poll?.votes_home ?? 0, total);
  const drawPct = pct(poll?.votes_draw ?? 0, total);
  const awayPct = pct(poll?.votes_away ?? 0, total);
  const winnerChoice =
    homePct >= drawPct && homePct >= awayPct
      ? "home"
      : awayPct >= drawPct && awayPct >= homePct
      ? "away"
      : "draw";

  // Actual match result for post-match comparison
  const actualWinner =
    isFinished && homeGoals !== null && awayGoals !== null
      ? homeGoals > awayGoals
        ? "home"
        : awayGoals > homeGoals
        ? "away"
        : "draw"
      : null;

  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#0A3D1F] flex items-center justify-between">
        <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          🗳️ Community Prediction
        </span>
        {total > 0 && (
          <span className="text-xs text-[#AACCB8]">{total} vote{total !== 1 ? "s" : ""}</span>
        )}
      </div>

      <div className="p-4">
        {/* Countdown */}
        <CountdownBadge seconds={secondsLeft} />

        {/* Post-match result comparison */}
        {isFinished && actualWinner && poll && total > 0 && (
          <div className={`mb-4 rounded-xl px-4 py-3 text-sm font-bold text-center ${
            actualWinner === winnerChoice
              ? "bg-green-900 text-green-400"
              : "bg-[#0A3D1F] text-[#AACCB8]"
          }`}>
            {actualWinner === winnerChoice
              ? "✅ Community got it right!"
              : `❌ Community predicted ${winnerChoice === "home" ? homeTeam : winnerChoice === "away" ? awayTeam : "Draw"} — actual result: ${actualWinner === "home" ? homeTeam : actualWinner === "away" ? awayTeam : "Draw"}`
            }
          </div>
        )}

        {/* Locked banner */}
        {pollLocked && !isFinished && (
          <div className="mb-4 bg-[#0A3D1F] rounded-xl px-4 py-2 text-xs text-[#AACCB8] text-center">
            🔒 Voting closed at kickoff · Final community predictions below
          </div>
        )}

        {/* ── Step 1: Name input ── */}
        {step === "name" && !pollLocked && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-white font-bold text-center">
              Who do you think wins? Enter your name to vote:
            </p>
            <input
              type="text"
              value={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleNameSubmit()}
              placeholder="Your nickname..."
              maxLength={20}
              className="bg-[#0A3D1F] text-white placeholder-[#AACCB8] rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#F5C518] w-full"
            />
            <button
              onClick={handleNameSubmit}
              disabled={!nameInput.trim()}
              className="bg-[#F5C518] text-[#0A3D1F] font-black py-3 rounded-xl text-sm hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Let's vote →
            </button>
          </div>
        )}

        {/* ── Step 2: Vote buttons ── */}
        {step === "vote" && !pollLocked && (
          <div className="flex flex-col gap-3">
            <p className="text-sm text-[#AACCB8] text-center">
              Voting as <span className="text-white font-bold">{name}</span> · Who wins?
            </p>
            <div className="grid grid-cols-3 gap-2">
              {/* Home */}
              <button
                onClick={() => handleVote("home")}
                disabled={submitting}
                className="bg-[#0A3D1F] hover:bg-[#0d4a25] border-2 border-transparent hover:border-[#F5C518] rounded-xl px-2 py-4 flex flex-col items-center gap-2 transition-all disabled:opacity-50"
              >
                <span className="font-black text-xs text-center leading-tight text-white">
                  {homeTeam}
                </span>
                <span className="text-[#F5C518] text-xs font-bold">Win</span>
              </button>

              {/* Draw */}
              <button
                onClick={() => handleVote("draw")}
                disabled={submitting}
                className="bg-[#0A3D1F] hover:bg-[#0d4a25] border-2 border-transparent hover:border-[#AACCB8] rounded-xl px-2 py-4 flex flex-col items-center gap-2 transition-all disabled:opacity-50"
              >
                <span className="text-2xl">🤝</span>
                <span className="text-[#AACCB8] text-xs font-bold">Draw</span>
              </button>

              {/* Away */}
              <button
                onClick={() => handleVote("away")}
                disabled={submitting}
                className="bg-[#0A3D1F] hover:bg-[#0d4a25] border-2 border-transparent hover:border-blue-400 rounded-xl px-2 py-4 flex flex-col items-center gap-2 transition-all disabled:opacity-50"
              >
                <span className="font-black text-xs text-center leading-tight text-white">
                  {awayTeam}
                </span>
                <span className="text-blue-400 text-xs font-bold">Win</span>
              </button>
            </div>
            <button
              onClick={() => { setStep("name"); setName(""); setNameInput(""); }}
              className="text-xs text-[#AACCB8] hover:text-white text-center transition-colors"
            >
              ← Change name
            </button>
          </div>
        )}

        {/* ── Step 3: Results ── */}
        {step === "results" && (
          <div className={`flex flex-col gap-3 transition-opacity duration-500 ${revealed ? "opacity-100" : "opacity-0"}`}>
            {total === 0 ? (
              <p className="text-center text-[#AACCB8] text-sm py-4">
                No votes yet — be the first!
              </p>
            ) : (
              <>
                <ResultBar
                  label={homeTeam}
                  votes={poll?.votes_home ?? 0}
                  total={total}
                  color="text-[#F5C518]"
                  isMyVote={myVote === "home"}
                  isWinner={winnerChoice === "home"}
                />
                <ResultBar
                  label="Draw"
                  votes={poll?.votes_draw ?? 0}
                  total={total}
                  color="text-[#AACCB8]"
                  isMyVote={myVote === "draw"}
                  isWinner={winnerChoice === "draw"}
                />
                <ResultBar
                  label={awayTeam}
                  votes={poll?.votes_away ?? 0}
                  total={total}
                  color="text-blue-400"
                  isMyVote={myVote === "away"}
                  isWinner={winnerChoice === "away"}
                />
              </>
            )}

            {/* Recent voters */}
            {poll && poll.voter_names.length > 0 && (
              <p className="text-xs text-[#AACCB8] text-center mt-1">
                Recent: {poll.voter_names.join(", ")}
                {total > 5 ? ` and ${total - 5} others` : ""}
              </p>
            )}

            {/* Change vote option — only if not locked */}
            {!pollLocked && myVote && (
              <button
                onClick={() => {
                  setMyVote(null);
                  setRevealed(false);
                  try { localStorage.removeItem(storageKey(fixtureId)); } catch {}
                  setStep("vote");
                }}
                className="text-xs text-[#AACCB8] hover:text-white text-center transition-colors"
              >
                Change my vote
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}