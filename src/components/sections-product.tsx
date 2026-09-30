import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Zap, Smartphone, Network, ShieldCheck, Sparkles, EyeOff, FileText,
  CheckCircle2, Cpu, Boxes, Radar, Crosshair, ShieldAlert, Scale, BellRing,
  ScrollText, Workflow, ArrowRight, Lock, Database,
} from "lucide-react";
import { Section, SectionHeading, fadeUp } from "./Section";
import { engines } from "@/lib/demo-data";
import { cx } from "@/lib/utils";
import { PLATFORM_URL, APP_URL, APP_DOCS_URL } from "@/lib/links";

// ── Capability deep-dive (from the Implementation Manifest) ───────────────────
const capabilityTabs = [
  {
    id: "web",
    label: "Web applications",
    icon: <Globe size={15} />,
    headline: "OWASP Top 10 is the minimum, not the maximum",
    points: [
      "Full pipeline: subfinder → httpx → katana → nuclei → sqlmap → gowitness",
      "Test authentication: brute force, credential stuffing, and session fixation",
      "Inject tests for SQL, NoSQL, LDAP, and command injection",
      "Detect CSRF and clickjacking on every app that you test",
      "Detect subdomain takeover as a high-priority module",
    ],
  },
  {
    id: "api",
    label: "APIs",
    icon: <Zap size={15} />,
    headline: "Dedicated API security that goes beyond CVE matching",
    points: [
      "Detect BOLA and BFLA, and test for auth bypass",
      "Test JWT validation for weak algorithms, expiry bypass, and algorithm confusion",
      "Probe rate limits and abuse cases",
      "Import an OpenAPI or Postman file to turn your spec into test scope",
      "Business-logic heuristics, not only signature matches",
    ],
  },
  {
    id: "mobile",
    label: "Mobile",
    icon: <Smartphone size={15} />,
    headline: "Get APK intelligence from a single upload",
    points: [
      "Analyze the manifest, the permissions, and the components",
      "Detect hardcoded secrets and credentials in files",
      "Check exported activities and providers, with evidence",
      "We store the file in object storage and keep inventory rows in your security database",
      "Analyze the file again at any time. Findings create risks automatically",
    ],
  },
  {
    id: "cloud",
    label: "Cloud",
    icon: <Network size={15} />,
    headline: "Assess the cloud with the keys you grant, and nothing wider",
    points: [
      "Run real Nmap with admin-controlled flags and a port policy",
      "Check TLS posture: legacy protocols, weak ciphers, and certificate problems",
      "Track port and service assets with first-seen and last-seen timelines",
      "Test CIS-style host targets: Windows, Linux, and network devices",
      "Each task runs in an isolated Docker container with one concurrency lock for the organization",
    ],
  },
];

