import React from "react";
import { Nav, Footer } from "@/components/chrome";
import Hero from "@/components/Hero";
import {
  Capabilities,
  PrivacyModel,
  HowItWorks,
  VerificationGate,
  WhyWeBuilt,
  Applications,
} from "@/components/sections-v3";
import { Pricing, FinalCTA } from "@/components/Pricing";
import { FAQ } from "@/components/FAQ";

// ~170 KB of inlined integration logos, seven sections below the fold: they
// load after first paint, into a placeholder of the same height.
const IntegrationsMarquee = React.lazy(() => import("@/components/IntegrationsMarquee"));

/*
 * Landing — a single conversion funnel.
 *
 * One primary action everywhere on this page: Get started free (Platform
 * register). "Book a demo" is the only secondary action and it opens in place,
 * as an accelerator for teams that want a guided walkthrough, never a gate in
 * front of signup. Enterprise buyers reach sales from the pricing card. There
 * is no sign-in anywhere on the page, and the nav is the focused variant:
 * Platform and Solutions menus, a few on-page anchors and the primary button.
 *
 * Written for the decision-maker who owns security but isn't a specialist, and
 * ordered problem → what you get → proof → trust → how to start → price → close.
 *
 * Retired from this page (components kept for other routes or future use):
 * Marquee (sector list said nothing a buyer could act on), Principles (merged
 * into PrivacyModel's argument), PentestAgent, Lifecycle, Coverage and
 * PlatformTeaser (five sections restating Capabilities), SandboxSection and
 * FreeScanSection (competing offers that split the funnel), and the pricing
 * engagement band (still on /pricing).
 */

export default function Landing() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-phantix-950">
      {/* Ambient page wash — gold/neutral, matching the product palette. */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
        <div className="absolute -top-40 left-1/2 h-[560px] w-[900px] -translate-x-1/2 rounded-full bg-gold-400/[0.07] blur-[140px]" />
        <div className="absolute right-[-200px] top-[45%] h-[420px] w-[420px] rounded-full bg-phantix-500/10 blur-[120px]" />
      </div>

      <Nav focused />
      <main className="relative">
        {/* 1 — Hook: what it is, Get started free / Book a demo */}
        <Hero />

        {/* 2 — The problem, in the buyer's terms: security is one person deep */}
        <WhyWeBuilt />

        {/* 3 — What you get: Assess → Fix → Prove, one section */}
        <Capabilities />

        {/* 4 — Proof on the biggest pain point: false positives */}
        <VerificationGate />

        {/* 5 — Start small, grow into it: Attack first, Defend and Code later */}
        <Applications />

        {/* 6 — Trust: your security data stays in your database */}
        <PrivacyModel />

        {/* 7 — Objection: "will it work with our tools?" */}
        <React.Suspense
          fallback={<section aria-hidden className="relative min-h-[360px] border-y border-phantix-800/60 py-10" />}
        >
          <IntegrationsMarquee />
        </React.Suspense>

        {/* 8 — How to start, ending on the primary CTA */}
        <HowItWorks />

        {/* 9 — Pricing: start free, upgrade, or talk to sales for Enterprise */}
        <Pricing showEngagements={false} />

        {/* 10 — Remaining objections */}
        <FAQ />

        {/* 11 — Close: the same two actions as the hero */}
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}
