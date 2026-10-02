// Pricing catalog — fetches live pricing from the backend; falls back to the
// pricing-v3 catalogue (Free / Starter / Growth / Enterprise) when offline.
// Landing layout: docs/08-frontend/contracts/landing-pricing-page.md
import { API_BASE } from "./config";

export interface PricingTier {
  id: string;
  name: string;
  tagline: string;
  /** Big number above the price (e.g. "5,000"). */
  heroMetric: string;
  /** Unit under the hero number (e.g. "AI credits / month (+ 5,000 allotment)"). */
  heroUnit: string;
  monthly_ngn: number | null;
  first_month_ngn?: number | null;
  yearly_price_ngn?: number;
  yearly_note?: string;
  highlighted?: boolean;
  badge?: string;
  cta: string;
  features: string[];
}

export interface EngagementOffer {
  title: string;
  detail: string;
  tag: string;
  /** POST /demo-requests `source` (contracts/pricing-and-plans.md §3). */
  source: string;
  /** Prefill for the demo-request message field. */
  interestTag: string;
}

/**
 * Live `/billing/pricing` may return either:
 *  - the legacy single-price object (Starter list price + first-month + yearly),
 *  - or a plans array (`[{ id, name, monthly_ngn, first_month_ngn, ... }]`).
 */
interface BillingPricingResponse {
  monthly_list_price_ngn: number;
  first_month_price_ngn?: number;
  subsequent_monthly_price_ngn?: number;
  yearly_price_ngn?: number;
  first_month_discount_percent?: number;
  growth_monthly_price_ngn?: number;
  plans?: Array<Partial<PricingTier> & { id: string; monthly_ngn: number | null }>;
}

const freeFeatures = [
  "Know your exposure: asset inventory with fair-use caps and no card required",
  "Light hygiene tests on DNS and network show what is exposed",
  "Dual control, MFA and an immutable audit trail are free on every plan",
  "Basic exports to JSON and Markdown let you leave with your data",
  "500 one-time AI credits, then free open-source models with admin opt-in",
  "Community support",
  "Not included: full VAPT campaigns, continuous testing, the Autonomous Pentest Agent, private-repo depth, board PDF packs",
];

const starterFeatures = [
  "Everything in Free",
  "Vulnerability assessment and penetration testing (VAPT): scoped, approval-gated campaigns",
  "Verified findings with remediation guidance, not a raw scanner dump",
  "Autonomous Pentest Agent: included and credit-metered",
  "10 pull request and merge request security reviews each month and 3 on-demand assessments each month",
  "Full engine quality for web and API, code security and mobile static analysis. AI AutoFix is credit-metered.",
  "5,000 AI credits per month and a 5,000 onboarding allotment. Email support is included.",
];

const growthFeatures = [
  "Everything in Starter",
  "Recurring VAPT work and continuous pull request and merge request review",
  "Autonomous Pentest Agent: included and credit-metered",
  "5 projects, 20 on-demand assessments per month and 10 model refreshes per month",
  "Multi-cloud and Kubernetes posture. Blocking policies and path rules are included.",
  "Compliance workbench and SOC console depth when you need them",
  "20,000 AI credits per month and a 20,000 onboarding allotment. Guided onboarding is included.",
];

const enterpriseFeatures = [
  "Everything in Growth, at custom volume",
  "Unlimited or negotiated projects and assessments",
  "Organization-wide governance and audit views",
  "Multi-company groups, custom branding and report retention",
  "Priority support and dedicated success. Both depend on the deal.",
  "White-label reports for partners and a custom SLA that depends on the deal.",
];

const engagementOffers: EngagementOffer[] = [
  {
    title: "Full VAPT engagement",
    detail:
      "This broad assessment needs approval from multiple parties. It correlates attack paths and shows verified findings.",
    tag: "Most requested",
    source: "pricing-most-requested-full-vapt",
    interestTag: "[interest:full_vapt_engagement]",
  },
  {
    title: "Dynamic mobile and AVD tests",
    detail:
      "Deep runtime analysis of Android apps and virtual devices. This goes beyond static APK checks.",
    tag: "Project",
    source: "pricing-most-requested-dynamic-mobile",
    interestTag: "[interest:dynamic_mobile_testing]",
  },
  {
    title: "White-label deliverables",
    detail:
      "Branded reports for managed security service provider (MSSP) partners. Your logo goes on the board-ready package.",
    tag: "Partners",
    source: "pricing-most-requested-white-label",
    interestTag: "[interest:white_label_reports]",
  },
];

