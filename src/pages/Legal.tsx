import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft, BookOpen, CheckCircle2, ShieldCheck, ScrollText } from "lucide-react";
import { Nav, Footer } from "@/components/chrome";
import { loadLegalDocument, LegalDocument, LegalSection } from "@/lib/legal";
import { APP_LOGIN_URL } from "@/lib/links";
import { BrandMark } from "@/components/BrandLogo";
import PageMeta from "@/components/PageMeta";
import { pageSeo } from "@/lib/routeSeo";

const DOC_META: Record<string, { kicker: string; icon: React.ReactNode }> = {
  terms: { kicker: "Terms of Service", icon: <BookOpen size={18} /> },
  aup: { kicker: "Acceptable Use Policy", icon: <ShieldCheck size={18} /> },
  privacy: { kicker: "Privacy Notice", icon: <ScrollText size={18} /> },
};

function SectionBody({ section }: { section: LegalSection }) {
  return (
    <>
      {section.body && <p className="mt-2.5 text-sm leading-6 text-slate-300">{section.body}</p>}
      {section.items && section.items.length > 0 && (
        <ul className="mt-3 space-y-2">
          {section.items.map((item, i) => (
            <li key={i} className="flex items-start gap-2.5 text-sm leading-6 text-slate-300">
              <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-emerald-400" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

export default function LegalPage({ docKey }: { docKey: "terms" | "aup" | "privacy" }) {
  const [doc, setDoc] = useState<LegalDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const meta = DOC_META[docKey];

  useEffect(() => {
    let active = true;
    setLoading(true);
    void loadLegalDocument(docKey).then((d) => {
      if (active) {
        setDoc(d);
        setLoading(false);
      }
    });
    return () => {
      active = false;
    };
  }, [docKey]);

  const sections = doc?.sections ?? [];

  return (
    <div className="relative min-h-screen overflow-x-clip bg-phantix-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <Nav />
      <PageMeta {...pageSeo(`/${docKey}`)} />
      <main className="relative px-4 pb-16 pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <a href="/" className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <ArrowLeft size={15} /> Back to phantixlabs.com
          </a>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="flex items-center gap-4">
              <BrandMark className="h-16 w-16" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-400">{meta.kicker}</p>
                <h1 className="font-display text-3xl font-bold text-white">{doc?.title || meta.kicker}</h1>
                <p className="mt-1 text-sm text-slate-500">{doc?.effective || doc?.summary}</p>
                {doc?.version && <p className="mt-1 text-[12px] font-mono text-slate-600">version {doc.version}</p>}
              </div>
            </div>
          </motion.div>

          {doc?.summary && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }} className="mt-6">
              <div className="card border-gold-400/25 p-6">
                <div className="flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gold-400/15 text-gold-400">{meta.icon}</span>
                  <h2 className="font-display text-lg font-semibold text-white">Summary</h2>
                </div>
                <p className="mt-4 text-sm leading-6 text-slate-300">{doc.summary}</p>
              </div>
            </motion.div>
          )}

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.08 }} className="mt-6 space-y-5">
            {loading ? (
              <div className="card p-6 text-sm text-slate-400">Loading {meta.kicker}...</div>
            ) : sections.length > 0 ? (
              sections.map((s, i) => (
                <div key={s.id ?? i} className="card p-6">
                  <h2 className="font-display text-base font-semibold text-white">{s.title || `Section ${i + 1}`}</h2>
                  <SectionBody section={s} />
                </div>
              ))
            ) : (
              <div className="card p-6 text-sm text-slate-400">
                {doc
                  ? "No sections to display."
                  : "Could not load this document right now. Please try again later."}
              </div>
            )}
          </motion.div>

          {doc?.acceptance_required_copy && (
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="mt-6">
              <div className="rounded-2xl border border-phantix-700/40 bg-phantix-900/50 p-4 text-sm leading-6 text-slate-300">
                <strong className="text-slate-200">Acceptance: </strong>{doc.acceptance_required_copy}
              </div>
            </motion.div>
          )}

          <div className="mt-6 flex items-center justify-between rounded-2xl border border-phantix-700/40 bg-phantix-900/50 px-6 py-4">
            <p className="text-sm text-slate-400">Ready to secure your organization?</p>
            <a href={APP_LOGIN_URL} className="btn-primary !py-2">Sign in</a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
