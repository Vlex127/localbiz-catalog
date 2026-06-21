'use client';

import { useCallback, useEffect, useState } from 'react';
import CameraCapture from '@/components/CameraCapture';
import ProductEditor, { ProductData } from '@/components/ProductEditor';
import CatalogView from '@/components/CatalogView';
import ShareSheet from '@/components/ShareSheet';
import HowItWorks from '@/components/HowItWorks';
import DemoBanner from '@/components/DemoBanner';
import { ProductItem } from '@/components/ProductCard';
import { slugify } from '@/lib/utils';

const DEMO_PRODUCTS_GENERAL: ProductItem[] = [
  {
    id: 'demo-1',
    name: 'Organic Cold-Pressed Coconut Oil',
    description: 'Pure, unrefined coconut oil cold-pressed from fresh coconuts. Rich in lauric acid, perfect for cooking, skin care, and hair treatments.',
    category: 'Groceries',
    price: 349,
    currency: 'INR',
    image: null,
  },
  {
    id: 'demo-2',
    name: 'Handwoven Cotton Dhurrie - Natural Dyes',
    description: 'Traditional handwoven cotton rug made by artisans in rural Rajasthan. Each piece is unique with natural plant-based dyes.',
    category: 'Home & Kitchen',
    price: 1299,
    currency: 'INR',
    image: null,
  },
  {
    id: 'demo-3',
    name: 'Millet & Quinoa Breakfast Mix 500g',
    description: 'A wholesome blend of barnyard millet, foxtail millet, and white quinoa. High protein, gluten-free, and ready in 10 minutes.',
    category: 'Groceries',
    price: 249,
    currency: 'INR',
    image: null,
  },
  {
    id: 'demo-4',
    name: 'Raw Honey - Wild Forest Harvest 250ml',
    description: 'Unprocessed wild honey sourced from the Western Ghats forests. Rich amber color with floral notes. No additives or filtration.',
    category: 'Groceries',
    price: 449,
    currency: 'INR',
    image: null,
  },
  {
    id: 'demo-5',
    name: 'Handmade Shea Butter Soap - Lemongrass',
    description: 'Nourishing shea butter soap with organic lemongrass essential oil. Gently exfoliates with oat flour. Plastic-free packaging.',
    category: 'Beauty',
    price: 179,
    currency: 'INR',
    image: null,
  },
  {
    id: 'demo-6',
    name: 'Brass Handi Cooking Pot 1.5L',
    description: 'Traditional brass handi with a tin coating. Perfect for slow-cooking curries, biryanis, and dals. Heat-resistant wooden handles.',
    category: 'Home & Kitchen',
    price: 899,
    currency: 'INR',
    image: null,
  },
];

const DEMO_PRODUCTS_HEALTHCARE: ProductItem[] = [
  {
    id: 'h-demo-1',
    name: 'Ayurvedic Chyawanprash - 1kg',
    description: 'Traditional herbal jam made with amla, ashwagandha, and 40+ herbs. Boosts immunity and vitality. Made in small batches with raw honey.',
    category: 'Healthcare',
    price: 499,
    currency: 'INR',
    image: null,
  },
  {
    id: 'h-demo-2',
    name: 'Hand Sanitizer - Neem & Tulsi 100ml',
    description: 'Alcohol-based sanitizer infused with neem and tulsi extracts. Kills 99.9% germs while being gentle on skin. No artificial fragrance.',
    category: 'Healthcare',
    price: 99,
    currency: 'INR',
    image: null,
  },
  {
    id: 'h-demo-3',
    name: 'Organic Turmeric Powder 200g',
    description: 'Pure Lakadong turmeric with 7%+ curcumin content. Sourced directly from farmers in Meghalaya. No additives or preservatives.',
    category: 'Healthcare',
    price: 249,
    currency: 'INR',
    image: null,
  },
  {
    id: 'h-demo-4',
    name: 'Herbal Tooth Powder - Mint & Clove 100g',
    description: 'Fluoride-free tooth powder made with neem, clove, and peppermint. Strengthens gums and freshens breath naturally.',
    category: 'Healthcare',
    price: 149,
    currency: 'INR',
    image: null,
  },
];

