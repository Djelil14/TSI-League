import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { tsiApi } from "@/lib/tsi-api";
import { notFound } from "next/navigation";

// Use dynamic rendering instead of static generation to avoid build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes (ISR)

// Don't generate static params - pages will be rendered on demand
// This prevents build timeouts due to API rate limiting

interface PlayerPageProps {
  params: {
    id: string;
  };
}

async function getPlayerData(id: number) {
  try {
    const player = tsiApi.getPlayerById(id);
    // Stats are already in player.stats from the mock data
    return { player, stats: null };
  } catch (error) {
    console.error("Error fetching player data:", error);
    return null;
  }
}

export default async function PlayerPage({ params }: PlayerPageProps) {
  const playerId = parseInt(params.id);

  if (isNaN(playerId)) {
    notFound();
  }

  const data = await getPlayerData(playerId);

  if (!data) {
    notFound();
  }

  const { player } = data;

  // Use player stats from mock data
  const seasonStats = player && (player as any).stats ? {
    gamesPlayed: (player as any).stats.gamesPlayed || 0,
    ppg: ((player as any).stats.pointsPerGame || 0).toFixed(1),
    apg: ((player as any).stats.assistsPerGame || 0).toFixed(1),
    rpg: ((player as any).stats.reboundsPerGame || 0).toFixed(1),
    spg: ((player as any).stats.stealsPerGame || 0).toFixed(1),
    bpg: ((player as any).stats.blocksPerGame || 0).toFixed(1),
    fgPct: ((player as any).stats.fieldGoalPercentage || 0).toFixed(1),
    fg3Pct: ((player as any).stats.threePointPercentage || 0).toFixed(1),
    ftPct: ((player as any).stats.freeThrowPercentage || 0).toFixed(1),
  } : null;

  return (
    <div className="container-custom py-12">
      {/* Player Header */}
      <div className="mb-12">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Player Photo */}
          <div className="relative h-48 w-48 overflow-hidden rounded-2xl border-2 border-brand-primary-500 shadow-glow">
            <Image
              src={player.photo || `/api/players/${player.id}/avatar`}
              alt={`${player.first_name} ${player.last_name}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Player Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap justify-center gap-2 md:justify-start">
              <Badge variant="primary" size="lg">
                {player.position}
              </Badge>
              <Badge variant="secondary" size="lg">
                #{player.jersey_number || "0"}
              </Badge>
            </div>
            <h1 className="mb-2 text-brand-secondary-900 dark:text-white">
              {player.first_name} {player.last_name}
            </h1>
            <Link
              href={`/teams/${player.team.id}`}
              className="inline-block text-xl text-brand-primary-500 hover:text-brand-primary-600 transition-colors"
            >
              {player.team.full_name}
            </Link>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Season Stats */}
          {seasonStats ? (
            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3">
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.ppg}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Points Per Game
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.apg}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Assists Per Game
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.rpg}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Rebounds Per Game
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.spg}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Steals Per Game
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.bpg}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Blocks Per Game
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="stat-number text-brand-primary-500">
                      {seasonStats.gamesPlayed}
                    </div>
                    <p className="text-sm text-brand-secondary-500">
                      Games Played
                    </p>
                  </div>
                </div>

                <div className="mt-8 border-t border-brand-secondary-200 dark:border-brand-secondary-700 pt-6">
                  <h4 className="mb-4 text-lg font-semibold">
                    Shooting Percentages
                  </h4>
                  <div className="grid gap-4 sm:grid-cols-3">
                    <div>
                      <div className="mb-1 text-sm text-brand-secondary-500">
                        Field Goal %
                      </div>
                      <div className="text-2xl font-bold text-brand-primary-500">
                        {seasonStats.fgPct}%
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-brand-secondary-500">
                        3-Point %
                      </div>
                      <div className="text-2xl font-bold text-brand-primary-500">
                        {seasonStats.fg3Pct}%
                      </div>
                    </div>
                    <div>
                      <div className="mb-1 text-sm text-brand-secondary-500">
                        Free Throw %
                      </div>
                      <div className="text-2xl font-bold text-brand-primary-500">
                        {seasonStats.ftPct}%
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Season Statistics</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="py-8 text-center text-brand-secondary-500">
                  Season statistics are not available at this time
                </p>
              </CardContent>
            </Card>
          )}

          {/* Career Information */}
          <Card>
            <CardHeader>
              <CardTitle>Career Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {player.birthDate && (
                  <div>
                    <div className="text-sm text-brand-secondary-500">
                      Birth Date
                    </div>
                    <div className="text-lg font-semibold">
                      {new Date(player.birthDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </div>
                  </div>
                )}
                {player.country && (
                  <div>
                    <div className="text-sm text-brand-secondary-500">
                      Country
                    </div>
                    <div className="text-lg font-semibold">
                      {player.country}
                    </div>
                  </div>
                )}
                {player.birthDate && (
                  <div>
                    <div className="text-sm text-brand-secondary-500">
                      Age
                    </div>
                    <div className="text-lg font-semibold">
                      {(() => {
                        const today = new Date();
                        const birth = new Date(player.birthDate!);
                        let age = today.getFullYear() - birth.getFullYear();
                        const monthDiff = today.getMonth() - birth.getMonth();
                        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
                          age--;
                        }
                        return age;
                      })()} years old
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Physical Info */}
          <Card>
            <CardHeader>
              <CardTitle>Physical Info</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-brand-secondary-500">Position</div>
                <div className="text-lg font-semibold">{player.position}</div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">Height</div>
                <div className="text-lg font-semibold">
                  {player.height || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">Weight</div>
                <div className="text-lg font-semibold">
                  {player.weight || "N/A"}
                </div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">
                  Jersey Number
                </div>
                <div className="text-lg font-semibold">
                  #{player.jersey_number || "0"}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Current Team */}
          <Card>
            <CardHeader>
              <CardTitle>Current Team</CardTitle>
            </CardHeader>
            <CardContent>
              <Link
                href={`/teams/${player.team.id}`}
                className="block text-center"
              >
                <div className="mb-4 flex h-24 items-center justify-center rounded-lg bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-700 dark:to-brand-secondary-800">
                  <div className="text-3xl font-display font-black text-brand-primary-500">
                    {player.team.abbreviation}
                  </div>
                </div>
                <div className="font-semibold text-brand-primary-500 hover:text-brand-primary-600 transition-colors">
                  {player.team.full_name}
                </div>
                <div className="text-sm text-brand-secondary-500">
                  {player.team.conference} Conference
                </div>
              </Link>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" fullWidth asChild>
                <Link href={`/teams/${player.team.id}`}>View Team</Link>
              </Button>
              <Button variant="outline" fullWidth asChild>
                <Link href="/players">All Players</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
