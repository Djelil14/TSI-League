import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingMatches } from "@/data/matches/upcoming";
import type { TSIGame } from "@/lib/tsi-api";
import { getTeamLogo } from "@/lib/utils/team-utils";

function MatchCard({ game }: { game: TSIGame }) {
  return (
    <Card className="card-hover p-6 flex flex-col items-center justify-center text-center border-2 border-brand-secondary-200 dark:border-brand-secondary-700 hover:border-brand-accent-500 transition-all">
      <div className="flex items-center gap-4 mb-4">
        {/* Visitor Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-20 w-20">
            <Image
              src={getTeamLogo(game.visitor_team.full_name)}
              alt={`${game.visitor_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-brand-secondary-900 dark:text-white">{game.visitor_team.abbreviation}</span>
        </div>

        <span className="text-2xl font-bold text-brand-secondary-900 dark:text-white">VS</span>

        {/* Home Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-20 w-20">
            <Image
              src={getTeamLogo(game.home_team.full_name)}
              alt={`${game.home_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold text-brand-secondary-900 dark:text-white">{game.home_team.abbreviation}</span>
        </div>
      </div>

        {/* Match Info */}
        <div className="text-center w-full">
            <div className="text-xs bg-brand-accent-500 text-white font-semibold rounded-full px-4 py-2 inline-block shadow-lg mb-3">
                Upcoming
            </div>
            <div className="text-sm font-bold text-brand-secondary-900 dark:text-white mb-1">
                {new Date(game.date).toLocaleDateString()}
            </div>
            <div className="text-xs font-semibold text-brand-accent-500 mb-1">
                {new Date(game.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div className="text-xs text-brand-secondary-500">
                {game.status}
            </div>
        </div>
    </Card>
  );
}


export default async function UpcomingMatches() {
  let upcomingMatches: TSIGame[] = [];
  let hasError = false;

  try {
    upcomingMatches = await getUpcomingMatches();
  } catch (error) {
    console.error("Failed to load upcoming matches:", error);
    hasError = true;
  }

  return (
    <section className="container-custom py-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
          Upcoming Matches
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/matches">Calendar →</Link>
        </Button>
      </div>

      {hasError ? (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 mb-2 text-lg">
            Unable to load upcoming matches at this time.
          </p>
          <p className="text-sm text-brand-secondary-400">
            Please try again later or check the matches page.
          </p>
        </Card>
      ) : upcomingMatches.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {upcomingMatches.map((game) => (
            <MatchCard key={game.id} game={game} />
          ))}
        </div>
      ) : (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 text-lg">
            No upcoming matches found for TSI League teams.
          </p>
          <p className="text-sm text-brand-secondary-400 mt-2">
            Check back later for scheduled games.
          </p>
        </Card>
      )}
    </section>
  );
}
