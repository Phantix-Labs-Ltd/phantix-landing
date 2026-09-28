// Organization structured data, kept in step with lib/company.ts.
//
// index.html carries a static JSON-LD @graph whose Organization node ships with
// `sameAs: []` — correct until the company's third-party pages and team profiles
// exist. This merges the real values in at runtime (Google executes JS, so the
// rendered graph is what it reads), from the same single source the /company
// page and footer use. Nothing is fabricated: unset fields are left out.
import { COMPANY, TEAM, verificationLinks } from "./company";

const ORG_ID = "https://phantixlabs.com/#organization";

/** The Organization node, containing only the fields that are actually set. */
function organizationPatch(): Record<string, unknown> {
  const patch: Record<string, unknown> = {
    "@type": "Organization",
    "@id": ORG_ID,
    name: COMPANY.legalName,
    url: "https://phantixlabs.com/",
  };
  const sameAs = verificationLinks();
  if (sameAs.length) patch.sameAs = sameAs;
  if (COMPANY.founded) patch.foundingDate = COMPANY.founded;
  if (TEAM.length) {
    patch.founder = TEAM.map((m) => ({
      "@type": "Person",
      name: m.name,
      jobTitle: m.role,
      ...(m.linkedin ? { sameAs: m.linkedin } : {}),
    }));
  }
  if (COMPANY.address.street || COMPANY.address.city) {
    patch.address = {
      "@type": "PostalAddress",
      streetAddress: COMPANY.address.street || undefined,
      addressLocality: COMPANY.address.city || undefined,
      addressRegion: COMPANY.address.region || undefined,
      postalCode: COMPANY.address.postalCode || undefined,
      addressCountry: COMPANY.address.country || undefined,
    };
  }
  if (COMPANY.contactEmail) {
    patch.contactPoint = {
      "@type": "ContactPoint",
      contactType: "customer support",
      email: COMPANY.contactEmail,
    };
  }
  return patch;
}

/** Merge the company values into the existing JSON-LD graph, in place. */
export function applyOrganizationStructuredData(): void {
  if (typeof document === "undefined") return;
  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]'),
  );
  const script =
    scripts.find((s) => (s.textContent || "").includes(ORG_ID)) ?? scripts[0];
  if (!script) return;
  try {
    const data = JSON.parse(script.textContent || "{}") as Record<string, unknown>;
    const graph = Array.isArray(data["@graph"]) ? (data["@graph"] as Record<string, unknown>[]) : null;
    const patch = organizationPatch();
    if (graph) {
      const idx = graph.findIndex(
        (n) => n && (n["@id"] === ORG_ID || n["@type"] === "Organization"),
      );
      if (idx >= 0) graph[idx] = { ...graph[idx], ...patch };
      else graph.push(patch);
      data["@graph"] = graph;
    } else if (data["@type"] === "Organization") {
      Object.assign(data, patch);
    } else {
      return;
    }
    script.textContent = JSON.stringify(data);
  } catch {
    // A malformed graph must not break the page — leave the static one as-is.
  }
}
