/**
 * Utility functions for team-related operations
 */

/**
 * Get team logo path based on team name
 * Supports both TSI League teams and NBA teams for compatibility
 */
export function getTeamLogo(teamName: string): string {
  // TSI League teams mapping - 12 teams total
  const tsiLogoMap: { [key: string]: string } = {
    // Phoenix Storm
    "Phoenix Storm": "Atlanta.png",
    "phx-storm": "Atlanta.png",
    "Phoenix": "Atlanta.png",
    "Storm": "Atlanta.png",
    
    // New York Titans
    "New York Titans": "NYK.png",
    "ny-titans": "NYK.png",
    "New York": "NYK.png",
    "Titans": "NYK.png",
    
    // Los Angeles Thunder
    "Los Angeles Thunder": "Lakers.png",
    "la-thunder": "Lakers.png",
    "Los Angeles": "Lakers.png",
    "Thunder": "Lakers.png",
    
    // Chicago Blaze
    "Chicago Blaze": "Chicago.png",
    "chi-blaze": "Chicago.png",
    "Chicago": "Chicago.png",
    "Blaze": "Chicago.png",
    
    // Miami Heat Wave
    "Miami Heat Wave": "Miami.png",
    "mia-heat": "Miami.png",
    "Miami Heat": "Miami.png",
    "Miami": "Miami.png",
    "Heat Wave": "Miami.png",
    
    // Dallas Mavericks
    "Dallas Mavericks": "Dallas.png",
    "dal-mavericks": "Dallas.png",
    "Dallas": "Dallas.png",
    "Mavericks": "Dallas.png",
    
    // Boston Celtics
    "Boston Celtics": "Boston.png",
    "bos-celtics": "Boston.png",
    "Boston": "Boston.png",
    "Celtics": "Boston.png",
    
    // Milwaukee Bucks
    "Milwaukee Bucks": "Bucks.png",
    "mil-bucks": "Bucks.png",
    "Milwaukee": "Bucks.png",
    "Bucks": "Bucks.png",
    
    // Detroit Pistons
    "Detroit Pistons": "Detroit.png",
    "det-pistons": "Detroit.png",
    "Detroit": "Detroit.png",
    "Pistons": "Detroit.png",
    
    // Golden State Warriors
    "Golden State Warriors": "Golden State.png",
    "gsw-warriors": "Golden State.png",
    "Golden State": "Golden State.png",
    "Warriors": "Golden State.png",
    
    // LA Clippers
    "LA Clippers": "LAC.png",
    "lac-clippers": "LAC.png",
    "LA": "LAC.png",
    "Clippers": "LAC.png",
    
    // Philadelphia 76ers
    "Philadelphia 76ers": "PHI.png",
    "phi-76ers": "PHI.png",
    "Philadelphia": "PHI.png",
    "76ers": "PHI.png",
  };

  // Normaliser le nom de l'équipe pour la recherche
  const normalizedName = teamName.trim();
  
  // Chercher dans le mapping TSI (correspondance exacte)
  if (tsiLogoMap[normalizedName]) {
    return `/images/logos/teams/${tsiLogoMap[normalizedName]}`;
  }
  
  // Chercher avec correspondance partielle (pour gérer les variations)
  const partialMatch = Object.keys(tsiLogoMap).find(key => 
    normalizedName.toLowerCase().includes(key.toLowerCase()) ||
    key.toLowerCase().includes(normalizedName.toLowerCase())
  );
  
  if (partialMatch) {
    return `/images/logos/teams/${tsiLogoMap[partialMatch]}`;
  }

  // NBA teams mapping (for backward compatibility)
  const nbaLogoMap: { [key: string]: string } = {
    "Atlanta Hawks": "Atlanta.png",
    "Boston Celtics": "Boston.png",
    "Brooklyn Nets": "Brooklyn.png",
    "Charlotte Hornets": "Charlotte.png",
    "Chicago Bulls": "Chicago.png",
    "Cleveland Cavaliers": "Cleveland.png",
    "Dallas Mavericks": "Dallas.png",
    "Denver Nuggets": "Denver.png",
    "Detroit Pistons": "Detroit.png",
    "Golden State Warriors": "Golden State.png",
    "Houston Rockets": "Houston.png",
    "Indiana Pacers": "Indiana.png",
    "LA Clippers": "LAC.png",
    "Los Angeles Lakers": "Lakers.png",
    "Memphis Grizzlies": "Memphis.png",
    "Miami Heat": "Miami.png",
    "Milwaukee Bucks": "Milwaukee.png",
    "Minnesota Timberwolves": "Minnesota.png",
    "New Orleans Pelicans": "New Orleans.png",
    "New York Knicks": "NYK.png",
    "Oklahoma City Thunder": "Oklahoma City.png",
    "Orlando Magic": "Orlando.png",
    "Philadelphia 76ers": "PHI.png",
    "Phoenix Suns": "Phoenix.png",
    "Portland Trail Blazers": "POR.png",
    "Sacramento Kings": "Sacramento.png",
    "San Antonio Spurs": "San Antonio.png",
    "Toronto Raptors": "Toronto.png",
    "Utah Jazz": "Utah.png",
    "Washington Wizards": "Washington.png",
  };

  // Check TSI teams first
  const tsiLogo = tsiLogoMap[teamName];
  if (tsiLogo) {
    return `/images/logos/teams/${tsiLogo}`;
  }

  // Check NBA teams
  const nbaLogo = nbaLogoMap[teamName];
  if (nbaLogo) {
    return `/images/logos/teams/${nbaLogo}`;
  }

  // Default logo
  return "/images/logos/site/tsi-logo.png";
}

