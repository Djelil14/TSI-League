import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import Image from "next/image";
import { getUpcomingMatches } from "@/data/matches/upcoming";
import { NBAGame } from "@/types/nba-api";

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
    <Card className="card-hover p-4 flex flex-col items-center justify-center text-center">
      <div className="flex items-center gap-4">
        {/* Visitor Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            <Image
              src={getTeamLogo(game.visitor_team.full_name)}
              alt={`${game.visitor_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold">{game.visitor_team.abbreviation}</span>
        </div>

        <span className="text-2xl font-bold">VS</span>

        {/* Home Team */}
        <div className="flex flex-col items-center gap-2">
          <div className="relative h-16 w-16">
            <Image
              src={getTeamLogo(game.home_team.full_name)}
              alt={`${game.home_team.full_name} logo`}
              fill
              className="object-contain"
            />
          </div>
          <span className="text-sm font-semibold">{game.home_team.abbreviation}</span>
        </div>
      </div>

        {/* Match Info */}
        <div className="text-center mt-4">
            <div className="text-xs bg-gray-200 text-gray-800 rounded-full px-2 py-1 inline-block">
                Upcoming
            </div>
            <div className="text-sm font-bold mt-2">
                {new Date(game.date).toLocaleDateString()} - {new Date(game.date).toLocaleTimeString()}
            </div>
            <div className="text-xs text-brand-secondary-500">
                {game.status}
            </div>
        </div>
    </Card>
  );
}


export default async function UpcomingMatches() {
  let upcomingMatches: NBAGame[] = [];
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
        <h2 className="text-brand-secondary-900 dark:text-white">
          Upcoming Matches
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/matches">Calendar →</Link>
        </Button>
      </div>

      {hasError ? (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500 mb-2">
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
          <p className="text-brand-secondary-500">
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
