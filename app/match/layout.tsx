import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Match Details | KnowFut",
  description: "FIFA World Cup 2026 match details — kickoff time, venue, group standings, and where to watch legally.",
};

export default function MatchLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}