# LocalBiz Catalog — AI-Powered Storefronts for Local Businesses

**Snap a photo, get a digital catalog.** LocalBiz uses Google Gemini AI to automatically extract product details from photos, then generates a beautiful shareable online catalog — no typing, no tech skills needed.

Built for **Hack Days in Krishnagiri** — an MLH & Google Build with AI hackathon.

## ✨ Features

- **📸 AI Product Extraction** — Take a photo of any product; Gemini AI extracts name, category, description, and price
- **✏️ Smart Editor** — Review and edit AI results, with "AI Improve" to rewrite descriptions professionally
- **🌐 Multilingual** — Translate product descriptions to Hindi, Tamil, Telugu, Kannada, Malayalam, Bengali, Marathi, and English
- **🏪 Shareable Catalog** — Get a public URL (`/catalog/[slug]`) to share on WhatsApp or anywhere
- **🏥 Theme Support** — Demo catalogs for General Store, Healthcare/Ayurvedic, and Agriculture themes
- **🤖 AI Tagline Generation** — Auto-generates a warm store tagline from your product list
- **📱 Mobile-First** — Works perfectly on phone cameras and all screen sizes
- **⚡ No Account Needed** — Just open and use; data persists in local SQLite

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | Next.js 16 (App Router) |
| **UI** | React 19, TypeScript, Tailwind CSS v4 |
| **AI** | Google Gemini (`gemini-1.5-flash`) via `@google/generative-ai` |
| **Database** | SQLite via `@libsql/client` |
| **ID Gen** | nanoid |
| **Deploy** | Ready for Vercel |

## 🚀 Getting Started

```bash
# 1. Install dependencies
pnpm install

# 2. Set up your Gemini API key
# Create .env.local and add:
echo "GEMINI_API_KEY=your_key_here" > .env.local

# 3. Run the dev server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to start building your catalog.

### Getting a Gemini API Key

1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Click **Create API Key**
3. Copy the key and paste it into `.env.local`
4. The app uses `gemini-1.5-flash` (generous free tier)

## 📖 How It Works

1. **Snap a Photo** — Use your phone camera or upload from gallery
2. **AI Extracts Details** — Gemini reads the image and generates product name, category, description, and price
3. **Review & Edit** — Tweak the AI output, improve descriptions with AI, or translate to regional languages
4. **Publish** — Get a shareable public link for your catalog
5. **Share** — Send via WhatsApp, copy link, or display as QR

## 🌐 API Endpoints

| Endpoint | Method | Purpose |
|---|---|---|
| `/api/extract` | POST | Extract product details from image via Gemini |
| `/api/gemini` | POST | Improve descriptions, translate, generate taglines |
| `/api/catalog/[slug]` | GET | Fetch published catalog and products |
| `/api/catalog/[slug]` | POST | Create, update, publish catalog; add/delete products |

## 📋 Submission Notes

This project was built for **Hack Days in Krishnagiri** and uses:
- **Google Gemini** for image-to-product extraction, description improvement, translation, and tagline generation
- **Healthcare & Agriculture** demo options aligning with hackathon themes
- Fully functional prototype with no login required

## 🏆 Judging Fit

- **Effective Use of Gemini**: Core to every feature — extraction, improvement, translation, tagline generation
- **Innovation & Creativity**: Solves real problem for unorganized retail; AI removes typing barrier
- **Technical Implementation**: Modern stack, clean architecture, mobile-first
- **User Experience**: Zero onboarding, camera-first, instant sharing
- **Real-world Impact**: Millions of local businesses can go digital in seconds

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
