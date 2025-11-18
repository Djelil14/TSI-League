import {
  NBATeam,
  NBAPlayer,
  NBAGame,
  NBAPlayerStats,
  APIResponse,
} from "@/types/nba-api";

const BASE_URL = "https://api.balldontlie.io/v1";
const API_KEY = process.env.BALLDONTLIE_API_KEY || "";

class NBAApiService {
  private async fetch<T>(endpoint: string, params?: Record<string, string>): Promise<APIResponse<T>> {
    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: API_KEY,
      },
      next: { revalidate: 60 }, // Cache for 60 seconds
    });

    if (!response.ok) {
      throw new Error(`NBA API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Teams
  async getAllTeams(): Promise<NBATeam[]> {
    const response = await this.fetch<NBATeam[]>("/teams");
    return response.data;
  }

  async getTeamById(id: number): Promise<NBATeam> {
    const response = await this.fetch<NBATeam>(`/teams/${id}`);
    return response.data;
  }

  // Players
  async getAllPlayers(params?: {
    cursor?: string;
    per_page?: string;
    search?: string;
    team_ids?: string;
  }): Promise<APIResponse<NBAPlayer[]>> {
    return this.fetch<NBAPlayer[]>("/players", params);
  }

  async getActivePlayers(params?: {
    cursor?: string;
    per_page?: string;
  }): Promise<APIResponse<NBAPlayer[]>> {
    return this.fetch<NBAPlayer[]>("/players/active", params);
  }

  async getPlayerById(id: number): Promise<NBAPlayer> {
    const response = await this.fetch<NBAPlayer>(`/players/${id}`);
    return response.data;
  }

  // Games
  async getGames(params?: {
    cursor?: string;
    per_page?: string;
    dates?: string; // YYYY-MM-DD or range YYYY-MM-DD..YYYY-MM-DD
    seasons?: string; // e.g., "2024"
    team_ids?: string;
    postseason?: string; // "true" or "false"
    start_date?: string;
    end_date?: string;
  }): Promise<APIResponse<NBAGame[]>> {
    return this.fetch<NBAGame[]>("/games", params);
  }

  async getGameById(id: number): Promise<NBAGame> {
    const response = await this.fetch<NBAGame>(`/games/${id}`);
    return response.data;
  }

  // Stats (Note: Requires paid tier)
  async getStats(params?: {
    cursor?: string;
    per_page?: string;
    dates?: string;
    seasons?: string;
    player_ids?: string;
    game_ids?: string;
  }): Promise<APIResponse<NBAPlayerStats[]>> {
    return this.fetch<NBAPlayerStats[]>("/stats", params);
  }

  // Helper: Get games for a specific team
  async getTeamGames(teamId: number, season?: string): Promise<NBAGame[]> {
    const params: Record<string, string> = {
      team_ids: teamId.toString(),
      per_page: "100",
    };

    if (season) {
      params.seasons = season;
    }

    const response = await this.fetch<NBAGame[]>("/games", params);
    return response.data;
  }

  // Helper: Get team players
  async getTeamPlayers(teamId: number): Promise<NBAPlayer[]> {
    const params: Record<string, string> = {
      team_ids: teamId.toString(),
      per_page: "100",
    };

    const response = await this.fetch<NBAPlayer[]>("/players", params);
    return response.data;
  }

  // Helper: Search players
  async searchPlayers(query: string): Promise<NBAPlayer[]> {
    const params: Record<string, string> = {
      search: query,
      per_page: "25",
    };

    const response = await this.fetch<NBAPlayer[]>("/players", params);
    return response.data;
  }
}

export const nbaApi = new NBAApiService();
