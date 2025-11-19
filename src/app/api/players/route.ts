import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

export const dynamic = 'force-dynamic';

/**
 * GET /api/players
 * Récupère la liste des joueurs avec pagination et filtres optionnels
 * Query params:
 * - cursor: Pour la pagination
 * - per_page: Nombre de résultats par page (max 100)
 * - search: Recherche par nom
 * - team_ids: Filtrer par équipe (ex: "1,2,3")
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);

    const params: Record<string, string> = {};

    if (searchParams.get("cursor")) {
      params.cursor = searchParams.get("cursor")!;
    }

    if (searchParams.get("per_page")) {
      params.per_page = searchParams.get("per_page")!;
    } else {
      params.per_page = "25"; // Par défaut
    }

    if (searchParams.get("search")) {
      params.search = searchParams.get("search")!;
    }

    if (searchParams.get("team_ids")) {
      params.team_ids = searchParams.get("team_ids")!;
    }

    const response = await nbaApi.getAllPlayers(params);

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
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
