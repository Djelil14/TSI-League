"use client";

import { useState } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import Image from "next/image";
import { getTeamLogo } from "@/lib/utils/team-utils";

export interface TeamStanding {
  id: number | string;
  full_name: string;
  abbreviation: string;
  conference: string;
  division?: string;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBehind?: number;
  streak: string;
  pointsFor?: number;
  pointsAgainst?: number;
  pointDifferential: number;
}

type SortField = "rank" | "wins" | "losses" | "winPercentage" | "pointDifferential";
type SortDirection = "asc" | "desc";

export function StandingsTable({ standings }: { standings: TeamStanding[] }) {
  const [sortField, setSortField] = useState<SortField>("winPercentage");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("desc");
    }
  };

  const sortedStandings = [...standings].sort((a, b) => {
    let aValue: number;
    let bValue: number;

    switch (sortField) {
      case "wins":
        aValue = a.wins;
        bValue = b.wins;
        break;
      case "losses":
        aValue = a.losses;
        bValue = b.losses;
        break;
      case "winPercentage":
        aValue = a.winPercentage;
        bValue = b.winPercentage;
        break;
      case "pointDifferential":
        aValue = a.pointDifferential;
        bValue = b.pointDifferential;
        break;
      default:
        return 0;
    }

    if (sortDirection === "asc") {
      return aValue - bValue;
    } else {
      return bValue - aValue;
    }
  });

  const SortButton = ({ field, children }: { field: SortField; children: React.ReactNode }) => {
    const isActive = sortField === field;
    return (
      <button
        onClick={() => handleSort(field)}
        className={`flex items-center gap-1 transition-colors hover:text-white ${
          isActive ? "text-white" : "text-white/70"
        }`}
      >
        {children}
        {isActive && (
          <span className="text-xs">
            {sortDirection === "asc" ? "↑" : "↓"}
          </span>
        )}
      </button>
    );
  };

  const getStreakColor = (streak: string) => {
    if (streak.startsWith("W")) {
      return "text-green-600 dark:text-green-400";
    } else if (streak.startsWith("L")) {
      return "text-red-600 dark:text-red-400";
    }
    return "text-brand-secondary-500";
  };

  return (
    <Card className="overflow-hidden border-2 border-brand-secondary-200 dark:border-brand-secondary-700">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gradient-to-r from-brand-secondary-900 to-brand-secondary-800 text-white">
            <tr>
              <th className="px-4 py-4 text-left text-sm font-semibold">
                <SortButton field="rank">#</SortButton>
              </th>
              <th className="px-4 py-4 text-left text-sm font-semibold">
                Team
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold">
                <SortButton field="wins">W</SortButton>
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold">
                <SortButton field="losses">L</SortButton>
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold">
                <SortButton field="winPercentage">Win %</SortButton>
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold">
                <SortButton field="pointDifferential">+/-</SortButton>
              </th>
              <th className="px-4 py-4 text-center text-sm font-semibold">
                Streak
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedStandings.map((team, index) => {
              const winPercentage = team.winPercentage;
              const totalGames = team.wins + team.losses;
              
              return (
                <tr
                  key={team.id}
                  className="border-b border-brand-secondary-200 transition-all hover:bg-brand-secondary-50 dark:border-brand-secondary-700 dark:hover:bg-brand-secondary-800/50"
                >
                  <td className="px-4 py-4">
                    <div className="flex items-center justify-center">
                      <div
                        className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold text-white ${
                          index < 3
                            ? "bg-gradient-to-br from-brand-accent-500 to-brand-accent-600 shadow-lg"
                            : "bg-brand-primary-500"
                        }`}
                      >
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <Link
                      href={`/teams/${team.id}`}
                      className="flex items-center gap-3 hover:text-brand-primary-500 transition-colors group"
                    >
                      <div className="relative h-12 w-12 flex-shrink-0">
                        <Image
                          src={getTeamLogo(team.full_name)}
                          alt={`${team.full_name} logo`}
                          fill
                          className="object-contain group-hover:scale-110 transition-transform"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold truncate">{team.full_name}</div>
                        <div className="text-xs text-brand-secondary-500">
                          {team.abbreviation}
                        </div>
                      </div>
                    </Link>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-green-600 dark:text-green-400">
                      {team.wins}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span className="font-bold text-red-600 dark:text-red-400">
                      {team.losses}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col items-center gap-1">
                      <span className="font-semibold text-brand-secondary-900 dark:text-white">
                        {winPercentage.toFixed(1)}%
                      </span>
                      {/* Progress Bar */}
                      <div className="w-20 h-2 bg-brand-secondary-200 dark:bg-brand-secondary-700 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-gradient-to-r from-brand-primary-500 to-brand-accent-500 transition-all duration-500"
                          style={{ width: `${winPercentage}%` }}
                        />
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <span
                      className={`font-semibold ${
                        team.pointDifferential > 0
                          ? "text-green-600 dark:text-green-400"
                          : team.pointDifferential < 0
                          ? "text-red-600 dark:text-red-400"
                          : "text-brand-secondary-500"
                      }`}
                    >
                      {team.pointDifferential > 0
                        ? `+${team.pointDifferential}`
                        : team.pointDifferential}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Badge
                      variant={
                        team.streak.startsWith("W")
                          ? "success"
                          : team.streak.startsWith("L")
                          ? "danger"
                          : "secondary"
                      }
                      className="font-semibold"
                    >
                      {team.streak}
                    </Badge>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {standings.length === 0 && (
        <div className="p-12 text-center">
          <p className="text-brand-secondary-500">No standings data available</p>
        </div>
      )}
    </Card>
  );
}
