import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/teams
 * Récupère toutes les équipes NBA
 */
export async function GET() {
  try {
    const teams = await nbaApi.getAllTeams();

    return NextResponse.json({
      success: true,
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    console.error("Error fetching teams:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch teams",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
