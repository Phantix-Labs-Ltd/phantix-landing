import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { MotionConfig } from "framer-motion";
import { bootstrapTheme } from "./lib/theme";
import { initAnalytics } from "./lib/analytics";
import { applyOrganizationStructuredData } from "./lib/structuredData";
// Geist + Geist Mono — self-hosted variable woff2, matching the Command Centre.
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "./index.css";

bootstrapTheme();
initAnalytics();
// Enrich the static Organization JSON-LD with the company's verifiable links,
// founder and address (see lib/company.ts) — no-op until those are filled in.
applyOrganizationStructuredData();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* reducedMotion="user" drops transform/layout animation for anyone who
        asked the OS for calmer motion; quick opacity fades still carry the
        reveal so content never snaps in (Learn UI — Performance & reduced
        motion). */}
    <MotionConfig reducedMotion="user">
      <App />
    </MotionConfig>
  </React.StrictMode>,
);
