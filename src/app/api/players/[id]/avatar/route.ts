import { NextResponse } from "next/server";
import { tsiApi } from "@/lib/tsi-api";
import { teams } from "@/data/teams/index";

export const dynamic = 'force-dynamic';

/**
 * GET /api/players/[id]/avatar
 * Génère un avatar SVG pour un joueur avec ses initiales et les couleurs de son équipe
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const playerId = parseInt(id);

    if (isNaN(playerId)) {
      return new NextResponse("Invalid player ID", { status: 400 });
    }

    const player = tsiApi.getPlayerById(playerId);
    
    // Trouver l'équipe correspondante en utilisant le mapping inverse
    let team = null;
    for (let i = 0; i < teams.length; i++) {
      const teamIdMap = new Map();
      teams.forEach((t, index) => {
        teamIdMap.set(t.id, index + 1);
      });
      if (teamIdMap.get(teams[i].id) === player.team.id) {
        team = teams[i];
        break;
      }
    }
    
    // Fallback: utiliser la première équipe si pas trouvée
    if (!team) {
      team = teams[0];
    }

    if (!team) {
      return new NextResponse("Team not found", { status: 404 });
    }

    const initials = `${player.first_name[0]}${player.last_name[0]}`.toUpperCase();
    const primaryColor = team.primaryColor || "#EF4444";
    const secondaryColor = team.secondaryColor || "#DC2626";

    // Générer un dégradé basé sur les couleurs de l'équipe
    const svg = `
<svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad-${playerId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${primaryColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${secondaryColor};stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="200" height="200" rx="100" fill="url(#grad-${playerId})"/>
  <text x="100" y="100" font-family="Arial, sans-serif" font-size="72" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${initials}</text>
</svg>`.trim();

    return new NextResponse(svg, {
      headers: {
        "Content-Type": "image/svg+xml",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error generating player avatar:", error);
    return new NextResponse("Error generating avatar", { status: 500 });
  }
}

