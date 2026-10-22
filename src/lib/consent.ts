// ── Analytics consent (cookies & analytics policy) ───────────────────────────
// Analytics is first-party and cookieless, but it is still gated on explicit
// acceptance: no beacon is sent until the operator says yes. The choice is
// stored locally and never leaves the browser.
//
// Every Phantix surface lives on the same parent domain (the landing page,
// platform., app., attack., defend., code.), and localStorage is per-origin —
// so the choice is kept in one preference cookie there, answered once for all.

export type ConsentChoice = "accepted" | "declined";

const KEY = "phantix_cookie_consent";
const ONE_YEAR = 60 * 60 * 24 * 365;

function readCookie(key: string = KEY): string | null {
  try {
    const hit = document.cookie.split("; ").find((c) => c.startsWith(`${key}=`));
    return hit ? decodeURIComponent(hit.slice(key.length + 1)) : null;
  } catch {
    return null;
  }
}

/** Broadest domain the browser accepts, e.g. ".phantixlabs.com"; null = host-only. */
function parentDomains(): string[] {
  const host = window.location.hostname;
  if (!host.includes(".") || /^[\d.]+$/.test(host) || host.includes(":")) return [];
  const labels = host.split(".");
  const out: string[] = [];
  for (let i = labels.length - 2; i >= 0; i--) out.push(`.${labels.slice(i).join(".")}`);
  return out;
}

function writeCookie(value: string, maxAge: number, key: string = KEY): void {
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  const base = `${key}=${encodeURIComponent(value)}; Path=/; Max-Age=${maxAge}; SameSite=Lax${secure}`;
  // A public suffix (e.g. vercel.app) is rejected silently, so verify each try.
  for (const domain of parentDomains()) {
    document.cookie = `${base}; Domain=${domain}`;
    if (maxAge > 0 ? readCookie(key) === value : readCookie(key) === null) return;
  }
  document.cookie = base;
}

export function getConsent(): ConsentChoice | null {
  const fromCookie = readCookie();
  if (fromCookie === "accepted" || fromCookie === "declined") return fromCookie;
  // A choice made before consent moved to the shared cookie: promote it.
  try {
    if (typeof window === "undefined") return null;
    const legacy = window.localStorage.getItem(KEY);
    if (legacy === "accepted" || legacy === "declined") {
      setConsent(legacy);
      return legacy;
    }
  } catch {
    /* storage disabled */
  }
  return null;
}

export function setConsent(choice: ConsentChoice): void {
  try {
    writeCookie(choice, ONE_YEAR);
    localStorage.removeItem(KEY);
  } catch {
    /* cookies disabled — the banner will simply reappear */
  }
}

/** Withdraw a previous choice and let the operator decide again. */
export function clearConsent(): void {
  try {
    writeCookie("", 0);
    writeCookie("", 0, MARKETING_KEY);
    localStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
}

export const COOKIE_POLICY_PATH = "/cookies";

// ── Marketing analytics consent (Zoho PageSense) ─────────────────────────────
// Separate from the analytics choice above, which every Phantix app shares and
// which only ever covered first-party, cookieless counting. PageSense is a third
// party that sets its own cookies and records page interactions, so it needs its
// own yes, asked only by the landing and blog banners that name it.

const MARKETING_KEY = "phantix_marketing_consent";

export function getMarketingConsent(): ConsentChoice | null {
  const v = readCookie(MARKETING_KEY);
  return v === "accepted" || v === "declined" ? v : null;
}

export function setMarketingConsent(choice: ConsentChoice): void {
  try {
    writeCookie(choice, ONE_YEAR, MARKETING_KEY);
  } catch {
    /* cookies disabled — the banner will simply reappear */
  }
}
