import React, { useEffect, useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, CalendarClock } from "lucide-react";
import { PLATFORM_REGISTER_URL } from "@/lib/links";
import { DemoRequestModal } from "@/components/DemoRequestModal";
import { GlowBloom } from "@/components/effects";
import GoldVideoPlayer from "@/components/GoldVideoPlayer";

/*
 * Hero — clean centred copy over the product explainer video.
 *
 * The right column is the product explainer, played from YouTube but on this
 * page: a click-to-play facade (thumbnail + play button) that swaps in the
 * privacy-enhanced embed only when the visitor asks for it. No YouTube script,
 * cookie or network call until then, and nothing navigates away.
 *
 * The three claims below the CTA rotate as a compact value-prop list. They used
 * to annotate the exact spot on the dashboard screenshot; with the explainer
 * video in that column they no longer need a target.
 */

const HEADLINE = {
  lead: "Find real weaknesses.",
  highlight_1:"Fix what matters.",
  highlight_2: "Keep testing.",
};

/** The product explainer, played inline from YouTube. */
const YOUTUBE_ID = "JCK33LJDjHY";
/** YouTube's own thumbnail, used as the player's poster until play. */
const YOUTUBE_THUMB = `https://i.ytimg.com/vi/${YOUTUBE_ID}/maxresdefault.jpg`;

/**
 * The rotating claims. Order matches the united-front spine:
 * Assess → Verify → Fix → Continuous → Trust.
 */
const CLAIMS = [
  {
    value: "Assess",
    label: "VAPT campaigns",
    detail: "Scoped vulnerability assessment and penetration testing with an approval gate. It is not a one-time PDF from a vendor.",
  },
  {
    value: "Verified only",
    label: "findings that ship",
    detail: "Only verified findings become open findings. Heuristic results do not get here.",
  },
  {
    value: "Fix guidance",
    label: "tracked until fixed",
    detail: "Each finding comes with fix guidance. It stays tracked until it is fixed. A regression goes back to the queue.",
  },
  {
    value: "Continuous",
    label: "keep testing",
    detail: "Growth keeps assessments and pull request reviews on a schedule. Security work continues all year, not once a year.",
  },
  {
    value: "Your data",
    label: "your database",
    detail: "Your security evidence stays in a database that you control. It is not in a shared data lake.",
  },
  {
    value: "Dual control",
    label: "sensitive actions",
    detail: "A protected action stays locked until an initiator and an authorizer both approve it.",
  },
];

const ROTATE_MS = 3000;

