import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { COOKIE_POLICY_PATH, getConsent, getMarketingConsent, setConsent, setMarketingConsent } from "@/lib/consent";
import { onConsentAccepted } from "@/lib/analytics";
import CookiePreferences from "@/components/CookiePreferences";

/** Fired by the footer's "Cookie settings" link to reopen the settings. */
export const COOKIE_SETTINGS_EVENT = "phantix:cookie-settings";

// ── Cookie consent banner (landing) ──────────────────────────────────────────

export default function CookieConsent() {
  // Asked again of anyone who answered before the marketing category existed:
  // that answer only covered analytics.
  const [open, setOpen] = useState(() => getConsent() === null || getMarketingConsent() === null);
  const [settings, setSettings] = useState(false);

  useEffect(() => {
    const reopen = () => { setOpen(true); setSettings(true); };
    window.addEventListener(COOKIE_SETTINGS_EVENT, reopen);
    return () => window.removeEventListener(COOKIE_SETTINGS_EVENT, reopen);
  }, []);

  const choose = (choice: "accepted" | "declined") => {
    setConsent(choice);
    setMarketingConsent(choice);
    if (choice === "accepted") onConsentAccepted();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Cookie consent"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-phantix-950/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur"
        >
          {settings ? (
            <div className="mx-auto max-w-2xl">
              <div className="mb-2.5 flex items-center justify-between gap-3">
                <p className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Cookie size={16} className="text-gold-400" /> Cookie settings
                </p>
                <button
                  type="button"
                  aria-label="Close cookie settings"
                  className="rounded-md p-1.5 text-slate-400 hover:bg-white/5 hover:text-white"
                  onClick={() => (getConsent() === null || getMarketingConsent() === null ? setSettings(false) : setOpen(false))}
                >
                  <X size={16} />
                </button>
              </div>
              <CookiePreferences onSaved={() => { setSettings(false); setOpen(false); }} />
            </div>
          ) : (
            <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center">
              <div className="flex items-start gap-2.5 sm:contents">
                <Cookie size={16} className="mt-0.5 shrink-0 text-gold-400 sm:mt-0" />
                <p className="min-w-0 flex-1 text-[13px] leading-5 text-slate-300">
                  We use cookies and analytics to understand how our site is used and to improve your experience.
                  You can accept, decline, or choose what to allow. Read our{" "}
                  <Link to={COOKIE_POLICY_PATH} className="text-gold-400 underline hover:text-gold-300">
                    cookie policy
                  </Link>
                  .
                </p>
              </div>
              <div className="flex w-full shrink-0 flex-wrap items-center gap-2 sm:w-auto">
                <button className="btn-ghost flex-1 !px-3 !py-2 text-[13px] sm:flex-none" onClick={() => setSettings(true)}>
                  Cookie settings
                </button>
                <button className="btn-secondary flex-1 !px-3 !py-2 text-[13px] sm:flex-none" onClick={() => choose("declined")}>
                  Decline
                </button>
                <button className="btn-primary flex-1 !px-3 !py-2 text-[13px] sm:flex-none" onClick={() => choose("accepted")}>
                  Accept all
                </button>
              </div>
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
