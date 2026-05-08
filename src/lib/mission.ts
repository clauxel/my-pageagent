export type PlanId = 'starter' | 'pro' | 'scale'

export type Option<T extends string = string> = {
  id: T
  label: string
  summary: string
}

export type AgentSelection = {
  surface: 'saas' | 'admin' | 'commerce' | 'docs'
  integration: 'script' | 'npm' | 'extension'
  scope: 'single' | 'workflow' | 'multipage'
  model: 'bring' | 'managed' | 'hybrid'
  safety: 'review' | 'guarded'
  output: 'copilot' | 'tasks' | 'mcp'
}

export type AgentResult = {
  fitScore: number
  fitLabel: string
  headline: string
  recommendedPlanId: PlanId
  architecture: string
  runShape: string
  confidence: string
  reasons: string[]
  watchouts: string[]
  modules: Array<{ label: string; detail: string }>
  nextSteps: string[]
  operatorMessage: string
}

export const surfaceOptions: Option<AgentSelection['surface']>[] = [
  { id: 'saas', label: 'SaaS app', summary: 'Embed an AI copilot into account, billing, admin, or workflow screens.' },
  { id: 'admin', label: 'Internal console', summary: 'Turn repeated back-office clicks into guided natural-language actions.' },
  { id: 'commerce', label: 'Commerce flow', summary: 'Assist buyers, operators, or support teams through forms and order tasks.' },
  { id: 'docs', label: 'Docs or portal', summary: 'Help visitors navigate structured pages and complete support workflows.' },
]

export const integrationOptions: Option<AgentSelection['integration']>[] = [
  { id: 'script', label: 'Script tag', summary: 'Fastest path for a product team testing in-page JavaScript control.' },
  { id: 'npm', label: 'NPM package', summary: 'Better when the agent belongs in a typed frontend codebase.' },
  { id: 'extension', label: 'Extension bridge', summary: 'Useful when tasks must cross tabs, apps, or logged-in pages.' },
]

export const scopeOptions: Option<AgentSelection['scope']>[] = [
  { id: 'single', label: 'One screen', summary: 'Start with a contained page and a small set of approved actions.' },
  { id: 'workflow', label: 'Workflow lane', summary: 'Guide multi-step forms, settings changes, and repeated operator tasks.' },
  { id: 'multipage', label: 'Multi-page', summary: 'Plan for extension or MCP-style control across browsing context.' },
]

export const modelOptions: Option<AgentSelection['model']>[] = [
  { id: 'bring', label: 'Bring your LLM', summary: 'Connect your existing model endpoint and keep provider choice open.' },
  { id: 'managed', label: 'Managed setup', summary: 'Use onboarding support to get prompts, policies, and runtime wiring right.' },
  { id: 'hybrid', label: 'Hybrid routing', summary: 'Use different models for routine actions, sensitive flows, and evaluation.' },
]

export const safetyOptions: Option<AgentSelection['safety']>[] = [
  { id: 'review', label: 'Review gate', summary: 'Require explicit user confirmation before consequential actions.' },
  { id: 'guarded', label: 'Guarded actions', summary: 'Add allow-lists, blocked selectors, audit logs, and checkout-safe defaults.' },
]

export const outputOptions: Option<AgentSelection['output']>[] = [
  { id: 'copilot', label: 'In-page copilot', summary: 'A visible assistant that explains the next action before it acts.' },
  { id: 'tasks', label: 'Task runner', summary: 'A queue for repeated operator actions and post-run summaries.' },
  { id: 'mcp', label: 'MCP bridge', summary: 'Let external agent clients ask the browser to perform approved actions.' },
]

export const defaultAgentSelection: AgentSelection = {
  surface: 'saas',
  integration: 'npm',
  scope: 'workflow',
  model: 'hybrid',
  safety: 'guarded',
  output: 'copilot',
}

