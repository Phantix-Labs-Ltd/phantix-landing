import React from "react";
import { Link } from "react-router-dom";
import { BrandMark } from "@/components/BrandLogo";
import { ThemeToggle } from "@/components/ThemeToggle";
import PageMeta from "@/components/PageMeta";
import { APP_URL, PLATFORM_URL } from "@/lib/config";
import { DOCS_DEFINITION, DOCS_DESCRIPTION, DOCS_FAQ, DOCS_TITLE, DOCS_UPDATED, docsJsonLd } from "@/lib/docsSeo";

/*
 * /securegraph/docs: the public User Guide and Admin Guide.
 *
 * One long page: a sticky header, a sticky section index on the left and the
 * guide in one column. It explains what each part of SecureGraph does and how
 * to use it. It deliberately says nothing about what runs underneath: no tool,
 * model, provider or infrastructure names. Those are not the reader's concern
 * and they change.
 */

type Entry = { id: string; label: string };

const USER_GUIDE: Entry[] = [
  { id: "what-is", label: "1. What is SecureGraph?" },
  { id: "tests-vs-record", label: "2. Tests vs. the record" },
  { id: "test-areas", label: "3. The test areas" },
  { id: "before-first-test", label: "4. Before your first test" },
  { id: "running-a-test", label: "5. Running a test" },
  { id: "graph", label: "6. Graph, correlation & attack paths" },
  { id: "dashboards", label: "7. Dashboards" },
  { id: "findings", label: "8. Findings lifecycle" },
  { id: "reports", label: "9. The report types" },
  { id: "reading-report", label: "10. Reading a report" },
  { id: "what-to-expect", label: "11. What to expect" },
];

const FAQ_ENTRIES: Entry[] = [{ id: "faq", label: "Frequently asked questions" }];

const ADMIN_GUIDE: Entry[] = [
  { id: "getting-started", label: "Organization & plans" },
  { id: "security-database", label: "Connecting your security database" },
  { id: "people-dual-control", label: "People, roles & dual control" },
  { id: "scope-authorization", label: "Scope & authorization" },
  { id: "configuring-tests", label: "Configuring tests" },
  { id: "troubleshooting", label: "Troubleshooting" },
  { id: "ai-governance", label: "AI governance & audit" },
  { id: "integrations-alerts", label: "Integrations & alerts" },
  { id: "privacy", label: "Privacy & data protection" },
  { id: "data-storage", label: "Data & storage" },
  { id: "remediation", label: "Remediation & retest" },
  { id: "support", label: "Support" },
];

/* ── Building blocks ─────────────────────────────────────────────────────── */

function H2({ id, children }: { id: string; children: React.ReactNode }) {
  return (
    <h2 id={id} className="mb-4 mt-12 scroll-mt-24 border-b border-phantix-700 pb-2 font-display text-[1.3rem] font-semibold text-white first:mt-0">
      {children}
    </h2>
  );
}

function H3({ children }: { children: React.ReactNode }) {
  return <h3 className="mb-2.5 mt-6 text-base font-semibold text-white">{children}</h3>;
}

function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-3.5 text-slate-400 [&_strong]:text-slate-100">{children}</p>;
}

function UL({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-3.5 list-disc space-y-1.5 pl-6 text-slate-400 marker:text-phantix-500 [&_strong]:text-slate-100">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ul>
  );
}

function OL({ items }: { items: React.ReactNode[] }) {
  return (
    <ol className="mb-3.5 list-decimal space-y-1.5 pl-6 text-slate-400 marker:text-phantix-400 [&_strong]:text-slate-100">
      {items.map((it, i) => <li key={i}>{it}</li>)}
    </ol>
  );
}

/** A callout with an accent edge: the "why it matters" note under a concept. */
function Info({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-5 rounded-md border border-l-[3px] border-phantix-700 border-l-gold-400 bg-phantix-900 px-5 py-4 text-slate-400 [&_strong]:text-slate-100">
      {children}
    </div>
  );
}

