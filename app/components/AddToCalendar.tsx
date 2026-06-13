"use client";

// ─── Add to Calendar Component ────────────────────────────────────────────────
// Supports: Google Calendar, Apple Calendar (.ics), Outlook (.ics)

interface AddToCalendarProps {
  homeTeam: string;
  awayTeam: string;
  kickoff: string; // ISO UTC string
  venue: string;
  city: string;
  round: string;
  matchUrl: string;
}

function formatICSDate(iso: string): string {
  // Format: 20260613T180000Z
  return iso.replace(/[-:]/g, "").replace(".000", "").replace("Z", "Z");
}

function generateICS(props: AddToCalendarProps): string {
  const start = formatICSDate(props.kickoff);
  // Add 2 hours for end time
  const endDate = new Date(new Date(props.kickoff).getTime() + 2 * 60 * 60 * 1000);
  const end = formatICSDate(endDate.toISOString());

  const title = `${props.homeTeam} vs ${props.awayTeam} — FIFA World Cup 2026`;
  const description = `${props.round} · Watch at ${props.matchUrl}`;
  const location = props.city
    ? `${props.venue}, ${props.city}`
    : props.venue;

  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//KnowFut//Football Match//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `DTSTART:${start}`,
    `DTEND:${end}`,
    `SUMMARY:${title}`,
    `DESCRIPTION:${description}`,
    `LOCATION:${location}`,
    `URL:${props.matchUrl}`,
    "STATUS:CONFIRMED",
    `UID:knowfut-${start}-${props.homeTeam}-${props.awayTeam}@knowfut.com`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

function generateGoogleCalendarUrl(props: AddToCalendarProps): string {
  const start = formatICSDate(props.kickoff);
  const endDate = new Date(new Date(props.kickoff).getTime() + 2 * 60 * 60 * 1000);
  const end = formatICSDate(endDate.toISOString());
  const title = encodeURIComponent(`${props.homeTeam} vs ${props.awayTeam} — FIFA World Cup 2026`);
  const details = encodeURIComponent(`${props.round}\nWatch live: ${props.matchUrl}`);
  const location = encodeURIComponent(props.city ? `${props.venue}, ${props.city}` : props.venue);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`;
}

function downloadICS(props: AddToCalendarProps) {
  const ics = generateICS(props);
  const blob = new Blob([ics], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${props.homeTeam}-vs-${props.awayTeam}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export default function AddToCalendar(props: AddToCalendarProps) {
  const isFinished =
    new Date(props.kickoff).getTime() < Date.now() - 2 * 60 * 60 * 1000;

  // Don't show for finished matches
  if (isFinished) return null;

  const googleUrl = generateGoogleCalendarUrl(props);

  return (
    <div className="bg-[#1A6B3A] rounded-2xl overflow-hidden">
      <div className="px-4 py-3 border-b border-[#0A3D1F]">
        <span className="font-black text-sm uppercase tracking-wider text-[#F5C518]">
          🗓️ Add to Calendar
        </span>
      </div>
      <div className="p-4 flex flex-wrap gap-3">
        {/* Google Calendar */}
        <a
          href={googleUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 bg-[#0A3D1F] hover:bg-[#0d4a25] px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M19.5 3h-3V1.5H15V3H9V1.5H7.5V3h-3C3.675 3 3 3.675 3 4.5v15C3 20.325 3.675 21 4.5 21h15c.825 0 1.5-.675 1.5-1.5v-15C21 3.675 20.325 3 19.5 3zm0 16.5h-15V9h15v10.5zM7.5 10.5H9V12H7.5v-1.5zm3.75 0h1.5V12h-1.5v-1.5zm3.75 0h1.5V12H15v-1.5zM7.5 14.25H9v1.5H7.5v-1.5zm3.75 0h1.5v1.5h-1.5v-1.5zm3.75 0h1.5v1.5H15v-1.5z" fill="#4285F4"/>
          </svg>
          <span className="text-sm font-bold text-white">Google Calendar</span>
        </a>

        {/* Apple / Outlook Calendar (.ics) */}
        <button
          onClick={() => downloadICS(props)}
          className="flex items-center gap-2 bg-[#0A3D1F] hover:bg-[#0d4a25] px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M17 3H7C5.9 3 5 3.9 5 5v14c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14l-4-4 1.41-1.41L12 14.17l6.59-6.59L20 9l-8 8z" fill="#A2AAAD"/>
          </svg>
          <span className="text-sm font-bold text-white">Apple / Outlook</span>
        </button>

        {/* Share match */}
        <button
          onClick={() => {
            if (navigator.share) {
              navigator.share({
                title: `${props.homeTeam} vs ${props.awayTeam} — FIFA World Cup 2026`,
                text: `Watch ${props.homeTeam} vs ${props.awayTeam} — ${props.round}`,
                url: props.matchUrl,
              });
            } else {
              navigator.clipboard.writeText(props.matchUrl);
              alert("Match link copied to clipboard!");
            }
          }}
          className="flex items-center gap-2 bg-[#0A3D1F] hover:bg-[#0d4a25] px-4 py-2.5 rounded-xl transition-colors"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" className="text-[#F5C518]">
            <path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/>
          </svg>
          <span className="text-sm font-bold text-white">Share Match</span>
        </button>
      </div>

      <div className="px-4 pb-3">
        <p className="text-xs text-[#AACCB8]">
          ⏰ Kickoff times are in UTC. Your calendar app will convert to your local timezone automatically.
        </p>
      </div>
    </div>
  );
}