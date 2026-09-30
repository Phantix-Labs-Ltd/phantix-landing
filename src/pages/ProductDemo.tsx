import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import {
  Radar, Crosshair, ShieldAlert, Sparkles, Scale, FileText, BellRing,
  ArrowRight, ArrowLeft, PlayCircle, CalendarClock,
} from "lucide-react";
import { Nav, Footer } from "@/components/chrome";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import { DemoRequestModal } from "@/components/DemoRequestModal";
import { useTheme } from "@/lib/theme";
import { cx } from "@/lib/utils";
import { sceneImg } from "@/lib/scene-image";

/*
 * /demo — the self-serve product tour.
 *
 * Distinct from the "Live demo" links elsewhere on the site (APP_DEMO_URL,
 * a simulated Command Centre tenant on the Application surface, not yet
 * shipped). This page is a marketing-side walkthrough that lives entirely on
 * landing — real screenshots + footage of the product, stepped through by
 * the visitor — that funnels into the "Request a live demo" lead form.
 * Reaching the end of the tour opens that popup once per session.
 */

const STEPS = [
  {
    id: "assets",
    icon: Radar,
    title: "See every asset you own",
    body: "SecureGraph finds domains, subdomains, IPs, APIs, and mobile builds continuously. You do not wait for a quarterly spreadsheet update.",
    shot: "assets",
    alt: "Attack-surface inventory that lists discovered domains and APIs with their verification state",
  },
  {
    id: "vapt",
    icon: Crosshair,
    title: "Test it like an attacker would",
    body: "Approval gates each VAPT campaign. The campaign then runs the full pipeline across every engine and ends with findings that staff verify.",
    shot: "vapt",
    alt: "VAPT campaigns view with scoped assessments and their progress",
  },
  {
    id: "risks",
    icon: ShieldAlert,
    title: "Know what to fix first",
    body: "SecureGraph scores each risk with explainable Likelihood and Impact, then orders it from P1–P5. The queue then reflects real exposure.",
    shot: "risks",
    alt: "Risk register with a priority order, P1 to P5 scores, and treatment states",
  },
  {
    id: "agent",
    icon: Sparkles,
    title: "An AI agent that earns its findings",
    body: "The Autonomous Pentest Agent routes work to VAPT, SOC, GRC, Threat Intel, and Asset specialists. It never reports a vulnerability without a finding ID.",
    shot: "agent",
    alt: "The SecureGraph Agent sends work to VAPT, SOC, GRC, Threat Intel, and Asset specialists",
  },
  {
    id: "compliance",
    icon: Scale,
    title: "Prove it to the board",
    body: "SecureGraph builds the compliance map from verified findings only. The map gives you evidence, not adjectives.",
    shot: "compliance",
    alt: "Compliance view that maps verified findings to framework controls",
  },
  {
    id: "soc",
    icon: BellRing,
    title: "Stay ahead of live activity",
    body: "The SOC engine keeps the triage queue current. Detections arrive here, not in a nightly digest.",
    shot: "soc",
    alt: "SOC queue with live detections that await triage",
  },
  {
    id: "reports",
    icon: FileText,
    title: "Ship a report your board will read",
    body: "SecureGraph builds board-ready deliverables in PDF, DOCX, and XLSX formats from verified findings only.",
    shot: "reports",
    alt: "Report library with board-ready deliverables that use verified findings",
  },
];

const AUTO_ADVANCE_MS = 5200;
const PROMPT_KEY = "phantix_demo_prompted";

