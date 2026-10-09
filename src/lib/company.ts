// Company + people, in one place.
//
// Google for Startups (and any serious buyer) checks that the founder and core
// team are listed ON the domain and verifiable through active third-party
// profiles. This file is the single source for that: the /company page and the
// footer both read it, and the Organization structured data is built from it.
//
// Fill the empty values with REAL, verifiable data before publishing:
//   • every person must have a public LinkedIn that matches the name here;
//   • COMPANY.linkedin / crunchbase / github must be active, public pages;
//   • rcNumber + address must match the registered legal entity.
// Nothing is invented here on purpose — an empty field renders nothing.

export interface TeamMember {
  /** Full legal name, exactly as it appears on the LinkedIn profile. */
  name: string;
  /** Title, e.g. "Founder & Chief Executive". */
  role: string;
  /** Two sentences: what they do and the background that backs it. */
  bio: string;
  /** Public LinkedIn profile URL — required for verification. */
  linkedin: string;
  /** Optional public contact address for this person. */
  email?: string;
  /** Optional: /team/name.jpg in landing/public. Falls back to an initials tile. */
  photo?: string;
  x?: string;
  github?: string;
}

export interface CompanyProfile {
  /** Registered legal name. */
  legalName: string;
  /** Name shown in the UI. */
  displayName: string;
  productName: string;
  tagline: string;
  /** Year founded, e.g. "2025". */
  founded: string;
  /** Legal form, e.g. "Private Limited Company (Nigeria)". */
  legalForm: string;
  /** CAC / RC registration number, e.g. "RC1234567". */
  rcNumber: string;
  address: {
    /** Street line. Leave empty to publish only the general locality. */
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
  /** Public contact addresses, most-preferred first. */
  contactEmails: string[];
  contactPhone: string;
  /**
   * Public WhatsApp business number in E.164, e.g. "+2348012345678".
   * Leave empty to hide the click-to-chat link; the contact form still pushes a
   * WhatsApp alert to the team through the backend (CONTACT_WHATSAPP_RECIPIENTS).
   */
  whatsapp: string;
  /** Company social pages (active + public). */
  linkedin: string;
  crunchbase: string;
  github: string;
  x: string;
}

export const COMPANY: CompanyProfile = {
  legalName: "Phantix Labs Ltd",
  displayName: "Phantix Labs Ltd",
  productName: "SecureGraph",
  tagline: "Protect. Prevent. Perform.",
  founded: "",
  legalForm: "",
  /** Company registration number, shown below the legal name. */
  rcNumber: "RC - 9904435",
  // Only the general locality is published. The street address is deliberately
  // not stored here — this file ships in a public repo and is rendered in the
  // footer, the /company page and schema.org structured data.
  address: {
    street: "",
    city: "Lagos",
    region: "",
    postalCode: "",
    country: "Nigeria",
  },
  contactEmails: ["contact@phantixlabs.com", "info@phantixlabs.com"],
  contactPhone: "",
  whatsapp: "",
  linkedin: "https://www.linkedin.com/company/securegraph-ai",
  crunchbase: "",
  github: "https://github.com/Phantix-Labs-Ltd",
  x: "https://x.com/SecureGraph_AI",
};

// Leadership. One entry per founder / core-team member.
//
// Every profile has to be verifiable: the name must match the public LinkedIn
// it links to, and the optional X / GitHub pages must be active and public.
export const TEAM: TeamMember[] = [
  {
    name: "Ayomiposi Ayoola",
    role: "Founder & CEO",
    bio: "Security engineer with more than four years in application, API and blockchain security, including internal audits of a real-world-asset protocol. Ayomiposi leads product, engineering and company strategy, and built the SecureGraph platform end to end. B.Tech Cybersecurity, Federal University of Technology, Akure.",
    email: "ayomiposi.ayoola@phantixlabs.com",
    photo: "/team/ayomiposi-ayoola.webp",
    linkedin: "https://www.linkedin.com/in/ayoola-ayomiposi-phantom",
    x: "https://x.com/Phantom_Secure",
    github: "https://github.com/Phantom-Fort",
  },
  {
    name: "Olakojo Olaoluwa",
    role: "Co-Founder",
    bio: "Penetration tester and security researcher since 2018, with OSCP, CRTP and HTB CPTS certifications and four published CVEs. Olakojo shapes the SecureGraph attack methodology, the VAPT campaign design and the verification standard that a finding must meet before it reaches a report.",
    linkedin: "https://www.linkedin.com/in/sci-sec",
    github: "https://github.com/sec-fortress",
  },
];

/** Company pages that are safe to expose (only ones actually set). */
export function companyLinks(): { id: keyof CompanyProfile; label: string; href: string }[] {
  const map: { id: keyof CompanyProfile; label: string }[] = [
    { id: "linkedin", label: "LinkedIn" },
    { id: "crunchbase", label: "Crunchbase" },
    { id: "github", label: "GitHub" },
    { id: "x", label: "X" },
  ];
  return map
    .map(({ id, label }) => ({ id, label, href: String(COMPANY[id] || "") }))
    .filter((l) => l.href.startsWith("http"));
}

/** Third-party URLs for Organization `sameAs` — only the ones that are set. */
export function verificationLinks(): string[] {
  const company = companyLinks().map((l) => l.href);
  const people = TEAM.map((m) => m.linkedin).filter((u) => u.startsWith("http"));
  return Array.from(new Set([...company, ...people]));
}

export function hasRegisteredIdentity(): boolean {
  return Boolean(COMPANY.legalForm || COMPANY.rcNumber || COMPANY.address.street || COMPANY.address.city);
}

/**
 * Click-to-chat URL for the public WhatsApp business number, or null when none
 * is configured. Prefer a prefilled message so the first reply has context.
 */
export function whatsappLink(text?: string): string | null {
  const digits = String(COMPANY.whatsapp || "").replace(/\D/g, "");
  if (!digits) return null;
  return `https://wa.me/${digits}${text ? `?text=${encodeURIComponent(text)}` : ""}`;
}

/**
 * Registered address in postal order, skipping anything unset. Always returns
 * at least the country, so the footer can show a real (if short) line before
 * the full street address is filled in.
 */
export function addressLines(): string[] {
  const a = COMPANY.address;
  const locality = [a.city, a.region].filter(Boolean).join(", ");
  return [a.street, locality, a.country]
    .map((s) => (s || "").trim())
    .filter(Boolean);
}

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
