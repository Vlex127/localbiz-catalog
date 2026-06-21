'use client';

import { useRef, useState } from 'react';

interface CameraCaptureProps {
  onCapture: (dataUrl: string) => void;
  loading?: boolean;
}

export default function CameraCapture({ onCapture, loading }: CameraCaptureProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  function compressImage(dataUrl: string, maxW = 1200): Promise<string> {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let { width, height } = img;
        if (width > maxW) {
          height = (height / width) * maxW;
          width = maxW;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.src = dataUrl;
    });
  }

  async function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      const compressed = await compressImage(dataUrl);
      setPreview(compressed);
      onCapture(compressed);
    };
    reader.readAsDataURL(file);
  }

  function handleCapture() {
    fileRef.current?.click();
  }

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFile}
        className="hidden"
      />

      {preview ? (
        <div className="relative w-full max-w-sm animate-scale-in">
          <img
            src={preview}
            alt="Product preview"
            className="w-full aspect-[4/3] object-cover rounded-2xl shadow-md"
          />
          {loading && (
            <div className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot" style={{ animationDelay: '0ms' }} />
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot" style={{ animationDelay: '200ms' }} />
                <span className="w-2.5 h-2.5 bg-white rounded-full animate-pulse-dot" style={{ animationDelay: '400ms' }} />
              </div>
            </div>
          )}
          {!loading && (
            <button
              onClick={() => { setPreview(null); onCapture(''); }}
              className="absolute top-3 right-3 bg-white/90 backdrop-blur text-stone-700 text-xs font-medium px-3 py-1.5 rounded-full shadow-sm hover:bg-white transition"
            >
              Retake
            </button>
          )}
        </div>
      ) : (
        <button
          onClick={handleCapture}
          disabled={loading}
          className="group relative w-full max-w-sm aspect-[4/3] border-2 border-dashed border-stone-200 rounded-2xl flex flex-col items-center justify-center gap-3 bg-white hover:border-[var(--brand)] hover:bg-[var(--brand-light)]/30 transition-all duration-300 disabled:opacity-50 cursor-pointer"
        >
          <div className="w-16 h-16 rounded-2xl bg-stone-100 group-hover:bg-white flex items-center justify-center transition-colors shadow-sm group-hover:shadow-md">
            <svg className="w-7 h-7 text-stone-400 group-hover:text-[var(--brand)] transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
          </div>
          <div className="text-center">
            <p className="font-semibold text-stone-700 group-hover:text-[var(--brand)] transition-colors">
              Add a product photo
            </p>
            <p className="text-xs text-stone-400 mt-0.5">
              Tap to capture or upload from gallery
            </p>
          </div>
        </button>
      )}
    </div>
  );
}
