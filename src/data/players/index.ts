import type { Player } from "@/types";

// Helper function to generate realistic player stats
function generatePlayerStats(position: string, isStar: boolean = false) {
  const baseStats = {
    gamesPlayed: 40 + Math.floor(Math.random() * 10),
    minutesPerGame: 25 + Math.floor(Math.random() * 15),
    turnoversPerGame: 1.5 + Math.random() * 2,
  };

  if (position === "PG") {
    return {
      ...baseStats,
      pointsPerGame: isStar ? 20 + Math.random() * 8 : 8 + Math.random() * 10,
      assistsPerGame: isStar ? 8 + Math.random() * 4 : 3 + Math.random() * 5,
      reboundsPerGame: 3 + Math.random() * 4,
      stealsPerGame: 1 + Math.random() * 1.5,
      blocksPerGame: 0.1 + Math.random() * 0.3,
      fieldGoalPercentage: 42 + Math.random() * 8,
      threePointPercentage: 35 + Math.random() * 8,
      freeThrowPercentage: 75 + Math.random() * 15,
    };
  } else if (position === "SG") {
    return {
      ...baseStats,
      pointsPerGame: isStar ? 22 + Math.random() * 8 : 10 + Math.random() * 10,
      assistsPerGame: isStar ? 5 + Math.random() * 3 : 2 + Math.random() * 3,
      reboundsPerGame: 3 + Math.random() * 4,
      stealsPerGame: 1 + Math.random() * 1.5,
      blocksPerGame: 0.2 + Math.random() * 0.4,
      fieldGoalPercentage: 43 + Math.random() * 7,
      threePointPercentage: 36 + Math.random() * 8,
      freeThrowPercentage: 78 + Math.random() * 12,
    };
  } else if (position === "SF") {
    return {
      ...baseStats,
      pointsPerGame: isStar ? 20 + Math.random() * 8 : 9 + Math.random() * 9,
      assistsPerGame: isStar ? 4 + Math.random() * 3 : 2 + Math.random() * 2,
      reboundsPerGame: 5 + Math.random() * 5,
      stealsPerGame: 1 + Math.random() * 1.5,
      blocksPerGame: 0.3 + Math.random() * 0.7,
      fieldGoalPercentage: 44 + Math.random() * 8,
      threePointPercentage: 34 + Math.random() * 10,
      freeThrowPercentage: 76 + Math.random() * 14,
    };
  } else if (position === "PF") {
    return {
      ...baseStats,
      pointsPerGame: isStar ? 18 + Math.random() * 8 : 8 + Math.random() * 8,
      assistsPerGame: isStar ? 3 + Math.random() * 2 : 1 + Math.random() * 2,
      reboundsPerGame: 7 + Math.random() * 6,
      stealsPerGame: 0.8 + Math.random() * 1.2,
      blocksPerGame: 0.5 + Math.random() * 1.2,
      fieldGoalPercentage: 46 + Math.random() * 8,
      threePointPercentage: 32 + Math.random() * 8,
      freeThrowPercentage: 72 + Math.random() * 16,
    };
  } else { // C
    return {
      ...baseStats,
      pointsPerGame: isStar ? 16 + Math.random() * 6 : 7 + Math.random() * 7,
      assistsPerGame: isStar ? 2 + Math.random() * 2 : 0.5 + Math.random() * 1.5,
      reboundsPerGame: 9 + Math.random() * 6,
      stealsPerGame: 0.5 + Math.random() * 1,
      blocksPerGame: 1.2 + Math.random() * 1.8,
      fieldGoalPercentage: 50 + Math.random() * 10,
      threePointPercentage: 0 + Math.random() * 5,
      freeThrowPercentage: 65 + Math.random() * 20,
    };
  }
}

// Helper function to generate contract
function generateContract() {
  const yearsRemaining = 1 + Math.floor(Math.random() * 4);
  const startYear = 2021 + Math.floor(Math.random() * 3);
  return {
    salary: 5000000 + Math.floor(Math.random() * 35000000),
    yearsRemaining,
    startDate: `${startYear}-07-01`,
    endDate: `${startYear + yearsRemaining}-06-30`,
  };
}

// Helper function to generate height and weight based on position
function generatePhysicalAttributes(position: string) {
  if (position === "PG") {
    return {
      height: 180 + Math.floor(Math.random() * 10), // 180-190 cm
      weight: 75 + Math.floor(Math.random() * 10), // 75-85 kg
    };
  } else if (position === "SG") {
    return {
      height: 190 + Math.floor(Math.random() * 8), // 190-198 cm
      weight: 85 + Math.floor(Math.random() * 10), // 85-95 kg
    };
  } else if (position === "SF") {
    return {
      height: 198 + Math.floor(Math.random() * 8), // 198-206 cm
      weight: 95 + Math.floor(Math.random() * 12), // 95-107 kg
    };
  } else if (position === "PF") {
    return {
      height: 203 + Math.floor(Math.random() * 8), // 203-211 cm
      weight: 100 + Math.floor(Math.random() * 15), // 100-115 kg
    };
  } else { // C
    return {
      height: 208 + Math.floor(Math.random() * 8), // 208-216 cm
      weight: 110 + Math.floor(Math.random() * 15), // 110-125 kg
    };
  }
}

