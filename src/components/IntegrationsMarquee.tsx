import React from "react";
import { Webhook } from "lucide-react";
import { INTEGRATIONS } from "@/lib/integrations";
import { FAVICONS } from "@/lib/favicons";

/*
 * IntegrationsMarquee — four counter-scrolling layers of the connectors SecureGraph
 * ships in the Integration Hub (SOC Enhancement, appendix H).
 *
 * Each entry shows a real icon where one exists:
 *   1. a downloaded vendor favicon (fetch-favicons.mjs), or
 *   2. a monochrome simple-icons brand mark, or
 *   3. a webhook glyph for the generic connectors that have no vendor logo.
 *
 * Everything is grayscale by default and lifts to full colour on hover, so the
 * mixed sources read as one consistent logo wall. The scroll is deliberately
 * slow (many minutes per loop) so each name is actually readable.
 */

function IntegrationItem({ name, path }: { name: string; path: string | null }) {
  const favicon = FAVICONS[name];

  return (
    <span className="group flex shrink-0 items-center gap-2.5 text-slate-500 transition-colors duration-200 hover:text-slate-200">
      {favicon ? (
        <img
          src={favicon}
          alt=""
          loading="lazy"
          className="h-5 w-5 shrink-0 rounded-[3px] object-contain grayscale opacity-80 transition duration-200 group-hover:grayscale-0 group-hover:opacity-100"
        />
      ) : path ? (
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 shrink-0 opacity-80 transition duration-200 group-hover:opacity-100"
          fill="currentColor"
          aria-hidden="true"
        >
          <path d={path} />
        </svg>
      ) : (
        <Webhook
          size={20}
          aria-hidden="true"
          className="h-5 w-5 shrink-0 text-slate-500 opacity-80 transition duration-200 group-hover:text-slate-200 group-hover:opacity-100"
        />
      )}
      <span className="whitespace-nowrap font-display text-base font-medium tracking-tight">
        {name}
      </span>
    </span>
  );
}

function IntegrationsRow({
  items,
  reverse = false,
  duration = "480s",
}: {
  items: typeof INTEGRATIONS;
  reverse?: boolean;
  duration?: string;
}) {
  // Duplicated track: the copy scrolls in behind the original for a seamless loop.
  const track = [...items, ...items];

  return (
    <div className="marquee-mask relative overflow-hidden">
      <div
        className="marquee-track flex w-max items-center gap-10"
        style={
          reverse
            ? { animationDirection: "reverse", animationDuration: duration }
            : { animationDuration: duration }
        }
      >
        {track.map((it, i) => (
          <IntegrationItem key={`${it.name}-${i}`} name={it.name} path={it.path} />
        ))}
      </div>
    </div>
  );
}

export default function IntegrationsMarquee() {
  // Four interleaved rows so the counter-scroll never repeats the same order
  // twice, and each row only carries ~a quarter of the catalog.
  const rows = [
    { items: INTEGRATIONS.filter((_, i) => i % 4 === 0), reverse: false, duration: "480s" },
    { items: INTEGRATIONS.filter((_, i) => i % 4 === 1), reverse: true, duration: "540s" },
    { items: INTEGRATIONS.filter((_, i) => i % 4 === 2), reverse: false, duration: "500s" },
    { items: INTEGRATIONS.filter((_, i) => i % 4 === 3), reverse: true, duration: "560s" },
  ];

  return (
    <section aria-label="SecureGraph integrations" className="relative border-y border-phantix-800/60 py-10">
      <p className="mb-7 text-center text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        200+ integrations. Connect the tools that you already run.
      </p>
      <div className="space-y-7">
        {rows.map((row, i) => (
          <IntegrationsRow
            key={i}
            items={row.items}
            reverse={row.reverse}
            duration={row.duration}
          />
        ))}
      </div>
    </section>
  );
}
