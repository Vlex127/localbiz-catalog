import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export interface ExtractedProduct {
  name: string;
  category: string;
  description: string;
  estimated_price: number | null;
}

function getModel() {
  return genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
}

function cleanJson(text: string): string {
  return text.replace(/```json?/g, '').replace(/```/g, '').trim();
}

export async function extractProductFromImage(imageBase64: string, mimeType = 'image/jpeg'): Promise<ExtractedProduct> {
  const model = getModel();

  const cleanBase64 = imageBase64.replace(/^data:image\/[a-z]+;base64,/, '');

  const prompt = `You are a product catalog assistant. Analyze this product photo.
Return ONLY valid JSON (no markdown, no extra text):

{
  "name": "SEO-friendly product name (max 60 chars)",
  "category": "Groceries | Electronics | Clothing | Home & Kitchen | Beauty | Stationery | Healthcare | Agriculture | Other",
  "description": "2-3 sentence engaging description for an online storefront",
  "estimated_price": number | null
}`;

  const result = await model.generateContent([
    prompt,
    { inlineData: { mimeType, data: cleanBase64 } }
  ]);

  const text = result.response.text().trim();
  const cleaned = cleanJson(text);

  try {
    return JSON.parse(cleaned);
  } catch {
    throw new Error('Failed to parse Gemini response: ' + text);
  }
}

export async function improveDescription(name: string, currentDescription: string): Promise<string> {
  const model = getModel();
  const prompt = `Rewrite this product description to be more engaging and professional for an online storefront.
Product: "${name}"
Current description: "${currentDescription}"

Return ONLY the improved description (2-3 sentences, no JSON, no markdown).`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function translateDescription(description: string, targetLanguage: string): Promise<string> {
  const model = getModel();
  const prompt = `Translate the following product description to ${targetLanguage}.
Keep it natural and suitable for an online storefront.
Return ONLY the translation, no extra text.

Description: "${description}"`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}

export async function generateCatalogDescription(businessName: string, productNames: string[]): Promise<string> {
  const model = getModel();
  const productList = productNames.slice(0, 10).join(', ');
  const prompt = `Write a short, warm tagline (1 sentence, max 15 words) for a local business called "${businessName}" that sells: ${productList}.
Return ONLY the tagline, no quotes, no markdown.`;

  const result = await model.generateContent(prompt);
  return result.response.text().trim();
}
