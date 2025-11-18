# 🚀 Quick Start Guide - TSI League

## ⚡ Get Started in 30 Seconds

```bash
# Start development server
npm run dev

# Open browser
http://localhost:3000
```

That's it! You're ready to go. 🏀

---

## 📖 What You Have

✅ **Complete Next.js 14 App** with TypeScript strict mode
✅ **Professional Brand Identity** (Thunder Strike International)
✅ **Design System** (Button, Card, Badge components)
✅ **Dark/Light Themes** (Dark mode by default)
✅ **Sample Data** (6 teams, 6 players, 4 matches, 6 standings)
✅ **Responsive Layout** (Mobile-first design)
✅ **Type-Safe** (Comprehensive TypeScript types)

---

## 🎨 View the Design System

Visit `/design-system` to see all components, colors, and typography in action.

```
http://localhost:3000/design-system
```

---

## 📂 Key Files

| File | What It Does |
|------|--------------|
| `src/app/page.tsx` | Homepage |
| `src/app/layout.tsx` | Root layout (theme, fonts, header, footer) |
| `src/components/ui/Button.tsx` | Button component (7 variants) |
| `src/components/ui/Card.tsx` | Card component (5 variants) |
| `src/components/ui/Badge.tsx` | Badge component (8 variants) |
| `src/types/index.ts` | All TypeScript definitions |
| `src/data/` | Sample data (teams, players, matches) |
| `tailwind.config.ts` | TSI custom theme colors |

---

## 🎨 Brand Colors

```typescript
// Use in any component
className="bg-brand-primary-500"      // Red (#EF4444)
className="bg-brand-secondary-800"    // Dark Navy (#1E293B)
className="bg-brand-accent-500"       // Gold (#F59E0B)
```

---

## 🧩 Using Components

### Button
```tsx
import { Button } from "@/components/ui/Button";

<Button variant="primary" size="lg">
  Click Me
</Button>
```

### Card
```tsx
import { Card } from "@/components/ui/Card";

<Card variant="elevated" className="p-6">
  Content here
</Card>
```

### Badge
```tsx
import { Badge } from "@/components/ui/Badge";

<Badge variant="success">LIVE</Badge>
```

---

## 📊 Accessing Data

```tsx
// Import data
import { teams } from "@/data/teams";
import { players } from "@/data/players";
import { matches } from "@/data/matches";

// Or use utility functions
import { getTeamById, getTopScorers } from "@/lib/utils/data";

const team = getTeamById("phx-storm");
const topPlayers = getTopScorers(10);
```

---

## 🎯 Next Steps

### 1. Add a New Page
```bash
# Create new route
src/app/teams/page.tsx
```

```tsx
export default function TeamsPage() {
  return (
    <div className="container-custom py-12">
      <h1>All Teams</h1>
      {/* Your content */}
    </div>
  );
}
```

### 2. Create a Component
```bash
# Create new component
src/components/features/TeamCard.tsx
```

```tsx
import { Card } from "@/components/ui/Card";
import type { Team } from "@/types";

export function TeamCard({ team }: { team: Team }) {
  return (
    <Card className="p-6">
      <h3>{team.city} {team.name}</h3>
      {/* Team details */}
    </Card>
  );
}
```

### 3. Add Sample Data
```bash
# Add to existing data file
src/data/teams/index.ts
```

---

## 📚 Documentation

| Doc | Purpose |
|-----|---------|
| `README.md` | Complete project overview |
| `BRAND_IDENTITY.md` | Visual identity guidelines |
| `IMPLEMENTATION_GUIDE.md` | How to extend the project |
| `PROJECT_SUMMARY.md` | Quick reference |
| `STRUCTURE.md` | File structure details |
| `QUICKSTART.md` | This file |

---

## 🛠️ Available Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm start        # Start production server
npm run lint     # Run ESLint
npm run format   # Format code with Prettier
```

---

## 🎨 Tailwind Custom Classes

Use these custom classes anywhere:

```tsx
// Container
<div className="container-custom">
  // Max-width container with padding
</div>

// Card hover effect
<div className="card-hover">
  // Smooth scale on hover
</div>

// Gradient text
<h1 className="gradient-text">
  // Red to gold gradient text
</h1>

// Stat number
<div className="stat-number">
  28.4
</div>
```

---

## 🌗 Theme Toggle

Theme is automatically saved and persists across sessions. Users can toggle between dark/light mode using the button in the header.

---

## 🔥 Hot Tips

1. **TypeScript Strict Mode is ON** - All code is type-safe
2. **Dark Mode is Default** - Designed for immersive viewing
3. **Mobile-First** - All layouts are responsive
4. **Utility Functions** - Use `src/lib/utils/data.ts` for data access
5. **CVA for Variants** - All components use class-variance-authority
6. **Path Aliases** - Use `@/` to import from `src/`

---

## 🚨 Common Issues

### Port Already in Use
```bash
# If port 3000 is busy, Next.js will use 3001
✓ Ready on http://localhost:3001
```

### Tailwind Classes Not Working
```bash
# Make sure you're using the configured colors
✅ className="bg-brand-primary-500"
❌ className="bg-red-500"  # Won't match custom theme
```

### TypeScript Errors
```bash
# Run type checking
npx tsc --noEmit
```

---

## 💡 Pro Tips

### Quick Component Template
```tsx
import * as React from "react";
import { cn } from "@/lib/utils";

interface MyComponentProps {
  children: React.ReactNode;
  className?: string;
}

export function MyComponent({ children, className }: MyComponentProps) {
  return (
    <div className={cn("base-classes", className)}>
      {children}
    </div>
  );
}
```

### Quick Page Template
```tsx
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Title - TSI League",
  description: "Page description",
};

export default function MyPage() {
  return (
    <div className="container-custom py-12">
      <h1>Page Title</h1>
      {/* Content */}
    </div>
  );
}
```

---

## 🎯 Challenge Yourself

Try building these features:

- [ ] Team listing page
- [ ] Player profile pages
- [ ] Live match score updates
- [ ] Standings table
- [ ] Search functionality
- [ ] Team comparison tool

---

## 🤝 Need Help?

1. Check `IMPLEMENTATION_GUIDE.md` for detailed instructions
2. Visit `/design-system` to see all available components
3. Review `BRAND_IDENTITY.md` for design guidelines
4. Look at `PROJECT_SUMMARY.md` for quick reference

---

**Ready to build?** Start the dev server and visit `http://localhost:3000`! 🚀

```bash
npm run dev
```

---

© 2025 Thunder Strike International League
