"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/Button";

const notifications = [
  {
    id: 1,
    message: "🔥 Live match: Phoenix Storm vs Los Angeles Thunder - Watch now!",
    link: "/matches",
  },
  {
    id: 2,
    message: "📊 New player stats updated - Check out the latest rankings!",
    link: "/players/stats",
  },
  {
    id: 3,
    message: "🏆 Playoffs schedule announced - See the full calendar!",
    link: "/matches",
  },
  {
    id: 4,
    message: "⭐ Player of the Week: Jordan Matthews with 32 points!",
    link: "/players",
  },
  {
    id: 5,
    message: "🎫 Tickets now available for next week's games!",
    link: "/matches",
  },
];

export default function NotificationBanner() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % notifications.length);
        setIsAnimating(false);
      }, 300);
    }, 4000); // Change notification every 4 seconds

    return () => clearInterval(interval);
  }, [isPaused]);

  const currentNotification = notifications[currentIndex];

  return (
    <div
      className="relative overflow-hidden bg-gradient-to-r from-brand-primary-500 to-brand-primary-600 text-white shadow-md"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="container-custom">
        <div className="flex items-center justify-center py-3">
          {/* Notification content with smooth transition */}
          <div className="flex items-center gap-4 min-h-[24px] flex-1 justify-center">
            <div
              key={currentNotification.id}
              className={`flex items-center gap-3 transition-all duration-500 ${
                isAnimating ? "opacity-0 translate-y-2" : "opacity-100 translate-y-0"
              }`}
            >
              <span className="text-sm font-medium text-center">
                {currentNotification.message}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/20 h-6 px-2 text-xs shrink-0"
                asChild
              >
                <Link href={currentNotification.link}>View →</Link>
              </Button>
            </div>
          </div>

          {/* Dots indicator */}
          <div className="absolute right-4 flex gap-1.5">
            {notifications.map((_, index) => (
              <button
                key={index}
                onClick={() => {
                  setCurrentIndex(index);
                  setIsPaused(true);
                  setTimeout(() => setIsPaused(false), 2000);
                }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  index === currentIndex
                    ? "bg-white w-4"
                    : "bg-white/40 hover:bg-white/60 w-1.5"
                }`}
                aria-label={`Go to notification ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