// First names and last names for generating player names
const firstNames = [
  "James", "Michael", "David", "Chris", "Anthony", "Kevin", "Stephen", "Russell",
  "LeBron", "Kawhi", "Paul", "Damian", "Devin", "Jayson", "Jaylen", "Trae",
  "Luka", "Zion", "Ja", "De'Aaron", "Donovan", "Bradley", "Kyle", "Marcus",
  "Derrick", "Blake", "Andre", "Pascal", "Fred", "OG", "Gary", "Norman",
  "Terry", "Malcolm", "Grant", "Robert", "Jrue", "Khris", "Brook", "Bobby",
  "Jordan", "DeAndre", "Tobias", "Ben", "Joel", "Seth", "Danny", "Matisse",
  "Tyler", "Bam", "Jimmy", "Duncan", "Goran", "Kendrick", "Meyers", "Udonis",
  "Jalen", "Cade", "Killian", "Saddiq", "Isaiah", "Hamidou", "Sekou", "Josh",
  "Nikola", "Jamal", "Michael", "Will", "Aaron", "Monte", "Facundo", "PJ",
  "Stephen", "Klay", "Draymond", "Andrew", "Kevon", "James", "Damion", "Juan",
  "Paul", "Kawhi", "Marcus", "Nicolas", "Serge", "Patrick", "Luke", "Amir",
  "LeBron", "Anthony", "Russell", "Talen", "Austin", "Kyle", "Wesley", "Andre",
  "Luka", "Kristaps", "Tim", "Dorian", "Maxi", "Dwight", "Jalen", "Josh",
  "Damian", "CJ", "Norman", "Robert", "Jusuf", "Anfernee", "Nassir", "Cody",
  "Pascal", "OG", "Fred", "Gary", "Scottie", "Precious", "Chris", "Thaddeus",
];

const lastNames = [
  "James", "Curry", "Durant", "Harden", "Westbrook", "Leonard", "George", "Butler",
  "Antetokounmpo", "Jokic", "Embiid", "Tatum", "Brown", "Young", "Doncic", "Morant",
  "Fox", "Mitchell", "Beal", "Lowry", "VanVleet", "Siakam", "Anunoby", "Trent",
  "Rozier", "Hayward", "Ball", "Bridges", "Washington", "Smith", "Cunningham", "Hayes",
  "Bey", "Stewart", "Diallo", "Jackson", "Holiday", "Middleton", "Lopez", "Portis",
  "Adebayo", "Herro", "Robinson", "Butler", "Dragic", "Nunn", "Leonard", "Olynyk",
  "Murray", "Porter", "Barton", "Morris", "Millsap", "Green", "Harris", "Campazzo",
  "Thompson", "Wiggins", "Looney", "Poole", "Lee", "Moody", "Kuminga", "Wiseman",
  "Jackson", "Batum", "Ibaka", "Beverley", "Mann", "Kennard", "Coffey", "Hartenstein",
  "Davis", "Westbrook", "Monk", "Reaves", "Johnson", "Nunn", "Ellington", "Howard",
  "Brunson", "Hardaway", "Finney-Smith", "Kleber", "Powell", "Bullock", "Burke", "Brown",
  "Simons", "Covington", "Nurkic", "Little", "Snell", "Elleby", "Blevins", "Watford",
  "Barnes", "Achiuwa", "Boucher", "Birch", "Flynn", "Banton", "Champagnie", "Watanabe",
];

const positions = ["PG", "SG", "SF", "PF", "C"] as const;
const nationalities = ["USA", "Canada", "France", "Spain", "Australia", "Serbia", "Greece", "Croatia", "Slovenia", "Germany"];

// Team IDs - 12 teams total
const teamIds = [
  "phx-storm", "ny-titans", "la-thunder", "chi-blaze", "mia-heat", "dal-mavericks",
  "bos-celtics", "mil-bucks", "det-pistons", "gsw-warriors", "lac-clippers", "phi-76ers",
];

// Generate players: 10 players per team
const players: Player[] = [];
let playerCounter = 1;

teamIds.forEach((teamId) => {
  // Generate 10 players per team
  for (let i = 0; i < 10; i++) {
    const isStar = i < 2; // First 2 players are stars
    const position = positions[i % positions.length];
    const physical = generatePhysicalAttributes(position);
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    
    // Ensure unique jersey numbers (1-99)
    const jerseyNumber = (i * 10) + (Math.floor(Math.random() * 9) + 1);
    
    players.push({
      id: `player-${playerCounter}`,
      firstName,
      lastName,
      jerseyNumber: jerseyNumber > 99 ? jerseyNumber % 99 : jerseyNumber,
      position,
      teamId,
      birthDate: `${1990 + Math.floor(Math.random() * 15)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, "0")}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, "0")}`,
      height: physical.height,
      weight: physical.weight,
      nationality: nationalities[Math.floor(Math.random() * nationalities.length)],
      stats: generatePlayerStats(position, isStar),
      contract: generateContract(),
    });
    
    playerCounter++;
  }
});

export { players };
