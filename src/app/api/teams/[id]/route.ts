import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/teams/[id]
 * Récupère les détails d'une équipe spécifique + ses joueurs + ses matchs
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const teamId = parseInt(id);

    if (isNaN(teamId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid team ID",
        },
        { status: 400 }
      );
    }

    // Récupérer les données de l'équipe, joueurs et matchs en parallèle
    const [team, players, games] = await Promise.all([
      nbaApi.getTeamById(teamId),
      nbaApi.getTeamPlayers(teamId),
      nbaApi.getTeamGames(teamId, "2024"), // Saison 2024
    ]);

    return NextResponse.json({
      success: true,
      data: {
        team,
        players,
        games,
        stats: {
          totalPlayers: players.length,
          totalGames: games.length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching team details:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch team details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
