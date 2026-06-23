import Image from 'next/image';
import Link from 'next/link';
import { SearchCheck } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/70 backdrop-blur-2xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3" aria-label="OneState NA Recruitment">
          <span className="relative flex h-14 w-14 items-center justify-center overflow-hidden rounded-2xl border border-onestateGold/35 bg-black shadow-gold">
            <Image src="/images/onestate-logo-reference.jpg" alt="OneState" width={56} height={56} className="h-full w-full object-cover" priority />
          </span>
          <span>
            <span className="block text-2xl font-black tracking-wide gold-text">OneState NA</span>
            <span className="block text-xs font-bold text-zinc-500">بوابة التقديم</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2">
          <Link className="btn-dark px-4 py-2 text-sm" href="/track"><SearchCheck className="h-4 w-4" /> متابعة طلب</Link>
          <Link href="/apply" className="btn-gold hidden py-2 sm:inline-flex">ابدأ التقديم</Link>
        </nav>
      </div>
    </header>
  );
}
