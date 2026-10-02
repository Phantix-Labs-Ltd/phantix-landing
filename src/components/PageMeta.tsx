import React from "react";

/*
 * PageMeta — per-route <title>, description and social tags.
 *
 * The app is a client-rendered SPA with one static <head> in index.html and a
 * single global canonical/og:url writer (`useCanonicalUrl`). Before this, only
 * NotFound touched the head. This component gives every standalone page its own
 * title, description and (optionally) JSON-LD without adding a head manager
 * dependency: it mutates the existing tags on mount and restores them on
 * unmount so navigating back to the home page does not inherit the last page's
 * metadata.
 */

export interface PageMetaProps {
  /** Full document title. */
  title: string;
  description: string;
  /** Extra JSON-LD graph node(s) for this route only. */
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
  /** Set to true for pages that must not be indexed. */
  noindex?: boolean;
}

function upsertMeta(attr: "name" | "property", key: string, content: string): () => void {
  const selector = `meta[${attr}="${key}"]`;
  const existing = document.head.querySelector<HTMLMetaElement>(selector);
  const created = !existing;
  const el = existing ?? document.createElement("meta");
  const previous = el.getAttribute("content");
  el.setAttribute(attr, key);
  el.setAttribute("content", content);
  if (created) document.head.appendChild(el);
  return () => {
    if (created) el.remove();
    else if (previous !== null) el.setAttribute("content", previous);
  };
}

export function PageMeta({ title, description, jsonLd, noindex }: PageMetaProps) {
  // The jsonLd object literal is new on every render. Serializing it gives the
  // effect a primitive dependency, so a keystroke in a form on the page does not
  // re-run this effect (and re-inject the script) on every state change.
  const jsonLdKey = React.useMemo(() => (jsonLd ? JSON.stringify(jsonLd) : ""), [jsonLd]);

  React.useEffect(() => {
    const restore: Array<() => void> = [];
    const previousTitle = document.title;
    document.title = title;

    restore.push(
      upsertMeta("name", "description", description),
      upsertMeta("property", "og:title", title),
      upsertMeta("property", "og:description", description),
      upsertMeta("name", "twitter:title", title),
      upsertMeta("name", "twitter:description", description),
    );
    if (noindex) restore.push(upsertMeta("name", "robots", "noindex, nofollow"));

    let script: HTMLScriptElement | null = null;
    if (jsonLdKey) {
      script = document.createElement("script");
      script.type = "application/ld+json";
      script.dataset.pageMeta = "true";
      const parsed = JSON.parse(jsonLdKey) as Record<string, unknown> | Record<string, unknown>[];
      const graph = Array.isArray(parsed) ? parsed : [parsed];
      script.textContent = JSON.stringify({ "@context": "https://schema.org", "@graph": graph });
      document.head.appendChild(script);
    }

    return () => {
      document.title = previousTitle;
      restore.forEach((fn) => fn());
      script?.remove();
    };
  }, [title, description, noindex, jsonLdKey]);

  return null;
}

export default PageMeta;
