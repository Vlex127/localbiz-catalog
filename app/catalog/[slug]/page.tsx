import Link from 'next/link';
import { getClient, initDB } from '@/lib/db';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

interface CatalogRow {
  id: string;
  slug: string;
  business: string;
  description: string | null;
  is_published: number;
  created_at: string;
}

interface ProductRow {
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

async function getCatalog(slug: string) {
  await initDB();
  const client = getClient();

  const catResult = await client.execute({
    sql: 'SELECT * FROM catalogs WHERE slug = ?',
    args: [slug],
  });

  if (catResult.rows.length === 0) return null;

  const catalog = catResult.rows[0] as unknown as CatalogRow;

  const prodResult = await client.execute({
    sql: 'SELECT * FROM products WHERE catalog_id = ? ORDER BY sort_order ASC',
    args: [catalog.id],
  });

  const products = prodResult.rows as unknown as ProductRow[];
  const categories = [...new Set(products.map(p => p.category).filter(Boolean))] as string[];
  const prices = products.filter(p => p.price !== null).map(p => p.price as number);
  const priceRange = prices.length > 0
    ? { min: Math.min(...prices), max: Math.max(...prices) }
    : null;

  return { catalog, products, categories, priceRange };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCatalog(slug);
  if (!data) return { title: 'Catalog Not Found' };

  return {
    title: `${data.catalog.business} - Products & Catalog`,
    description: `Browse ${data.products.length} products from ${data.catalog.business}. ${data.categories.length} categories available.`,
    openGraph: {
      title: data.catalog.business,
      description: `${data.products.length} products - ${data.categories.length} categories`,
    },
  };
}

export default async function CatalogPage({ params }: PageProps) {
  const { slug } = await params;
  const data = await getCatalog(slug);

  if (!data) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-[var(--bg)] p-8">
        <div className="text-center animate-fade-in max-w-sm">
          <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-7 h-7 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-lg font-bold text-stone-800 mb-1">Store not found</h1>
          <p className="text-sm text-stone-400">This catalog does not exist or has been removed.</p>
          <Link href="/" className="inline-block mt-4 px-5 py-2.5 bg-[var(--brand)] text-white text-sm font-semibold rounded-xl hover:opacity-90 transition">
            Create your own catalog
          </Link>
        </div>
      </div>
    );
  }

  const { catalog, products: rawProducts, categories, priceRange } = data;
  const createdDate = new Date(catalog.created_at).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const grouped = categories.reduce<Record<string, ProductRow[]>>((acc, cat) => {
    acc[cat] = rawProducts.filter(p => p.category === cat);
    return acc;
  }, {});
  const uncategorized = rawProducts.filter(p => !p.category);

  function renderProductCard(product: ProductRow, i: number) {
    return (
      <div
        key={product.id}
        className="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md hover:border-stone-200 transition-all animate-fade-up flex flex-col"
        style={{ animationDelay: `${i * 60}ms` }}
      >
        <div className="aspect-[4/3] bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden relative">
          {product.image ? (
            <img
              src={product.image.startsWith('data:') ? product.image : `data:image/jpeg;base64,${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <svg className="w-12 h-12 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
          )}
        </div>
        <div className="p-3.5 flex flex-col gap-1.5 flex-1">
          <h3 className="font-semibold text-stone-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
          {product.description && (
            <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{product.description}</p>
          )}
          {product.price !== null && (
            <p className="text-lg font-bold text-stone-900 mt-auto tracking-tight">
              {formatPrice(product.price, product.currency)}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-[var(--bg)]">
      <div className="max-w-lg mx-auto px-4 py-6">
        <header className="text-center mb-8 animate-fade-up">
          <div className="inline-flex items-center gap-1.5 mb-4">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-[0.15em]">LocalBiz</span>
          </div>

          <div className="inline-flex items-center justify-center gap-2 mb-1">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-[var(--brand)]/10 to-[var(--brand-light)] flex items-center justify-center">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
            </div>
          </div>
          <h1 className="text-2xl font-bold text-stone-900">{catalog.business}</h1>

          {catalog.description && (
            <p className="text-sm text-stone-500 mt-2 italic max-w-xs mx-auto leading-relaxed">
              &ldquo;{catalog.description}&rdquo;
            </p>
          )}

          <div className="flex items-center justify-center gap-3 mt-2 text-xs text-stone-400">
            <span>{rawProducts.length} product{rawProducts.length !== 1 ? 's' : ''}</span>
            {categories.length > 0 && <span className="w-1 h-1 rounded-full bg-stone-300" />}
            {categories.length > 0 && <span>{categories.length} categor{categories.length > 1 ? 'ies' : 'y'}</span>}
            <span className="w-1 h-1 rounded-full bg-stone-300" />
            <span>Since {createdDate.split(' ')[2]}</span>
          </div>

          {priceRange && (
            <p className="text-xs text-stone-300 mt-2">
              Price range: {formatPrice(priceRange.min, 'INR')} - {formatPrice(priceRange.max, 'INR')}
            </p>
          )}
        </header>

        {rawProducts.length === 0 ? (
          <div className="text-center py-20 animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <p className="text-stone-500 font-medium text-sm">No products yet</p>
            <p className="text-stone-400 text-xs mt-1">This store is setting up - check back soon.</p>
          </div>
        ) : (
          <div>
            {categories.map((category) => (
              <section key={category} className="mb-8 animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">{category}</span>
                  <span className="h-px flex-1 bg-stone-100" />
                  <span className="text-[10px] text-stone-300 font-medium">{grouped[category].length}</span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {grouped[category].map((product, i) => renderProductCard(product, i))}
                </div>
              </section>
            ))}

            {uncategorized.length > 0 && (
              <section className="mb-8 animate-fade-up">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">Other</span>
                  <span className="h-px flex-1 bg-stone-100" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {uncategorized.map((product, i) => renderProductCard(product, i))}
                </div>
              </section>
            )}
          </div>
        )}

        <div className="text-center mt-10 mb-6 animate-fade-up">
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5 max-w-xs mx-auto">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[var(--brand-light)] to-[var(--brand)]/10 flex items-center justify-center mx-auto mb-3">
              <svg className="w-5 h-5 text-[var(--brand)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              </svg>
            </div>
            <h3 className="text-sm font-semibold text-stone-800 mb-1">Want a catalog like this for your business?</h3>
            <p className="text-xs text-stone-400 mb-3">Snap photos, get AI descriptions, publish instantly - free.</p>
            <Link
              href="/"
              className="inline-block px-5 py-2.5 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white text-xs font-semibold rounded-xl hover:opacity-90 transition active:scale-[0.98] shadow-sm"
            >
              Create Your Free Catalog
            </Link>
          </div>
        </div>

        <footer className="text-center pb-4">
          <p className="text-[10px] text-stone-300 tracking-wider uppercase font-medium">Powered by LocalBiz Catalog</p>
          <p className="text-[10px] text-stone-200 mt-1">AI-powered storefronts for local businesses</p>
        </footer>
      </div>
    </div>
  );
}
