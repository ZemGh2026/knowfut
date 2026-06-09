import axios from "axios";

const BASE_URL = "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json";

export async function getTodayMatches() {
  try {
    const res = await axios.get(BASE_URL);
    const matches = res.data.matches;

    const today = new Date().toISOString().split("T")[0];

    const todayMatches = matches.filter((match: any) => {
      return match.date === today;
    });

    return todayMatches;
  } catch (error) {
    console.error("Failed to fetch matches:", error);
    return [];
  }
}

export async function getAllMatches() {
  try {
    const res = await axios.get(BASE_URL);
    return res.data.matches;
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
  
      const upcoming = matches
        .filter((match: any) => match.date >= today)
        .slice(0, count);
  
      return upcoming;
    } catch (error) {
      console.error("Failed to fetch upcoming matches:", error);
      return [];
    }
  }