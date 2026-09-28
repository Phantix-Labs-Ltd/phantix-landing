import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ArrowUpRight, Building2, CalendarClock, CheckCircle2, Globe, Linkedin,
  Mail, MapPin, ShieldCheck, Users,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import {
  COMPANY, TEAM, companyLinks, hasRegisteredIdentity, initials,
} from "@/lib/company";

/*
 * /company — who is behind SecureGraph.
 *
 * The public face of the legal entity and the people who run it: an About page
 * every buyer's due-diligence pass (and Google for Startups' operational-
 * transparency filter) expects to find on the domain, with verifiable links.
 * Content is data-driven from lib/company.ts — fill that file, not this page.
 */

const COMMITMENTS = [
  "Findings come from engines, then a verifier — we never invent a vulnerability.",
  "Your security records live in a database you control, not a shared pile.",
  "AI explains what the scanners found; it does not replace the evidence.",
  "You define scope and authorization. The platform provides the controls.",
];

const PRODUCT_FACTS = [
  { label: "Product", value: COMPANY.productName },
  { label: "Focus", value: "Vulnerability assessment & penetration testing" },
  { label: "Model", value: "Continuous security, with verified findings" },
  { label: "Data", value: "Stored in the customer's own security database" },
];

export default function Company() {
  const links = companyLinks();
  const registered = hasRegisteredIdentity();
  const contactHref = COMPANY.contactEmail ? `mailto:${COMPANY.contactEmail}` : "/demo";

  return (
    <PageShell>
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mx-auto mt-10 max-w-2xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <Building2 size={13} /> Company
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            The team behind {COMPANY.productName}
          </h1>
          <p className="mt-5 text-[15px] leading-7 text-slate-400">
            {COMPANY.displayName} builds {COMPANY.productName} — vulnerability assessment and
            penetration testing for lean teams, with continuous security and verified findings.
            {" "}{COMPANY.tagline}
          </p>
        </motion.div>
      </Section>

      {/* Why we exist */}
      <Section className="relative pb-20">
        <GlowBloom className="-left-32 top-1/4 h-[420px] w-[420px]" tone="gold" />
        <div className="relative grid grid-cols-1 items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
          <motion.div {...fadeUp}>
            <p className="eyebrow text-gold-400">Why we exist</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
              Security that a one-person team can actually run
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Most organizations are not short of scanners — they are short of people to run them.
              We built {COMPANY.productName} so the engineer or ops lead who also owns security can
              find real weaknesses, keep testing as the surface changes, and prove what was fixed.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              The platform runs the engines security teams run by hand, verifies before it reports,
              and keeps your security records in a database you control.
            </p>
          </motion.div>
          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.1 }} className="card p-7">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-phantix-700/50 text-slate-300">
              <ShieldCheck size={20} />
            </span>
            <h3 className="mt-4 font-display text-lg font-semibold text-white">What we commit to</h3>
            <ul className="mt-4 space-y-2.5">
              {COMMITMENTS.map((c) => (
                <li key={c} className="flex items-start gap-2.5 text-[13.5px] leading-6 text-slate-300">
                  <CheckCircle2 size={15} className="mt-1 shrink-0 text-emerald-400" />
                  {c}
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </Section>

      {/* Leadership — rendered only when real, verifiable people are configured */}
      {TEAM.length > 0 && (
        <Section id="team" className="pb-20">
          <motion.div {...fadeUp} className="mx-auto max-w-2xl text-center">
            <p className="eyebrow text-gold-400">Leadership</p>
            <h2 className="mt-3 font-display text-3xl font-semibold tracking-tight text-white">
              Founder &amp; core team
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              The people accountable for the product and your engagement. Each profile links to a
              public, verifiable professional page.
            </p>
          </motion.div>
          <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {TEAM.map((m, i) => (
              <motion.div
                key={m.name}
                {...fadeUp}
                transition={{ ...fadeUp.transition, delay: (i % 3) * 0.06 }}
                className="card-edge card-lift flex h-full flex-col p-6"
              >
                <div className="flex items-center gap-4">
                  {m.photo ? (
                    <img
                      src={m.photo}
                      alt={m.name}
                      loading="lazy"
                      className="h-14 w-14 shrink-0 rounded-xl border border-phantix-700/50 object-cover"
                    />
                  ) : (
                    <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-gold-400/30 bg-gold-400/10 font-display text-lg font-semibold text-gold-300">
                      {initials(m.name)}
                    </span>
                  )}
                  <div className="min-w-0">
                    <h3 className="truncate font-display text-base font-semibold text-white">{m.name}</h3>
                    <p className="mt-0.5 text-[13px] text-gold-300/90">{m.role}</p>
                  </div>
                </div>
                <p className="mt-4 flex-1 text-[13px] leading-6 text-slate-400">{m.bio}</p>
                <div className="mt-5 flex flex-wrap items-center gap-4 border-t border-phantix-700/40 pt-4">
                  {m.linkedin && (
                    <a
                      href={m.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-300 transition-colors hover:text-gold-200"
                    >
                      <Linkedin size={14} /> LinkedIn <ArrowUpRight size={12} />
                    </a>
                  )}
                  {m.github && (
                    <a
                      href={m.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-200"
                    >
                      GitHub <ArrowUpRight size={12} />
                    </a>
                  )}
                  {m.x && (
                    <a
                      href={m.x}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-200"
                    >
                      X <ArrowUpRight size={12} />
                    </a>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </Section>
      )}

      {/* Company & product facts */}
      <Section className="pb-20">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <motion.div {...fadeUp} className="card p-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Globe size={18} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">The company</h3>
            <dl className="mt-5 space-y-3 text-[14px]">
              <Fact label="Legal name" value={COMPANY.legalName} />
              {COMPANY.legalForm && <Fact label="Legal form" value={COMPANY.legalForm} />}
              {COMPANY.rcNumber && <Fact label="Registration" value={COMPANY.rcNumber} />}
              {COMPANY.founded && <Fact label="Founded" value={COMPANY.founded} />}
              {registered && (
                <Fact
                  label="Registered address"
                  value={[
                    COMPANY.address.street,
                    COMPANY.address.city,
                    COMPANY.address.region,
                    COMPANY.address.postalCode,
                    COMPANY.address.country,
                  ].filter(Boolean).join(", ")}
                />
              )}
            </dl>
            <div className="mt-6 flex flex-wrap items-center gap-4 border-t border-phantix-700/40 pt-5">
              {COMPANY.contactEmail && (
                <a
                  href={`mailto:${COMPANY.contactEmail}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-300 transition-colors hover:text-gold-200"
                >
                  <Mail size={14} /> {COMPANY.contactEmail}
                </a>
              )}
              {COMPANY.contactPhone && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-400">
                  <MapPin size={14} /> {COMPANY.contactPhone}
                </span>
              )}
            </div>
            {links.length > 0 && (
              <div className="mt-4 flex flex-wrap items-center gap-4">
                {links.map((l) => (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-[13px] font-medium text-slate-400 transition-colors hover:text-slate-200"
                  >
                    {l.label} <ArrowUpRight size={12} />
                  </a>
                ))}
              </div>
            )}
          </motion.div>

          <motion.div {...fadeUp} transition={{ ...fadeUp.transition, delay: 0.08 }} className="card p-8">
            <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
              <Users size={18} />
            </span>
            <h3 className="mt-4 font-display text-xl font-semibold text-white">{COMPANY.productName}</h3>
            <p className="mt-3 text-[14px] leading-7 text-slate-400">
              One command centre for the surfaces you own — assets, assessments, risk and evidence in a
              single register, under your keys. The front door is vulnerability assessment and
              penetration testing; continuous security and remediation guidance build on it.
            </p>
            <dl className="mt-6 space-y-3 text-[14px]">
              {PRODUCT_FACTS.map((f) => (
                <Fact key={f.label} label={f.label} value={f.value} />
              ))}
            </dl>
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
            Talk to the people who build it
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            Questions on the platform, a security review, or a partnership — reach us directly, or see
            the product running with your own scope.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/demo" className="btn-primary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Request a live demo
            </Link>
            <a href={contactHref} className="btn-secondary !px-7 !py-3 !text-[15px]">
              <Mail size={16} /> Contact us
            </a>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-phantix-700/30 pb-3 last:border-0 last:pb-0">
      <dt className="text-slate-500">{label}</dt>
      <dd className="text-right font-medium text-slate-200">{value}</dd>
    </div>
  );
}
