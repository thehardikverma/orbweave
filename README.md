# Orbweave — Circular Systems Studio (website template)

> **Not a single thread, but the whole loop.**

Orbweave is a **fictional** circular-systems studio that "weaves sensors, data and AI into closed loops"
so organisations waste less water, energy and materials. This repository is its marketing website:
a fast, dependency-light static site with a scroll-scrubbed cinematic hero, five concept case studies,
an AI chat widget and a contact form backed by serverless functions.

All companies, people and metrics on the site are made up for demonstration purposes.

## Features

- **Scroll-scrubbed hero** – 212-frame image sequence drawn to `<canvas>` and driven by GSAP ScrollTrigger,
  with a progressive preloader and a WebGL "smoke" shader behind the manifesto text.
- **Five case studies**, each with its own layout, animations and counters:
  | Path | Concept |
  | --- | --- |
  | `/tidewell/` | Acoustic AI leak detection for a 15-town water co-op |
  | `/reloom/` | AI condition grading for an outdoor-gear resale marketplace |
  | `/groundwork/` | RAG-powered field tutors for regenerative farmers |
  | `/canopy/` | Rooftop heat mapping & retrofit planning for a housing co-op |
  | `/driftwood/` | A resource agent balancing solar, water and food for eco-lodges |
- **Contact page** with an animated form that posts to `/api/contact` (emails via [Resend](https://resend.com)).
- **AI chat widget** (`js/chatbot.js`) that streams replies from `/api/chat`
  ([Vercel AI SDK](https://sdk.vercel.ai) + [Groq](https://groq.com)).
- SEO basics: meta/Open Graph tags, JSON-LD, `sitemap.xml`, `robots.txt`.

## Tech stack

- Plain HTML, CSS and vanilla JavaScript (no framework, no bundler)
- [GSAP](https://gsap.com) + ScrollTrigger (loaded from cdnjs)
- WebGL for the hero smoke effect
- Vercel serverless functions (`api/`) – Node (`contact.js`) and Edge (`chat.js`)
- `ai`, `@ai-sdk/groq`, `resend` npm packages (used only by the API functions)

## Project structure

```
.
├── index.html            # Home: scroll-scrubbed hero + manifesto
├── contact.html          # Contact page + form
├── tidewell/ reloom/ groundwork/ canopy/ driftwood/   # Case studies
├── css/chatbot.css       # Chat widget styles
├── js/chatbot.js         # Chat widget logic
├── api/chat.js           # Edge function: AI chat (Groq via AI SDK)
├── api/contact.js        # Serverless function: contact form emails (Resend)
├── images/               # Hero frame sequence, brand cards, contact art
├── scripts/serve.mjs     # Zero-dependency static preview server
├── scripts/check-links.mjs  # "Build" check: missing assets / JS syntax
├── vercel.json           # API CORS headers
└── .env.example          # Required environment variables
```

## Getting started

Requirements: Node.js 18+.

```bash
npm install
npm run build     # verifies every local asset/link resolves and JS parses
npm start         # static preview at http://localhost:3000 (PORT to override)
```

`npm start` serves the static pages only. To run the API routes (chat + contact form) locally, use the
[Vercel CLI](https://vercel.com/docs/cli):

```bash
cp .env.example .env.local   # then fill in your keys
npm run dev                  # = vercel dev
```

### Scripts

| Script | What it does |
| --- | --- |
| `npm run dev` | Runs the site + API functions locally with `vercel dev` |
| `npm run build` | Checks that all local `src`/`href` references exist and JS files parse |
| `npm start` | Serves the static site with a tiny Node server |
| `npm run preview` | `build` then `start` |

## Environment variables

See [`.env.example`](.env.example).

| Variable | Used by | Purpose |
| --- | --- | --- |
| `GROQ_API_KEY` | `api/chat.js` | Groq API key for the chat widget |
| `RESEND_API_KEY` | `api/contact.js` | Resend API key for contact emails |
| `CONTACT_FROM_EMAIL` | `api/contact.js` | Sender, on a domain verified in Resend |
| `CONTACT_TO_EMAIL` | `api/contact.js` | Where new enquiries are delivered |
| `CONTACT_TIMEZONE` | `api/contact.js` | Optional, IANA time zone for timestamps (default `UTC`) |

Never commit real keys; `.env*` files are git-ignored.

## Deploying

The site deploys as-is to [Vercel](https://vercel.com): import the repo, keep the default settings
(no build command, output = project root), and add the environment variables above.
Any static host works for the pages; the chat and contact features need the `api/` functions.

## Customising

- Replace `orbweave.example` in meta tags, `sitemap.xml` and `robots.txt` with your domain.
- Social links currently point to generic placeholders (`linkedin.com`, `x.com`, `instagram.com`, `@your_handle`).
- Brand marks live in `logo.png`, `favicon.ico` and `images/brands/`.
- The chat assistant's personality is the system prompt in `api/chat.js`.

## Credits

- Case-study illustrations, logos and brand cards are procedurally generated for this project.
- The hero frame sequence (`images/compressed_scrub*.webp`) is an AI-generated video render.

## License

[MIT](LICENSE) © 2026 Vansh Bagga
