import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Fixtures & Schedule | KnowFut",
  description:
    "Complete FIFA World Cup 2026 fixture list by group and date. Find kickoff times in your local timezone, live scores, and where to watch every match on TV or streaming.",
};

export default function FixturesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}