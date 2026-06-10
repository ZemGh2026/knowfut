import { MetadataRoute } from "next";

const BASE_URL = "https://www.knowfut.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/fixtures`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/standings`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/world-cup`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
  ];

  // Dynamic match pages — fetch from openfootball API
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/openfootball/worldcup.json/master/2026/worldcup.json",
      { next: { revalidate: 3600 } } // cache for 1 hour
    );
    const data = await res.json();
    const matches: any[] = data.matches;

    const clean = (s: string) =>
      s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

    const matchPages: MetadataRoute.Sitemap = matches
      .filter((m) => m.team1 && m.team2 && m.date)
      .map((m) => ({
        url: `${BASE_URL}/match/${clean(m.team1)}-vs-${clean(m.team2)}-${m.date}`,
        lastModified: new Date(),
        changeFrequency: "daily" as const,
        priority: 0.7,
      }));

    return [...staticPages, ...matchPages];
  } catch {
    // If API fails, just return static pages
    return staticPages;
  }
}