import { nbaApi } from "@/lib/nba-api";
import { NBATeam, NBAGame } from "@/types/nba-api";
import { TeamStanding } from "@/components/teams/StandingsTable";

export async function getStandings(
  conference: "East" | "West" | "all" = "all"
): Promise<TeamStanding[]> {
  try {
    // Sequential requests to avoid rate limiting
    const teamsResponse = await nbaApi.getAllTeams();
    
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 200));
    
    // Reduce per_page to avoid 400 errors and use current year
    const currentYear = new Date().getFullYear().toString();
    const gamesResponse = await nbaApi.getGames({
      seasons: currentYear,
      per_page: "100", // Reduced from 1000 to avoid errors
    });

    const teamsList = teamsResponse || [];
    const games = gamesResponse.data || [];

    const calculatedStandings = teamsList.map((team) => {
      const teamGames = games.filter(
        (g) =>
          g.status === "Final" &&
          (g.home_team.id === team.id || g.visitor_team.id === team.id)
      );

      const wins = teamGames.filter((g) => {
        if (g.home_team.id === team.id) {
          return g.home_team_score > g.visitor_team_score;
        } else {
          return g.visitor_team_score > g.home_team_score;
        }
      }).length;

      const losses = teamGames.length - wins;

      const pointsFor = teamGames.reduce((acc, g) => {
        if (g.home_team.id === team.id) {
          return acc + g.home_team_score;
        } else {
          return acc + g.visitor_team_score;
        }
      }, 0);

      const pointsAgainst = teamGames.reduce((acc, g) => {
        if (g.home_team.id === team.id) {
          return acc + g.visitor_team_score;
        } else {
          return acc + g.home_team_score;
        }
      }, 0);

      const winPercentage =
        teamGames.length > 0
          ? ((wins / teamGames.length) * 100).toFixed(1)
          : "0.0";

      const recentGames = teamGames
        .sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        )
        .slice(0, 10);

      let streak = "";
      if (recentGames.length > 0) {
        const lastGame = recentGames[0];
        const lastGameWon =
          (lastGame.home_team.id === team.id &&
            lastGame.home_team_score > lastGame.visitor_team_score) ||
          (lastGame.visitor_team.id === team.id &&
            lastGame.visitor_team_score > lastGame.home_team_score);

        let streakCount = 0;
        for (const game of recentGames) {
          const won =
            (game.home_team.id === team.id &&
              game.home_team_score > game.visitor_team_score) ||
            (game.visitor_team.id === team.id &&
              game.visitor_team_score > game.home_team_score);

          if (won === lastGameWon) {
            streakCount++;
          } else {
            break;
          }
        }

        streak = `${lastGameWon ? "W" : "L"}${streakCount}`;
      } else {
        streak = "-";
      }

      return {
        ...team,
        wins,
        losses,
        winPercentage,
        gamesBehind: 0,
        streak,
        pointsFor,
        pointsAgainst,
        pointDifferential: pointsFor - pointsAgainst,
      };
    });

    calculatedStandings.sort((a, b) => {
      const aWinPct = parseFloat(a.winPercentage);
      const bWinPct = parseFloat(b.winPercentage);
      if (bWinPct !== aWinPct) return bWinPct - aWinPct;
      return b.wins - a.wins;
    });

    ["East", "West"].forEach((conference) => {
      const confTeams = calculatedStandings.filter(
        (t) => t.conference === conference
      );
      if (confTeams.length > 0) {
        const leader = confTeams[0];
        confTeams.forEach((team) => {
          team.gamesBehind =
            (leader.wins - team.wins + (team.losses - leader.losses)) / 2;
        });
      }
    });

    if (conference === "all") return calculatedStandings;

    return calculatedStandings.filter((t) => t.conference === conference);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}
