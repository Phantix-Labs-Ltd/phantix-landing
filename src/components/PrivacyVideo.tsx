import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/lib/theme";
import PrivacyDiagram from "./PrivacyDiagram";

/*
 * Privacy model artwork — the "your database" loop, per theme.
 *
 * The source loops are flat line art: white on pure #000 (dark) and black on
 * pure #FFF (light). The page canvas is neither — `--phantix-950` is 9 8 6 in
 * dark and 244 246 250 in light — so dropping the video in as a plain element
 * would read as a black (or white) rectangle pasted onto a near-black (or
 * off-white) page, with a visible seam on all four sides.
 *
 * Two ways to reconcile that. Compositing the flat background out with
 * `mix-blend-mode` (screen in dark, multiply in light) looks the most
 * integrated, but it blends against the nearest stacking context — and the
 * section wraps this in a framer-motion `transform`, which creates one. The
 * knockout would then blend against an empty context instead of the page and
 * silently render the raw box. Not something to ship on a guess.
 *
 * So the panel owns the video's exact background instead (#000 dark, #fff
 * light). The edge becomes a deliberate inset card rather than a seam — the
 * language the rest of the page already uses, and the language the SVG diagram
 * this replaces already used. It renders identically everywhere.
 *
 * The labels are DOM text, not baked pixels: crisp at any zoom, translatable,
 * themable, and readable by a screen reader — the meaning the old SVG carried in
 * `<text>` nodes is kept rather than lost to a video.
 *
 * Accessibility and weight:
 * - `prefers-reduced-motion` renders the static SVG diagram instead. It states
 *   the same thing, so reduced motion loses no information.
 * - The video is only fetched near the viewport; it sits below the fold and must
 *   not compete with the hero for bandwidth.
 * - Muted + `playsInline` are what make autoplay permissible at all under the
 *   iOS and Chrome autoplay policies.
 */

const SRC_DARK = "/scenes/privacy-your-database.mp4";
const SRC_LIGHT = "/scenes/privacy-your-database-light.mp4";
//: First-frame stills, so the panel shows the artwork immediately instead of a
//: flat fill while `preload="metadata"` decides whether to paint a frame.
const POSTER_DARK = "/scenes/privacy-your-database-poster.jpg";
const POSTER_LIGHT = "/scenes/privacy-your-database-light-poster.jpg";

export default function PrivacyVideo() {
  const { theme } = useTheme();
  const wrapRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const onChange = (e: MediaQueryListEvent) => setReduceMotion(e.matches);
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    const node = wrapRef.current;
    if (!node || visible) return;
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [visible]);

  // Switching theme swaps the source. React updating the attribute is not
  // enough on an element that is already playing — without an explicit
  // load()/play() the previous theme's frames stay on screen.
  useEffect(() => {
    const el = videoRef.current;
    if (!el || !visible || reduceMotion) return;
    el.load();
    const started = el.play();
    if (started && typeof started.catch === "function") started.catch(() => {});
  }, [theme, visible, reduceMotion]);

  if (reduceMotion || failed) {
    return <PrivacyDiagram />;
  }

  const isLight = theme === "light";
  const src = isLight ? SRC_LIGHT : SRC_DARK;

  return (
    <figure
      ref={wrapRef}
      className="relative m-0 overflow-hidden rounded-md border border-phantix-700 shadow-[0_0_0_1px_rgba(232,181,77,0.14),0_1px_2px_0_rgba(0,0,0,0.5)]"
    >
      {/* The panel matches the source's own flat background exactly, so there is
          no lighter/darker band around the artwork inside the card. */}
      <div
        className="relative aspect-video w-full"
        style={{ backgroundColor: isLight ? "#ffffff" : "#000000" }}
      >
        {visible ? (
          <video
            ref={videoRef}
            key={src}
            src={src}
            poster={isLight ? POSTER_LIGHT : POSTER_DARK}
            className="absolute inset-0 block h-full w-full object-contain"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
            tabIndex={-1}
            onError={() => {
              // A missing light capture must not leave a hole in the section:
              // fall back to the dark loop, then to the diagram.
              const el = videoRef.current;
              if (el && isLight && !el.src.endsWith(SRC_DARK)) {
                el.src = SRC_DARK;
                el.load();
                void el.play().catch(() => {});
                return;
              }
              setFailed(true);
            }}
          />
        ) : (
          <div className="absolute inset-0" aria-hidden="true" />
        )}
      </div>

      {/* Labels the video does not carry, kept as text so they stay legible and
          readable — the same two endpoints the SVG diagram names. */}
      <div className="flex items-start justify-between gap-4 border-t border-phantix-800 px-4 py-2.5">
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-slate-500">
          your database
        </span>
        <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-slate-500">
          securegraph engine
        </span>
      </div>

      <figcaption className="border-t border-phantix-800 px-5 py-3 text-center font-mono text-[12px] text-slate-600">
        Your data flows in one direction only. Nothing leaves the boundary.
      </figcaption>
    </figure>
  );
}
