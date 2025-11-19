import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { nbaApi } from "@/lib/nba-api";
import { TSI_LEAGUE_CONFIG } from "@/lib/tsi-config";
import LatestResults from "@/components/matches/LatestResults";
import UpcomingMatches from "@/components/matches/UpcomingMatches";
import CurrentStandings from "@/components/teams/CurrentStandings";

// Use ISR with longer revalidate to reduce API calls during build
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

// Helper function to get team logo path
function getTeamLogo(teamName: string): string {
  const logoMap: { [key: string]: string } = {
    "Atlanta Hawks": "Atlanta.png",
    "Boston Celtics": "Boston.png",
    "Chicago Bulls": "Chicago.png",
    "LA Clippers": "LAC.png",
    "Los Angeles Lakers": "Lakers.png",
    "New York Knicks": "NYK.png",
    "Philadelphia 76ers": "PHI.png",
    "Portland Trail Blazers": "POR.png",
    "Golden State Warriors": "Golden State.png",
  };

  const fileName = logoMap[teamName];
  return fileName ? `/images/logos/teams/${fileName}` : "/images/logos/site/tsi-logo.png";
}

async function getTopTeams() {
  try {
    const teams = await nbaApi.getAllTeams();
    // Filter to only TSI League teams and return first 5
    const tsiTeams = teams.filter((team) =>
      TSI_LEAGUE_CONFIG.selectedTeamIds.includes(team.id)
    );
    return tsiTeams.slice(0, 5);
  } catch (error) {
    console.error("Error fetching teams:", error);
    return [];
  }
}

export default async function HomePage() {
  const [topTeams] = await Promise.all([
    getTopTeams(),
  ]);

  return (
    <div className="space-y-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden group">
        {/* Image de bannière en fond */}
        <div className="absolute inset-0">
          <Image
            src="/images/logos/baniere.png"
            alt="TSI Basketball Banner"
            fill
            className="object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            priority
          />
        </div>

        {/* Overlay sombre pour améliorer la lisibilité */}
        <div className="absolute inset-0 bg-black/60" />

        {/* Contenu */}
        <div className="relative z-10 px-6 py-32 text-center md:py-40">
          <h1 className="mb-6 font-display text-6xl font-black leading-tight text-white drop-shadow-2xl md:text-7xl lg:text-8xl">
            Thunder Strike International
          </h1>
          <p className="mx-auto mb-10 max-w-3xl text-xl text-white/90 drop-shadow-lg md:text-2xl">
            Experience the ultimate professional basketball league. Follow
            live scores, player stats, team standings, and exclusive content.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="xl"
              variant="primary"
              asChild
            >
              <Link href="/matches">Live Matches</Link>
            </Button>
            <Button
              size="xl"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-primary-600"
              asChild
            >
              <Link href="/standings">View Standings</Link>
            </Button>
          </div>
        </div>
      </section>

      <UpcomingMatches />

      <LatestResults />

      {/* Top 5 Standings */}
      <section className="container-custom py-20 bg-brand-secondary-50 dark:bg-brand-secondary-800/50">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-brand-secondary-900 dark:text-white">
            Top Teams
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/standings">Full Standings</Link>
          </Button>
        </div>

        <div className="grid gap-4">
          {topTeams.map((team, index) => (
            <Link key={team.id} href={`/teams/${team.id}`}>
              <Card className="card-hover p-4 transition-all hover:border-brand-primary-500 border-2 border-transparent shadow-md hover:shadow-xl">
                <div className="flex items-center gap-4">
                  <div className="relative h-12 w-12 flex-shrink-0">
                    <Image
                      src={getTeamLogo(team.full_name)}
                      alt={`${team.full_name} logo`}
                      fill
                      className="object-contain"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">
                      {team.full_name}
                    </div>
                    <div className="text-sm text-brand-secondary-500">
                      {team.conference} Conference
                    </div>
                  </div>
                  <Badge variant="secondary">{team.abbreviation}</Badge>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </section>

      <CurrentStandings />

      {/* Call to Action */}
      <section className="container-custom mb-20">
        <div className="rounded-2xl bg-gradient-court from-brand-primary-500 to-brand-primary-700 p-12 text-white text-center shadow-2xl">
          <h2 className="mb-4 text-4xl font-bold">Stay Updated</h2>
          <p className="mx-auto mb-8 max-w-2xl text-brand-primary-100 text-lg">
            Get the latest news, scores, and highlights from the TSI League.
            Follow your favorite teams and players throughout the season.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="bg-white text-brand-primary-600 hover:bg-brand-primary-50"
              asChild
            >
              <Link href="/teams">Explore Teams</Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-2 border-white text-white hover:bg-white hover:text-brand-primary-600"
              asChild
            >
              <Link href="/players">View Players</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
