import Link from 'next/link';
import { ShieldCheck, ClipboardList, Users, Activity, Download, SearchCheck } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { LoadingScreen } from '@/components/shared/LoadingScreen';
import { Footer } from '@/components/shared/Footer';

const cards = [
  { icon: ClipboardList, title: 'تقديم الإدارة', text: 'نموذج ذكي يقيس معرفة القوانين والقدرة على التعامل مع البلاغات والمواقف.' },
  { icon: Users, title: 'قادة الفصائل', text: 'تقديم منفصل للشرطة والجيش والتحالف الطبي مع سيناريوهات قيادية دقيقة.' },
  { icon: SearchCheck, title: 'كشف التكرار', text: 'Client ID وDiscord واسم RP وبصمة الجهاز تساعد الإدارة على اكتشاف الطلبات المتكررة.' },
  { icon: Activity, title: 'لوحة تحكم', text: 'نتائج، فلترة، ملاحظات، حالات الطلب، أسئلة قابلة للتعديل، وتصدير CSV.' }
];

export default function HomePage() {
  return (
    <main>
      <LoadingScreen />
      <Navbar />
      <section className="relative overflow-hidden py-20 md:py-28">
        <div className="absolute inset-0 bg-radial-gold" />
        <div className="container-page relative grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
          <div>
            <div className="pill mb-5 inline-flex">بوابة التقديم العربية — شمال أفريقيا</div>
            <h1 className="text-5xl font-black leading-tight md:text-7xl">
              <span className="gold-text">انضم</span> إلى فريق<br />
              <span className="silver-text">OneState RP</span>
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-9 text-zinc-300">
              منصة تقديم كاملة بدل Google Forms: تقديم للإدارة وقادة الفصائل، أسئلة ديناميكية، تقييم تلقائي، كشف تكرار، ولوحة أدمن لإدارة كل طلب باحتراف.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className="btn-gold">ابدأ التقديم الآن</Link>
              <Link href="/track" className="btn-dark">متابعة طلب سابق</Link>
              <Link href="/rules" className="btn-dark">مراجعة القوانين</Link>
            </div>
          </div>
          <div className="glass-panel relative overflow-hidden rounded-[2.2rem] p-6">
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-l from-onestateGold via-white/40 to-transparent" />
            <div className="rounded-[1.8rem] border border-white/10 bg-black/40 p-6">
              <ShieldCheck className="h-16 w-16 text-onestateGold" />
              <h2 className="mt-5 text-3xl font-black">Recruitment Command Center</h2>
              <p className="mt-3 leading-8 text-zinc-300">كل طلب يدخل برقم تتبع، درجة نجاح، مستوى خطر، وسجل كامل يمكن للإدمن مراجعته وتعديله.</p>
              <div className="mt-6 grid grid-cols-2 gap-3 text-center">
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-3xl font-black text-onestateGold">3</div><div className="text-xs text-zinc-400">فصائل</div></div>
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-3xl font-black text-onestateGold">100%</div><div className="text-xs text-zinc-400">عربي RTL</div></div>
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-3xl font-black text-onestateGold">Auto</div><div className="text-xs text-zinc-400">Scoring</div></div>
                <div className="rounded-2xl bg-white/10 p-4"><div className="text-3xl font-black text-onestateGold">Admin</div><div className="text-xs text-zinc-400">Dashboard</div></div>
              </div>
              <Link href="https://onestate.com/" target="_blank" className="btn-gold mt-6 w-full gap-2"><Download className="h-4 w-4" /> تحميل اللعبة</Link>
            </div>
          </div>
        </div>
      </section>
      <section className="container-page grid gap-4 pb-20 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card) => <div key={card.title} className="glass-panel rounded-3xl p-6"><card.icon className="mb-4 h-9 w-9 text-onestateGold" /><h3 className="text-xl font-black">{card.title}</h3><p className="mt-3 leading-7 text-zinc-400">{card.text}</p></div>)}
      </section>
      <Footer />
    </main>
  );
}
