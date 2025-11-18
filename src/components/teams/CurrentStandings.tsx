import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";
import { getStandings } from "@/data/standings";
import { StandingsTable } from "./StandingsTable";

export default async function CurrentStandings() {
  const allStandings = await getStandings("all");
  const eastStandings = allStandings.filter(team => team.conference === "East").slice(0, 8);
  const westStandings = allStandings.filter(team => team.conference === "West").slice(0, 8);

  return (
    <section className="container-custom py-20">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-brand-secondary-900 dark:text-white">
          Current Standings
        </h2>
        <Button variant="ghost" asChild>
          <Link href="/standings">Full Standings →</Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h3 className="text-lg font-semibold mb-4">East Conference</h3>
          <StandingsTable standings={eastStandings} />
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-4">West Conference</h3>
          <StandingsTable standings={westStandings} />
        </div>
      </div>
    </section>
  );
}
