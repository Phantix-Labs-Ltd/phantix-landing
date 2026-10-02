import React from "react";
import { useSearchParams } from "react-router-dom";
import { motion } from "framer-motion";
import {
  AlertCircle, ArrowRight, CheckCircle2, Clock, Loader2, Lock,
  Mail, MessageCircle, Send, ShieldAlert, ShieldCheck,
} from "lucide-react";
import PageShell from "@/components/PageShell";
import { BackLink } from "@/components/BackLink";
import { Section, fadeUp } from "@/components/Section";
import { GlowBloom } from "@/components/effects";
import PageMeta from "@/components/PageMeta";
import { COMPANY, whatsappLink } from "@/lib/company";
import { CONTACT_TOPICS, submitContact } from "@/lib/contact";
import { TURNSTILE_SITE_KEY } from "@/lib/config";

/*
 * /contact: the public contact page.
 *
 * A message goes to POST /api/v1/contact. That endpoint keeps the message, sends
 * an email to the team, and sends a WhatsApp alert to the team immediately. This
 * page also shows the email address and, when configured, a WhatsApp chat link.
 * Thus, a visitor is never blocked if the API is not available.
 *
 * The text uses ASD-STE100 Simplified Technical English.
 */

const EMAIL = COMPANY.contactEmails[0] ?? "contact@phantixlabs.com";

type Status = "idle" | "submitting" | "success" | "error";

/** Cloudflare Turnstile. The code renders it in the form. */
function TurnstileWidget({ onToken }: { onToken: (token: string) => void }) {
  const ref = React.useRef<HTMLDivElement>(null);
  const widgetId = React.useRef<string | null>(null);

  React.useEffect(() => {
    let stop = false;
    let tries = 0;
    const attach = () => {
      if (stop) return;
      const ts = (window as unknown as { turnstile?: any }).turnstile;
      if (!ts || !ref.current || widgetId.current) {
        if (!stop && tries++ < 40 && !widgetId.current) window.setTimeout(attach, 250);
        return;
      }
      try {
        widgetId.current = ts.render(ref.current, {
          sitekey: TURNSTILE_SITE_KEY,
          theme: "dark",
          callback: (t: string) => onToken(t),
          "error-callback": () => onToken(""),
          "expired-callback": () => onToken(""),
        });
      } catch {
        /* The widget is not available. The server does the check when configured. */
      }
    };
    attach();
    return () => {
      stop = true;
      const ts = (window as unknown as { turnstile?: any }).turnstile;
      if (widgetId.current && ts?.remove) {
        try {
          ts.remove(widgetId.current);
        } catch {
          /* ignore */
        }
      }
      widgetId.current = null;
    };
  }, [onToken]);

  return <div ref={ref} className="mt-2" />;
}

