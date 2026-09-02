"use client";
import { useEffect, useRef } from "react";

/* A section arrives, its content fades and rises once, and then it is done.

   That is binary state, which is why this is an IntersectionObserver and not a
   scroll-linked animation: there is nothing continuous to map. The timeline
   rail is the opposite case and uses a CSS scroll timeline instead — see the
   note in globals.css.

   The observer disconnects on the first intersection. Content that re-hides
   when you scroll back up reads as a glitch, not as an effect. */
export default function Reveal({ children, delay = 0, as: Tag = "div", className = "" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        const t = setTimeout(() => el.setAttribute("data-shown", ""), delay);
        io.disconnect();
        return () => clearTimeout(t);
      },
      // Fire a little before the element is fully in view, so the motion reads
      // as the section settling rather than as a delayed reaction to it.
      { rootMargin: "0px 0px -12% 0px" }
    );

    io.observe(el);
    return () => io.disconnect();
  }, [delay]);

  return (
    <Tag ref={ref} className={`reveal ${className}`}>
      {children}
    </Tag>
  );
}
