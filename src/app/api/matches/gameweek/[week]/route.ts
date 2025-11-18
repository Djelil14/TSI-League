import { NextResponse } from "next/server";
import { nbaApi } from "@/lib/nba-api";

/**
 * GET /api/matches/gameweek/[week]
 * Récupère les matchs d'une "semaine" spécifique
 * La NBA n'a pas de système de gameweek, donc on organise par semaines calendaires
 * Query params:
 * - season: Saison (défaut: 2024)
 */
export async function GET(
  request: Request,
  { params }: { params: Promise<{ week: string }> }
) {
  try {
    const { week } = await params;
    const weekNumber = parseInt(week);

    if (isNaN(weekNumber) || weekNumber < 1 || weekNumber > 52) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid week number (must be 1-52)",
        },
        { status: 400 }
      );
    }

    const { searchParams } = new URL(request.url);
    const season = searchParams.get("season") || "2024";

    // Calculer les dates pour la semaine
    // Saison NBA commence généralement en octobre
    const seasonStartYear = parseInt(season);
    const seasonStartDate = new Date(seasonStartYear, 9, 15); // 15 octobre

    // Calculer la date de début et fin de la semaine
    const weekStartDate = new Date(seasonStartDate);
    weekStartDate.setDate(weekStartDate.getDate() + (weekNumber - 1) * 7);

    const weekEndDate = new Date(weekStartDate);
    weekEndDate.setDate(weekEndDate.getDate() + 6);

    // Formater les dates pour l'API
    const formatDate = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const startDate = formatDate(weekStartDate);
    const endDate = formatDate(weekEndDate);

    // Récupérer les matchs pour cette période
    const gamesResponse = await nbaApi.getGames({
      seasons: season,
      start_date: startDate,
      end_date: endDate,
      per_page: "100",
    });

    const games = gamesResponse.data;

    // Organiser les matchs par jour
    const gamesByDay: Record<string, typeof games> = {};
    games.forEach((game) => {
      const gameDate = game.date.split("T")[0];
      if (!gamesByDay[gameDate]) {
        gamesByDay[gameDate] = [];
      }
      gamesByDay[gameDate].push(game);
    });

    // Statistiques
    const finishedGames = games.filter((game) => game.status === "Final");
    const upcomingGames = games.filter(
      (game) => game.status !== "Final" && game.status !== "in-progress"
    );
    const liveGames = games.filter((game) => game.status === "in-progress");

    return NextResponse.json({
      success: true,
      data: {
        week: weekNumber,
        season: parseInt(season),
        dateRange: {
          start: startDate,
          end: endDate,
          startFormatted: weekStartDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
          endFormatted: weekEndDate.toLocaleDateString("fr-FR", {
            weekday: "long",
            year: "numeric",
            month: "long",
            day: "numeric",
          }),
        },
        games,
        gamesByDay,
        stats: {
          total: games.length,
          finished: finishedGames.length,
          upcoming: upcomingGames.length,
          live: liveGames.length,
          daysWithGames: Object.keys(gamesByDay).length,
        },
      },
    });
  } catch (error) {
    console.error("Error fetching gameweek matches:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gameweek matches",
        message: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