function yearsNote(monthly: number): string {
  const yearly = monthly * 10; // annual = 10× monthly
  return `NGN ${yearly.toLocaleString()}/year · pay 10 months, get 12`;
}

function yearlySavePercent(): number {
  // 10× monthly vs 12× monthly ≈ 16.7%
  return 17;
}

/**
 * A live catalog may return machine identifiers (`full_engine`, `k8s_posture`)
 * instead of human sentences. Only trust raw feature text when every item reads
 * as prose (no snake_case identifiers); otherwise fall back to the curated
 * human list for the tier.
 */
function pickFeatures(raw: string[] | undefined, curated: string[] | undefined): string[] {
  const list = Array.isArray(raw) ? raw.filter((x): x is string => typeof x === "string" && Boolean(x.trim())) : [];
  const readable = list.length > 0 && list.every((f) => !f.includes("_"));
  return readable ? list : (curated ?? []);
}

export function buildPricingTiers(raw: BillingPricingResponse | null): PricingTier[] {
  const fallback = raw ?? {
    monthly_list_price_ngn: 49_900,
    first_month_price_ngn: 24_950,
    yearly_price_ngn: 499_000,
    growth_monthly_price_ngn: 99_900,
    first_month_discount_percent: 50,
  };

  if (Array.isArray(fallback.plans) && fallback.plans.length > 0) {
    const defaults: Record<string, Partial<PricingTier>> = {
      free: {
        heroMetric: "500",
        heroUnit: "one-time AI credits",
        tagline: "For teams that explore SecureGraph with no card",
        features: freeFeatures,
        cta: "Get started free",
      },
      starter: {
        heroMetric: "5,000",
        heroUnit: "AI credits per month and a 5,000 allotment",
        tagline: "Assess like an attacker: VAPT with verified findings",
        features: starterFeatures,
        cta: "Get started",
      },
      growth: {
        heroMetric: "20,000",
        heroUnit: "AI credits per month and a 20,000 allotment",
        tagline: "Keep testing: continuous security every week",
        features: growthFeatures,
        highlighted: true,
        badge: "Most popular",
        cta: "Get started",
      },
      enterprise: {
        heroMetric: "Custom",
        heroUnit: "AI credits and volume",
        tagline: "For platforms and regulated organizations that operate at scale",
        features: enterpriseFeatures,
        cta: "Talk to sales",
      },
    };
    return fallback.plans
      .filter((p) => p && typeof p.id === "string")
      .map((p) => {
        const d = defaults[p.id] ?? {};
        return {
          id: p.id,
          name: p.name ?? p.id,
          tagline: p.tagline ?? d.tagline ?? "",
          heroMetric: p.heroMetric ?? d.heroMetric ?? "Not set",
          heroUnit: p.heroUnit ?? d.heroUnit ?? "",
          monthly_ngn: p.monthly_ngn,
          first_month_ngn: p.first_month_ngn ?? null,
          yearly_price_ngn: p.yearly_price_ngn,
          yearly_note: p.yearly_price_ngn
            ? yearsNote(p.monthly_ngn ?? 0)
            : p.id === "free"
              ? "No card required"
              : undefined,
          highlighted: Boolean(p.highlighted ?? d.highlighted),
          badge: p.badge ?? d.badge,
          cta:
            p.cta ??
            d.cta ??
            (p.id === "free"
              ? "Get started free"
              : p.id === "enterprise"
                ? "Talk to sales"
                : "Get started"),
          features: pickFeatures(p.features, d.features),
        };
      });
  }

  const starterMonthly = fallback.monthly_list_price_ngn;
  const starterFirstMonth = fallback.first_month_price_ngn ?? 0;
  const starterYearly = fallback.yearly_price_ngn ?? starterMonthly * 10;
  const growthMonthly = fallback.growth_monthly_price_ngn ?? 99_900;

  return [
    {
      id: "free",
      name: "Free",
      tagline: "For teams that explore SecureGraph with no card",
      heroMetric: "500",
      heroUnit: "one-time AI credits",
      monthly_ngn: 0,
      first_month_ngn: 0,
      yearly_note: "No card required",
      cta: "Get started free",
      features: freeFeatures,
    },
    {
      id: "starter",
      name: "Starter",
      tagline: "Assess like an attacker: VAPT with verified findings",
      heroMetric: "5,000",
      heroUnit: "AI credits per month and a 5,000 allotment",
      monthly_ngn: starterMonthly,
      first_month_ngn: starterFirstMonth,
      yearly_price_ngn: starterYearly,
      yearly_note: yearsNote(starterMonthly),
      cta: "Get started",
      features: starterFeatures,
    },
    {
      id: "growth",
      name: "Growth",
      tagline: "Keep testing: continuous security every week",
      heroMetric: "20,000",
      heroUnit: "AI credits per month and a 20,000 allotment",
      monthly_ngn: growthMonthly,
      yearly_price_ngn: growthMonthly * 10,
      yearly_note: yearsNote(growthMonthly),
      highlighted: true,
      badge: "Most popular",
      cta: "Get started",
      features: growthFeatures,
    },
    {
      id: "enterprise",
      name: "Enterprise",
      tagline: "For platforms and regulated organizations that operate at scale",
      heroMetric: "Custom",
      heroUnit: "AI credits and volume",
      monthly_ngn: null,
      cta: "Talk to sales",
      features: enterpriseFeatures,
    },
  ];
}

