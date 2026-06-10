import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Standings | KnowFut",
  description: "Live FIFA World Cup 2026 group standings. Points, goal difference, and qualification status updated after every match.",
};

export default function StandingsLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}