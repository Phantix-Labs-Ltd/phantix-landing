import { useState } from "react";
import { getConsent, getMarketingConsent, setConsent, setMarketingConsent } from "@/lib/consent";
import { onConsentAccepted } from "@/lib/analytics";
import { loadPageSense } from "@/lib/pagesense";
import { cx } from "@/lib/utils";

// ── Cookie settings: one switch per optional category ───────────────────────
// Used by the consent banner ("Cookie settings") and by the /cookies page, so a
// visitor can opt out of either category at any time.

type Category = { key: "analytics" | "marketing"; title: string; detail: string };

const CATEGORIES: Category[] = [
  {
    key: "analytics",
    title: "Analytics",
    detail: "Counts page views so we know which pages are useful. No cookies, no personal data.",
  },
  {
    key: "marketing",
    title: "Marketing and experience",
    detail: "Third-party tools that show how visitors use the site, such as heatmaps and session recordings. These set cookies.",
  },
];

export default function CookiePreferences({ onSaved, className }: { onSaved?: () => void; className?: string }) {
  const [on, setOn] = useState({
    analytics: getConsent() === "accepted",
    marketing: getMarketingConsent() === "accepted",
  });

  const save = () => {
    const wasOn = { analytics: getConsent() === "accepted", marketing: getMarketingConsent() === "accepted" };
    setConsent(on.analytics ? "accepted" : "declined");
    setMarketingConsent(on.marketing ? "accepted" : "declined");
    // A loaded script can't be unloaded: turning a category off takes effect on
    // a fresh page.
    if ((wasOn.analytics && !on.analytics) || (wasOn.marketing && !on.marketing)) {
      window.location.reload();
      return;
    }
    if (on.analytics) onConsentAccepted();
    else loadPageSense();
    onSaved?.();
  };

  return (
    <div className={cx("space-y-2.5", className)}>
      <div className="flex items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5">
        <div className="min-w-0">
          <p className="text-[13px] font-semibold text-slate-200">Strictly necessary</p>
          <p className="text-[12px] leading-5 text-slate-400">Remember this choice and keep the site working. Always on.</p>
        </div>
        <span className="shrink-0 text-[12px] font-medium text-slate-500">Always on</span>
      </div>
      {CATEGORIES.map((c) => (
        <label
          key={c.key}
          className="flex cursor-pointer items-start justify-between gap-3 rounded-lg border border-white/10 bg-white/[0.03] px-3 py-2.5 hover:border-white/20"
        >
          <span className="min-w-0">
            <span className="block text-[13px] font-semibold text-slate-200">{c.title}</span>
            <span className="block text-[12px] leading-5 text-slate-400">{c.detail}</span>
          </span>
          <input
            type="checkbox"
            role="switch"
            aria-label={c.title}
            className="mt-1 h-4 w-4 shrink-0 accent-gold-400"
            checked={on[c.key]}
            onChange={(e) => setOn((v) => ({ ...v, [c.key]: e.target.checked }))}
          />
        </label>
      ))}
      <div className="flex justify-end pt-1">
        <button type="button" className="btn-primary !px-3 !py-2 text-[13px]" onClick={save}>
          Save preferences
        </button>
      </div>
    </div>
  );
}
