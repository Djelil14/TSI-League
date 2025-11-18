"use client";

import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useEffect } from "react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container-custom py-20">
      <Card className="mx-auto max-w-2xl p-12 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-950">
            <svg
              className="h-12 w-12 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
          <h1 className="mb-2 text-4xl font-display font-bold text-brand-secondary-900 dark:text-white">
            Something went wrong
          </h1>
          <p className="text-lg text-brand-secondary-600 dark:text-brand-secondary-400">
            An error occurred while loading this page. Please try again.
          </p>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <Button onClick={() => reset()}>Try Again</Button>
          <Button variant="outline" onClick={() => (window.location.href = "/")}>
            Go Home
          </Button>
        </div>
      </Card>
    </div>
  );
}
