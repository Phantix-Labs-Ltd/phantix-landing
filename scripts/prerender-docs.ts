// Static /securegraph/docs page for crawlers and answer engines.
//
// The site is a client-rendered SPA, so a crawler that does not run JavaScript
// gets an empty <div id="root">. After the build, this renders the real docs
// page to HTML (the same component the browser runs, so the two cannot drift)
// and writes dist/securegraph/docs/index.html with the title, description,
// canonical URL and JSON-LD baked into the head. Vercel serves that file for
// /securegraph/docs before the SPA rewrite; React's createRoot replaces the
// markup on mount, so browsers see the normal page.
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

export function prerenderDocs(): Plugin {
  let root = process.cwd();
  let outDir = "dist";
  return {
    name: "prerender-docs",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      // A throwaway dev server in SSR mode loads the TSX page with the app's
      // own aliases and transforms. It does not listen on a port.
      const { createServer } = await import("vite");
      const server = await createServer({
        root,
        configFile: path.join(root, "vite.config.ts"),
        logLevel: "error",
        // Its own dependency cache: sharing node_modules/.vite re-optimized the
        // deps under a running `npm run dev`, whose tab then got 504 "Outdated
        // Optimize Dep" on every module.
        cacheDir: "node_modules/.vite-prerender",
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, hmr: false },
        appType: "custom",
      });
      try {
        const seo = await server.ssrLoadModule("/src/ssr/docs.tsx");
        const body: string = seo.render();
        const graph = { "@context": "https://schema.org", "@graph": seo.docsJsonLd() };
        const jsonLd = `<script type="application/ld+json">${JSON.stringify(graph).replace(/</g, "\\u003c")}</script>`;

        const shell = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
        const title = esc(seo.DOCS_TITLE);
        const description = esc(seo.DOCS_DESCRIPTION);
        const html = shell
          .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
          .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${seo.DOCS_URL}$2`)
          .replace(/(<meta property="og:type" content=")[^"]*(")/, `$1article$2`)
          .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${seo.DOCS_URL}$2`)
          .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
          .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
          .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
          .replace("</head>", `  ${jsonLd}\n  </head>`)
          .replace('<div id="root"></div>', `<div id="root"><div data-prerendered>${body}</div></div>`);
        if (!html.includes('id="what-is"')) throw new Error("prerender-docs: could not inject into #root");
        const dir = path.join(outDir, ...seo.DOCS_PATH.split("/").filter(Boolean));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      } finally {
        await server.close();
      }
    },
  };
}
