import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { nbaApi } from "@/lib/nba-api";
import { NBAGame } from "@/types/nba-api";
import { TSI_LEAGUE_CONFIG } from "@/lib/tsi-config";

async function getRecentMatches(): Promise<NBAGame[]> {
  try {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30); // Extended to 30 days to find more matches

    const formattedToday = today.toISOString().split("T")[0];
    const formattedThirtyDaysAgo = thirtyDaysAgo.toISOString().split("T")[0];

    // Get TSI team IDs as comma-separated string
    const tsiTeamIds = TSI_LEAGUE_CONFIG.selectedTeamIds.join(",");

    const response = await nbaApi.getGames({
      start_date: formattedThirtyDaysAgo,
      end_date: formattedToday,
      team_ids: tsiTeamIds, // Filter to TSI teams only
      per_page: "100",
    });

    const finishedGames = (response.data || [])
      .filter((game) => {
        // Only include finished games with TSI teams
        const isTSITeam = (teamId: number) => 
          TSI_LEAGUE_CONFIG.selectedTeamIds.includes(teamId);
        
        return (
          game.status === "Final" &&
          (isTSITeam(game.home_team.id) || isTSITeam(game.visitor_team.id))
        );
      })
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return finishedGames.slice(0, 5);
  } catch (error) {
    console.error("Error fetching recent matches:", error);
    // Return empty array but log the error for debugging
    if (process.env.NODE_ENV === "development") {
      console.error("Recent matches error details:", error);
    }
    return [];
  }
}

// Helper function to get team logo path - this should be centralized later
function getTeamLogo(teamName: string): string {
  const logoMap: { [key:string]: string } = {
    "Atlanta Hawks": "Atlanta.png",
    "Boston Celtics": "Boston.png",
    "Brooklyn Nets": "Brooklyn.png",
    "Charlotte Hornets": "Charlotte.png",
    "Chicago Bulls": "Chicago.png",
    "Cleveland Cavaliers": "Cleveland.png",
    "Dallas Mavericks": "Dallas.png",
    "Denver Nuggets": "Denver.png",
    "Detroit Pistons": "Detroit.png",
    "Golden State Warriors": "Golden State.png",
    "Houston Rockets": "Houston.png",
    "Indiana Pacers": "Indiana.png",
    "LA Clippers": "LAC.png",
    "Los Angeles Lakers": "Lakers.png",
    "Memphis Grizzlies": "Memphis.png",
    "Miami Heat": "Miami.png",
    "Milwaukee Bucks": "Milwaukee.png",
    "Minnesota Timberwolves": "Minnesota.png",
    "New Orleans Pelicans": "New Orleans.png",
    "New York Knicks": "NYK.png",
    "Oklahoma City Thunder": "Oklahoma City.png",
    "Orlando Magic": "Orlando.png",
    "Philadelphia 76ers": "PHI.png",
    "Phoenix Suns": "Phoenix.png",
    "Portland Trail Blazers": "POR.png",
    "Sacramento Kings": "Sacramento.png",
    "San Antonio Spurs": "San Antonio.png",
    "Toronto Raptors": "Toronto.png",
    "Utah Jazz": "Utah.png",
    "Washington Wizards": "Washington.png",
  };

  const fileName = logoMap[teamName];
  return fileName ? `/images/logos/teams/${fileName}` : "/images/logos/site/tsi-logo.png";
}

function MatchCard({ game }: { game: NBAGame }) {
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
        <h2 className="text-brand-secondary-900 dark:text-white">
          Latest Results
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/matches">View All →</Link>
        </Button>
      </div>

      {hasError ? (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 mb-2">
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
          <p className="text-brand-secondary-500">
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
