# TSI League - API Documentation

Cette application utilise l'API **balldontlie** pour récupérer les données NBA réelles.

## Configuration

### 1. Obtenir une clé API

1. Visitez https://app.balldontlie.io
2. Créez un compte gratuit
3. Copiez votre clé API

### 2. Configuration de l'environnement

Ajoutez votre clé API dans le fichier `.env.local` :

```env
BALLDONTLIE_API_KEY=votre_cle_api_ici
```

## Endpoints disponibles

### Teams (Équipes)

#### GET /api/teams
Récupère toutes les équipes NBA (30 équipes).

**Exemple de réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "conference": "East",
      "division": "Southeast",
      "city": "Atlanta",
      "name": "Hawks",
      "full_name": "Atlanta Hawks",
      "abbreviation": "ATL"
    }
  ],
  "count": 30
}
```

#### GET /api/teams/[id]
Récupère les détails d'une équipe + ses joueurs + ses matchs.

**Paramètres:**
- `id` (path): ID de l'équipe

**Exemple:** `/api/teams/1`

**Exemple de réponse:**
```json
{
  "success": true,
  "data": {
    "team": { ... },
    "players": [ ... ],
    "games": [ ... ],
    "stats": {
      "totalPlayers": 15,
      "totalGames": 82
    }
  }
}
```

---

### Players (Joueurs)

#### GET /api/players
Récupère la liste des joueurs avec pagination.

**Query parameters:**
- `cursor` (optional): Pour la pagination
- `per_page` (optional): Nombre de résultats par page (max 100, défaut: 25)
- `search` (optional): Recherche par nom (ex: "LeBron")
- `team_ids` (optional): Filtrer par équipe (ex: "1,2,3")

**Exemples:**
- `/api/players?per_page=50`
- `/api/players?search=Durant`
- `/api/players?team_ids=1`

**Exemple de réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 237,
      "first_name": "LeBron",
      "last_name": "James",
      "position": "F",
      "height": "6-9",
      "weight": "250",
      "jersey_number": "23",
      "team": { ... }
    }
  ],
  "meta": {
    "next_cursor": 123,
    "per_page": 25
  }
}
```

#### GET /api/players/[id]
Récupère les détails d'un joueur spécifique.

**Paramètres:**
- `id` (path): ID du joueur

**Exemple:** `/api/players/237`

---

### Matches (Matchs)

#### GET /api/matches
Récupère la liste des matchs avec filtres.

**Query parameters:**
- `cursor` (optional): Pour la pagination
- `per_page` (optional): Nombre de résultats (défaut: 25)
- `dates` (optional): Date ou plage (ex: "2024-01-15" ou "2024-01-01..2024-01-31")
- `seasons` (optional): Saison (ex: "2024", défaut: "2024")
- `team_ids` (optional): Filtrer par équipe (ex: "1,2,3")
- `postseason` (optional): "true" ou "false"
- `start_date` (optional): Date de début (YYYY-MM-DD)
- `end_date` (optional): Date de fin (YYYY-MM-DD)

**Exemples:**
- `/api/matches?seasons=2024&per_page=50`
- `/api/matches?team_ids=1&seasons=2024`
- `/api/matches?dates=2024-01-15`
- `/api/matches?start_date=2024-01-01&end_date=2024-01-31`

**Exemple de réponse:**
```json
{
  "success": true,
  "data": [
    {
      "id": 12345,
      "date": "2024-01-15T19:00:00.000Z",
      "season": 2024,
      "status": "Final",
      "period": 4,
      "time": "",
      "postseason": false,
      "home_team": { ... },
      "home_team_score": 112,
      "visitor_team": { ... },
      "visitor_team_score": 108
    }
  ],
  "meta": {
    "next_cursor": 456,
    "per_page": 25
  }
}
```

---

### Search (Recherche globale)

#### GET /api/search
Recherche globale dans les équipes et joueurs.

**Query parameters:**
- `q` (required): Requête de recherche

**Exemples:**
- `/api/search?q=Lakers`
- `/api/search?q=LeBron`
- `/api/search?q=Boston`

**Exemple de réponse:**
```json
{
  "success": true,
  "data": {
    "teams": [
      {
        "id": 14,
        "full_name": "Los Angeles Lakers",
        "city": "Los Angeles",
        "name": "Lakers",
        "abbreviation": "LAL"
      }
    ],
    "players": [
      {
        "id": 237,
        "first_name": "LeBron",
        "last_name": "James",
        "team": { ... }
      }
    ],
    "query": "Lakers"
  },
  "stats": {
    "teamsFound": 1,
    "playersFound": 15,
    "totalResults": 16
  }
}
```

---

## Gestion des erreurs

Toutes les APIs retournent des erreurs dans le format suivant :

```json
{
  "success": false,
  "error": "Description de l'erreur",
  "message": "Message détaillé"
}
```

**Codes de statut HTTP:**
- `200`: Succès
- `400`: Requête invalide
- `404`: Ressource non trouvée
- `500`: Erreur serveur

---

## Pagination

L'API utilise un système de pagination basé sur les curseurs :

1. Faites une requête initiale
2. Utilisez `meta.next_cursor` de la réponse pour la page suivante
3. Ajoutez `cursor=<next_cursor>` à votre prochaine requête

**Exemple:**
```
/api/players?per_page=25
→ meta.next_cursor = 123

/api/players?per_page=25&cursor=123
→ meta.next_cursor = 456
```

---

## Notes importantes

1. **Clé API requise**: Toutes les requêtes nécessitent une clé API configurée dans `.env.local`

2. **Cache**: Les données sont mises en cache pendant 60 secondes

3. **Saison par défaut**: La saison 2024 est utilisée par défaut pour les matchs

4. **Limite de taux**: Respectez les limites de l'API gratuite balldontlie

5. **Stats avancées**: Les statistiques détaillées des joueurs nécessitent un abonnement payant à balldontlie

---

## Exemples d'utilisation côté client

### Fetch simple
```typescript
const response = await fetch('/api/teams');
const { success, data } = await response.json();
```

### Avec Next.js (Server Component)
```typescript
async function TeamsPage() {
  const res = await fetch('http://localhost:3000/api/teams', {
    cache: 'no-store' // ou 'force-cache' selon vos besoins
  });
  const { data: teams } = await res.json();

  return <div>{/* Render teams */}</div>;
}
```

### Avec React Query
```typescript
import { useQuery } from '@tanstack/react-query';

function useTeams() {
  return useQuery({
    queryKey: ['teams'],
    queryFn: async () => {
      const res = await fetch('/api/teams');
      const { data } = await res.json();
      return data;
    }
  });
}
```

---

## Structure du projet

```
src/
├── app/
│   └── api/
│       ├── teams/
│       │   ├── route.ts          # GET /api/teams
│       │   └── [id]/route.ts     # GET /api/teams/[id]
│       ├── players/
│       │   ├── route.ts          # GET /api/players
│       │   └── [id]/route.ts     # GET /api/players/[id]
│       ├── matches/
│       │   └── route.ts          # GET /api/matches
│       └── search/
│           └── route.ts          # GET /api/search
├── lib/
│   └── nba-api.ts                # Service API balldontlie
└── types/
    └── nba-api.ts                # Types TypeScript
```

---

## Support

Pour toute question ou problème :
1. Vérifiez que votre clé API est correctement configurée
2. Consultez la documentation officielle: https://docs.balldontlie.io
3. Vérifiez les limites de votre plan gratuit
