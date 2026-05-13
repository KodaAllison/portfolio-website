"use client";
import Link from "next/link";
import React from "react";

const MenuOverlay = ({ links, pathname, onClose }) => {
  const isActive = (path) =>
    path === "/" ? pathname === "/" : pathname?.startsWith(path);

  return (
    <div className="md:hidden border-t border-outline-variant bg-background/95 backdrop-blur-lg">
      <ul className="flex flex-col py-4">
        {links.map((link) => {
          const active = isActive(link.path);
          return (
            <li key={link.path}>
              <Link
                href={link.path}
                onClick={onClose}
                className={[
                  "block px-margin-mobile py-3 font-mono text-sm uppercase tracking-widest border-l-2 transition-colors",
                  active
                    ? "text-terminal border-terminal bg-surface-container/40"
                    : "text-on-surface-variant border-transparent hover:text-terminal hover:border-terminal/40 hover:bg-surface-container/30",
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
    </div>
  );
};

export default MenuOverlay;
