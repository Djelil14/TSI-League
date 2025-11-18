# TSI League - Implementation Guide

This guide provides step-by-step instructions for extending the TSI League application.

## 🚀 Quick Start

```bash
# Development
npm run dev          # Start dev server at http://localhost:3000

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format with Prettier
```

## 📁 Adding New Pages

### 1. Create Route File

```bash
# Example: Adding a team detail page
src/app/teams/[teamId]/page.tsx
```

```tsx
import { teams } from "@/data/teams";
import { notFound } from "next/navigation";

export default function TeamDetailPage({
  params,
}: {
  params: { teamId: string };
}) {
  const team = teams.find((t) => t.id === params.teamId);

  if (!team) {
    notFound();
  }

  return (
    <div className="container-custom py-12">
      <h1>{team.city} {team.name}</h1>
      {/* Team details */}
    </div>
  );
}

// Generate static params for all teams
export async function generateStaticParams() {
  return teams.map((team) => ({
    teamId: team.id,
  }));
}
```

### 2. Add Metadata

```tsx
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { teamId: string };
}): Promise<Metadata> {
  const team = teams.find((t) => t.id === params.teamId);

  return {
    title: `${team?.city} ${team?.name} - TSI League`,
    description: `View stats, roster, and schedule for the ${team?.city} ${team?.name}`,
  };
}
```

## 🎨 Creating New Components

### UI Component Template

```tsx
// src/components/ui/ComponentName.tsx
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const componentVariants = cva(
  "base-classes-here",
  {
    variants: {
      variant: {
        default: "default-classes",
        primary: "primary-classes",
      },
      size: {
        sm: "small-classes",
        md: "medium-classes",
        lg: "large-classes",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

export interface ComponentNameProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // Additional props
}

const ComponentName = React.forwardRef<HTMLDivElement, ComponentNameProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(componentVariants({ variant, size }), className)}
        {...props}
      />
    );
  }
);
ComponentName.displayName = "ComponentName";

export { ComponentName };
```

### Feature Component Example

```tsx
// src/components/features/TeamCard.tsx
import { Team } from "@/types";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

interface TeamCardProps {
  team: Team;
}

export function TeamCard({ team }: TeamCardProps) {
  return (
    <Card className="card-hover">
      <div className="flex items-center gap-4 mb-4">
        <div
          className="h-16 w-16 rounded-full"
          style={{ backgroundColor: team.primaryColor }}
        />
        <div>
          <h3 className="font-display text-2xl">
            {team.city} {team.name}
          </h3>
          <Badge variant="secondary">{team.abbreviation}</Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className="text-center">
          <div className="stat-number text-brand-primary-500">
            {team.stats.wins}
          </div>
          <div className="text-sm text-brand-secondary-500">Wins</div>
        </div>
        {/* More stats */}
      </div>

      <Button fullWidth asChild>
        <Link href={`/teams/${team.id}`}>View Team</Link>
      </Button>
    </Card>
  );
}
```

## 📊 Working with Data

### Adding New Data

1. **Define TypeScript Type**

```tsx
// src/types/index.ts
export interface NewEntity {
  id: string;
  name: string;
  // ... other fields
}
```

2. **Create Data File**

```tsx
// src/data/newentity/index.ts
import type { NewEntity } from "@/types";

export const newEntities: NewEntity[] = [
  {
    id: "entity-1",
    name: "Example Entity",
    // ... other fields
  },
];
```

3. **Create Utility Functions**

```tsx
// src/lib/utils/data-helpers.ts
import { newEntities } from "@/data/newentity";

export function getEntityById(id: string) {
  return newEntities.find((entity) => entity.id === id);
}

export function getEntitiesByType(type: string) {
  return newEntities.filter((entity) => entity.type === type);
}
```

### Integrating with API (Future)

```tsx
// src/lib/api/client.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

export async function fetchTeams() {
  const response = await fetch(`${API_BASE_URL}/teams`);
  if (!response.ok) throw new Error("Failed to fetch teams");
  return response.json();
}

// Usage in page
export default async function TeamsPage() {
  const teams = await fetchTeams();
  // ... render teams
}
```

## 🎨 Styling Guidelines

### Using Tailwind Classes

```tsx
// ✅ Good - Semantic, reusable
<div className="container-custom py-12">
  <h1 className="gradient-text mb-6">Title</h1>
  <Card className="card-hover p-6">Content</Card>
</div>

// ❌ Avoid - Too verbose, hard to maintain
<div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
  <h1 className="bg-gradient-to-r from-brand-primary-500 via-brand-accent-500 to-brand-primary-500 bg-clip-text text-transparent mb-6">
    Title
  </h1>
</div>
```

