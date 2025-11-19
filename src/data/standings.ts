import { tsiApi } from "@/lib/tsi-api";
import { teams } from "@/data/teams/index";
import { TeamStanding } from "@/components/teams/StandingsTable";
import type { TSITeam } from "@/lib/tsi-api";

export async function getStandings(
  conference: "East" | "West" | "all" = "all"
): Promise<TeamStanding[]> {
  try {
    // Utiliser le service TSI avec données mock
    const tsiTeams = tsiApi.getAllTeams();
    const standingsData = tsiApi.getStandings(conference);
    
    // Convertir les standings en TeamStanding
    const teamStandings: TeamStanding[] = standingsData
      .map((standing): TeamStanding | null => {
        try {
          // Trouver l'équipe correspondante
          const teamData = teams.find((t) => t.id === standing.teamId);
          
          if (!teamData) {
            console.warn(`Team not found for standing ${standing.teamId}`);
            return null;
          }

          // Trouver le TSITeam correspondant
          const tsiTeam = tsiTeams.find((t) => 
            t.full_name === `${teamData.city} ${teamData.name}` ||
            t.abbreviation === teamData.abbreviation
          );

          if (!tsiTeam) {
            console.warn(`TSI Team not found for ${teamData.city} ${teamData.name}`);
            return null;
          }

          return {
            id: tsiTeam.id,
            full_name: tsiTeam.full_name,
            abbreviation: tsiTeam.abbreviation,
            conference: tsiTeam.conference,
            division: tsiTeam.division,
            wins: standing.wins,
            losses: standing.losses,
            winPercentage: standing.winPercentage, // Keep as number
            gamesBehind: standing.gamesBehind,
            streak: standing.streak,
            pointsFor: Math.round(standing.pointsPerGame * (standing.wins + standing.losses)),
            pointsAgainst: Math.round(standing.pointsAllowedPerGame * (standing.wins + standing.losses)),
            pointDifferential: Math.round((standing.pointsPerGame - standing.pointsAllowedPerGame) * (standing.wins + standing.losses)),
          };
        } catch (error) {
          console.error(`Error processing standing for team ${standing.teamId}:`, error);
          return null;
        }
      })
      .filter((standing): standing is TeamStanding => standing !== null);

    // Trier par pourcentage de victoires
    teamStandings.sort((a, b) => {
      if (b.winPercentage !== a.winPercentage) return b.winPercentage - a.winPercentage;
      return b.wins - a.wins;
    });

    // Calculer gamesBehind par conférence
    ["East", "West"].forEach((conf) => {
      const confTeams = teamStandings.filter((t) => t.conference === conf);
      if (confTeams.length > 0) {
        const leader = confTeams[0];
        confTeams.forEach((team) => {
          team.gamesBehind =
            (leader.wins - team.wins + (team.losses - leader.losses)) / 2;
        });
      }
    });

    if (conference === "all") return teamStandings;

    return teamStandings.filter((t) => t.conference === conference);
  } catch (error) {
    console.error("Error fetching standings:", error);
    return [];
  }
}
