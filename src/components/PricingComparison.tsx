import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, Minus } from "lucide-react";
import { Section, SectionHeading, fadeUp } from "./Section";
import { loadPricing } from "@/lib/pricing";
import type { PricingTier } from "@/lib/pricing";
import { cx } from "@/lib/utils";

// Detailed compare matrix — docs/08-frontend/contracts/landing-pricing-page.md §2

type Cell = "yes" | "no" | string;

interface Group {
  title: string;
  rows: { label: string; values: [Cell, Cell, Cell, Cell] }[];
}

const PLAN_NAMES = ["Free", "Starter", "Growth", "Enterprise"] as const;

const GROUPS: Group[] = [
  {
    title: "Pricing and AI credits",
    rows: [
      // Values overridden at render from live GET /billing/plans (see listPriceCells).
      { label: "List price in NGN per month", values: ["₦0", "₦19,900", "₦49,900", "Quote"] },
      { label: "Yearly billing", values: ["None", "10× monthly", "10× monthly", "Custom"] },
      { label: "AI credits: monthly allowance", values: ["None", "5,000", "20,000", "Custom"] },
      { label: "AI credits: one-time onboarding", values: ["500", "5,000", "20,000", "Custom"] },
      { label: "Credit top-ups: 500, 2k or 5k", values: ["yes", "yes", "yes", "yes"] },
      { label: "Shared AI credit pool", values: ["yes", "yes", "yes", "yes"] },
    ],
  },
  {
    title: "Engine and AI: identical quality on every paid plan",
    rows: [
      { label: "Threat modeling and product context", values: ["1 project", "yes", "yes", "yes"] },
      { label: "Document and architecture imports from draw.io", values: ["yes", "yes", "yes", "yes"] },
      {
        label: "Six-layer code security: SAST, SCA, IaC, secrets, pipeline and malware",
        values: ["no", "yes", "yes", "yes"],
      },
      { label: "Context-aware AI triage", values: ["no", "yes", "yes", "yes"] },
      { label: "Authenticated and role-aware tests", values: ["no", "yes", "yes", "yes"] },
      { label: "AI AutoFix: credit-metered", values: ["no", "yes", "yes", "yes"] },
      { label: "Agentic branch and pull request review", values: ["yes", "yes", "yes", "yes"] },
    ],
  },
  {
    title: "Scale and continuity",
    rows: [
      { label: "Projects", values: ["1", "1", "5", "Unlimited or custom"] },
      {
        label: "Pull request and merge request reviews per month",
        values: ["Credit-metered", "10", "Continuous", "Custom"],
      },
      { label: "On-demand assessments per month", values: ["None", "3", "20", "Custom"] },
      { label: "Model refreshes per month", values: ["None", "1", "10", "Custom"] },
      {
        label: "Web, API and mobile assessment",
        values: ["Light hygiene only", "On-demand VAPT", "Recurring or continuous", "Custom"],
      },
      { label: "Continuous pull request review", values: ["no", "no", "yes", "yes"] },
      { label: "Continuous and recurring pentest", values: ["no", "no", "yes", "yes"] },
    ],
  },
  {
    title: "Cloud, posture and governance",
    rows: [
      { label: "Multi-cloud posture", values: ["no", "no", "yes", "yes"] },
      { label: "Kubernetes posture", values: ["no", "no", "yes", "yes"] },
      { label: "Blocking policies and path rules", values: ["no", "no", "yes", "yes"] },
      { label: "Compliance workbench", values: ["no", "no", "yes", "yes"] },
      { label: "SOC alert console", values: ["no", "no", "yes", "yes"] },
      { label: "Organization-wide governance and audit views", values: ["no", "no", "no", "yes"] },
    ],
  },
  {
    title: "Deliverables and support",
    rows: [
      {
        label: "Reports",
        values: [
          "Every type and format",
          "Every type and format",
          "Every type and format",
          "Custom or white-label",
        ],
      },
      {
        label: "Support",
        values: ["Community", "Email", "Guided or priority email", "Dedicated or priority"],
      },
      { label: "Uptime and commercial SLA", values: ["no", "no", "no", "Yes (deal)"] },
      {
        label: "Sales motion",
        values: ["Self-serve", "Paystack", "Paystack", "Quote"],
      },
    ],
  },
];

const PRICE_FALLBACK: Record<string, string> = {
  free: "NGN 0",
  starter: "NGN 19,900/mo",
  growth: "NGN 49,900/mo",
  enterprise: "Custom quote",
};

