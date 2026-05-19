# PageAgent Space

PageAgent Space is a conversion-focused SaaS site for launching in-page Page Agent workflows. It includes:

- React/Vite frontend with static prerendered SEO pages.
- Useful inner pages for extension, JS, AI, OpenClaw, GitHub, examples, Alibaba, and MCP search intents.
- Cloudflare Worker with `/api/runtime`, `/api/checkout`, `/api/analytics/events`, `robots.txt`, and `sitemap.xml`.
- Cloudflare Pages fallback functions for API and sitemap routes.
- Creem hosted checkout through `API_PROD_KEY`.
- GitHub Actions workflows for Cloudflare Workers and Pages.

## Local

```bash
npm install
npm run build
npm run dev
```

For checkout testing, provide a Creem key as `API_PROD_KEY`, `CREEM_API_KEY`, or `CREEM_KEY` in the worker environment.

## Deploy

```bash
npm run cloudflare:deploy
npm run pages:deploy
```

## Related Project

- [OpenHuman Online](https://openhuman.online/?utm_source=github&utm_medium=readme&utm_campaign=openhuman_public_repos&utm_content=my_pageagent) helps teams turn source material, notes, and meetings into an inspectable AI memory tree for human-reviewed workflows.
