import Link from "next/link";
import Image from "next/image";

const footerLinks = {
  league: {
    title: "League",
    links: [
      { name: "About TSI", href: "/about" },
      { name: "Teams", href: "/teams" },
      { name: "Schedule", href: "/matches" },
      { name: "Standings", href: "/standings" },
    ],
  },
  players: {
    title: "Players",
    links: [
      { name: "All Players", href: "/players" },
      { name: "Top Scorers", href: "/players/stats?sort=points" },
      { name: "Leaders", href: "/players/leaders" },
      { name: "Rookies", href: "/players/rookies" },
    ],
  },
  media: {
    title: "Media",
    links: [
      { name: "News", href: "/news" },
      { name: "Highlights", href: "/highlights" },
      { name: "Photos", href: "/photos" },
      { name: "Press", href: "/press" },
    ],
  },
  support: {
    title: "Support",
    links: [
      { name: "Contact", href: "/contact" },
      { name: "FAQ", href: "/faq" },
      { name: "Privacy", href: "/privacy" },
      { name: "Terms", href: "/terms" },
    ],
  },
};

export default function Footer() {
  return (
    <footer className="border-t border-brand-secondary-200 bg-brand-secondary-50 dark:border-brand-secondary-800 dark:bg-brand-secondary-950">
      <div className="container-custom py-12">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link href="/" className="flex items-center space-x-3">
              <div className="flex-shrink-0">
                <Image
                  src="/images/logos/site/tsi-logo.png"
                  alt="TSI League Logo"
                  width={40}
                  height={40}
                  className="h-10 w-10 object-contain"
                />
              </div>
              <div>
                <div className="font-display text-xl font-bold tracking-wide text-brand-secondary-900 dark:text-white">
                  TSI LEAGUE
                </div>
                <div className="text-[10px] font-medium text-brand-secondary-500">
                  Thunder Strike International
                </div>
              </div>
            </Link>
            <p className="mt-4 text-sm text-brand-secondary-600 dark:text-brand-secondary-400">
              The premier professional basketball league bringing
              world-class competition to fans globally.
            </p>
            {/* Social Links */}
            <div className="mt-6 flex gap-4">
              {["twitter", "facebook", "instagram", "youtube"].map(
                (social) => (
                  <a
                    key={social}
                    href={`https://${social}.com/tsileague`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-brand-secondary-600 transition-colors hover:text-brand-primary-500 dark:text-brand-secondary-400"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="h-5 w-5 rounded-full bg-brand-secondary-300 dark:bg-brand-secondary-700" />
                  </a>
                )
              )}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([key, section]) => (
            <div key={key}>
              <h3 className="mb-4 font-display text-sm font-semibold uppercase tracking-wider text-brand-secondary-900 dark:text-white">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="text-sm text-brand-secondary-600 transition-colors hover:text-brand-primary-500 dark:text-brand-secondary-400"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="mt-12 border-t border-brand-secondary-200 pt-8 dark:border-brand-secondary-800">
          <p className="text-center text-sm text-brand-secondary-600 dark:text-brand-secondary-400">
            © {new Date().getFullYear()} Thunder Strike International
            League. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
