import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/search
 * Recherche globale (équipes + joueurs)
 * Query params:
 * - q: Requête de recherche
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Search query is required",
        },
        { status: 400 }
      );
    }

    // Rechercher les joueurs et récupérer toutes les équipes en parallèle
    const [players, allTeams] = await Promise.all([
      nbaApi.searchPlayers(query.trim()),
      nbaApi.getAllTeams(),
    ]);

    // Filtrer les équipes qui correspondent à la recherche
    const searchLower = query.trim().toLowerCase();
    const teams = allTeams.filter(
      (team) =>
        team.full_name.toLowerCase().includes(searchLower) ||
        team.name.toLowerCase().includes(searchLower) ||
        team.city.toLowerCase().includes(searchLower) ||
        team.abbreviation.toLowerCase().includes(searchLower)
    );

    return NextResponse.json({
      success: true,
      data: {
        teams,
        players,
        query: query.trim(),
      },
      stats: {
        teamsFound: teams.length,
        playersFound: players.length,
        totalResults: teams.length + players.length,
      },
    });
  } catch (error) {
    console.error("Error performing search:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to perform search",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
