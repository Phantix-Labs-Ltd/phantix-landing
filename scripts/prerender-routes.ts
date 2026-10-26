// Static head + crawlable body for every marketing route.
//
// The site is a client-rendered SPA: before this, a fetch of /pricing (or any
// route but /company and /securegraph/docs) returned the home page's title,
// description and `canonical=/`, and an empty <div id="root">. Search engines
// read that as eighteen copies of the home page, which is also why a brand
// search showed no sitelinks. After the build, this writes
// dist/<route>/index.html for each route in src/lib/routeSeo.ts with the
// route's own title, description, canonical URL, social tags and a
// BreadcrumbList, and the page itself inside #root. Vercel serves that file;
// React's createRoot replaces the markup on mount, so browsers see the normal
// page. /company keeps its richer prerender (prerender-company.ts).
//
// The body is the real page: a throwaway Vite server in SSR mode loads
// src/ssr/pages.tsx and renders the route's component, so an AI crawler that
// does not run JavaScript reads the same copy a visitor does (it used to get
// the heading and one-line summary, about 70 words). A page that cannot render
// on the server, or renders under MIN_WORDS (nav and footer included), falls
// back to that summary with a warning, so one bad page never breaks the
// deploy. The build log lists the words per page; "summary only" there is the
// regression to look for.
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { ROUTE_SEO, SITE_URL, type RouteSeo } from "../src/lib/routeSeo";

const OWN_PRERENDER = new Set(["/company"]);

/** A rendered page shorter than this is treated as a regression. */
const MIN_WORDS = 150;

const wordCount = (html: string) =>
  html
    .replace(/<(script|style)[\s\S]*?<\/\1>/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&[a-z#0-9]+;/gi, " ")
    .split(/\s+/)
    .filter(Boolean).length;

export const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const ROUTES = Object.entries(ROUTE_SEO) as [string, RouteSeo][];

/** Every page of the site, so a crawler can reach each one from any other. */
export function siteLinks(): string {
  const links: [string, string][] = [
    ["/", "SecureGraph home"],
    ...ROUTES.map(([p, r]) => [p, r.label] as [string, string]),
    ["/securegraph/docs", "Documentation"],
  ];
  return links.map(([href, label]) => `<li><a href="${href}">${esc(label)}</a></li>`).join("");
}

function breadcrumbs(route: string, seo: RouteSeo): string {
  // Two levels: /platform and /solutions have no page of their own, so a
  // middle crumb would point at a 404.
  const items = [
    { name: "SecureGraph", url: `${SITE_URL}/` },
    { name: seo.label, url: `${SITE_URL}${route}` },
  ];
  const data = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: it.url })),
  };
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

/** The fallback body: heading, summary and the site link list. */
function summaryBody(seo: RouteSeo): string {
  return `<main>
    <h1>${esc(seo.heading)}</h1>
    <p>${esc(seo.description)}</p>
    <nav aria-label="SecureGraph"><ul>${siteLinks()}</ul></nav>
  </main>`;
}

function renderRoute(shell: string, route: string, seo: RouteSeo, body: string): string {
  const url = `${SITE_URL}${route}`;
  const title = esc(seo.title);
  const description = esc(seo.description);
  return shell
    .replace(/<title>[^<]*<\/title>/, `<title>${title}</title>`)
    .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${url}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace(/(<meta name="twitter:title" content=")[^"]*(")/, `$1${title}$2`)
    .replace(/(<meta name="twitter:description" content=")[^"]*(")/, `$1${description}$2`)
    .replace("</head>", `  ${breadcrumbs(route, seo)}\n  </head>`)
    .replace('<div id="root"></div>', `<div id="root">${body}</div>`);
}

export function prerenderRoutes(): Plugin {
  let outDir = "dist";
  let root = process.cwd();
  return {
    name: "prerender-routes",
    apply: "build",
    configResolved(config) {
      root = config.root;
      outDir = path.resolve(config.root, config.build.outDir);
    },
    async closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      // Same setup as prerender-docs.ts, with its own dependency cache: the two
      // servers run at once and must not re-optimize each other's deps.
      const { createServer } = await import("vite");
      const server = await createServer({
        root,
        configFile: path.join(root, "vite.config.ts"),
        logLevel: "error",
        cacheDir: "node_modules/.vite-prerender-routes",
        optimizeDeps: { noDiscovery: true, include: [] },
        server: { middlewareMode: true, hmr: false, ws: false },
        appType: "custom",
      });
      const report: string[] = [];
      try {
        const pages = await server.ssrLoadModule("/src/ssr/pages.tsx");
        await pages.loadData();
        for (const [route, seo] of ROUTES) {
          if (OWN_PRERENDER.has(route)) continue;
          let body: string;
          try {
            body = pages.render(route) as string;
            const words = wordCount(body);
            if (words < MIN_WORDS) throw new Error(`rendered only ${words} words (minimum ${MIN_WORDS})`);
            report.push(`${route} ${words}`);
          } catch (error) {
            console.warn(`prerender-routes: ${route} did not render fully on the server, using its summary: ${String(error)}`);
            body = summaryBody(seo);
            report.push(`${route} summary only`);
          }
          const html = renderRoute(shell, route, seo, body);
          if (!html.includes(`href="${SITE_URL}${route}"`) || !/<h1[\s>]/.test(html)) {
            throw new Error(`prerender-routes: could not inject ${route}`);
          }
          const dir = path.join(outDir, ...route.split("/").filter(Boolean));
          fs.mkdirSync(dir, { recursive: true });
          fs.writeFileSync(path.join(dir, "index.html"), html);
        }
      } finally {
        await server.close();
      }
      console.log(`prerender-routes: words per page\n  ${report.join("\n  ")}`);
    },
  };
}
