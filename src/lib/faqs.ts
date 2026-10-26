/*
 * The home page FAQ, as plain data.
 *
 * Two readers: <FAQ> renders it and builds the FAQPage schema from it, and
 * scripts/prerender-home.ts bakes the same questions into dist/index.html so a
 * crawler that does not run JavaScript still reads them. Keep it free of JSX and
 * browser code: vite.config.ts imports it through the prerender plugin. The
 * questions are already phrase-matched to how people search.
 */
export const faqs = [
  {
    q: "What is SecureGraph?",
    a: "SecureGraph helps small teams find real weaknesses, keep testing, and fix what matters.\n\nThe front door is vulnerability assessment and penetration testing (VAPT). Growth adds continuous security, remediation guidance, and reports that use only verified findings. Asset inventory, risk, and optional compliance or SOC depth sit on the same platform. You get one subscription and you can leave modules off.\n\nYour security records live in a database you control. We never treat your production business systems as a playground. We never invent vulnerabilities. AI explains what the engines already found.",
  },
  {
    q: "Where does my security data live?",
    a: "Security evidence lives in a dedicated PostgreSQL database that you provision and control. The evidence includes assets, tests, findings, and risks. You choose the host. SecureGraph connects to that store and writes into it.\n\nWe do not park your vulnerability history in a shared multi-tenant lake next to another organization’s data. We do not read your ERP, CRM, or customer production data. On the platform side we keep what runs the organization: identity, roles, billing, and configuration.\n\nIf you leave, you keep your security data. It was never ours to hold hostage.",
  },
  {
    q: "Is the Free plan really free?",
    a: "Yes. You do not need a card, and there is no countdown trial.\n\nFree is the entry surface. Create your organization, use dual control and MFA, inventory assets within fair-use caps, run light hygiene checks, and export basic formats. You get a one-time 500 AI credits, then free open-source models if enabled.\n\nFull VAPT campaigns, continuous testing, deep cloud and SOC packs, and board PDF packages are on Starter and Growth. Free helps you know your surface before you spend. It does not replace a paid assessment plan.",
  },
  {
    q: "Do I need a demo before I can start?",
    a: "No. Create a free account and use the product straight away. You do not need a call or a card.\n\nBook a demo if you want us to show how SecureGraph fits your environment, your team, or your procurement process. Larger organizations that need SSO, custom contracts, SLAs, or a private deployment can talk to sales from the Enterprise plan.",
  },
  {
    q: "How is this different from buying a scanner?",
    a: "A scanner puts issues on your desk. You still need someone to retest, prioritize, fix, and explain them to leadership.\n\nSecureGraph starts with scoped VAPT. It verifies what is real, guides remediation, and can keep testing continuously on Growth. All of this occurs in one place. You can add compliance mapping and SOC depth when you need them. They are not the reason to buy.\n\nThe other difference is ownership. Your security database stays yours.",
  },
  {
    q: "Will AI invent fake vulnerabilities?",
    a: "No. Agents can only work with what the engines already stored. They help write findings, suggest fixes, and plan investigations. They do not create findings, change scores, or bypass dual control.\n\nReports emphasize verified material. Unverified noise stays quarantined. Your board should only see what you can stand behind.",
  },
  {
    q: "Can we use this without a full security team?",
    a: "Yes. SecureGraph is built for the one-person security team. This person is often the engineer or operations lead who also owns security.\n\nIt inventories assets continuously, separates verified issues from noise, tracks fixes, and produces board-ready reports. You do not write them from scratch at midnight.",
  },
  {
    q: "Do you support Nigerian companies and NDPA?",
    a: "Yes. Privacy is a foundation. Security data stays in infrastructure that you choose. AI paths prefer controlled models, and we audit all actions.\n\nWe help you prepare evidence for privacy and security conversations. Formal certification such as ISO or SOC 2 remains your responsibility. We are the tool that helps you build the case. We are not the auditor.",
  },
  {
    q: "What if I need a full human penetration test?",
    a: "Engagements put SecureGraph practitioners on the same platform that you use each day. They scope, run, and report inside your environment, so findings follow the same verification path as your internal assessments.\n\nAsk us about full VAPT, complex application testing, mobile dynamic testing, and guided board reporting.",
  },
  {
    q: "How do I get started?",
    a: "Click Get started free, create your organization, and connect a security database. You can bring your own Postgres, or ask about hosted options when available.\n\nAdd a small set of assets and run your first assessment on Free. Move to Starter when you need full VAPT and verified reports, and to Growth when you need continuous testing. You do not need a card to begin.",
  },
  // Real questions from the webinar. Answered from what the product does, including
  // the two premises the webinar got wrong (CSV/PDF need no conversion here; SARIF
  // and CycloneDX are not customer export formats).
  {
    q: "Can I connect SecureGraph to GitHub CI/CD?",
    a: "Yes. Install the GitHub App on the repositories you want reviewed, or connect GitLab or Gitea, and SecureGraph reviews pull requests and new commits as they arrive. Review runs against the changed files, so the findings land where your team already looks: the pull request. You can also report on a branch (Continuous PR) and, where it is switched on, have SecureGraph open a fix PR rather than a ticket. Provider webhooks and CI webhooks from other pipelines are supported too.",
  },
  {
    q: "Does a finding tell me which file and line the problem is on?",
    a: "For code findings, yes. Each result carries the repository path, the line number and the rule that fired, so you can open the file at the exact place. Findings from network and web testing point at the asset and the request/response instead, because there is no source line to quote. The location is stored on the finding, so it survives into the report and into the ticket your team works from.",
  },
  {
    q: "Can it scan compiled binaries?",
    a: "Not native binaries. SecureGraph does not decompile or fuzz ELF or PE executables today. It does analyse source code, dependencies and container image contents, mobile packages (.apk and .ipa) statically, and infrastructure-as-code. If what you ship is a binary, scan the source and the dependency manifest before the build — that is where the fixable issues are, and where a fix can actually be merged.",
  },
  {
    q: "Can I scan a repository that contains two or three languages?",
    a: "Yes, and you do not configure it per language. SecureGraph works out which languages are present from the files it is given and runs the right analyser for each: Python with Bandit, Go with gosec, JavaScript and TypeScript with ESLint plus the general engine, PHP with PHPStan and Psalm when the project has Composer, C# and legacy .NET including .aspx with DevSkim, and OpenGrep across all of them. A monorepo is one scan, not three, and no file is analysed twice.",
  },
  {
    q: "Can I export a report as CSV or PDF?",
    a: "Yes, both are built in. One report can be produced as PDF, DOCX, XLSX, HTML, Markdown, JSON or CSV from the same findings — no conversion step, and every plan includes the formats. You choose the format on the report itself.",
  },
];
