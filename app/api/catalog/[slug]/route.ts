import { NextRequest, NextResponse } from 'next/server';
import { getClient, initDB } from '@/lib/db';
import { genId } from '@/lib/utils';

interface Row {
  id: string;
  catalog_id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  currency: string;
  image: string | null;
  sort_order: number;
  created_at: string;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initDB();
    const { slug } = await params;
    const client = getClient();

    const catResult = await client.execute({
      sql: 'SELECT * FROM catalogs WHERE slug = ?',
      args: [slug],
    });

    if (catResult.rows.length === 0) {
      return NextResponse.json({ error: 'Catalog not found' }, { status: 404 });
    }

    const catalog = catResult.rows[0] as unknown as {
      id: string; slug: string; business: string;
      is_published: number; created_at: string;
    };

    const prodResult = await client.execute({
      sql: 'SELECT * FROM products WHERE catalog_id = ? ORDER BY sort_order ASC',
      args: [catalog.id],
    });

    const products = prodResult.rows as unknown as Row[];

    return NextResponse.json({ catalog, products });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Failed to load catalog';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    await initDB();
    const client = getClient();
    const body = await req.json();
    const { slug } = await params;
    const { action } = body;

    if (action === 'create') {
      const { business } = body;
      const catId = genId();
      const catSlug = slug;

      await client.execute({
        sql: 'INSERT INTO catalogs (id, slug, business) VALUES (?, ?, ?)',
        args: [catId, catSlug, business || 'My Store'],
      });

      return NextResponse.json({ id: catId, slug: catSlug });
    }

    if (action === 'add_product') {
      const { catalog_id, name, description, category, price, image } = body;
      const prodId = genId();

      const countResult = await client.execute({
        sql: 'SELECT COUNT(*) as count FROM products WHERE catalog_id = ?',
        args: [catalog_id],
      });
      const count = (countResult.rows[0] as unknown as { count: number }).count;

      await client.execute({
        sql: `INSERT INTO products (id, catalog_id, name, description, category, price, image, sort_order)
              VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        args: [prodId, catalog_id, name, description || null, category || null, price ?? null, image || null, count],
      });

      return NextResponse.json({ id: prodId });
    }

    if (action === 'delete_product') {
      const { product_id } = body;
      await client.execute({
        sql: 'DELETE FROM products WHERE id = ?',
        args: [product_id],
      });
      return NextResponse.json({ success: true });
    }

    if (action === 'publish') {
      const { catalog_id, description } = body;
      if (description) {
        await client.execute({
          sql: 'UPDATE catalogs SET is_published = 1, description = ? WHERE id = ?',
          args: [description, catalog_id],
        });
      } else {
        await client.execute({
          sql: 'UPDATE catalogs SET is_published = 1 WHERE id = ?',
          args: [catalog_id],
        });
      }
      return NextResponse.json({ success: true });
    }

    if (action === 'update') {
      const { catalog_id, business } = body;
      await client.execute({
        sql: 'UPDATE catalogs SET business = ? WHERE id = ?',
        args: [business, catalog_id],
      });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Unknown action' }, { status: 400 });
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Operation failed';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
