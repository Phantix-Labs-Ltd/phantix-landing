import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Database, Eye, EyeOff, CheckCircle2, ShieldCheck, KeyRound, Timer,
  FileCheck, Users, Sparkles, Scale, CalendarClock,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import PrivacyVideo from "@/components/PrivacyVideo";

/*
 * /trust — the full privacy & security model.
 *
 * The homepage states the boundary in one section; this page is where a buyer's
 * security reviewer can actually check it. Content tracks
 * docs/06-privacy-and-trust.md — including what is still maturing.
 */

const BOUNDARY = [
  {
    icon: <Eye size={20} />,
    title: "SecureGraph platform",
    tone: "neutral" as const,
    points: [
      "Organization, users and roles",
      "Billing and entitlements",
      "Dual-control and audit metadata",
      "Tooling catalog and orchestration",
    ],
  },
  {
    icon: <Database size={20} />,
    title: "Your security database",
    tone: "gold" as const,
    points: [
      "Assets and inventory",
      "Scan results and findings",
      "Risks and treatments",
      "Compliance evidence and report source data",
    ],
  },
  {
    icon: <EyeOff size={20} />,
    title: "Never touched",
    tone: "critical" as const,
    points: [
      "Production ERP and CRM rows",
      "Customer PII datasets",
      "Application table contents",
      "Anything outside the scope you authorize",
    ],
  },
];

const PRINCIPLES = [
  {
    icon: KeyRound,
    title: "Least privilege",
    body: "Integrations request only the access they need. The GitHub App reads repository contents, and it never writes to them.",
  },
  {
    icon: Timer,
    title: "No long-lived secrets",
    body: "The GitHub App uses short-lived installation tokens. Personal access tokens are legacy, not the default path.",
  },
  {
    icon: ShieldCheck,
    title: "Ephemeral analysis",
    body: "Repository analysis clones into temporary workspaces, and SecureGraph destroys those workspaces afterwards. The AI sees findings, but it does not see your full source tree.",
  },
  {
    icon: FileCheck,
    title: "Verification before reputation",
    body: "We never present unverified noise as confirmed executive risk. Heuristic probes stay in an appendix.",
  },
  {
    icon: Users,
    title: "Dual control",
    body: "High-impact actions can require 2 people: an initiator and a separate authorizer.",
  },
  {
    icon: Sparkles,
    title: "AI data care",
    body: "Raw tenant security content isn't shipped to external models by default. SecureGraph prefers local and minimized paths, and logging and approval apply where escalation is necessary.",
  },
];

const REVIEWER_QUESTIONS = [
  "Ask to see the privacy model. The boundary diagram on this page shows it.",
  "Ask how reports treat unverified findings.",
  "Ask who can run sensitive tests. Ask whether SecureGraph enforces approvals.",
  "Ask where backups of your security database live: with you or with your infrastructure provider.",
];

export default function Trust() {
  return (
    <PageShell>
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mx-auto mt-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <ShieldCheck size={13} /> Trust and security
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Your security data stays yours
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">
            SecureGraph runs the orchestration, identity, billing and tooling. The record of your posture
            lives in a dedicated database that you control. That record holds your assets, scans, findings,
            risks and investigation detail. It is not a shared pile of everyone's vulnerabilities.
          </p>
        </motion.div>
      </Section>

      {/* The boundary */}
      <Section className="relative pb-20">
        <GlowBloom className="-left-32 top-1/4 h-[420px] w-[420px]" tone="gold" />
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div {...fadeUp}>
            <p className="eyebrow text-gold-400">The boundary</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
              Two databases, one clear line
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Data flows one way: into the database you own. SecureGraph reads what it needs to run a scan,
              and it writes the result back to your side of the line.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }}>
            <PrivacyVideo />
          </motion.div>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-3">
          {BOUNDARY.map((col, i) => (
            <motion.div
              key={col.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.08 }}
              className={`card relative overflow-hidden p-6 ${col.tone === "gold" ? "border-gold-400/30 shadow-glow" : ""}`}
            >
              <span
                className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                  col.tone === "gold"
                    ? "bg-gold-400/15 text-gold-400"
                    : col.tone === "critical"
                      ? "bg-severity-critical/[0.12] text-severity-critical"
                      : "bg-phantix-700/50 text-slate-300"
                }`}
              >
                {col.icon}
              </span>
              <h3 className="mt-4 font-display text-lg font-semibold text-white">{col.title}</h3>
              <ul className="mt-4 space-y-2.5">
                {col.points.map((p) => (
                  <li key={p} className="flex items-start gap-2.5 text-[13.5px] leading-6 text-slate-300">
                    <CheckCircle2
                      size={15}
                      className={`mt-1 shrink-0 ${col.tone === "critical" ? "text-severity-critical/70" : "text-emerald-400"}`}
                    />
                    {p}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* Principles */}
      <Section className="pb-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold-400">Principles</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
            What the architecture commits to
          </h2>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {PRINCIPLES.map((p, i) => {
            const Icon = p.icon;
            return (
              <motion.div
                key={p.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="card-edge card-lift p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">{p.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-500">{p.body}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      {/* Reviewer questions + compliance posture */}
      <Section className="pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp} className="card p-8">
            <p className="eyebrow text-gold-400">Evaluating us</p>
            <h3 className="mt-3 font-display text-xl font-semibold text-white">
              Questions worth asking, and our answers
            </h3>
            <ul className="mt-5 space-y-3">
              {REVIEWER_QUESTIONS.map((q) => (
                <li key={q} className="flex items-start gap-3 text-[14px] leading-6 text-slate-300">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-gold-400" />
                  {q}
                </li>
              ))}
            </ul>
            <p className="mt-6 text-[13px] leading-6 text-slate-500">
              We answer plainly, and that answer includes the parts that are still maturing.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="card p-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Scale size={18} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">Compliance posture</h3>
            <p className="mt-3 text-[14px] leading-7 text-slate-400">
              SecureGraph helps you map and evidence controls across ISO-, PCI- and SOC 2-oriented packs as they
              are available. It also keeps an append-only audit trail that you can export.
            </p>
            <p className="mt-4 text-[14px] leading-7 text-slate-400">
              It is a platform for running your program. It is not a substitute for certification. We help
              you build the case. Auditors still audit. We designed the architecture with privacy obligations
              in mind, such as Nigeria's NDPA.
            </p>
            <div className="mt-6 rounded-lg border border-phantix-700/50 bg-phantix-950/50 px-4 py-3">
              <p className="text-[13px] leading-6 text-slate-400">
                <span className="font-semibold text-slate-200">Authorized testing only.</span> You define
                scope, and you are responsible for holding the rights to test the targets you connect.
                SecureGraph provides the controls, and you provide the authorization.
              </p>
            </div>
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
            Bring your security reviewer
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            We will show the data boundary, the approval gates and the audit trail in detail. We use the
            live product, not a slide.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/demo" className="btn-primary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Request a live demo
            </Link>
            <a href="/privacy" className="btn-secondary !px-7 !py-3 !text-[15px]">
              Read the privacy notice
            </a>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}
