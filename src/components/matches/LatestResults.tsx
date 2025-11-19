import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { tsiApi } from "@/lib/tsi-api";
import type { TSIGame } from "@/lib/tsi-api";
import { getTeamLogo } from "@/lib/utils/team-utils";

async function getRecentMatches(): Promise<TSIGame[]> {
  try {
    // Utiliser le service TSI avec données mock
    const recentGames = tsiApi.getRecentGames(30);
    return recentGames.slice(0, 5);
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Recent matches error details:", error);
    }
    return [];
  }
}

function MatchCard({ game }: { game: TSIGame }) {
  return (
    <Card className="card-hover p-4">
      <div className="grid grid-cols-3 items-center gap-4 text-center">
        {/* Visitor Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-10 w-10">
            <Image
              src={getTeamLogo(game.visitor_team.full_name)}
              alt={`${game.visitor_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold">{game.visitor_team.full_name}</span>
        </div>

        {/* Score */}
        <div className="text-center">
          <div className="text-2xl font-bold">
            {game.visitor_team_score} - {game.home_team_score}
          </div>
          <div className="text-xs text-brand-secondary-500">
            {new Date(game.date).toLocaleDateString()}
          </div>
        </div>

        {/* Home Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-10 w-10">
            <Image
              src={getTeamLogo(game.home_team.full_name)}
              alt={`${game.home_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold">{game.home_team.full_name}</span>
        </div>
      </div>
    </Card>
  );
}


export default async function LatestResults() {
  let recentMatches: NBAGame[] = [];
  let hasError = false;

  try {
    recentMatches = await getRecentMatches();
  } catch (error) {
    console.error("Failed to load recent matches:", error);
    hasError = true;
  }

  return (
    <section className="container-custom py-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
          Latest Results
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/matches">View All →</Link>
        </Button>
      </div>

      {hasError ? (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 mb-2 text-lg">
            Unable to load recent matches at this time.
          </p>
          <p className="text-sm text-brand-secondary-400">
            Please try again later or check the matches page.
          </p>
        </Card>
      ) : recentMatches.length > 0 ? (
        <div className="grid gap-4">
          {recentMatches.map((game) => (
            <MatchCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 text-lg">
            No recent matches found for TSI League teams.
          </p>
          <p className="text-sm text-brand-secondary-400 mt-2">
            Check back later for game results.
          </p>
        </Card>
      )}
    </section>
  );
}
