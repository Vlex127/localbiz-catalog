# LocalBiz Catalog

AI-powered storefronts for local businesses.

LocalBiz helps a small shop owner turn product photos into a shareable digital catalog. Take or upload a product photo, let Google Gemini extract the product details, review the result, and publish a mobile-friendly catalog link for customers.

Built for Hack Days in Krishnagiri, an MLH and Google Build with AI hackathon.

## Features

- AI product extraction from product photos using Google Gemini
- Editable product name, category, description, and estimated price
- AI description improvement for cleaner storefront copy
- Translation support for Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, and English
- AI-generated store tagline from the product list
- Shareable public catalog pages at `/catalog/[slug]`
- Demo catalogs for general store, healthcare, and agriculture themes
- Mobile-first camera/upload flow with no account required

## Hackathon Fit

- Effective use of Gemini: image extraction, copy improvement, translation, and tagline generation are core product flows.
- Real-world impact: local shops can create a lightweight online catalog without typing product listings from scratch.
- User experience: the main flow is camera-first, editable, and shareable from a phone.
- Technical implementation: Next.js App Router, server API routes, Gemini integration, and SQLite/libSQL persistence.

## Tech Stack

| Layer | Technology |
| --- | --- |
| Framework | Next.js 16 App Router |
| UI | React 19, TypeScript, Tailwind CSS v4 |
| AI | Google Gemini `gemini-2.5-flash` via `@google/generative-ai` |
| Database | SQLite/libSQL via `@libsql/client` |
| IDs | `nanoid` |

## Getting Started

```bash
pnpm install
```

Create `.env.local`:

```bash
GEMINI_API_KEY=your_gemini_api_key
```

Optional hosted libSQL/Turso database:

```bash
DATABASE_URL=your_database_url
DATABASE_TOKEN=your_database_token
```

If no database URL is set, the app uses a local `data.db` file.

Run locally:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## API Routes

| Endpoint | Method | Purpose |
| --- | --- | --- |
| `/api/extract` | POST | Extract product details from an image with Gemini |
| `/api/gemini` | POST | Improve descriptions, translate text, generate taglines |
| `/api/catalog/[slug]` | GET | Fetch a published catalog and products |
| `/api/catalog/[slug]` | POST | Create/update catalogs and add/delete products |

## Devpost Submission Notes

Required fields:

- Project name: LocalBiz Catalog
- Description: AI-powered catalog builder for small local businesses
- Repository: this repo
- Live demo: deploy the Next.js app to Vercel or another Node-compatible host
- Gemini usage: product image extraction, description improvement, translation, and tagline generation

Demo flow:

1. Enter a business name.
2. Upload or capture a product photo.
3. Review Gemini's extracted details.
4. Add the product to the catalog.
5. Generate an AI store tagline.
6. Copy or share the public catalog link.

If the API key is unavailable during judging, use one of the built-in demo catalogs to show the sharing and storefront flow.

## Verification

```bash
pnpm lint
pnpm build
```
