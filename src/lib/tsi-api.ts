/**
 * TSI League API Service
 * Utilise les données mock locales au lieu de l'API externe NBA
 * Conforme aux exigences du projet : "Données réalistes créées entièrement"
 */

import { teams } from "@/data/teams/index";
import { players } from "@/data/players/index";
import { matches } from "@/data/matches/index";
import { standings } from "@/data/standings/index";
import type { Team, Player, Match, Standing } from "@/types";

// Types pour compatibilité avec les composants existants
export interface TSITeam {
  id: number;
  full_name: string;
  city: string;
  name: string;
  abbreviation: string;
  conference: string;
  division: string;
}

export interface TSIPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  jersey_number: string;
  height: string;
  weight: string;
  country?: string;
  photo?: string;
  birthDate?: string;
  stats?: {
    pointsPerGame: number;
    assistsPerGame: number;
    reboundsPerGame: number;
    gamesPlayed: number;
  };
  team: TSITeam;
}

export interface TSIGame {
  id: number;
  date: string;
  season: number;
  status: string;
  home_team: TSITeam;
  home_team_score: number;
  visitor_team: TSITeam;
  visitor_team_score: number;
}

class TSILeagueService {
  // Mapping des IDs string vers numériques pour compatibilité
  private teamIdMap: Map<string, number> = new Map();
  private playerIdMap: Map<string, number> = new Map();
  private gameIdMap: Map<string, number> = new Map();

  constructor() {
    // Initialiser les mappings
    teams.forEach((team, index) => {
      this.teamIdMap.set(team.id, index + 1);
    });
    players.forEach((player, index) => {
      this.playerIdMap.set(player.id, index + 1);
    });
    matches.forEach((match, index) => {
      this.gameIdMap.set(match.id, index + 1);
    });
  }

  // Convertir Team vers TSITeam
  private convertTeam(team: Team): TSITeam {
    return {
      id: this.teamIdMap.get(team.id) || 0,
      full_name: `${team.city} ${team.name}`,
      city: team.city,
      name: team.name,
      abbreviation: team.abbreviation,
      conference: team.conference,
      division: team.division,
    };
  }

  // Convertir Player vers TSIPlayer
  private convertPlayer(player: Player, team: Team): TSIPlayer {
    return {
      id: this.playerIdMap.get(player.id) || 0,
      first_name: player.firstName,
      last_name: player.lastName,
      position: player.position,
      jersey_number: player.jerseyNumber.toString(),
      height: `${player.height} cm`, // Taille en cm
      weight: `${player.weight} kg`,
      country: player.nationality,
      photo: player.photo || `/api/players/${this.playerIdMap.get(player.id) || 0}/avatar`,
      birthDate: player.birthDate,
      stats: {
        pointsPerGame: player.stats.pointsPerGame,
        assistsPerGame: player.stats.assistsPerGame,
        reboundsPerGame: player.stats.reboundsPerGame,
        gamesPlayed: player.stats.gamesPlayed,
      },
      team: this.convertTeam(team),
    };
  }

  // Convertir Match vers TSIGame
  private convertGame(match: Match): TSIGame {
    const homeTeam = teams.find((t) => t.id === match.homeTeamId);
    const awayTeam = teams.find((t) => t.id === match.awayTeamId);

    if (!homeTeam || !awayTeam) {
      throw new Error(`Team not found for match ${match.id}`);
    }

    const statusMap: Record<string, string> = {
      finished: "Final",
      live: "In Progress",
      scheduled: "Scheduled",
    };

    return {
      id: this.gameIdMap.get(match.id) || 0,
      date: `${match.date}T${match.time || "19:00"}:00`,
      season: parseInt(match.season.split("-")[0]),
      status: statusMap[match.status] || match.status,
      home_team: this.convertTeam(homeTeam),
      home_team_score: match.homeScore || 0,
      visitor_team: this.convertTeam(awayTeam),
      visitor_team_score: match.awayScore || 0,
    };
  }

  // Teams
  getAllTeams(): TSITeam[] {
    return teams.map((team) => this.convertTeam(team));
  }

  getTeamById(id: number): TSITeam {
    const teamId = Array.from(this.teamIdMap.entries()).find(
      ([_, numId]) => numId === id
    )?.[0];

    if (!teamId) {
      throw new Error(`Team with id ${id} not found`);
    }

    const team = teams.find((t) => t.id === teamId);
    if (!team) {
      throw new Error(`Team with id ${id} not found`);
    }

    return this.convertTeam(team);
  }

