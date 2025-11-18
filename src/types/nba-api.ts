// Types pour l'API balldontlie
export interface NBATeam {
  id: number;
  conference: string;
  division: string;
  city: string;
  name: string;
  full_name: string;
  abbreviation: string;
}

export interface NBAPlayer {
  id: number;
  first_name: string;
  last_name: string;
  position: string;
  height: string;
  weight: string;
  jersey_number: string;
  college: string;
  country: string;
  draft_year: number;
  draft_round: number;
  draft_number: number;
  team: NBATeam;
}

export interface NBAGame {
  id: number;
  date: string;
  season: number;
  status: string;
  period: number;
  time: string;
  postseason: boolean;
  home_team: NBATeam;
  home_team_score: number;
  visitor_team: NBATeam;
  visitor_team_score: number;
}

export interface NBAPlayerStats {
  id: number;
  min: string;
  fgm: number;
  fga: number;
  fg_pct: number;
  fg3m: number;
  fg3a: number;
  fg3_pct: number;
  ftm: number;
  fta: number;
  ft_pct: number;
  oreb: number;
  dreb: number;
  reb: number;
  ast: number;
  stl: number;
  blk: number;
  turnover: number;
  pf: number;
  pts: number;
  player: NBAPlayer;
  game: NBAGame;
  team: NBATeam;
}

export interface APIResponse<T> {
  data: T;
  meta?: {
    next_cursor?: number;
    per_page?: number;
  };
}
