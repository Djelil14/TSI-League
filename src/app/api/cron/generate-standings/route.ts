import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";
import { nbaApi } from "@/lib/nba-api";
import { NBATeam, NBAGame } from "@/types/nba-api";

interface TeamStanding {
  team: NBATeam;
  wins: number;
  losses: number;
  winPercentage: string;
  gamesBack: number;
  homeRecord: string;
  awayRecord: string;
  lastTen: string;
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
}

/**
 * POST /api/cron/generate-standings
 * Exécute le calcul des classements et sauvegarde le résultat dans un fichier JSON.
 * Protégé par une clé secrète.
 */
export async function POST(request: Request) {
  const authorization = request.headers.get("Authorization");

  if (authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  try {
    const season = "2024"; // ou une logique pour déterminer la saison actuelle

    // Récupérer toutes les équipes
    const allTeams = await nbaApi.getAllTeams();

    // Récupérer tous les matchs terminés de la saison pour toutes les équipes
    const gamesPromises = allTeams.map((team) =>
      nbaApi.getTeamGames(team.id, season)
    );
    const teamsGames = await Promise.all(gamesPromises);

    // Calculer les statistiques pour chaque équipe
    const standings: TeamStanding[] = allTeams.map((team, index) => {
      const teamGames = teamsGames[index].filter(
        (game) => game.status === "Final"
      );

      let wins = 0;
      let losses = 0;
      let homeWins = 0;
      let homeLosses = 0;
      let awayWins = 0;
      let awayLosses = 0;
      let pointsFor = 0;
      let pointsAgainst = 0;

      const lastTenGames: boolean[] = [];
      let currentStreak = 0;
      let streakType: "W" | "L" | null = null;

      teamGames.forEach((game) => {
        const isHomeTeam = game.home_team.id === team.id;
        const teamScore = isHomeTeam
          ? game.home_team_score
          : game.visitor_team_score;
        const opponentScore = isHomeTeam
          ? game.visitor_team_score
          : game.home_team_score;

        const won = teamScore > opponentScore;

        pointsFor += teamScore;
        pointsAgainst += opponentScore;

        if (won) {
          wins++;
          if (isHomeTeam) homeWins++;
          else awayWins++;
        } else {
          losses++;
          if (isHomeTeam) homeLosses++;
          else awayLosses++;
        }

        if (lastTenGames.length < 10) {
          lastTenGames.push(won);
        }
      });

      const sortedGames = [...teamGames].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );

      for (const game of sortedGames) {
        const isHomeTeam = game.home_team.id === team.id;
        const teamScore = isHomeTeam
          ? game.home_team_score
          : game.visitor_team_score;
        const opponentScore = isHomeTeam
          ? game.visitor_team_score
          : game.home_team_score;
        const won = teamScore > opponentScore;

        if (streakType === null) {
          streakType = won ? "W" : "L";
          currentStreak = 1;
        } else if ((streakType === "W" && won) || (streakType === "L" && !won)) {
          currentStreak++;
        } else {
          break;
        }
      }

      const totalGames = wins + losses;
      const winPercentage =
        totalGames > 0 ? (wins / totalGames).toFixed(3) : "0.000";

      const lastTenWins = lastTenGames.filter((w) => w).length;
      const lastTenLosses = lastTenGames.length - lastTenWins;

      return {
        team,
        wins,
        losses,
        winPercentage,
        gamesBack: 0,
        homeRecord: `${homeWins}-${homeLosses}`,
        awayRecord: `${awayWins}-${awayLosses}`,
        lastTen: `${lastTenWins}-${lastTenLosses}`,
        streak: streakType ? `${streakType}${currentStreak}` : "-",
        pointsFor: Math.round(pointsFor),
        pointsAgainst: Math.round(pointsAgainst),
        pointDifferential: Math.round(pointsFor - pointsAgainst),
      };
    });

    standings.sort((a, b) => {
      const diffWinPct = parseFloat(b.winPercentage) - parseFloat(a.winPercentage);
      if (diffWinPct !== 0) return diffWinPct;
      return b.pointDifferential - a.pointDifferential;
    });

    if (standings.length > 0) {
      const leader = standings[0];
      const leaderWins = leader.wins;
      const leaderLosses = leader.losses;

      standings.forEach((standing) => {
        const gb =
          (leaderWins - standing.wins + (standing.losses - leaderLosses)) / 2;
        standing.gamesBack = gb > 0 ? parseFloat(gb.toFixed(1)) : 0;
      });
    }

    const eastStandings = standings.filter(
      (s) => s.team.conference === "East"
    );
    const westStandings = standings.filter(
      (s) => s.team.conference === "West"
    );

    const precalculatedData = {
      east: eastStandings,
      west: westStandings,
      meta: {
        season: parseInt(season),
        conference: "all",
        totalTeams: standings.length,
        updated: new Date().toISOString(),
      },
    };

    // Path to the pre-calculated standings JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'standings', 'precalculated.json');

    // Write the JSON file
    await fs.writeFile(filePath, JSON.stringify(precalculatedData, null, 2), 'utf8');

    return NextResponse.json({ success: true, message: "Standings generated successfully." });
  } catch (error) {
    console.error("Error generating standings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate standings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
