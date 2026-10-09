// Static /company page for crawlers.
//
// The site is a client-rendered SPA, so a fetch of /company that does not run
// JavaScript gets an empty <div id="root">. Google for Startups declined an
// application because the domain did not show verifiable founder and team
// information, so this writes dist/company/index.html with the team, company
// facts and Organization JSON-LD baked into the HTML. Vercel serves that file
// for /company before the SPA rewrite; React's createRoot replaces the markup
// on mount, so browsers see the normal page.
import fs from "node:fs";
import path from "node:path";
import type { Plugin } from "vite";
import { COMPANY, TEAM, addressLines, companyLinks, verificationLinks } from "../src/lib/company";

const SITE = "https://phantixlabs.com";

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

const link = (href: string, label: string) =>
  `<a href="${esc(href)}" rel="noopener noreferrer" target="_blank">${esc(label)}</a>`;

function staticBody(): string {
  const people = TEAM.map((m) => {
    const links = [
      m.linkedin && link(m.linkedin, "LinkedIn"),
      m.github && link(m.github, "GitHub"),
      m.x && link(m.x, "X"),
      m.email && `<a href="mailto:${esc(m.email)}">${esc(m.email)}</a>`,
    ].filter(Boolean);
    return `<li>
        ${m.photo ? `<img src="${esc(m.photo)}" alt="${esc(m.name)}" width="160" height="160">` : ""}
        <h3>${esc(m.name)}</h3>
        <p>${esc(m.role)}</p>
        <p>${esc(m.bio)}</p>
        <p>${links.join(" · ")}</p>
      </li>`;
  }).join("\n");

  const companyPages = companyLinks().map((l) => link(l.href, l.label)).join(" · ");

  return `<main>
    <h1>The team behind ${esc(COMPANY.productName)}</h1>
    <p>${esc(COMPANY.legalName)} builds ${esc(COMPANY.productName)}, a vulnerability assessment and penetration testing service for lean teams.</p>
    <section id="team">
      <h2>Founder and core team</h2>
      <ul>${people}</ul>
    </section>
    <section>
      <h2>The company</h2>
      <dl>
        <dt>Legal name</dt><dd>${esc(COMPANY.legalName)}</dd>
        ${COMPANY.rcNumber ? `<dt>Registration</dt><dd>${esc(COMPANY.rcNumber)}</dd>` : ""}
        <dt>Location</dt><dd>${esc(addressLines().join(", "))}</dd>
        <dt>Contact</dt><dd>${COMPANY.contactEmails.map((e) => `<a href="mailto:${esc(e)}">${esc(e)}</a>`).join(" · ")}</dd>
      </dl>
      <p>${companyPages}</p>
    </section>
  </main>`;
}

function jsonLd(): string {
  const data = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    url: `${SITE}/company`,
    mainEntity: {
      "@type": "Organization",
      "@id": `${SITE}/#organization`,
      name: COMPANY.legalName,
      legalName: COMPANY.legalName,
      url: `${SITE}/`,
      ...(COMPANY.rcNumber ? { identifier: COMPANY.rcNumber } : {}),
      email: COMPANY.contactEmails[0],
      sameAs: verificationLinks(),
      address: { "@type": "PostalAddress", addressLocality: COMPANY.address.city, addressCountry: COMPANY.address.country },
      founder: TEAM.map((m) => ({
        "@type": "Person",
        name: m.name,
        jobTitle: m.role,
        ...(m.photo ? { image: `${SITE}${m.photo}` } : {}),
        sameAs: [m.linkedin, m.github, m.x].filter(Boolean),
      })),
    },
  };
  // Escape "<" so a value can never close the script element.
  return `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`;
}

export function prerenderCompany(): Plugin {
  let outDir = "dist";
  return {
    name: "prerender-company",
    apply: "build",
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir);
    },
    closeBundle() {
      const shell = fs.readFileSync(path.join(outDir, "index.html"), "utf8");
      const title = `Company and team | ${COMPANY.legalName}`;
      const description = `${COMPANY.legalName} builds ${COMPANY.productName}. Meet the founder and core team, with verifiable LinkedIn and GitHub profiles.`;
      const html = shell
        .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
        .replace(/(<meta\s+name="description"\s+content=")[^"]*(")/, `$1${esc(description)}$2`)
        .replace(/(<link rel="canonical" href=")[^"]*(")/, `$1${SITE}/company$2`)
        .replace(/(<meta property="og:url" content=")[^"]*(")/, `$1${SITE}/company$2`)
        .replace("</head>", `  ${jsonLd()}\n  </head>`)
        .replace('<div id="root"></div>', `<div id="root">${staticBody()}</div>`);
      if (!html.includes('id="team"')) throw new Error("prerender-company: could not inject into #root");
      fs.mkdirSync(path.join(outDir, "company"), { recursive: true });
      fs.writeFileSync(path.join(outDir, "company", "index.html"), html);
    },
  };
}
