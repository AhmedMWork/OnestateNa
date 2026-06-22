import Link from 'next/link';
import Image from 'next/image';

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-black/45 backdrop-blur-xl">
      <div className="container-page flex h-20 items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-11 w-11 overflow-hidden rounded-2xl border border-onestateGold/40 bg-black/40">
            <Image src="/images/onestate-logo.jpg" alt="OneState" fill className="object-cover" />
          </div>
          <div>
            <div className="text-lg font-black tracking-wide"><span className="gold-text">One</span><span className="silver-text">State</span></div>
            <div className="text-xs text-zinc-400">بوابة التقديم العربية</div>
          </div>
        </Link>
        <nav className="hidden items-center gap-2 md:flex">
          <Link href="/apply" className="btn-dark py-2">التقديم</Link>
          <Link href="/rules" className="btn-dark py-2">القوانين</Link>
          <Link href="/track" className="btn-dark py-2">متابعة طلب</Link>
          <Link href="/admin" className="rounded-2xl border border-onestateGold/30 bg-onestateGold/10 px-4 py-2 text-sm font-bold text-onestateGold hover:bg-onestateGold/15">الإدارة</Link>
        </nav>
      </div>
    </header>
  );
}
