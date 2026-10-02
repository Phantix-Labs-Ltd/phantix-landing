import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, fadeUp } from "./Section";

/**
 * The FAQ is the page's main answer-engine surface. It is exported so the
 * FAQPage schema below stays in step with what the reader sees; the questions
 * are already phrase-matched to how people search.
 */
export const faqs = [
  {
    q: "What is SecureGraph?",
    a: "SecureGraph helps small teams find real weaknesses, keep testing, and fix what matters.\n\nThe front door is vulnerability assessment and penetration testing (VAPT). Growth adds continuous security, remediation guidance, and reports that use only verified findings. Asset inventory, risk, and optional compliance or SOC depth sit on the same platform. You get one subscription and you can leave modules off.\n\nYour security records live in a database you control. We never treat your production business systems as a playground. We never invent vulnerabilities. AI explains what the engines already found.",
  },
  {
    q: "Where does my security data live?",
    a: "Security evidence lives in a dedicated PostgreSQL database that you provision and control. The evidence includes assets, tests, findings, and risks. You choose the host. SecureGraph connects to that store and writes into it.\n\nWe do not park your vulnerability history in a shared multi-tenant lake next to another organization’s data. We do not read your ERP, CRM, or customer production data. On the platform side we keep what runs the organization: identity, roles, billing, and configuration.\n\nIf you leave, you keep your security data. It was never ours to hold hostage.",
  },
  {
    q: "Is the Free plan really free?",
    a: "Yes. You do not need a card, and there is no countdown trial.\n\nFree is the entry surface. Create your organization, use dual control and MFA, inventory assets within fair-use caps, run light hygiene checks, and export basic formats. You get a one-time 500 AI credits, then free open-source models if enabled.\n\nFull VAPT campaigns, continuous testing, deep cloud and SOC packs, and board PDF packages are on Starter and Growth. Free helps you know your surface before you spend. It does not replace a paid assessment plan.",
  },
  {
    q: "Do I need a demo before I can start?",
    a: "No. Create a free account and use the product straight away. You do not need a call or a card.\n\nBook a demo if you want us to show how SecureGraph fits your environment, your team, or your procurement process. Larger organizations that need SSO, custom contracts, SLAs, or a private deployment can talk to sales from the Enterprise plan.",
  },
  {
    q: "How is this different from buying a scanner?",
    a: "A scanner puts issues on your desk. You still need someone to retest, prioritize, fix, and explain them to leadership.\n\nSecureGraph starts with scoped VAPT. It verifies what is real, guides remediation, and can keep testing continuously on Growth. All of this occurs in one place. You can add compliance mapping and SOC depth when you need them. They are not the reason to buy.\n\nThe other difference is ownership. Your security database stays yours.",
  },
  {
    q: "Will AI invent fake vulnerabilities?",
    a: "No. Agents can only work with what the engines already stored. They help write findings, suggest fixes, and plan investigations. They do not create findings, change scores, or bypass dual control.\n\nReports emphasize verified material. Unverified noise stays quarantined. Your board should only see what you can stand behind.",
  },
  {
    q: "Can we use this without a full security team?",
    a: "Yes. SecureGraph is built for the one-person security team. This person is often the engineer or operations lead who also owns security.\n\nIt inventories assets continuously, separates verified issues from noise, tracks fixes, and produces board-ready reports. You do not write them from scratch at midnight.",
  },
  {
    q: "Do you support Nigerian companies and NDPA?",
    a: "Yes. Privacy is a foundation. Security data stays in infrastructure that you choose. AI paths prefer controlled models, and we audit all actions.\n\nWe help you prepare evidence for privacy and security conversations. Formal certification such as ISO or SOC 2 remains your responsibility. We are the tool that helps you build the case. We are not the auditor.",
  },
  {
    q: "What if I need a full human penetration test?",
    a: "Engagements put SecureGraph practitioners on the same platform that you use each day. They scope, run, and report inside your environment, so findings follow the same verification path as your internal assessments.\n\nAsk us about full VAPT, complex application testing, mobile dynamic testing, and guided board reporting.",
  },
  {
    q: "How do I get started?",
    a: "Click Get started free, create your organization, and connect a security database. You can bring your own Postgres, or ask about hosted options when available.\n\nAdd a small set of assets and run your first assessment on Free. Move to Starter when you need full VAPT and verified reports, and to Growth when you need continuous testing. You do not need a card to begin.",
  },
];

function Eyebrow({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-phantix-700 bg-phantix-900 px-3.5 py-1.5 text-[12px] font-semibold uppercase tracking-[0.14em] text-slate-400">
      {children}
    </span>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-phantix-800">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-display text-[15px] font-semibold text-white md:text-base">{q}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-slate-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <p className="whitespace-pre-line pb-5 text-[14px] leading-7 text-slate-400">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FAQ() {
  // AEO: the page carries one FAQPage node built from the visible questions, so
  // answer engines can lift a direct answer without guessing. Injected at
  // runtime and removed on unmount; the questions above are the single source.
  useEffect(() => {
    const id = "faq-page-schema";
    document.getElementById(id)?.remove();
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.id = id;
    script.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: {
          "@type": "Answer",
          text: f.a.replace(/\s*\n+\s*/g, " ").trim(),
        },
      })),
    });
    document.head.appendChild(script);
    return () => {
      document.getElementById(id)?.remove();
    };
  }, []);

  return (
    <Section id="faq" className="py-20">
      <motion.div {...fadeUp} className="mx-auto max-w-2xl">
        <Eyebrow>FAQ</Eyebrow>
        <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-white">
          Straight answers
        </h2>
        <p className="mt-3 text-[15px] leading-7 text-slate-400">
          What decision-makers usually ask before they start.
        </p>
        <div className="mt-10">
          {faqs.map((f) => (
            <FAQItem key={f.q} q={f.q} a={f.a} />
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

export default FAQ;
