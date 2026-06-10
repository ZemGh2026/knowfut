import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FIFA World Cup 2026 Schedule & Groups | KnowFut",
  description: "Full FIFA World Cup 2026 group stage schedule with kickoff times, venues, and flags. All 12 groups in one place.",
};

export default function WorldCupLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}