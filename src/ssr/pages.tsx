// Build-time render of the marketing routes, loaded by scripts/prerender-routes.ts.
// Never imported by the browser bundle.
//
// The pages are imported directly, not through App's React.lazy: renderToString
// does not wait for a lazy chunk and would emit only the Suspense fallback. The
// route table repeats App's for the paths in ROUTE_SEO; useParams-driven pages
// (/platform/:slug) need the same pattern to read their slug.
import React from "react";
import { renderToString } from "react-dom/server";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { MotionConfig } from "framer-motion";
import LegalPage from "@/pages/Legal";
import type { LegalDocument } from "@/lib/legal";
import { API_BASE, LANDING_URL } from "@/lib/config";
import ProductDemo from "@/pages/ProductDemo";
import PlatformCapability from "@/pages/PlatformCapability";
import PricingPage from "@/pages/PricingPage";
import Trust from "@/pages/Trust";
import Company from "@/pages/Company";
import BusinessLeaders from "@/pages/solutions/BusinessLeaders";
import SecurityTeams from "@/pages/solutions/SecurityTeams";
import Developers from "@/pages/solutions/Developers";
import AutonomousPentest from "@/pages/AutonomousPentest";
import Contact from "@/pages/Contact";
import AiInfo from "@/pages/AiInfo";
import Cookies from "@/pages/Cookies";

type LegalKey = "terms" | "aup" | "privacy";
const legal: Partial<Record<LegalKey, LegalDocument | null>> = {};

/**
 * Fetch what the pages otherwise load after mount, once, before any render.
 * The legal pages read their text from the public API; without it their
 * prerender is only the page frame. A document that cannot be fetched stays
 * null and that page renders its loading state, as in the browser.
 */
export async function loadData(): Promise<void> {
  await Promise.all(
    (["terms", "aup", "privacy"] as const).map(async (key) => {
      try {
        const res = await fetch(`${LANDING_URL}${API_BASE}/organizations/${key}`, {
          signal: AbortSignal.timeout(10_000),
        });
        legal[key] = res.ok ? ((await res.json()) as LegalDocument) : null;
      } catch {
        legal[key] = null;
      }
    }),
  );
}

/** Render one route's page to HTML. Throws if the page cannot render on the server. */
export function render(path: string): string {
  return renderToString(
    <MemoryRouter initialEntries={[path]}>
      <MotionConfig reducedMotion="user">
        <Routes>
          <Route path="/demo" element={<ProductDemo />} />
          <Route path="/platform/autonomous-pentesting" element={<AutonomousPentest />} />
          <Route path="/platform/:slug" element={<PlatformCapability />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/ai-info" element={<AiInfo />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/company" element={<Company />} />
          <Route path="/solutions/business-leaders" element={<BusinessLeaders />} />
          <Route path="/solutions/security-teams" element={<SecurityTeams />} />
          <Route path="/solutions/developers" element={<Developers />} />
          <Route path="/terms" element={<LegalPage docKey="terms" initialDoc={legal.terms} />} />
          <Route path="/aup" element={<LegalPage docKey="aup" initialDoc={legal.aup} />} />
          <Route path="/privacy" element={<LegalPage docKey="privacy" initialDoc={legal.privacy} />} />
          <Route path="/cookies" element={<Cookies />} />
        </Routes>
      </MotionConfig>
    </MemoryRouter>,
  );
}
