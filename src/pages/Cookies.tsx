import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Cookie, ShieldCheck } from "lucide-react";
import { Nav, Footer } from "@/components/chrome";
import { COOKIE_SETTINGS_EVENT } from "@/components/CookieConsent";
import { BrandMark } from "@/components/BrandLogo";

// ── Cookies & analytics policy (public) ──────────────────────────────────────

export default function Cookies() {
  return (
    <div className="relative min-h-screen overflow-x-clip bg-phantix-950">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute inset-0 bg-grid-faint bg-grid [mask-image:radial-gradient(ellipse_75%_60%_at_50%_0%,black,transparent)]" />
      </div>

      <Nav />
      <main className="relative px-4 pb-16 pt-28 md:pt-36">
        <div className="mx-auto max-w-3xl">
          <Link to="/" className="-ml-2 inline-flex items-center gap-2 rounded-md px-2 py-2 text-sm text-slate-400 hover:bg-white/5 hover:text-slate-200">
            <ArrowLeft size={15} /> Back to phantixlabs.com
          </Link>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="mt-6">
            <div className="flex items-center gap-4">
              <BrandMark className="h-16 w-16" />
              <div>
                <p className="text-[12px] font-semibold uppercase tracking-[0.22em] text-gold-400">
                  Cookies and analytics
                </p>
                <h1 className="mt-1 text-2xl font-semibold text-white">Cookies and analytics policy</h1>
              </div>
            </div>
          </motion.div>

          <div className="mt-10 space-y-8 text-sm leading-6 text-slate-300">
            <section>
              <h2 className="flex items-center gap-2 text-base font-semibold text-white">
                <Cookie size={16} className="text-gold-400" /> We do not use advertising cookies
              </h2>
              <p className="mt-2.5">
                On phantixlabs.com and blog.phantixlabs.com we use two kinds of analytics, and only after you
                accept: our own <strong className="text-slate-100">first-party, cookieless analytics</strong>,
                and <strong className="text-slate-100">Zoho PageSense</strong>. We do <strong>not</strong> use
                advertising cookies and we do <strong>not</strong> sell data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">What our own analytics records</h2>
              <ul className="mt-3 space-y-2">
                {[
                  "Page path and the referring page",
                  "Coarse device information: screen size, browser language and time zone",
                  "Campaign parameters, known as UTM tags, when a link carries them",
                  "A random id for each session, kept in sessionStorage and not in a cookie",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2.5">
                    <ShieldCheck size={15} className="mt-0.5 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-slate-400">
                It does <strong>not</strong> record your name, email, keystrokes, page content or any personal
                data. We honor <code>Do Not Track</code> and a deployment kill-switch.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">Zoho PageSense</h2>
              <p className="mt-2.5">
                PageSense is a service from Zoho Corporation that shows us how visitors use these sites: heatmaps
                of clicks and scrolling, session recordings of how a page was used, and tests of page variants.
                It sets its own cookies, and Zoho processes the data on our behalf under its own{" "}
                <a href="https://www.zoho.com/privacy.html" className="text-gold-400 underline hover:text-gold-300" target="_blank" rel="noreferrer">
                  privacy policy
                </a>
                .
              </p>
              <p className="mt-2.5 text-slate-400">
                It loads only after you accept, never with <code>Do Not Track</code> on, and only on the public
                sites. It never runs in the signed-in SecureGraph applications, so it never sees your security
                data.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">In the SecureGraph applications</h2>
              <p className="mt-2.5">
                Signed-in users have accepted the Terms of Service, so the applications don't show this banner.
                They count page views with our own analytics only. If you decline here, they don't count yours.
              </p>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">Cookie settings</h2>
              <p className="mt-2.5">
                Analytics and PageSense run on these sites only after you accept. You can change your choice
                at any time. If you decline, beacons stop and PageSense is not loaded; nothing else changes.
              </p>
              <button
                type="button"
                className="btn-secondary mt-4 text-xs"
                onClick={() => window.dispatchEvent(new CustomEvent(COOKIE_SETTINGS_EVENT))}
              >
                <Cookie size={13} className="mr-1.5 inline" /> Open cookie settings
              </button>
            </section>

            <section>
              <h2 className="text-base font-semibold text-white">Retention and contact</h2>
              <p className="mt-2.5">
                We keep analytics records in aggregate for product measurement. We do not use them to
                identify you. For requests about access, correction or erasure, contact our Data Protection
                Officer at privacy@phantixlabs.com.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
