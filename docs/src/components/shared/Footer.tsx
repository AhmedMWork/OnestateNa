import Image from 'next/image';

export function Footer() {
  return (
    <footer className="mt-20 border-t border-white/10 bg-black/45 py-8">
      <div className="container-page flex flex-col items-center justify-between gap-4 text-center md:flex-row md:text-right">
        <div className="flex items-center gap-3">
          <span className="relative h-12 w-12 overflow-hidden rounded-2xl border border-onestateGold/30 bg-black"><Image src="/images/onestate-logo-reference.jpg" alt="OneState" width={48} height={48} className="h-full w-full object-cover" /></span>
          <div>
            <div className="font-black gold-text">OneState NA Recruitment</div>
            <div className="text-xs text-zinc-500">بوابة مخصصة لاستقبال ومراجعة طلبات التقديم</div>
          </div>
        </div>
        <p className="text-sm text-zinc-500">احتفظ برقم الطلب بعد الإرسال لمتابعة حالته لاحقًا.</p>
      </div>
    </footer>
  );
}
