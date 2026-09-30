import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Code2, CheckCircle2, XCircle, CalendarClock, BookOpen } from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import { APP_DOCS_URL } from "@/lib/links";

/*
 * /solutions/developers — public API orientation.
 *
 * The locked product decision (docs/10): the ONLY public API payment plan is AI
 * Agent access. Everything else stays a Platform product surface. This page must
 * not imply a general "pay for the whole API" SKU.
 */

const INCLUDED = [
  "Paid access to the SecureGraph AI Agent",
  "Domain agents: SOC, GRC, VAPT, threat intel, asset, chief",
  "Invoke, poll runs, skills, approvals, repo-analysis assist",
  "Agent authentication through an org token or a documented agent service token",
];

const NOT_INCLUDED = [
  "Full platform automation of every engine as a standalone API product",
  "Unlimited API access for scans, VAPT, or reports without an app subscription",
  "Staff and admin APIs",
  "Free unauthenticated agent use",
];

const ROUTE_GROUPS = [
  ["/ai/agent/status", "Enabled flag and domain list"],
  ["/ai/agent/domains", "Catalog and policies"],
  ["/ai/agent/domains/{domain}/invoke", "On-demand domain agent"],
  ["/ai/agent/runs", "Start, list, and poll investigations"],
  ["/ai/agent/skills", "Skills list, promote, reinforce"],
  ["/ai/agent/approvals", "Human gates for sensitive actions"],
];

const RULES = [
  "Honor 402. There is no agent access without entitlement.",
  "Poll async runs. A run returns an analysis_id and does not block.",
  "Agents work from engine evidence. They never synthesize findings on the client.",
  "Ground truth stays in SecureGraph. Agents orchestrate, and they do not replace the security database.",
];

const SAMPLE = `# List the domain agents available to your org
curl -s -H "Authorization: Bearer $TOKEN" \\
  "$API/api/v1/ai/agent/domains"

# Invoke the VAPT specialist against a campaign
curl -s -H "Authorization: Bearer $TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{"objective":"Write up verified findings","campaign_id":12}' \\
  "$API/api/v1/ai/agent/domains/vapt/invoke"

# Poll the run
curl -s -H "Authorization: Bearer $TOKEN" \\
  "$API/api/v1/ai/agent/runs/{analysis_id}"`;

export default function Developers() {
  return (
    <PageShell>
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mx-auto mt-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <Code2 size={13} /> For developers
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            One public API, and we're specific about which
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">
            The AI Agent is the only public API with a paid plan. Inventory, scans, VAPT, risk,
            compliance, and reports stay Platform product surfaces. We prefer to say that plainly. You
            should not discover it after you integrate.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <a href={APP_DOCS_URL} className="btn-primary btn-shine !px-6 !py-3 !text-base">
              <BookOpen size={16} /> Read the docs
            </a>
            <Link to="/demo" className="btn-secondary !px-6 !py-3 !text-base">
              <CalendarClock size={16} /> Talk to us
            </Link>
          </div>
        </motion.div>
      </Section>

      {/* Scope: in / out */}
      <Section className="relative pb-20">
        <GlowBloom className="right-[-10%] top-0 h-[380px] w-[380px]" tone="gold" />
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          <motion.div {...fadeUp} className="card border-gold-400/30 p-8 shadow-glow">
            <h2 className="font-display text-lg font-semibold text-white">What the public API offers</h2>
            <ul className="mt-5 space-y-3">
              {INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-slate-300">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-400" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="card p-8">
            <h2 className="font-display text-lg font-semibold text-white">What it is not sold as</h2>
            <ul className="mt-5 space-y-3">
              {NOT_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-3 text-[14px] leading-6 text-slate-400">
                  <XCircle size={15} className="mt-1 shrink-0 text-severity-critical/70" />
                  {item}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* First calls */}
      <Section className="pb-20">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1fr_1.2fr]">
          <motion.div {...fadeUp}>
            <p className="eyebrow text-gold-400">First calls</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
              Invoke, then poll
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Runs are asynchronous. An invoke returns an
              <code className="rounded bg-phantix-800/80 px-1.5 py-0.5 font-mono text-[12.5px] text-gold-300">analysis_id</code>{" "}
              that you poll. It is not an HTTP call that you hold open. Expect a{" "}
              <code className="rounded bg-phantix-800/80 px-1.5 py-0.5 font-mono text-[12.5px] text-gold-300">402</code>{" "}
              when the organization lacks AI Agent entitlement.
            </p>
            <dl className="mt-7 space-y-3">
              {[
                ["Base", "{API_BASE}/api/v1"],
                ["Public agent surface", "/api/v1/ai/agent/*"],
                ["Domains", "soc · grc · vapt · ti · asset · cross"],
              ].map(([k, v]) => (
                <div key={k} className="flex flex-wrap items-baseline gap-x-3 border-b border-phantix-800 pb-2.5">
                  <dt className="text-[13px] text-slate-500">{k}</dt>
                  <dd className="font-mono text-[12.5px] text-slate-300">{v}</dd>
                </div>
              ))}
            </dl>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <pre className="overflow-x-auto rounded-xl border border-phantix-700/50 bg-phantix-950/90 p-5 font-mono text-[12.5px] leading-6 text-slate-300">
              <code>{SAMPLE}</code>
            </pre>
          </motion.div>
        </div>
      </Section>

      {/* Route groups + rules */}
      <Section className="pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp} className="card p-8">
            <p className="eyebrow text-gold-400">Route groups</p>
            <div className="mt-5 space-y-2.5">
              {ROUTE_GROUPS.map(([route, purpose]) => (
                <div key={route} className="border-b border-phantix-800 pb-2.5 last:border-0">
                  <p className="font-mono text-[12.5px] text-gold-300">{route}</p>
                  <p className="mt-0.5 text-[13px] text-slate-500">{purpose}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="card p-8">
            <p className="eyebrow text-gold-400">Design rules</p>
            <ul className="mt-5 space-y-3.5">
              {RULES.map((r) => (
                <li key={r} className="flex items-start gap-3 text-[14px] leading-6 text-slate-300">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-gold-400" />
                  {r}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] leading-6 text-slate-500">
              Teams that use SecureGraph each day do not need any of this. You can invoke the agent from
              the app under the same entitlements.
            </p>
          </motion.div>
        </div>
      </Section>

      <Section className="pb-28">
        <motion.div
          {...fadeUp}
          className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-14 text-center shadow-glow"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white">
            Ready to build on the agent?
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            Talk to us about AI Agent plan pricing and design-partner access. We prefer to define your
            integration with you, not guess at it.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/demo" className="btn-primary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Request a live demo
            </Link>
            <a href={APP_DOCS_URL} className="btn-secondary !px-7 !py-3 !text-[15px]">
              <BookOpen size={16} /> Documentation
            </a>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}