const DEMO_PRODUCTS_AGRICULTURE: ProductItem[] = [
  {
    id: 'a-demo-1',
    name: 'Organic Vermicompost 5kg',
    description: 'Nutrient-rich worm castings from food waste. Improves soil health, boosts plant growth naturally. Perfect for home gardens and farms.',
    category: 'Agriculture',
    price: 299,
    currency: 'INR',
    image: null,
  },
  {
    id: 'a-demo-2',
    name: 'Neem Cake Fertilizer 2kg',
    description: 'Cold-pressed neem seed cake, a natural organic fertilizer and pest repellent. Enriches soil with nitrogen and protects crops naturally.',
    category: 'Agriculture',
    price: 179,
    currency: 'INR',
    image: null,
  },
  {
    id: 'a-demo-3',
    name: 'Open-Pollinated Vegetable Seed Kit',
    description: '12 varieties of traditional desi vegetable seeds - tomato, brinjal, okra, chili, and more. Non-GMO, open-pollinated, high germination rate.',
    category: 'Agriculture',
    price: 399,
    currency: 'INR',
    image: null,
  },
  {
    id: 'a-demo-4',
    name: 'Cocopeat Grow Bags - Set of 10',
    description: 'Compressed cocopeat blocks made from coconut husk waste. Expands 5x when watered. Reusable, biodegradable, ideal for terrace farming.',
    category: 'Agriculture',
    price: 449,
    currency: 'INR',
    image: null,
  },
];

type SavedState = {
  catalogId: string | null;
  catalogSlug: string | null;
  products: ProductItem[];
  business: string;
  catalogDescription: string | null;
};

const EMPTY_STATE: SavedState = {
  catalogId: null,
  catalogSlug: null,
  products: [],
  business: 'My Store',
  catalogDescription: null,
};

function getSavedState(): SavedState {
  if (typeof window === 'undefined') return EMPTY_STATE;

  try {
    const saved = sessionStorage.getItem('catalog_state');
    if (!saved) return EMPTY_STATE;
    const parsed = JSON.parse(saved) as Partial<SavedState>;

    return {
      catalogId: parsed.catalogId ?? null,
      catalogSlug: parsed.catalogSlug ?? null,
      products: parsed.products ?? [],
      business: parsed.business || 'My Store',
      catalogDescription: parsed.catalogDescription ?? null,
    };
  } catch {
    return EMPTY_STATE;
  }
}

