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
                      <div className="relative h-32 w-32 overflow-hidden rounded-full bg-brand-secondary-100 dark:bg-brand-secondary-800 border-2 border-brand-primary-500 flex items-center justify-center">
                        {player.photo ? (
                          <Image
                            src={player.photo}
                            alt={`${player.first_name} ${player.last_name}`}
                            fill
                            className="object-cover"
                            onError={(e) => {
                              // Fallback to placeholder if image doesn't exist
                              const target = e.target as HTMLImageElement;
                              target.src = "/images/players/placeholder.jpg";
                            }}
                            unoptimized
                          />
                        ) : (
                          <div className="text-4xl font-bold text-brand-primary-500">
                            {player.first_name[0]}{player.last_name[0]}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Player Header */}
                    <div className="mb-4 flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold group-hover:text-brand-primary-500 transition-colors">
                          {player.first_name} {player.last_name}
                        </h3>
                        <p className="text-sm text-brand-secondary-500">
                          {player.team.full_name}
                        </p>
                      </div>
                      <Badge variant="primary">#{player.jersey_number || "0"}</Badge>
                    </div>

                    {/* Player Stats */}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">
                          Position:
                        </span>
                        <Badge variant="secondary" size="sm">
                          {player.position}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">
                          Height:
                        </span>
                        <span className="font-semibold">
                          {player.height || "N/A"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-brand-secondary-500">
                          Weight:
                        </span>
                        <span className="font-semibold">
                          {player.weight || "N/A"}
                        </span>
                      </div>
                      {player.country && (
                        <div className="flex justify-between">
                          <span className="text-brand-secondary-500">
                            Country:
                          </span>
                          <span className="font-semibold">
                            {player.country}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Team Badge */}
                    <div className="mt-4 pt-4 border-t border-brand-secondary-200 dark:border-brand-secondary-700">
                      <Badge variant="outline" size="sm">
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
