'use client';

interface DemoBannerProps {
  onLoadDemo: (theme: 'general' | 'healthcare' | 'agriculture') => void;
  hasProducts: boolean;
}

const THEMES = [
  {
    id: 'general' as const,
    label: 'General Store',
    icon: '🏪',
    desc: 'Groceries, home & kitchen, beauty',
    bg: 'from-amber-50 to-orange-50',
    border: 'border-amber-200/60',
    btn: 'bg-amber-500 hover:bg-amber-600',
  },
  {
    id: 'healthcare' as const,
    label: 'Healthcare',
    icon: '🏥',
    desc: 'Ayurvedic, wellness & herbal',
    bg: 'from-emerald-50 to-green-50',
    border: 'border-emerald-200/60',
    btn: 'bg-emerald-500 hover:bg-emerald-600',
  },
  {
    id: 'agriculture' as const,
    label: 'Agriculture',
    icon: '🌾',
    desc: 'Farming, seeds & organic inputs',
    bg: 'from-lime-50 to-yellow-50',
    border: 'border-lime-200/60',
    btn: 'bg-lime-500 hover:bg-lime-600',
  },
];

export default function DemoBanner({ onLoadDemo, hasProducts }: DemoBannerProps) {
  if (hasProducts) return null;

  return (
    <div className="w-full max-w-sm animate-fade-up space-y-3">
      <div className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
            <svg className="w-4 h-4 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="text-sm font-semibold text-stone-800">No API key configured?</h3>
            <p className="text-xs text-stone-500 mt-0.5 leading-relaxed">
              Try the demo with sample products to see how it works — no setup required.
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        {THEMES.map((theme) => (
          <button
            key={theme.id}
            onClick={() => onLoadDemo(theme.id)}
            className={`flex items-center gap-3 w-full p-3 rounded-xl border ${theme.border} ${theme.bg} hover:shadow-sm transition-all active:scale-[0.98] text-left`}
          >
            <span className="text-lg">{theme.icon}</span>
            <div>
              <span className="text-sm font-semibold text-stone-800">{theme.label}</span>
              <p className="text-[10px] text-stone-500">{theme.desc}</p>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
