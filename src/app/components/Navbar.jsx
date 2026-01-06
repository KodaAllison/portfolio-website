"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import NavLink from "./Navlink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import { useTheme } from "next-themes";

const navLinks = [
  {
    title: "About",
    path: "#about",
  },
  {
    title: "Projects",
    path: "#projects",
  },
  {
    title: "Contact",
    path: "#contact",
  },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme, systemTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const currentTheme = theme === "system" ? systemTheme : theme;

  return (
    <nav className="fixed mx-auto border border-slate-200 dark:border-[#33353F] top-0 left-0 right-0 z-10 bg-white/80 dark:bg-[#121212] backdrop-blur-sm transition-colors duration-300">
      <div className="flex container lg:py-4 flex-wrap items-center justify-between mx-auto px-4 py-2">
        <Link
          href={"/"}
          className="text-2xl md:text-3xl font-semibold text-slate-900 dark:text-white"
        >
          Koda Allison
        </Link>
        <div className="flex items-center gap-2">
          {mounted && (
            <button
              type="button"
              onClick={() =>
                setTheme(currentTheme === "dark" ? "light" : "dark")
              }
              className="rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-medium text-slate-800 hover:bg-slate-100 dark:border-slate-600 dark:bg-slate-900 dark:text-slate-100 dark:hover:bg-slate-800 inline-flex items-center gap-1 transition-colors duration-200"
              aria-label="Toggle theme"
            >
              <span>{currentTheme === "dark" ? "☾" : "☼"}</span>
              <span className="hidden sm:inline">
                {currentTheme === "dark" ? "Dark" : "Light"} mode
              </span>
            </button>
          )}
          <div className="mobile-menu block md:hidden">
            {!navbarOpen ? (
              <button
                onClick={() => setNavbarOpen(true)}
                className="flex items-center px-3 py-2 border rounded border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 dark:border-slate-200 dark:text-slate-200 dark:hover:text-white dark:hover:border-white"
              >
                <Bars3Icon className="h-5 w-5" />
              </button>
            ) : (
              <button
                onClick={() => setNavbarOpen(false)}
                className="flex items-center px-3 py-2 border rounded border-slate-300 text-slate-700 hover:text-slate-900 hover:border-slate-400 dark:border-slate-200 dark:text-slate-200 dark:hover:text-white dark:hover:border-white"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            )}
          </div>
        </div>
        <div className="menu hidden md:block md:w-auto" id="navbar">
          <ul className="flex p-4 md:p-0 md:flex-row md:space-x-8 mt-0">
            {navLinks.map((link, index) => (
              <li key={index}>
                <NavLink href={link.path} title={link.title} />
              </li>
            ))}
          </ul>
        </div>
      </div>
      {navbarOpen ? <MenuOverlay links={navLinks} /> : null}
    </nav>
  );
};

export default Navbar;