/** The product explainer: gold player, controls below the video. */
function HeroVideo() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="relative w-full"
    >
      {/* Bloom sits in the negative space around the frame, never on it. */}
      <GlowBloom className="-inset-x-20 -top-12 bottom-0 h-[70%]" tone="gold" />
      <GoldVideoPlayer
        videoId={YOUTUBE_ID}
        poster={YOUTUBE_THUMB}
        title="SecureGraph product explainer"
      />
    </motion.div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [demoOpen, setDemoOpen] = useState(false);

  // Auto-advance is motion the user didn't ask for: it stops under reduced
  // motion, and pauses whenever someone is actually interacting.
  useEffect(() => {
    if (paused || reduce) return;
    const t = window.setInterval(() => setActive((i) => (i + 1) % CLAIMS.length), ROTATE_MS);
    return () => window.clearInterval(t);
  }, [paused, reduce]);

  return (
    <section className="relative overflow-hidden px-6 pb-20 pt-28 md:pt-32">
      {/*
       * De-centred hero (Hallmark fix): a left-biased copy column against a
       * wider right-biased product column, instead of every element stacked
       * on one centred vertical axis. Height follows content — no forced
       * 100svh — and the section naturally collapses to a single column
       * below lg, copy first.
       */}
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:items-center lg:gap-10">
        <div>
          {/* First-time visitors land here: name the product and the company
              that makes it, so the phantixlabs.com address reads as the
              parent brand rather than a mismatch. */}
          <div className="mb-6 inline-flex items-center gap-2.5 rounded-full border border-phantix-700 bg-phantix-900/60 px-3.5 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-400" aria-hidden />
            <span className="font-display text-[13px] font-bold tracking-tight text-white">SecureGraph</span>
            <span className="text-[12px] font-medium text-slate-500">by</span>
            <span className="font-display text-[13px] font-bold tracking-tight text-gold-300">Phantix Labs</span>
          </div>
          <h1 className="max-w-xl font-display text-4xl font-semibold leading-[1.1] tracking-tight sm:text-5xl lg:text-[3.1rem]">
            <span className="hero-heading block">{HEADLINE.lead}</span>
            <span className="hero-accent block">{HEADLINE.highlight_1}</span>
            <span className="hero-accent block">{HEADLINE.highlight_2}</span>
          </h1>

          <p className="mt-6 max-w-md text-sm text-slate-400 md:text-base">
            SecureGraph does vulnerability assessment and penetration testing for lean teams.
            It keeps the tests on a schedule and helps you fix what matters and show the result.
            The findings you work from are verified. Your security data stays in a database you control.
          </p>

          {/* One primary path: self-serve. The demo is an accelerator for teams
              that want a guided walkthrough, never a gate in front of signup —
              so it opens in place instead of sending the visitor elsewhere. */}
          <div className="mt-7 flex flex-wrap items-center gap-4">
            <a href={PLATFORM_REGISTER_URL} className="btn-primary btn-shine !px-6 !py-3 !text-base">
              Get started free <ArrowRight size={16} />
            </a>
            <button
              type="button"
              onClick={() => setDemoOpen(true)}
              className="btn-secondary !px-6 !py-3 !text-base"
            >
              <CalendarClock size={16} /> Book a demo
            </button>
          </div>
          <p className="mt-3 text-xs text-slate-500">
            Free plan · No credit card required · Set up in minutes
          </p>

          {/* A compact pill row (not a stacked wall of boxes) rotating the
              claims, with one caption line carrying the detail for whichever
              claim is active. */}
          <div
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            <div role="tablist" aria-label="What SecureGraph enforces" className="mt-6 flex flex-wrap gap-1.5">
              {CLAIMS.map((c, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={c.value}
                    role="tab"
                    aria-selected={isActive}
                    onClick={() => setActive(i)}
                    onFocus={() => {
                      setActive(i);
                      setPaused(true);
                    }}
                    onBlur={() => setPaused(false)}
                    className={`rounded-full border px-3.5 py-1.5 font-display text-xs font-semibold transition-colors duration-200 ${
                      isActive
                        ? "border-gold-400/45 bg-gold-400/[0.1] text-white"
                        : "border-phantix-700 bg-phantix-900/60 text-slate-400 hover:border-phantix-600 hover:text-slate-200"
                    }`}
                  >
                    {c.value}
                  </button>
                );
              })}
            </div>

            {/* Progress bar doubles as the "which tab am I on" affordance. */}
            <span className="mt-3 block h-px w-full max-w-xs overflow-hidden rounded-full bg-phantix-700">
              <motion.span
                key={`${CLAIMS[active].value}-${paused}`}
                className="block h-full bg-gold-400"
                initial={{ width: reduce || paused ? "100%" : "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: reduce || paused ? 0 : ROTATE_MS / 1000, ease: "linear" }}
              />
            </span>

            <p className="mt-2.5 max-w-sm text-xs leading-5 text-slate-500">
              <span className="text-slate-300">{CLAIMS[active].label}</span>{": "}{CLAIMS[active].detail}
            </p>
          </div>
        </div>

        {/* Product explainer — the wider, right-biased column. */}
        <HeroVideo />
      </div>

      <DemoRequestModal
        open={demoOpen}
        onClose={() => setDemoOpen(false)}
        source="landing-hero-book-demo"
      />
    </section>
  );
}
