"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { NBAGame } from "@/types/nba-api";

type MatchStatus = "all" | "live" | "finished" | "upcoming";

export default function MatchesPage() {
  const [matches, setMatches] = useState<NBAGame[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<NBAGame[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatches() {
      setLoading(true);
      try {
        const params = new URLSearchParams();

        if (selectedDate) {
          params.append("dates", selectedDate);
        } else {
          // Get current season
          const year = new Date().getFullYear();
          params.append("seasons", year.toString());
        }

        params.append("per_page", "100");

        const response = await fetch(`/api/matches?${params.toString()}`);
        const data = await response.json();

        const gamesData = data.data || data;
        // Sort by date (most recent first)
        const sortedGames = gamesData.sort(
          (a: NBAGame, b: NBAGame) =>
            new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        setMatches(sortedGames);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchMatches();
  }, [selectedDate]);

  useEffect(() => {
    let filtered = matches;

    if (selectedStatus === "live") {
      filtered = matches.filter((m) => m.status !== "Final" && m.period > 0);
    } else if (selectedStatus === "finished") {
      filtered = matches.filter((m) => m.status === "Final");
    } else if (selectedStatus === "upcoming") {
      filtered = matches.filter((m) => m.period === 0 && m.status !== "Final");
    }

    setFilteredMatches(filtered);
  }, [selectedStatus, matches]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const date = match.date.split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, NBAGame[]>);

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-brand-secondary-900 dark:text-white">
          Matches & Schedule
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          View all games, scores, and upcoming matches
        </p>
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Status Filter */}
        <div className="flex flex-wrap justify-center gap-2">
          <Button
            variant={selectedStatus === "all" ? "primary" : "outline"}
            onClick={() => setSelectedStatus("all")}
          >
            All Matches
          </Button>
          <Button
            variant={selectedStatus === "live" ? "primary" : "outline"}
            onClick={() => setSelectedStatus("live")}
          >
            Live
          </Button>
          <Button
            variant={selectedStatus === "finished" ? "primary" : "outline"}
            onClick={() => setSelectedStatus("finished")}
          >
            Finished
          </Button>
          <Button
            variant={selectedStatus === "upcoming" ? "primary" : "outline"}
            onClick={() => setSelectedStatus("upcoming")}
          >
            Upcoming
          </Button>
        </div>

        {/* Date Filter */}
        <div className="flex flex-wrap justify-center gap-4">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            className="rounded-lg border border-brand-secondary-300 bg-white px-4 py-2 text-brand-secondary-900 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white"
          />
          <Button
            variant="outline"
            onClick={() => setSelectedDate("")}
          >
            Clear Date
          </Button>
          <Button
            variant="secondary"
            onClick={() => setSelectedDate(today)}
          >
            Today
          </Button>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6 text-center">
          <p className="text-sm text-brand-secondary-500">
            Showing {filteredMatches.length} match
            {filteredMatches.length !== 1 ? "es" : ""}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-primary-500 border-r-transparent"></div>
            <p className="mt-4 text-brand-secondary-500">Loading matches...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Matches List Grouped by Date */}
          {Object.keys(groupedMatches).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(groupedMatches)
                .sort(([dateA], [dateB]) => dateB.localeCompare(dateA))
                .map(([date, dateMatches]) => (
                  <div key={date}>
                    {/* Date Header */}
                    <div className="mb-4 flex items-center gap-4">
                      <h3 className="text-2xl font-display font-bold text-brand-secondary-900 dark:text-white">
                        {new Date(date + "T00:00:00").toLocaleDateString(
                          "en-US",
                          {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )}
                      </h3>
                      <Badge variant="secondary">
                        {dateMatches.length} game
                        {dateMatches.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>

                    {/* Matches for this date */}
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                      {dateMatches.map((match) => {
                        const isLive = match.status !== "Final" && match.period > 0;
                        const isFinished = match.status === "Final";

                        return (
                          <Card
                            key={match.id}
                            className={`p-6 transition-all ${
                              isLive
                                ? "border-green-500 shadow-lg"
                                : "hover:border-brand-primary-500"
                            }`}
                          >
                            {/* Status Badge */}
                            <div className="mb-4 flex items-center justify-between">
                              <Badge
                                variant={
                                  isLive
                                    ? "success"
                                    : isFinished
                                    ? "secondary"
                                    : "info"
                                }
                              >
                                {isLive
                                  ? "LIVE"
                                  : isFinished
                                  ? "FINAL"
                                  : "SCHEDULED"}
                              </Badge>
                              {isLive && match.period > 0 && (
                                <span className="text-sm font-semibold text-brand-secondary-500">
                                  Q{match.period} {match.time}
                                </span>
                              )}
                            </div>

                            {/* Teams and Scores */}
                            <div className="space-y-3">
                              {/* Visitor Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary-100 dark:bg-brand-secondary-700">
                                    <span className="text-xs font-bold">
                                      {match.visitor_team.abbreviation}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {match.visitor_team.abbreviation}
                                    </div>
                                    <div className="text-xs text-brand-secondary-500">
                                      Away
                                    </div>
                                  </div>
                                </div>
                                <div className="text-3xl font-display font-bold text-brand-primary-500">
                                  {match.visitor_team_score}
                                </div>
                              </div>

                              {/* Home Team */}
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary-100 dark:bg-brand-secondary-700">
                                    <span className="text-xs font-bold">
                                      {match.home_team.abbreviation}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold">
                                      {match.home_team.abbreviation}
                                    </div>
                                    <div className="text-xs text-brand-secondary-500">
                                      Home
                                    </div>
                                  </div>
                                </div>
                                <div className="text-3xl font-display font-bold text-brand-primary-500">
                                  {match.home_team_score}
                                </div>
                              </div>
                            </div>

                            {/* Match Info */}
                            <div className="mt-4 pt-4 border-t border-brand-secondary-200 dark:border-brand-secondary-700">
                              <div className="flex items-center justify-between text-xs text-brand-secondary-500">
                                <span>Season {match.season}</span>
                                {match.postseason && (
                                  <Badge variant="accent" size="sm">
                                    Playoffs
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  </div>
                ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-brand-secondary-500">
                No matches found for the selected filters
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