export { engagementOffers, yearlySavePercent };

export const pricingFootnote =
  "Prices are in Nigerian Naira (NGN) for each company each month. SecureGraph billing updates them live. You pay 10× the monthly price for a full year. AI work uses credits. SecureGraph draws from the allowance first, then the allotment, then top-ups. SecureGraph never bills you to view, assign or export results. Enterprise uses a custom quote.";

const CACHE_TTL_MS = 2 * 60_000;
let _cache: { tiers: PricingTier[]; ts: number } | null = null;

export async function loadPricing(force = false): Promise<PricingTier[]> {
  const now = Date.now();
  if (!force && _cache && now - _cache.ts < CACHE_TTL_MS) return _cache.tiers;

  let tiers: PricingTier[];
  try {
    if (!API_BASE) throw new Error("no API base");
    // Prefer plans catalog when available; fall back to legacy /billing/pricing.
    let data: BillingPricingResponse | null = null;
    try {
      const plansRes = await fetch(`${API_BASE}/billing/plans`, { cache: "no-store" });
      if (plansRes.ok) {
        const plansJson = await plansRes.json();
        const list = Array.isArray(plansJson) ? plansJson : plansJson?.plans;
        if (Array.isArray(list) && list.length) {
          data = {
            monthly_list_price_ngn: 49_900,
            growth_monthly_price_ngn: 99_900,
            plans: list.map(
              (p: {
                key?: string;
                id?: string;
                name?: string;
                list_price_ngn?: number | null;
                features?: string[];
              }) => ({
                id: String(p.key ?? p.id ?? ""),
                name: p.name,
                monthly_ngn: p.list_price_ngn ?? null,
                yearly_price_ngn:
                  p.list_price_ngn != null && p.list_price_ngn > 0
                    ? p.list_price_ngn * 10
                    : undefined,
                features: p.features,
              }),
            ),
          };
        }
      }
    } catch {
      /* try legacy */
    }
    if (!data) {
      const res = await fetch(`${API_BASE}/billing/pricing`, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      data = (await res.json()) as BillingPricingResponse;
    }
    tiers = buildPricingTiers(data);
  } catch {
    tiers = buildPricingTiers(null);
  }
  _cache = { tiers, ts: now };
  return tiers;
}
