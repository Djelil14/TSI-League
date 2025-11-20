import { NextResponse } from "next/server";
import { tsiApi } from "@/lib/tsi-api";

export const dynamic = 'force-dynamic';

/**
 * GET /api/teams
 * Récupère toutes les équipes TSI League
 */
export async function GET() {
  try {
    const teams = tsiApi.getAllTeams();

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
