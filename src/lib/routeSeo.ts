// Title, description and heading for every indexable route, in one place.
//
// Two readers: <PageMeta> sets them in the browser, and
// scripts/prerender-routes.ts bakes them into dist/<route>/index.html so a
// crawler that reads the raw HTML sees each page's own title and canonical URL
// instead of the home page's. Distinct titles and a crawlable link list are
// what Google builds sitelinks from (the indented links under a brand result).
//
// Plain data only: vite.config.ts imports this through the prerender plugin, so
// it must not pull in JSX or browser code. `heading` repeats the page's <h1>;
// change both together. The home page's head lives in index.html, and
// /securegraph/docs has its own module (lib/docsSeo.ts).
//
// Every title ends "| SecureGraph" and stays within 60 characters, so Google
// shows it whole and reads one product name across the site. The home page and
// /company carry "Phantix Labs" as well, to tie the company to the product.

export interface RouteSeo {
  /** Full document title. */
  title: string;
  description: string;
  /** The page's visible <h1>. */
  heading: string;
  /** Short link text for the crawler link list and breadcrumbs. */
  label: string;
}

export const SITE_URL = "https://phantixlabs.com";

/**
 * The home page. Its <title> and description live in index.html; this is the
 * body that scripts/prerender-home.ts bakes into dist/index.html. `heading` and
 * `summary` repeat the hero's <h1> and lead paragraph (components/Hero.tsx);
 * change both together.
 */
export const HOME_SEO = {
  heading: "Find real weaknesses. Fix what matters. Keep testing.",
  summary:
    "SecureGraph does vulnerability assessment and penetration testing for lean teams. It keeps the tests on a schedule and helps you fix what matters and show the result. The findings you work from are verified. Your security data stays in a database you control.",
};

