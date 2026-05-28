"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import about from "../../data/about.json";
import React, { useState, useEffect } from "react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";

const NAV_LINKS = [
  { title: "about", path: "/" },
  { title: "projects", path: "/projects" },
  { title: "run", path: "/run" },
  { title: "contact", path: "/contact" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [navbarOpen, setNavbarOpen] = useState(false);

  // close the overlay whenever the route changes
  useEffect(() => {
    setNavbarOpen(false);
  }, [pathname]);

  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-outline-variant bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-12 max-w-container-max items-center justify-between px-margin-mobile md:px-margin-desktop">
        {/* left — system label */}
        <Link
          href="/"
          className="flex items-center gap-2 font-mono text-label-md font-bold text-terminal hover:text-terminal-dim transition-colors"
        >
          <span className="text-signal">~/</span>
          <span>{about.domain}</span>
        </Link>

        {/* center — desktop nav */}
        <ul className="hidden md:flex items-center gap-1 font-mono text-label-sm uppercase tracking-widest">
          {NAV_LINKS.map((link) => {
            const active = isActive(link.path);
            return (
              <li key={link.path}>
                <Link
                  href={link.path}
                  className={[
                    "px-3 py-1.5 transition-colors",
                    active
                      ? "text-terminal"
                      : "text-on-surface-variant hover:text-terminal",
                  ].join(" ")}
                >
                  {active ? (
                    <>
                      <span className="text-outline">[</span>
                      <span className="px-1">{link.title}</span>
                      <span className="text-outline">]</span>
                    </>
                  ) : (
                    <>/{link.title}</>
                  )}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* right — status + mobile menu trigger */}
        <div className="flex items-center gap-3">
          <span className="hidden md:inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-on-surface-variant">
            <span className="h-2 w-2 rounded-full bg-terminal animate-pulse" aria-hidden />
            online
          </span>
          <div className="md:hidden">
            {!navbarOpen ? (
              <button
                onClick={() => setNavbarOpen(true)}
                aria-label="open menu"
                className="flex items-center justify-center h-9 w-9 border border-outline-variant text-on-surface-variant hover:text-terminal hover:border-terminal transition-colors"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setNavbarOpen(false)}
                aria-label="close menu"
                className="flex items-center justify-center h-9 w-9 border border-outline-variant text-terminal hover:border-terminal transition-colors"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {navbarOpen ? (
        <MenuOverlay links={NAV_LINKS} pathname={pathname} onClose={() => setNavbarOpen(false)} />
      ) : null}
    </nav>
  );
};

export default Navbar;
