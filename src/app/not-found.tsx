import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-custom py-20">
      <Card className="mx-auto max-w-2xl p-12 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-brand-primary-100 dark:bg-brand-primary-950">
            <span className="text-5xl font-display font-black text-brand-primary-500">
              404
            </span>
          </div>
          <h1 className="mb-2 text-4xl font-display font-bold text-brand-secondary-900 dark:text-white">
            Page Not Found
          </h1>
          <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
            The page you are looking for does not exist or has been moved.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/teams">Browse Teams</Link>
          </Button>
        </div>
      </Card>
    </div>
  );
}
