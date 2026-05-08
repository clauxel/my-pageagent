import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  ArrowRight,
  BadgeCheck,
  Bot,
  BrainCircuit,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  ExternalLink,
  FileText,
  Github,
  Globe2,
  Layers3,
  LockKeyhole,
  MousePointerClick,
  PanelRightOpen,
  Play,
  Puzzle,
  Radar,
  Route,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
  Workflow,
  X,
  Zap,
} from 'lucide-react'

import { findKeywordPageByPath, keywordPages, type KeywordPage } from './content/keyword-pages'
import { trackEvent, trackPageView } from './lib/analytics'
import {
  analyzeAgentSelection,
  defaultAgentSelection,
  integrationOptions,
  modelOptions,
  outputOptions,
  safetyOptions,
  scopeOptions,
  surfaceOptions,
  type AgentSelection,
  type PlanId,
} from './lib/mission'
import { buildSeoDocument, syncSeoDocument } from './lib/seo'
import { deriveRouteView, normalizePathname, scrollToHashTarget, type RouteView } from './lib/routing'

const defaultPublicAppOrigin = 'https://pageagent.space'
const pagesApiBaseUrl = 'https://my-pageagent.yangdengkui01.workers.dev'

type Billing = 'monthly' | 'annual'

type CheckoutModalState = {
  planId: PlanId
  billing: Billing
  loadingKey: string
  status: 'loading' | 'popup' | 'retry'
  checkoutUrl?: string
}

const ctaPrimary = 'Choose Pro annual'
const ctaCheckout = 'Checkout Pro annual'

const plans: Array<{
  id: PlanId
  name: string
  shortName: string
  tagline: string
  monthlyUsd: number
  bullets: string[]
  popular?: boolean
}> = [
  {
    id: 'starter',
    name: 'Starter',
    shortName: 'Starter',
    tagline: 'A focused in-page pilot for one workflow and one integration surface.',
    monthlyUsd: 39,
    bullets: ['One workflow map', 'Script-tag or NPM review', 'Launch copy checklist', 'Email onboarding support'],
  },
  {
    id: 'pro',
    name: 'Pro',
    shortName: 'Pro',
    tagline: 'The default plan for a production Page Agent launch inside a SaaS product.',
    monthlyUsd: 149,
    popular: true,
    bullets: ['Action policy design', 'NPM launch support', 'Analytics and conversion events', 'Priority checkout onboarding'],
  },
  {
    id: 'scale',
    name: 'Scale',
    shortName: 'Scale',
    tagline: 'For extension, MCP, multi-page control, private model routing, and governance.',
    monthlyUsd: 399,
    bullets: ['Extension rollout planning', 'MCP bridge architecture', 'Guardrail and audit model', 'Dedicated launch support'],
  },
]

const proofItems = [
  { label: 'Default plan', value: 'Pro', detail: 'Middle tier selected before checkout' },
  { label: 'Annual savings', value: '50%', detail: 'Annual billing is active by default' },
  { label: 'Checkout flow', value: 'Popup', detail: 'Creem opens centered while this page stays visible' },
  { label: 'Launch scope', value: '1st workflow', detail: 'Start with one valuable page action lane' },
]

const workflowCards = [
  {
    title: 'In-page JavaScript agent',
    body: 'Embed the agent where users already work, using DOM context and visible controls instead of a separate automation shell.',
    icon: <Code2 size={21} />,
  },
  {
    title: 'Action policy before clicks',
    body: 'Define allowed selectors, blocked states, confirmations, and handoff rules before the first production task.',
    icon: <ShieldCheck size={21} />,
  },
  {
    title: 'Model routing that stays practical',
    body: 'Bring your own LLM or use hybrid routing so routine page actions and judgment-heavy steps do not cost the same.',
    icon: <BrainCircuit size={21} />,
  },
  {
    title: 'Extension and MCP when needed',
    body: 'Start inside the product, then expand to extension or MCP control only when the workflow must cross browser context.',
    icon: <Puzzle size={21} />,
  },
]

const trustLinks = [
  {
    label: 'Alibaba Page Agent',
    href: 'https://github.com/alibaba/page-agent',
    icon: <Github size={17} />,
  },
  {
    label: 'JS integration',
    href: '/page-agent-js',
    icon: <TerminalSquare size={17} />,
    internal: true,
  },
  {
    label: 'MCP planning',
    href: '/page-agent-mcp',
    icon: <Route size={17} />,
    internal: true,
  },
]

