import { NextResponse } from "next/server";
import { getStandings } from "@/data/standings";

export const dynamic = 'force-dynamic';

/**
 * GET /api/standings
 * Sert le classement en appelant la fonction de logique centralisée.
 * Query params:
 * - conference: "East" ou "West" (optionnel)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conference = searchParams.get("conference");

    let standings;
    if (conference === "East" || conference === "West") {
      standings = await getStandings(conference);
    } else {
      const allStandings = await getStandings("all");
      // La fonction getStandings retourne un seul tableau, nous devons le séparer par conférence
      const east = allStandings.filter(s => s.conference === 'East');
      const west = allStandings.filter(s => s.conference === 'West');
      standings = { east, west };
    }

    return NextResponse.json({
      success: true,
      data: standings,
      meta: {
        updated: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Error fetching standings:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch standings",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

