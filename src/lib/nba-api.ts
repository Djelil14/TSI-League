import {
  NBATeam,
  NBAPlayer,
  NBAGame,
  NBAPlayerStats,
  APIResponse,
} from "@/types/nba-api";

const BASE_URL = "https://api.balldontlie.io/v1";
const API_KEY = process.env.BALLDONTLIE_API_KEY || "";

// Rate limiting configuration
const RATE_LIMIT_DELAY = 200; // 200ms between requests (5 requests per second max)
const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000; // 1 second

class NBAApiService {
  private lastRequestTime = 0;
  private requestQueue: Array<() => Promise<void>> = [];
  private isProcessingQueue = false;

  // Rate limiting: ensure minimum delay between requests
  private async rateLimit(): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < RATE_LIMIT_DELAY) {
      const delay = RATE_LIMIT_DELAY - timeSinceLastRequest;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
    
    this.lastRequestTime = Date.now();
  }

  // Retry with exponential backoff
  private async retryWithBackoff<T>(
    fn: () => Promise<T>,
    retries = MAX_RETRIES,
    delay = INITIAL_RETRY_DELAY
  ): Promise<T> {
    try {
      return await fn();
    } catch (error) {
      if (retries === 0) {
        throw error;
      }

      // Check if it's a rate limit error (429)
      const isRateLimitError =
        error instanceof Error &&
        error.message.includes("429");

      if (isRateLimitError) {
        // For rate limit errors, wait longer before retrying
        const backoffDelay = delay * 2;
        console.log(
          `Rate limit hit, waiting ${backoffDelay}ms before retry...`
        );
        await new Promise((resolve) => setTimeout(resolve, backoffDelay));
        return this.retryWithBackoff(fn, retries - 1, backoffDelay);
      }

      // For other errors, use standard exponential backoff
      await new Promise((resolve) => setTimeout(resolve, delay));
      return this.retryWithBackoff(fn, retries - 1, delay * 2);
    }
  }

  private async fetch<T>(
    endpoint: string,
    params?: Record<string, string>
  ): Promise<APIResponse<T>> {
    // Apply rate limiting
    await this.rateLimit();

    const url = new URL(`${BASE_URL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value) url.searchParams.append(key, value);
      });
    }

    return this.retryWithBackoff(async () => {
      const response = await fetch(url.toString(), {
        headers: {
          Authorization: API_KEY,
        },
        next: { revalidate: 3600 }, // Cache for 1 hour
      });

      if (!response.ok) {
        // Check for rate limit
        if (response.status === 429) {
          const retryAfter = response.headers.get("Retry-After");
          if (retryAfter) {
            const waitTime = parseInt(retryAfter) * 1000;
            console.log(`Rate limited. Waiting ${waitTime}ms...`);
            await new Promise((resolve) => setTimeout(resolve, waitTime));
          }
        }
        throw new Error(
          `NBA API Error: ${response.status} ${response.statusText}`
        );
      }

      // Read response body directly - Next.js handles cloning internally
      return await response.json();
    });
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
