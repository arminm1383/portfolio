# arminLM Worker

A tiny Cloudflare Worker that powers the **arminLM** feature on the landing page:
a visitor selects a hero-collage graphic, asks a question, and this Worker asks
Claude (Haiku 4.5) to explain why that graphic matters to Armin.

The Worker holds the Anthropic API key as a secret — it is **never** shipped to
the browser. The frontend only ever talks to this Worker.

```
browser (armin-mohammadi.com)  ──POST {graphicId, question}──▶  this Worker ──▶ api.anthropic.com
```

## Files

- `src/index.ts` — the Worker (CORS, validation, Claude call).
- `src/graphicContext.ts` — **the knowledge base. Fill in the real stories here.**
  This is the only thing Claude knows about each graphic.
- `wrangler.toml` — Worker config.

## One-time setup

```bash
cd worker
npm install
npx wrangler login          # authenticate with your Cloudflare account
```

If `npm install` complains about versions, bump them:
`npm install @anthropic-ai/sdk@latest && npm install -D wrangler@latest @cloudflare/workers-types@latest`

## Set the API key (secret)

```bash
npx wrangler secret put ANTHROPIC_API_KEY
# paste your Anthropic API key when prompted
```

## Run locally

Local `wrangler dev` reads the key from a `.dev.vars` file (not the deployed secret):

```bash
cp .dev.vars.example .dev.vars   # then paste your real ANTHROPIC_API_KEY into it
npm run dev                      # serves at http://localhost:8787
```

The frontend's `portfolio/.env.development.local` already points dev at
`http://localhost:8787`, so with the Worker running, arminLM works on `npm run dev`.

Test it:

```bash
curl -X POST http://localhost:8787 \
  -H 'Content-Type: application/json' \
  -d '{"graphicId":"wii","question":"why is there a wii remote here?"}'
```

## Deploy

```bash
npm run deploy
```

Wrangler prints the live URL, e.g. `https://arminlm.<your-subdomain>.workers.dev`.

## Point the frontend at it

In `portfolio/src/components/AskAmLM.tsx`, set `ARMINLM_ENDPOINT` to that URL, or create `portfolio/.env.local` with:

```
VITE_ARMINLM_ENDPOINT=https://arminlm.<your-subdomain>.workers.dev
```

(The frontend reads `VITE_ARMINLM_ENDPOINT` and falls back to the constant.) For the GitHub Pages deploy, add the same URL as a repository variable named `VITE_ARMINLM_ENDPOINT`; `.github/workflows/deploy.yml` passes it to the build.

## Fill in the knowledge base

Edit `src/graphicContext.ts` and replace every `FILL ME` with the real reason that
graphic is in your collage. Re-run `npm run deploy` after editing. Anything left as
a placeholder will produce a vague (but honest) answer — the model is instructed not
to invent facts.
