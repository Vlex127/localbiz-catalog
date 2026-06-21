'use client';

const STEPS = [
  {
    num: 1,
    title: 'Snap a Photo',
    desc: 'Take a picture of any product with your phone. One item or a whole shelf — our AI handles it.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
  },
  {
    num: 2,
    title: 'AI Extracts & Translates',
    desc: 'Gemini AI reads your product, writes details, and can translate descriptions into 8 Indian languages.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" />
      </svg>
    ),
  },
  {
    num: 3,
    title: 'Share Your Catalog',
    desc: 'Get a beautiful public link to share on WhatsApp or anywhere — with an AI-generated store tagline.',
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
          d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  return (
    <section className="w-full max-w-sm">
      <div className="text-center mb-5">
        <h2 className="text-sm font-semibold text-stone-700">How it works</h2>
        <p className="text-xs text-stone-400 mt-1">Three simple steps to digitize your products</p>
      </div>

      <div className="space-y-4">
        {STEPS.map((step) => (
          <div key={step.num} className="flex items-start gap-4 animate-fade-up stagger-{step.num}">
            <div className="w-10 h-10 rounded-xl bg-white border border-stone-200 shadow-sm flex items-center justify-center text-[var(--brand)] shrink-0">
              {step.icon}
            </div>
            <div className="min-w-0 pt-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-stone-300 uppercase tracking-wider">Step {step.num}</span>
              </div>
              <h3 className="text-sm font-semibold text-stone-800">{step.title}</h3>
              <p className="text-xs text-stone-400 mt-0.5 leading-relaxed">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
