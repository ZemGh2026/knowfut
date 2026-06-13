import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Group Standings — Full Stats | KnowFut",
  description:
    "Full FIFA World Cup 2026 group stage standings with points, wins, draws, losses, goals for, goals against, and goal difference. Updated after every match.",
};

export default function StandingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}