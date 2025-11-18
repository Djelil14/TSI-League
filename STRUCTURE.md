# 📂 TSI League - Complete File Structure

## Project Tree

```
TSI/
│
├── 📄 Configuration Files
│   ├── package.json              # Dependencies & scripts
│   ├── tsconfig.json             # TypeScript configuration (strict mode)
│   ├── tailwind.config.ts        # Tailwind with custom TSI theme
│   ├── postcss.config.js         # PostCSS configuration
│   ├── next.config.js            # Next.js configuration
│   ├── .eslintrc.json            # ESLint rules
│   ├── .prettierrc               # Prettier formatting rules
│   └── .gitignore                # Git ignore patterns
│
├── 📚 Documentation
│   ├── README.md                 # Main project documentation
│   ├── BRAND_IDENTITY.md         # Complete brand guidelines
│   ├── IMPLEMENTATION_GUIDE.md   # Development guide
│   ├── PROJECT_SUMMARY.md        # Quick reference
│   └── STRUCTURE.md              # This file
│
├── 📁 src/
│   │
│   ├── 🎨 app/                   # Next.js App Router
│   │   ├── layout.tsx            # Root layout with providers
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles + Tailwind
│   │   └── design-system/        # Design system showcase
│   │       └── page.tsx          # Component library page
│   │
│   ├── 🧩 components/
│   │   ├── ui/                   # Design System Components
│   │   │   ├── Button.tsx        # Button with 7 variants
│   │   │   ├── Card.tsx          # Card with 5 variants
│   │   │   └── Badge.tsx         # Badge with 8 variants
│   │   └── layout/               # Layout Components
│   │       ├── Header.tsx        # Navigation header
│   │       ├── Footer.tsx        # Site footer
│   │       └── ThemeToggle.tsx   # Dark/light mode toggle
│   │
│   ├── 🛠️ lib/
│   │   ├── utils/
│   │   │   ├── index.ts          # Utility functions (cn, formatters)
│   │   │   └── data.ts           # Data access utilities
│   │   ├── hooks/                # Custom React hooks (empty, ready for use)
│   │   └── providers/
│   │       └── theme-provider.tsx # Theme context provider
│   │
│   ├── 📊 data/                  # Mock/Sample Data
│   │   ├── teams/
│   │   │   └── index.ts          # 6 teams with full details
│   │   ├── players/
│   │   │   └── index.ts          # 6 players with stats
│   │   ├── matches/
│   │   │   └── index.ts          # 4 matches (live, finished, scheduled)
│   │   └── standings/
│   │       └── index.ts          # 6 standings entries
│   │
│   └── 📝 types/
│       └── index.ts              # All TypeScript type definitions
│
└── 📦 node_modules/              # Dependencies (installed)
```

## File Count Summary

### Source Files
- **Total Source Files:** 18
- **TypeScript/TSX:** 17
- **CSS:** 1

### By Category
- **App Routes:** 2 (home, design-system)
- **UI Components:** 3 (Button, Card, Badge)
- **Layout Components:** 3 (Header, Footer, ThemeToggle)
- **Utilities:** 3 (utils, data helpers, theme provider)
- **Data Files:** 4 (teams, players, matches, standings)
- **Type Definitions:** 1 (comprehensive types file)

### Documentation
- **Documentation Files:** 5
- **Configuration Files:** 8

## Key Files Explained

### 🎯 Core App Files

#### `src/app/layout.tsx`
- Root layout for entire application
- Includes theme provider
- Loads custom fonts (Inter, Bebas Neue)
- SEO metadata
- Wraps all pages with Header and Footer

#### `src/app/page.tsx`
- Homepage with hero section
- Featured games preview
- League statistics
- Call-to-action buttons

#### `src/app/globals.css`
- Tailwind directives
- Custom CSS classes in @layer
- Typography styles
- Theme variables

### 🎨 Design System

#### `src/components/ui/Button.tsx`
```typescript
Variants: primary, secondary, outline, ghost, accent, success, danger
Sizes: sm, md, lg, xl, icon
Features: fullWidth, asChild
Lines: ~85
```

#### `src/components/ui/Card.tsx`
```typescript
Variants: default, elevated, outline, ghost, gradient
Padding: none, sm, md, lg
Composable: Header, Title, Description, Content, Footer
Lines: ~120
```

#### `src/components/ui/Badge.tsx`
```typescript
Variants: primary, secondary, accent, outline, success, warning, danger, info
Sizes: sm, md, lg
Lines: ~60
```

### 🏗️ Layout Components

#### `src/components/layout/Header.tsx`
- Sticky navigation
- Mobile responsive menu
- Theme toggle integration
- Active route highlighting
- Logo and navigation links
- Lines: ~150

#### `src/components/layout/Footer.tsx`
- Multi-column footer
- Link sections (League, Players, Media, Support)
- Social media placeholders
- Copyright information
- Lines: ~140

#### `src/components/layout/ThemeToggle.tsx`
- Dark/light mode switch
- System preference detection
- Persistent theme storage
- Lines: ~50

### 📊 Data Files

#### `src/data/teams/index.ts`
```typescript
Teams: 6
Fields: id, name, city, logo, colors, conference, division, stadium, coach, stats
Lines: ~150
```

#### `src/data/players/index.ts`
```typescript
Players: 6
Fields: id, name, position, team, stats, contract, physical info
Lines: ~200
```

