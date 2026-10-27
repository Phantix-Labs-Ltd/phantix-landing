// Crawlable body for the home page.
//
// dist/index.html shipped an empty <div id="root">: about ten words and no
// <h1> for any crawler that does not run JavaScript, which is most AI crawlers
// and Google's first pass. That is the page a brand search lands on. This
// writes the hero heading and lead, the FAQ and the site link list into #root,
// plus the FAQPage node under the same id <FAQ> uses, so the client replaces it
// on mount instead of adding a second one. React's createRoot replaces the
// markup, so browsers see the normal page.
//
// It must run last: the other prerender plugins read dist/index.html as their
// shell and look for the empty #root. prerender-docs is async, so ordering the
// plugins in vite.config.ts is not enough; `order: "post"` with
// `sequential: true` waits for every other closeBundle to finish.
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { HOME_SEO } from "../src/lib/routeSeo";
import { faqs } from "../src/lib/faqs";
import { esc, siteLinks } from "./prerender-routes";

const paragraphs = (text: string) =>
  text
    .split(/\n{2,}/)
    .map((p) => `<p>${esc(p.trim())}</p>`)
    .join("");

function body(): string {
  const faq = faqs.map((f) => `<h3>${esc(f.q)}</h3>${paragraphs(f.a)}`).join("");
  return `<main>
    <p>SecureGraph by Phantix Labs</p>
    <h1>${esc(HOME_SEO.heading)}</h1>
    <p>${esc(HOME_SEO.summary)}</p>
    <section><h2>Frequently asked questions</h2>${faq}</section>
    <nav aria-label="SecureGraph"><ul>${siteLinks()}</ul></nav>
  </main>`;
}

function faqJsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a.replace(/\s*\n+\s*/g, " ").trim() },
    })),
  };
  return `<script type="application/ld+json" id="faq-page-schema">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function prerenderHome(): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-home",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle: {
      order: "post",
      sequential: true,
      handler() {
        const file = path.join(outDir, "index.html");
        const shell = fs.readFileSync(file, "utf8");
        if (!shell.includes('<div id="root"></div>')) {
          throw new Error("prerender-home: #root is not empty in dist/index.html");
        }
        // Every route has its own file, so vercel.json no longer rewrites
        // unknown paths to the home page (a 200 with the home canonical, which
        // Search Console reads as a soft 404 or a duplicate). Vercel answers
        // them with this file and a 404 status; the app still mounts and shows
        // <NotFound />.
        fs.writeFileSync(
          path.join(outDir, "404.html"),
          shell
            .replace(/\s*<link rel="canonical"[^>]*>/, "")
            .replace(/<meta\s+name="robots"[^>]*>/, '<meta name="robots" content="noindex" />'),
        );
        const html = shell
          .replace("</head>", `  ${faqJsonLd()}\n  </head>`)
          .replace('<div id="root"></div>', `<div id="root"><div data-prerendered>${body()}</div></div>`);
        fs.writeFileSync(file, html);
      },
    },
  };
}
