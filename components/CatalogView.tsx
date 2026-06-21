'use client';

import { ProductItem } from './ProductCard';
import ProductCard from './ProductCard';

interface CatalogViewProps {
  products: ProductItem[];
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export default function CatalogView({ products, onDelete, showDelete }: CatalogViewProps) {
  if (products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 px-4 text-center animate-fade-in">
        <div className="w-20 h-20 rounded-3xl bg-stone-100 flex items-center justify-center mb-4">
          <svg className="w-9 h-9 text-stone-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.2}
              d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
        </div>
        <p className="text-stone-500 font-medium text-sm">No products yet</p>
        <p className="text-stone-400 text-xs mt-1 max-w-[200px]">
          Snap a photo of your product above and add it to your catalog
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-stone-700">Products</h2>
        <span className="text-xs text-stone-400 bg-stone-100 px-2.5 py-0.5 rounded-full font-medium">
          {products.length} item{products.length !== 1 ? 's' : ''}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <div key={product.id} style={{ animationDelay: `${i * 80}ms` }}>
            <ProductCard
              product={product}
              onDelete={onDelete}
              showDelete={showDelete}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