export default function Contact() {
  const [params] = useSearchParams();
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [company, setCompany] = React.useState("");
  const [phone, setPhone] = React.useState("");
  const [topic, setTopic] = React.useState<string>(CONTACT_TOPICS[0]);
  const [message, setMessage] = React.useState(params.get("topic") ?? "");
  const [website, setWebsite] = React.useState(""); // honeypot
  const [token, setToken] = React.useState("");
  const [status, setStatus] = React.useState<Status>("idle");
  const [error, setError] = React.useState("");

  const wa = whatsappLink(
    `Hello SecureGraph. Topic: ${topic.toLowerCase()}.`,
  );

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status === "submitting" || status === "success") return;
    if (website.trim()) {
      // A bot completed the hidden field. Show a success message and do nothing.
      setStatus("success");
      return;
    }
    setStatus("submitting");
    setError("");
    const res = await submitContact({
      name: name.trim(),
      email: email.trim(),
      company: company.trim() || undefined,
      phone: phone.trim() || undefined,
      topic,
      message: message.trim(),
      source: "contact-page",
      turnstile_token: token || undefined,
    });
    if (res.ok) {
      setStatus("success");
      return;
    }
    setStatus("error");
    setError(
      res.code === "captcha"
        ? "The bot check failed. Refresh the page and try again, or send an email to us."
        : "We cannot send your message now. Send an email to us and we will answer it.",
    );
  };

  return (
    <PageShell>
      <PageMeta
        title="Contact SecureGraph | Phantix Labs"
        description="Contact the team that makes SecureGraph by form, email, or WhatsApp. Your message goes to the team immediately. A person answers you, not a ticket robot."
        jsonLd={{
          "@type": "ContactPage",
          "@id": "https://phantixlabs.com/contact#webpage",
          url: "https://phantixlabs.com/contact",
          name: "Contact SecureGraph",
          isPartOf: { "@id": "https://phantixlabs.com/#website" },
          about: { "@id": "https://phantixlabs.com/#product" },
        }}
      />

      <Section className="pb-14 pt-28 md:pt-36">
        <BackLink />
        <motion.div {...fadeUp} className="mt-10 max-w-3xl">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold-400/25 bg-gold-400/10 px-4 py-2 text-xs font-medium text-gold-300">
            <MessageCircle size={13} /> Contact
          </span>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-[1.1] tracking-tight text-white sm:text-5xl">
            Speak to the persons who make SecureGraph
          </h1>
          <p className="mt-5 max-w-2xl text-[15px] leading-7 text-slate-400">
            Ask us for prices, the autonomous pentest agent, the trust model, or a security review. Your
            message goes to our team immediately by email and by WhatsApp. Thus, a person answers you, not
            a ticket robot.
          </p>
        </motion.div>
      </Section>

      <Section className="relative pb-24">
        <GlowBloom className="-left-40 top-10 h-[420px] w-[420px]" tone="gold" />
        <div className="relative grid grid-cols-1 gap-6 lg:grid-cols-[1.35fr_1fr]">
          {/* Form */}
          <motion.div {...fadeUp} className="card overflow-hidden">
            {status === "success" ? (
              <div className="flex flex-col items-center px-8 py-20 text-center">
                <span className="flex h-14 w-14 items-center justify-center rounded-full border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                  <CheckCircle2 size={26} />
                </span>
                <h2 className="mt-6 font-display text-2xl font-semibold text-white">Message received</h2>
                <p className="mt-3 max-w-sm text-sm leading-6 text-slate-400">
                  Thank you{name ? `, ${name.split(" ")[0]}` : ""}. The team has your message. We will
                  answer you at <span className="text-slate-200">{email}</span> in a short time.
                </p>
                <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
                  <a href={`mailto:${EMAIL}`} className="btn-secondary !px-5 !py-2.5">
                    <Mail size={15} /> Send an email again
                  </a>
                  {wa && (
                    <a href={wa} target="_blank" rel="noopener noreferrer" className="btn-secondary !px-5 !py-2.5">
                      <MessageCircle size={15} /> WhatsApp
                    </a>
                  )}
                </div>
              </div>
            ) : (
              <form onSubmit={onSubmit} className="p-7 sm:p-9">
                <h2 className="font-display text-xl font-semibold text-white">Send a message to us</h2>
                <p className="mt-1.5 text-[13px] leading-5 text-slate-500">
                  You must complete each field with an asterisk. We reply in one business day.
                </p>

                <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="label" htmlFor="contact-name">Full name *</label>
                    <input
                      id="contact-name"
                      className="input"
                      placeholder="Ada Okafor"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      autoComplete="name"
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-email">Work email *</label>
                    <input
                      id="contact-email"
                      type="email"
                      className="input"
                      placeholder="ada@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-company">Organization</label>
                    <input
                      id="contact-company"
                      className="input"
                      placeholder="Organization name"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      autoComplete="organization"
                    />
                  </div>
                  <div>
                    <label className="label" htmlFor="contact-phone">Phone or WhatsApp</label>
                    <input
                      id="contact-phone"
                      type="tel"
                      className="input"
                      placeholder="+234 ..."
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      autoComplete="tel"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="contact-topic">What is the subject?</label>
                    <select
                      id="contact-topic"
                      className="input"
                      value={topic}
                      onChange={(e) => setTopic(e.target.value)}
                    >
                      {CONTACT_TOPICS.map((t) => (
                        <option key={t} value={t}>{t}</option>
                      ))}
                    </select>
                  </div>
                  <div className="sm:col-span-2">
                    <label className="label" htmlFor="contact-message">Message *</label>
                    <textarea
                      id="contact-message"
                      className="input min-h-[140px] resize-y"
                      placeholder="Tell us what you need. Include the scope, the time, and the compliance framework."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      required
                    />
                  </div>

                  {/* Honeypot. Hidden from persons, attractive to bots. */}
                  <div aria-hidden className="hidden">
                    <label htmlFor="contact-website">Website</label>
                    <input
                      id="contact-website"
                      tabIndex={-1}
                      autoComplete="off"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                    />
                  </div>
                </div>

                <TurnstileWidget onToken={setToken} />

                {error && (
                  <p className="mt-5 flex items-start gap-2 rounded-lg border border-severity-critical/30 bg-severity-critical/10 px-3.5 py-3 text-[13px] leading-6 text-severity-critical">
                    <AlertCircle size={15} className="mt-0.5 shrink-0" />
                    <span>
                      {error}{" "}
                      <a href={`mailto:${EMAIL}`} className="font-semibold underline underline-offset-2">
                        {EMAIL}
                      </a>
                    </span>
                  </p>
                )}

                <button
                  type="submit"
                  disabled={status === "submitting"}
                  className="btn-primary btn-shine mt-6 w-full !py-3.5"
                >
                  {status === "submitting" ? (
                    <>
                      <Loader2 size={16} className="animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} /> Send message
                    </>
                  )}
                </button>
                <p className="mt-3 flex items-center justify-center gap-1.5 text-center text-[12px] text-slate-600">
                  <Lock size={12} /> We use your data only to answer you. No lists. No unwanted email.
                </p>
              </form>
            )}
          </motion.div>

          {/* Direct channels */}
          <motion.div
            {...fadeUp}
            transition={{ ...fadeUp.transition, delay: 0.08 }}
            className="flex flex-col gap-4"
          >
            <a href={`mailto:${EMAIL}`} className="card-edge card-lift group block p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-gold-400/30 bg-gold-400/10 text-gold-300">
                <Mail size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">Email</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                Speak to the team directly. Use email for a detailed scope and for security questions.
              </p>
              <span className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-gold-400 group-hover:text-gold-300">
                {EMAIL} <ArrowRight size={13} />
              </span>
            </a>

            <div className="card-edge p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-emerald-400/30 bg-emerald-400/10 text-emerald-400">
                <MessageCircle size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">WhatsApp</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                The form above sends your message to our team on WhatsApp immediately.
              </p>
              {wa ? (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Chat on WhatsApp <ArrowRight size={13} />
                </a>
              ) : (
                <p className="mt-3 inline-flex items-center gap-1.5 text-[13px] text-slate-500">
                  <ShieldCheck size={13} className="text-emerald-400" />
                  Give us your number and we will answer you there.
                </p>
              )}
            </div>

            <div className="card-edge p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-phantix-700 bg-phantix-900 text-slate-300">
                <Clock size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">What to expect</h3>
              <ul className="mt-3 space-y-2.5 text-[13px] leading-6 text-slate-400">
                <li>One business day for the first answer.</li>
                <li>A person answers you, not a script. We tell you the next step.</li>
                <li>For a guided product tour, request a live demo.</li>
              </ul>
            </div>

            <div className="card-edge border-severity-critical/25 p-6">
              <span className="flex h-10 w-10 items-center justify-center rounded-md border border-severity-critical/30 bg-severity-critical/10 text-severity-critical">
                <ShieldAlert size={18} />
              </span>
              <h3 className="mt-4 font-display text-base font-semibold text-white">Report a vulnerability</h3>
              <p className="mt-1.5 text-[13px] leading-6 text-slate-500">
                If you think that you found a security problem in our systems, send an email to{" "}
                <a href={`mailto:${EMAIL}`} className="font-semibold text-slate-300 underline underline-offset-2">
                  {EMAIL}
                </a>{" "}
                with the steps to reproduce the problem. Give us time to answer before you tell other
                persons.
              </p>
            </div>
          </motion.div>
        </div>
      </Section>
    </PageShell>
  );
}
