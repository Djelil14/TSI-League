import { NextResponse } from "next/server";
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
 * GET /api/standings
 * Calcule le classement basé sur les résultats des matchs
 * Query params:
 * - season: Saison (défaut: 2024)
 * - conference: "East" ou "West" (optionnel)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2024";
    const conferenceFilter = searchParams.get("conference");

    // Récupérer toutes les équipes
    const allTeams = await nbaApi.getAllTeams();

    // Filtrer par conférence si demandé
    const teams = conferenceFilter
      ? allTeams.filter(
          (team) =>
            team.conference.toLowerCase() === conferenceFilter.toLowerCase()
        )
      : allTeams;

    // Récupérer tous les matchs terminés de la saison pour toutes les équipes
    const gamesPromises = teams.map((team) =>
      nbaApi.getTeamGames(team.id, season)
    );
    const teamsGames = await Promise.all(gamesPromises);

    // Calculer les statistiques pour chaque équipe
    const standings: TeamStanding[] = teams.map((team, index) => {
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

        // Last 10 games (prendre les 10 derniers)
        if (lastTenGames.length < 10) {
          lastTenGames.push(won);
        }

        // Streak (calculer sur les matchs triés par date)
      });

      // Trier les matchs par date pour calculer la streak
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
        gamesBack: 0, // Sera calculé après tri
        homeRecord: `${homeWins}-${homeLosses}`,
        awayRecord: `${awayWins}-${awayLosses}`,
        lastTen: `${lastTenWins}-${lastTenLosses}`,
        streak: streakType ? `${streakType}${currentStreak}` : "-",
        pointsFor: Math.round(pointsFor),
        pointsAgainst: Math.round(pointsAgainst),
        pointDifferential: Math.round(pointsFor - pointsAgainst),
      };
    });

    // Trier par pourcentage de victoires (desc)
    standings.sort((a, b) => {
      const diffWinPct = parseFloat(b.winPercentage) - parseFloat(a.winPercentage);
      if (diffWinPct !== 0) return diffWinPct;
      // Si égalité, trier par différence de points
      return b.pointDifferential - a.pointDifferential;
    });

    // Calculer les Games Back
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

    // Séparer par conférence si pas de filtre
    const eastStandings = standings.filter(
      (s) => s.team.conference === "East"
    );
    const westStandings = standings.filter(
      (s) => s.team.conference === "West"
    );

    return NextResponse.json({
      success: true,
      data: conferenceFilter
        ? standings
        : {
            east: eastStandings,
            west: westStandings,
          },
      meta: {
        season: parseInt(season),
        conference: conferenceFilter || "all",
        totalTeams: standings.length,
        updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error calculating standings:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to calculate standings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