/** A bordered table. Wide tables scroll inside their own box on a phone. */
function Table({ head, rows }: { head: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="mb-4 overflow-x-auto">
      <table className="w-full min-w-[34rem] border-collapse text-[0.85rem]">
        <thead>
          <tr>
            {head.map((h) => (
              <th key={h} className="border border-phantix-700 bg-phantix-900 px-3 py-2 text-left font-semibold text-white">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {r.map((c, j) => (
                <td key={j} className="border border-phantix-700 px-3 py-2 align-top text-slate-400 [&_strong]:text-slate-100">{c}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** A place in the product, written as App → Group → Page. */
function Nav({ children }: { children: React.ReactNode }) {
  return <span className="whitespace-nowrap font-medium text-slate-200">{children}</span>;
}

/* ── Page ────────────────────────────────────────────────────────────────── */

export default function SecureGraphDocs() {
  return (
    <div className="min-h-screen bg-phantix-950 text-[15px] leading-[1.7] text-slate-200">
      <PageMeta title={DOCS_TITLE} description={DOCS_DESCRIPTION} jsonLd={docsJsonLd()} />

      <header className="sticky top-0 z-50 flex items-center gap-4 border-b border-phantix-700 bg-phantix-900 px-4 py-3 sm:px-8">
        <Link to="/" className="flex shrink-0 items-center gap-2 font-display text-[1.1rem] font-bold text-gold-400">
          <BrandMark className="h-7 w-7" />
          SecureGraph <span className="hidden font-normal text-slate-200 sm:inline">Documentation</span>
        </Link>
        <nav className="ml-auto flex items-center gap-4 text-[0.9rem] sm:gap-6">
          <Link to="/" className="text-slate-400 transition-colors hover:text-white">Home</Link>
          <a href="#user-guide" className="hidden whitespace-nowrap sm:inline text-slate-400 transition-colors hover:text-white">User Guide</a>
          <a href="#admin-guide" className="hidden whitespace-nowrap sm:inline text-slate-400 transition-colors hover:text-white">Admin Guide</a>
          <ThemeToggle />
        </nav>
      </header>

      <div className="flex min-h-[calc(100vh-57px)]">
        <aside className="sticky top-[57px] hidden h-[calc(100vh-57px)] w-[250px] shrink-0 overflow-y-auto border-r border-phantix-700 bg-phantix-900 py-8 md:block">
          <SidebarGroup title="User Guide" entries={USER_GUIDE} />
          <SidebarGroup title="Admin Guide" entries={ADMIN_GUIDE} />
          <SidebarGroup title="FAQ" entries={FAQ_ENTRIES} />
        </aside>

        <main className="min-w-0 max-w-[900px] flex-1 px-5 pb-16 pt-8 sm:px-12 sm:pt-12">
          <span className="mb-6 inline-block rounded border border-gold-400/30 bg-gold-400/10 px-2.5 py-0.5 text-xs font-semibold uppercase tracking-[0.05em] text-gold-300">
            Documentation
          </span>
          <h1 className="mb-2 font-display text-[2rem] font-bold leading-tight text-white">SecureGraph Documentation</h1>
          <p className="mb-10 text-sm text-slate-400">
            User Guide &amp; Admin Guide · the security command centre for small security teams · Last updated{" "}
            <time dateTime={DOCS_UPDATED}>{new Date(`${DOCS_UPDATED}T00:00:00Z`).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })}</time>
          </p>

          {/* Phones have no sidebar: the same index folds up here. */}
          <details className="mb-10 rounded-md border border-phantix-700 bg-phantix-900 md:hidden">
            <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-white">Contents</summary>
            <div className="border-t border-phantix-700 pb-3 pt-2">
              <SidebarGroup title="User Guide" entries={USER_GUIDE} />
              <SidebarGroup title="Admin Guide" entries={ADMIN_GUIDE} />
              <SidebarGroup title="FAQ" entries={FAQ_ENTRIES} />
            </div>
          </details>

          <section id="user-guide" className="mb-12 scroll-mt-24">
            <UserGuide />
          </section>
          <section id="admin-guide" className="mb-12 scroll-mt-24">
            <AdminGuide />
          </section>
          <section className="mb-12">
            <H2 id="faq">Frequently asked questions</H2>
            {DOCS_FAQ.map((f) => (
              <div key={f.q}>
                <H3>{f.q}</H3>
                <P>{f.a}</P>
              </div>
            ))}
          </section>
        </main>
      </div>

      <footer className="border-t border-phantix-700 bg-phantix-900 px-8 py-8 text-center text-[0.85rem] text-slate-400">
        <p>
          &copy; Phantix Labs Ltd · SecureGraph ·{" "}
          <Link to="/trust" className="text-gold-400 hover:text-gold-300">Trust</Link> ·{" "}
          <Link to="/contact" className="text-gold-400 hover:text-gold-300">Contact</Link>
        </p>
      </footer>
    </div>
  );
}

function SidebarGroup({ title, entries }: { title: string; entries: Entry[] }) {
  return (
    <div className="mb-6">
      <div className="mb-2 px-6 text-[0.72rem] font-bold uppercase tracking-[0.08em] text-slate-500">{title}</div>
      {entries.map((e) => (
        <a
          key={e.id}
          href={`#${e.id}`}
          className="block border-l-2 border-transparent px-6 py-1 text-[0.85rem] text-slate-400 transition-colors hover:border-gold-400/50 hover:bg-gold-400/5 hover:text-white"
        >
          {e.label}
        </a>
      ))}
    </div>
  );
}

/* ── User Guide ──────────────────────────────────────────────────────────── */

function UserGuide() {
  return (
    <>
      <H2 id="what-is">1. What is SecureGraph?</H2>
      <P>{DOCS_DEFINITION}</P>
      <P>
        It is built for organizations that do security work alongside their main work.
        It tests your systems the way an attacker would, checks every result before you are asked to trust it, and
        keeps the record of your security position in a database that you control. It runs in the browser; there is
        nothing to install on your computers.
      </P>
      <P>SecureGraph is a set of applications that share one sign-in, one inventory and one findings register:</P>
      <Table
        head={["Application", "What it is for", "Address"]}
        rows={[
          [<strong>Platform</strong>, "Your organization: people, roles, dual control, the security database, keys, billing.", <a className="text-gold-400" href={PLATFORM_URL}>platform.phantixlabs.com</a>],
          [<strong>Core</strong>, "The Command Centre: assets, findings, risk, assurance, reports and the AI assistant.", <a className="text-gold-400" href={APP_URL}>app.phantixlabs.com</a>],
          [<strong>Attack</strong>, "Offensive testing: scopes, scans, VAPT campaigns, mobile testing and the Autonomous Pentest Agent.", "attack.phantixlabs.com"],
          [<strong>Defend</strong>, "Defensive posture: cloud, compliance, risks, incidents, alerts and security operations.", "defend.phantixlabs.com"],
          [<strong>Code</strong>, "Code security: repositories, pull-request review, AutoFix, pipelines and threat models.", "code.phantixlabs.com"],
        ]}
      />

      <H2 id="tests-vs-record">2. Core concepts: tests vs. the record</H2>
      <P>
        A <strong>test</strong> is an active check that you start on demand, on a schedule or from your pipeline. It
        runs against assets in your agreed scope and produces candidate findings for that run.
      </P>
      <Info>
        <strong>Why it matters:</strong> a test is how evidence is gathered. Without one you are guessing whether a
        domain, an API, a mobile build or a repository has a weakness.
      </Info>
      <P>
        The <strong>record</strong> is what SecureGraph builds from your tests over time: the asset inventory, the
        security graph, the findings register, the risk register and the audit trail. Findings from every test area
        share one model, so the same weakness found two ways is one finding, and a fix is tracked until a retest
        confirms it.
      </P>
      <Info>
        <strong>Why it matters:</strong> separate tools report the same root cause several times and forget it by
        the next run. The record removes duplication, ranks by what is verified and reachable, and shows how your
        position changes from one test to the next.
      </Info>

      <H2 id="test-areas">3. The test areas: what each one checks</H2>
      <Table
        head={["Area", "What it checks", "Where in the product"]}
        rows={[
          ["Asset discovery", "Domains, subdomains, IP addresses, APIs, web apps, repositories and mobile builds that belong to you, with exposure and relations.", <Nav>Core → Assets</Nav>],
          ["Network & vulnerability scans", "Exposed services and known weaknesses on assets in scope.", <Nav>Attack → Testing → Scans</Nav>],
          ["VAPT campaigns", "Multi-step assessments with a fixed scope, approval gates and an optional schedule.", <Nav>Attack → VAPT → Campaigns</Nav>],
          ["Autonomous pentest", "Multi-step investigations of web apps and APIs, including access control and business-logic faults, chained into attack paths.", <Nav>Attack → Agent</Nav>],
          ["API security", "Object- and function-level authorization, token handling, rate limits and logic flaws. Imports OpenAPI and Postman files.", <Nav>Attack → Scope</Nav>],
          ["Mobile", "Android and iOS packages: permissions, exported components and hardcoded secrets. Runtime testing by engagement.", <Nav>Attack → Mobile</Nav>],
          ["Cloud posture", "Misconfiguration and exposure in connected cloud accounts, using only the access you grant.", <Nav>Defend → Cloud</Nav>],
          ["Code security", "Pull-request and merge-request review, secrets, vulnerable dependencies and code flaws.", <Nav>Code → Review</Nav>],
          ["Pipelines", "Pushes and deployments reviewed as they happen.", <Nav>Code → Automation → Pipelines</Nav>],
          ["Threat models", "Threats per product, generated from its architecture and requirements.", <Nav>Code → Threat models</Nav>],
          ["Compliance", "Controls mapped to the frameworks that apply to you, with evidence and gaps.", <Nav>Defend → Oversight → Compliance</Nav>],
        ]}
      />
      <P>Which areas you can use depends on your plan. A locked page says which plan opens it.</P>

      <H2 id="before-first-test">4. Before your first test: what to set up</H2>
      <P>
        SecureGraph does not test anything until three things are in place. Each one protects you, and the product
        tells you which one is missing.
      </P>
      <Table
        head={["Set up", "Why", "Where"]}
        rows={[
          [<strong>Security database</strong>, "Findings, assets and evidence are written only to your database. Tests stay blocked until it reads ready.", <Nav>Platform → Database</Nav>],
          [<strong>Dual control</strong>, "Sensitive actions need an initiator and a different authorizer. Assign both before you operate.", <Nav>Platform → People</Nav>],
          [<strong>A verified asset</strong>, "You prove that you own a target before it can be tested. Unverified assets stay out of scope.", <Nav>Core → Assets</Nav>],
        ]}
      />
      <P>
        The first time you test a target you own, SecureGraph also asks you to accept the Acceptable Use Policy and the
        Rules of Engagement. It asks once.
      </P>

      <H2 id="running-a-test">5. Running a test: how to</H2>
      <OL
        items={[
          <>Open <Nav>Attack</Nav> and choose a test: a scan, a VAPT campaign or the Autonomous Pentest Agent.</>,
          <>Select the targets. A target filter (for example, every asset tagged <code className="text-gold-300">external</code>) keeps the scope explicit.</>,
          <><strong>Unlock operate</strong> when the dual-control prompt appears. Starting a test is a protected action.</>,
          <>Watch progress live. You can leave the page; the test continues, and the run is in the job history.</>,
          <>Approve or decline when the test pauses at a gate. Authentication steps and anything that changes the state of a system wait for a person.</>,
          <>Open the results. Each finding has its evidence, its impact and its verification state.</>,
          <>Stopped runs can be resumed from the job history. Completed work is not repeated.</>,
        ]}
      />
      <Info>
        <strong>One at a time:</strong> each organization runs one scan job at a time, so tests never compete for
        your targets. The Autonomous Pentest Agent and code analysis are separate and do not hold the slot.
      </Info>

      <H2 id="graph">6. Graph, correlation &amp; attack paths</H2>
      <P>
        Every asset and finding is placed on the <strong>security graph</strong>, which shows how your systems relate to
        each other and where a weakness on one reaches another.
      </P>
      <UL
        items={[
          <><strong>Correlation</strong> merges findings that share a root cause, across test areas, into one tracked finding.</>,
          <><strong>Attack paths</strong> join single weaknesses into the route an attacker would take. A completed chain is recorded as one finding with evidence for each link, and a severity that reflects the whole chain.</>,
          <><strong>Asset intelligence</strong> gives each asset a risk score, an exposure level and its related findings.</>,
          <><strong>Living context</strong>: the product context you describe (projects, components, data flows) keeps threat models and priorities current as your systems change.</>,
        ]}
      />

      <H2 id="dashboards">7. Dashboards</H2>
      <Table
        head={["Dashboard", "Shows", "Where"]}
        rows={[
          ["Overview", "Posture score and trend, open findings, open risks, fix rate and findings by surface.", <Nav>Core → Overview</Nav>],
          ["Findings tracker", "The live remediation board: owner, due date, evidence and status of every finding.", <Nav>Core → Findings → Tracker</Nav>],
          ["Analytics", "Posture, regressions and coverage across every surface over time.", <Nav>Core → Analytics</Nav>],
          ["Assurance", "Audit readiness, attestations and continuous control monitoring.", <Nav>Core → Assurance</Nav>],
          ["Posture", "Exposure, accepted risks and drift for defensive teams.", <Nav>Defend → Surface → Posture</Nav>],
          ["Platform home", "Organization health: setup checklist, database status, people and keys.", <Nav>Platform → Home</Nav>],
        ]}
      />

      <H2 id="findings">8. Findings lifecycle</H2>
      <P>
        A finding has two separate properties: its <strong>evidence</strong> (how sure we are) and its{" "}
        <strong>status</strong> (where the fix is).
      </P>
      <H3>Evidence</H3>
      <Table
        head={["Evidence", "Means"]}
        rows={[
          [<strong>Verified (auto)</strong>, "SecureGraph confirmed the finding by testing it again independently."],
          [<strong>Verified (human)</strong>, "A person on your team reviewed the evidence and confirmed it."],
          [<strong>Unverified</strong>, "Waiting for a decision. Stays on the board as work, but appears in reports only as an appendix."],
          [<strong>Rejected</strong>, "Ruled out as a false positive. Excluded from reports."],
        ]}
      />
      <H3>Status</H3>
      <Table
        head={["Status", "Means"]}
        rows={[
          ["Open", "Not started."],
          ["In progress", "A fix is under way."],
          ["Fixed", "A retest confirmed the fix. The finding is closed."],
          ["Accepted", "Your organization accepted the risk on purpose, with an approval."],
          ["Retest failed", "The fix did not hold. The finding stays open."],
          ["Regressed", "The finding was fixed and has appeared again."],
        ]}
      />

      <H2 id="reports">9. The report types</H2>
      <P>
        Reports are generated from verified findings only. The list of types comes from the product, so a new type
        appears without an update on your side.
      </P>
      <Table
        head={["Report", "For", "Scope"]}
        rows={[
          ["Executive summary", "Boards and leadership", "Whole organization"],
          ["Organization security overview", "Executives and the board", "Whole organization"],
          ["VAPT campaign report", "Security and engineering teams", "One campaign"],
          ["Compliance report", "Auditors and risk owners", "Whole organization"],
          ["Findings tracker export", "Engineering managers", "Whole organization"],
          ["Autonomous pentest report", "Security teams", "One agent session"],
        ]}
      />
      <P>
        Formats: PDF and DOCX (following the standard VAPT layout), a PPTX board deck, HTML, Markdown, JSON, CSV and
        XLSX. Markdown and JSON are on every plan; the board-ready packages are on paid plans.
      </P>

      <H2 id="reading-report">10. Reading a report</H2>
      <UL
        items={[
          <><strong>Executive summary first.</strong> It is written in plain language from the stored evidence, in both business and technical terms.</>,
          <><strong>The verification gate panel</strong> states how many findings were reportable, and how many were left out as unverified or rejected. A report never hides what it excluded.</>,
          <><strong>Each finding</strong> has its severity, the affected asset, the evidence, the business impact and the steps to fix it.</>,
          <><strong>Attack paths</strong> appear as one finding with each link shown in order.</>,
          <><strong>The appendix</strong> holds unverified candidates for transparency. They never count towards a severity total.</>,
        ]}
      />

      <H2 id="what-to-expect">11. What to expect</H2>
      <UL
        items={[
          <>SecureGraph supports your security program. It is <strong>not a certification</strong> and does not replace an auditor.</>,
          <>Verification removes noise, but <strong>no tool guarantees zero false positives or full coverage</strong>. Where a category cannot be tested from the outside, the product says so.</>,
          <>The AI plans and explains. It <strong>never invents a finding, changes a risk score or skips an approval</strong>.</>,
          <>The Autonomous Pentest Agent is <strong>not unsupervised</strong>: authentication and state-changing actions wait for a person.</>,
          <>Areas marked <strong>in development</strong> (for example, parts of security operations) say so in the product.</>,
        ]}
      />
    </>
  );
}

/* ── Admin Guide ─────────────────────────────────────────────────────────── */

function AdminGuide() {
  return (
    <>
      <H2 id="getting-started">Organization &amp; plans</H2>
      <OL
        items={[
          <>Create the organization at <a className="text-gold-400" href={`${PLATFORM_URL}/register`}>platform.phantixlabs.com/register</a> with a work email. A 6-digit code confirms the address.</>,
          <>The setup wizard asks for the essentials: dual control, your domain, your plan and which applications your company uses.</>,
          <>Finish the profile from the checklist on <Nav>Platform → Home</Nav>. Verification and branding unlock the full experience.</>,
        ]}
      />
      <UL
        items={[
          <><strong>Free</strong>: asset inventory with fair-use limits, light checks, dual control, MFA, the audit trail and JSON/Markdown exports.</>,
          <><strong>Starter</strong> and <strong>Growth</strong>: VAPT campaigns, verified findings with remediation, pull-request review and the Autonomous Pentest Agent (credit-metered); Growth adds continuous and recurring testing, cloud posture and the compliance workbench.</>,
          <><strong>Enterprise</strong>: multi-company groups, custom branding and retention, white-label reports and an agreed SLA.</>,
        ]}
      />
      <P>Current prices are on the <Link className="text-gold-400" to="/pricing">pricing page</Link>.</P>

      <H2 id="security-database">Connecting your security database</H2>
      <P>
        Your findings, assets, risks and evidence live in a dedicated <strong>PostgreSQL</strong> database that you
        control. Use an empty database or a dedicated schema; SecureGraph never needs your application tables.
      </P>
      <H3>Publicly hosted database</H3>
      <OL
        items={[
          <>Open <Nav>Platform → Database</Nav> and select <strong>Connect database</strong>, then <strong>Publicly hosted</strong>.</>,
          <>Add each SecureGraph address shown on the page to your database allowlist, and tick it.</>,
          <>Paste the connection string, select <strong>Test connection</strong>, then <strong>Prepare security database</strong>.</>,
        ]}
      />
      <H3>Database on a private network</H3>
      <OL
        items={[
          <>Select <strong>On a private network</strong> and create a <strong>Connector</strong> named after where it runs.</>,
          <>Run the install command shown on the page next to your database. The connector reaches out; nothing needs to reach in.</>,
          <>When it reads <strong>Online</strong>, add the database, test it and prepare it.</>,
        ]}
      />
      <Info>
        <strong>Allowlisting is required.</strong> A publicly hosted database must accept connections only from the
        SecureGraph addresses. If an address is added later, the product warns that your allowlist is out of date.
      </Info>

      <H2 id="people-dual-control">People, roles &amp; dual control</H2>
      <P>
        Add people on <Nav>Platform → People</Nav>. Each person gets a role, and access to each application is set per
        person.
      </P>
      <Table
        head={["Slot", "How many", "Duty"]}
        rows={[
          [<strong>Initiator</strong>, "One or more", "Proposes and starts protected actions: tests, asset changes, reports."],
          [<strong>Authorizer</strong>, "Exactly one", "Approves pending actions and risk treatments. Must be a different person from the initiator."],
        ]}
      />
      <UL
        items={[
          <>Both must use an address on your organization's domain. Personal webmail addresses cannot complete a dual-control sign-in.</>,
          <>To act, a person <strong>unlocks operate</strong> with a one-time code. The session expires on its own.</>,
          <>Reassigning a slot ends the live operate sessions of the previous assignment.</>,
        ]}
      />

      <H2 id="scope-authorization">Scope &amp; authorization</H2>
      <UL
        items={[
          <><strong>Ownership</strong>: an asset is tested only after you prove ownership, for example with a DNS record or an HTTP check.</>,
          <><strong>Scope is fixed per engagement</strong>: once a campaign or agent session starts, its scope cannot be widened.</>,
          <><strong>Authorization is yours</strong>: you confirm that you own, or are authorized to test, every target you connect. SecureGraph supplies the controls; you supply the authorization.</>,
          <><strong>Scope documents</strong> for an external pentest can be drafted in <Nav>Attack → Scope</Nav>. Drafts are watermarked as not authorized until the authorizer approves them.</>,
        ]}
      />

      <H2 id="configuring-tests">Configuring tests</H2>
      <H3>Test modes</H3>
      <Table
        head={["Mode", "What the test is given"]}
        rows={[
          [<strong>Blackbox</strong>, "Nothing. The view of an external attacker."],
          [<strong>Greybox</strong>, "Test accounts, API documentation and the inventory."],
          [<strong>Whitebox</strong>, "Source, configuration and infrastructure definitions that you supply."],
        ]}
      />
      <H3>Autonomy (Autonomous Pentest Agent)</H3>
      <Table
        head={["Level", "Behaviour"]}
        rows={[
          [<strong>Low</strong>, "Tight guardrails and short phases. Stops early when idle."],
          [<strong>Medium</strong> , "The default. Reconnaissance first, then the agent plans and acts within limits."],
          [<strong>High</strong>, "Long, self-directed runs that stop only at a hard limit."],
        ]}
      />
      <P>Approval gates apply at every level. Budgets for time, turns and AI credits are set per session.</P>
      <H3>Schedules</H3>
      <P>
        Recurring VAPT runs are set on <Nav>Attack → VAPT → Schedules</Nav>. Pick a window outside your busy hours.
        Continuous reassessment can also re-run a scope when your product context changes.
      </P>

      <H2 id="troubleshooting">Troubleshooting</H2>
      <Table
        head={["What you see", "Why", "What to do"]}
        rows={[
          ["Tests are blocked: security database not ready", "The database is not connected or not prepared.", <>Finish <Nav>Platform → Database</Nav> until it reads ready.</>],
          ["\"Your database allowlist is out of date\"", "SecureGraph added an address your database does not accept yet.", "Add the new address to the allowlist and tick it."],
          ["An action asks for a code", "Operate mode is locked.", "Unlock operate with the code sent to you, or ask your authorizer to approve."],
          ["Cannot assign the authorizer", "The address is personal webmail, or it is the same person as the initiator.", "Use two different people on your organization's domain."],
          ["A target is not offered for testing", "The asset is unverified or outside the scope.", "Verify ownership on the asset, or widen the scope before the engagement starts."],
          ["\"Another scan is running\"", "One scan job runs at a time per organization.", "Wait for it to finish, or cancel it from the job banner."],
          ["A report has fewer findings than the tracker", "Reports include verified findings only.", "Verify findings in the tracker, then generate again."],
          ["\"Session ended\" card", "Your sign-in expired while you were away.", "Sign in again; you return to the same page."],
        ]}
      />

      <H2 id="ai-governance">AI governance &amp; audit</H2>
      <UL
        items={[
          <>The AI acts as the signed-in person and can do only what that person's role allows.</>,
          <>Every action that changes something needs a fresh, single-use authorization bound to that action.</>,
          <>Personal data is removed before any request leaves SecureGraph, and your raw security content is not sent out by default.</>,
          <>Every AI action, decision and denial is recorded. Review them on <Nav>Core → Activity</Nav> and the audit trail.</>,
          <>AI governance settings, budgets and credits are on <Nav>Platform → AI</Nav>.</>,
        ]}
      />

      <H2 id="integrations-alerts">Integrations &amp; alerts</H2>
      <UL
        items={[
          <><strong>GitHub, GitLab and Gitea</strong> connect through an app installation or OAuth. Public repositories work on Free; private ones on paid plans.</>,
          <><strong>Alert channels</strong>: email on every plan; Slack, Microsoft Teams, WhatsApp and Telegram when configured.</>,
          <><strong>Severity routing</strong> decides which severities reach which channel.</>,
          <><strong>Cloud accounts</strong> connect with the read access you grant, on <Nav>Defend → Cloud</Nav>.</>,
          <>Browse and install integrations from the <Nav>Core → Integrations</Nav> hub.</>,
        ]}
      />

      <H2 id="privacy">Privacy &amp; data protection</H2>
      <P>
        SecureGraph is designed around data-protection law, including the Nigeria Data Protection Act. Analytics on
        our sites are first-party, cookieless and off until you accept them. Tenant identifiers are removed before a
        successful procedure is shared as a reusable skill. Read the{" "}
        <Link className="text-gold-400" to="/privacy">privacy notice</Link> and the{" "}
        <Link className="text-gold-400" to="/trust">Trust page</Link>.
      </P>

      <H2 id="data-storage">Data &amp; storage</H2>
      <Table
        head={["SecureGraph keeps", "Your security database keeps"]}
        rows={[
          ["Organization, people and roles", "Assets and inventory"],
          ["Billing and entitlements", "Test results and findings"],
          ["Dual-control and audit records", "Risks and remediation"],
          ["The tooling catalog", "Compliance evidence and report sources"],
        ]}
      />
      <P>
        SecureGraph never reads production business data such as ERP or CRM rows, customer personal data or your
        application tables. Repository analysis happens in a temporary workspace that is removed afterwards.
      </P>

      <H2 id="remediation">Remediation &amp; retest</H2>
      <UL
        items={[
          <>Verified findings enter the fix queue on the <Nav>Findings tracker</Nav>, with step-by-step guidance beside the board.</>,
          <>Give every row an owner and a due date. Overdue and regressed findings are counted at the top of the board.</>,
          <>After a fix, <strong>retest</strong> the single finding from its row. A fix that is not retested stays open.</>,
          <>Retests replay the original evidence against the same scope and return fixed, still vulnerable or inconclusive.</>,
          <>In <Nav>Code</Nav>, AutoFix can propose a patch as a pull request for you to review.</>,
        ]}
      />

      <H2 id="support">Support</H2>
      <UL
        items={[
          <>Raise a ticket from <Nav>Core → Support</Nav> or <Nav>Platform → Support</Nav>. Quote your tenant ID for a faster answer.</>,
          <>Step-by-step how-tos for every page are inside each application under <strong>Docs</strong>.</>,
          <>Email <a className="text-gold-400" href="mailto:contact@phantixlabs.com">contact@phantixlabs.com</a>, or use the <Link className="text-gold-400" to="/contact">contact page</Link>.</>,
        ]}
      />
    </>
  );
}
