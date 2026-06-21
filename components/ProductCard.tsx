'use client';

import { formatPrice } from '@/lib/utils';

export interface ProductItem {
  id: string;
  name: string;
  description: string | null;
  category: string | null;
  price: number | null;
  currency: string;
  image: string | null;
}

interface ProductCardProps {
  product: ProductItem;
  onDelete?: (id: string) => void;
  showDelete?: boolean;
}

export default function ProductCard({ product, onDelete, showDelete }: ProductCardProps) {
  return (
    <div className="group bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-stone-200 animate-fade-up">
      <div className="aspect-[4/3] bg-gradient-to-br from-stone-50 to-stone-100 overflow-hidden relative">
        {product.image ? (
          <img
            src={product.image.startsWith('data:') ? product.image : `data:image/jpeg;base64,${product.image}`}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-stone-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
          </div>
        )}
        {product.category && (
          <span className="absolute top-2.5 left-2.5 text-[10px] font-semibold uppercase tracking-wider text-white bg-stone-900/60 backdrop-blur px-2 py-1 rounded-full">
            {product.category}
          </span>
        )}
      </div>

      <div className="p-3.5 flex-1 flex flex-col gap-1.5">
        <h3 className="font-semibold text-stone-800 text-sm leading-tight line-clamp-2">{product.name}</h3>
        {product.description && (
          <p className="text-xs text-stone-400 leading-relaxed line-clamp-2">{product.description}</p>
        )}
        {product.price !== null && (
          <p className="text-base font-bold text-stone-900 mt-auto tracking-tight">
            {formatPrice(product.price, product.currency)}
          </p>
        )}
      </div>

      {showDelete && onDelete && (
        <button
          onClick={() => onDelete(product.id)}
          className="w-full py-2 text-xs font-medium text-stone-400 hover:text-red-500 hover:bg-red-50/50 transition-colors border-t border-stone-100"
        >
          Remove
        </button>
      )}
    </div>
  );
}
