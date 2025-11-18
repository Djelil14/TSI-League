import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/matches/team/[teamId]
 * Récupère tous les matchs d'une équipe spécifique
 * Query params:
 * - season: Saison (défaut: 2024)
 * - postseason: "true" ou "false"
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ teamId: string }> }
) {
  try {
    const { teamId: teamIdStr } = await params;
    const teamId = parseInt(teamIdStr);

    if (isNaN(teamId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid team ID",
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2024";
    const postseason = searchParams.get("postseason");

    // Récupérer l'équipe et ses matchs en parallèle
    const [team, allGames] = await Promise.all([
      nbaApi.getTeamById(teamId),
      nbaApi.getTeamGames(teamId, season),
    ]);

    // Filtrer par postseason si demandé
    let games = allGames;
    if (postseason !== null) {
      const isPostseason = postseason === "true";
      games = allGames.filter((game) => game.postseason === isPostseason);
    }

    // Séparer les matchs en catégories
    const homeGames = games.filter((game) => game.home_team.id === teamId);
    const awayGames = games.filter((game) => game.visitor_team.id === teamId);
    const finishedGames = games.filter((game) => game.status === "Final");
    const upcomingGames = games.filter(
      (game) => game.status !== "Final" && game.status !== "in-progress"
    );
    const liveGames = games.filter((game) => game.status === "in-progress");

    // Calculer des statistiques basiques
    const wins = finishedGames.filter((game) => {
      if (game.home_team.id === teamId) {
        return game.home_team_score > game.visitor_team_score;
      } else {
        return game.visitor_team_score > game.home_team_score;
      }
    }).length;

    const losses = finishedGames.length - wins;

    return NextResponse.json({
      success: true,
      data: {
        team,
        games,
        stats: {
          total: games.length,
          home: homeGames.length,
          away: awayGames.length,
          finished: finishedGames.length,
          upcoming: upcomingGames.length,
          live: liveGames.length,
          record: {
            wins,
            losses,
            winPercentage: finishedGames.length > 0 ? (wins / finishedGames.length).toFixed(3) : "0.000",
          },
        },
        categories: {
          home: homeGames,
          away: awayGames,
          finished: finishedGames,
          upcoming: upcomingGames,
          live: liveGames,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching team matches:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team matches",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
