import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight, BookOpen, ChevronDown, Code2, Layers,
  Menu, Presentation, ShieldCheck, Sparkles, Terminal, Users, X,
} from "lucide-react";
import { APP_DOCS_URL, BLOG_URL, PLATFORM_REGISTER_URL } from "@/lib/links";
import { PLATFORM_PAGES } from "@/lib/platform-content";
import { COMPANY, addressLines, companyLinks } from "@/lib/company";
import { cx } from "@/lib/utils";
import { ThemeToggle } from "@/components/ThemeToggle";
import { BrandWordmark } from "@/components/BrandLogo";

interface MegaItem {
  label: string;
  to: string;
  desc: string;
  icon: React.ReactNode;
}

interface MegaConfig {
  /** Brand rail on the left of the panel. */
  intro: { eyebrow: string; title: string; body: string; linkLabel: string; linkTo: string; icon: React.ReactNode };
  itemsEyebrow: string;
  items: MegaItem[];
  /** 2 for the surface grid, 1 for the audience list. */
  cols: 1 | 2;
  /** Gold-tinted feature panel on the right. */
  promo: { eyebrow: string; title: string; body: string; linkLabel: string; linkTo: string; icon: React.ReactNode };
  footNote: string;
  width: string;
}

const PLATFORM_MENU: MegaConfig = {
  intro: {
    eyebrow: "SecureGraph platform",
    title: "One command centre for every surface you own.",
    body: "Assets, assessments, risk and evidence stay in one register that you control.",
    linkLabel: "Explore the platform",
    linkTo: "/#applications",
    icon: <Layers size={16} />,
  },
  itemsEyebrow: "Testing surfaces",
  items: PLATFORM_PAGES.map((p) => ({
    label: p.navLabel,
    to: `/platform/${p.slug}`,
    desc: p.headline,
    icon: p.icon,
  })),
  cols: 2,
  promo: {
    eyebrow: "Start with VAPT",
    title: "Assess like an attacker. Verify. Fix. Keep testing.",
    body: "One subscription covers the platform. Turn a module on when you need it. AI never invents findings.",
    linkLabel: "See how it works",
    linkTo: "/#capabilities",
    icon: <Sparkles size={16} />,
  },
  footNote: "Vulnerability assessment and penetration testing first. Continuous security on Growth.",
  width: "w-[920px]",
};

const SOLUTIONS_MENU: MegaConfig = {
  intro: {
    eyebrow: "Who it's for",
    title: "Built for the person who also happens to own security.",
    body: "Whether that is the board asking for assurance, the engineer holding the pager, or the team that integrates the agent.",
    linkLabel: "See pricing",
    linkTo: "/pricing",
    icon: <Users size={16} />,
  },
  itemsEyebrow: "By audience",
  items: [
    {
      label: "For business leaders",
      to: "/solutions/business-leaders",
      desc: "Assurance you can put in front of a board. Evidence, not adjectives.",
      icon: <Presentation size={15} />,
    },
    {
      label: "For security teams",
      to: "/solutions/security-teams",
      desc: "Built for people who are tired of noisy scanners and unreadable PDF files.",
      icon: <Terminal size={15} />,
    },
    {
      label: "For developers",
      to: "/solutions/developers",
      desc: "Programmatic access to the AI agent. We tell you which API.",
      icon: <Code2 size={15} />,
    },
  ],
  cols: 1,
  promo: {
    eyebrow: "Trust and security",
    title: "Your security data stays yours.",
    body: "The boundary, the approval gates, and the audit trail are documented, not asserted.",
    linkLabel: "Read the trust model",
    linkTo: "/trust",
    icon: <ShieldCheck size={16} />,
  },
  footNote: "Start on Free. Expand when the pipeline earns it.",
  width: "w-[860px]",
};

