'use client';

import { useState } from 'react';

export interface ProductData {
  name: string;
  category: string;
  description: string;
  estimated_price: number | null;
}

interface ProductEditorProps {
  data: ProductData;
  onChange: (data: ProductData) => void;
  onSave: () => void;
  saving?: boolean;
}

const CATEGORIES = [
  'Groceries', 'Electronics', 'Clothing', 'Home & Kitchen',
  'Beauty', 'Stationery', 'Healthcare', 'Agriculture', 'Other'
];

const LANGUAGES = [
  { code: 'Hindi', label: 'हिन्दी' },
  { code: 'Tamil', label: 'தமிழ்' },
  { code: 'Telugu', label: 'తెలుగు' },
  { code: 'Kannada', label: 'ಕನ್ನಡ' },
  { code: 'Malayalam', label: 'മലയാളം' },
  { code: 'Bengali', label: 'বাংলা' },
  { code: 'Marathi', label: 'मराठी' },
  { code: 'English', label: 'English' },
];

export default function ProductEditor({ data, onChange, onSave, saving }: ProductEditorProps) {
  const [expanded, setExpanded] = useState(false);
  const [improving, setImproving] = useState(false);
  const [translating, setTranslating] = useState(false);

  if (!data.name && !expanded) {
    return null;
  }

  function update(field: keyof ProductData, value: string | number | null) {
    onChange({ ...data, [field]: value });
  }

  async function handleImproveDescription() {
    if (!data.name) return;
    setImproving(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'improve_description',
          name: data.name,
          description: data.description,
        }),
      });
      const json = await res.json();
      if (res.ok) update('description', json.result);
    } catch {} finally {
      setImproving(false);
    }
  }

  async function handleTranslate(language: string) {
    if (!data.description) return;
    setTranslating(true);
    try {
      const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'translate_description',
          description: data.description,
          language,
        }),
      });
      const json = await res.json();
      if (res.ok) update('description', json.result);
    } catch {} finally {
      setTranslating(false);
    }
  }

  return (
    <div className="w-full max-w-sm animate-fade-up">
      <div className="bg-white rounded-2xl shadow-sm border border-[var(--accent-light)]/50 overflow-hidden">
        <div className="bg-gradient-to-r from-[var(--accent-light)]/40 to-[var(--accent-light)]/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-4 h-4 text-[var(--accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-semibold text-[var(--accent)]">AI Extracted</span>
          </div>
          <button
            onClick={() => setExpanded(!expanded)}
            className="text-xs text-stone-400 hover:text-[var(--accent)] transition font-medium"
          >
            {expanded ? 'Collapse' : 'Edit all'}
          </button>
        </div>

        <div className="p-4 space-y-3">
          <input
            type="text"
            value={data.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="Product name"
            className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm font-medium text-stone-800 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition"
          />

          {expanded && (
            <div className="space-y-3 animate-fade-in">
              <select
                value={data.category}
                onChange={(e) => update('category', e.target.value)}
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition appearance-none"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>

              <div className="relative">
                <textarea
                  value={data.description}
                  onChange={(e) => update('description', e.target.value)}
                  placeholder="Product description"
                  rows={3}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition resize-none"
                />
                {data.description && (
                  <button
                    onClick={handleImproveDescription}
                    disabled={improving}
                    className="absolute top-2 right-2 px-2.5 py-1 bg-white/90 backdrop-blur border border-stone-200 rounded-lg text-[10px] font-semibold text-[var(--accent)] hover:bg-[var(--accent-light)] hover:border-[var(--accent)]/30 transition disabled:opacity-50 shadow-xs"
                  >
                    {improving ? (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3 animate-spin" viewBox="0 0 24 24" fill="none">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        AI
                      </span>
                    ) : (
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI Improve
                      </span>
                    )}
                  </button>
                )}
              </div>

              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-400 text-sm font-medium">₹</span>
                <input
                  type="number"
                  value={data.estimated_price ?? ''}
                  onChange={(e) => update('estimated_price', e.target.value ? parseFloat(e.target.value) : null)}
                  placeholder="Price"
                  step="0.01"
                  className="w-full pl-8 pr-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-sm text-stone-700 placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-[var(--accent)] transition"
                />
              </div>

              {data.description && (
                <div>
                  <p className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider mb-1.5">Translate to</p>
                  <div className="flex flex-wrap gap-1.5">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => handleTranslate(lang.code)}
                        disabled={translating}
                        className="px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-lg text-[10px] font-medium text-stone-600 hover:bg-[var(--accent-light)] hover:border-[var(--accent)]/30 hover:text-[var(--accent)] transition disabled:opacity-50"
                      >
                        {lang.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <button
            onClick={onSave}
            disabled={saving || !data.name.trim()}
            className="w-full py-2.5 bg-gradient-to-r from-[var(--accent)] to-[var(--accent)]/90 text-white rounded-xl text-sm font-semibold hover:from-[var(--accent)]/90 hover:to-[var(--accent)]/80 disabled:opacity-40 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-sm"
          >
            {saving ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Saving...
              </span>
            ) : (
              'Add to Catalog'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
