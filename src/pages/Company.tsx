import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Building2, CalendarClock, CheckCircle2, Github, Globe, Linkedin,
  Mail, MapPin, ShieldCheck, Users,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import { COMPANY, companyLinks, hasRegisteredIdentity } from "@/lib/company";

/*
 * /company — who is behind SecureGraph.
 *
 * The public face of the legal entity: an About page every buyer's
 * due-diligence pass — and Google for Startups' operational-transparency
 * filter — expects to find on the domain, with verifiable links. Content is
 * data-driven from lib/company.ts — fill that file, not this page.
 */

const COMMITMENTS = [
  "Findings come from engines and then a verifier. We never invent a vulnerability.",
  "Your security records live in a database you control, not in a shared pile.",
  "The AI explains what the scanners found. It does not replace the evidence.",
  "You define scope and authorization. SecureGraph provides the controls.",
];

const PRODUCT_FACTS = [
  { label: "Product", value: COMPANY.productName },
  { label: "Focus", value: "Vulnerability assessment and penetration testing" },
  { label: "Model", value: "Continuous security, with verified findings" },
  { label: "Data", value: "SecureGraph stores data in the customer's own security database" },
];

export default function Company() {
  const links = companyLinks();
  const registered = hasRegisteredIdentity();
  const contactHref = COMPANY.contactEmails[0] ? `mailto:${COMPANY.contactEmails[0]}` : "/demo";

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
            {COMPANY.displayName} builds {COMPANY.productName}, a vulnerability assessment and
            penetration testing service for lean teams. It gives you continuous security and
            verified findings.{" "}{COMPANY.tagline}
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
              Security that one person can run
            </h2>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              Most organizations have scanners. They do not have the people to run those scanners.
              We built {COMPANY.productName} for the engineer or operations lead who also owns security.
              That person can find real weaknesses, keep testing as the surface changes, and prove what
              was fixed.
            </p>
            <p className="mt-4 text-[15px] leading-7 text-slate-400">
              SecureGraph runs the engines that security teams run by hand. It verifies before it reports,
              and it keeps your security records in a database you control.
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
              {COMPANY.contactEmails.map((email) => (
                <a
                  key={email}
                  href={`mailto:${email}`}
                  className="inline-flex items-center gap-1.5 text-[13px] font-medium text-gold-300 transition-colors hover:text-gold-200"
                >
                  <Mail size={14} /> {email}
                </a>
              ))}
              {COMPANY.contactPhone && (
                <span className="inline-flex items-center gap-1.5 text-[13px] text-slate-400">
                  <MapPin size={14} /> {COMPANY.contactPhone}
                </span>
              )}
            </div>
            {links.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2.5">
                {links.map((l) => (
                  <a
                    key={l.id}
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={l.label}
                    className="inline-flex items-center gap-2 rounded-lg border border-phantix-700/50 bg-phantix-950/40 px-3 py-2 text-[13px] font-medium text-slate-300 transition-colors hover:border-gold-400/40 hover:bg-phantix-900/60 hover:text-white"
                  >
                    <SocialGlyph id={String(l.id)} size={18} />
                    {l.label}
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
              One Command Centre for the surfaces you own. SecureGraph keeps assets, assessments, risk
              and evidence in a single register, under your keys. The front door is vulnerability
              assessment and penetration testing. Continuous security and remediation guidance build on it.
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
            Send us your questions about SecureGraph, a security review, or a partnership. You can
            also watch the product run against your own scope.
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

/** The X (formerly Twitter) glyph — lucide carries no brand mark for it. */
function XLogo({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

/** Brand glyph for a third-party company page. */
function SocialGlyph({ id, size = 18 }: { id: string; size?: number }) {
  if (id === "linkedin") return <Linkedin size={size} />;
  if (id === "github") return <Github size={size} />;
  if (id === "x") return <XLogo size={size} />;
  return <Globe size={size} />;
}
