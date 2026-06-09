import axios from "axios";

const BASE_URL =
  "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

/**
 * Parses the openfootball time format "13:00 UTC-6" into a UTC ISO string.
 * Combines with the match date "2026-06-11".
 */
export function parseMatchTime(date: string, time: string): string {
  try {
    // time format: "13:00 UTC-6" or "20:00 UTC+1" or "13:00"
    const match = time.match(/^(\d{2}):(\d{2})(?:\s+UTC([+-]\d+))?/);
    if (!match) return `${date}T00:00:00Z`;

    const hours = parseInt(match[1]);
    const minutes = parseInt(match[2]);
    const offsetHours = match[3] ? parseInt(match[3]) : 0;

    // Convert local time to UTC: UTC = local - offset
    const utcHours = hours - offsetHours;

    // Build a date object in UTC
    const dt = new Date(
      `${date}T${String(utcHours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:00Z`
    );
    return dt.toISOString();
  } catch {
    return `${date}T00:00:00Z`;
  }
}

/**
 * Formats a UTC ISO string into the visitor's local time.
 * Returns e.g. "3:00 PM EST"
 */
export function formatLocalTime(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZoneName: "short",
    });
  } catch {
    return "";
  }
}

/**
 * Formats a UTC ISO string into a short local date.
 * Returns e.g. "Thu, Jun 11"
 */
export function formatLocalDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

export async function getTodayMatches() {
  try {
    const res = await axios.get(BASE_URL);
    const matches = res.data.matches;

    const today = new Date().toISOString().split("T")[0];

    const todayMatches = matches
      .filter((match: any) => match.date === today)
      .map((match: any) => ({
        ...match,
        utcTime: parseMatchTime(match.date, match.time ?? ""),
      }));

    return todayMatches;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
}

export async function getAllMatches() {
  try {
    const res = await axios.get(BASE_URL);
    return res.data.matches.map((match: any) => ({
      ...match,
      utcTime: parseMatchTime(match.date, match.time ?? ""),
    }));
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
}

export async function getUpcomingMatches(count = 5) {
  try {
    const res = await axios.get(BASE_URL);
    const matches = res.data.matches;

    const today = new Date().toISOString().split("T")[0];

    return matches
      .filter((match: any) => match.date >= today)
      .slice(0, count)
      .map((match: any) => ({
        ...match,
        utcTime: parseMatchTime(match.date, match.time ?? ""),
      }));
  } catch (error) {
    console.error("Failed to fetch upcoming matches:", error);
    return [];
  }
}