"use client";
import Link from "next/link";

const MenuOverlay = ({ links, pathname, onClose }) => {
  const isActive = (path) => (path === "/" ? pathname === "/" : pathname?.startsWith(path));

  return (
    <div className="border-t border-line md:hidden">
      <ul className="flex flex-col py-space-3">
        {links.map(({ title, path, external }) => {
          const active = !external && isActive(path);
          return (
            <li key={path}>
              <Link
                href={path}
                onClick={onClose}
                aria-current={active ? "page" : undefined}
                className={`block border-l px-5 py-space-3 font-mono text-mono-m transition-colors duration-hover ${
                  active
                    ? "border-accent text-ink"
                    : "border-transparent text-ink-secondary hover:border-line-strong hover:text-accent"
                }`}
              >
                {title}
              </Link>
            </li>
          );
        })}
        <li className="px-5 py-space-3 font-mono text-mono-m text-accent">open to work</li>
      </ul>
    </div>
  );
};

export default MenuOverlay;