  // Players
  getAllPlayers(): TSIPlayer[] {
    return players.map((player) => {
      const team = teams.find((t) => t.id === player.teamId);
      if (!team) {
        throw new Error(`Team not found for player ${player.id}`);
      }
      return this.convertPlayer(player, team);
    });
  }

  getPlayerById(id: number): TSIPlayer {
    const playerId = Array.from(this.playerIdMap.entries()).find(
      ([_, numId]) => numId === id
    )?.[0];

    if (!playerId) {
      throw new Error(`Player with id ${id} not found`);
    }

    const player = players.find((p) => p.id === playerId);
    if (!player) {
      throw new Error(`Player with id ${id} not found`);
    }

    const team = teams.find((t) => t.id === player.teamId);
    if (!team) {
      throw new Error(`Team not found for player ${player.id}`);
    }

    return this.convertPlayer(player, team);
  }

  getTeamPlayers(teamId: number): TSIPlayer[] {
    const teamIdString = Array.from(this.teamIdMap.entries()).find(
      ([_, numId]) => numId === teamId
    )?.[0];

    if (!teamIdString) {
      return [];
    }

    return players
      .filter((player) => player.teamId === teamIdString)
      .map((player) => {
        const team = teams.find((t) => t.id === player.teamId);
        if (!team) {
          throw new Error(`Team not found for player ${player.id}`);
        }
        return this.convertPlayer(player, team);
      });
  }

  searchPlayers(query: string): TSIPlayer[] {
    const searchLower = query.toLowerCase();
    return this.getAllPlayers().filter(
      (player) =>
        player.first_name.toLowerCase().includes(searchLower) ||
        player.last_name.toLowerCase().includes(searchLower) ||
        `${player.first_name} ${player.last_name}`
          .toLowerCase()
          .includes(searchLower)
    );
  }

  // Games
  getAllGames(): TSIGame[] {
    return matches.map((match) => this.convertGame(match));
  }

  getGameById(id: number): TSIGame {
    const gameId = Array.from(this.gameIdMap.entries()).find(
      ([_, numId]) => numId === id
    )?.[0];

    if (!gameId) {
      throw new Error(`Game with id ${id} not found`);
    }

    const match = matches.find((m) => m.id === gameId);
    if (!match) {
      throw new Error(`Game with id ${id} not found`);
    }

    return this.convertGame(match);
  }

  getTeamGames(teamId: number, season?: string): TSIGame[] {
    const teamIdString = Array.from(this.teamIdMap.entries()).find(
      ([_, numId]) => numId === teamId
    )?.[0];

    if (!teamIdString) {
      return [];
    }

    let filteredMatches = matches.filter(
      (match) =>
        match.homeTeamId === teamIdString || match.awayTeamId === teamIdString
    );

    if (season) {
      const seasonYear = parseInt(season);
      filteredMatches = filteredMatches.filter((match) => {
        const matchSeason = parseInt(match.season.split("-")[0]);
        return matchSeason === seasonYear;
      });
    }

    return filteredMatches.map((match) => this.convertGame(match));
  }

  getUpcomingGames(days: number = 7): TSIGame[] {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate() + days);

    return matches
      .filter((match) => {
        const matchDate = new Date(`${match.date}T${match.time || "19:00"}:00`);
        return (
          matchDate >= today &&
          matchDate <= futureDate &&
          match.status === "scheduled"
        );
      })
      .map((match) => this.convertGame(match))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  getRecentGames(days: number = 7): TSIGame[] {
    const today = new Date();
    const pastDate = new Date(today);
    pastDate.setDate(today.getDate() - days);

    return matches
      .filter((match) => {
        const matchDate = new Date(`${match.date}T${match.time || "19:00"}:00`);
        return (
          matchDate >= pastDate &&
          matchDate <= today &&
          match.status === "finished"
        );
      })
      .map((match) => this.convertGame(match))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  // Standings
  getStandings(conference?: "East" | "West" | "all"): Standing[] {
    let filteredStandings = standings;

    if (conference && conference !== "all") {
      filteredStandings = standings.filter(
        (s) => s.conference === conference
      );
    }

    return filteredStandings.sort((a, b) => {
      if (a.conference !== b.conference) {
        return a.conference.localeCompare(b.conference);
      }
      return a.rank - b.rank;
    });
  }
}

export const tsiApi = new TSILeagueService();

