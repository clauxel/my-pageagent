export type KeywordSection = {
  heading: string
  paragraphs: string[]
  bullets?: string[]
}

export type KeywordFaq = {
  question: string
  answer: string
}

export type KeywordPage = {
  path: string
  eyebrow: string
  title: string
  description: string
  h1: string
  lede: string
  intent: string
  ctaLabel: string
  sections: KeywordSection[]
  faqs: KeywordFaq[]
}

export const keywordPages: KeywordPage[] = [
  {
    path: '/page-agent-extension',
    eyebrow: 'Extension',
    title: 'Page Agent Extension Guide',
    description:
      'A practical guide to Page Agent Extension use cases, multi-page browser control, consent, safety boundaries, and when a managed launch plan is worth it.',
    h1: 'Page Agent Extension: when in-page control needs to cross tabs',
    lede:
      'The core Page Agent idea works inside a web page. The extension path matters when a workflow moves across tabs, authenticated products, or browser-level context. This guide helps product teams decide whether an extension belongs in the first rollout or should wait until the in-page pilot proves value.',
    intent: 'For teams evaluating whether Page Agent should stay embedded in one app or extend into broader browser workflows.',
    ctaLabel: 'Review Pro annual',
    sections: [
      {
        heading: 'Use the extension only when the workflow needs it',
        paragraphs: [
          'A browser extension can unlock multi-page tasks, but it also adds consent, permissions, distribution, review, and support complexity. A better first step is often an in-page launch that controls one high-value workflow inside your own product.',
          'Use the extension path when the user must move between tabs, third-party pages, or multiple authenticated screens that cannot be embedded in the product itself.',
        ],
        bullets: [
          'Start in-page when the workflow lives inside your SaaS product.',
          'Move to extension control when the agent must coordinate several tabs.',
          'Explain permissions clearly before the user authorizes browser access.',
          'Keep irreversible actions behind confirmation even after extension setup.',
        ],
      },
      {
        heading: 'What to plan before rollout',
        paragraphs: [
          'Map the exact domains, pages, selectors, and actions the extension may touch. Then define blocked states: payments, destructive account changes, exports, private messages, or anything that creates legal or operational risk.',
          'PageAgent Space helps teams turn those rules into a launch plan before checkout, so the extension does not become a vague automation promise.',
        ],
      },
      {
        heading: 'Why the managed plan defaults to Pro',
        paragraphs: [
          'Extension rollouts usually need more than a demo. They need policy review, analytics, copy for permission prompts, failure states, and a human-readable audit trail. That is why Pro annual is selected by default on the pricing page.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is the extension required for Page Agent?',
        answer:
          'No. The main Page Agent value starts with in-page JavaScript. The extension is optional for workflows that must cross browser tabs or external pages.',
      },
      {
        question: 'Should the first launch use an extension?',
        answer:
          'Usually not unless the business value depends on multi-page control. A contained in-page workflow is faster to test and easier to support.',
      },
      {
        question: 'Can checkout help with extension planning?',
        answer:
          'Yes. Pro annual is aimed at teams that need launch support for policy, prompts, analytics, and production handoff.',
      },
    ],
  },
  {
    path: '/page-agent-js',
    eyebrow: 'JavaScript',
    title: 'Page-agent JS Integration Guide',
    description:
      'Learn how Page-agent JS works as an in-page GUI agent, where script and NPM integration fit, and how to prepare a production-safe rollout.',
    h1: 'Page-agent JS turns your existing web UI into an agent surface',
    lede:
      'Page-agent JS is compelling because it runs where the user already works: inside the page. It can read structured DOM context, locate visible controls, and execute guided actions without forcing every team into a headless browser stack.',
    intent: 'For frontend and product teams deciding how to embed Page Agent inside an existing SaaS application.',
    ctaLabel: 'Choose Pro annual',
    sections: [
      {
        heading: 'Script tag or NPM package',
        paragraphs: [
          'A script tag is the fastest evaluation path. It lets a product team test natural-language control on a staging page and identify the workflow that creates measurable value.',
          'The NPM path is better for production because it fits typed builds, release review, version pinning, and feature flags. Teams can keep model routing, telemetry, and safety policy under normal frontend governance.',
        ],
        bullets: [
          'Use script-tag trials for speed and stakeholder demos.',
          'Use NPM integration for production release control.',
          'Keep the agent behind feature flags until prompts and actions are stable.',
          'Instrument prompt, action, checkout, and completion events from day one.',
        ],
      },
      {
        heading: 'DOM-based control changes the cost model',
        paragraphs: [
          'A page-level agent can use text, labels, buttons, forms, and accessible structure rather than relying only on screenshots. That can make common tasks faster, cheaper, and easier to inspect.',
          'The tradeoff is responsibility. Your app should have reliable labels, predictable state, clear disabled controls, and a policy for actions that require confirmation.',
        ],
      },
      {
        heading: 'A good first workflow',
        paragraphs: [
          'Pick a workflow where the user knows the desired outcome but hates the steps: updating settings, filling a structured form, creating a report, triaging a support case, or navigating a dense admin console.',
          'Avoid a first launch that tries to control the whole product. Pro annual works best when the first paid scope is concrete and measurable.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does Page-agent JS need a backend rewrite?',
        answer:
          'Not for the first evaluation. It can start in the browser, but production teams still need model policy, secrets handling, analytics, and action safety.',
      },
      {
        question: 'Can I bring my own LLM endpoint?',
        answer:
          'Yes. The Page Agent approach supports bring-your-own-model patterns. The managed launch plan helps define what data goes to the model and what stays local.',
      },
      {
        question: 'Which plan fits a JavaScript integration?',
        answer:
          'Pro annual is the default for production launch support. Starter is enough for a narrow proof of concept.',
      },
    ],
  },
  {
    path: '/page-agent-ai',
    eyebrow: 'AI',
    title: 'Page-agent AI for SaaS Products',
    description:
      'Page-agent AI guidance for turning browser UI into natural-language workflows with review gates, analytics, model routing, and conversion-focused onboarding.',
    h1: 'Page-agent AI should feel like a capable operator, not a chat widget',
    lede:
      'The value of Page-agent AI is not another floating chat bubble. The value is letting a user state the outcome, see the planned action, approve sensitive steps, and finish the workflow inside the product they already trust.',
    intent: 'For SaaS teams that want an AI copilot capable of acting on the page, not just answering support questions.',
    ctaLabel: 'Review Pro annual',
    sections: [
      {
        heading: 'From answers to actions',
        paragraphs: [
          'A normal chatbot can explain where a setting lives. A Page-agent AI workflow can find the setting, prepare the change, summarize what will happen, and ask the user to confirm before applying it.',
          'That action layer is why the first launch must be scoped. The agent should know which controls are allowed, which states are blocked, and what to do when the page changes unexpectedly.',
        ],
        bullets: [
          'Use action previews before the agent clicks.',
          'Preserve a visible log of completed and skipped steps.',
          'Measure workflow completion, not just chat engagement.',
          'Escalate ambiguous or risky states to human review.',
        ],
      },
      {
        heading: 'Model routing and cost control',
        paragraphs: [
          'Not every step needs the same model. Routine DOM selection, summaries, policy checks, and judgment-heavy steps can use different routing. Hybrid routing keeps costs predictable without weakening the user experience.',
          'A launch plan should define what the model sees, how long logs are retained, and whether the user can opt out of analytics or assisted actions.',
        ],
      },
      {
        heading: 'How payment stays aligned with trust',
        paragraphs: [
          'The pricing flow keeps Pro annual selected because serious Page-agent AI deployments require workflow design, safety review, and analytics. Checkout opens in a centered Polar window so the buyer never loses the product context.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is Page-agent AI the same as a support chatbot?',
        answer:
          'No. It can include conversational guidance, but the important difference is controlled action on the web interface.',
      },
      {
        question: 'How should risky actions be handled?',
        answer:
          'Use confirmations, blocked selectors, clear copy, audit events, and human review for consequential operations.',
      },
      {
        question: 'Why annual by default?',
        answer:
          'A production AI action layer takes more than a short demo. Annual billing is selected by default and is 50% cheaper than monthly.',
      },
    ],
  },
  {
    path: '/page-agent-openclaw',
    eyebrow: 'OpenClaw',
    title: 'Page Agent and OpenClaw Workflow Comparison',
    description:
      'Compare Page Agent in-page automation with OpenClaw-style browser and agent workflows, including where each approach fits and how to plan a safer rollout.',
    h1: 'Page Agent and OpenClaw solve different parts of browser automation',
    lede:
      'Teams searching for Page Agent OpenClaw are usually comparing two automation instincts: put the agent inside the page, or let an external agent operate the browser. The right answer depends on ownership, permissions, and the workflow surface.',
    intent: 'For buyers comparing in-page JavaScript agents with broader external browser-agent workflows.',
    ctaLabel: 'Compare plans',
    sections: [
      {
        heading: 'In-page control is best when you own the product',
        paragraphs: [
          'Page Agent is strongest when the team controls the web app. The agent can be integrated with the frontend, product copy, state, analytics, and safety rules. That makes the experience feel native rather than bolted on.',
          'OpenClaw-style external browser control is useful when the work spans tools you do not own, desktop surfaces, or research flows that cannot be embedded in one product.',
        ],
        bullets: [
          'Choose Page Agent for owned SaaS workflows and native copilots.',
          'Choose external browser control for cross-site research or operator tasks.',
          'Use extension or MCP planning when the workflow leaves the page.',
          'Keep payment and onboarding on your own domain for buyer trust.',
        ],
      },
      {
        heading: 'The safest combined architecture',
        paragraphs: [
          'A common pattern is to launch Page Agent inside the product first, then add an extension or MCP bridge only for the tasks that truly need browser-level reach.',
          'That staged approach keeps the first paid deployment easier to explain, test, and measure. It also avoids asking users for broad browser permissions before value is proven.',
        ],
      },
      {
        heading: 'How PageAgent Space packages the decision',
        paragraphs: [
          'The homepage fit console asks about surface, integration, scope, model routing, safety, and output. Those answers help decide whether Pro annual is enough or whether Scale is needed for extension and MCP work.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is PageAgent Space an OpenClaw product?',
        answer:
          'No. This site offers a managed Page Agent launch path and explains how in-page and external browser-agent patterns can fit together.',
      },
      {
        question: 'Can the two approaches coexist?',
        answer:
          'Yes. Many teams start with in-page control, then use extension or MCP patterns for workflows that must leave the app.',
      },
      {
        question: 'Which plan should I choose for extension or MCP work?',
        answer:
          'Scale is appropriate when extension or MCP rollout is required immediately. Pro annual remains the default for an owned SaaS in-page launch.',
      },
    ],
  },
  {
    path: '/page-agent-github',
    eyebrow: 'GitHub',
    title: 'Page-agent GitHub Review Guide',
    description:
      'A useful Page-agent GitHub guide covering the Alibaba repository, docs review, release checks, integration planning, and production launch questions.',
    h1: 'Page-agent GitHub review: what to inspect before you launch',
    lede:
      'The Page Agent repository is the right starting point for technical diligence. Before you put an AI action layer in front of customers, review the source, docs, releases, integration pattern, and safety implications.',
    intent: 'For technical buyers who found Page Agent on GitHub and need a practical SaaS launch checklist.',
    ctaLabel: 'Choose Pro annual',
    sections: [
      {
        heading: 'What to inspect in the repository',
        paragraphs: [
          'Start with the README and documentation to confirm the core model: in-page JavaScript, DOM-based context, optional extension support, and optional MCP integration. Then inspect examples to see how actions are triggered and how model configuration is passed.',
          'Look at package versions, release notes, issue activity, and licensing. Technical popularity is useful, but production fit still depends on your app structure, data policy, and workflow design.',
        ],
        bullets: [
          'Confirm the current package version and installation path.',
          'Review examples for action execution, language settings, and model setup.',
          'Check how the project describes extension and MCP boundaries.',
          'Decide which production actions require explicit confirmation.',
        ],
      },
      {
        heading: 'From open source to paid rollout',
        paragraphs: [
          'Open source answers whether the foundation is credible. A paid rollout answers whether your product can safely support real users. That includes UX copy, analytics, model routing, fallback behavior, and support readiness.',
          'PageAgent Space turns the GitHub review into a launch plan and keeps checkout tied to the plan the buyer just evaluated.',
        ],
      },
      {
        heading: 'Useful GitHub questions for stakeholders',
        paragraphs: [
          'Ask which workflow will be launched first, who owns action policy, which model endpoint is allowed, how logs are stored, and how support handles failed or partial agent actions. Those questions matter more than a generic AI demo.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Where is the upstream Page Agent repository?',
        answer:
          'The public upstream repository is github.com/alibaba/page-agent. Review it directly before making production technical decisions.',
      },
      {
        question: 'Does PageAgent Space replace the GitHub docs?',
        answer:
          'No. The docs explain the open-source project. PageAgent Space focuses on SaaS launch planning, pricing, checkout, and production readiness.',
      },
      {
        question: 'Is open source enough for a production launch?',
        answer:
          'Usually not by itself. You still need action policy, analytics, UX, support, model governance, and rollout controls.',
      },
    ],
  },
  {
    path: '/page-agent-example',
    eyebrow: 'Example',
    title: 'Page Agent Example Workflow',
    description:
      'A concrete Page Agent example showing how a SaaS settings workflow can become a natural-language in-page assistant with review and analytics.',
    h1: 'Page Agent example: turn a settings workflow into one reviewed request',
    lede:
      'A useful Page Agent example should be specific. Imagine a SaaS admin screen where an operator needs to update a team plan, add a billing contact, change permissions, and send a confirmation note. The agent should guide the work without hiding risk.',
    intent: 'For product teams looking for a concrete Page Agent workflow before committing to a paid launch plan.',
    ctaLabel: 'Review Pro annual',
    sections: [
      {
        heading: 'The example workflow',
        paragraphs: [
          'The user types: Update Acme to the growth plan, add finance@acme.example as billing contact, and keep admin permissions unchanged. The agent reads the current page state, identifies the plan control, checks the billing contact field, and prepares a step-by-step action preview.',
          'Before applying changes, the agent shows what will change and what will not. The user confirms, the agent clicks through the approved controls, and the page records a completion event.',
        ],
        bullets: [
          'Read the visible account, plan, and permission state.',
          'Prepare the requested changes but do not submit immediately.',
          'Ask for confirmation before changing plan or billing details.',
          'Write an audit summary when the workflow completes.',
        ],
      },
      {
        heading: 'What makes the example production-ready',
        paragraphs: [
          'The product team must define allowed selectors, blocked actions, copy for confirmation states, and analytics events for plan selection, action preview, confirmation, failure, and completion.',
          'A great example also includes unhappy paths: missing fields, disabled buttons, conflicting permissions, model uncertainty, and a clean handoff to support.',
        ],
      },
      {
        heading: 'Why the example leads to pricing',
        paragraphs: [
          'A buyer who understands the workflow is more likely to choose a plan confidently. That is why the site moves from the fit console to pricing, keeps Pro annual selected, and opens Polar checkout only after the buyer clicks Checkout.',
        ],
      },
    ],
    faqs: [
      {
        question: 'What is a bad first Page Agent example?',
        answer:
          'A broad "control everything in my app" demo is usually too vague. Start with one workflow that has clear value and clear risk boundaries.',
      },
      {
        question: 'Should examples include failure states?',
        answer:
          'Yes. Failure states build trust because they show the agent knows when not to act.',
      },
      {
        question: 'Can PageAgent Space help pick the first example?',
        answer:
          'Yes. The fit console and Pro launch plan are designed around selecting and shipping the first useful workflow.',
      },
    ],
  },
  {
    path: '/page-agent-alibaba',
    eyebrow: 'Alibaba',
    title: 'Page Agent Alibaba Project Overview',
    description:
      'Understand the Alibaba Page Agent open-source project, its in-page JavaScript value, optional extension and MCP paths, and how to turn it into a SaaS rollout.',
    h1: 'Page Agent Alibaba project: what product teams should take from it',
    lede:
      'The Alibaba Page Agent project showed a clear idea: a GUI agent can live inside a webpage and control web interfaces with natural language. Product teams should translate that idea into a scoped, measured, trustworthy launch.',
    intent: 'For visitors researching the Alibaba Page Agent project and deciding how it can become a production SaaS feature.',
    ctaLabel: 'Plan a Pro launch',
    sections: [
      {
        heading: 'The valuable product insight',
        paragraphs: [
          'The most important insight is placement. When the agent lives inside the page, it can be closer to the product state, copy, controls, and user intent. That can feel more trustworthy than a separate automation layer when the team owns the app.',
          'The public project also emphasizes that in-page JavaScript can avoid some of the cost and permission overhead of screenshot-first browser automation for common tasks.',
        ],
        bullets: [
          'Use the page structure you already control.',
          'Keep natural-language action close to visible UI.',
          'Let users approve meaningful changes before submission.',
          'Measure completion and drop-off like any other product workflow.',
        ],
      },
      {
        heading: 'What the open-source project does not decide for you',
        paragraphs: [
          'The repository cannot choose your first workflow, support policy, payment model, privacy copy, model provider, blocked actions, or conversion path. Those are product decisions.',
          'PageAgent Space exists for that layer: turning the open-source idea into a launch plan, plan selection, payment flow, and post-checkout onboarding.',
        ],
      },
      {
        heading: 'How to evaluate fit',
        paragraphs: [
          'If users already repeat structured UI work in your product, Page Agent may be a strong fit. If the product lacks stable labels, clear states, and a narrow first workflow, invest in UX structure before automation.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Is this site operated by Alibaba?',
        answer:
          'No. PageAgent Space is an independent managed launch site that references the public Page Agent project and builds a SaaS rollout path around the concept.',
      },
      {
        question: 'Can I use the open-source project directly?',
        answer:
          'Yes, if your team can review, integrate, secure, and support it. The managed plan is for teams that want help turning the concept into a product launch.',
      },
      {
        question: 'What should I read first?',
        answer:
          'Read the upstream README and docs, then use this site to think through workflow scope, safety, pricing, and launch support.',
      },
    ],
  },
  {
    path: '/page-agent-mcp',
    eyebrow: 'MCP',
    title: 'Page Agent MCP Planning Guide',
    description:
      'Plan Page Agent MCP workflows with browser control boundaries, external agent clients, consent, audit events, and a safer path from in-page pilot to MCP rollout.',
    h1: 'Page Agent MCP turns browser control into an agent interface',
    lede:
      'MCP is attractive because it can let external agent clients ask a browser to perform approved work. For Page Agent, the practical question is how to expose that power without losing user consent, auditability, and product context.',
    intent: 'For teams considering Page Agent MCP after an in-page JavaScript pilot or extension rollout.',
    ctaLabel: 'Compare Scale and Pro',
    sections: [
      {
        heading: 'Start with in-page policy',
        paragraphs: [
          'Before exposing browser actions through MCP, define the in-page action policy: which selectors are allowed, which routes are blocked, which actions require confirmation, and which events must be logged.',
          'Once that policy is stable, MCP can extend the same rules to external clients instead of inventing a second trust model.',
        ],
        bullets: [
          'Name the clients allowed to request browser actions.',
          'Require explicit consent for high-impact tasks.',
          'Record prompts, planned actions, approvals, and results.',
          'Keep secrets out of prompts, logs, and visible page content.',
        ],
      },
      {
        heading: 'When MCP belongs in the first purchase',
        paragraphs: [
          'MCP belongs in the first purchase when the buyer already needs external agent clients, cross-tool coordination, or browser control from a larger automation system. Otherwise, launch the in-page copilot first and add MCP after usage data proves the workflow.',
          'The pricing page keeps Pro annual selected by default. Scale is available for teams that need MCP planning, extension rollout, and heavier governance from day one.',
        ],
      },
      {
        heading: 'What success looks like',
        paragraphs: [
          'A successful MCP rollout does not feel like magic. It feels like a reliable control surface: the user knows what client asked for action, what the browser will do, what happened, and how to stop or reverse a workflow when needed.',
        ],
      },
    ],
    faqs: [
      {
        question: 'Does every Page Agent launch need MCP?',
        answer:
          'No. MCP is useful for external agent clients, but most product teams should prove the in-page workflow first.',
      },
      {
        question: 'Which plan includes MCP planning?',
        answer:
          'Scale is the right fit when MCP is required immediately. Pro annual is still the default for an owned SaaS in-page rollout.',
      },
      {
        question: 'How should MCP actions be audited?',
        answer:
          'Log the requesting client, user confirmation, intended action, result, failure state, and any human handoff.',
      },
    ],
  },
]

export function findKeywordPageByPath(pathname: string) {
  const normalized = pathname.replace(/\/+$/, '') || '/'
  return keywordPages.find((page) => page.path === normalized) ?? null
}
