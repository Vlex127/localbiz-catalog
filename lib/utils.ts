import { nanoid } from 'nanoid';

export function genId() {
  return nanoid(12);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .slice(0, 50) || 'catalog';
}

export function formatPrice(price: number | null, currency = 'INR'): string {
  if (price === null || price === undefined) return '';
  const symbols: Record<string, string> = { INR: '₹', USD: '$', EUR: '€' };
  return `${symbols[currency] || currency} ${price.toFixed(2)}`;
}
