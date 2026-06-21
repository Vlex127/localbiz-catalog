'use client';

import { useState } from 'react';

interface ShareSheetProps {
  slug: string;
  business: string;
  productCount: number;
}

export default function ShareSheet({ slug, business, productCount }: ShareSheetProps) {
  const [copied, setCopied] = useState(false);
  const url = `${window.location.origin}/catalog/${slug}`;

  async function copyLink() {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    const text = encodeURIComponent(`Check out ${business} - browse our products here!\n${url}`);
    window.open(`https://wa.me/?text=${text}`, '_blank');
  }

  if (!slug) return null;

  return (
    <div className="w-full max-w-sm animate-scale-in">
      <div className="bg-gradient-to-br from-[var(--accent)]/5 to-[var(--accent)]/10 rounded-2xl border border-[var(--accent)]/15 p-5 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--accent)]/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
            </svg>
          </div>
          <div>
            <h3 className="font-semibold text-stone-800 text-sm">Your catalog is live.</h3>
            <p className="text-xs text-stone-500">
              {productCount} product{productCount !== 1 ? 's' : ''} - share with your customers
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-white rounded-xl border border-stone-200 p-1.5 pl-3.5">
          <code className="flex-1 text-xs text-stone-500 truncate font-mono">{url}</code>
          <button
            onClick={copyLink}
            className="shrink-0 px-4 py-2 bg-[var(--accent)] text-white text-xs font-semibold rounded-lg hover:bg-[var(--accent)]/90 active:scale-[0.97] transition-all"
          >
            {copied ? 'Copied' : 'Copy link'}
          </button>
        </div>

        <button
          onClick={shareWhatsApp}
          className="w-full py-2.5 bg-[#25D366] text-white rounded-xl text-sm font-semibold hover:bg-[#20BD5A] active:scale-[0.98] transition-all flex items-center justify-center gap-2 shadow-sm"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
          </svg>
          Share on WhatsApp
        </button>
      </div>
    </div>
  );
}