#### `src/data/matches/index.ts`
```typescript
Matches: 4
Fields: teams, score, status, date, venue, box scores
Lines: ~120
```

#### `src/data/standings/index.ts`
```typescript
Standings: 6
Fields: rank, team, wins, losses, streaks, stats
Lines: ~80
```

### 📝 Type Definitions

#### `src/types/index.ts`
```typescript
Total Types: 20+
Main Entities: Player, Team, Match, Standing, Season, Article
Enums: Position, Conference, Division, MatchStatus, ArticleCategory
Lines: ~240
```

### 🛠️ Utilities

#### `src/lib/utils/index.ts`
```typescript
Functions:
- cn() - Class name merger with Tailwind
- formatDate() - Date formatting
- formatTime() - Time formatting
- calculateWinPercentage() - Win % calculator
Lines: ~25
```

#### `src/lib/utils/data.ts`
```typescript
Functions: 30+
Categories:
- Team utilities (getTeamById, getTeamsByConference, etc.)
- Player utilities (getPlayerById, getTopScorers, etc.)
- Match utilities (getLiveMatches, getUpcomingMatches, etc.)
- Standings utilities (getStandingsByConference, etc.)
- Search utilities (searchTeams, searchPlayers)
- Statistics utilities (getLeagueAverages, getTeamStats)
Lines: ~250
```

## Configuration Details

### `tailwind.config.ts`
```typescript
Custom Theme:
- Brand colors (primary, secondary, accent)
- Custom fonts (Inter, Bebas Neue)
- Extended shadows (glow effects)
- Gradient utilities
Dark mode: class-based
Lines: ~70
```

### `tsconfig.json`
```json
Mode: Strict
Features:
- Path aliases (@/*)
- ES2020 target
- JSX: preserve
- Module: esnext
```

### `package.json`
```json
Scripts:
- dev: Development server
- build: Production build
- start: Production server
- lint: ESLint
- format: Prettier

Dependencies: 6
Dev Dependencies: 10
```

## Lines of Code

### By File Type
```
TypeScript/TSX:  ~2,200 lines
CSS:            ~60 lines
JSON Config:    ~100 lines
Markdown Docs:  ~1,500 lines
────────────────────────────
Total:          ~3,860 lines
```

### By Category
```
Components:     ~700 lines
Data:           ~550 lines
Types:          ~240 lines
Utilities:      ~275 lines
Pages:          ~300 lines
Layouts:        ~340 lines
Documentation:  ~1,500 lines
```

## File Sizes (Approximate)

```
Largest Files:
1. src/types/index.ts                   (~7 KB)
2. src/data/players/index.ts            (~6 KB)
3. src/lib/utils/data.ts                (~6 KB)
4. src/data/teams/index.ts              (~5 KB)
5. src/components/layout/Header.tsx     (~5 KB)
6. src/components/layout/Footer.tsx     (~5 KB)
7. src/app/design-system/page.tsx       (~5 KB)
8. src/components/ui/Card.tsx           (~4 KB)
9. src/components/ui/Button.tsx         (~3 KB)
10. src/data/matches/index.ts           (~3 KB)

Total Source Code: ~45 KB
```

## Dependencies Installed

### Production Dependencies (6)
```json
{
  "next": "^16.0.3",
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "next-themes": "^0.4.6",
  "clsx": "^2.1.1",
  "tailwind-merge": "^3.4.0",
  "class-variance-authority": "latest"
}
```

### Development Dependencies (10)
```json
{
  "typescript": "^5.9.3",
  "@types/node": "^24.10.1",
  "@types/react": "^19.2.5",
  "@types/react-dom": "^19.2.3",
  "tailwindcss": "^4.1.17",
  "postcss": "^8.5.6",
  "autoprefixer": "^10.4.22",
  "eslint": "^9.39.1",
  "eslint-config-next": "^16.0.3",
  "eslint-config-prettier": "^10.1.8",
  "prettier": "^3.6.2"
}
```

## What's NOT Included (Ready to Add)

### Assets
- ❌ Team logos (SVG files)
- ❌ Player photos (JPG/PNG files)
- ❌ League logo (SVG/PNG)
- ❌ Favicon
- ❌ OG images for social sharing

### Additional Pages
- ❌ Individual team pages
- ❌ Individual player pages
- ❌ Full standings page
- ❌ Match schedule page
- ❌ News section
- ❌ About page
- ❌ Contact page

### Features
- ❌ API integration
- ❌ Database connection
- ❌ Authentication
- ❌ Search functionality
- ❌ Filters and sorting
- ❌ User profiles
- ❌ Real-time updates

## Quick Reference

### To Add a New Page
1. Create file in `src/app/[route]/page.tsx`
2. Export default component
3. Add metadata export
4. Add link in Header navigation

### To Add a New Component
1. Create file in `src/components/ui/ComponentName.tsx`
2. Use CVA for variants
3. Export with forwardRef pattern
4. Document in design-system page

### To Add New Data
1. Define type in `src/types/index.ts`
2. Create data file in `src/data/[category]/index.ts`
3. Add utility functions in `src/lib/utils/data.ts`
4. Import and use in pages

---

**Last Updated:** January 2025
**Total Project Size:** ~45 KB (source code) + ~150 MB (node_modules)
**Build Time:** ~5-10 seconds
**Dev Server Start:** ~50 seconds
