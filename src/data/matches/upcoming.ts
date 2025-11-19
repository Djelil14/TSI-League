import { tsiApi } from "@/lib/tsi-api";
import type { TSIGame } from "@/lib/tsi-api";

export async function getUpcomingMatches(): Promise<TSIGame[]> {
  try {
    // Utiliser le service TSI avec données mock
    const upcomingGames = tsiApi.getUpcomingGames(30);
    return upcomingGames.slice(0, 3);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Upcoming matches error details:", error);
    }
    return [];
  }
}
