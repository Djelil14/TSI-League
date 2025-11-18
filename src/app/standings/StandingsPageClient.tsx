"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { StandingsTable, TeamStanding } from "@/components/teams/StandingsTable";

type ConferenceFilter = "all" | "East" | "West";

export default function StandingsPageClient({ standings }: { standings: TeamStanding[] }) {
  const [selectedConference, setSelectedConference] = useState<ConferenceFilter>("all");

  const filteredStandings = selectedConference === "all"
    ? standings
    : standings.filter((team) => team.conference === selectedConference);

  return (
    <>
      {/* Conference Filter */}
      <div className="mb-8 flex flex-wrap justify-center gap-2">
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

      {/* Standings Tables */}
      {selectedConference === "all" ? (
        <div className="space-y-12">
          {/* Eastern Conference */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-brand-secondary-900 dark:text-white">
                Eastern Conference
              </h2>
              <Badge variant="info">East</Badge>
            </div>
            <StandingsTable
              standings={standings.filter((t) => t.conference === "East")}
            />
          </div>

          {/* Western Conference */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <h2 className="text-brand-secondary-900 dark:text-white">
                Western Conference
              </h2>
              <Badge variant="warning">West</Badge>
            </div>
            <StandingsTable
              standings={standings.filter((t) => t.conference === "West")}
            />
          </div>
        </div>
      ) : (
        <StandingsTable standings={filteredStandings} />
      )}
    </>
  );
}
