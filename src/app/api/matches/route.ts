import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

export const dynamic = 'force-dynamic';

/**
 * GET /api/matches
 * Récupère la liste des matchs avec filtres optionnels
 * Query params:
 * - cursor: Pour la pagination
 * - per_page: Nombre de résultats par page
 * - dates: Date ou plage (YYYY-MM-DD ou YYYY-MM-DD..YYYY-MM-DD)
 * - seasons: Saison (ex: "2024")
 * - team_ids: Filtrer par équipe (ex: "1,2,3")
 * - postseason: "true" ou "false"
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
      params.per_page = "25";
    }

    if (searchParams.get("dates")) {
      params.dates = searchParams.get("dates")!;
    }

    if (searchParams.get("seasons")) {
      params.seasons = searchParams.get("seasons")!;
    } else {
      params.seasons = "2024"; // Saison par défaut
    }

    if (searchParams.get("team_ids")) {
      params.team_ids = searchParams.get("team_ids")!;
    }

    if (searchParams.get("postseason")) {
      params.postseason = searchParams.get("postseason")!;
    }

    if (searchParams.get("start_date")) {
      params.start_date = searchParams.get("start_date")!;
    }

    if (searchParams.get("end_date")) {
      params.end_date = searchParams.get("end_date")!;
    }

    const response = await nbaApi.getGames(params);

    return NextResponse.json({
      success: true,
      data: response.data,
      meta: response.meta,
    });
  } catch (error) {
    console.error("Error fetching matches:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch matches",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
