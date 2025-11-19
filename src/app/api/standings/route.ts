import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// Define the structure of your pre-calculated standings data
// This should match the output of your previous calculations
interface TeamStanding {
  team: {
    id: number;
    full_name: string;
    conference: string;
    division: string;
    abbreviation: string;
    name: string;
    city: string;
  };
  wins: number;
  losses: number;
  winPercentage: string;
  gamesBack: number;
  homeRecord: string;
  awayRecord: string;
  lastTen: string;
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
}

interface PrecalculatedStandings {
  east: TeamStanding[];
  west: TeamStanding[];
  // Add any other metadata you might have
  meta: {
    season: number;
    conference: string;
    totalTeams: number;
    updated: string;
  };
}

/**
 * GET /api/standings
 * Sert le classement pré-calculé
 * Query params:
 * - conference: "East" ou "West" (optionnel)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const conferenceFilter = searchParams.get("conference");

    // Path to the pre-calculated standings JSON file
    const filePath = path.join(process.cwd(), 'src', 'data', 'standings', 'precalculated.json');

    // Read the JSON file
    const fileContents = await fs.readFile(filePath, 'utf8');
    const precalculatedData: PrecalculatedStandings = JSON.parse(fileContents);

    let dataToReturn;

    if (conferenceFilter) {
      const filteredConference = conferenceFilter.toLowerCase();
      if (filteredConference === 'east') {
        dataToReturn = precalculatedData.east;
      } else if (filteredConference === 'west') {
        dataToReturn = precalculatedData.west;
      } else {
        return NextResponse.json(
          {
            success: false,
            error: "Invalid conference filter (must be 'East' or 'West')",
          },
          { status: 400 }
        );
      }
    } else {
      dataToReturn = {
        east: precalculatedData.east,
        west: precalculatedData.west,
      };
    }

    return NextResponse.json({
      success: true,
      data: dataToReturn,
      meta: precalculatedData.meta,
    });
  } catch (error) {
    console.error("Error serving standings:", error);

    // If the file doesn't exist, or there's a parsing error, return a 500
    return NextResponse.json(
      {
        success: false,
        error: "Failed to retrieve standings data",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
