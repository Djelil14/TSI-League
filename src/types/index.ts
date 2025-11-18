// =====================================
// TSI LEAGUE - TYPE DEFINITIONS
// =====================================

// Player Types
export interface Player {
  id: string;
  firstName: string;
  lastName: string;
  jerseyNumber: number;
  position: Position;
  teamId: string;
  birthDate: string;
  height: number; // in cm
  weight: number; // in kg
  nationality: string;
  photo?: string;
  stats: PlayerStats;
  contract: PlayerContract;
}

export type Position = "PG" | "SG" | "SF" | "PF" | "C";

export interface PlayerStats {
  gamesPlayed: number;
  minutesPerGame: number;
  pointsPerGame: number;
  assistsPerGame: number;
  reboundsPerGame: number;
  stealsPerGame: number;
  blocksPerGame: number;
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  turnoversPerGame: number;
}

export interface PlayerContract {
  salary: number;
  yearsRemaining: number;
  startDate: string;
  endDate: string;
}

// Team Types
export interface Team {
  id: string;
  name: string;
  city: string;
  abbreviation: string;
  logo: string;
  primaryColor: string;
  secondaryColor: string;
  conference: Conference;
  division: Division;
  stadium: Stadium;
  coach: Coach;
  stats: TeamStats;
  roster: string[]; // Player IDs
}

export type Conference = "East" | "West";
export type Division = "Atlantic" | "Central" | "Southeast" | "Northwest" | "Pacific" | "Southwest";

export interface Stadium {
  name: string;
  capacity: number;
  city: string;
  address: string;
}

export interface Coach {
  id: string;
  firstName: string;
  lastName: string;
  nationality: string;
  experienceYears: number;
  photo?: string;
}

export interface TeamStats {
  wins: number;
  losses: number;
  winPercentage: number;
  pointsPerGame: number;
  pointsAllowedPerGame: number;
  streak: string; // e.g., "W3", "L2"
  homeRecord: string; // e.g., "12-5"
  awayRecord: string; // e.g., "8-9"
  last10: string; // e.g., "6-4"
}

// Match Types
export interface Match {
  id: string;
  season: string;
  gameNumber: number;
  date: string;
  time: string;
  homeTeamId: string;
  awayTeamId: string;
  homeScore?: number;
  awayScore?: number;
  quarter?: number;
  timeRemaining?: string;
  status: MatchStatus;
  venue: string;
  attendance?: number;
  broadcast?: BroadcastInfo;
  boxScore?: BoxScore;
}

export type MatchStatus = "scheduled" | "live" | "halftime" | "finished" | "postponed" | "cancelled";

export interface BroadcastInfo {
  tv?: string;
  streaming?: string;
}

export interface BoxScore {
  homeTeam: TeamBoxScore;
  awayTeam: TeamBoxScore;
  quarters: QuarterScore[];
}

export interface TeamBoxScore {
  teamId: string;
  players: PlayerGameStats[];
  teamStats: GameTeamStats;
}

export interface PlayerGameStats {
  playerId: string;
  minutesPlayed: number;
  points: number;
  assists: number;
  rebounds: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
  fieldGoalsMade: number;
  fieldGoalsAttempted: number;
  threePointersMade: number;
  threePointersAttempted: number;
  freeThrowsMade: number;
  freeThrowsAttempted: number;
}

export interface GameTeamStats {
  fieldGoalPercentage: number;
  threePointPercentage: number;
  freeThrowPercentage: number;
  totalRebounds: number;
  assists: number;
  steals: number;
  blocks: number;
  turnovers: number;
  fouls: number;
}

export interface QuarterScore {
  quarter: number;
  homeScore: number;
  awayScore: number;
}

// Standings Types
export interface Standing {
  rank: number;
  teamId: string;
  wins: number;
  losses: number;
  winPercentage: number;
  gamesBehind: number;
  conference: Conference;
  division: Division;
  homeRecord: string;
  awayRecord: string;
  last10: string;
  streak: string;
  pointsPerGame: number;
  pointsAllowedPerGame: number;
}

// Season Types
export interface Season {
  id: string;
  year: string;
  startDate: string;
  endDate: string;
  currentWeek: number;
  totalWeeks: number;
  status: "preseason" | "regular" | "playoffs" | "finals" | "offseason";
}

// News/Article Types
export interface Article {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: string;
  publishedAt: string;
  category: ArticleCategory;
  image?: string;
  tags: string[];
  relatedTeams?: string[];
  relatedPlayers?: string[];
}

export type ArticleCategory = "news" | "analysis" | "highlights" | "injuries" | "trades" | "rumors";
