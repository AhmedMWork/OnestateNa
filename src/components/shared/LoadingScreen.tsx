"use client";
import { useEffect, useState } from 'react';
import Image from 'next/image';

export function LoadingScreen() {
  const [show, setShow] = useState(true);
  const [progress, setProgress] = useState(5);
  useEffect(() => {
    const tick = setInterval(() => setProgress((p) => Math.min(100, p + Math.random() * 18)), 120);
    const t = setTimeout(() => setShow(false), 1300);
    return () => { clearInterval(tick); clearTimeout(t); };
  }, []);
  if (!show) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#030407]">
      <div className="absolute inset-0 bg-grid-lines bg-[size:44px_44px] opacity-30" />
      <div className="relative w-[min(92vw,560px)] rounded-[2rem] border border-white/10 bg-white/[.04] p-8 text-center shadow-gold backdrop-blur-xl">
        <div className="mx-auto mb-6 h-28 w-28 overflow-hidden rounded-[2rem] border border-onestateGold/40 bg-black/50 p-2">
          <div className="relative h-full w-full overflow-hidden rounded-[1.5rem]"><Image src="/images/onestate-logo.jpg" alt="OneState" fill className="object-cover" /></div>
        </div>
        <h1 className="text-3xl font-black"><span className="gold-text">ONESTATE</span> <span className="silver-text">RP</span></h1>
        <p className="mt-3 text-zinc-300">جاري تجهيز بوابة التقديم الرسمية...</p>
        <div className="mt-7 h-3 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gradient-to-l from-onestateGold2 to-onestateGold transition-all" style={{ width: `${Math.min(progress,100)}%` }} />
        </div>
      </div>
    </div>
  );
}
