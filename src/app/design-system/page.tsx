import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";

export default function DesignSystemPage() {
  return (
    <div className="container-custom py-12">
      <div className="mb-12">
        <h1 className="gradient-text mb-4">TSI Design System</h1>
        <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-300">
          Complete visual reference for the Thunder Strike International brand
        </p>
      </div>

      {/* Colors */}
      <section className="mb-16">
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Color Palette
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Primary Red</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="flex items-center gap-2">
                    <div
                      className={`h-10 w-20 rounded bg-brand-primary-${shade}`}
                    />
                    <span className="text-sm font-mono">
                      brand-primary-{shade}
                    </span>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Secondary Navy</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="flex items-center gap-2">
                    <div
                      className={`h-10 w-20 rounded bg-brand-secondary-${shade}`}
                    />
                    <span className="text-sm font-mono">
                      brand-secondary-{shade}
                    </span>
                  </div>
                )
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Accent Gold</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {[50, 100, 200, 300, 400, 500, 600, 700, 800, 900].map(
                (shade) => (
                  <div key={shade} className="flex items-center gap-2">
                    <div
                      className={`h-10 w-20 rounded bg-brand-accent-${shade}`}
                    />
                    <span className="text-sm font-mono">
                      brand-accent-{shade}
                    </span>
                  </div>
                )
              )}
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Typography */}
      <section className="mb-16">
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Typography
        </h2>
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <p className="mb-2 text-sm text-brand-secondary-500">
                Display Font - Bebas Neue
              </p>
              <h1 className="font-display text-6xl">THUNDER STRIKE</h1>
            </div>
            <div>
              <p className="mb-2 text-sm text-brand-secondary-500">
                H2 Heading
              </p>
              <h2>Eastern Conference</h2>
            </div>
            <div>
              <p className="mb-2 text-sm text-brand-secondary-500">
                H3 Heading
              </p>
              <h3>Featured Games</h3>
            </div>
            <div>
              <p className="mb-2 text-sm text-brand-secondary-500">
                Body Text - Inter
              </p>
              <p className="font-sans">
                Experience the ultimate professional basketball league. Follow
                live scores, player stats, team standings, and exclusive
                content from the Thunder Strike International.
              </p>
            </div>
            <div>
              <p className="mb-2 text-sm text-brand-secondary-500">
                Stat Numbers
              </p>
              <div className="stat-number text-brand-primary-500">28.4</div>
              <p className="text-sm text-brand-secondary-500">
                Points Per Game
              </p>
            </div>
          </div>
        </Card>
      </section>

      {/* Buttons */}
      <section className="mb-16">
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Buttons
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Variants</h3>
            <div className="flex flex-wrap gap-4">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="outline">Outline</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="accent">Accent</Button>
              <Button variant="success">Success</Button>
              <Button variant="danger">Danger</Button>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="mb-4 text-xl font-semibold">Sizes</h3>
            <div className="flex flex-wrap items-center gap-4">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
              <Button size="xl">Extra Large</Button>
            </div>
          </Card>
        </div>
      </section>

      {/* Badges */}
      <section className="mb-16">
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Badges
        </h2>
        <Card className="p-6">
          <div className="flex flex-wrap gap-3">
            <Badge variant="primary">Primary</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="accent">Accent</Badge>
            <Badge variant="outline">Outline</Badge>
            <Badge variant="success">Success</Badge>
            <Badge variant="warning">Warning</Badge>
            <Badge variant="danger">Danger</Badge>
            <Badge variant="info">Info</Badge>
          </div>
          <div className="mt-4 flex flex-wrap gap-3">
            <Badge size="sm">Small</Badge>
            <Badge size="md">Medium</Badge>
            <Badge size="lg">Large</Badge>
          </div>
        </Card>
      </section>

      {/* Cards */}
      <section className="mb-16">
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Cards
        </h2>
        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Default Card</CardTitle>
            </CardHeader>
            <CardContent>
              Standard card with default styling and shadow.
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader>
              <CardTitle>Elevated Card</CardTitle>
            </CardHeader>
            <CardContent>
              Card with enhanced shadow for emphasis.
            </CardContent>
          </Card>

          <Card variant="outline">
            <CardHeader>
              <CardTitle>Outline Card</CardTitle>
            </CardHeader>
            <CardContent>
              Card with prominent border styling.
            </CardContent>
          </Card>
        </div>

        <div className="mt-6">
          <Card variant="gradient" className="p-8 text-center text-white">
            <h3 className="mb-2 font-display text-3xl">Gradient Card</h3>
            <p>Special card with brand gradient background</p>
          </Card>
        </div>
      </section>

      {/* Example Components */}
      <section>
        <h2 className="mb-6 text-brand-secondary-900 dark:text-white">
          Example Components
        </h2>
        <div className="grid gap-6 md:grid-cols-2">
          {/* Match Card Example */}
          <Card className="p-6">
            <Badge variant="success" className="mb-4">
              LIVE
            </Badge>
            <div className="mb-4 flex items-center justify-between">
              <div className="text-center">
                <div className="mb-2 text-sm font-medium">Phoenix Storm</div>
                <div className="stat-number text-brand-primary-500">112</div>
              </div>
              <div className="text-brand-secondary-500">Q4 2:15</div>
              <div className="text-center">
                <div className="mb-2 text-sm font-medium">LA Thunder</div>
                <div className="stat-number text-brand-primary-500">108</div>
              </div>
            </div>
            <Button variant="outline" fullWidth>
              View Game Details
            </Button>
          </Card>

          {/* Player Card Example */}
          <Card className="p-6">
            <div className="mb-4 flex items-center gap-4">
              <div className="h-16 w-16 rounded-full bg-gradient-to-br from-brand-primary-500 to-brand-accent-500" />
              <div>
                <Badge variant="secondary" className="mb-1">
                  #23
                </Badge>
                <h3 className="text-xl font-semibold">Jordan Matthews</h3>
                <p className="text-sm text-brand-secondary-500">
                  Phoenix Storm • SG
                </p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="stat-number text-brand-primary-500">28.4</div>
                <div className="text-xs text-brand-secondary-500">PPG</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-brand-primary-500">5.2</div>
                <div className="text-xs text-brand-secondary-500">APG</div>
              </div>
              <div className="text-center">
                <div className="stat-number text-brand-primary-500">6.1</div>
                <div className="text-xs text-brand-secondary-500">RPG</div>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </div>
  );
}
