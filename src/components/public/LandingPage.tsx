"use client";
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Badge, ChevronLeft, ClipboardCheck, Crown, SearchCheck, Shield, Stethoscope, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { LoadingScreen } from '@/components/shared/LoadingScreen';

const tracks = [
  { href: '/apply?type=ADMIN', title: 'التقديم على الفريق الإداري', text: 'مسار مخصص لمن يريد الانضمام لفريق المراجعة والتنظيم وخدمة اللاعبين.', icon: UserCheck, primary: true },
  { href: '/apply?type=FACTION_LEADER', title: 'التقديم على قائد فصيل', text: 'مسار مخصص لقيادة الشرطة أو الجيش أو التحالف الطبي بعد اختيار الفصيل.', icon: Crown, primary: false }
];

const factions = [
  { title: 'الشرطة', text: 'قيادة الانضباط، تنظيم الأعضاء، ومتابعة إجراءات الاعتقال.', icon: Badge, color: 'from-sky-400/30' },
  { title: 'الجيش', text: 'إدارة التسلسل القيادي، حماية القاعدة، وضبط الالتزام الداخلي.', icon: Shield, color: 'from-emerald-400/30' },
  { title: 'الطبي', text: 'تنظيم الاستجابة الطبية، جودة الخدمة، وسلامة الطاقم.', icon: Stethoscope, color: 'from-red-400/30' }
];

export function LandingPage() {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="overflow-hidden">
        <section className="relative pt-28">
          <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(216,166,50,.20),transparent_30%),radial-gradient(circle_at_80%_10%,rgba(255,255,255,.10),transparent_25%)]" />
          <div className="container-page grid min-h-[720px] items-center gap-12 lg:grid-cols-[1fr_.9fr]">
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .7 }}>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-onestateGold/30 bg-onestateGold/10 px-4 py-2 text-sm font-black text-onestateGoldSoft">
                <ClipboardCheck className="h-4 w-4" /> بوابة التقديم الرسمية
              </div>
              <h1 className="text-5xl font-black leading-tight md:text-7xl">
                OneState NA
                <span className="block gold-text">بوابة التقديم</span>
              </h1>
              <p className="mt-6 max-w-2xl text-xl leading-10 text-zinc-300">
                اختر مسار التقديم المناسب، أرسل طلبك للمراجعة، واحتفظ برقم المتابعة حتى يصلك قرار الإدارة المختصة.
              </p>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-zinc-500">
                لن تحتاج إلى إنشاء حساب. بعد إرسال الطلب ستحصل على رقم متابعة خاص بك.
              </p>
              <div className="mt-9 grid gap-4 sm:grid-cols-2">
                {tracks.map((item) => <Link key={item.title} href={item.href} className={`${item.primary ? 'gold-panel' : 'glass-panel'} card-hover rounded-[2rem] p-6`}><item.icon className="h-10 w-10 text-onestateGold" /><h2 className="mt-5 text-2xl font-black">{item.title}</h2><p className="mt-3 min-h-20 leading-8 text-zinc-400">{item.text}</p><span className="mt-4 inline-flex items-center gap-2 font-black text-onestateGoldSoft">ابدأ الآن <ChevronLeft className="h-4 w-4" /></span></Link>)}
              </div>
              <Link href="/track" className="btn-dark mt-5"><SearchCheck className="h-5 w-5" /> متابعة طلب سابق</Link>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: .9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: .8, delay: .1 }} className="relative">
              <div className="absolute inset-0 rounded-[3rem] bg-onestateGold/20 blur-3xl" />
              <div className="animated-border rounded-[3rem] p-[1px]">
                <div className="relative overflow-hidden rounded-[3rem] border border-white/10 bg-black/70 p-8 shadow-panel backdrop-blur-xl">
                  <Image src="/images/onestate-logo-reference.jpg" alt="OneState logo" width={900} height={900} className="mx-auto aspect-square max-h-[420px] w-full rounded-[2.5rem] object-cover opacity-95" priority />
                  <div className="absolute inset-x-8 bottom-8 rounded-[2rem] border border-onestateGold/30 bg-black/65 p-5 backdrop-blur-xl">
                    <div className="text-2xl font-black gold-text">بوابة التقديم</div>
                    <div className="mt-2 text-sm leading-7 text-zinc-400">اختر مسارك، أرسل بياناتك، وتابع نتيجة الطلب برقم المتابعة.</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </section>
        <section className="container-page py-14">
          <div className="mb-8 text-center"><h2 className="text-4xl font-black silver-text">مسارات قائد الفصيل</h2><p className="mt-3 text-zinc-500">اختيار الفصيل يتم داخل نموذج قائد الفصيل قبل بدء الأسئلة.</p></div>
          <div className="grid gap-5 md:grid-cols-3">
            {factions.map((f, i) => <motion.div key={f.title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * .08 }} className={`rounded-[2rem] border border-white/10 bg-gradient-to-br ${f.color} to-black/30 p-7 shadow-panel backdrop-blur-xl`}><div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/15 bg-black/40"><f.icon className="h-9 w-9 text-onestateGold" /></div><h3 className="mt-6 text-3xl font-black">{f.title}</h3><p className="mt-3 leading-8 text-zinc-300">{f.text}</p></motion.div>)}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
