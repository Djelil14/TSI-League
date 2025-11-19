"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import { tsiApi } from "@/lib/tsi-api";
import type { TSIGame, TSITeam } from "@/lib/tsi-api";
import { getTeamLogo } from "@/lib/utils/team-utils";

type MatchStatus = "all" | "live" | "finished" | "upcoming";
type ViewMode = "grid" | "list" | "calendar";

export default function MatchesPage() {
  const [matches, setMatches] = useState<TSIGame[]>([]);
  const [filteredMatches, setFilteredMatches] = useState<TSIGame[]>([]);
  const [teams, setTeams] = useState<TSITeam[]>([]);
  const [selectedStatus, setSelectedStatus] = useState<MatchStatus>("all");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load teams and matches
    async function loadData() {
      setLoading(true);
      try {
        const [teamsData, allGames] = await Promise.all([
          Promise.resolve(tsiApi.getAllTeams()),
          Promise.resolve(tsiApi.getAllGames()),
        ]);

        setTeams(teamsData);
        // Sort by date (most recent first)
        const sortedGames = allGames.sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
        setMatches(sortedGames);
      } catch (error) {
        console.error("Error fetching matches:", error);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  useEffect(() => {
    let filtered = matches;

    // Filter by status
    if (selectedStatus === "live") {
      filtered = filtered.filter((m) => m.status === "In Progress");
    } else if (selectedStatus === "finished") {
      filtered = filtered.filter((m) => m.status === "Final");
    } else if (selectedStatus === "upcoming") {
      filtered = filtered.filter((m) => m.status === "Scheduled");
    }

    // Filter by team
    if (selectedTeam !== "all") {
      const teamId = parseInt(selectedTeam);
      filtered = filtered.filter(
        (m) => m.home_team.id === teamId || m.visitor_team.id === teamId
      );
    }

    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter((m) => {
        const matchDate = new Date(m.date).toISOString().split("T")[0];
        return matchDate === selectedDate;
      });
    }

    setFilteredMatches(filtered);
  }, [selectedStatus, selectedTeam, selectedDate, matches]);

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  // Group matches by date
  const groupedMatches = filteredMatches.reduce((acc, match) => {
    const date = new Date(match.date).toISOString().split("T")[0];
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(match);
    return acc;
  }, {} as Record<string, TSIGame[]>);

  const MatchCardGrid = ({ game }: { game: TSIGame }) => {
    const isLive = game.status === "In Progress";
    const isFinished = game.status === "Final";
    const isUpcoming = game.status === "Scheduled";

    return (
      <Link href={`/matches/${game.id}`}>
        <Card
          className={`card-hover p-6 transition-all border-2 ${
            isLive
              ? "border-green-500 shadow-lg shadow-green-500/20 animate-pulse"
              : isUpcoming
              ? "border-brand-accent-500 hover:border-brand-accent-600"
              : "border-transparent hover:border-brand-primary-500"
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
                  : "accent"
              }
              className={
                isLive
                  ? "animate-pulse"
                  : isUpcoming
                  ? "bg-brand-accent-500 text-white"
                  : ""
              }
            >
              {isLive ? "🔴 LIVE" : isFinished ? "FINAL" : "UPCOMING"}
            </Badge>
            {isLive && (
              <span className="flex items-center gap-1 text-sm font-semibold text-green-500">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                LIVE
              </span>
            )}
          </div>

          {/* Teams and Scores */}
          <div className="space-y-4">
            {/* Visitor Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={getTeamLogo(game.visitor_team.full_name)}
                    alt={`${game.visitor_team.full_name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {game.visitor_team.abbreviation}
                  </div>
                  <div className="text-xs text-brand-secondary-500 truncate">
                    {game.visitor_team.full_name}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-brand-primary-500">
                {game.visitor_team_score || "-"}
              </div>
            </div>

            <div className="h-px bg-brand-secondary-200 dark:bg-brand-secondary-700"></div>

            {/* Home Team */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 flex-1">
                <div className="relative h-12 w-12 flex-shrink-0">
                  <Image
                    src={getTeamLogo(game.home_team.full_name)}
                    alt={`${game.home_team.full_name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {game.home_team.abbreviation}
                  </div>
                  <div className="text-xs text-brand-secondary-500 truncate">
                    {game.home_team.full_name}
                  </div>
                </div>
              </div>
              <div className="text-3xl font-display font-bold text-brand-primary-500">
                {game.home_team_score || "-"}
              </div>
            </div>
          </div>

          {/* Match Info */}
          <div className="mt-4 pt-4 border-t border-brand-secondary-200 dark:border-brand-secondary-700">
            <div className="flex items-center justify-between text-xs text-brand-secondary-500">
              <span>
                {new Date(game.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span>
                {new Date(game.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  const MatchCardList = ({ game }: { game: TSIGame }) => {
    const isLive = game.status === "In Progress";
    const isFinished = game.status === "Final";

    return (
      <Link href={`/matches/${game.id}`}>
        <Card
          className={`card-hover p-4 transition-all border-l-4 ${
            isLive
              ? "border-l-green-500 bg-green-50/50 dark:bg-green-950/20"
              : isFinished
              ? "border-l-brand-secondary-400"
              : "border-l-brand-accent-500"
          }`}
        >
          <div className="flex items-center gap-6">
            {/* Date/Time */}
            <div className="flex-shrink-0 text-center min-w-[80px]">
              <div className="text-xs text-brand-secondary-500">
                {new Date(game.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}
              </div>
              <div className="text-sm font-semibold">
                {new Date(game.date).toLocaleTimeString("en-US", {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>

            {/* Teams */}
            <div className="flex-1 grid grid-cols-2 gap-4">
              {/* Visitor */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={getTeamLogo(game.visitor_team.full_name)}
                    alt={`${game.visitor_team.full_name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {game.visitor_team.abbreviation}
                  </div>
                </div>
                <div className="text-2xl font-display font-bold text-brand-primary-500">
                  {game.visitor_team_score || "-"}
                </div>
              </div>

              {/* Home */}
              <div className="flex items-center gap-3">
                <div className="relative h-10 w-10 flex-shrink-0">
                  <Image
                    src={getTeamLogo(game.home_team.full_name)}
                    alt={`${game.home_team.full_name} logo`}
                    fill
                    className="object-contain"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm truncate">
                    {game.home_team.abbreviation}
                  </div>
                </div>
                <div className="text-2xl font-display font-bold text-brand-primary-500">
                  {game.home_team_score || "-"}
                </div>
              </div>
            </div>

            {/* Status */}
            <div className="flex-shrink-0">
              <Badge
                variant={
                  isLive
                    ? "success"
                    : isFinished
                    ? "secondary"
                    : "accent"
                }
                className={isLive ? "animate-pulse" : ""}
              >
                {isLive ? "LIVE" : isFinished ? "FINAL" : "UPCOMING"}
              </Badge>
            </div>
          </div>
        </Card>
      </Link>
    );
  };

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-display font-bold text-brand-secondary-900 dark:text-white">
          Matches & Schedule
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          View all games, scores, and upcoming matches
        </p>
      </div>

      {/* Filters Section */}
      <Card className="mb-8 p-6">
        <div className="space-y-6">
        {/* Status Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
              Filter by Status
            </label>
            <div className="flex flex-wrap gap-2">
              {[
                { value: "all", label: "All Matches" },
                { value: "live", label: "🔴 Live" },
                { value: "finished", label: "Finished" },
                { value: "upcoming", label: "Upcoming" },
              ].map((status) => (
          <Button
                  key={status.value}
                  variant={selectedStatus === status.value ? "primary" : "outline"}
                  onClick={() => setSelectedStatus(status.value as MatchStatus)}
                  size="sm"
                >
                  {status.label}
          </Button>
              ))}
            </div>
          </div>

          {/* Team Filter */}
          <div>
            <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
              Filter by Team
            </label>
            <select
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full rounded-lg border border-brand-secondary-300 bg-white px-4 py-2 text-brand-secondary-900 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white"
            >
              <option value="all">All Teams</option>
              {teams.map((team) => (
                <option key={team.id} value={team.id.toString()}>
                  {team.full_name}
                </option>
              ))}
            </select>
        </div>

          {/* Date Filter & View Mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
                Filter by Date
              </label>
              <div className="flex gap-2">
          <input
            type="date"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
                  className="flex-1 rounded-lg border border-brand-secondary-300 bg-white px-4 py-2 text-brand-secondary-900 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white"
          />
          <Button
            variant="outline"
                  size="sm"
            onClick={() => setSelectedDate("")}
          >
                  Clear
          </Button>
          <Button
            variant="secondary"
                  size="sm"
            onClick={() => setSelectedDate(today)}
          >
            Today
          </Button>
        </div>
      </div>

            <div>
              <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
                View Mode
              </label>
              <div className="flex gap-2">
                <Button
                  variant={viewMode === "grid" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                >
                  Grid
                </Button>
                <Button
                  variant={viewMode === "list" ? "primary" : "outline"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                >
                  List
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6 flex items-center justify-between">
          <p className="text-sm text-brand-secondary-500">
            Showing <span className="font-semibold text-brand-primary-500">{filteredMatches.length}</span> match
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
                      <div className="flex items-center gap-3">
                        <div className="h-1 w-12 bg-gradient-to-r from-brand-primary-500 to-brand-accent-500"></div>
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
                      </div>
                      <Badge variant="secondary">
                        {dateMatches.length} game
                        {dateMatches.length !== 1 ? "s" : ""}
                      </Badge>
                    </div>

                    {/* Matches for this date */}
                    {viewMode === "grid" ? (
                    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                        {dateMatches.map((match) => (
                          <MatchCardGrid key={match.id} game={match} />
                        ))}
                            </div>
                    ) : (
                            <div className="space-y-3">
                        {dateMatches.map((match) => (
                          <MatchCardList key={match.id} game={match} />
                        ))}
                            </div>
                    )}
                  </div>
                ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-brand-secondary-500 text-lg">
                No matches found for the selected filters
              </p>
              <p className="text-sm text-brand-secondary-400 mt-2">
                Try adjusting your filters or check back later
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
