export interface Team {
  id: number;
  name: string;
  city: string;
  abbreviation: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  conference: "East" | "West";
  division: string;
  founded: number;
  arena: string;
  arenaCapacity: number;
  headCoach: string;
}

export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  teamId: number;
  jerseyNumber: number;
  position: "PG" | "SG" | "SF" | "PF" | "C";
  height: string; // e.g., "6'5\""
  weight: number; // in pounds
  birthDate: string;
  nationality: string;
  yearsInLeague: number;
  stats: PlayerStats;
}

export interface PlayerStats {
  gamesPlayed: number;
  minutesPerGame: number;
  pointsPerGame: number;
  reboundsPerGame: number;
  assistsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
}

export interface Match {
  id: string;
  gameweek: number;
  date: string;
  homeTeamId: number;
  awayTeamId: number;
  homeScore?: number;
  awayScore?: number;
  status: "scheduled" | "live" | "finished";
  quarter?: string;
  timeRemaining?: string;
  arena: string;
  attendance?: number;
}

export interface Standing {
  teamId: number;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBack: number;
  homeRecord: string;
  awayRecord: string;
  streak: string;
  pointsFor: number;
  pointsAgainst: number;
  lastTen: string;
}
