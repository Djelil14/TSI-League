import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/players/[id]
 * Récupère les détails d'un joueur spécifique
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playerId = parseInt(id);

    if (isNaN(playerId)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid player ID",
        },
        { status: 400 }
      );
    }

    const player = await nbaApi.getPlayerById(playerId);

    return NextResponse.json({
      success: true,
      data: player,
    });
  } catch (error) {
    console.error("Error fetching player details:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch player details",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
