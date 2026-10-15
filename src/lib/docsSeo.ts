/*
 * Search metadata for /securegraph/docs, in one place.
 *
 * The page (client) and the build-time prerender (scripts/prerender-docs.ts)
 * both read this file, so the title, the FAQ a reader sees and the FAQPage
 * structured data a search or answer engine reads can never drift apart.
 */

export const SITE = "https://phantixlabs.com";
export const DOCS_PATH = "/securegraph/docs";
export const DOCS_URL = `${SITE}${DOCS_PATH}`;

/** Bump when the guide changes materially; shown on the page and in the JSON-LD. */
export const DOCS_UPDATED = "2026-10-15";

export const DOCS_TITLE = "SecureGraph Docs: User & Admin Guide | SecureGraph AI";
export const DOCS_DESCRIPTION =
  "Official SecureGraph (SecureGraph AI) docs: run VAPT and AI pentests, verify findings, generate reports and set up your security database and dual control.";

/** The one-paragraph definition answer engines quote. Also the page's lead. */
export const DOCS_DEFINITION =
  "SecureGraph (also called SecureGraph AI) is a cybersecurity command centre made by Phantix Labs Ltd in Lagos, Nigeria. It combines vulnerability assessment and penetration testing (VAPT), continuous security testing and a governed AI pentest agent. Every result is verified before it reaches a report, and your security data stays in a database that you control.";

export type Faq = { q: string; a: string };

/** Questions people actually search. Answers are complete on their own. */
export const DOCS_FAQ: Faq[] = [
  {
    q: "What is SecureGraph?",
    a: DOCS_DEFINITION,
  },
  {
    q: "Is SecureGraph AI the same as SecureGraph?",
    a: "Yes. SecureGraph AI is the name used on our social channels for the same product: SecureGraph by Phantix Labs Ltd. The product lives at phantixlabs.com and its applications at app.phantixlabs.com, attack.phantixlabs.com, defend.phantixlabs.com, code.phantixlabs.com and platform.phantixlabs.com.",
  },
  {
    q: "Who makes SecureGraph?",
    a: "Phantix Labs Ltd, a cybersecurity company based in Lagos, Nigeria, builds and operates SecureGraph.",
  },
  {
    q: "Do I need to install SecureGraph?",
    a: "No. SecureGraph runs in the browser. You only connect a security database that you control; a database on a private network uses a small connector that reaches out, so nothing needs to reach in.",
  },
  {
    q: "Does the SecureGraph AI invent findings?",
    a: "No. The AI plans and explains. It never invents a finding, changes a risk score or skips an approval. Only findings verified by an independent retest or by a person on your team reach an executive report.",
  },
  {
    q: "Where is my security data stored?",
    a: "Assets, findings, risks and compliance evidence are written only to your own dedicated PostgreSQL security database. SecureGraph keeps your organization, people, billing and audit records.",
  },
  {
    q: "Is there a free plan?",
    a: "Yes. The Free plan includes the asset inventory with fair-use limits, light checks, dual control, MFA, the audit trail and JSON and Markdown exports. No card is needed. Paid plans add VAPT campaigns and the Autonomous Pentest Agent.",
  },
  {
    q: "What does SecureGraph test?",
    a: "Web applications, APIs, mobile apps, cloud accounts, code repositories and pipelines, plus asset discovery and compliance mapping. Each test runs only on assets you have verified and placed in scope.",
  },
];

/** JSON-LD graph: the article, the product it documents, the breadcrumb and the FAQ. */
export function docsJsonLd(): Record<string, unknown>[] {
  const org = { "@type": "Organization", "@id": `${SITE}/#organization`, name: "Phantix Labs Ltd", url: `${SITE}/` };
  return [
    {
      "@type": "TechArticle",
      "@id": `${DOCS_URL}#article`,
      headline: "SecureGraph Documentation: User Guide & Admin Guide",
      description: DOCS_DESCRIPTION,
      url: DOCS_URL,
      inLanguage: "en",
      dateModified: DOCS_UPDATED,
      author: org,
      publisher: org,
      about: { "@id": `${SITE}/#product` },
      mainEntityOfPage: DOCS_URL,
    },
    {
      "@type": "SoftwareApplication",
      // Same entity as the homepage's product, so search engines merge the two.
      "@id": `${SITE}/#product`,
      name: "SecureGraph Command Centre",
      alternateName: ["SecureGraph", "SecureGraph AI", "SecureGraph by Phantix Labs"],
      applicationCategory: "SecurityApplication",
      operatingSystem: "Web",
      url: "https://app.phantixlabs.com",
      description: DOCS_DEFINITION,
      publisher: org,
      offers: { "@type": "Offer", price: "0", priceCurrency: "NGN", description: "Free plan available" },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "SecureGraph", item: `${SITE}/` },
        { "@type": "ListItem", position: 2, name: "Documentation", item: DOCS_URL },
      ],
    },
    {
      "@type": "FAQPage",
      "@id": `${DOCS_URL}#faq`,
      mainEntity: DOCS_FAQ.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];
}
