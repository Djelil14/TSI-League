# TSI League - Thunder Strike International Basketball

Professional basketball league website built with Next.js 14, TypeScript, and Tailwind CSS.

## 🏀 Brand Identity

**League Name:** Thunder Strike International (TSI)

**Tagline:** "Where Legends Are Made"

**Brand Concept:**
- Thunder Strike International is a premier professional basketball league
- Combines high-energy action with global appeal
- Modern, bold, and dynamic visual identity

### Color Palette

```
Primary Red (Brand):     #EF4444 (Passion, Energy, Competition)
Dark Secondary:          #1E293B (Strength, Authority, Premium)
Gold Accent:             #F59E0B (Excellence, Victory, Achievement)

Gradient Combinations:
- Primary Gradient:      #EF4444 → #DC2626
- Court Gradient:        #EF4444 → #B91C1C
- Accent Gradient:       #EF4444 → #F59E0B
```

### Typography

- **Display Font:** Bebas Neue (Headers, numbers, team names)
- **Body Font:** Inter (Content, UI, navigation)
- **Use Cases:**
  - Headlines: Bebas Neue, uppercase, letter-spacing: 0.05em
  - Stats/Numbers: Bebas Neue, bold
  - Body text: Inter, regular/medium
  - UI elements: Inter, medium

### Logo Concept

**"T" Icon Mark:**
- Bold "T" letter in white
- Background: Red-to-gold gradient (#EF4444 → #F59E0B)
- Rounded square container
- Optional glow effect: rgba(239, 68, 68, 0.5)

**Full Lockup:**
- Icon + "TSI LEAGUE" (Bebas Neue, uppercase)
- Subtitle: "Thunder Strike International" (Inter, small)

## 🏗️ Project Architecture

```
TSI/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx         # Root layout with theme provider
│   │   ├── page.tsx           # Homepage
│   │   ├── globals.css        # Global styles + Tailwind
│   │   ├── matches/           # Match routes
│   │   ├── standings/         # Standings routes
│   │   ├── teams/             # Team routes
│   │   ├── players/           # Player routes
│   │   └── news/              # News routes
│   │
│   ├── components/
│   │   ├── ui/                # Design system components
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   └── Badge.tsx
│   │   └── layout/            # Layout components
│   │       ├── Header.tsx
│   │       ├── Footer.tsx
│   │       └── ThemeToggle.tsx
│   │
│   ├── lib/
│   │   ├── utils/             # Utility functions
│   │   │   └── index.ts
│   │   ├── hooks/             # Custom React hooks
│   │   └── providers/         # Context providers
│   │       └── theme-provider.tsx
│   │
│   ├── data/                  # Mock/static data
│   │   ├── teams/
│   │   │   └── index.ts
│   │   ├── players/
│   │   │   └── index.ts
│   │   ├── matches/
│   │   │   └── index.ts
│   │   └── standings/
│   │       └── index.ts
│   │
│   └── types/                 # TypeScript type definitions
│       └── index.ts
│
├── public/                    # Static assets
│   └── logos/                 # Team logos
│
└── Configuration files
    ├── tailwind.config.ts     # Tailwind + custom theme
    ├── tsconfig.json          # TypeScript config
    ├── next.config.js         # Next.js config
    ├── .eslintrc.json         # ESLint config
    └── .prettierrc            # Prettier config
```

## 📊 Data Structure

### Core Entities

1. **Team**
   - Basic info (name, city, colors, logo)
   - Stadium details
   - Coach information
   - Season stats (wins, losses, streaks)
   - Roster (player IDs)

2. **Player**
   - Personal info (name, position, physical stats)
   - Team affiliation
   - Season stats (PPG, APG, RPG, etc.)
   - Contract details

3. **Match**
   - Teams, date, venue
   - Status (scheduled, live, finished)
   - Scores and quarter breakdown
   - Box scores with player stats

4. **Standings**
   - Conference/division rankings
   - Win/loss records
   - Statistical breakdowns

## 🎨 Design System Components

### Button
- Variants: primary, secondary, outline, ghost, accent, success, danger
- Sizes: sm, md, lg, xl, icon
- Full-width option
- Support for asChild (Radix pattern)

### Card
- Variants: default, elevated, outline, ghost, gradient
- Padding options: none, sm, md, lg
- Composable: CardHeader, CardTitle, CardDescription, CardContent, CardFooter

### Badge
- Variants: primary, secondary, accent, outline, success, warning, danger, info
- Sizes: sm, md, lg
- Used for status indicators, labels

## 🌗 Theme System

- **Light Mode:** Clean white backgrounds, dark text
- **Dark Mode:** Dark navy backgrounds (#0F172A, #1E293B), white text
- **Toggle:** Available in header
- **Persistence:** Uses next-themes with localStorage
- **System Preference:** Respects user's OS theme setting

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Format code
npm run format
```

## 📝 Development Guidelines

### TypeScript
- Strict mode enabled
- All types defined in `src/types/index.ts`
- No `any` types (ESLint warning)

### Styling
- Tailwind utility-first approach
- Custom classes in `@layer components`
- Dark mode: Use `dark:` prefix
- Responsive: Mobile-first with `md:`, `lg:` breakpoints

### Components
- Functional components with TypeScript
- Use `React.forwardRef` for DOM components
- Props extend native HTML attributes
- Use CVA (class-variance-authority) for variants

### File Naming
- Components: PascalCase (Button.tsx)
- Utilities: camelCase (index.ts)
- Types: PascalCase interfaces/types

## 🔗 Future Enhancements

- [ ] API integration (replace mock data)
- [ ] Real-time match updates (WebSocket)
- [ ] Player comparison tools
- [ ] Interactive statistics visualizations
- [ ] User authentication & favorites
- [ ] Fantasy league integration
- [ ] Mobile app (React Native)
- [ ] Video highlights integration
- [ ] Social media integration
- [ ] Ticketing system

## 📄 License

© 2025 Thunder Strike International League. All rights reserved.