export default function ProductDemo() {
  const { theme } = useTheme();
  const reduce = useReducedMotion();
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("demo-page-cta");
  const promptedRef = useRef(false);

  const atEnd = active === STEPS.length - 1;
  const step = STEPS[active];

  const openModal = (source: string) => {
    setModalSource(source);
    setModalOpen(true);
  };

  // Auto-advance through the tour; stop (don't loop) once the visitor
  // reaches the last step so it reads as an ending, not a carousel.
  useEffect(() => {
    if (paused || reduce || atEnd) return;
    const t = window.setTimeout(() => setActive((i) => Math.min(i + 1, STEPS.length - 1)), AUTO_ADVANCE_MS);
    return () => window.clearTimeout(t);
  }, [active, paused, reduce, atEnd]);

  // The ask: after checking out the demo, prompt for a live demo. Fires once
  // per browser session, a beat after the visitor lands on the final step —
  // whether they clicked through or let the tour auto-advance there.
  useEffect(() => {
    if (!atEnd || promptedRef.current) return;
    let already = false;
    try {
      already = sessionStorage.getItem(PROMPT_KEY) === "1";
    } catch {
      /* private mode — treat as not-yet-prompted */
    }
    if (already) return;
    const t = window.setTimeout(() => {
      promptedRef.current = true;
      try {
        sessionStorage.setItem(PROMPT_KEY, "1");
      } catch {
        /* ignore */
      }
      openModal("demo-tour-complete-auto");
    }, 1800);
    return () => window.clearTimeout(t);
  }, [atEnd]);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-phantix-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[140px]" />
      </div>

      <Nav />
      <main className="relative">
        {/* Header */}
        <Section className="pb-14 pt-28 md:pt-36">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-200"
          >
            <ArrowLeft size={15} /> Back to home
          </Link>

          <motion.div {...fadeUp} className="mx-auto mt-10 max-w-2xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
              <PlayCircle size={13} /> Product demo
            </span>
            <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
              See SecureGraph run a real assessment
            </h1>
            <p className="mt-5 text-[15px] leading-7 text-slate-400">
              Every screen below shows the real Command Centre, not a mockup. Step through the walkthrough.
              Then talk to the team when you want a live guided demo on your own stack.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
              <button
                type="button"
                onClick={() => openModal("demo-page-header-cta")}
                className="btn-primary btn-shine !px-6 !py-3 !text-base"
              >
                <CalendarClock size={16} /> Request a live demo
              </button>
              <a href="#tour" className="btn-secondary !px-6 !py-3 !text-base">
                Start the tour
              </a>
            </div>
          </motion.div>
        </Section>

        {/* Guided tour */}
        <Section id="tour" className="relative py-8">
          <GlowBloom className="right-[-10%] top-1/3 h-[380px] w-[380px]" tone="gold" />

          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold-400">Guided tour</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white sm:text-4xl">
              Walk through the platform, step by step
            </h2>
          </motion.div>

          <div
            className="relative mt-12 grid grid-cols-1 gap-8 lg:grid-cols-[320px_1fr]"
            onMouseEnter={() => setPaused(true)}
            onMouseLeave={() => setPaused(false)}
          >
            {/* Step list */}
            <div className="flex gap-2 overflow-x-auto pb-2 lg:flex-col lg:overflow-visible lg:pb-0">
              {STEPS.map((s, i) => {
                const Icon = s.icon;
                const isActive = i === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(i)}
                    className={cx(
                      "group relative w-[240px] shrink-0 rounded-md border px-4 py-3.5 text-left transition-colors duration-200 lg:w-auto",
                      isActive
                        ? "border-gold-400/45 bg-gold-400/[0.07]"
                        : "border-phantix-700 bg-phantix-900/60 hover:border-phantix-600",
                    )}
                  >
                    <span className="flex items-start gap-3">
                      <span
                        className={cx(
                          "flex h-8 w-8 shrink-0 items-center justify-center rounded-md border",
                          isActive
                            ? "border-gold-400/40 bg-gold-400/10 text-gold-300"
                            : "border-phantix-700 text-slate-500 group-hover:text-slate-300",
                        )}
                      >
                        <Icon size={15} />
                      </span>
                      <span className="min-w-0">
                        <span className={cx("block font-display text-[14px] font-semibold", isActive ? "text-white" : "text-slate-300")}>
                          {s.title}
                        </span>
                        <span className="mt-1 hidden text-[12px] leading-5 text-slate-500 lg:block">{s.body}</span>
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Active screen */}
            <div>
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden rounded-md border border-phantix-700 shadow-[0_0_0_1px_rgba(232,181,77,0.10),0_1px_2px_0_rgba(0,0,0,0.5)]"
              >
                {sceneImg(step.shot, theme, step.alt)}
              </motion.div>

              <div className="mt-5 flex flex-wrap items-start justify-between gap-4">
                <div className="max-w-xl">
                  <h3 className="font-display text-lg font-semibold text-white lg:hidden">{step.title}</h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{step.body}</p>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setActive((i) => Math.max(0, i - 1))}
                    disabled={active === 0}
                    aria-label="Previous"
                    className="btn-secondary !px-3 !py-2 disabled:opacity-30"
                  >
                    <ArrowLeft size={15} />
                  </button>
                  {!atEnd ? (
                    <button
                      type="button"
                      onClick={() => setActive((i) => Math.min(STEPS.length - 1, i + 1))}
                      className="btn-secondary !px-3 !py-2"
                      aria-label="Next"
                    >
                      <ArrowRight size={15} />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => openModal("demo-tour-complete")}
                      className="btn-primary !px-4 !py-2 !text-sm"
                    >
                      Finish and request a live demo <ArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>

              {/* Progress dots */}
              <div className="mt-6 flex items-center gap-1.5">
                {STEPS.map((s, i) => (
                  <button
                    key={s.id}
                    aria-label={`Go to ${s.title}`}
                    onClick={() => setActive(i)}
                    className={cx(
                      "h-1.5 rounded-full transition-all duration-300",
                      i === active ? "w-6 bg-gold-400" : "w-1.5 bg-phantix-700 hover:bg-phantix-600",
                    )}
                  />
                ))}
              </div>
            </div>
          </div>
        </Section>

        {/* Closing CTA */}
        <Section className="pb-28 pt-20">
          <motion.div
            {...fadeUp}
            className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-16 text-center shadow-glow"
          >
            <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
            <h2 className="relative font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              Like what you see?
            </h2>
            <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
              Get a live guided walkthrough on your own attack surface with a member of the team.
              We do not use a generic slide deck.
            </p>
            <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => openModal("demo-page-footer-cta")}
                className="btn-primary !px-7 !py-3 !text-[15px]"
              >
                <CalendarClock size={16} /> Request a live demo
              </button>
            </div>
          </motion.div>
        </Section>
      </main>
      <Footer />

      <DemoRequestModal open={modalOpen} onClose={() => setModalOpen(false)} source={modalSource} />
    </div>
  );
}
