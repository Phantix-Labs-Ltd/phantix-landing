import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  ArrowRight,
  ArrowDown,
  CalendarClock,
  Crosshair,
  Smartphone,
  Sparkles,
  FileText,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { Section, SectionHeading, fadeUp } from "./Section";
import {
  loadPricing,
  pricingFootnote,
  engagementOffers,
  yearlySavePercent,
} from "@/lib/pricing";
import type { EngagementOffer, PricingTier } from "@/lib/pricing";
import { PLATFORM_REGISTER_URL } from "@/lib/links";
import { cx } from "@/lib/utils";
import { BrandMark } from "@/components/BrandLogo";
import { DemoRequestModal } from "@/components/DemoRequestModal";

const engagementIcons = [
  <Crosshair size={16} key="vapt" />,
  <Smartphone size={16} key="mobile" />,
  <FileText size={16} key="white" />,
];

type BillingCycle = "monthly" | "yearly";

/**
 * Landing pricing — 3 paid cards, Free promoted below the grid. Shared with the
 * /pricing page (`showHeading={false}`) where it sits above the compare matrix.
 *
 * Rules held from the design review:
 *  - honest numbers only: annual = 10× monthly ("pay 10, get 12", ≈17% off);
 *    the badge always reads the real ~17%, never an invented 20%.
 *  - the Growth card is the one elevated surface (gold ring + glow + badge),
 *    every other card stays quiet so the emphasis means something.
 *  - exactly five headline features per card — the long story lives in the
 *    compare matrix on /pricing#compare.
 */
/**
 * `showEngagements` — the project-engagement band (four quote requests) lives on
 * /pricing. The landing page hides it so pricing stays a single decision:
 * start free, upgrade later, or talk to sales for Enterprise.
 */
