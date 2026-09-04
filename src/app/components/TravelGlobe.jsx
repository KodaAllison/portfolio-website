"use client";

import { useEffect, useRef, useState } from "react";
import world from "world-atlas/countries-110m.json";
import { topologyFeatureCollection } from "../../lib/topology";

function secondsFromToken(value, fallback) {
  const seconds = Number.parseFloat(value);
  return Number.isFinite(seconds) ? seconds : fallback;
}

export default function TravelGlobe({ countries }) {
  const frameRef = useRef(null);
  const canvasRef = useRef(null);
  const [mapState, setMapState] = useState("loading");
  const countryNames = countries.map((country) => country.name).join(", ");

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = canvas?.parentElement;
    if (!canvas || !container) return undefined;

    let disposed = false;
    let resizeObserver;
    let motionQuery;
    let desktopQuery;
    let applyMotionPreference;

    async function initialise() {
      try {
        const d3 = await import("d3-geo");
        const geography = topologyFeatureCollection(world, "countries");
        if (disposed || !Array.isArray(geography.features)) return;

        const context = canvas.getContext("2d");
        const rootStyles = getComputedStyle(document.documentElement);
        const colours = {
          accent: rootStyles.getPropertyValue("--accent").trim(),
          accentDim: rootStyles.getPropertyValue("--accent-dim").trim(),
          border: rootStyles.getPropertyValue("--border").trim(),
          borderStrong: rootStyles.getPropertyValue("--border-strong").trim(),
          surface: rootStyles.getPropertyValue("--surface").trim(),
          sunken: rootStyles.getPropertyValue("--surface-sunken").trim(),
        };
        const spinSeconds = secondsFromToken(
          rootStyles.getPropertyValue("--spin-globe"),
          12,
        );
        const visited = new Set(countries.map((country) => country.name));
        const projection = d3.geoOrthographic().clipAngle(90).precision(0.4);
        const graticule = d3.geoGraticule10();
        let size = 0;
        let currentRotation = 28;
        let startedAt = 0;
        let lastFrame = 0;

        function resize() {
          size = Math.min(container.clientWidth, 420);
          const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);
          canvas.width = Math.round(size * pixelRatio);
          canvas.height = Math.round(size * pixelRatio);
          canvas.style.width = `${size}px`;
          canvas.style.height = `${size}px`;
          context.setTransform(pixelRatio, 0, 0, pixelRatio, 0, 0);
          projection.translate([size / 2, size / 2]).scale(size * 0.44);
        }

        function draw(rotation) {
          projection.rotate([rotation, -28]);
          const path = d3.geoPath(projection, context);
          context.clearRect(0, 0, size, size);

          context.beginPath();
          path({ type: "Sphere" });
          context.fillStyle = colours.sunken;
          context.fill();

          context.beginPath();
          path(graticule);
          context.strokeStyle = colours.border;
          context.lineWidth = 0.7;
          context.stroke();

          for (const feature of geography.features) {
            const isVisited = visited.has(feature.properties?.name);
            context.beginPath();
            path(feature);
            context.fillStyle = isVisited ? colours.accentDim : colours.surface;
            context.fill();
            context.strokeStyle = isVisited ? colours.accent : colours.borderStrong;
            context.lineWidth = isVisited ? 1.25 : 0.55;
            context.stroke();
          }

          context.beginPath();
          path({ type: "Sphere" });
          context.strokeStyle = colours.borderStrong;
          context.lineWidth = 1.5;
          context.stroke();
        }

        resize();
        motionQuery = window.matchMedia("(prefers-reduced-motion: no-preference)");
        desktopQuery = window.matchMedia("(min-width: 768px)");

        function stopAnimation() {
          if (frameRef.current) cancelAnimationFrame(frameRef.current);
          frameRef.current = null;
        }

        function animate(now) {
          if (now - lastFrame >= 1000 / 16) {
            const progress = ((now - startedAt) / (spinSeconds * 1000)) % 1;
            currentRotation = 28 + progress * 360;
            draw(currentRotation);
            lastFrame = now;
          }
          frameRef.current = requestAnimationFrame(animate);
        }

        applyMotionPreference = function applyMotionPreferenceHandler() {
          stopAnimation();
          if (motionQuery.matches && desktopQuery.matches) {
            startedAt = performance.now();
            lastFrame = 0;
            frameRef.current = requestAnimationFrame(animate);
          } else {
            currentRotation = 28;
            draw(currentRotation);
          }
        };

        if (motionQuery.matches && desktopQuery.matches) {
          startedAt = performance.now();
          frameRef.current = requestAnimationFrame(animate);
        } else {
          draw(currentRotation);
        }

        motionQuery.addEventListener("change", applyMotionPreference);
        desktopQuery.addEventListener("change", applyMotionPreference);

        resizeObserver = new ResizeObserver(() => {
          resize();
          draw(currentRotation);
        });
        resizeObserver.observe(container);
        setMapState("ready");
      } catch (error) {
        if (!disposed) setMapState("error");
      }
    }

    initialise();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      if (applyMotionPreference) {
        motionQuery?.removeEventListener("change", applyMotionPreference);
        desktopQuery?.removeEventListener("change", applyMotionPreference);
      }
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [countries]);

  return (
    <div>
      <div className="relative mx-auto aspect-square w-full max-w-[420px]">
        <svg
          viewBox="0 0 320 320"
          className={`absolute inset-0 h-full w-full ${mapState === "ready" ? "hidden" : "block"}`}
          role="img"
          aria-label="Static globe fallback; live country codes are listed below"
        >
          <circle cx="160" cy="160" r="132" fill="var(--surface-sunken)" stroke="var(--border-strong)" strokeWidth="1.5" />
          <g fill="none" stroke="var(--border)" strokeWidth="1">
            <ellipse cx="160" cy="160" rx="132" ry="44" />
            <ellipse cx="160" cy="160" rx="132" ry="88" />
            <ellipse cx="160" cy="160" rx="52" ry="132" />
            <ellipse cx="160" cy="160" rx="98" ry="132" />
          </g>
        </svg>
        <canvas
          ref={canvasRef}
          className={mapState === "ready" ? "block" : "invisible"}
          role="img"
          aria-label={`${countries.length} countries highlighted from HoliTrackr: ${countryNames}`}
        />
        {mapState === "error" ? (
          <p className="absolute inset-x-0 bottom-space-5 text-center font-mono text-mono-xs text-ink-muted">Static view · country list remains available</p>
        ) : null}
      </div>
      <p className="mt-space-3 font-mono text-mono-xs leading-relaxed text-ink-muted">
        {countries.map((country) => country.alpha3).join(" · ")}
      </p>
    </div>
  );
}
