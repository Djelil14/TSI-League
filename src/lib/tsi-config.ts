/**
 * TSI League Configuration
 * Defines which NBA teams are part of the TSI League
 */

export const TSI_LEAGUE_CONFIG = {
  // 12 équipes NBA sélectionnées pour la TSI League
  selectedTeamIds: [
    1,  // Atlanta Hawks
    2,  // Boston Celtics
    5,  // Chicago Bulls
    9,  // Dallas Mavericks
    10, // Denver Nuggets
    13, // LA Clippers
    14, // LA Lakers
    17, // Miami Heat
    20, // New York Knicks
    23, // Philadelphia 76ers
    25, // Portland Trail Blazers
    28, // Golden State Warriors
  ],

  // Nombre de joueurs par équipe
  playersPerTeam: 10,

  // Configuration de la ligue
  league: {
    name: "Thunder Strike International",
    abbreviation: "TSI",
    season: "2024",
    totalTeams: 12,
    totalPlayers: 120,
  },

  // Conférences (6 équipes par conférence)
  conferences: {
    east: {
      name: "Eastern Conference",
      teamIds: [1, 2, 5, 17, 20, 23], // Hawks, Celtics, Bulls, Heat, Knicks, 76ers
    },
    west: {
      name: "Western Conference",
      teamIds: [9, 10, 13, 14, 25, 28], // Mavs, Nuggets, Clippers, Lakers, Blazers, Warriors
    },
  },
};

/**
 * Check if a team ID is part of TSI League
 */
export function isTSITeam(teamId: number): boolean {
  return TSI_LEAGUE_CONFIG.selectedTeamIds.includes(teamId);
}

/**
 * Get TSI League team IDs as comma-separated string for API calls
 */
export function getTSITeamIdsString(): string {
  return TSI_LEAGUE_CONFIG.selectedTeamIds.join(',');
}

/**
 * Get conference for a team
 */
export function getTeamConference(teamId: number): 'East' | 'West' | null {
  if (TSI_LEAGUE_CONFIG.conferences.east.teamIds.includes(teamId)) {
    return 'East';
  }
  if (TSI_LEAGUE_CONFIG.conferences.west.teamIds.includes(teamId)) {
    return 'West';
  }
  return null;
}
