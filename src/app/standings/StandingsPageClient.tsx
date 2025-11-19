"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { StandingsTable, TeamStanding } from "@/components/teams/StandingsTable";

type ConferenceFilter = "all" | "East" | "West";

export default function StandingsPageClient({ standings }: { standings: TeamStanding[] }) {
  const [selectedConference, setSelectedConference] = useState<ConferenceFilter>("all");

  const filteredStandings = selectedConference === "all"
    ? standings
    : standings.filter((team) => team.conference === selectedConference);

  // Calculate statistics
  const totalGames = standings.length > 0 
    ? standings.reduce((sum, team) => sum + team.wins + team.losses, 0)
    : 0;
  const avgWinPercentage = standings.length > 0
    ? standings.reduce((sum, team) => sum + team.winPercentage, 0) / standings.length
    : 0;
  const topTeam = standings.length > 0 ? standings[0] : null;

  return (
    <>
      {/* Statistics Cards */}
      <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-brand-primary-500 to-brand-primary-600 text-white">
          <div className="text-sm font-medium opacity-90 mb-1">Total Games Played</div>
          <div className="text-3xl font-display font-bold">{totalGames}</div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 text-white">
          <div className="text-sm font-medium opacity-90 mb-1">Average Win %</div>
          <div className="text-3xl font-display font-bold">{avgWinPercentage.toFixed(1)}%</div>
        </Card>
        <Card className="p-6 bg-gradient-to-br from-brand-secondary-800 to-brand-secondary-900 text-white">
          <div className="text-sm font-medium opacity-90 mb-1">Top Team</div>
          <div className="text-xl font-display font-bold truncate">{topTeam?.full_name || "N/A"}</div>
          <div className="text-sm opacity-75 mt-1">
            {topTeam?.wins}-{topTeam?.losses} ({topTeam?.winPercentage.toFixed(1)}%)
          </div>
        </Card>
      </div>

      {/* Conference Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
        <Button
          variant={selectedConference === "all" ? "primary" : "outline"}
          onClick={() => setSelectedConference("all")}
          size="lg"
        >
          All Teams
        </Button>
        <Button
          variant={selectedConference === "East" ? "primary" : "outline"}
          onClick={() => setSelectedConference("East")}
          size="lg"
        >
          Eastern Conference
        </Button>
        <Button
          variant={selectedConference === "West" ? "primary" : "outline"}
          onClick={() => setSelectedConference("West")}
          size="lg"
        >
          Western Conference
        </Button>
      </div>

      {/* Standings Tables */}
      {selectedConference === "all" ? (
        <div className="space-y-12">
          {/* Eastern Conference */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-blue-500 to-blue-600"></div>
              <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
                Eastern Conference
              </h2>
              <Badge variant="info" className="text-sm">East</Badge>
              <div className="flex-1 h-px bg-brand-secondary-200 dark:bg-brand-secondary-700"></div>
            </div>
            <StandingsTable
              standings={standings.filter((t) => t.conference === "East")}
            />
          </div>

          {/* Western Conference */}
          <div>
            <div className="mb-6 flex items-center gap-4">
              <div className="h-1 w-16 bg-gradient-to-r from-brand-accent-500 to-brand-accent-600"></div>
              <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
                Western Conference
              </h2>
              <Badge variant="warning" className="text-sm">West</Badge>
              <div className="flex-1 h-px bg-brand-secondary-200 dark:bg-brand-secondary-700"></div>
            </div>
            <StandingsTable
              standings={standings.filter((t) => t.conference === "West")}
            />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <div className={`h-1 w-16 bg-gradient-to-r ${
              selectedConference === "East" 
                ? "from-blue-500 to-blue-600" 
                : "from-brand-accent-500 to-brand-accent-600"
            }`}></div>
            <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
              {selectedConference === "East" ? "Eastern" : "Western"} Conference
            </h2>
            <Badge variant={selectedConference === "East" ? "info" : "warning"} className="text-sm">
              {selectedConference}
            </Badge>
            <div className="flex-1 h-px bg-brand-secondary-200 dark:bg-brand-secondary-700"></div>
          </div>
          <StandingsTable standings={filteredStandings} />
        </div>
      )}
    </>
  );
}
