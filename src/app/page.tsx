import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { tsiApi } from "@/lib/tsi-api";
import type { TSITeam } from "@/lib/tsi-api";
import LatestResults from "@/components/matches/LatestResults";
import UpcomingMatches from "@/components/matches/UpcomingMatches";
import CurrentStandings from "@/components/teams/CurrentStandings";

// Use ISR with longer revalidate to reduce API calls during build
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes

import { getTeamLogo } from "@/lib/utils/team-utils";

async function getTopTeams() {
  try {
    // Utiliser le service TSI avec données mock - 6 équipes
    const teams = tsiApi.getAllTeams();
    return teams.slice(0, 6);
  } catch (error) {
    console.error("Error fetching teams:", error);
    if (process.env.NODE_ENV === "development") {
      console.error("Top teams error details:", error);
    }
    return [];
  }
}

export default async function HomePage() {
  let topTeams: TSITeam[] = [];
  
  try {
    topTeams = await getTopTeams();
  } catch (error) {
    console.error("Failed to load top teams:", error);
  }

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
              <Link href="/teams">View Standings</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Derniers résultats */}
      <LatestResults />

      {/* Prochains matchs */}
      <UpcomingMatches />

      {/* Classement actuel */}
      <CurrentStandings />

      {/* Top Teams */}
      <section className="container-custom py-20 bg-brand-secondary-50 dark:bg-brand-secondary-800/50">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
            Top Teams
          </h2>
          <Button variant="ghost" asChild>
            <Link href="/teams">View All</Link>
          </Button>
        </div>

        {topTeams.length > 0 ? (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {topTeams.map((team, index) => (
              <Link key={team.id} href={`/teams/${team.id}`}>
                <Card className="card-hover p-6 transition-all hover:border-brand-primary-500 border-2 border-transparent shadow-md hover:shadow-xl">
                  <div className="flex flex-col items-center text-center gap-4">
                    <div className="relative h-20 w-20 flex-shrink-0">
                      <Image
                        src={getTeamLogo(team.full_name)}
                        alt={`${team.full_name} logo`}
                        fill
                        className="object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-lg mb-2">
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
        ) : (
          <Card className="p-12 text-center">
            <p className="text-brand-secondary-500 text-lg">
              Unable to load teams at this time.
            </p>
            <p className="text-sm text-brand-secondary-400 mt-2">
              Please try refreshing the page.
            </p>
          </Card>
        )}
      </section>

      {/* Call to Action */}
      <section className="container-custom mb-20">
        <div className="rounded-2xl bg-gradient-to-r from-brand-secondary-800 to-brand-secondary-900 p-12 text-white text-center shadow-2xl">
          <h2 className="mb-4 text-4xl font-display font-bold">Stay Updated</h2>
          <p className="mx-auto mb-8 max-w-2xl text-white/90 text-lg">
            Get the latest news, scores, and highlights from the TSI League.
            Follow your favorite teams and players throughout the season.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button
              size="lg"
              variant="primary"
              className="bg-brand-accent-500 text-white hover:bg-brand-accent-600"
              asChild
            >
              <Link href="/matches">Discover More</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