const legalPrivacySections = [
  {
    title: 'What we collect',
    paragraphs: [
      'PageAgent Space collects only information reasonably needed to operate this website, process checkout, understand product usage, prevent abuse, and respond to support requests.',
      'This may include page views, referral and UTM data, browser and device information, approximate location derived from network data, checkout metadata, support emails, and information you intentionally submit.',
      'The public fit console runs from your selections in the browser. It does not require you to upload credentials, secrets, source code, production data, customer records, or regulated information.',
    ],
  },
  {
    title: 'How we use information',
    paragraphs: [
      'We use analytics to understand which pages, plan choices, and checkout actions help visitors make a confident decision.',
      'We use checkout metadata to create payment sessions, confirm purchases, return users to the homepage, provide onboarding, detect fraud, and handle support.',
      'We do not sell personal information. We do not use private application data for model training through this public website because the public website does not collect that data.',
    ],
  },
  {
    title: 'Service providers and third parties',
    paragraphs: [
      'We use service providers such as Cloudflare for hosting, security, routing, and analytics infrastructure, and Creem for hosted checkout and payment processing.',
      'Payment details are handled by the payment provider. We do not ask users to send card numbers, API keys, passwords, private keys, or production secrets through email or this public fit console.',
      'Third-party services process information under their own terms and privacy practices. Do not proceed with checkout or external links if you do not accept those practices.',
    ],
  },
  {
    title: 'Security, retention, and deletion',
    paragraphs: [
      'We use reasonable administrative, technical, and organizational safeguards appropriate for a lightweight SaaS marketing, analytics, and checkout site.',
      'No internet service can be guaranteed perfectly secure. Users are responsible for avoiding the submission of credentials, secrets, regulated data, or highly sensitive information unless a signed, appropriate agreement says otherwise.',
      'We retain information only as long as reasonably needed for the purposes described here, including tax, accounting, fraud prevention, security, dispute handling, and legal compliance.',
    ],
  },
  {
    title: 'Your choices and rights',
    paragraphs: [
      'Depending on your location, you may have rights to request access, correction, deletion, portability, restriction, or objection regarding personal information we control.',
      'California and other privacy laws may provide additional rights when their thresholds and conditions apply. We will not discriminate against users for exercising applicable privacy rights.',
      'To make a privacy or support request, email support@aigeamy.com. We may need to verify the request before acting on it.',
    ],
  },
  {
    title: 'Children, changes, and contact',
    paragraphs: [
      'PageAgent Space is intended for business, product, and developer audiences and is not directed to children under 13.',
      'We may update this policy when the product, providers, laws, or operations change. The version posted on this page controls from the time it is published.',
      'Questions about privacy, support, or data handling should be sent to support@aigeamy.com.',
    ],
  },
]

const legalTermsSections = [
  {
    title: 'Acceptance and service scope',
    paragraphs: [
      'By accessing PageAgent Space, using the fit console, opening checkout, purchasing a plan, or continuing to use the service, you agree to these Terms.',
      'PageAgent Space provides a website, fit console, pricing flow, hosted checkout, and related onboarding for supervised Page Agent launch planning.',
      'This site is independent and is not operated by Alibaba. References to public open-source projects, GitHub repositories, extension patterns, OpenClaw, or MCP are informational and do not create endorsement, affiliation, or warranty.',
    ],
  },
  {
    title: 'User responsibilities',
    paragraphs: [
      'You are responsible for the applications, prompts, data, model providers, credentials, browser permissions, third-party accounts, and instructions you provide or authorize.',
      'Do not upload or disclose API keys, passwords, private keys, regulated data, confidential third-party information, export-controlled material, or data you are not allowed to process.',
      'Any workflow that can read pages, click controls, submit forms, change records, call external tools, send messages, collect data, or affect production systems must be operated with explicit permissions and human review.',
    ],
  },
  {
    title: 'AI and browser-action output',
    paragraphs: [
      'AI-assisted and browser-action output may be incomplete, inaccurate, insecure, infringing, unsuitable, delayed, unavailable, or wrong. You must independently review, test, validate, and approve output before relying on it.',
      'PageAgent Space does not provide legal, financial, medical, security, compliance, investment, or professional advice. Any examples, plans, summaries, or generated materials are informational only.',
      'You are solely responsible for deciding whether generated code, prompts, documentation, recommendations, browser actions, or operational steps are safe, lawful, and appropriate for your use case.',
    ],
  },
  {
    title: 'Payments, renewals, and refunds',
    paragraphs: [
      'Payments are processed by Creem in a hosted popup window. Successful checkouts return the user to the homepage.',
      'Displayed annual pricing reflects a 50% discount versus the monthly run-rate for the same plan. Prices, plan names, features, and availability may change before purchase.',
      'Unless a separate written agreement says otherwise, purchases are final to the maximum extent permitted by law. If the payment provider, consumer law, or a written policy requires a refund, that required rule controls.',
      'Chargebacks, payment abuse, or attempted circumvention of checkout may result in suspension, cancellation, or refusal of service.',
    ],
  },
  {
    title: 'Prohibited use',
    paragraphs: [
      'You may not use PageAgent Space to violate law, infringe rights, attack systems, distribute malware, bypass access controls, scrape where prohibited, spam, impersonate others, misrepresent AI output, or process data without authority.',
      'You may not reverse engineer, overload, interfere with, resell, frame, copy, or exploit the service except as expressly permitted in writing.',
      'We may suspend or terminate access, refuse checkout, preserve evidence, or cooperate with lawful requests when we believe use is unsafe, abusive, fraudulent, infringing, or unlawful.',
    ],
  },
  {
    title: 'Third-party services',
    paragraphs: [
      'Cloudflare, Creem, GitHub, model providers, browser tools, infrastructure providers, and other third-party services may be involved in hosting, checkout, integrations, or customer workflows.',
      'We are not responsible for third-party services, third-party outages, payment provider decisions, external repositories, external links, open-source project changes, or third-party terms.',
      'Your use of third-party services is governed by the applicable third-party terms, privacy policies, account rules, and fees.',
    ],
  },
  {
    title: 'No warranties',
    paragraphs: [
      'PageAgent Space is provided as is and as available. To the maximum extent permitted by law, we disclaim all warranties, whether express, implied, statutory, or otherwise.',
      'We do not warrant uninterrupted service, error-free operation, complete security, merchantability, fitness for a particular purpose, non-infringement, accuracy of AI output, revenue results, rankings, conversion results, checkout availability, browser compatibility, or business outcomes.',
      'You use the service at your own risk and remain responsible for backups, testing, review, security, legal compliance, and production decisions.',
    ],
  },
  {
    title: 'Limitation of liability',
    paragraphs: [
      'To the maximum extent permitted by law, PageAgent Space and its operators, affiliates, suppliers, and service providers will not be liable for indirect, incidental, special, consequential, exemplary, punitive, or lost-profit damages.',
      'To the maximum extent permitted by law, total liability for any claim relating to the service is limited to the greater of 100 USD or the amount you paid for PageAgent Space in the three months before the event giving rise to the claim.',
      'These limits apply whether the claim is based on contract, tort, negligence, strict liability, statute, warranty, or any other theory, even if a remedy fails of its essential purpose.',
    ],
  },
  {
    title: 'Indemnity',
    paragraphs: [
      'You agree to defend, indemnify, and hold harmless PageAgent Space and its operators, affiliates, suppliers, and service providers from claims, damages, liabilities, losses, costs, and fees arising from your use of the service.',
      'This includes claims arising from your data, applications, prompts, instructions, generated output, browser actions, model providers, production use, third-party accounts, violation of law, infringement, breach of these Terms, or unauthorized use of credentials or systems.',
    ],
  },
  {
    title: 'Disputes',
    paragraphs: [
      'Before filing a claim, you agree to email support@aigeamy.com and give us 30 days to try to resolve the dispute informally.',
      'To the maximum extent permitted by law, disputes must be resolved individually and not as a class, collective, consolidated, private attorney general, or representative action.',
      'To the maximum extent permitted by law, disputes will be resolved by binding arbitration or the courts with proper jurisdiction for the operator, and you waive jury trial where that waiver is enforceable.',
      'If any part of these dispute terms is unenforceable, the remaining provisions continue to apply to the maximum extent permitted by law.',
    ],
  },
  {
    title: 'Changes, termination, and contact',
    paragraphs: [
      'We may update these Terms, change or discontinue features, refuse transactions, suspend access, or terminate service when reasonably necessary for security, legal, operational, abuse-prevention, or business reasons.',
      'If a provision is unenforceable, the rest of these Terms remains effective. A failure to enforce a provision is not a waiver.',
      'Questions, notices, support requests, and dispute notices should be sent to support@aigeamy.com.',
    ],
  },
]

