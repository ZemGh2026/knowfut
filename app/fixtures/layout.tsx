import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Fixtures | KnowFut",
  description: "Complete FIFA World Cup 2026 fixture list sorted by date. Find kickoff times in your local timezone and where to watch every match.",
};

export default function FixturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}