import { NextRequest, NextResponse } from 'next/server';
import { improveDescription, translateDescription, generateCatalogDescription } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    const { action, ...params } = await req.json();

    switch (action) {
      case 'improve_description': {
        const { name, description } = params;
        if (!name) return NextResponse.json({ error: 'Product name required' }, { status: 400 });
        const result = await improveDescription(name, description || '');
        return NextResponse.json({ result });
      }

      case 'translate_description': {
        const { description, language } = params;
        if (!description || !language) {
          return NextResponse.json({ error: 'Description and language required' }, { status: 400 });
        }
        const result = await translateDescription(description, language);
        return NextResponse.json({ result });
      }

      case 'generate_catalog_description': {
        const { business, products } = params;
        if (!business) return NextResponse.json({ error: 'Business name required' }, { status: 400 });
        const result = await generateCatalogDescription(business, products || []);
        return NextResponse.json({ result });
      }

      default:
        return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Gemini action failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
