import { getStandings } from "@/data/standings";
import StandingsPageClient from "./StandingsPageClient";

// Use dynamic rendering to avoid build timeouts
export const dynamic = 'force-dynamic';
export const revalidate = 300; // Revalidate every 5 minutes (ISR)

export default async function StandingsPage() {
  const standings = await getStandings("all");

  return (
    <div className="container-custom py-12">
      {/* Header */}
      <div className="mb-12 text-center">
        <h1 className="mb-4 text-4xl font-display font-bold text-brand-secondary-900 dark:text-white">
          League Standings
        </h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
          Current season standings, team records, and statistics
        </p>
      </div>

      <StandingsPageClient standings={standings} />
    </div>
  );
}