export default function Home() {
  const initialState = getSavedState();
  const [extracting, setExtracting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [productData, setProductData] = useState<ProductData | null>(null);
  const [products, setProducts] = useState<ProductItem[]>(initialState.products);
  const [catalogId, setCatalogId] = useState<string | null>(initialState.catalogId);
  const [catalogSlug, setCatalogSlug] = useState<string | null>(initialState.catalogSlug);
  const [business, setBusiness] = useState(initialState.business);
  const [publishing, setPublishing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [lastImageDataUrl, setLastImageDataUrl] = useState<string | null>(null);
  const [showHowItWorks, setShowHowItWorks] = useState(initialState.products.length === 0);
  const [catalogDescription, setCatalogDescription] = useState<string | null>(initialState.catalogDescription);

  useEffect(() => {
    sessionStorage.setItem('catalog_state', JSON.stringify({
      catalogId,
      catalogSlug,
      products,
      business,
      catalogDescription,
    }));
  }, [business, catalogDescription, catalogId, catalogSlug, products]);

  async function createCatalog(slug: string) {
    const res = await fetch(`/api/catalog/${slug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create', business }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to create catalog');
    return data.id as string;
  }

  async function addProduct(cId: string, cSlug: string, product: ProductItem, image: string | null) {
    const res = await fetch(`/api/catalog/${cSlug}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: 'add_product',
        catalog_id: cId,
        name: product.name,
        description: product.description,
        category: product.category,
        price: product.price,
        image,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Failed to add product');
    return data.id as string;
  }

  async function loadDemo(theme: 'general' | 'healthcare' | 'agriculture') {
    const demoSets = {
      general: DEMO_PRODUCTS_GENERAL,
      healthcare: DEMO_PRODUCTS_HEALTHCARE,
      agriculture: DEMO_PRODUCTS_AGRICULTURE,
    };
    const selected = demoSets[theme];
    const slug = `${slugify(business)}-${Math.random().toString(36).slice(2, 8)}`;

    setSaving(true);
    setError(null);

    try {
      const cId = await createCatalog(slug);
      const persistedProducts: ProductItem[] = [];

      for (const product of selected) {
        const id = await addProduct(cId, slug, product, null);
        persistedProducts.push({ ...product, id });
      }

      setCatalogId(cId);
      setCatalogSlug(slug);
      setProducts(persistedProducts);
      setShowHowItWorks(false);
      setCatalogDescription(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load demo catalog');
    } finally {
      setSaving(false);
    }
  }

  const handleCapture = useCallback(async (dataUrl: string) => {
    if (!dataUrl) return;
    setExtracting(true);
    setError(null);
    setShowSuccess(false);
    setShowHowItWorks(false);
    setLastImageDataUrl(dataUrl);

    const commaIdx = dataUrl.indexOf(',');
    const mimeType = dataUrl.slice(5, commaIdx).split(';')[0];
    const rawBase64 = dataUrl.slice(commaIdx + 1);

    try {
      const res = await fetch('/api/extract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ image: rawBase64, mimeType }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProductData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Extraction failed. Try a clearer photo or load the demo.');
    } finally {
      setExtracting(false);
    }
  }, []);

  async function handleSave() {
    if (!productData) return;
    setSaving(true);
    setError(null);

    try {
      let cId = catalogId;
      let cSlug = catalogSlug;

      if (!cId || !cSlug) {
        cSlug = `${slugify(business)}-${Math.random().toString(36).slice(2, 8)}`;
        cId = await createCatalog(cSlug);
        setCatalogId(cId);
        setCatalogSlug(cSlug);
      }

      const imageToStore = lastImageDataUrl || null;
      const product: ProductItem = {
        id: '',
        name: productData.name,
        description: productData.description,
        category: productData.category,
        price: productData.estimated_price,
        currency: 'INR',
        image: imageToStore,
      };
      const id = await addProduct(cId, cSlug, product, imageToStore);

      setProducts(prev => [...prev, { ...product, id }]);
      setProductData(null);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id: string) {
    if (!catalogSlug) return;

    try {
      await fetch(`/api/catalog/${catalogSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'delete_product', product_id: id }),
      });
      setProducts(prev => prev.filter(p => p.id !== id));
    } catch {
      setError('Failed to remove product');
    }
  }

  async function handleBusinessChange(name: string) {
    setBusiness(name);
    if (catalogId && catalogSlug) {
      await fetch(`/api/catalog/${catalogSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update', catalog_id: catalogId, business: name }),
      }).catch(() => {});
    }
  }

  async function handleGenerateTagline() {
    if (!catalogId || !catalogSlug || products.length === 0) return;

    setPublishing(true);
    try {
      const descRes = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generate_catalog_description',
          business,
          products: products.map(p => p.name),
        }),
      });
      const descJson = await descRes.json();
      if (!descRes.ok) throw new Error(descJson.error || 'Failed to generate tagline');

      setCatalogDescription(descJson.result);
      await fetch(`/api/catalog/${catalogSlug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'publish',
          catalog_id: catalogId,
          description: descJson.result,
        }),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate tagline');
    } finally {
      setPublishing(false);
    }
  }

  return (
    <main className="flex-1 flex flex-col items-center px-4 py-5 gap-5 max-w-lg mx-auto w-full">
      <header className="text-center w-full pt-1 animate-fade-up">
        <div className="inline-flex items-center gap-2.5 mb-1">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[var(--brand)] to-[var(--brand-dark)] flex items-center justify-center shadow-sm">
            <svg className="w-[18px] h-[18px] text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-stone-900 tracking-tight">LocalBiz</h1>
        </div>
        <p className="text-xs text-stone-400">Turn products into a digital catalog in seconds</p>
      </header>

      <section className="w-full max-w-sm text-center animate-fade-up stagger-1">
        <h2 className="text-lg font-bold text-stone-800 leading-tight">
          Your shop,<br />now online in minutes
        </h2>
        <p className="text-sm text-stone-500 mt-2 leading-relaxed max-w-xs mx-auto">
          Snap a photo of any product and AI instantly generates a name, description, price, and category - then publish a catalog your customers can browse on any phone.
        </p>
        <div className="flex items-center justify-center gap-6 mt-4 text-xs text-stone-400">
          {['No typing needed', 'Free to use', 'Share instantly'].map((item) => (
            <span key={item} className="flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
              {item}
            </span>
          ))}
        </div>
      </section>

      {showHowItWorks && products.length === 0 && !productData && (
        <div className="animate-fade-up stagger-2 w-full flex flex-col items-center gap-4">
          <HowItWorks />
          <DemoBanner onLoadDemo={loadDemo} hasProducts={products.length > 0} />
        </div>
      )}

      {error && (
        <div className="w-full max-w-sm animate-slide-down">
          <div className="bg-red-50 border border-red-100 rounded-2xl px-4 py-3 flex items-start gap-2.5">
            <svg className="w-4 h-4 text-red-400 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 0118 0z" />
            </svg>
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="w-full max-w-sm animate-slide-down">
          <div className="bg-[var(--accent)]/10 border border-[var(--accent)]/15 rounded-2xl px-4 py-3 flex items-center gap-2.5">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-sm text-[var(--accent)] font-medium">Product added to catalog.</p>
          </div>
        </div>
      )}

      <div className="w-full max-w-sm">
        <input
          type="text"
          value={business}
          onChange={(e) => handleBusinessChange(e.target.value)}
          placeholder="Your business name"
          className="w-full px-4 py-3 bg-white border border-stone-200 rounded-xl text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--brand)]/20 focus:border-[var(--brand)]/40 transition text-center shadow-sm"
        />
      </div>

      <CameraCapture onCapture={handleCapture} loading={extracting} />

      {productData && (
        <ProductEditor
          data={productData}
          onChange={setProductData}
          onSave={handleSave}
          saving={saving}
        />
      )}

      <CatalogView
        products={products}
        onDelete={handleDelete}
        showDelete={true}
      />

      {products.length > 0 && (
        <div className="w-full max-w-sm flex flex-col gap-3 animate-fade-up">
          <button
            onClick={() => { setProductData(null); setShowSuccess(false); }}
            className="group w-full py-3 border-2 border-dashed border-stone-200 rounded-xl text-sm font-medium text-stone-500 hover:text-[var(--brand)] hover:border-[var(--brand)]/40 hover:bg-[var(--brand-light)]/30 transition-all"
          >
            <span className="flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add more products
            </span>
          </button>

          {catalogSlug && (
            <>
              {!catalogDescription && (
                <button
                  onClick={handleGenerateTagline}
                  disabled={publishing}
                  className="w-full py-3 bg-gradient-to-r from-[var(--brand)] to-[var(--brand-dark)] text-white rounded-xl text-sm font-semibold hover:from-[var(--brand-dark)] hover:to-[var(--brand-dark)] disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
                >
                  {publishing ? 'Generating tagline...' : 'Generate AI Store Tagline'}
                </button>
              )}
              <ShareSheet
                slug={catalogSlug}
                business={business}
                productCount={products.length}
              />
            </>
          )}
        </div>
      )}

      {catalogDescription && (
        <div className="w-full max-w-sm animate-fade-up">
          <div className="bg-gradient-to-br from-[var(--brand-light)]/50 to-[var(--accent-light)]/30 rounded-2xl border border-[var(--brand)]/10 p-4 text-center">
            <p className="text-sm text-stone-600 italic leading-relaxed">&ldquo;{catalogDescription}&rdquo;</p>
          </div>
        </div>
      )}

      <footer className="w-full max-w-sm pt-4 pb-6 text-center border-t border-stone-100">
        <p className="text-[10px] text-stone-300 tracking-wider uppercase font-medium">Powered by LocalBiz Catalog</p>
        <p className="text-[10px] text-stone-200 mt-1">Built with Gemini AI, Next.js, and SQLite</p>
      </footer>
    </main>
  );
}
