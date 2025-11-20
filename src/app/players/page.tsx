"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import Image from "next/image";
import type { TSIPlayer, TSITeam } from "@/lib/tsi-api";
import { getTeamLogo } from "@/lib/utils/team-utils";

export default function PlayersPage() {
  const [players, setPlayers] = useState<TSIPlayer[]>([]);
  const [teams, setTeams] = useState<TSITeam[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string>("all");
  const [selectedPosition, setSelectedPosition] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    async function fetchTeams() {
      try {
        const response = await fetch("/api/teams");
        const result = await response.json();
        const allTeams = result.data || result;
        setTeams(allTeams);
      } catch (error) {
        console.error("Error fetching teams:", error);
      }
    }
    fetchTeams();
  }, []);

  useEffect(() => {
    async function fetchPlayers() {
      setLoading(true);
      try {
        const params = new URLSearchParams({
          per_page: "100",
        });

        if (searchQuery) {
          params.append("search", searchQuery);
        }

        if (selectedTeam !== "all") {
          params.append("team_ids", selectedTeam);
        }

        const response = await fetch(`/api/players?${params.toString()}`);
        const data = await response.json();

        if (data.success && data.data) {
          setPlayers(data.data);
        } else {
          setPlayers([]);
        }
        setHasMore(data.meta?.page < data.meta?.total_pages);
      } catch (error) {
        console.error("Error fetching players:", error);
        setPlayers([]);
      } finally {
        setLoading(false);
      }
    }

    const timer = setTimeout(() => {
      fetchPlayers();
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, selectedTeam, page]);

  const filteredPlayers =
    selectedPosition === "all"
      ? players
      : players.filter((player) => player.position === selectedPosition);

  const positions = ["PG", "SG", "SF", "PF", "C"];

  // Helper function to calculate age from birth date
  const calculateAge = (birthDate?: string): number | null => {
    if (!birthDate) return null;
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-brand-secondary-900 dark:text-white">
          TSI League Players
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          Browse and search through all players competing in the Thunder Strike International League
        </p>
      </div>

      {/* Search Bar */}
      <div className="mb-8">
        <input
          type="text"
          placeholder="Search players by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-brand-secondary-300 bg-white px-4 py-3 text-brand-secondary-900 placeholder-brand-secondary-400 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white"
        />
      </div>

      {/* Filters */}
      <div className="mb-8 space-y-4">
        {/* Position Filter */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
            Position
          </label>
          <div className="flex flex-wrap gap-2">
            <Button
              size="sm"
              variant={selectedPosition === "all" ? "primary" : "outline"}
              onClick={() => setSelectedPosition("all")}
            >
              All Positions
            </Button>
            {positions.map((pos) => (
              <Button
                key={pos}
                size="sm"
                variant={selectedPosition === pos ? "primary" : "outline"}
                onClick={() => setSelectedPosition(pos)}
              >
                {pos}
              </Button>
            ))}
          </div>
        </div>

        {/* Team Filter */}
        <div>
          <label className="mb-2 block text-sm font-semibold text-brand-secondary-700 dark:text-brand-secondary-300">
            Team
          </label>
          <select
            value={selectedTeam}
            onChange={(e) => setSelectedTeam(e.target.value)}
            className="w-full rounded-lg border border-brand-secondary-300 bg-white px-4 py-2 text-brand-secondary-900 focus:border-brand-primary-500 focus:outline-none focus:ring-2 focus:ring-brand-primary-500 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white md:w-auto"
          >
            <option value="all">All Teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.full_name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Results Count */}
      {!loading && (
        <div className="mb-6">
          <p className="text-sm text-brand-secondary-500">
            Showing {filteredPlayers.length} player
            {filteredPlayers.length !== 1 ? "s" : ""}
          </p>
        </div>
      )}

      {/* Loading State */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-primary-500 border-r-transparent"></div>
            <p className="mt-4 text-brand-secondary-500">Loading players...</p>
          </div>
        </div>
      ) : (
        <>
          {/* Players Grid */}
          {filteredPlayers.length > 0 ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredPlayers.map((player) => (
                <Link key={player.id} href={`/players/${player.id}`}>
                  <Card className="card-hover group h-full p-6 transition-all hover:border-brand-primary-500">
                    {/* Player Photo */}
                    <div className="mb-4 flex justify-center">
                      <div className="relative h-32 w-32 overflow-hidden rounded-full border-2 border-brand-primary-500">
                        <Image
                          src={player.photo || `/api/players/${player.id}/avatar`}
                          alt={`${player.first_name} ${player.last_name}`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    </div>

                    {/* Player Name */}
                    <div className="mb-3 text-center">
                      <h3 className="text-lg font-bold group-hover:text-brand-primary-500 transition-colors">
                        {player.first_name} {player.last_name}
                      </h3>
                      <p className="mt-1 text-sm text-brand-secondary-500">
                        {player.team.full_name}
                      </p>
                    </div>

                    {/* Player Attributes */}
                    <div className="mb-4 space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">Position:</span>
                        <Badge variant="secondary" size="sm">
                          {player.position}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">Height:</span>
                        <span className="font-semibold">{player.height || "N/A"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">Weight:</span>
                        <span className="font-semibold">{player.weight || "N/A"}</span>
                      </div>
                      {player.birthDate && (
                        <div className="flex justify-between">
                          <span className="text-brand-secondary-500">Age:</span>
                          <span className="font-semibold">
                            {calculateAge(player.birthDate) || "N/A"} years
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">Number:</span>
                        <span className="font-semibold">#{player.jersey_number || "0"}</span>
                      </div>
                    </div>

                    {/* Performance Statistics */}
                    {player.stats && (
                      <div className="mb-4 border-t border-brand-secondary-200 pt-4 dark:border-brand-secondary-700">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          {/* Points - Basketball Icon */}
                          <div>
                            <div className="mb-1 flex justify-center">
                              <svg
                                className="h-6 w-6 text-brand-primary-500"
                                fill="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
                                <circle cx="12" cy="12" r="8" fill="none" stroke="currentColor" strokeWidth="1.5"/>
                                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                              </svg>
                            </div>
                            <div className="text-lg font-bold text-brand-primary-500">
                              {player.stats.pointsPerGame.toFixed(1)}
                            </div>
                            <div className="text-xs text-brand-secondary-500">Points</div>
                          </div>
                          {/* Assists - Hand Passing Icon */}
                          <div>
                            <div className="mb-1 flex justify-center">
                              <svg
                                className="h-6 w-6 text-brand-primary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M7 16l-4-4m0 0l4-4m-4 4h18"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M3 12h18M3 12l4-4M3 12l4 4"
                                />
                              </svg>
                            </div>
                            <div className="text-lg font-bold text-brand-primary-500">
                              {player.stats.assistsPerGame.toFixed(1)}
                            </div>
                            <div className="text-xs text-brand-secondary-500">Assists</div>
                          </div>
                          {/* Rebounds - Hand Catching Icon */}
                          <div>
                            <div className="mb-1 flex justify-center">
                              <svg
                                className="h-6 w-6 text-brand-primary-500"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={1.5}
                                  d="M21 12h-18M21 12l-4-4M21 12l-4 4"
                                />
                              </svg>
                            </div>
                            <div className="text-lg font-bold text-brand-primary-500">
                              {player.stats.reboundsPerGame.toFixed(1)}
                            </div>
                            <div className="text-xs text-brand-secondary-500">Rebounds</div>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Team Badge */}
                    <div className="border-t border-brand-secondary-200 pt-3 dark:border-brand-secondary-700">
                      <Badge variant="outline" size="sm" className="w-full justify-center">
                        {player.team.abbreviation}
                      </Badge>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <p className="text-brand-secondary-500">
                No players found matching your criteria
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