/** Internal route or homepage anchor — anchors must not go through the router. */
function MegaLink({
  to,
  onNavigate,
  className,
  children,
}: {
  to: string;
  onNavigate: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  if (to.startsWith("/#")) {
    return (
      <a href={to} onClick={onNavigate} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={to} onClick={onNavigate} className={className}>
      {children}
    </Link>
  );
}

/**
 * Mega-menu — brand rail, surface grid, feature panel.
 *
 * Opens on hover for fine pointers and on click for everything else, so it stays
 * reachable by keyboard and on touch. The panel is capped to the viewport so it
 * can never push the page into horizontal scroll at the xl breakpoint.
 */
function MegaMenu({ label, config }: { label: string; config: MegaConfig }) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const close = () => setOpen(false);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative" onMouseEnter={() => setOpen(true)} onMouseLeave={close}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className={cx("flex items-center gap-1 rounded-md px-2.5 py-2 transition-colors", open ? "bg-white/5 text-white" : "hover:bg-white/5 hover:text-white")}
      >
        {label}
        <ChevronDown size={13} className={cx("transition-transform duration-200", open && "rotate-180")} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            className={cx("absolute left-0 top-full z-50 max-w-[calc(100vw-3rem)] pt-3", config.width)}
          >
            {/* Opaque, not translucent — at this size the page behind ghosts
                through a 95% panel and the copy stops being readable. */}
            <div className="overflow-hidden rounded-xl border border-phantix-700 bg-phantix-950 shadow-[0_24px_60px_-16px_rgba(0,0,0,0.9)]">
              <div className="grid grid-cols-[236px_1fr_236px]">
                {/* Brand rail */}
                <div className="relative border-r border-phantix-800 p-6">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-60 [mask-image:radial-gradient(ellipse_80%_60%_at_20%_0%,black,transparent)]"
                  />
                  <div className="relative">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                      {config.intro.icon}
                    </span>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                      {config.intro.eyebrow}
                    </p>
                    <p className="mt-2 font-display text-[15px] font-semibold leading-6 text-white">
                      {config.intro.title}
                    </p>
                    <p className="mt-2.5 text-[12px] leading-5 text-slate-500">{config.intro.body}</p>
                    <MegaLink
                      to={config.intro.linkTo}
                      onNavigate={close}
                      className="group mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-400 hover:text-gold-300"
                    >
                      {config.intro.linkLabel}
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </MegaLink>
                  </div>
                </div>

                {/* Item grid */}
                <div className="p-6">
                  <p className="text-[12px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                    {config.itemsEyebrow}
                  </p>
                  <div className={cx("mt-4 grid gap-1", config.cols === 2 ? "grid-cols-2" : "grid-cols-1")}>
                    {config.items.map((item) => (
                      <MegaLink
                        key={item.label}
                        to={item.to}
                        onNavigate={close}
                        className="group relative flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-phantix-900"
                      >
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-phantix-700 bg-phantix-900 text-slate-400 transition-colors group-hover:border-gold-400/40 group-hover:bg-gold-400/10 group-hover:text-gold-300">
                          {item.icon}
                        </span>
                        <span className="min-w-0">
                          <span className="block text-[13.5px] font-semibold text-slate-200 transition-colors group-hover:text-white">
                            {item.label}
                          </span>
                          <span className="mt-0.5 block text-[12px] leading-4 text-slate-500">{item.desc}</span>
                        </span>
                      </MegaLink>
                    ))}
                  </div>
                </div>

                {/* Feature panel */}
                <MegaLink
                  to={config.promo.linkTo}
                  onNavigate={close}
                  className="group relative border-l border-phantix-800 bg-gold-400/[0.06] p-6 transition-colors hover:bg-gold-400/[0.1]"
                >
                  <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-grid-faint bg-grid opacity-70 [mask-image:radial-gradient(ellipse_70%_60%_at_70%_10%,black,transparent)]"
                  />
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-gold-400/20 blur-[50px]"
                  />
                  <div className="relative">
                    <span className="flex h-9 w-9 items-center justify-center rounded-md border border-gold-400/40 bg-gold-400/15 text-gold-300">
                      {config.promo.icon}
                    </span>
                    <p className="mt-4 text-[12px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                      {config.promo.eyebrow}
                    </p>
                    <p className="mt-2 font-display text-[15px] font-semibold leading-6 text-white">
                      {config.promo.title}
                    </p>
                    <p className="mt-2.5 text-[12px] leading-5 text-slate-400">{config.promo.body}</p>
                    <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-300">
                      {config.promo.linkLabel}
                      <ArrowRight size={12} className="transition-transform duration-200 group-hover:translate-x-0.5" />
                    </span>
                  </div>
                </MegaLink>
              </div>

              {/* Quiet footer strip — the line that ties the menu together. */}
              <div className="border-t border-phantix-800 bg-phantix-900/60 px-6 py-2.5">
                <p className="font-mono text-[12px] uppercase tracking-[0.14em] text-slate-600">
                  {config.footNote}
                </p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/*
 * Nav — N5 Floating pill (see component-cookbook.md § Navigation).
 *
 * Previous nav: N1-shaped full-width bar (wordmark left / inline links /
 * CTA right) — the generic "AI nav" fingerprint, genre-blind on a site with
 * 6+ real destinations. This build: a detached, rounded pill with a blur
 * backdrop, because the site already leans atmospheric (gold bloom, starfield,
 * near-black canvas) and the floating pill is the archetype that sells that
 * mood rather than fighting it.
 */
/** A route that may carry a #fragment: in-app routes use Link, anchors a plain href. */
function MenuLink({ to, className, children }: { to: string; className?: string; children: React.ReactNode }) {
  return to.includes("#") ? (
    <a href={to} className={className}>{children}</a>
  ) : (
    <Link to={to} className={className}>{children}</Link>
  );
}

/** Below xl the inline nav is hidden; this sheet carries every destination instead. */
function MobileMenu({ onClose }: { onClose: () => void }) {
  const group = (title: string, items: MegaItem[]) => (
    <div>
      <p className="px-2 pb-1.5 font-mono text-[12px] uppercase tracking-[0.16em] text-slate-400">{title}</p>
      <ul className="space-y-0.5">
        {items.map((i) => (
          <li key={i.to + i.label}>
            <MenuLink to={i.to} className="flex items-start gap-3 rounded-xl px-2 py-2.5 hover:bg-white/5">
              <span className="mt-0.5 shrink-0 text-gold-400">{i.icon}</span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-100">{i.label}</span>
                <span className="block text-[13px] leading-5 text-slate-400">{i.desc}</span>
              </span>
            </MenuLink>
          </li>
        ))}
      </ul>
    </div>
  );
  const plain = "block rounded-xl px-2 py-2.5 text-sm font-medium text-slate-100 hover:bg-white/5";
  return (
    <motion.div
      id="mobile-menu"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="mx-auto mt-2 max-h-[calc(100dvh-6.5rem)] max-w-6xl overflow-y-auto rounded-3xl border border-white/10 bg-phantix-900/95 p-3 shadow-[0_24px_60px_-20px_rgba(0,0,0,0.9)] backdrop-blur-xl xl:hidden"
      onClick={(e) => {
        if ((e.target as HTMLElement).closest("a")) onClose();
      }}
    >
      <div className="grid gap-4 sm:grid-cols-2">
        {group("Platform", PLATFORM_MENU.items)}
        {group("Solutions", SOLUTIONS_MENU.items)}
      </div>
      <div className="mt-3 grid grid-cols-2 gap-1 border-t border-white/10 pt-3 sm:grid-cols-4">
        <Link to="/trust" className={plain}>Trust</Link>
        <a href="/#how-it-works" className={plain}>How it works</a>
        <Link to="/pricing" className={plain}>Pricing</Link>
        <a href={APP_DOCS_URL} className={plain}>Documentation</a>
        <a href={BLOG_URL} className={plain}>Blog</a>
        <Link to="/contact" className={plain}>Contact</Link>
        <Link to="/ai-info" className={plain}>AI information</Link>
        <Link to="/demo" className={plain}>Book a demo</Link>
      </div>
      <div className="mt-3 border-t border-white/10 pt-3">
        <a href={PLATFORM_REGISTER_URL} className="btn-primary w-full !rounded-full !py-2.5">
          Get started free <ArrowRight size={15} />
        </a>
      </div>
    </motion.div>
  );
}

/** Section anchors for the focused (landing) nav, after Platform and Solutions. */
const FOCUSED_LINKS = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
];

/**
 * `focused` is the landing-page variant: Platform and Solutions menus, a few
 * on-page anchors and the one primary action — no secondary offers, no docs
 * shortcut and no sign-in.
 */
export function Nav({ focused = false }: { focused?: boolean }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setMenuOpen(false), [location.pathname, location.hash]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", fn, { passive: true });
    fn();
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div
        className={cx(
          "mx-auto flex max-w-6xl items-center gap-3 rounded-full border px-4 py-2.5 backdrop-blur-xl transition-all duration-300 sm:px-5",
          scrolled
            ? "border-white/15 bg-phantix-800/85 shadow-[0_16px_40px_-14px_rgba(0,0,0,0.85)]"
            : "border-white/10 bg-phantix-800/55 shadow-[0_10px_34px_-16px_rgba(0,0,0,0.7)]",
        )}
      >
        <div className="flex flex-col">
          <BrandWordmark className="h-8 self-start" />
          <p className="-mt-[0.46rem] hidden whitespace-nowrap pl-[2.25rem] text-[8px] font-semibold uppercase leading-none tracking-[0.26em] text-gold-400 sm:block">by Phantix Labs</p>
        </div>
        {focused ? (
          <nav className="ml-6 hidden items-center gap-1 text-sm text-slate-300 xl:flex">
            <MegaMenu label="Platform" config={PLATFORM_MENU} />
            <MegaMenu label="Solutions" config={SOLUTIONS_MENU} />
            {FOCUSED_LINKS.map((l) => (
              <a key={l.href} href={l.href} className="rounded-md px-2.5 py-2 transition-colors hover:bg-white/5 hover:text-white">
                {l.label}
              </a>
            ))}
          </nav>
        ) : (
          <nav className="ml-6 hidden items-center gap-1 text-sm text-slate-300 xl:flex [&>a]:rounded-md [&>a]:px-2.5 [&>a]:py-2 [&>a:hover]:bg-white/5">
            <MegaMenu label="Platform" config={PLATFORM_MENU} />
            <MegaMenu label="Solutions" config={SOLUTIONS_MENU} />
            <Link to="/trust" className="transition-colors hover:text-white">Trust</Link>
            {/* Anchors only resolve on the homepage — prefix with "/" so they work
                from a standalone page too. */}
            <a href="/#how-it-works" className="transition-colors hover:text-white">How it works</a>
            <Link to="/pricing" className="transition-colors hover:text-white">Pricing</Link>
            <a href={BLOG_URL} className="transition-colors hover:text-white">Blog</a>
            <Link to="/contact" className="transition-colors hover:text-white">Contact</Link>
          </nav>
        )}
        <div className="ml-auto flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />
          {!focused && (
            <a
              href={APP_DOCS_URL}
              title="Documentation"
              aria-label="Documentation"
              className="hidden h-10 w-10 items-center justify-center rounded-full border border-phantix-700/50 bg-phantix-900/50 text-slate-400 transition-colors hover:border-phantix-500/50 hover:text-white sm:inline-flex"
            >
              <BookOpen size={16} />
            </a>
          )}
          {/* The one primary action, identical on every page. */}
          <a href={PLATFORM_REGISTER_URL} className="btn-primary whitespace-nowrap !rounded-full !px-3.5 !py-2">
            <span className="sm:hidden">Get started</span>
            <span className="hidden sm:inline">Get started free</span>
            <ArrowRight size={14} />
          </a>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-phantix-700/50 bg-phantix-900/50 text-slate-300 transition-colors hover:border-phantix-500/50 hover:text-white xl:hidden"
          >
            {menuOpen ? <X size={17} /> : <Menu size={17} />}
          </button>
        </div>
      </div>
      <AnimatePresence>{menuOpen && <MobileMenu onClose={() => setMenuOpen(false)} />}</AnimatePresence>
    </header>
  );
}