export function Capabilities() {
  const [active, setActive] = useState("web");
  const tab = capabilityTabs.find((t) => t.id === active)!;
  return (
    <Section id="capabilities" className="py-24">
      <motion.div {...fadeUp}>
        <SectionHeading
          kicker="Offensive capability"
          title="You set the scope. The engines run the test."
          body="You define what we test. Every assessment is permissioned by design. Then the tool pipeline goes deep."
        />
      </motion.div>

      <div className="mx-auto mt-12 max-w-4xl">
        <div className="flex flex-wrap justify-center gap-2">
          {capabilityTabs.map((t) => (
            <button
              key={t.id}
              onClick={() => setActive(t.id)}
              className={cx(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-medium transition-all",
                active === t.id
                  ? "border-gold-400/60 bg-gold-400/[0.12] text-gold-300 shadow-glow"
                  : "border-phantix-700/50 text-slate-400 hover:border-phantix-500/50 hover:text-slate-200",
              )}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab.id}
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="card mt-6 p-8"
          >
            <h3 className="font-display text-xl font-semibold text-white">{tab.headline}</h3>
            <ul className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {tab.points.map((p) => (
                <li key={p} className="flex items-start gap-2.5 text-sm leading-6 text-slate-300">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-400" />
                  {p}
                </li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>

        <motion.p {...fadeUp} className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-slate-600">
          <Lock size={12} className="text-gold-400" />
          We guard targets against SSRF. Only http and https are allowed. Private ranges and cloud metadata endpoints are blocked. DNS-rebinding defense is on.
        </motion.p>
      </div>
    </Section>
  );
}

// ── Verification gate ─────────────────────────────────────────────────────────
export function VerificationGate() {
  return (
    <Section className="py-24">
      <motion.div {...fadeUp} className="card relative overflow-hidden p-10 lg:p-14">
        <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-[90px]" />
        <div className="relative grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">False-positive control</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-tight text-white sm:text-4xl">
              If we do not verify it, we do not ship it
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Every test row records a verification state. Risks ignore non-reportable noise.
              Compliance maps verified signals only. Executive reports include{" "}
              <span className="text-slate-200">only findings that an engine or a person verified</span>.
              Heuristic probes stay in an appendix, and never in your severity rollups.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { v: "19", l: "After dedupe", c: "text-phantix-300" },
              { v: "14", l: "After verification", c: "text-emerald-400" },
              { v: "5", l: "Excluded noise", c: "text-severity-critical" },
            ].map((s) => (
              <div key={s.l} className="rounded-2xl border border-phantix-700/50 bg-phantix-950/60 p-5 text-center">
                <p className={`font-display text-4xl font-bold ${s.c}`}>{s.v}</p>
                <p className="mt-1.5 text-[12px] font-medium uppercase tracking-wider text-slate-500">{s.l}</p>
              </div>
            ))}
            <div className="col-span-3 rounded-2xl border border-gold-400/25 bg-gold-400/[0.06] p-4 text-center text-[13px] text-gold-300/90">
              REPORT_REQUIRE_VERIFIED_FINDINGS · the shared classifier enforces this rule across engines
            </div>
          </div>
        </div>
      </motion.div>
    </Section>
  );
}

// ── AI governance ─────────────────────────────────────────────────────────────
export function AIGovernance() {
  const guardrails = [
    "We redact PII before any provider call",
    "We version prompts like code. You can review, activate, and roll back each version",
    "We apply hallucination heuristics and schema validation to each output",
    "We audit every call: prompt version, model, tokens, and cost",
    "The provider layer is abstract. You can swap models without changes to the app",
    "AI pentesting needs an explicit DeepSeek key",
  ];
  return (
    <Section id="ai" className="py-24">
      <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2">
        <motion.div {...fadeUp} className="order-2 lg:order-1">
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {guardrails.map((g, i) => (
              <motion.div
                key={g}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.45, delay: i * 0.06 }}
                className="flex items-start gap-2.5 rounded-xl border border-phantix-700/40 bg-phantix-900/50 p-3.5 text-[12.5px] leading-5 text-slate-300"
              >
                <ShieldCheck size={14} className="mt-0.5 shrink-0 text-gold-400" />
                {g}
              </motion.div>
            ))}
          </div>
        </motion.div>
        <motion.div {...fadeUp} className="order-1 lg:order-2">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gold-400">Governed AI</p>
          <h2 className="mt-3 font-display text-4xl font-bold tracking-tight text-white">
            AI that advises, and <span className="text-gold-300">never decides</span>
          </h2>
          <p className="mt-4 text-[15px] leading-7 text-slate-400">
            The AI Engine writes finding explanations and executive narratives that make reports readable.
            It <span className="text-slate-200">never determines security facts and never scores risk</span>.
            The deterministic engines score risk. Governed, audited, cost-capped models write the prose.
          </p>
          <div className="mt-6 flex flex-wrap gap-2">
            {["finding_explanation", "executive_summary", "consensus (multi-model)"].map((p) => (
              <span key={p} className="chip border-phantix-600/50 bg-phantix-800/60 font-mono text-slate-300">
                <Sparkles size={11} className="text-gold-400" /> {p}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </Section>
  );
}

// ── Engines grid ──────────────────────────────────────────────────────────────
const engineIcons: Record<string, React.ReactNode> = {
  control_plane: <Cpu size={18} />,
  asset_engine: <Boxes size={18} />,
  scanner_engine: <Radar size={18} />,
  vapt_engine: <Crosshair size={18} />,
  risk_engine: <ShieldAlert size={18} />,
  ai_engine: <Sparkles size={18} />,
  compliance_engine: <Scale size={18} />,
  reporting_engine: <FileText size={18} />,
  alert_engine: <BellRing size={18} />,
  audit_engine: <ScrollText size={18} />,
  operations_engine: <Workflow size={18} />,
};

export function EnginesGrid() {
  return (
    <Section id="engines" className="py-24">
      <motion.div {...fadeUp}>
        <SectionHeading
          kicker="Modular monolith"
          title="Eleven engines, one bus"
          body="Every capability is an engine with a clear contract. The engine bus orchestrates them, and the Shared SDK governs them."
        />
      </motion.div>
      <div className="mt-14 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {engines.map((e, i) => (
          <motion.div
            key={e.id}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.09 }}
            className="group flex items-start gap-4 rounded-2xl border border-phantix-700/40 bg-phantix-900/50 p-5 transition-all duration-300 hover:border-phantix-500/60 hover:bg-phantix-800/50"
          >
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-phantix-700/50 text-gold-400 transition-colors group-hover:bg-gold-400/15">
              {engineIcons[e.id] ?? <Cpu size={18} />}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="font-display text-[15px] font-semibold text-slate-100">{e.name}</h3>
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>
              <p className="mt-1 text-[13px] leading-5 text-slate-400">{e.description}</p>
            </div>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}

// ── Surfaces ──────────────────────────────────────────────────────────────────
export function Surfaces() {
  const surfaces = [
    { name: "Org Setup", desc: "Register your organization, accept the privacy terms, verify your email, and complete onboarding. All of this occurs on the management surface.", token: "Company JWT", href: `${PLATFORM_URL}/login` },
    { name: "Platform", desc: "Manage tenant identity, create service keys, assign dual-control roles, and connect your security database.", token: "Company and org-user JWT", href: PLATFORM_URL },
    { name: "Application", desc: "Operator day-to-day work: tests, findings, risks, and reports. Sign in with a login link from your admin. You do not need a company password.", token: "app_session + device", href: APP_URL },
    { name: "Docs", desc: "The full implementation canon: auth realms, module deep dives, and 326 API routes.", token: "Public", href: APP_DOCS_URL },
  ];
  return (
    <Section id="platform" className="py-24">
      <motion.div {...fadeUp}>
        <SectionHeading
          kicker="One platform, two surfaces"
          title="Management and operations, cleanly separated"
          body="Your admin signs in on the Platform with a company JWT. Operators get login links and never touch a company password. Each surface has its own auth realm, storage, and rules."
        />
      </motion.div>
      <div className="mt-14 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {surfaces.map((s, i) => (
          <motion.div
            key={s.name}
            initial={{ opacity: 0, y: 26 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.55, delay: i * 0.1 }}
          >
            <a href={s.href} className="card group block h-full p-6 transition-all duration-300 hover:-translate-y-1 hover:border-gold-400/40 hover:shadow-glow">
              <p className="font-mono text-[12px] uppercase tracking-wider text-slate-500">{s.token}</p>
              <h3 className="mt-2 font-display text-lg font-semibold text-white group-hover:text-gold-300">{s.name}</h3>
              <p className="mt-2 text-[13px] leading-6 text-slate-400">{s.desc}</p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-gold-400 opacity-0 transition-opacity group-hover:opacity-100">
                Open <ArrowRight size={12} />
              </span>
            </a>
          </motion.div>
        ))}
      </div>
    </Section>
  );
}
