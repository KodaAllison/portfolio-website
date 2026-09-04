"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import MenuOverlay from "./MenuOverlay";

const Bars3Icon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path
      fillRule="evenodd"
      d="M3 6.75A.75.75 0 013.75 6h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 6.75zM3 12a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75A.75.75 0 013 12zm0 5.25a.75.75 0 01.75-.75h16.5a.75.75 0 010 1.5H3.75a.75.75 0 01-.75-.75z"
      clipRule="evenodd"
    />
  </svg>
);

const XMarkIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
    <path
      fillRule="evenodd"
      d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
      clipRule="evenodd"
    />
  </svg>
);

// Named for where they go rather than for the route file that serves them.
const NAV_LINKS = [
  { title: "work", path: "/projects" },
  { title: "running", path: "/run" },
  { title: "contact", path: "/contact" },
  { title: "cv", path: "/CV.pdf", external: true },
];

export default function Navbar() {
  const pathname = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);

  // Close the overlay whenever the route changes. Adjusted during render rather
  // than in an effect: React re-runs this component before committing, so the
  // stale-open overlay never paints and we avoid a cascading render pass.
  const [openedOnPath, setOpenedOnPath] = useState(pathname);
  if (openedOnPath !== pathname) {
    setOpenedOnPath(pathname);
    setNavbarOpen(false);
  }

  const isActive = (path) => (path === "/" ? pathname === "/" : pathname?.startsWith(path));

  return (
    /* In normal flow, not fixed. The artboard's hero sits directly beneath a
       bordered nav band and is measured from it; a fixed bar would float over
       the top of the trace and force the hero to pad itself back out of the
       way. No backdrop blur and no terminal chrome — the nav should be present
       instantly and then get out of the way. */
    <nav className="border-b border-line">
      <div className="flex items-center justify-between px-5 py-space-5 md:px-[72px]">
        <Link href="/" className="font-mono text-mono-m text-ink">
          koda allison
        </Link>

        <ul className="hidden items-center gap-space-6 font-mono text-mono-s text-ink-secondary md:flex">
          {NAV_LINKS.map(({ title, path, external }) => {
            const active = !external && isActive(path);
            return (
              <li key={path}>
                <Link
                  href={path}
                  // aria-current is the accessible half of the styling below:
                  // without it the active route is signalled by colour alone.
                  aria-current={active ? "page" : undefined}
                  className={`transition-colors duration-hover hover:text-accent ${
                    active ? "text-ink" : ""
                  }`}
                >
                  {title}
                </Link>
              </li>
            );
          })}
        </ul>

        <div className="md:hidden">
          <button
            onClick={() => setNavbarOpen((v) => !v)}
            aria-label={navbarOpen ? "close menu" : "open menu"}
            aria-expanded={navbarOpen}
            aria-controls="mobile-navigation"
            className="flex h-11 w-11 items-center justify-center border border-line text-ink-secondary transition-colors duration-hover hover:border-line-strong hover:text-accent"
          >
            {navbarOpen ? <XMarkIcon className="h-5 w-5" /> : <Bars3Icon className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {navbarOpen ? (
        <MenuOverlay links={NAV_LINKS} pathname={pathname} onClose={() => setNavbarOpen(false)} />
      ) : null}
    </nav>
  );
}
