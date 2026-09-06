import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Product Documentation — Causarix",
  description:
    "Causarix product documentation: architecture, AI capabilities, integrations, security, and use cases.",
};

export default function DocsPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      {/* Header */}
      <header className="border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">Causarix</span>
          <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-mono">
            docs v1.0
          </span>
        </div>
        <a
          href="https://causarix.vercel.app/demo"
          className="text-sm font-medium text-orange-600 hover:text-orange-700"
        >
          Try Demo →
        </a>
      </header>

      <div className="max-w-4xl mx-auto px-6 py-16 space-y-16">

        {/* Hero */}
        <section>
          <h1 className="text-4xl font-bold tracking-tight mb-4">Product Documentation</h1>
          <p className="text-lg text-gray-600">
            Causarix is an AI-native corporate intelligence platform that transforms how enterprises
            make high-stakes legal, strategic, and operational decisions.
          </p>
          <p className="mt-3 text-gray-500 italic">
            Think of Causarix as an AI General Counsel that never sleeps, never bills by the hour,
            and never forgets a past decision.
          </p>
        </section>

        {/* Problems Solved */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Core Problems Solved</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Problem</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Today</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Causarix</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Decisions take days", "GCs email lawyers, wait for memos", "Real-time MCTS deliberation in minutes"],
                  ["No institutional memory", "Every matter starts from scratch", "Decision Memory Flywheel learns over time"],
                  ["Expensive outside counsel", "$500–$1,500/hr for routine advice", "80% of standard matters handled autonomously"],
                  ["No audit trail", '"We decided in a meeting"', "SHA-256 Merkle-sealed, DGCL § 141-compliant"],
                  ["Fragmented workflows", "Slack, email, Jira — siloed", "Decisions auto-push to all channels"],
                ].map(([problem, today, solution], i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="p-3 border border-gray-200 font-medium">{problem}</td>
                    <td className="p-3 border border-gray-200 text-gray-500">{today}</td>
                    <td className="p-3 border border-gray-200 text-green-700">{solution}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Key Features */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Key Features</h2>
          <div className="grid gap-6 md:grid-cols-2">
            {[
              {
                icon: "🧠",
                title: "AGI Executive Studio",
                desc: "Submit any corporate dilemma in plain language. The AI runs a full MCTS deliberation, generates competing strategic paths, scores them, and recommends a winning direction.",
              },
              {
                icon: "🌲",
                title: "MCTS Deliberation Engine",
                desc: "Monte Carlo Tree Search generates 3–5 competing strategic branches. Each is scored on duty-of-care, cash impact, and insolvency risk, then pruned with causal justification.",
              },
              {
                icon: "📊",
                title: "Dynamic Quantitative Simulation",
                desc: "Synthesizes problem-specific Python models (Monte Carlo, GBM, CVaR) reflecting your scenario's actual financial mechanics — not generic templates.",
              },
              {
                icon: "🔐",
                title: "Delaware DGCL § 141 Merkle Sealing",
                desc: "Every resolution is SHA-256 sealed — binding the dilemma, simulation, org, and decision into a tamper-evident, legally referenceable board record.",
              },
              {
                icon: "🧬",
                title: "Decision Memory Flywheel",
                desc: "Every deliberation trains org-specific vector memory. The system learns your risk appetite, legal posture, and strategic preferences over time.",
              },
              {
                icon: "🔄",
                title: "Internal Sync Mesh",
                desc: "Winning decisions auto-dispatch to Jira (action tickets), Slack (executive summary), WhatsApp (board digest), and Email (resolution memo).",
              },
            ].map((f, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <div className="text-2xl mb-2">{f.icon}</div>
                <h3 className="font-semibold text-base mb-1">{f.title}</h3>
                <p className="text-sm text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-2xl font-bold mb-6">How It Works</h2>
          <div className="flex flex-col gap-0">
            {[
              "User types dilemma in plain language",
              "NLP extracts entities, financials & risk dimensions",
              "LLM Router dispatches to GPT-4o / Claude / Gemini / Fallback",
              "MCTS generates competing strategic branches",
              "Python simulation synthesized & executed per scenario",
              "Causal scoring prunes weak branches",
              "Winning path selected with full reasoning chain",
              "Delaware DGCL § 141 Merkle seal applied",
              "Synced to Jira + Slack + WhatsApp",
              "Stored in Decision Memory Flywheel",
            ].map((step, i) => (
              <div key={i} className="flex items-start gap-4 py-3 border-b border-gray-100 last:border-0">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-orange-100 text-orange-600 text-xs font-bold flex items-center justify-center">
                  {i + 1}
                </span>
                <span className="text-sm text-gray-700 pt-1">{step}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-sm text-gray-500">
            ⚡ End-to-end deliberation time: <strong>30–90 seconds</strong>
          </p>
        </section>

        {/* Architecture */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Architecture Overview</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="text-left p-3 border border-gray-200 font-semibold">Layer</th>
                  <th className="text-left p-3 border border-gray-200 font-semibold">Technology</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ["Frontend", "Next.js 14, React Server Components, Tailwind CSS"],
                  ["Backend", "Next.js API Routes, TypeScript"],
                  ["AI Orchestration", "Custom LLM Router (GPT-4o / Claude / Gemini)"],
                  ["Reasoning Engine", "MCTS + Structural Causal Model"],
                  ["Simulation Runtime", "Server-side Python synthesis & execution"],
                  ["Database", "PostgreSQL via Prisma ORM"],
                  ["Auth", "Firebase Authentication + server-side session"],
                  ["Integrations", "Jira REST API, Slack Webhooks, WhatsApp Business API"],
                  ["Cryptography", "SHA-256 Merkle Tree (Node.js crypto)"],
                  ["Deployment", "Vercel Edge (frontend) + Node.js server (backend)"],
                ].map(([layer, tech], i) => (
                  <tr key={i} className="even:bg-gray-50">
                    <td className="p-3 border border-gray-200 font-medium">{layer}</td>
                    <td className="p-3 border border-gray-200 text-gray-600 font-mono text-xs">{tech}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Security */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Security & Compliance</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            {[
              "Firebase Auth with server-side session verification",
              "Full org-level multi-tenant data isolation",
              "Every deliberation logged with timestamp, user, and cryptographic seal",
              "Delaware DGCL § 141-compliant Merkle proof — defensible in board governance proceedings",
              "Configurable data residency per enterprise deployment",
              "Parametric fallback ensures zero external LLM data exposure in air-gapped environments",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-sm text-orange-600 font-medium">
            SOC 2 Type II certification in progress — target Q1 2027
          </p>
        </section>

        {/* Use Cases */}
        <section>
          <h2 className="text-2xl font-bold mb-6">Use Cases</h2>
          <div className="space-y-4">
            {[
              {
                title: "Contract Dispute Resolution",
                scenario: 'Supplier claims force majeure on $2.4M delivery contract — negotiate, litigate, or terminate?',
                outcome: "Generates 3 strategic paths, computes legal cost vs. settlement value, seals recommendation.",
              },
              {
                title: "Customer Churn Crisis",
                scenario: "Top 3 enterprise accounts threatening non-renewal.",
                outcome: "Models retention probability per account, simulates ARR impact, outputs prioritized action plan.",
              },
              {
                title: "Regulatory Compliance Risk",
                scenario: "New EU AI Act requirements may conflict with data pipeline.",
                outcome: "Maps obligations to architecture, scores non-compliance risk, generates remediation roadmap.",
              },
              {
                title: "M&A Due Diligence",
                scenario: "Acquisition target has undisclosed IP litigation — proceed, restructure, or walk away?",
                outcome: "Causal scenario analysis on deal value under each path, sealed as board resolution.",
              },
            ].map((uc, i) => (
              <div key={i} className="border border-gray-200 rounded-xl p-5">
                <h3 className="font-semibold mb-1">{uc.title}</h3>
                <p className="text-sm text-gray-500 italic mb-2">"{uc.scenario}"</p>
                <p className="text-sm text-gray-700">→ {uc.outcome}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Contact */}
        <section className="border-t border-gray-200 pt-10">
          <h2 className="text-2xl font-bold mb-4">Contact</h2>
          <div className="text-sm text-gray-700 space-y-1">
            <p>📧 <a href="mailto:novaecosystems@gmail.com" className="text-orange-600 hover:underline">novaecosystems@gmail.com</a></p>
            <p>🌐 <a href="https://causarix.vercel.app" className="text-orange-600 hover:underline">causarix.vercel.app</a></p>
          </div>
          <p className="mt-8 text-xs text-gray-400 italic">
            Causarix is built for enterprises that treat decisions as infrastructure.
          </p>
        </section>

      </div>
    </div>
  );
}
