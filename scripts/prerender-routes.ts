// Static head + crawlable body for every marketing route.
//
// The site is a client-rendered SPA: before this, a fetch of /pricing (or any
// route but /company and /securegraph/docs) returned the home page's title,
// description and `canonical=/`, and an empty <div id="root">. Search engines
// read that as eighteen copies of the home page, which is also why a brand
// search showed no sitelinks. After the build, this writes
// dist/<route>/index.html for each route in src/lib/routeSeo.ts with the
// route's own title, description, canonical URL, social tags and a
// BreadcrumbList, plus the page heading, its summary and a link list of the
// whole site inside #root. Vercel serves that file before the SPA rewrite;
// React's createRoot replaces the markup on mount, so browsers see the normal
// page. /company keeps its richer prerender (prerender-company.ts).
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { ROUTE_SEO, SITE_URL, type RouteSeo } from "../src/lib/routeSeo";

const OWN_PRERENDER = new Set(["/company"]);

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

function renderRoute(shell: string, route: string, seo: RouteSeo): string {
  const url = `${SITE_URL}${route}`;
  const title = esc(seo.title);
  const description = esc(seo.description);
  const body = `<main>
    <h1>${esc(seo.heading)}</h1>
    <p>${description}</p>
    <nav aria-label="SecureGraph"><ul>${siteLinks()}</ul></nav>
  </main>`;
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
  return {
    name: "prerender-routes",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      for (const [route, seo] of ROUTES) {
        if (OWN_PRERENDER.has(route)) continue;
        const html = renderRoute(shell, route, seo);
        if (!html.includes(`href="${SITE_URL}${route}"`) || !html.includes("<h1>")) {
          throw new Error(`prerender-routes: could not inject ${route}`);
        }
        const dir = path.join(outDir, ...route.split("/").filter(Boolean));
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, "index.html"), html);
      }
    },
  };
}
