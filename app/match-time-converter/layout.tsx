import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Football Match Time Converter — World Cup 2026 Kickoff Times | KnowFut",
  description:
    "Convert FIFA World Cup 2026 kickoff times to your local timezone. See match times for USA, UK, Brazil, Portugal, South Africa, Bahamas and 20+ countries.",
};

export default function MatchTimeConverterLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}