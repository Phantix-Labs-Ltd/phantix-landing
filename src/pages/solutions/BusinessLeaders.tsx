import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Presentation, Eye, FileCheck, Scale, Database, Users, TrendingUp, CalendarClock, ArrowRight,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import { PLATFORM_REGISTER_URL } from "@/lib/links";

const OUTCOMES = [
  { icon: Eye, title: "Visibility", body: "A current inventory of the domains, apps, APIs, and critical systems in scope." },
  { icon: FileCheck, title: "Credible findings", body: "Findings that passed verification. This is not a raw dump of scanner output with your logo on the cover." },
  { icon: TrendingUp, title: "Business impact", body: "Every reportable finding states what is at stake. It is not only a severity label that an executive cannot act on." },
  { icon: Presentation, title: "Board-ready packages", body: "PDF and structured reports for leadership review. Every report type and format is free on every plan." },
  { icon: Users, title: "Governance", body: "Sensitive actions can require dual control. No single person can run an unreviewed high-risk test." },
  { icon: Database, title: "Data control", body: "Findings and assets live in your own dedicated security database. They leave with you if you go." },
];

const QUESTIONS = [
  {
    q: "Will this expose our customer data?",
    a: "No. Security evidence lives in a dedicated database that you control. That evidence includes assets, scans, findings, and risks. SecureGraph manages tenancy, identity, billing, and orchestration. Your production business systems are not a test environment. You define scope, and nothing runs outside it.",
  },
  {
    q: "How do I know the report is real?",
    a: "Reports for clients emphasize verified findings. Heuristic noise is held back or listed separately for transparency. We do not mix it into the executive narrative as though every line were confirmed.",
  },
  {
    q: "What do Starter and Growth actually buy?",
    a: "Starter costs ₦49,900/mo. Starter includes full vulnerability assessment and penetration testing with verified findings, remediation guidance, and board-ready output. Growth costs ₦99,900/mo. Growth adds tests that run on a repeating schedule, plus continuous pull request review. It also adds deeper cloud, Kubernetes, compliance, and SOC options when you turn them on. Free is the limited entry surface. Free includes inventory and light hygiene, and it is not a substitute for Starter. Engagements cover human-led work.",
  },
  {
    q: "Can we start without a project commitment?",
    a: "Yes. Free lets you start safely. Inventory a small scope and run light checks. Move to Starter when you need real VAPT and verified reports. Move to Growth when you need continuous coverage. Engagements are optional.",
  },
];

export default function BusinessLeaders() {
  return (
    <PageShell>
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mx-auto mt-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <Presentation size={13} /> For business leaders
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            You do not need another dashboard. You need real tests and proof.
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">
            Run vulnerability assessment and penetration testing. Keep tests current when the business
            needs continuous coverage. Fix what matters, and show directors evidence that stands up to a
            second question. You can map frameworks when you need it. It is not the reason to buy.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link to="/demo" className="btn-primary btn-shine !px-6 !py-3 !text-base">
              <CalendarClock size={16} /> Request a demo
            </Link>
            <Link to="/pricing" className="btn-secondary !px-6 !py-3 !text-base">
              See pricing
            </Link>
          </div>
        </motion.div>
      </Section>

      <Section className="relative pb-20">
        <GlowBloom className="right-[-10%] top-0 h-[380px] w-[380px]" tone="gold" />
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold-400">Outcomes</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
            What you should expect to get
          </h2>
        </motion.div>
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OUTCOMES.map((o, i) => {
            const Icon = o.icon;
            return (
              <motion.div
                key={o.title}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="card-edge card-lift p-6"
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                  <Icon size={18} />
                </span>
                <h3 className="mt-4 font-display text-base font-semibold text-white">{o.title}</h3>
                <p className="mt-2 text-[13px] leading-6 text-slate-500">{o.body}</p>
              </motion.div>
            );
          })}
        </div>
      </Section>

      <Section className="pb-20">
        <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
          <p className="eyebrow text-gold-400">Straight answers</p>
          <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
            The four questions we always get
          </h2>
        </motion.div>
        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          {QUESTIONS.map((item, i) => (
            <motion.div
              key={item.q}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.05 }}
              className="card-edge p-6"
            >
              <h3 className="font-display text-[15px] font-semibold text-white">{item.q}</h3>
              <p className="mt-2.5 text-[14px] leading-7 text-slate-400">{item.a}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      <Section className="pb-20">
        <motion.div {...fadeUp} className="mx-auto max-w-3xl">
          <div className="card border-gold-400/25 p-8">
            <p className="eyebrow text-gold-400">How to describe it in a meeting</p>
            <blockquote className="mt-4 border-l-2 border-gold-400/60 pl-5 font-display text-lg leading-8 text-slate-200">
              "We run a Command Centre for our security exposure. Assets and findings stay in our own
              security database. Scans and VAPT produce verified findings with business impact. We package
              those findings for engineers and for the board. Sensitive tests need dual approval. We do not
              hand our vulnerability list to a random cloud folder."
            </blockquote>
          </div>
        </motion.div>
      </Section>

      <Section className="pb-28">
        <motion.div
          {...fadeUp}
          className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-14 text-center shadow-glow"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white">
            Start small. Expand when it earns it.
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            Begin on Free with a narrow scope. You can also ask for a guided pilot, and we will define the
            scope with you.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/demo" className="btn-primary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Request a live demo
            </Link>
            <a href={PLATFORM_REGISTER_URL} className="btn-secondary !px-7 !py-3 !text-[15px]">
              Get started free <ArrowRight size={14} />
            </a>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}