export function analyzeAgentSelection(selection: AgentSelection): AgentResult {
  let score = 70
  const reasons: string[] = []
  const watchouts: string[] = []

  if (selection.surface === 'saas' || selection.surface === 'admin') {
    score += 8
    reasons.push('Page Agent fits products where logged-in users repeat structured clicks, forms, and settings changes.')
  } else if (selection.surface === 'commerce') {
    score += 4
    reasons.push('Commerce flows can benefit when actions stay explainable and confirmation remains explicit.')
  } else {
    score += 1
    watchouts.push('Docs and portals work best when the agent can complete a real support workflow, not just answer questions.')
  }

  if (selection.integration === 'npm') {
    score += 7
    reasons.push('The NPM path is strongest for teams that want typed integration and versioned release control.')
  } else if (selection.integration === 'script') {
    score += 5
    reasons.push('A script-tag trial is a fast way to prove the in-page agent before a deeper product rollout.')
  } else {
    score += 3
    watchouts.push('Extension-based work should define tab boundaries, permissions, and user consent before launch.')
  }

  if (selection.scope === 'workflow') {
    score += 8
    reasons.push('Workflow lanes show value quickly because the agent can compress many clicks into one reviewed request.')
  } else if (selection.scope === 'single') {
    score += 4
    watchouts.push('A one-screen pilot should still include success, failure, and handoff states.')
  } else {
    score += 2
    watchouts.push('Multi-page automation needs stronger consent, session, and recovery rules than a single page.')
  }

  if (selection.model === 'hybrid') {
    score += 6
    reasons.push('Hybrid model routing keeps routine page actions economical while preserving quality for judgment-heavy steps.')
  } else if (selection.model === 'bring') {
    score += 3
    reasons.push('Bring-your-own-model keeps procurement and data policies under your control.')
  } else {
    score += 2
    watchouts.push('Managed model setup should document what data is sent to providers and why.')
  }

  if (selection.safety === 'guarded') {
    score += 7
    reasons.push('Guarded actions are the practical default for production UI control.')
  } else {
    score -= selection.scope === 'multipage' ? 5 : 1
    watchouts.push('Review gates should be visible before the agent changes records, payments, permissions, or production data.')
  }

  if (selection.output === 'mcp') {
    score += selection.scope === 'multipage' ? 3 : 0
    watchouts.push('MCP control is powerful, but it should be introduced after the in-page action policy is proven.')
  } else if (selection.output === 'copilot') {
    score += 3
  }

  score = Math.max(42, Math.min(96, score))

  const recommendedPlanId: PlanId =
    selection.scope === 'multipage' || selection.output === 'mcp' || selection.integration === 'extension'
      ? 'scale'
      : selection.scope === 'single' && selection.integration === 'script'
        ? 'starter'
        : 'pro'

  const fitLabel = score >= 86 ? 'Strong fit' : score >= 74 ? 'Good fit' : score >= 60 ? 'Pilot first' : 'Needs scoping'
  const confidence = score >= 86 ? 'High' : score >= 74 ? 'Moderate' : 'Cautious'
  const architecture =
    selection.integration === 'script'
      ? 'Script-tag pilot with hosted policy review'
      : selection.integration === 'extension'
        ? 'Extension-ready rollout with MCP planning'
        : 'NPM integration with managed launch support'
  const runShape =
    selection.scope === 'single'
      ? 'Map page -> allow actions -> test prompt -> review'
      : selection.scope === 'workflow'
        ? 'Map workflow -> guard actions -> run tasks -> measure'
        : 'Map tabs -> confirm permissions -> bridge MCP -> audit'

  const modules = [
    { label: 'DOM control', detail: 'Use page structure and visible controls instead of screenshot-only automation.' },
    { label: 'Integration', detail: architecture },
    {
      label: 'Model route',
      detail: selection.model === 'bring' ? 'Connect your own compatible LLM endpoint.' : 'Plan model policy during onboarding.',
    },
    {
      label: 'Safety',
      detail: selection.safety === 'guarded' ? 'Action allow-list, blocked states, and audit trail.' : 'Human confirmation before high-impact steps.',
    },
  ]

  const nextSteps = [
    'Choose one workflow where a user currently repeats several clicks.',
    'List the selectors, fields, and actions the agent may use.',
    'Keep Pro annual selected unless the first launch is only a script-tag pilot or already needs extension/MCP rollout.',
    'Open Creem checkout from the pricing page; the product page stays visible behind the payment window.',
  ]

  return {
    fitScore: score,
    fitLabel,
    headline:
      score >= 74
        ? 'This workflow is ready for a Page Agent launch plan.'
        : 'Start with a smaller in-page pilot before expanding automation scope.',
    recommendedPlanId,
    architecture,
    runShape,
    confidence,
    reasons,
    watchouts: watchouts.length ? watchouts : ['Keep irreversible actions behind explicit user confirmation until the policy is proven.'],
    modules,
    nextSteps,
    operatorMessage:
      recommendedPlanId === 'scale'
        ? 'Pro annual is still the best checkout default unless extension or MCP rollout is required on day one.'
        : recommendedPlanId === 'starter'
          ? 'Starter can prove the script path, but Pro annual is the best default for production launch support.'
          : 'Pro annual is the cleanest default for a serious Page Agent rollout.',
  }
}
