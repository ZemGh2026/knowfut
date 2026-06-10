import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import 'flag-icons/css/flag-icons.min.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "KnowFut - Today's Soccer Matches, Watch Guide & Match Meaning",
  description: "KnowFut helps soccer fans find today's matches, legal watch options, kickoff times, fixtures, standings, and simple match guides.",
  verification: {
    other: {
      "impact-site-verification": "2eb30f47-8fe9-4826-a274-582ffeb7722c'", // ← paste the value Impact gives you
    },
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
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