function priceLabel(tiers: PricingTier[], id: string): string {
  const t = tiers.find((x) => x.id === id);
  if (!t) return PRICE_FALLBACK[id] ?? "";
  if (t.monthly_ngn === null) return "Custom quote";
  if (t.monthly_ngn === 0) return "NGN 0";
  return `NGN ${t.monthly_ngn.toLocaleString()}/mo`;
}

/** Compare-table body uses ₦ formatting (same figures as the live catalog). */
function listPriceCells(tiers: PricingTier[]): [Cell, Cell, Cell, Cell] {
  const cell = (id: string, fallback: string): Cell => {
    const t = tiers.find((x) => x.id === id);
    if (!t) return fallback;
    if (t.monthly_ngn === null) return "Quote";
    if (t.monthly_ngn === 0) return "₦0";
    return `₦${t.monthly_ngn.toLocaleString()}`;
  };
  return [cell("free", "₦0"), cell("starter", "₦19,900"), cell("growth", "₦49,900"), "Quote"];
}

function CellView({ value }: { value: Cell }) {
  if (value === "yes") return <Check size={15} className="mx-auto text-emerald-400" />;
  if (value === "no") return <Minus size={13} className="mx-auto text-slate-600" />;
  return <span className="block text-xs leading-5 text-slate-300">{value}</span>;
}

export function PricingComparison() {
  const [tiers, setTiers] = useState<PricingTier[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPricing().then((t) => {
      setTiers(t);
      setLoading(false);
    });
  }, []);

  return (
    <Section id="compare" className="pb-24">
      <motion.div {...fadeUp}>
        <SectionHeading
          kicker="Compare plans"
          title="Every plan, side by side"
          body="This table compares the subscription plans. Every paid plan runs the complete security engine. Tiers differ in coverage, continuity, credits and support. SecureGraph never limits engine quality by tier."
        />
      </motion.div>

      <motion.div
        {...fadeUp}
        className="mt-12 overflow-x-auto rounded-2xl border border-phantix-700/40 bg-phantix-900/30"
      >
        <table className="w-full min-w-[820px] border-collapse text-left">
          <thead>
            <tr className="border-b border-phantix-700/40">
              <th className="px-5 py-4 align-bottom text-xs font-medium uppercase tracking-wider text-slate-500">
                Feature
              </th>
              {PLAN_NAMES.map((name, i) => (
                <th
                  key={name}
                  className={cx(
                    "px-4 py-4 text-center align-bottom",
                    i === 2 && "bg-gold-400/5",
                  )}
                >
                  <div className="flex flex-col items-center gap-1">
                    <span className="font-display text-base font-semibold text-white">{name}</span>
                    {i === 2 && (
                      <span className="chip border-gold-400/30 bg-gold-400/10 !px-2 !py-0.5 text-[9px] text-gold-300">
                        Most popular
                      </span>
                    )}
                    {loading ? (
                      <span className="skeleton inline-block h-3 w-16 rounded" />
                    ) : (
                      <span className="font-mono text-[12px] text-slate-400">
                        {priceLabel(tiers, name.toLowerCase())}
                      </span>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {GROUPS.map((group) => (
              <React.Fragment key={group.title}>
                <tr className="border-b border-phantix-700/20 bg-phantix-800/20">
                  <td
                    colSpan={5}
                    className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-wider text-slate-400"
                  >
                    {group.title}
                  </td>
                </tr>
                {group.rows.map((row) => {
                  const values =
                    row.label === "List price in NGN per month" ? listPriceCells(tiers) : row.values;
                  return (
                  <tr
                    key={row.label}
                    className="border-b border-phantix-700/20 last:border-b-0 hover:bg-phantix-800/10"
                  >
                    <td className="px-5 py-3 text-[13px] leading-5 text-slate-300">{row.label}</td>
                    {values.map((v, i) => (
                      <td
                        key={i}
                        className={cx("px-4 py-3 text-center", i === 2 && "bg-gold-400/5")}
                      >
                        {loading && row.label === "List price in NGN per month" ? (
                          <span className="skeleton mx-auto block h-3 w-10 rounded" />
                        ) : (
                          <CellView value={v} />
                        )}
                      </td>
                    ))}
                  </tr>
                  );
                })}
              </React.Fragment>
            ))}
          </tbody>
        </table>
      </motion.div>

      <motion.p
        {...fadeUp}
        className="mx-auto mt-6 max-w-2xl text-center text-xs leading-6 text-slate-500"
      >
        Deliberate gates are free on every plan. These gates are dual control, MFA, audit
        immutability and evidence redaction. AI work uses credits. SecureGraph draws from the allowance
        first, then the allotment, then top-ups. SecureGraph never bills you to view, assign or export
        results. Prices are in NGN for each company. SecureGraph billing updates them live.
      </motion.p>
    </Section>
  );
}
