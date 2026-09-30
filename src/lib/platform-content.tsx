import React from "react";
import { Globe, Zap, Smartphone, Cloud } from "lucide-react";

export interface PlatformPage {
  slug: string;
  navLabel: string;
  icon: React.ReactNode;
  eyebrow: string;
  headline: string;
  intro: string;
  points: string[];
  shot: string;
  alt: string;
  footnote?: string;
}

// Testing-domain pages — the depth behind the homepage's Capabilities section.
// Copy grounded in docs/05-product-capabilities.md; nothing here is invented.
export const PLATFORM_PAGES: PlatformPage[] = [
  {
    slug: "web-applications",
    navLabel: "Web applications",
    icon: <Globe size={15} />,
    eyebrow: "Web application security",
    headline: "OWASP Top 10 as the floor, not the ceiling",
    intro:
      "Most scanners stop at a signature match on a known template. SecureGraph runs the full offensive pipeline from subdomain discovery to exploitation. A human reviewer confirms each result before it reaches your report as a finding.",
    points: [
      "Full pipeline: subfinder → httpx → katana → nuclei → sqlmap → gowitness",
      "Authentication tests: brute force, credential stuffing, and session fixation",
      "Injection coverage: SQL, NoSQL, LDAP and command injection",
      "CSRF and clickjacking detection on every app that SecureGraph scans",
      "Subdomain takeover detection as a high-priority module",
    ],
    shot: "vapt",
    alt: "VAPT campaigns view with scoped web application assessments and their progress",
  },
  {
    slug: "apis",
    navLabel: "APIs",
    icon: <Zap size={15} />,
    eyebrow: "API security",
    headline: "Dedicated API security that goes beyond CVE matches",
    intro:
      "An API does not appear in a CVE feed when its authorization logic is wrong. SecureGraph tests the failures that attackers exploit in production. These tests cover broken object-level access, weak tokens, and abuse of rate limits, not only known-signature hits.",
    points: [
      "BOLA and BFLA detection plus auth-bypass checks",
      "JWT validation tests: weak algorithms, expiry bypass, and algorithm confusion",
      "Rate-limit and abuse-case tests",
      "OpenAPI and Postman import turns your spec into scan scope",
      "Business-logic heuristics, not just signature hits",
    ],
    shot: "assets",
    alt: "Attack-surface inventory that lists discovered APIs with domains and subdomains",
  },
  {
    slug: "mobile",
    navLabel: "Mobile",
    icon: <Smartphone size={15} />,
    eyebrow: "Mobile security",
    headline: "APK intelligence from a single upload",
    intro:
      "Upload the build and get an inventory. Static analysis finds hardcoded secrets, exported components, and manifest misconfigurations before the app reaches store review. You do not need a separate mobile test vendor.",
    points: [
      "Static analysis of the manifest, permissions and components",
      "Hardcoded secret and credential-in-file detection",
      "Exported activity and provider checks with evidence",
      "SecureGraph stores results in object storage and keeps inventory rows in your security database",
      "Re-analyze at any time. Findings then create risks automatically",
    ],
    shot: "assets",
    alt: "Attack-surface inventory that lists mobile builds with other discovered assets",
    footnote: "Dynamic and AVD tests go deeper than static analysis. We offer this work as an engagement. See Pricing.",
  },
  {
    slug: "cloud",
    navLabel: "Cloud",
    icon: <Cloud size={15} />,
    eyebrow: "Cloud security",
    headline: "SecureGraph uses only the keys you grant, and nothing wider",
    intro:
      "Cloud posture is an access problem before it is a scanning problem. SecureGraph works inside the credentials and scope you grant. It uses no standing access and no wider reach. Every finding lands in the database you own.",
    points: [
      "Cloud and container packs, enabled when credentials and scope allow",
      "Network exposure: reachable hosts, ports, and services with first-seen and last-seen timelines",
      "TLS posture on public endpoints: legacy protocols, weak ciphers, and certificate issues",
      "CIS-style host targets for the workloads behind the perimeter",
      "Docker-isolated execution with a per-organization concurrency lock",
    ],
    shot: "assets",
    alt: "Attack-surface inventory that lists discovered cloud hosts, ports, and services",
    footnote:
      "Cloud and container packs are an add-on. What runs depends on the credentials and scope you grant. Ask us what is live for your provider today.",
  },
];

export function getPlatformPage(slug: string | undefined): PlatformPage | undefined {
  return PLATFORM_PAGES.find((p) => p.slug === slug);
}
