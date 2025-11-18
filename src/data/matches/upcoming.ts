import { nbaApi } from "@/lib/nba-api";
import { NBAGame } from "@/types/nba-api";

export async function getUpcomingMatches(): Promise<NBAGame[]> {
  try {
    const today = new Date();
    const sevenDaysAhead = new Date(today);
    sevenDaysAhead.setDate(today.getDate() + 7);

    const formattedToday = today.toISOString().split("T")[0];
    const formattedSevenDaysAhead = sevenDaysAhead.toISOString().split("T")[0];

    const response = await nbaApi.getGames({
      start_date: formattedToday,
      end_date: formattedSevenDaysAhead,
      per_page: "100",
    });

    const upcomingGames = (response.data || [])
      .filter((game) => game.status !== "Final")
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingGames.slice(0, 3);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    return [];
  }
}
