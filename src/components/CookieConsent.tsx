import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Cookie } from "lucide-react";
import { COOKIE_POLICY_PATH, getConsent, setConsent } from "@/lib/consent";
import { onConsentAccepted } from "@/lib/analytics";

// ── Analytics consent banner (landing) ───────────────────────────────────────

export default function CookieConsent() {
  const [open, setOpen] = useState(() => getConsent() === null);

  const choose = (choice: "accepted" | "declined") => {
    setConsent(choice);
    if (choice === "accepted") onConsentAccepted();
    setOpen(false);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-live="polite"
          aria-label="Analytics consent"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-x-0 bottom-0 z-[70] border-t border-white/10 bg-phantix-950/95 px-4 py-3 shadow-2xl shadow-black/50 backdrop-blur"
        >
          <div className="mx-auto flex max-w-6xl flex-col items-start gap-3 sm:flex-row sm:items-center">
            <div className="flex items-start gap-2.5 sm:contents">
              <Cookie size={16} className="mt-0.5 shrink-0 text-gold-400 sm:mt-0" />
              <p className="min-w-0 flex-1 text-[13px] leading-5 text-slate-300">
                We use <strong className="text-slate-200">first-party analytics</strong> to learn which pages are
                useful. We collect the page path, the referrer, and general device information. We set no cookies
                that track you, we use no fingerprints, and we collect no personal data. Your choice applies to
                every Phantix app. Read our{" "}
                <Link to={COOKIE_POLICY_PATH} className="text-gold-400 underline hover:text-gold-300">
                  cookies and analytics policy
                </Link>
                .
              </p>
            </div>
            <div className="flex w-full shrink-0 items-center gap-2 sm:w-auto">
              <button className="btn-secondary flex-1 !px-3 !py-2 text-[13px] sm:flex-none" onClick={() => choose("declined")}>
                Decline analytics
              </button>
              <button className="btn-primary flex-1 !px-3 !py-2 text-[13px] sm:flex-none" onClick={() => choose("accepted")}>
                Accept analytics
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
