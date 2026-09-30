import { ArrowRight, BadgeCheck, Inbox, ShieldCheck } from "lucide-react";
import TestPentestTerminal, { FREE_SCAN_INPUT_ID } from "@/components/TestPentestTerminal";

const POINTS = [
  { icon: <ShieldCheck size={16} />, title: "Non-intrusive", body: "External exposure only: no exploitation, no credentials, no writes." },
  { icon: <BadgeCheck size={16} />, title: "Ownership verified", body: "A work email at the same domain proves it is yours before anything runs." },
  { icon: <Inbox size={16} />, title: "Findings in your inbox", body: "Verified results, not a raw scanner dump. One review per domain." },
];

const STEPS = ["Enter your domain", "Add a work email at it", "Confirm, then check your inbox"];

/**
 * Free test pentest — the one hands-on offer on the page, staged to be noticed:
 * a slowly travelling gold rim, a live eyebrow, and the terminal as the hero of
 * the panel. Everything that moves stops under prefers-reduced-motion.
 */
export default function FreeScanSection() {
  const startTyping = () => {
    const input = document.getElementById(FREE_SCAN_INPUT_ID) as HTMLInputElement | null;
    input?.scrollIntoView({ behavior: "smooth", block: "center" });
    input?.focus({ preventScroll: true });
  };

  return (
    <section id="free-scan" aria-labelledby="free-scan-title" className="relative px-6 py-20 md:py-28">
      {/* Spotlight behind the panel */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-0 mx-auto h-[520px] max-w-5xl -translate-y-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(232,181,77,0.16),transparent_65%)] blur-2xl"
      />

      <div className="freescan-rim relative mx-auto max-w-6xl rounded-3xl p-px">
        <div className="relative overflow-hidden rounded-[calc(1.5rem-1px)] bg-phantix-950/95 px-6 py-10 sm:px-10 md:py-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-40 [mask-image:radial-gradient(ellipse_70%_70%_at_30%_40%,black,transparent)]"
          />

          <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-[0.95fr_1.05fr] lg:gap-12">
            {/* Pitch */}
            <div>
              <p className="inline-flex items-center gap-2 rounded-full border border-gold-400/40 bg-gold-400/10 px-3 py-1 text-[12px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <span className="relative flex h-2 w-2" aria-hidden="true">
                  <span className="freescan-ping absolute inline-flex h-full w-full rounded-full bg-gold-400 opacity-70" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
                </span>
                Free · no card, no call
              </p>

              <h2 id="free-scan-title" className="mt-5 font-display text-3xl font-semibold leading-[1.1] tracking-tight text-white sm:text-4xl lg:text-[2.75rem]">
                Pentest a domain you own, for{" "}
                <span className="bg-gradient-to-r from-gold-300 to-gold-500 bg-clip-text text-transparent">free</span>
              </h2>
              <p className="mt-4 max-w-md text-[15px] leading-7 text-slate-300">
                See what an attacker sees from the outside, in minutes. Type your domain into the terminal. We then
                review its external exposure, safely, and only after you prove that it is yours.
              </p>

              <ul className="mt-7 space-y-4">
                {POINTS.map((p) => (
                  <li key={p.title} className="flex gap-3">
                    <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gold-400/30 bg-gold-400/10 text-gold-300">
                      {p.icon}
                    </span>
                    <span>
                      <span className="block text-sm font-semibold text-slate-100">{p.title}</span>
                      <span className="block text-[13px] leading-5 text-slate-400">{p.body}</span>
                    </span>
                  </li>
                ))}
              </ul>

              <button type="button" onClick={startTyping} className="btn-primary mt-8 !px-5 !py-3 text-sm">
                Start my free scan <ArrowRight size={16} />
              </button>
            </div>

            {/* Terminal */}
            <div>
              <ol className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-[12px] text-slate-400">
                {STEPS.map((s, i) => (
                  <li key={s} className="flex items-center gap-2">
                    <span className="flex h-5 w-5 items-center justify-center rounded-full border border-gold-400/40 text-[11px] font-semibold text-gold-300">
                      {i + 1}
                    </span>
                    {s}
                    {i < STEPS.length - 1 && <span className="text-slate-600" aria-hidden="true">→</span>}
                  </li>
                ))}
              </ol>
              <TestPentestTerminal className="!mt-0" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
