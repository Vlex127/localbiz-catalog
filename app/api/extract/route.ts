import { NextRequest, NextResponse } from 'next/server';
import { extractProductFromImage } from '@/lib/gemini';

export async function POST(req: NextRequest) {
  try {
    let body;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
    }

    const { image, mimeType } = body;
    if (!image) {
      return NextResponse.json({
        error: 'No image provided. Please capture or select a product photo first.'
      }, { status: 400 });
    }

    if (image.length > 10_000_000) {
      return NextResponse.json({
        error: 'Image is too large. Try a smaller photo (under 10MB).'
      }, { status: 400 });
    }

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({
        error: 'Gemini API key not configured. Use the demo below to try the app.'
      }, { status: 500 });
    }

    const result = await extractProductFromImage(image, mimeType || 'image/jpeg');
    return NextResponse.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Something went wrong. Try a clearer photo or check your API key.';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
