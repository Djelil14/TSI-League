import { nbaApi } from "@/lib/nba-api";
import { NBAGame } from "@/types/nba-api";
import { TSI_LEAGUE_CONFIG } from "@/lib/tsi-config";

export async function getUpcomingMatches(): Promise<NBAGame[]> {
  try {
    const today = new Date();
    const thirtyDaysAhead = new Date(today);
    thirtyDaysAhead.setDate(today.getDate() + 30); // Extended to 30 days to find more matches

    const formattedToday = today.toISOString().split("T")[0];
    const formattedThirtyDaysAhead = thirtyDaysAhead.toISOString().split("T")[0];

    // Get TSI team IDs as comma-separated string
    const tsiTeamIds = TSI_LEAGUE_CONFIG.selectedTeamIds.join(",");

    const response = await nbaApi.getGames({
      start_date: formattedToday,
      end_date: formattedThirtyDaysAhead,
      team_ids: tsiTeamIds, // Filter to TSI teams only
      per_page: "100",
    });

    const upcomingGames = (response.data || [])
      .filter((game) => {
        // Only include games with TSI teams
        const isTSITeam = (teamId: number) => 
          TSI_LEAGUE_CONFIG.selectedTeamIds.includes(teamId);
        
        return (
          game.status !== "Final" &&
          (isTSITeam(game.home_team.id) || isTSITeam(game.visitor_team.id))
        );
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    return upcomingGames.slice(0, 3);
  } catch (error) {
    console.error("Error fetching upcoming matches:", error);
    // Return empty array but log the error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("Upcoming matches error details:", error);
    }
    return [];
  }
}
