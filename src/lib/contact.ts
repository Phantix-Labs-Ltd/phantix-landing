// Public contact form — POST /api/v1/contact.
//
// Contract (backend: app/engines/control_plane/api/contact.py):
//   POST /api/v1/contact
//   { name, email, company?, phone?, topic?, message, source, path, referrer, utm?, ts?, turnstile_token? }
//   → 201 { ok: true, id }            on success
//   → 400 { detail: "captcha_failed" } when the bot check fails
//
// A submission is persisted, instantly emailed to the team, and instantly
// pushed to the team WhatsApp recipients. The result object is returned rather
// than thrown so the form can distinguish a captcha failure from a network
// failure and still offer the direct email / WhatsApp fallbacks.
import { API_BASE } from "./config";

export interface ContactPayload {
  name: string;
  email: string;
  company?: string;
  phone?: string;
  /** Short bucket, e.g. "sales" | "support" | "security" | "partnership" | "other". */
  topic?: string;
  message: string;
  /** Where the form was opened, e.g. "contact-page" | "company-cta". */
  source: string;
  turnstile_token?: string;
}

export type ContactResult =
  | { ok: true }
  | { ok: false; code: "captcha" | "network" | "server"; error: string };

export const CONTACT_TOPICS = [
  "Sales and prices",
  "Product and technical",
  "Security and compliance",
  "Partnership",
  "Support",
  "Other",
] as const;

function utmParams(): Record<string, string> | null {
  const params = new URLSearchParams(window.location.search);
  const utm: Record<string, string> = {};
  for (const key of ["utm_source", "utm_medium", "utm_campaign", "utm_term", "utm_content"]) {
    const v = params.get(key);
    if (v) utm[key] = v;
  }
  return Object.keys(utm).length ? utm : null;
}

function topicKey(label: string): string {
  return label.toLowerCase().split(" ")[0];
}

export async function submitContact(payload: ContactPayload): Promise<ContactResult> {
  const body = JSON.stringify({
    ...payload,
    topic: payload.topic ? topicKey(payload.topic) : undefined,
    path: `${window.location.pathname}${window.location.hash || ""}`,
    referrer: document.referrer || null,
    utm: utmParams(),
    ts: Date.now(),
  });

  let res: Response;
  try {
    res = await fetch(`${API_BASE}/contact`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
    });
  } catch {
    return { ok: false, code: "network", error: "network" };
  }

  if (res.ok) return { ok: true };
  if (res.status === 400) return { ok: false, code: "captcha", error: "captcha_failed" };
  return { ok: false, code: "server", error: `HTTP ${res.status}` };
}
