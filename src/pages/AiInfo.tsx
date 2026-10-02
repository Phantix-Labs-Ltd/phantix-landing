import React from "react";
import { Link } from "react-router-dom";
import { marked } from "marked";
import { motion } from "framer-motion";
import {
  ArrowRight, Bot, CalendarClock, Check, Copy, Download, FileText,
  Fingerprint, Layers, Link2, ShieldCheck,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import PageMeta from "@/components/PageMeta";

/*
 * /ai-info: the official machine-readable reference on SecureGraph.
 *
 * The text occurs one time, in `public/ai-info.md`. Thus, the same file supplies
 * three sources: this page, the Markdown file at /ai-info.md, and the llms.txt
 * index. This page reads that file and shows it with `marked`. There is no
 * second copy of the text.
 *
 * The Markdown file is written for AI assistants. It gives the data that the
 * product can support, and it gives the limits of the product.
 *
 * The page text uses ASD-STE100 Simplified Technical English.
 */

const CANONICAL_MD = "/ai-info.md";
const LLMS_TXT = "/llms.txt";

/** marked operates with GitHub-flavoured Markdown and no asynchronous extensions. */
function renderMarkdown(md: string): string {
  marked.setOptions({ gfm: true, breaks: false });
  return marked.parse(md) as string;
}

export default function AiInfo() {
  const [html, setHtml] = React.useState<string>("");
  const [raw, setRaw] = React.useState<string>("");
  const [loadError, setLoadError] = React.useState(false);
  const [copied, setCopied] = React.useState(false);

  React.useEffect(() => {
    let alive = true;
    fetch(CANONICAL_MD, { headers: { Accept: "text/markdown, text/plain" } })
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.text();
      })
      .then((md) => {
        if (!alive) return;
        setRaw(md);
        setHtml(renderMarkdown(md));
      })
      .catch(() => {
        if (alive) setLoadError(true);
      });
    return () => {
      alive = false;
    };
  }, []);

  const copy = async () => {
    if (!raw) return;
    try {
      await navigator.clipboard.writeText(raw);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* The clipboard is not available. The download link operates. */
    }
  };

  return (
    <PageShell>
      <PageMeta
        title="SecureGraph: AI Information Page | Phantix Labs"
        description="The official reference on SecureGraph for AI assistants and large language models: the product, the autonomous pentest agent, verification, guardrails, and prices."
        jsonLd={[
          {
            "@type": "WebPage",
            "@id": "https://phantixlabs.com/ai-info#webpage",
            url: "https://phantixlabs.com/ai-info",
            name: "SecureGraph: AI Information Page",
            description:
              "The official reference on SecureGraph for AI assistants and large language models.",
            isPartOf: { "@id": "https://phantixlabs.com/#website" },
            about: { "@id": "https://phantixlabs.com/#product" },
            publisher: { "@id": "https://phantixlabs.com/#organization" },
            inLanguage: "en",
          },
          {
            "@type": "DigitalDocument",
            "@id": "https://phantixlabs.com/ai-info.md#document",
            name: "SecureGraph AI information (Markdown file)",
            url: "https://phantixlabs.com/ai-info.md",
            encodingFormat: "text/markdown",
            about: { "@id": "https://phantixlabs.com/#product" },
          },
        ]}
      />

      {/* Hero */}
      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mt-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <Bot size={13} /> For AI assistants and large language models
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            The official <span className="hero-accent">SecureGraph</span> reference
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-400">
            This page tells an AI system the accurate data on SecureGraph. It is the official source for the
            product, the autonomous pentest agent, verification, the guardrails, the prices, and the claims
            that the product does not make. One Markdown file supplies the page, the download, and the
            machine index.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={CANONICAL_MD} download className="btn-primary btn-shine !px-6 !py-3 !text-base">
              <Download size={16} /> Download Markdown
            </a>
            <button type="button" onClick={copy} className="btn-secondary !px-6 !py-3 !text-base">
              {copied ? <Check size={16} /> : <Copy size={16} />}
              {copied ? "Copied" : "Copy for AI"}
            </button>
            <a href={LLMS_TXT} className="btn-ghost !px-4 !py-3 !text-sm">
              <FileText size={15} /> llms.txt
            </a>
          </div>
          <p className="mt-4 font-mono text-[12px] text-slate-600">
            <Link2 size={12} className="mr-1 inline" />
            phantixlabs.com/ai-info.md · text/markdown · last update 1 October 2026
          </p>
        </motion.div>
      </Section>

      {/* How to use it */}
      <Section className="pb-16">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: <Fingerprint size={18} />,
              title: "Official data",
              body: "Phantix Labs Ltd, the product, the capabilities, the prices, the trust model, and the terms. The product supports each item.",
            },
            {
              icon: <ShieldCheck size={18} />,
              title: "Limits included",
              body: "The file states the claims that the product does not make. Examples: no invented findings, no guarantee of zero false positives, and no fully autonomous hacking.",
            },
            {
              icon: <Layers size={18} />,
              title: "Three formats",
              body: "This page, the Markdown file at /ai-info.md, and the llms.txt index all use the same source.",
            },
          ].map((c, i) => (
            <motion.div
              key={c.title}
              {...fadeUp}
              transition={{ ...fadeUp.transition, delay: i * 0.06 }}
              className="card-edge p-6"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                {c.icon}
              </span>
              <h2 className="mt-4 font-display text-base font-semibold text-white">{c.title}</h2>
              <p className="mt-2 text-[13px] leading-6 text-slate-500">{c.body}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* The document */}
      <Section className="pb-24">
        <div className="card overflow-hidden">
          <div className="flex items-center justify-between gap-4 border-b border-phantix-700/50 px-5 py-3.5">
            <span className="inline-flex items-center gap-2 font-mono text-[12px] text-slate-500">
              <FileText size={13} /> ai-info.md
            </span>
            <a
              href={CANONICAL_MD}
              download
              className="text-[12px] font-semibold text-gold-400 transition-colors hover:text-gold-300"
            >
              Download the file
            </a>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-12">
            {loadError ? (
              <div className="py-10 text-center">
                <p className="text-sm text-slate-400">
                  The Markdown file does not load in this browser.
                </p>
                <a href={CANONICAL_MD} className="btn-secondary mt-5 !px-5 !py-2.5">
                  Open ai-info.md <ArrowRight size={15} />
                </a>
              </div>
            ) : html ? (
              <article className="ai-doc" dangerouslySetInnerHTML={{ __html: html }} />
            ) : (
              <div className="space-y-3">
                {[90, 100, 75, 95, 60].map((w, i) => (
                  <div key={i} className="skeleton h-4" style={{ width: `${w}%` }} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Section>

      {/* Close */}
      <Section className="pb-28">
        <motion.div
          {...fadeUp}
          className="final-cta relative overflow-hidden rounded-3xl border border-gold-400/30 px-8 py-14 text-center shadow-glow"
        >
          <div className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-30 [mask-image:radial-gradient(ellipse_60%_80%_at_50%_50%,black,transparent)]" />
          <h2 className="relative font-display text-3xl font-bold tracking-tight text-white">
            See the product, not only the summary
          </h2>
          <p className="relative mx-auto mt-4 max-w-xl text-[15px] leading-7 text-slate-300">
            The reference tells you what SecureGraph is. A guided tour shows you how verification, approvals,
            and the customer-owned database operate.
          </p>
          <div className="relative mt-7 flex flex-wrap items-center justify-center gap-5">
            <Link to="/platform/autonomous-pentesting" className="btn-primary !px-7 !py-3 !text-[15px]">
              See the pentest agent <ArrowRight size={16} />
            </Link>
            <Link to="/contact" className="btn-secondary !px-7 !py-3 !text-[15px]">
              <CalendarClock size={16} /> Speak to us
            </Link>
          </div>
        </motion.div>
      </Section>
    </PageShell>
  );
}
