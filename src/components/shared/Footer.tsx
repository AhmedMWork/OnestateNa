import Link from 'next/link';
import { Database, Lock, ShieldCheck } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/40 py-10">
      <div className="container-page grid gap-8 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-2 text-xl font-black gold-text"><ShieldCheck className="h-6 w-6" /> Onestaterp Portal</div>
          <p className="mt-3 leading-7 text-zinc-400">منصة عربية لإدارة طلبات الإدارة وقادة الفصائل بشكل منظم واحترافي.</p>
        </div>
        <div className="space-y-2 text-sm text-zinc-400">
          <Link className="block hover:text-onestateGold" href="/privacy">سياسة الخصوصية</Link>
          <Link className="block hover:text-onestateGold" href="/terms">شروط الاستخدام</Link>
          <Link className="block hover:text-onestateGold" href="/faq">الأسئلة الشائعة</Link>
        </div>
        <div className="grid gap-3 text-sm text-zinc-400">
          <div className="flex items-center gap-2"><Database className="h-4 w-4 text-onestateGold" /> Supabase-ready</div>
          <div className="flex items-center gap-2"><Lock className="h-4 w-4 text-onestateGold" /> Admin password protected</div>
        </div>
      </div>
    </footer>
  );
}
