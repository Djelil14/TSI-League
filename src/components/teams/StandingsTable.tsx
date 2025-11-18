"use client";

import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import Link from "next/link";
import { NBATeam } from "@/types/nba-api";

export interface TeamStanding extends NBATeam {
  wins: number;
  losses: number;
  winPercentage: string;
  gamesBehind: number;
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
  pointDifferential: number;
}

export function StandingsTable({ standings }: { standings: TeamStanding[] }) {
  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-brand-secondary-900 text-white">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold">#</th>
              <th className="px-4 py-3 text-left text-sm font-semibold">
                Team
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                V
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                D
              </th>
              <th className="px-4 py-3 text-center text-sm font-semibold">
                +/-
              </th>
            </tr>
          </thead>
          <tbody>
            {standings.map((team, index) => (
              <tr
                key={team.id}
                className="border-b border-brand-secondary-200 transition-colors hover:bg-brand-secondary-50 dark:border-brand-secondary-700 dark:hover:bg-brand-secondary-800/50"
              >
                <td className="px-4 py-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-primary-500 text-sm font-bold text-white">
                    {index + 1}
                  </div>
                </td>
                <td className="px-4 py-4">
                  <Link
                    href={`/teams/${team.id}`}
                    className="flex items-center gap-3 hover:text-brand-primary-500 transition-colors"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-secondary-100 dark:bg-brand-secondary-700">
                      <span className="text-xs font-bold">
                        {team.abbreviation}
                      </span>
                    </div>
                    <div>
                      <div className="font-semibold">{team.full_name}</div>
                    </div>
                  </Link>
                </td>
                <td className="px-4 py-4 text-center font-semibold">
                  {team.wins}
                </td>
                <td className="px-4 py-4 text-center font-semibold">
                  {team.losses}
                </td>
                <td className="px-4 py-4 text-center font-semibold text-brand-primary-500">
                  {team.pointDifferential > 0 ? `+${team.pointDifferential}` : team.pointDifferential}
                </td>
              </tr>
            ))}
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
