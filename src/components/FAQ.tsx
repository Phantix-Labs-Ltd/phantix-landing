import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Section, fadeUp } from "./Section";

import { faqs } from "@/lib/faqs";

export { faqs };

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
