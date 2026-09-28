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
    street: string;
    city: string;
    region: string;
    country: string;
    postalCode?: string;
  };
  contactEmail: string;
  contactPhone: string;
  /** Company social pages (active + public). */
  linkedin: string;
  crunchbase: string;
  github: string;
  x: string;
}

export const COMPANY: CompanyProfile = {
  legalName: "Phantix Security Solutions",
  displayName: "Phantix Security Solutions",
  productName: "SecureGraph",
  tagline: "Protect. Prevent. Perform.",
  founded: "",
  legalForm: "",
  rcNumber: "",
  address: {
    street: "",
    city: "",
    region: "",
    country: "Nigeria",
  },
  contactEmail: "privacy@phantixlabs.com",
  contactPhone: "",
  linkedin: "",
  crunchbase: "",
  github: "",
  x: "",
};

// Leadership. Add one entry per founder / core-team member. Example shape:
//
//   {
//     name: "Ada Okonkwo",
//     role: "Founder & Chief Executive",
//     bio: "Leads product and security engineering. Previously …",
//     linkedin: "https://www.linkedin.com/in/ada-okonkwo",
//   },
//
export const TEAM: TeamMember[] = [];

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

export function initials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase() ?? "")
    .join("");
}