export const ROUTE_SEO = {
  "/pricing": {
    title: "Pricing: Free, Starter, Growth and Enterprise | SecureGraph",
    description:
      "SecureGraph prices for vulnerability assessment and continuous security. Free helps you find your exposure. Starter runs VAPT with verified findings. Growth keeps tests continuous. We quote Enterprise on request.",
    heading: "Simple pricing for assessment and continuous security",
    label: "Pricing",
  },
  "/demo": {
    title: "Product Tour and Demo | SecureGraph",
    description:
      "See SecureGraph run a real assessment. Every screen in the tour shows the real Command Centre, not a mockup. Book a live guided demo on your own stack.",
    heading: "See SecureGraph run a real assessment",
    label: "Product tour",
  },
  "/trust": {
    title: "Trust and Data Privacy | SecureGraph",
    description:
      "SecureGraph keeps the record of your security posture in a dedicated database that you control: assets, scans, findings and risks. Read the data boundary, approval gates and audit trail.",
    heading: "Your security data stays yours",
    label: "Trust",
  },
  "/company": {
    title: "Phantix Labs Ltd: Company and Team | SecureGraph",
    description:
      "Phantix Labs Ltd builds SecureGraph. Meet the founder and core team, with verifiable LinkedIn and GitHub profiles.",
    heading: "The team behind SecureGraph",
    label: "Company",
  },
  "/platform/autonomous-pentesting": {
    title: "Autonomous Pentest Agent | SecureGraph",
    description:
      "The SecureGraph autonomous pentest agent makes plans for multi-step attacks, connects findings into attack paths, and uses an independent verifier for each result. The AI makes plans. The engines measure. Persons approve each action that changes the state of a system.",
    heading: "An agent that makes the plan for the attack and shows the proof for each finding",
    label: "Autonomous pentest agent",
  },
  "/platform/web-applications": {
    title: "Web Application Penetration Testing | SecureGraph",
    description:
      "SecureGraph runs the full web application pentest pipeline, from subdomain discovery to exploitation. It covers the OWASP Top 10, injection, authentication and subdomain takeover. A reviewer confirms each finding.",
    heading: "OWASP Top 10 as the floor, not the ceiling",
    label: "Web applications",
  },
  "/platform/apis": {
    title: "API Security Testing: BOLA, BFLA and JWT | SecureGraph",
    description:
      "SecureGraph tests the API failures that attackers exploit: broken object-level access, weak JWTs and rate-limit abuse. Import an OpenAPI or Postman spec to set the scan scope.",
    heading: "Dedicated API security that goes beyond CVE matches",
    label: "APIs",
  },
  "/platform/mobile": {
    title: "Mobile App Security and APK Analysis | SecureGraph",
    description:
      "Upload an Android build to SecureGraph. Static analysis finds hardcoded secrets, exported components and manifest misconfigurations before the app reaches store review.",
    heading: "APK intelligence from a single upload",
    label: "Mobile",
  },
  "/platform/cloud": {
    title: "Cloud Security Posture | SecureGraph",
    description:
      "SecureGraph checks cloud and container posture inside the credentials and scope you grant: network exposure, TLS posture and CIS-style host targets. Every finding lands in the database you own.",
    heading: "SecureGraph uses only the keys you grant, and nothing wider",
    label: "Cloud",
  },
  "/solutions/business-leaders": {
    title: "Security Testing for Business Leaders | SecureGraph",
    description:
      "Run vulnerability assessment and penetration testing, keep tests current, fix what matters, and show directors evidence that stands up to a second question.",
    heading: "You do not need another dashboard. You need real tests and proof.",
    label: "For business leaders",
  },
  "/solutions/security-teams": {
    title: "VAPT with Verified Findings for Security Teams | SecureGraph",
    description:
      "Run scoped vulnerability assessment and penetration testing, keep tests continuous on Growth, and only promote what passed verification. No more noise piles from someone else's scanner.",
    heading: "VAPT that ends in verified findings, not another noise pile",
    label: "For security teams",
  },
  "/solutions/developers": {
    title: "AI Agent API for Developers | SecureGraph",
    description:
      "The SecureGraph AI Agent is the public API on paid plans. Read which routes are public, which stay in the Platform, and the design rules behind them.",
    heading: "One public API, and we're specific about which",
    label: "For developers",
  },
  "/contact": {
    title: "Contact Phantix Labs | SecureGraph",
    description:
      "Contact the team that makes SecureGraph by form, email, or WhatsApp. Your message goes to the team immediately. A person answers you, not a ticket robot.",
    heading: "Speak to the persons who make SecureGraph",
    label: "Contact",
  },
  "/ai-info": {
    title: "AI Information Page | SecureGraph",
    description:
      "The official reference on SecureGraph for AI assistants and large language models: the product, the autonomous pentest agent, verification, guardrails, and prices.",
    heading: "The official SecureGraph reference",
    label: "AI information",
  },
  "/privacy": {
    title: "Privacy Notice | SecureGraph",
    description: "How Phantix Labs Ltd collects, uses and protects personal data across the SecureGraph website and platform.",
    heading: "Privacy Notice",
    label: "Privacy",
  },
  "/terms": {
    title: "Terms of Service | SecureGraph",
    description: "The terms that apply when you use SecureGraph, the security platform from Phantix Labs Ltd.",
    heading: "Terms of Service",
    label: "Terms",
  },
  "/aup": {
    title: "Acceptable Use Policy | SecureGraph",
    description: "What you may and may not test with SecureGraph, and the scope and authorization rules every assessment must follow.",
    heading: "Acceptable Use Policy",
    label: "Acceptable use",
  },
  "/cookies": {
    title: "Cookies and Analytics Policy | SecureGraph",
    description: "The cookies and analytics that phantixlabs.com uses, why, and how to change your choice at any time.",
    heading: "Cookies and analytics policy",
    label: "Cookies",
  },
} satisfies Record<string, RouteSeo>;

export type SeoPath = keyof typeof ROUTE_SEO;

/** The <PageMeta> props for a route. */
export function pageSeo(path: SeoPath): { title: string; description: string } {
  const { title, description } = ROUTE_SEO[path];
  return { title, description };
}
