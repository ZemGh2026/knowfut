import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';
import CookieBanner from "./components/CookieBanner";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Today's Football Matches - Live Scores & Where to Watch | KnowFut",
  description:
    "See today's football matches, live scores, kickoff times, fixtures, and where to watch games on TV or streaming. Follow World Cup 2026, Premier League, Champions League, MLS, LaLiga, and more.",
  keywords:
    "football matches today, live scores, where to watch football, World Cup 2026, Premier League, Champions League, MLS, LaLiga, Serie A, Bundesliga, kickoff times, football fixtures",
  openGraph: {
    title: "Today's Football Matches - Live Scores & Where to Watch | KnowFut",
    description:
      "Live scores, kickoff times, fixtures, and where to watch today's football matches - including World Cup 2026 and top football competitions all year round.",
    url: "https://knowfut.com",
    siteName: "KnowFut",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Today's Football Matches - Live Scores & Where to Watch | KnowFut",
    description:
      "Live scores, kickoff times, fixtures, and where to watch today's football matches - including World Cup 2026 and top competitions.",
    site: "@KnowFut",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="fo-verify" content="42d358a2-aa08-43ba-8494-cc94e083f72e" />
      </head>
      <body className="min-h-full flex flex-col">
        {children}
        <CookieBanner />
      </body>
    </html>
  );
}