import { nbaApi } from "@/lib/nba-api";
import { NBATeam, NBAGame } from "@/types/nba-api";
import { TeamStanding } from "@/components/teams/StandingsTable";

export async function getStandings(conference: "East" | "West" | "all" = "all"): Promise<TeamStanding[]> {
  try {
    const [teamsResponse, gamesResponse] = await Promise.all([
      nbaApi.getTeams(),
      nbaApi.getGames({
        seasons: [new Date().getFullYear()],
        per_page: "1000",
      }),
    ]);

    const teams = teamsResponse.data || [];
    const games = gamesResponse.data || [];

    const calculatedStandings = teams.map((team) => {
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

    // Calculate streak
    const recentGames = teamGames
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
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
        gamesBehind: 0, // Will be calculated after sorting
        streak,
        pointsFor,
        pointsAgainst,
        pointDifferential: pointsFor - pointsAgainst,
      };
    });

    // Sort by win percentage
    calculatedStandings.sort((a, b) => {
        const aWinPct = parseFloat(a.winPercentage);
        const bWinPct = parseFloat(b.winPercentage);
        if (bWinPct !== aWinPct) return bWinPct - aWinPct;
        return b.wins - a.wins;
      });
  
      // Calculate games behind for each conference
      ["East", "West"].forEach((conference) => {
        const confTeams = calculatedStandings.filter(
          (t) => t.conference === conference
        );
        if (confTeams.length > 0) {
          const leader = confTeams[0];
          confTeams.forEach((team) => {
            team.gamesBehind = (leader.wins - team.wins + (team.losses - leader.losses)) / 2;
          });
        }
      });

    if (conference === "all") {
      return calculatedStandings;
    } else {
      return calculatedStandings.filter((team) => team.conference === conference);
    }
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}