### Creating Custom Classes

```css
/* src/app/globals.css */
@layer components {
  .custom-class-name {
    @apply flex items-center gap-4 rounded-lg p-4;
    @apply bg-white dark:bg-brand-secondary-800;
    @apply transition-all hover:shadow-lg;
  }
}
```

### Color Usage

```tsx
// Brand colors
<div className="bg-brand-primary-500 text-white">Red background</div>
<div className="bg-brand-secondary-800 text-white">Dark background</div>
<div className="bg-brand-accent-500 text-white">Gold background</div>

// Semantic colors
<Badge variant="success">Active</Badge>
<Badge variant="danger">Inactive</Badge>
<Badge variant="info">Coming Soon</Badge>
```

## 🔌 Adding Custom Hooks

```tsx
// src/lib/hooks/useTeams.ts
"use client";

import { useState, useEffect } from "react";
import { teams } from "@/data/teams";
import type { Team } from "@/types";

export function useTeams(conference?: string) {
  const [filteredTeams, setFilteredTeams] = useState<Team[]>([]);

  useEffect(() => {
    const filtered = conference
      ? teams.filter((team) => team.conference === conference)
      : teams;
    setFilteredTeams(filtered);
  }, [conference]);

  return filteredTeams;
}

// Usage
function TeamsComponent() {
  const westTeams = useTeams("West");
  // ... render teams
}
```

## 🌐 API Routes (Next.js)

```tsx
// src/app/api/teams/route.ts
import { NextResponse } from "next/server";
import { teams } from "@/data/teams";

export async function GET() {
  return NextResponse.json(teams);
}

// src/app/api/teams/[teamId]/route.ts
export async function GET(
  request: Request,
  { params }: { params: { teamId: string } }
) {
  const team = teams.find((t) => t.id === params.teamId);

  if (!team) {
    return NextResponse.json(
      { error: "Team not found" },
      { status: 404 }
    );
  }

  return NextResponse.json(team);
}
```

## 📱 Responsive Patterns

```tsx
// Mobile-first grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {/* Cards */}
</div>

// Conditional rendering
<div className="hidden md:block">Desktop only</div>
<div className="md:hidden">Mobile only</div>

// Responsive text
<h1 className="text-4xl md:text-5xl lg:text-6xl">Heading</h1>

// Responsive spacing
<div className="p-4 md:p-6 lg:p-8">Content</div>
```

## 🔍 SEO Best Practices

```tsx
// Page metadata
export const metadata: Metadata = {
  title: "Page Title - TSI League",
  description: "Page description for SEO",
  openGraph: {
    title: "Page Title",
    description: "Description for social media",
    images: ["/og-image.jpg"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Page Title",
    description: "Description for Twitter",
    images: ["/twitter-image.jpg"],
  },
};

// Structured data
export default function Page() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SportsOrganization",
    name: "Thunder Strike International",
    url: "https://tsileague.com",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* Page content */}
    </>
  );
}
```

## 🧪 Testing Patterns (Future)

```tsx
// Component test example
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders children correctly", () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText("Click me")).toBeInTheDocument();
  });

  it("applies variant classes", () => {
    render(<Button variant="primary">Primary</Button>);
    const button = screen.getByText("Primary");
    expect(button).toHaveClass("bg-brand-primary-500");
  });
});
```

## 🚨 Common Pitfalls

### 1. Client vs Server Components

```tsx
// ❌ Wrong - Using hooks in server component
export default function Page() {
  const [state, setState] = useState(); // Error!
  return <div>...</div>;
}

// ✅ Correct - Add "use client" directive
"use client";

export default function Page() {
  const [state, setState] = useState();
  return <div>...</div>;
}
```

### 2. Image Optimization

```tsx
// ❌ Wrong - Using <img> tag
<img src="/logo.png" alt="Logo" />

// ✅ Correct - Using Next.js Image
import Image from "next/image";
<Image src="/logo.png" alt="Logo" width={100} height={100} />
```

### 3. Link Navigation

```tsx
// ❌ Wrong - Using <a> tag
<a href="/teams">Teams</a>

// ✅ Correct - Using Next.js Link
import Link from "next/link";
<Link href="/teams">Teams</Link>
```

## 📚 Resources

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [React Documentation](https://react.dev/)

## 🤝 Contributing

1. Follow the TypeScript strict mode guidelines
2. Use Prettier for formatting (`npm run format`)
3. Run ESLint before committing (`npm run lint`)
4. Follow the component patterns shown in this guide
5. Maintain consistent naming conventions
6. Document complex logic with comments

---

**Need Help?** Refer to the README.md and BRAND_IDENTITY.md files for additional context.