export function Pricing({
  showHeading = true,
  showEngagements = true,
}: {
  showHeading?: boolean;
  showEngagements?: boolean;
}) {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [pricingLoading, setPricingLoading] = useState(true);
  const [cycle, setCycle] = useState<BillingCycle>("monthly");
  const [engagementsOpen, setEngagementsOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalSource, setModalSource] = useState("pricing-enterprise-quote");
  const [modalTitle, setModalTitle] = useState<string | undefined>();
  const [modalDefaultMessage, setModalDefaultMessage] = useState<string | undefined>();

  useEffect(() => {
    loadPricing(true).then((t) => {
      setTiers(t);
      setPricingLoading(false);
    });
    const t = window.setInterval(() => {
      loadPricing(true).then(setTiers);
    }, 2 * 60_000);
    return () => window.clearInterval(t);
  }, []);

  const openQuote = (opts: { source: string; title?: string; defaultMessage?: string }) => {
    setModalSource(opts.source);
    setModalTitle(opts.title);
    setModalDefaultMessage(opts.defaultMessage);
    setModalOpen(true);
  };

  const openEngagementQuote = (o: EngagementOffer) => {
    openQuote({
      source: o.source,
      title: o.title,
      defaultMessage: o.interestTag,
    });
  };

  // Free is a promo below the grid, not a card — the three paid tiers carry the
  // grid. Missing plans (e.g. a live catalog without Enterprise) degrade to a
  // smaller grid instead of empty columns.
  const paidOrder = ["starter", "growth", "enterprise"];
  const paid = paidOrder
    .map((id) => tiers.find((t) => t.id === id))
    .filter((t): t is PricingTier => Boolean(t));

  const free = tiers.find((t) => t.id === "free");
  const savePct = yearlySavePercent(); // ≈17 — annual = 10× monthly

  const isYearlyPrice = (t: PricingTier) =>
    cycle === "yearly" && t.yearly_price_ngn != null && t.yearly_price_ngn > 0;

  return (
    <Section id="pricing" className={showHeading ? "py-24" : "pb-24 pt-4"}>
      {showHeading && (
        <motion.div {...fadeUp}>
          <SectionHeading
            kicker="Pricing"
            title="Simple, per-company pricing"
            body="Every tier includes the privacy-first architecture, dual control and the immutable audit trail. Plan and rate limits belong to the company. All of its users and keys share the same bucket."
          />
        </motion.div>
      )}

      {/* ── Monthly / annual toggle ─────────────────────────────── */}
      <motion.div {...fadeUp} className="mt-10 flex justify-center">
        <div
          role="tablist"
          aria-label="Billing cycle"
          className="inline-flex items-center gap-0.5 rounded-full border border-phantix-700/50 bg-phantix-900/60 p-1"
        >
          {(["monthly", "yearly"] as const).map((c) => (
            <button
              key={c}
              type="button"
              role="tab"
              aria-selected={cycle === c}
              onClick={() => setCycle(c)}
              className={cx(
                "rounded-full px-5 py-2 text-sm font-semibold transition-colors duration-200",
                cycle === c
                  ? "bg-phantix-800 text-white shadow-sm"
                  : "text-slate-500 hover:text-slate-300",
              )}
            >
              {c === "monthly" ? "Monthly" : "Annual"}
            </button>
          ))}
          {/* Savings hint lives inside the control and appears only while the
              annual option is active — it answers the choice you just made. */}
          {cycle === "yearly" && (
            <motion.span
              key="save-hint"
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.2 }}
              className="ml-1 inline-flex items-center gap-1 whitespace-nowrap rounded-full border border-gold-400/50 bg-gold-400/15 px-3 py-1 text-[12px] font-bold uppercase tracking-wider text-gold-300"
            >
              Save ~{savePct}% · 2 months free
            </motion.span>
          )}
        </div>
      </motion.div>

      {/* ── Paid plan cards ─────────────────────────────────────── */}
      <div className="mx-auto mt-12 grid max-w-6xl grid-cols-1 gap-6 md:grid-cols-3 lg:gap-8">
        {pricingLoading && paid.length === 0
          ? Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="card flex flex-col p-7">
                <div className="skeleton h-5 w-28 rounded" />
                <div className="skeleton mt-2.5 h-3.5 w-full max-w-[85%] rounded" />
                <div className="mt-5 border-t border-phantix-700/40 pt-5">
                  <div className="skeleton h-8 w-32 rounded" />
                  <div className="skeleton mt-2 h-3 w-40 rounded" />
                </div>
                <div className="mt-6 space-y-2.5">
                  {Array.from({ length: 5 }).map((__, j) => (
                    <div key={j} className="skeleton h-3.5 rounded" style={{ width: `${85 - j * 6}%`, opacity: 1 - j * 0.12 }} />
                  ))}
                </div>
              </div>
            ))
          : paid.map((t, i) => {
          const monthly = t.monthly_ngn;
          const yearly = isYearlyPrice(t);
          const elevated = t.highlighted || t.id === "growth";
          const custom = monthly === null;

          const priceBig = monthly === null
            ? "Custom"
            : monthly === 0
              ? "NGN 0"
              : yearly
                ? `NGN ${(t.yearly_price_ngn ?? 0).toLocaleString()}`
                : `NGN ${monthly.toLocaleString()}`;
          const priceSuffix = custom || monthly === 0 ? "" : yearly ? "/yr" : "/mo";

          const caption = custom ? (
            <>
              {t.heroUnit || "Custom AI credits and volume"}: scoped and quoted for each organization
            </>
          ) : monthly === 0 ? (
            t.yearly_note ?? "No card required"
          ) : yearly ? (
            <>
              You pay once each year. That is about NGN{" "}
              {Math.round((t.yearly_price_ngn ?? 0) / 12).toLocaleString()} per month
            </>
          ) : (
            <>
              {t.heroMetric} AI credits per month
              {t.first_month_ngn != null && t.first_month_ngn > 0 && (
                <>
                  {" · "}
                  <span className="text-emerald-400/90">
                    first month NGN {t.first_month_ngn.toLocaleString()}
                  </span>
                </>
              )}
            </>
          );

          return (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.55, delay: i * 0.09 }}
              className={cx(
                "card relative flex flex-col p-7",
                elevated
                  ? "z-10 border-gold-400/60 bg-gradient-to-b from-phantix-850 to-phantix-900 shadow-glow lg:-translate-y-4"
                  : "bg-gradient-to-b from-phantix-900/80 to-phantix-900/40",
              )}
            >
              {elevated && (
                <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-gold-400 to-gold-600 px-4 py-1 text-[12px] font-bold uppercase tracking-wider text-phantix-950 shadow-glow">
                  {t.badge ?? "Most popular"}
                </span>
              )}

              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-display text-xl font-bold tracking-tight text-white">
                    {t.name}
                  </h3>
                  <p className="mt-1 text-sm leading-6 text-slate-400">{t.tagline}</p>
                </div>
              </div>

              {/* Prominent price */}
              <div className="mt-5 border-t border-phantix-700/40 pt-5">
                <div className="flex items-baseline gap-1.5">
                  <span
                    className={cx(
                      "font-display font-bold tracking-tight tabular-nums",
                      custom ? "text-3xl" : "text-4xl",
                    )}
                  >
                    {priceBig}
                  </span>
                  {priceSuffix && (
                    <span className="text-sm font-medium text-slate-500">{priceSuffix}</span>
                  )}
                </div>
                <p className="mt-2 text-xs leading-5 text-slate-500">{caption}</p>
              </div>

              {/* 5 headline features — full detail lives in the compare matrix */}
              <ul className="mt-6 flex-1 space-y-3">
                {t.features.slice(0, 5).map((f) => (
                  <li
                    key={f}
                    className="flex items-start gap-2.5 text-[13px] leading-5 text-slate-300"
                  >
                    <CheckCircle2
                      size={15}
                      className={cx(
                        "mt-0.5 shrink-0",
                        elevated ? "text-gold-400" : "text-emerald-400",
                      )}
                    />
                    {f}
                  </li>
                ))}
              </ul>

              {t.id === "enterprise" ? (
                <button
                  type="button"
                  onClick={() =>
                    openQuote({
                      source: "pricing-enterprise-quote",
                      defaultMessage: "[interest:enterprise_quote]",
                    })
                  }
                  className={cx("mt-8 w-full", elevated ? "btn-primary" : "btn-secondary")}
                >
                  {t.cta} <ArrowRight size={14} />
                </button>
              ) : (
                <a
                  href={PLATFORM_REGISTER_URL}
                  className={cx("mt-8 w-full", elevated ? "btn-primary" : "btn-secondary")}
                >
                  {t.cta} <ArrowRight size={14} />
                </a>
              )}
            </motion.div>
          );
            })}
      </div>

      {/* ── Free + full-detail row (Free is no longer a card) ─────── */}
      <motion.div {...fadeUp} className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <a href={PLATFORM_REGISTER_URL} className="btn-secondary !px-6">
          <Sparkles size={15} className="text-gold-400" />
          {free?.cta ?? "Start free"}: no card required
        </a>
        <Link
          to="/pricing#compare"
          className="inline-flex items-center gap-1.5 rounded-md px-3 py-2 text-sm font-semibold text-gold-300 transition-colors hover:text-gold-200"
        >
          Compare all plans in detail <ArrowDown size={15} />
        </Link>
      </motion.div>

      {/* ── Engagements — collapsible band ─────────────────────────── */}
      {showEngagements && (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-40px" }}
        transition={{ duration: 0.55, delay: 0.15 }}
        className="mt-6 overflow-hidden rounded-2xl border border-phantix-700/40 bg-gradient-to-b from-phantix-900/70 to-phantix-900/40"
      >
        <button
          type="button"
          onClick={() => setEngagementsOpen((v) => !v)}
          className="flex w-full items-center gap-4 px-6 py-5 text-left transition-colors hover:bg-phantix-800/30"
        >
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">
            <Crosshair size={19} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block font-display text-lg font-bold text-white">
              Project engagements
            </span>
            <span className="block text-sm text-slate-400">
              When you need a full test or hands-on experts. This band covers full VAPT, dynamic
              mobile and white-label deliverables.
            </span>
          </span>
          <span className="hidden shrink-0 sm:block">
            <span className="chip border-gold-400/30 bg-gold-400/10 text-gold-300">
              Request a quote
            </span>
          </span>
          <span className="shrink-0 text-slate-500">
            {engagementsOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </button>

        {engagementsOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="border-t border-phantix-700/40"
          >
            <div className="grid grid-cols-1 gap-4 px-6 py-6 sm:grid-cols-2 lg:grid-cols-4">
              {engagementOffers.map((o, i) => (
                <button
                  type="button"
                  key={o.title}
                  onClick={() => openEngagementQuote(o)}
                  className="rounded-xl border border-phantix-700/40 bg-phantix-950/50 p-4 text-left transition-colors hover:border-gold-400/30 hover:bg-phantix-900/60"
                >
                  <div className="flex items-center justify-between">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gold-400/[0.12] text-gold-400">
                      {engagementIcons[i % engagementIcons.length]}
                    </span>
                    {o.tag && (
                      <span className="chip border-gold-400/20 bg-gold-400/10 text-[9px] text-gold-300">
                        {o.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="mt-3 font-display text-sm font-semibold text-white">{o.title}</h4>
                  <p className="mt-1 text-xs leading-5 text-slate-400">{o.detail}</p>
                </button>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-3 border-t border-phantix-700/40 px-6 py-4">
              <p className="text-xs text-slate-500">
                A security engineer scopes each engagement and quotes it for each project. This is
                not a self-serve subscription.
              </p>
              <button
                type="button"
                onClick={() => openEngagementQuote(engagementOffers[0])}
                className="btn-primary ml-auto !py-2 text-sm"
              >
                Request a quote <ArrowRight size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
      )}

      <p className="mx-auto mt-8 max-w-2xl text-center text-xs leading-5 text-slate-500">
        {pricingFootnote}
      </p>

      <DemoRequestModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        source={modalSource}
        title={modalTitle}
        defaultMessage={modalDefaultMessage}
      />
    </Section>
  );
}

/**
 * The close — the same two paths as the hero and nothing else: start free
 * (primary) or book a demo (secondary, opens in place). No live-demo launcher,
 * no sign-in, no host-by-host setup explainer.
 */
export function FinalCTA() {
  // null = closed; otherwise which lead the popup is capturing.
  const [lead, setLead] = useState<null | "demo" | "enterprise">(null);
  return (
    <Section className="pb-28 pt-8">
      <motion.div
        {...fadeUp}
        className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-16 text-center shadow-glow"
      >
        <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
        {/* The FinalCTA panel is always navy, so the mark stays white in both themes. */}
        <BrandMark surface="dark" className="relative mx-auto h-20 w-20" />
        <h2 className="relative mt-6 font-display text-4xl font-bold tracking-tight text-white">
          Find out what an attacker would find first
        </h2>
        <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
          Create your organization, add your assets and run your first assessment today. Upgrade when
          you need continuous testing, or talk to us when you want a guided walkthrough first.
        </p>
        <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
          <a href={PLATFORM_REGISTER_URL} className="btn-primary btn-shine !px-7 !py-3 !text-[15px]">
            Get started free <ArrowRight size={16} />
          </a>
          <button
            type="button"
            onClick={() => setLead("demo")}
            className="btn-secondary !px-7 !py-3 !text-[15px]"
          >
            <CalendarClock size={16} /> Book a demo
          </button>
        </div>
        <p className="relative mt-5 text-[12px] leading-5 text-slate-400">
          Free plan. You do not need a credit card. Does Enterprise need SSO, SLAs or a custom
          deployment?{" "}
          <button
            type="button"
            onClick={() => setLead("enterprise")}
            className="font-semibold text-gold-300 hover:text-gold-200"
          >
            Talk to sales
          </button>
        </p>
      </motion.div>

      <DemoRequestModal
        open={lead !== null}
        onClose={() => setLead(null)}
        source={lead === "enterprise" ? "landing-final-enterprise" : "landing-final-book-demo"}
        defaultMessage={lead === "enterprise" ? "[interest:enterprise_quote]" : undefined}
      />
    </Section>
  );
}
