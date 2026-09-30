/**
 * Free Test Pentest — landing Hero funnel client.
 *
 * Mirrors `demo-requests.ts`: same API base, same error shape. The endpoint is
 * public, but it is *owned*: the submission is attributed to the visitor's own
 * domain (`anonymous:<domain>`) and only runs once the work email at that domain
 * is verified. Nothing is scanned before then.
 */
import { API_BASE } from "./config";

export type TestPentestRequest = {
  asset: string;
  email: string;
  company?: string;
  name?: string;
  consent: boolean;
  turnstile_token?: string;
};

export type TestPentestResult =
  | { ok: true; status: string; message: string }
  | { ok: false; error: string };

/** Coarse, human-readable reasons. The API deliberately stays vague so it
 *  cannot be used to probe which domains are already in the system. */
const MESSAGES: Record<string, string> = {
  consent_required: "Confirm that you are authorized to test this asset.",
  invalid_asset: "Enter a valid domain or URL, for example app.example.com.",
  invalid_email: "Enter a valid work email address.",
  work_email_required: "Use your work email. A free mailbox cannot prove domain ownership.",
  email_domain_mismatch: "Your email must be on the same domain as the asset you want tested.",
  non_public_address: "That host is not publicly reachable. There is nothing for us to test.",
  ip_literal_not_allowed: "Enter a domain name rather than an IP address.",
  non_public_host: "That host is not publicly reachable.",
  unresolvable: "We cannot resolve that domain.",
  domain_already_tested: "This domain has already used its free test pentest.",
  opted_out: "This domain asked us not to test it.",
  capacity: "We are at capacity for today. We will email you when a slot is free.",
  budget: "We are at capacity for today. We will email you when a slot is free.",
  captcha_failed: "Complete the verification challenge and try again.",
  funnel_disabled: "The free test pentest is temporarily unavailable.",
};

export async function requestTestPentest(
  body: TestPentestRequest,
): Promise<TestPentestResult> {
  try {
    const res = await fetch(`${API_BASE}/funnel/test-pentest`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      const data = (await res.json().catch(() => ({}))) as { status?: string };
      return {
        ok: true,
        status: data.status ?? "pending_verification",
        message: "Check your inbox to confirm. We do not test anything until you confirm.",
      };
    }
    // FastAPI puts the reason in `detail`; it is a coarse code, not free text.
    const detail = (await res.json().catch(() => ({}))) as { detail?: string };
    const code = String(detail?.detail ?? "unknown");
    return { ok: false, error: MESSAGES[code] ?? "Something went wrong. Try again." };
  } catch {
    return { ok: false, error: "Network error. Try again." };
  }
}
