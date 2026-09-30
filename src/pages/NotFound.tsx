import React from "react";
import { Link, useLocation } from "react-router-dom";
import PageShell from "@/components/PageShell";
import { Section } from "@/components/Section";

/**
 * Unknown URLs used to render the home page — a "soft 404" search engines index
 * as duplicate content, and a visitor with a typo never learns the link is wrong.
 */
export default function NotFound() {
  const { pathname } = useLocation();

  React.useEffect(() => {
    const previousTitle = document.title;
    document.title = "Page not found · SecureGraph";
    const meta = document.createElement("meta");
    meta.name = "robots";
    meta.content = "noindex";
    document.head.appendChild(meta);
    return () => {
      document.title = previousTitle;
      meta.remove();
    };
  }, []);

  return (
    <PageShell>
      <Section className="pb-24 pt-32 md:pt-40">
        <div className="mx-auto max-w-xl text-center">
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-gold-300">404</p>
          <h1 className="mt-3 font-display text-3xl font-bold text-white md:text-4xl">Page not found</h1>
          <p className="mt-4 text-base leading-7 text-slate-400">
            Nothing lives at <span className="break-all font-mono text-slate-300">{pathname}</span>. The
            link may be out of date, or it may have a typo.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="rounded-lg bg-gold-400 px-5 py-2.5 text-sm font-semibold text-black hover:bg-gold-300">
              Go to the homepage
            </Link>
            <Link to="/pricing" className="rounded-lg border border-white/15 px-5 py-2.5 text-sm font-semibold text-slate-200 hover:border-white/30">
              See pricing
            </Link>
          </div>
        </div>
      </Section>
    </PageShell>
  );
}
