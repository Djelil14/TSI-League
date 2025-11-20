import { NextResponse } from "next/server";
import { tsiApi } from "@/lib/tsi-api";

export const dynamic = 'force-dynamic';

/**
 * GET /api/players
 * Récupère la liste des joueurs avec pagination et filtres optionnels
 * Query params:
 * - per_page: Nombre de résultats par page (max 100)
 * - search: Recherche par nom
 * - team_ids: Filtrer par équipe (ex: "1,2,3")
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    // Récupérer tous les joueurs depuis tsiApi
    let allPlayers = tsiApi.getAllPlayers();

    // Filtrer par recherche si fourni
    const searchQuery = searchParams.get("search");
    if (searchQuery) {
      allPlayers = tsiApi.searchPlayers(searchQuery);
    }

    // Filtrer par équipe si fourni
    const teamIdsParam = searchParams.get("team_ids");
    if (teamIdsParam) {
      const teamIds = teamIdsParam.split(",").map((id) => parseInt(id.trim()));
      allPlayers = allPlayers.filter((player) =>
        teamIds.includes(player.team.id)
      );
    }

    // Pagination
    const perPage = parseInt(searchParams.get("per_page") || "25");
    const page = parseInt(searchParams.get("page") || "1");
    const startIndex = (page - 1) * perPage;
    const endIndex = startIndex + perPage;
    const paginatedPlayers = allPlayers.slice(startIndex, endIndex);

    return NextResponse.json({
      success: true,
      data: paginatedPlayers,
      meta: {
        total: allPlayers.length,
        per_page: perPage,
        page: page,
        total_pages: Math.ceil(allPlayers.length / perPage),
      },
    });
  } catch (error) {
    console.error("Error fetching players:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch players",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
