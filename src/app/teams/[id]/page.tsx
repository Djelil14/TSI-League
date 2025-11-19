import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { nbaApi } from "@/lib/nba-api";
import { notFound } from "next/navigation";
import { TSI_LEAGUE_CONFIG } from "@/lib/tsi-config";

// Use dynamic rendering instead of static generation to avoid build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes (ISR)

// Don't generate static params - pages will be rendered on demand
// This prevents build timeouts due to API rate limiting

interface TeamPageProps {
  params: {
    id: string;
  };
}

async function getTeamData(id: number) {
  try {
    // Sequential requests with delays to avoid rate limiting
    // Instead of Promise.all, we make requests one by one
    const team = await nbaApi.getTeamById(id);
    
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const roster = await nbaApi.getTeamPlayers(id).catch(() => []);
    
    // Small delay between requests
    await new Promise((resolve) => setTimeout(resolve, 100));
    
    const games = await nbaApi
      .getTeamGames(id, new Date().getFullYear().toString())
      .catch(() => []);

    return { team, roster, games };
  } catch (error) {
    console.error("Error fetching team data:", error);
    return null;
  }
}

export default async function TeamPage({ params }: TeamPageProps) {
  const teamId = parseInt(params.id);

  if (isNaN(teamId)) {
    notFound();
  }

  const data = await getTeamData(teamId);

  if (!data) {
    notFound();
  }

  const { team, roster, games } = data;

  // Calculate record from games
  const homeWins = games.filter(
    (g) => g.home_team.id === teamId && g.home_team_score > g.visitor_team_score
  ).length;
  const awayWins = games.filter(
    (g) =>
      g.visitor_team.id === teamId && g.visitor_team_score > g.home_team_score
  ).length;
  const totalWins = homeWins + awayWins;
  const totalLosses = games.filter((g) => g.status === "Final").length - totalWins;
  const winPercentage =
    games.length > 0 ? ((totalWins / games.length) * 100).toFixed(1) : "0.0";

  // Get recent games (last 5)
  const recentGames = games
    .filter((g) => g.status === "Final")
    .sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
    .slice(0, 5);

  return (
    <div className="container-custom py-12">
      {/* Team Header */}
      <div className="mb-12">
        <div className="flex flex-col items-center gap-6 md:flex-row">
          {/* Team Logo */}
          <div className="flex h-40 w-40 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-primary-500 to-brand-accent-500 shadow-glow">
            <div className="text-center text-white">
              <div className="text-6xl font-display font-black">
                {team.abbreviation}
              </div>
            </div>
          </div>

          {/* Team Info */}
          <div className="flex-1 text-center md:text-left">
            <div className="mb-2 flex flex-wrap justify-center gap-2 md:justify-start">
              <Badge variant="info">{team.conference} Conference</Badge>
              <Badge variant="secondary">{team.division} Division</Badge>
            </div>
            <h1 className="mb-2 text-brand-secondary-900 dark:text-white">
              {team.full_name}
            </h1>
            <p className="text-xl text-brand-secondary-600 dark:text-brand-secondary-400">
              {team.city}, {team.abbreviation}
            </p>
          </div>

          {/* Record Stats */}
          <div className="rounded-xl bg-brand-secondary-100 dark:bg-brand-secondary-800 p-6">
            <div className="text-center">
              <div className="stat-number text-brand-primary-500">
                {totalWins}-{totalLosses}
              </div>
              <p className="text-sm text-brand-secondary-500">
                {winPercentage}% Win Rate
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Team Stats Overview */}
      <div className="mb-12 grid gap-6 md:grid-cols-3">
        <Card className="p-6 text-center">
          <CardTitle className="mb-2 text-4xl font-display text-brand-primary-500">
            {totalWins}
          </CardTitle>
          <p className="text-brand-secondary-500">Total Wins</p>
        </Card>
        <Card className="p-6 text-center">
          <CardTitle className="mb-2 text-4xl font-display text-brand-primary-500">
            {totalLosses}
          </CardTitle>
          <p className="text-brand-secondary-500">Total Losses</p>
        </Card>
        <Card className="p-6 text-center">
          <CardTitle className="mb-2 text-4xl font-display text-brand-primary-500">
            {roster.length}
          </CardTitle>
          <p className="text-brand-secondary-500">Players</p>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Roster */}
          <Card>
            <CardHeader>
              <CardTitle>Team Roster</CardTitle>
            </CardHeader>
            <CardContent>
              {roster.length > 0 ? (
                <div className="space-y-2">
                  {roster.map((player) => (
                    <Link
                      key={player.id}
                      href={`/players/${player.id}`}
                      className="block"
                    >
                      <div className="flex items-center justify-between rounded-lg p-4 transition-colors hover:bg-brand-secondary-50 dark:hover:bg-brand-secondary-700">
                        <div className="flex items-center gap-4">
                          <Badge variant="primary">
                            #{player.jersey_number || "0"}
                          </Badge>
                          <div>
                            <div className="font-semibold">
                              {player.first_name} {player.last_name}
                            </div>
                            <div className="text-sm text-brand-secondary-500">
                              {player.position} • {player.height || "N/A"}
                            </div>
                          </div>
                        </div>
                        <Badge variant="secondary">{player.position}</Badge>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-brand-secondary-500">
                  No roster information available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Recent Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Recent Games</CardTitle>
                <Button variant="ghost" size="sm" asChild>
                  <Link href="/matches">View All</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {recentGames.length > 0 ? (
                <div className="space-y-4">
                  {recentGames.map((game) => {
                    const isHome = game.home_team.id === teamId;
                    const teamScore = isHome
                      ? game.home_team_score
                      : game.visitor_team_score;
                    const opponentScore = isHome
                      ? game.visitor_team_score
                      : game.home_team_score;
                    const opponent = isHome
                      ? game.visitor_team
                      : game.home_team;
                    const won = teamScore > opponentScore;

                    return (
                      <div
                        key={game.id}
                        className="flex items-center justify-between rounded-lg border border-brand-secondary-200 dark:border-brand-secondary-700 p-4"
                      >
                        <div className="flex items-center gap-4">
                          <Badge variant={won ? "success" : "danger"}>
                            {won ? "W" : "L"}
                          </Badge>
                          <div>
                            <div className="font-semibold">
                              {isHome ? "vs" : "@"} {opponent.abbreviation}
                            </div>
                            <div className="text-sm text-brand-secondary-500">
                              {new Date(game.date).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xl font-bold">
                            {teamScore} - {opponentScore}
                          </div>
                          <div className="text-xs text-brand-secondary-500">
                            Final
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="py-8 text-center text-brand-secondary-500">
                  No recent games available
                </p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Team Information */}
          <Card>
            <CardHeader>
              <CardTitle>Team Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="text-sm text-brand-secondary-500">
                  Full Name
                </div>
                <div className="font-semibold">{team.full_name}</div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">City</div>
                <div className="font-semibold">{team.city}</div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">
                  Abbreviation
                </div>
                <div className="font-semibold">{team.abbreviation}</div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">
                  Conference
                </div>
                <div className="font-semibold">{team.conference}</div>
              </div>
              <div>
                <div className="text-sm text-brand-secondary-500">
                  Division
                </div>
                <div className="font-semibold">{team.division}</div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" fullWidth asChild>
                <Link href="/matches">View Schedule</Link>
              </Button>
              <Button variant="outline" fullWidth asChild>
                <Link href="/standings">See Standings</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
