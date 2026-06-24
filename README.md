# PageAgent Space

PageAgent Space is a conversion-focused SaaS site for launching in-page Page Agent workflows. It includes:

- React/Vite frontend with static prerendered SEO pages.
- Useful inner pages for extension, JS, AI, OpenClaw, GitHub, examples, Alibaba, and MCP search intents.
- Cloudflare Worker with `/api/runtime`, `/api/checkout`, `/api/analytics/events`, `robots.txt`, and `sitemap.xml`.
- Cloudflare Pages fallback functions for API and sitemap routes.
- Polar hosted checkout through `API_PROD_KEY`.
- GitHub Actions workflows for Cloudflare Workers and Pages.

## Local

```bash
npm install
npm run build
npm run dev
```

For checkout testing, provide a Polar key as `API_PROD_KEY`, `POLAR_API_KEY`, or `POLAR_KEY` in the worker environment.

## Deploy

```bash
npm run cloudflare:deploy
npm run pages:deploy
```
