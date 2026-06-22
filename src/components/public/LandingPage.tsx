"use client";
import Link from 'next/link';
import { motion } from 'framer-motion';
import { BadgeCheck, ClipboardList, Crown, FileText, Lock, SearchCheck, Shield, ShieldCheck, Sparkles, Stethoscope, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

const stats = [
  ['نموذج ديناميكي', 'أسئلة قابلة للتعديل من الأدمن'],
  ['مراجعة احترافية', 'حالات وFlags بدل النقاط'],
  ['إدارة كاملة', 'طلبات، قوانين، أسئلة، فصائل'],
  ['جاهز للنشر', 'Vercel + Supabase + GitHub']
];

const factions = [
  { title: 'الشرطة', icon: BadgeCheck, text: 'انضباط، إجراءات اعتقال صحيحة، واحترام التسلسل القيادي.' },
  { title: 'الجيش', icon: Shield, text: 'حماية القاعدة، التزام بالأوامر، ومعرفة قواعد RP.' },
  { title: 'التحالف الطبي', icon: Stethoscope, text: 'استجابة طبية، تهدئة المواقف، ومعرفة حدود التدخل الآمن.' }
];

export function LandingPage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main>
        <section className="relative overflow-hidden pt-32">
          <div className="container-page grid min-h-[720px] items-center gap-12 lg:grid-cols-[1.05fr_.95fr]">
            <motion.div initial={{ opacity: 0, y: 26 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .75 }}>
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-onestateGold/30 bg-onestateGold/10 px-4 py-2 text-sm font-bold text-onestateGoldSoft"><Sparkles className="h-4 w-4" /> نسخة Enterprise للتقديم والمراجعة</div>
              <h1 className="text-5xl font-black leading-tight md:text-7xl">
                بوابة التقديم الرسمية
                <span className="block gold-text">لإدارة وفصائل Onestaterp</span>
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-9 text-zinc-300">منصة عربية كاملة لاستقبال طلبات الإدارة وقادة الفصائل، تنظيم الإجابات، كشف التكرار، إدارة القوانين والأسئلة، ومراجعة الطلبات من لوحة تحكم فاخرة بدون تسجيل دخول للمتقدمين.</p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/apply" className="btn-gold"><ClipboardList className="h-5 w-5" /> ابدأ التقديم</Link>
                <Link href="/rules" className="btn-dark"><FileText className="h-5 w-5" /> استعرض القوانين</Link>
                <Link href="/track" className="btn-dark"><SearchCheck className="h-5 w-5" /> تابع طلبك</Link>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .92 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .12 }} className="relative">
              <div className="absolute inset-0 rounded-[3rem] bg-onestateGold/20 blur-3xl" />
              <div className="animated-border rounded-[3rem] p-[1px]">
                <div className="relative rounded-[3rem] border border-white/10 bg-black/70 p-8 shadow-panel backdrop-blur-xl">
                  <div className="mx-auto flex h-40 w-40 animate-float items-center justify-center rounded-[2.5rem] border border-onestateGold/40 bg-gradient-to-br from-onestateGold/25 to-white/5 shadow-gold">
                    <ShieldCheck className="h-24 w-24 text-onestateGold" />
                  </div>
                  <div className="mt-8 grid gap-4 sm:grid-cols-2">
                    {stats.map(([a,b]) => <div key={a} className="rounded-3xl border border-white/10 bg-white/[.055] p-4"><div className="font-black text-onestateGoldSoft">{a}</div><div className="mt-2 text-sm leading-6 text-zinc-400">{b}</div></div>)}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="container-page py-20">
          <div className="mb-10 text-center"><h2 className="text-4xl font-black silver-text">اختار مسار التقديم</h2><p className="mt-4 text-zinc-400">كل مسار له أسئلته وشروطه ويمكن تعديله بالكامل من لوحة الأدمن.</p></div>
          <div className="grid gap-5 md:grid-cols-2">
            <Link href="/apply?type=ADMIN" className="gold-panel card-hover rounded-[2rem] p-8"><UserCheck className="h-10 w-10 text-onestateGold" /><h3 className="mt-5 text-3xl font-black">التقديم على الإدارة</h3><p className="mt-3 leading-8 text-zinc-300">أسئلة عن الخبرة، التفرغ، فهم RP، التعامل مع المخالفات، والتزام المتقدم بالسياسات.</p></Link>
            <Link href="/apply?type=FACTION_LEADER" className="glass-panel card-hover rounded-[2rem] p-8"><Crown className="h-10 w-10 text-onestateGold" /><h3 className="mt-5 text-3xl font-black">التقديم على قائد فصيل</h3><p className="mt-3 leading-8 text-zinc-300">اختيار الفصيل ثم أسئلة القيادة، السيناريوهات، النزاعات، وإدارة الأعضاء.</p></Link>
          </div>
        </section>

        <section className="container-page py-10">
          <div className="grid gap-5 md:grid-cols-3">
            {factions.map((item, index) => <motion.div key={item.title} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * .08 }} className="glass-panel card-hover rounded-[2rem] p-7"><item.icon className="h-11 w-11 text-onestateGold" /><h3 className="mt-5 text-2xl font-black">{item.title}</h3><p className="mt-3 leading-7 text-zinc-400">{item.text}</p></motion.div>)}
          </div>
        </section>

        <section className="container-page py-20">
          <div className="grid gap-5 lg:grid-cols-3">
            {[['بدون تسجيل دخول', Lock, 'المتقدم يرسل الطلب ويتابع برقم الطلب وبيانات تحقق فقط.'], ['إدارة القوانين', FileText, 'الأدمن يضيف ويعدل ويخفي القوانين والتصنيفات.'], ['سير عمل منظم', ClipboardList, 'حالات وملاحظات وسجل مراجعة كامل لكل طلب.']].map(([title, Icon, text]: any) => <div key={title} className="rounded-[2rem] border border-white/10 bg-black/35 p-7"><Icon className="h-10 w-10 text-onestateGold" /><h3 className="mt-5 text-2xl font-black">{title}</h3><p className="mt-3 leading-8 text-zinc-400">{text}</p></div>)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
