import Link from 'next/link';
import { ClipboardList, FileText, Home, SearchCheck, Shield } from 'lucide-react';

export function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-black/55 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-12 w-12 items-center justify-center rounded-2xl border border-onestateGold/35 bg-onestateGold/10 shadow-gold"><Shield className="h-6 w-6 text-onestateGold" /></span>
          <span>
            <span className="block text-xl font-black tracking-wide gold-text">Onestaterp</span>
            <span className="block text-xs text-zinc-500">Recruitment Portal</span>
          </span>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link className="btn-dark px-4 py-2 text-sm" href="/"><Home className="h-4 w-4" /> الرئيسية</Link>
          <Link className="btn-dark px-4 py-2 text-sm" href="/apply"><ClipboardList className="h-4 w-4" /> التقديم</Link>
          <Link className="btn-dark px-4 py-2 text-sm" href="/rules"><FileText className="h-4 w-4" /> القوانين</Link>
          <Link className="btn-dark px-4 py-2 text-sm" href="/track"><SearchCheck className="h-4 w-4" /> متابعة طلب</Link>
        </nav>
        <Link href="/apply" className="btn-gold hidden py-2 md:inline-flex">ابدأ التقديم</Link>
      </div>
    </header>
  );
}