function formatMoney(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)
}

function resolveApiBaseUrl() {
  const configured = (import.meta.env.VITE_API_BASE_URL ?? '').trim().replace(/\/+$/, '')
  if (configured) return configured
  if (window.location.hostname.endsWith('.pages.dev')) return pagesApiBaseUrl
  return ''
}

function resolveApiUrl(path: string) {
  const apiBaseUrl = resolveApiBaseUrl()
  return apiBaseUrl ? `${apiBaseUrl}${path}` : path
}

async function readJsonResponse<T>(response: Response): Promise<T | null> {
  const rawText = await response.text()
  if (!rawText.trim()) return null
  try {
    return JSON.parse(rawText) as T
  } catch {
    return null
  }
}

async function createCheckoutSession(planId: PlanId, billing: Billing) {
  const response = await fetch(resolveApiUrl('/api/checkout'), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId, billing }),
  })

  const payload = await readJsonResponse<{ ok?: boolean; checkoutUrl?: string; error?: string }>(response)
  if (!response.ok || !payload?.ok || !payload.checkoutUrl) {
    throw new Error(payload?.error || 'Checkout could not be started.')
  }

  return payload.checkoutUrl
}

function openCenteredCheckoutWindow() {
  const width = 560
  const height = 760
  const left = Math.max(0, Math.round(window.screenX + (window.outerWidth - width) / 2))
  const top = Math.max(0, Math.round(window.screenY + (window.outerHeight - height) / 2))
  const popup = window.open(
    'about:blank',
    'pageagent-checkout',
    `popup=yes,width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`,
  )

  if (popup) {
    try {
      popup.document.title = 'Opening secure checkout'
      popup.document.body.innerHTML =
        '<main style="min-height:100vh;display:grid;place-items:center;background:#121614;color:#f8fafc;font-family:ui-sans-serif,system-ui,sans-serif;text-align:center;padding:32px"><div><h1 style="font-size:22px;margin:0 0 8px">Opening secure checkout...</h1><p style="margin:0;color:#cbd5e1">Your PageAgent Space payment window is being prepared.</p></div></main>'
    } catch {
      /* Existing named checkout windows can be cross-origin. */
    }
  }

  return popup
}

function sendPopupToCheckout(popup: Window | null, url: string) {
  if (!popup || popup.closed) return false

  try {
    popup.location.replace(url)
    popup.focus()
    return true
  } catch {
    return false
  }
}

