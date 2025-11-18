"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { NBAPlayer, NBATeam } from "@/types/nba-api";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [players, setPlayers] = useState<NBAPlayer[]>([]);
  const [teams, setTeams] = useState<NBATeam[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  useEffect(() => {
    if (query.length < 2) {
      setPlayers([]);
      setTeams([]);
      setHasSearched(false);
      return;
    }

    const timer = setTimeout(async () => {
      setLoading(true);
      setHasSearched(true);

      try {
        // Search players
        const playersResponse = await fetch(
          `/api/players?search=${encodeURIComponent(query)}&per_page=10`
        );
        const playersData = await playersResponse.json();
        setPlayers(playersData.data || playersData || []);

        // Search teams
        const teamsResponse = await fetch("/api/teams");
        const teamsResult = await teamsResponse.json();
        const teamsData = teamsResult.data || teamsResult;

        // Filter teams by name, city, or abbreviation
        const filteredTeams = teamsData.filter(
          (team: NBATeam) =>
            team.full_name.toLowerCase().includes(query.toLowerCase()) ||
            team.city.toLowerCase().includes(query.toLowerCase()) ||
            team.name.toLowerCase().includes(query.toLowerCase()) ||
            team.abbreviation.toLowerCase().includes(query.toLowerCase())
        );

        setTeams(filteredTeams);
      } catch (error) {
        console.error("Error searching:", error);
      } finally {
        setLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const totalResults = players.length + teams.length;

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-brand-secondary-900 dark:text-white">
          Search
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          Find teams and players across the TSI League
        </p>
      </div>

      {/* Search Input */}
      <div className="mb-12">
        <div className="relative mx-auto max-w-2xl">
          <input
            type="text"
            placeholder="Search for teams or players..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border-2 border-brand-secondary-300 bg-white px-6 py-4 text-lg text-brand-secondary-900 placeholder-brand-secondary-400 focus:border-brand-primary-500 focus:outline-none focus:ring-4 focus:ring-brand-primary-500/20 dark:border-brand-secondary-600 dark:bg-brand-secondary-800 dark:text-white"
            autoFocus
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {loading ? (
              <div className="h-6 w-6 animate-spin rounded-full border-2 border-solid border-brand-primary-500 border-r-transparent"></div>
            ) : (
              <svg
                className="h-6 w-6 text-brand-secondary-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            )}
          </div>
        </div>
      </div>

      {/* Empty State */}
      {!hasSearched && (
        <Card className="p-12 text-center">
          <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-secondary-100 dark:bg-brand-secondary-700">
            <svg
              className="h-10 w-10 text-brand-secondary-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
          <h3 className="mb-2 text-xl font-bold text-brand-secondary-900 dark:text-white">
            Start Searching
          </h3>
          <p className="text-brand-secondary-500">
            Enter a team name, city, player name, or abbreviation to search
          </p>
        </Card>
      )}

      {/* Loading State */}
      {loading && hasSearched && (
        <div className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-brand-primary-500 border-r-transparent"></div>
            <p className="mt-4 text-brand-secondary-500">Searching...</p>
          </div>
        </div>
      )}

      {/* Results */}
      {!loading && hasSearched && (
        <>
          {/* Results Count */}
          <div className="mb-6">
            <p className="text-sm text-brand-secondary-500">
              Found {totalResults} result{totalResults !== 1 ? "s" : ""} for &quot;
              {query}&quot;
            </p>
          </div>

          {totalResults > 0 ? (
            <div className="space-y-12">
              {/* Teams Section */}
              {teams.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
                      Teams
                    </h2>
                    <Badge variant="secondary">{teams.length}</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {teams.map((team) => (
                      <Link key={team.id} href={`/teams/${team.id}`}>
                        <Card className="card-hover group p-6 transition-all hover:border-brand-primary-500">
                          <div className="mb-4 flex h-20 items-center justify-center rounded-lg bg-gradient-to-br from-brand-secondary-100 to-brand-secondary-200 dark:from-brand-secondary-700 dark:to-brand-secondary-800">
                            <div className="text-3xl font-display font-black text-brand-primary-500">
                              {team.abbreviation}
                            </div>
                          </div>
                          <h3 className="mb-1 text-lg font-bold group-hover:text-brand-primary-500 transition-colors">
                            {team.full_name}
                          </h3>
                          <p className="mb-2 text-sm text-brand-secondary-500">
                            {team.city}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge
                              variant={
                                team.conference === "East" ? "info" : "warning"
                              }
                              size="sm"
                            >
                              {team.conference}
                            </Badge>
                            <Badge variant="secondary" size="sm">
                              {team.division}
                            </Badge>
                          </div>
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Players Section */}
              {players.length > 0 && (
                <div>
                  <div className="mb-6 flex items-center gap-3">
                    <h2 className="text-3xl font-display font-bold text-brand-secondary-900 dark:text-white">
                      Players
                    </h2>
                    <Badge variant="secondary">{players.length}</Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {players.map((player) => (
                      <Link key={player.id} href={`/players/${player.id}`}>
                        <Card className="card-hover group p-6 transition-all hover:border-brand-primary-500">
                          <div className="mb-4 flex items-start justify-between">
                            <div>
                              <h3 className="text-lg font-bold group-hover:text-brand-primary-500 transition-colors">
                                {player.first_name} {player.last_name}
                              </h3>
                              <p className="text-sm text-brand-secondary-500">
                                {player.team.full_name}
                              </p>
                            </div>
                            <Badge variant="primary">
                              #{player.jersey_number || "0"}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-brand-secondary-500">
                                Position:
                              </span>
                              <Badge variant="secondary" size="sm">
                                {player.position}
                              </Badge>
                            </div>
                            {player.height && (
                              <div className="flex justify-between">
                                <span className="text-brand-secondary-500">
                                  Height:
                                </span>
                                <span className="font-semibold">
                                  {player.height}
                                </span>
                              </div>
                            )}
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
                        </Card>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-brand-secondary-100 dark:bg-brand-secondary-700">
                <svg
                  className="h-10 w-10 text-brand-secondary-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M12 12h.01M12 12h.01M12 12h.01M12 12h.01"
                  />
                </svg>
              </div>
              <h3 className="mb-2 text-xl font-bold text-brand-secondary-900 dark:text-white">
                No Results Found
              </h3>
              <p className="text-brand-secondary-500">
                We couldn&apos;t find any teams or players matching &quot;{query}
                &quot;. Try a different search term.
              </p>
            </Card>
          )}
        </>
      )}
    </div>
  );
}