/** One footer link — internal route via `to`, external/anchor via `href`. */
interface FootLink {
  label: string;
  to?: string;
  href?: string;
}

/** A category as a proper footer column — heading on top, links stacked below. */
function FooterLinkColumn({ label, links }: { label: string; links: FootLink[] }) {
  return (
    <div>
      <p className="font-mono text-[12px] uppercase tracking-[0.2em] text-slate-400">{label}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.label}>
            {l.to ? (
              <Link to={l.to} className="text-sm text-slate-500 transition-colors hover:text-slate-200">
                {l.label}
              </Link>
            ) : (
              <a href={l.href} className="text-sm text-slate-500 transition-colors hover:text-slate-200">
                {l.label}
              </a>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const FOOTER_PLATFORM_LINKS: FootLink[] = [
  ...PLATFORM_PAGES.map((p) => ({ label: p.navLabel, to: `/platform/${p.slug}` })),
];
const FOOTER_SOLUTIONS_LINKS: FootLink[] = [
  { label: "Business leaders", to: "/solutions/business-leaders" },
  { label: "Security teams", to: "/solutions/security-teams" },
  { label: "Developers", to: "/solutions/developers" },
  { label: "Trust and security", to: "/trust" },
  { label: "Pricing", to: "/pricing" },
];
/* Who is behind the product — the identity a buyer (or a startup-programme
   reviewer) checks. The third-party links only appear once those pages exist. */
const FOOTER_COMPANY_LINKS: FootLink[] = [
  { label: "About", to: "/company" },
  { label: "Contact", to: "/contact" },
  ...companyLinks().map((l) => ({ label: l.label, href: l.href }) as FootLink),
];
const FOOTER_RESOURCE_LINKS: FootLink[] = [
  { label: "Documentation", href: APP_DOCS_URL },
  { label: "Blog", href: BLOG_URL },
  { label: "AI information", to: "/ai-info" },
];
/* Self-serve first, demo as the accelerator, sales for Enterprise — and no
   sign-in: the marketing site only ever starts accounts. */
const FOOTER_START_LINKS: FootLink[] = [
  { label: "Get started free", href: PLATFORM_REGISTER_URL },
  { label: "Book a demo", to: "/demo" },
  { label: "Enterprise pricing", to: "/pricing" },
];
const FOOTER_LEGAL_LINKS: FootLink[] = [
  { label: "Terms of Service", href: "/terms" },
  { label: "Acceptable Use Policy", href: "/aup" },
  { label: "Privacy Notice", href: "/privacy" },
];

/*
 * Footer — a standard footer layout: brand block on the left, link columns
 * grouped by category in a grid, and a copyright tail along the bottom.
 */
export function Footer() {
  return (
    <footer className="border-t border-phantix-700/30 pb-12 pt-16 md:pt-20">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 lg:grid-cols-[1.4fr_repeat(6,1fr)] lg:gap-8">
          <div className="max-w-xs">
            <div className="flex items-center gap-2.5">
              <div className="flex flex-col">
                <BrandWordmark className="h-8 self-start" />
                <p className="mt-1 font-mono text-[12px] uppercase tracking-[0.2em] text-gold-400">Protect. Prevent. Perform.</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-6 text-slate-500">
              Vulnerability assessment and penetration testing for lean teams.
            </p>
            <p className="mt-4 text-[13px] font-semibold text-slate-400">
              SecureGraph is a product of {COMPANY.legalName}.
            </p>

            {/* Registered office — the line a first-time buyer looks for to tell
                a real company from a landing page. Renders whatever is set in
                lib/company.ts; never a fabricated address. */}
            <div className="mt-6">
              <p className="font-mono text-[11px] uppercase tracking-[0.2em] text-slate-500">
                Registered office
              </p>
              <address className="mt-2.5 not-italic text-[13px] leading-6 text-slate-500">
                <span className="block font-medium text-slate-400">{COMPANY.legalName}</span>
                {addressLines().map((line) => (
                  <span key={line} className="block">{line}</span>
                ))}
              </address>
              {COMPANY.rcNumber && (
                <p className="mt-1.5 font-mono text-[11px] text-slate-600">{COMPANY.rcNumber}</p>
              )}
            </div>
          </div>

          <FooterLinkColumn label="Platform" links={FOOTER_PLATFORM_LINKS} />
          <FooterLinkColumn label="Solutions" links={FOOTER_SOLUTIONS_LINKS} />
          <FooterLinkColumn label="Company" links={FOOTER_COMPANY_LINKS} />
          <FooterLinkColumn label="Resources" links={FOOTER_RESOURCE_LINKS} />
          <FooterLinkColumn label="Get started" links={FOOTER_START_LINKS} />
          <FooterLinkColumn label="Legal" links={FOOTER_LEGAL_LINKS} />
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-between gap-4 border-t border-phantix-700/30 pt-8 text-xs text-slate-500">
          <span>© {new Date().getFullYear()} Phantix Labs ltd</span>
          <span className="font-mono">13 engines · 10+ AI agents · 600+ checks</span>
        </div>
      </div>
    </footer>
  );
}
