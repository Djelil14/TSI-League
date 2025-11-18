"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { NBATeam } from "@/types/nba-api";
import { TSI_LEAGUE_CONFIG } from "@/lib/tsi-config";

export default function TeamsPage() {
  const [teams, setTeams] = useState<NBATeam[]>([]);
  const [filteredTeams, setFilteredTeams] = useState<NBATeam[]>([]);
  const [selectedConference, setSelectedConference] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  // Helper function to get team logo path
  const getTeamLogo = (team: NBATeam): string => {
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

    const fileName = logoMap[team.full_name];
    return fileName ? `/images/logos/teams/${fileName}` : "/images/logos/site/tsi-logo.png";
  };

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        const result = await response.json();
        const allTeams = result.data || result;

        // Filter to only TSI League teams
        const tsiTeams = allTeams.filter((team: NBATeam) =>
          TSI_LEAGUE_CONFIG.selectedTeamIds.includes(team.id)
        );

        setTeams(tsiTeams);
        setFilteredTeams(tsiTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTeams();
  }, []);

  useEffect(() => {
    if (selectedConference === "all") {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(
        teams.filter((team) => team.conference === selectedConference)
      );
    }
  }, [selectedConference, teams]);

  if (loading) {
    return (
      <div className="container-custom py-20">
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-primary-500 border-r-transparent"></div>
            <p className="mt-4 text-brand-secondary-500">Loading teams...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-brand-secondary-900 dark:text-white">
          TSI League Teams
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          Explore all {TSI_LEAGUE_CONFIG.league.totalTeams} teams competing in the Thunder Strike International League
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 flex flex-wrap justify-center gap-4">
        <Button
          variant={selectedConference === "all" ? "primary" : "outline"}
          onClick={() => setSelectedConference("all")}
        >
          All Teams
        </Button>
        <Button
          variant={selectedConference === "East" ? "primary" : "outline"}
          onClick={() => setSelectedConference("East")}
        >
          Eastern Conference
        </Button>
        <Button
          variant={selectedConference === "West" ? "primary" : "outline"}
          onClick={() => setSelectedConference("West")}
        >
          Western Conference
        </Button>
      </div>

      {/* Teams Count */}
      <div className="mb-6 text-center">
        <p className="text-sm text-brand-secondary-500">
          Showing {filteredTeams.length} team
          {filteredTeams.length !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Teams Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredTeams.map((team) => (
          <Link key={team.id} href={`/teams/${team.id}`}>
            <Card className="card-hover group relative h-full overflow-hidden p-6 transition-all hover:border-brand-primary-500">
              {/* Conference Badge */}
              <Badge
                variant={team.conference === "East" ? "info" : "warning"}
                className="absolute right-4 top-4"
              >
                {team.conference}
              </Badge>

              {/* Team Logo Placeholder */}
              <div className="mb-4 flex h-32 items-center justify-center rounded-lg bg-white dark:bg-brand-secondary-700 p-4">
                <Image
                  src={getTeamLogo(team)}
                  alt={`${team.full_name} logo`}
                  width={96}
                  height={96}
                  className="object-contain"
                />
              </div>

              {/* Team Info */}
              <div>
                <h3 className="mb-1 text-xl font-bold group-hover:text-brand-primary-500 transition-colors">
                  {team.name}
                </h3>
                <p className="mb-2 text-sm text-brand-secondary-500">
                  {team.city}
                </p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-brand-secondary-500">
                    {team.division} Division
                  </span>
                  <Badge variant="secondary" size="sm">
                    {team.abbreviation}
                  </Badge>
                </div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {filteredTeams.length === 0 && (
        <Card className="p-12 text-center">
          <p className="text-brand-secondary-500">No teams found</p>
        </Card>
      )}
    </div>
  );
}
