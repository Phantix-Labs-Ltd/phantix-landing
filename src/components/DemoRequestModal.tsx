import React, { useEffect, useId, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, Loader2, X } from "lucide-react";
import { submitDemoRequest } from "@/lib/demo-requests";

/*
 * Lead-capture popup for "Request a live demo". Opened from the product demo
 * tour (on completion or on explicit CTA) and from any "Request a demo" link
 * across the site. Self-contained: no dependency on Radix (not installed in
 * the landing package), so overlay/focus/escape handling is done by hand.
 */

/** Contract buckets for POST /demo-requests (staging-rollout §3). */
const TEAM_SIZES = ["1-10", "11-50", "51-200", "200+"];

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface Props {
  open: boolean;
  onClose: () => void;
  /** Funnel context sent with the lead, e.g. "demo-tour-complete" | "pricing-most-requested-full-vapt". */
  source: string;
  /** Optional heading override (e.g. Most requested card title). */
  title?: string;
  /** Prefill the message field (interest tag + optional note). */
  defaultMessage?: string;
}

type Status = "idle" | "submitting" | "success" | "error";

export function DemoRequestModal({ open, onClose, source, title, defaultMessage }: Props) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [teamSize, setTeamSize] = useState(TEAM_SIZES[0]);
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [fieldError, setFieldError] = useState<string | null>(null);

  const firstFieldRef = useRef<HTMLInputElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const titleId = useId();

  // Reset to a clean form each time the popup is (re)opened, and focus the
  // first field so keyboard users land straight in the form.
  useEffect(() => {
    if (!open) return;
    setName("");
    setEmail("");
    setCompany("");
    setTeamSize(TEAM_SIZES[0]);
    setPhone("");
    setMessage(defaultMessage ?? "");
    setStatus("idle");
    setFieldError(null);
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, [open, defaultMessage]);

  // Escape to close, body scroll lock while open.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && status !== "submitting") onClose();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, status]);

  const close = () => {
    if (status === "submitting") return;
    onClose();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;

    if (!name.trim() || !company.trim()) {
      setFieldError("Name and company are required.");
      return;
    }
    if (!EMAIL_RE.test(email.trim())) {
      setFieldError("Enter a valid work email.");
      return;
    }
    setFieldError(null);
    setStatus("submitting");
    try {
      await submitDemoRequest({
        name: name.trim(),
        email: email.trim(),
        company: company.trim(),
        teamSize,
        phone: phone.trim() || undefined,
        message: message.trim() || undefined,
        source,
      });
      setStatus("success");
    } catch {
      setStatus("error");
    }
  };

  return createPortal(
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          <motion.div
            aria-hidden
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={close}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />

          <motion.div
            ref={panelRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            className="card relative z-10 w-full max-w-md overflow-hidden p-0"
            initial={{ opacity: 0, y: 16, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.98 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <button
              type="button"
              onClick={close}
              aria-label="Close"
              className="absolute right-4 top-4 z-10 inline-flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-phantix-800/70 hover:text-white"
            >
              <X size={16} />
            </button>

            {status === "success" ? (
              <div className="flex flex-col items-center px-8 py-12 text-center">
                <span className="flex h-12 w-12 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 size={24} />
                </span>
                <h2 id={titleId} className="mt-5 font-display text-xl font-semibold text-white">
                  Request received
                </h2>
                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-400">
                  Thanks, {name.split(" ")[0]}. Someone from our team will reach out to{" "}
                  <span className="text-slate-200">{email}</span> to schedule your live demo.
                </p>
                <button type="button" onClick={close} className="btn-primary mt-7 !px-6">
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="p-8">
                <p className="eyebrow text-gold-400">
                  {title ? "Most requested" : "Request a live demo"}
                </p>
                <h2 id={titleId} className="mt-2 font-display text-xl font-semibold text-white">
                  {title ?? "Talk to the team behind SecureGraph"}
                </h2>
                <p className="mt-2 text-[13px] leading-5 text-slate-400">
                  {title
                    ? "Share your details and we will follow up about this engagement."
                    : "Tell us about yourself and we will set up a walkthrough for your stack."}
                </p>

                <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-1">
                    <label className="label" htmlFor="demo-name">Full name</label>
                    <input
                      ref={firstFieldRef}
                      id="demo-name"
                      className="input"
                      placeholder="Ada Okafor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label" htmlFor="demo-email">Work email</label>
                    <input
                      id="demo-email"
                      type="email"
                      className="input"
                      placeholder="ada@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label" htmlFor="demo-company">Company</label>
                    <input
                      id="demo-company"
                      className="input"
                      placeholder="Company name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="organization"
                      required
                    />
                  </div>
                  <div className="sm:col-span-1">
                    <label className="label" htmlFor="demo-size">Team size</label>
                    <select
                      id="demo-size"
                      className="input"
                      value={teamSize}
                      onChange={(e) => setTeamSize(e.target.value)}
                    >
                      {TEAM_SIZES.map((s) => (
                        <option key={s} value={s}>{s} employees</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="demo-phone">Phone, optional</label>
                    <input
                      id="demo-phone"
                      type="tel"
                      className="input"
                      placeholder="+234 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="demo-message">What would you like to see? This field is optional.</label>
                    <textarea
                      id="demo-message"
                      className="input min-h-[72px] resize-none"
                      placeholder="VAPT campaigns, the AI pentest agent, compliance mapping..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                    />
                  </div>
                </div>

                {fieldError && (
                  <p className="mt-4 rounded-lg border border-severity-critical/30 bg-severity-critical/10 px-3 py-2 text-[13px] text-severity-critical">
                    {fieldError}
                  </p>
                )}
                {status === "error" && (
                  <p className="mt-4 rounded-lg border border-severity-critical/30 bg-severity-critical/10 px-3 py-2 text-[13px] text-severity-critical">
                    We could not send your request. Try again.
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary btn-shine mt-6 w-full !py-3"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    "Request a live demo"
                  )}
                </button>
                <p className="mt-3 text-center text-[12px] leading-4 text-slate-600">
                  No spam. We use this information only to contact you about your demo.
                </p>
              </form>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
