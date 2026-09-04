"use client";

import { useEffect, useRef } from "react";

/* A timeline entry arrives once, then stays put.

   That is binary state, so it uses an IntersectionObserver rather than tying
   opacity to every scroll position. The rail is the continuous part of the
   timeline and remains a CSS scroll-driven animation in globals.css. */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    /* CSS only hides this when scripting is enabled. If the observer API is
       unavailable, reveal it immediately so content is never stranded. */
    if (typeof IntersectionObserver === "undefined") {
      el.setAttribute("data-shown", "");
      return;
    }

    let timer;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        timer = window.setTimeout(() => {
          el.setAttribute("data-shown", "");
        }, delay);
        observer.disconnect();
      },
      // Let the entry settle into place shortly before it is fully visible.
      { rootMargin: "0px 0px -12% 0px" }
    );

    observer.observe(el);

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