function useRouteSignal() {
  const [pathname, setPathname] = useState(() => window.location.pathname)
  const [search, setSearch] = useState(() => window.location.search)

  function navigate(to: string) {
    const url = new URL(to, window.location.origin)
    window.history.pushState({}, '', `${url.pathname}${url.search}${url.hash}`)
    setPathname(url.pathname)
    setSearch(url.search)

    if (url.hash) {
      requestAnimationFrame(() => scrollToHashTarget(url.hash))
      return
    }

    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  useEffect(() => {
    const onPop = () => {
      setPathname(window.location.pathname)
      setSearch(window.location.search)
    }
    window.addEventListener('popstate', onPop)
    return () => window.removeEventListener('popstate', onPop)
  }, [])

  return { pathname, search, navigate }
}

function CheckoutDoneBridge({ publicAppOrigin }: { publicAppOrigin: string }) {
  useEffect(() => {
    const origin = window.location.origin || new URL(publicAppOrigin).origin

    if (window.parent !== window) {
      window.parent.postMessage({ type: 'pageagent-checkout-complete' }, origin)
      return
    }

    if (window.opener) {
      try {
        window.opener.postMessage({ type: 'pageagent-checkout-complete' }, origin)
      } catch {
        /* The opener may be closed or cross-origin. */
      }
      window.close()
      return
    }

    window.location.replace(`${origin}/?payment=success`)
  }, [publicAppOrigin])

  return (
    <main className="df-main">
      <section className="df-center-panel">
        <p className="df-eyebrow">Checkout</p>
        <h1>Finishing checkout...</h1>
        <p className="df-muted">You will return to the PageAgent Space homepage when the hosted payment session closes.</p>
      </section>
    </main>
  )
}

export default function App() {
  const { pathname, search, navigate } = useRouteSignal()
  const routeView: RouteView = useMemo(() => deriveRouteView(pathname), [pathname])
  const normalizedPath = normalizePathname(pathname)
  const keywordPage = useMemo(() => findKeywordPageByPath(pathname), [pathname])

  const [publicAppOrigin, setPublicAppOrigin] = useState(defaultPublicAppOrigin)
  const [headerCompact, setHeaderCompact] = useState(() => window.scrollY > 18)
  const [selection, setSelection] = useState<AgentSelection>(defaultAgentSelection)
  const [selectedPlanId, setSelectedPlanId] = useState<PlanId>('pro')
  const [billing, setBilling] = useState<Billing>('annual')
  const [checkoutLoadingKey, setCheckoutLoadingKey] = useState<string | null>(null)
  const [checkoutModal, setCheckoutModal] = useState<CheckoutModalState | null>(null)

  const agentFit = useMemo(() => analyzeAgentSelection(selection), [selection])

  useEffect(() => {
    const onScroll = () => setHeaderCompact(window.scrollY > 18)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    let ignore = false
    fetch(resolveApiUrl('/api/runtime'))
      .then((response) => readJsonResponse<{ publicAppOrigin?: string }>(response))
      .then((payload) => {
        if (!ignore && payload?.publicAppOrigin) setPublicAppOrigin(payload.publicAppOrigin)
      })
      .catch(() => {})

    return () => {
      ignore = true
    }
  }, [])

  useEffect(() => {
    const seo = buildSeoDocument({ pathname, routeView, publicAppOrigin, keywordPage })
    syncSeoDocument(seo)
    trackPageView(normalizePathname(pathname))
  }, [keywordPage, pathname, publicAppOrigin, routeView])

  useEffect(() => {
    if (!window.location.hash) return
    requestAnimationFrame(() => scrollToHashTarget(window.location.hash, 'auto'))
  }, [pathname])

  useEffect(() => {
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return
      if (event.data?.type !== 'pageagent-checkout-complete') return
      setCheckoutModal(null)
      setCheckoutLoadingKey(null)
      trackEvent('checkout_completed_popup', { path: window.location.pathname })
      navigate('/?payment=success')
    }

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [navigate])

  function updateSelection<K extends keyof AgentSelection>(key: K, value: AgentSelection[K]) {
    setSelection((current) => ({ ...current, [key]: value }))
    trackEvent('fit_console_change', { key, value })
  }

  function openPage(path: string) {
    navigate(path)
  }

  function chooseProAnnual(source: string) {
    setSelectedPlanId('pro')
    setBilling('annual')
    trackEvent('primary_cta_click', { source, planId: 'pro', billing: 'annual' })
    navigate('/pricing#pricing')
  }

  async function startHostedCheckout(planId: PlanId, cycle: Billing, loadingKey: string) {
    setSelectedPlanId(planId)
    setBilling(cycle)
    setCheckoutLoadingKey(loadingKey)
    setCheckoutModal({ planId, billing: cycle, loadingKey, status: 'loading' })
    trackEvent('checkout_started', { planId, billing: cycle })

    const popup = openCenteredCheckoutWindow()

    try {
      const checkoutUrl = await createCheckoutSession(planId, cycle)
      const opened = sendPopupToCheckout(popup, checkoutUrl)

      setCheckoutLoadingKey(null)
      setCheckoutModal({ planId, billing: cycle, loadingKey, status: opened ? 'popup' : 'retry', checkoutUrl })
      trackEvent('checkout_opened', { planId, billing: cycle, popup: opened })

      if (opened) {
        const timer = window.setInterval(() => {
          if (!popup || popup.closed) {
            window.clearInterval(timer)
            setCheckoutModal((current) => (current?.status === 'popup' ? null : current))
          }
        }, 900)
      }
    } catch (error) {
      if (popup && !popup.closed) popup.close()
      setCheckoutLoadingKey(null)
      setCheckoutModal(null)
      trackEvent('checkout_error', { planId, billing: cycle, message: error instanceof Error ? error.message : 'unknown' })
      window.alert(error instanceof Error ? error.message : 'Checkout could not be started.')
    }
  }

  function renderHeader() {
    return (
      <header className={`df-header${headerCompact ? ' compact' : ''}`}>
        <div className="df-header-inner">
          <a
            className="df-brand"
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
          >
            <span className="df-brand-mark">
              <MousePointerClick size={23} />
            </span>
            <span className="df-brand-copy">
              <strong>PageAgent Space</strong>
              <span>In-page AI agent launch</span>
            </span>
          </a>

          <nav className="df-nav" aria-label="Primary navigation">
            <a
              href="/page-agent-js"
              onClick={(event) => {
                event.preventDefault()
                navigate('/page-agent-js')
              }}
            >
              JS
            </a>
            <a
              href="/page-agent-extension"
              onClick={(event) => {
                event.preventDefault()
                navigate('/page-agent-extension')
              }}
            >
              Extension
            </a>
            <a
              href="/page-agent-mcp"
              onClick={(event) => {
                event.preventDefault()
                navigate('/page-agent-mcp')
              }}
            >
              MCP
            </a>
            <a
              href="/pricing"
              onClick={(event) => {
                event.preventDefault()
                navigate('/pricing#pricing')
              }}
            >
              Pricing
            </a>
          </nav>

          <button type="button" className="df-btn df-btn-primary df-header-cta" onClick={() => chooseProAnnual('header')}>
            <Sparkles size={17} />
            {ctaPrimary}
          </button>
        </div>
      </header>
    )
  }

  function renderOptionButtons<K extends keyof AgentSelection>(key: K, options: Array<{ id: AgentSelection[K]; label: string; summary: string }>) {
    return (
      <div className="df-option-grid">
        {options.map((option) => (
          <button
            type="button"
            className="df-option"
            data-active={selection[key] === option.id ? 'true' : 'false'}
            key={option.id}
            onClick={() => updateSelection(key, option.id)}
          >
            <strong>{option.label}</strong>
            <span>{option.summary}</span>
          </button>
        ))}
      </div>
    )
  }

  function renderFlowMap() {
    return (
      <div className="df-flow-map" aria-label="Page Agent launch map">
        <div className="df-flow-rail" />
        <div className="df-flow-node lead">
          <Bot size={21} />
          <strong>Intent</strong>
        </div>
        <div className="df-flow-node">
          <Globe2 size={19} />
          <span>DOM</span>
        </div>
        <div className="df-flow-node">
          <ShieldCheck size={19} />
          <span>Policy</span>
        </div>
        <div className="df-flow-node">
          <Workflow size={19} />
          <span>Action</span>
        </div>
        <div className="df-flow-node">
          <FileText size={19} />
          <span>Audit</span>
        </div>
      </div>
    )
  }

  function renderFitPanel() {
    return (
      <aside className="df-workspace-panel" id="planner" aria-label="Page Agent fit console">
        <div className="df-panel-top">
          <div>
            <p className="df-eyebrow">Fit console</p>
            <h2>{agentFit.headline}</h2>
          </div>
          <div className="df-score">
            <strong>{agentFit.fitScore}</strong>
            <span>{agentFit.fitLabel}</span>
          </div>
        </div>

        {renderFlowMap()}

        <div className="df-choice-stack">
          <section>
            <div className="df-choice-label">Product surface</div>
            {renderOptionButtons('surface', surfaceOptions)}
          </section>
          <section className="df-split-options">
            <div>
              <div className="df-choice-label">Integration</div>
              {renderOptionButtons('integration', integrationOptions)}
            </div>
            <div>
              <div className="df-choice-label">Scope</div>
              {renderOptionButtons('scope', scopeOptions)}
            </div>
          </section>
          <section className="df-split-options">
            <div>
              <div className="df-choice-label">Model</div>
              {renderOptionButtons('model', modelOptions)}
            </div>
            <div>
              <div className="df-choice-label">Safety</div>
              {renderOptionButtons('safety', safetyOptions)}
            </div>
          </section>
          <section>
            <div className="df-choice-label">Output</div>
            {renderOptionButtons('output', outputOptions)}
          </section>
        </div>

        <div className="df-result-grid">
          {agentFit.modules.map((module) => (
            <article key={module.label}>
              <span>{module.label}</span>
              <strong>{module.detail}</strong>
            </article>
          ))}
        </div>

        <div className="df-next-box">
          <div>
            <p className="df-eyebrow">Recommended next move</p>
            <h3>{agentFit.operatorMessage}</h3>
            <p>
              {agentFit.runShape} with {agentFit.confidence.toLowerCase()} launch confidence.
            </p>
          </div>
          <button type="button" className="df-btn df-btn-primary" onClick={() => chooseProAnnual('fit-console')}>
            <Play size={18} />
            {ctaPrimary}
          </button>
        </div>
      </aside>
    )
  }

  function renderPricingSection(standalone = false) {
    return (
      <section className={`df-section df-pricing-section${standalone ? ' standalone' : ''}`} id="pricing">
        <div className="df-section-head df-pricing-head">
          <div>
            <p className="df-eyebrow">Pricing</p>
            <h2>Pro is selected because production Page Agent work needs policy, analytics, and launch support.</h2>
            <p>Annual billing is active by default and is 50% cheaper than paying month to month.</p>
          </div>
          <div className="df-cycle" role="group" aria-label="Billing cycle">
            <button
              type="button"
              data-active={billing === 'monthly' ? 'true' : 'false'}
              onClick={() => {
                setBilling('monthly')
                trackEvent('billing_cycle_change', { billing: 'monthly' })
              }}
            >
              Monthly
            </button>
            <button
              type="button"
              data-active={billing === 'annual' ? 'true' : 'false'}
              onClick={() => {
                setBilling('annual')
                trackEvent('billing_cycle_change', { billing: 'annual' })
              }}
            >
              Annual - 50% off
            </button>
          </div>
        </div>

        <div className="df-plan-grid">
          {plans.map((plan) => {
            const monthly = billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd
            const strike = billing === 'annual' ? plan.monthlyUsd : null
            const loadingKey = `plan-${plan.id}-${billing}`
            const active = selectedPlanId === plan.id

            return (
              <article className="df-plan-card" data-popular={plan.popular ? 'true' : 'false'} data-active={active ? 'true' : 'false'} key={plan.id}>
                {plan.popular ? <span className="df-plan-badge">Default choice</span> : null}
                <h3>{plan.name}</h3>
                <p>{plan.tagline}</p>
                <div className="df-price-line">
                  {formatMoney(monthly)}
                  <small>/mo</small>
                  {strike ? <span>{formatMoney(strike)}</span> : null}
                </div>
                <strong className="df-billing-note">
                  {billing === 'annual' ? `${formatMoney(monthly * 12)} billed annually` : 'Billed monthly'}
                </strong>
                <ul>
                  {plan.bullets.map((bullet) => (
                    <li key={bullet}>
                      <Check size={15} />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <div className="df-plan-actions">
                  <button
                    type="button"
                    className={plan.popular ? 'df-btn df-btn-primary' : 'df-btn df-btn-ghost'}
                    onClick={() => void startHostedCheckout(plan.id, billing, loadingKey)}
                    onMouseEnter={() => setSelectedPlanId(plan.id)}
                    disabled={checkoutLoadingKey !== null}
                  >
                    {checkoutLoadingKey === loadingKey ? 'Opening secure checkout...' : plan.id === 'pro' ? ctaCheckout : `Checkout ${plan.shortName} ${billing}`}
                  </button>
                  {active ? <span className="df-plan-selected">Selected</span> : null}
                </div>
              </article>
            )
          })}
        </div>

        {standalone ? (
          <div className="df-faq-grid">
            <article>
              <h3>Why is Pro selected first?</h3>
              <p>Most teams need action policy, analytics, and a production handoff. Starter is useful for a proof of concept, but Pro is the practical default.</p>
            </article>
            <article>
              <h3>Why annual by default?</h3>
              <p>Agent UI launch work usually spans design, staging, policy, and release. Annual pricing cuts the monthly run-rate by 50%.</p>
            </article>
            <article>
              <h3>Does payment replace this page?</h3>
              <p>No. Checkout opens in a centered Creem popup and the product page stays visible behind a blurred overlay.</p>
            </article>
          </div>
        ) : null}
      </section>
    )
  }

  function renderCheckoutModal() {
    if (!checkoutModal) return null

    const plan = plans.find((item) => item.id === checkoutModal.planId) ?? plans[1]
    const billedMonthly = checkoutModal.billing === 'annual' ? plan.monthlyUsd * 0.5 : plan.monthlyUsd

    return (
      <div className="df-checkout-backdrop" role="dialog" aria-modal="true" aria-label="Secure checkout status">
        <div className="df-checkout-modal">
          <button
            type="button"
            className="df-checkout-close"
            aria-label="Close checkout status"
            onClick={() => setCheckoutModal(null)}
          >
            <X size={18} />
          </button>

          {checkoutModal.status === 'loading' ? (
            <div className="df-checkout-loading">
              <span aria-hidden />
              Preparing secure Creem checkout for {plan.name} {checkoutModal.billing}...
            </div>
          ) : (
            <div className="df-checkout-copy">
              <p className="df-eyebrow">Secure checkout</p>
              <h2>{checkoutModal.status === 'popup' ? 'Payment window is open.' : 'Open the payment window.'}</h2>
              <p>
                {plan.name} {checkoutModal.billing} is selected at {formatMoney(billedMonthly)}/mo. The original page stays here while Creem handles payment.
              </p>
              <div className="df-checkout-actions">
                {checkoutModal.checkoutUrl ? (
                  <button
                    type="button"
                    className="df-btn df-btn-primary"
                    onClick={() => {
                      const popup = openCenteredCheckoutWindow()
                      if (sendPopupToCheckout(popup, checkoutModal.checkoutUrl ?? '')) {
                        setCheckoutModal({ ...checkoutModal, status: 'popup' })
                      }
                    }}
                  >
                    <ExternalLink size={17} />
                    Open payment window
                  </button>
                ) : null}
                <button type="button" className="df-btn df-btn-ghost" onClick={() => setCheckoutModal(null)}>
                  Keep reviewing
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  function renderHome() {
    const paymentSuccess = new URLSearchParams(search).get('payment') === 'success'

    return (
      <main className="df-main">
        {paymentSuccess ? (
          <section className="df-success-banner">
            <CheckCircle2 size={18} />
            Payment received. PageAgent Space onboarding will continue from the email used at checkout.
          </section>
        ) : null}

        <section className="df-hero">
          <div className="df-hero-copy">
            <p className="df-eyebrow">Page agent for production SaaS</p>
            <h1>Launch an in-page AI agent users can trust to act.</h1>
            <p className="df-lede">
              PageAgent Space turns the Alibaba Page Agent concept into a managed launch path for SaaS teams: map one workflow, guard the actions, choose Pro annual, and open secure checkout without losing the page.
            </p>

            <div className="df-hero-actions">
              <button type="button" className="df-btn df-btn-primary" onClick={() => chooseProAnnual('hero')}>
                <Sparkles size={18} />
                {ctaPrimary}
              </button>
              <button
                type="button"
                className="df-btn df-btn-ghost"
                onClick={() => {
                  trackEvent('pricing_review', { source: 'hero-secondary' })
                  navigate('/pricing#pricing')
                }}
              >
                <Layers3 size={18} />
                Review plans
              </button>
              <button type="button" className="df-btn df-btn-subtle" onClick={() => openPage('/page-agent-example')}>
                <Workflow size={18} />
                See an example
              </button>
            </div>
            <p className="df-payment-note">
              <CheckCircle2 size={16} />
              <span>Pro annual selected. Annual saves 50%.</span>
            </p>

            <div className="df-trust-row">
              {trustLinks.map((link) =>
                link.internal ? (
                  <a
                    href={link.href}
                    key={link.href}
                    onClick={(event) => {
                      event.preventDefault()
                      openPage(link.href)
                    }}
                  >
                    {link.icon}
                    {link.label}
                    <ChevronRight size={13} />
                  </a>
                ) : (
                  <a href={link.href} key={link.href} target="_blank" rel="noreferrer">
                    {link.icon}
                    {link.label}
                    <ExternalLink size={13} />
                  </a>
                ),
              )}
            </div>

            <figure className="df-product-visual">
              <img src="/assets/page-agent-workspace.png" alt="Page Agent browser workflow preview" />
            </figure>
          </div>

          {renderFitPanel()}
        </section>

        <section className="df-proof-strip" aria-label="PageAgent Space proof points">
          {proofItems.map((item) => (
            <article key={item.label}>
              <span>{item.label}</span>
              <strong>{item.value}</strong>
              <p>{item.detail}</p>
            </article>
          ))}
        </section>

        <section className="df-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Operating model</p>
            <h2>The first screen answers the buyer's real question: can this agent touch my UI safely?</h2>
            <p>
              PageAgent Space starts with fit, then makes scope, integration, policy, model routing, plan choice, and checkout visible before money moves.
            </p>
          </div>

          <div className="df-card-grid">
            {workflowCards.map((card) => (
              <article className="df-card" key={card.title}>
                <div className="df-card-icon">{card.icon}</div>
                <h3>{card.title}</h3>
                <p>{card.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="df-section df-signal-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Trust signals</p>
            <h2>A Page Agent rollout converts best when the action boundary is obvious.</h2>
          </div>
          <div className="df-signal-grid">
            <article>
              <Radar size={20} />
              <h3>Start with one workflow</h3>
              <p>A narrow workflow gives the buyer a clear outcome and gives the team a measurable launch.</p>
            </article>
            <article>
              <BadgeCheck size={20} />
              <h3>Show what changes</h3>
              <p>Action previews and confirmations make UI automation feel controlled instead of surprising.</p>
            </article>
            <article>
              <LockKeyhole size={20} />
              <h3>Keep risky steps gated</h3>
              <p>Payments, permissions, destructive changes, and external actions should stay behind explicit consent.</p>
            </article>
          </div>
        </section>

        {renderPricingSection(false)}

        <section className="df-section">
          <div className="df-section-head">
            <p className="df-eyebrow">Guides</p>
            <h2>Useful Page Agent guides for the questions buyers already ask.</h2>
            <p>Each page covers a real implementation or trust decision instead of repeating generic AI claims.</p>
          </div>
          <div className="df-guide-grid">
            {[
              ...keywordPages,
              {
                path: '/pricing',
                eyebrow: 'Pricing',
                h1: 'PageAgent Space pricing',
                intent: 'Choose Starter, Pro, or Scale with Pro annual already selected.',
              },
            ].map((page) => (
              <a
                className="df-guide-card"
                href={page.path}
                key={page.path}
                onClick={(event) => {
                  event.preventDefault()
                  openPage(page.path)
                }}
              >
                <span>{page.eyebrow}</span>
                <strong>{page.h1}</strong>
                <p>{page.intent}</p>
                <ChevronRight size={18} />
              </a>
            ))}
          </div>
        </section>
      </main>
    )
  }

  function renderKeywordPage(page: KeywordPage) {
    return (
      <main className="df-main">
        <article className="df-article">
          <a
            className="df-back-link"
            href="/"
            onClick={(event) => {
              event.preventDefault()
              navigate('/')
            }}
          >
            <ArrowRight size={16} />
            Back to PageAgent Space
          </a>
          <p className="df-eyebrow">{page.eyebrow}</p>
          <h1>{page.h1}</h1>
          <p className="df-lede">{page.lede}</p>
          <div className="df-article-intent">
            <strong>Best for</strong>
            <span>{page.intent}</span>
          </div>

          {page.sections.map((section) => (
            <section key={section.heading}>
              <h2>{section.heading}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.bullets ? (
                <ul>
                  {section.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}

          <section>
            <h2>Common questions</h2>
            <div className="df-faq-list">
              {page.faqs.map((faq) => (
                <article key={faq.question}>
                  <h3>{faq.question}</h3>
                  <p>{faq.answer}</p>
                </article>
              ))}
            </div>
          </section>

          <aside className="df-article-cta">
            <div>
              <p className="df-eyebrow">Recommended next step</p>
              <h2>Use the fit console first, then keep Pro annual selected if the launch path is clear.</h2>
              <p>Checkout stays in a centered Creem popup, with annual billing selected by default.</p>
            </div>
            <div className="df-article-cta-actions">
              <button type="button" className="df-btn df-btn-primary" onClick={() => chooseProAnnual(`article-${page.path}`)}>
                <Play size={18} />
                {page.ctaLabel}
              </button>
              <button type="button" className="df-btn df-btn-ghost" onClick={() => navigate('/#planner')}>
                <Zap size={18} />
                Open fit console
              </button>
            </div>
          </aside>
        </article>
      </main>
    )
  }

  function renderPricingPage() {
    return (
      <main className="df-main">
        <section className="df-pricing-page-hero">
          <p className="df-eyebrow">Pricing</p>
          <h1>PageAgent Space pricing starts with Pro selected and annual billing already on.</h1>
          <p className="df-lede">
            Starter is for one contained pilot. Pro is the default for production in-page launch. Scale is for extension, MCP, multi-page control, and heavier governance.
          </p>
        </section>
        {renderPricingSection(true)}
      </main>
    )
  }

  function renderLegalPage(title: string, intro: string, sections: typeof legalPrivacySections) {
    return (
      <main className="df-main">
        <article className="df-article">
          <p className="df-eyebrow">Legal</p>
          <h1>{title}</h1>
          <p className="df-lede">{intro}</p>
          {sections.map((section) => (
            <section key={section.title}>
              <h2>{section.title}</h2>
              {section.paragraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </section>
          ))}
        </article>
      </main>
    )
  }

  function renderNotFound() {
    return (
      <main className="df-main">
        <section className="df-center-panel">
          <p className="df-eyebrow">404</p>
          <h1>Page not found</h1>
          <p className="df-muted">That route is not available.</p>
          <button type="button" className="df-btn df-btn-primary" onClick={() => navigate('/')}>
            Return home
          </button>
        </section>
      </main>
    )
  }

  let body: ReactNode
  if (routeView === 'home' && normalizedPath === '/') {
    body = renderHome()
  } else if (routeView === 'keyword' && keywordPage) {
    body = renderKeywordPage(keywordPage)
  } else if (routeView === 'pricing') {
    body = renderPricingPage()
  } else if (routeView === 'privacy') {
    body = renderLegalPage(
      'Privacy Policy',
      'This policy covers how PageAgent Space handles analytics, checkout, and related user interactions.',
      legalPrivacySections,
    )
  } else if (routeView === 'terms') {
    body = renderLegalPage(
      'Terms of Service',
      'These terms describe the limits and responsibilities of the PageAgent Space site and its hosted payment flow.',
      legalTermsSections,
    )
  } else if (routeView === 'checkout-done') {
    body = <CheckoutDoneBridge publicAppOrigin={publicAppOrigin} />
  } else {
    body = renderNotFound()
  }

  return (
    <div className="df-shell">
      <div className="df-page-texture" aria-hidden />
      {renderHeader()}
      {body}
      {renderCheckoutModal()}
      <footer className="df-footer">
        <div className="df-footer-inner">
          <span>PageAgent Space</span>
          <a
            href="/privacy"
            onClick={(event) => {
              event.preventDefault()
              navigate('/privacy')
            }}
          >
            Privacy
          </a>
          <a
            href="/terms"
            onClick={(event) => {
              event.preventDefault()
              navigate('/terms')
            }}
          >
            Terms
          </a>
          <a href="https://github.com/clauxel/my-pageagent" target="_blank" rel="noreferrer">
            GitHub
          </a>
          <a href="https://github.com/alibaba/page-agent" target="_blank" rel="noreferrer">
            Reference
          </a>
          <a href="mailto:support@aigeamy.com">support@aigeamy.com</a>
        </div>
      </footer>
    </div>
  )
}
