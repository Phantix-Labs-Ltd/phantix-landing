import React from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2, ArrowRight, CalendarClock } from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import { getPlatformPage, PLATFORM_PAGES } from "@/lib/platform-content";
import { useTheme } from "@/lib/theme";
import { sceneImg } from "@/lib/scene-image";
import { PLATFORM_REGISTER_URL } from "@/lib/links";
import { cx } from "@/lib/utils";

export default function PlatformCapability() {
  const { slug } = useParams<{ slug: string }>();
  const page = getPlatformPage(slug);
  const { theme } = useTheme();

  if (!page) return <Navigate to="/" replace />;

  const siblings = PLATFORM_PAGES.filter((p) => p.slug !== page.slug);

  return (
    <PageShell>
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />

        {/* De-centred (Hallmark fix): left-biased column, no eyebrow pill —
            the icon + headline carry the "which surface" context on their own. */}
        <motion.div {...fadeUp} className="mt-10 max-w-2xl">
          <h1 className="flex items-center gap-3 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
              {page.icon}
            </span>
            {page.headline}
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">{page.intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a href={PLATFORM_REGISTER_URL} className="btn-primary btn-shine !px-6 !py-3 !text-base">
              Get started free <ArrowRight size={16} />
            </a>
            <Link to="/demo" className="btn-secondary !px-6 !py-3 !text-base">
              <CalendarClock size={16} /> Request a demo
            </Link>
          </div>
        </motion.div>
      </Section>

      <Section className="relative pb-20">
        <GlowBloom className="right-[-10%] top-0 h-[380px] w-[380px]" tone="gold" />
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.1fr]">
          <motion.div {...fadeUp}>
            <p className="eyebrow text-gold-400">What ships</p>
            <ul className="mt-5 space-y-3.5">
              {page.points.map((p) => (
                <li key={p} className="flex items-start gap-3 text-[14px] leading-6 text-slate-300">
                  <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-emerald-400" />
                  {p}
                </li>
              ))}
            </ul>
            {page.footnote && (
              <p className="mt-6 rounded-lg border border-phantix-700/50 bg-phantix-900/50 px-4 py-3 text-[13px] leading-5 text-slate-500">
                {page.footnote}
              </p>
            )}
          </motion.div>

          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.1 }}
            className="overflow-hidden rounded-md border border-phantix-700 shadow-[0_0_0_1px_rgba(232,181,77,0.10),0_1px_2px_0_rgba(0,0,0,0.5)]"
          >
            {sceneImg(page.shot, theme, page.alt)}
          </motion.div>
        </div>

        <motion.p {...fadeUp} className="mt-10 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          Targets are SSRF-guarded: only http and https. SecureGraph blocks private ranges and cloud metadata endpoints. DNS-rebinding defense is active.
        </motion.p>
      </Section>

      {/* Cross-links to the other platform pages — a dense row list with the
          icon inline beside the heading, not a grid of identical icon-tiles. */}
      <Section className="pb-20">
        <motion.div {...fadeUp} className="max-w-2xl">
          <h2 className="font-display text-2xl font-semibold tracking-tight text-white">
            Every surface, one Command Centre
          </h2>
        </motion.div>
        <div className="mt-8 divide-y divide-phantix-700/40 border-y border-phantix-700/40">
          {siblings.map((s, i) => (
            <motion.div key={s.slug} {...fadeUp} transition={{ ...fadeUp.transition, delay: i * 0.06 }}>
              <Link
                to={`/platform/${s.slug}`}
                className={cx(
                  "group flex items-center justify-between gap-4 py-5 transition-colors hover:bg-phantix-900/40",
                )}
              >
                <span className="flex items-center gap-3.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                    {s.icon}
                  </span>
                  <span className="font-display text-[15px] font-semibold text-white group-hover:text-gold-300">
                    {s.navLabel}
                  </span>
                </span>
                <ArrowRight
                  size={16}
                  className="shrink-0 text-gold-400 opacity-100 transition-all sm:opacity-0 sm:group-hover:translate-x-1 sm:group-hover:opacity-100"
                />
              </Link>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="pb-28">
        <motion.div
          {...fadeUp}
          className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-14 text-center shadow-glow"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white">
            See how SecureGraph tests {page.navLabel.toLowerCase()} on your own stack
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            Walk through the product yourself, or talk to the team about a scoped assessment.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/demo" className="btn-primary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Request a live demo
            </Link>
            <a href={PLATFORM_REGISTER_URL} className="btn-secondary !px-7 !py-3 !text-[15px]">
              Get started free
            </a>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}
