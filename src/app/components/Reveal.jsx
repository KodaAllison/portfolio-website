"use client";

import { useEffect, useRef } from "react";

/* Keep each timeline entry in sync with the viewport. Rows reveal whenever
   they enter and reset once they leave, so reversing the scroll direction
   reverses the experience instead of leaving every visited row fixed. */
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
        if (timer) {
          window.clearTimeout(timer);
          timer = undefined;
        }

        if (!entry.isIntersecting) {
          el.removeAttribute("data-shown");
          return;
        }

        timer = window.setTimeout(() => {
          el.setAttribute("data-shown", "");
          timer = undefined;
        }, delay);
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
