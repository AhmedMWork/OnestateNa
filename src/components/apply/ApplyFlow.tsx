"use client";

import type { ReactNode } from 'react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  ChevronLeft,
  ClipboardCheck,
  Crown,
  FileCheck2,
  ImageIcon,
  Loader2,
  LockKeyhole,
  Send,
  ShieldCheck,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { APPLICATION_TYPE_LABELS, FORM_SECTIONS } from '@/lib/constants';
import { DEFAULT_FACTIONS, getFallbackQuestions } from '@/lib/fallback-data';
import type { ApplicationType, Faction, Question } from '@/lib/types';

type Step = 'TYPE' | 'FACTION' | 'FORM' | 'SUCCESS';

function deviceId() {
  if (typeof window === 'undefined') return '';
  const key = 'onestaterp_device_id';
  let id = localStorage.getItem(key);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(key, id);
  }
  return id;
}

function FactionEmblem({ slug, size = 'lg' }: { slug?: string | null; size?: 'sm' | 'lg' }) {
  const box = size === 'lg' ? 'h-20 w-20' : 'h-12 w-12';
  const icon = size === 'lg' ? 'h-12 w-12' : 'h-7 w-7';
  if (slug === 'army') {
    return <div className={`${box} emblem-army`}><svg viewBox="0 0 80 80" className={icon} fill="none"><path d="M40 7l8.8 20.3 22 2.2-16.6 14.7 4.9 21.7L40 54.7 20.9 65.9l4.9-21.7L9.2 29.5l22-2.2L40 7z" fill="currentColor"/><path d="M40 20v34M23 37h34" stroke="#111" strokeWidth="5" strokeLinecap="round" opacity=".55"/></svg></div>;
  }
  if (slug === 'medical') {
    return <div className={`${box} emblem-medical`}><svg viewBox="0 0 80 80" className={icon} fill="none"><path d="M40 6l25 10v18c0 18-10.7 30.2-25 40C25.7 64.2 15 52 15 34V16L40 6z" fill="currentColor"/><path d="M35 23h10v12h12v10H45v12H35V45H23V35h12V23z" fill="#100" opacity=".72"/></svg></div>;
  }
  return <div className={`${box} emblem-police`}><svg viewBox="0 0 80 80" className={icon} fill="none"><path d="M40 6l24 8 5 20c-3 21-14 33-29 40C25 67 14 55 11 34l5-20 24-8z" fill="currentColor"/><path d="M40 18l5 11 12 1.2-9 8 2.8 11.8L40 44l-10.8 6 2.8-11.8-9-8L35 29l5-11z" fill="#08121c" opacity=".7"/></svg></div>;
}

function GuideImage({ src, title, caption }: { src: string; title: string; caption: string }) {
  return (
    <div className="mt-4 overflow-hidden rounded-[1.6rem] border border-onestateGold/25 bg-black/35 shadow-panel">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3 text-sm font-black text-onestateGoldSoft">
        <ImageIcon className="h-4 w-4" /> {title}
      </div>
      <img src={src} alt={title} className="max-h-[320px] w-full object-contain bg-black/40" />
      <div className="border-t border-white/10 px-4 py-3 text-xs leading-6 text-zinc-400">{caption}</div>
    </div>
  );
}

function FieldFrame({ q, children }: { q: Question; children: ReactNode }) {
  return (
    <motion.div layout initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="question-card">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div>
          <label className="block text-base font-black text-white">{q.title}{q.required && <span className="text-onestateGold"> *</span>}</label>
          {q.description && <p className="mt-2 text-sm leading-7 text-zinc-400">{q.description}</p>}
        </div>
        <span className="mt-1 rounded-full border border-white/10 bg-white/[.06] px-3 py-1 text-[11px] font-bold text-zinc-400">{q.required ? 'إجباري' : 'اختياري'}</span>
      </div>
      {children}
      {q.helper_image === 'client-id' && <GuideImage src="/images/client-id-guide.jpg" title="مكان Client ID داخل اللعبة" caption="اكتب الرقم كما يظهر في إعدادات اللعبة، ولا تكتب اسم الحساب بدلًا منه." />}
      {q.helper_image === 'discord' && <GuideImage src="/images/discord-guide.jpg" title="مكان Discord Username" caption="اكتب اسم المستخدم الظاهر في حسابك حتى يستطيع الفريق التواصل معك عند الحاجة." />}
    </motion.div>
  );
}

function RenderQuestion({ q, value, onChange }: { q: Question; value: any; onChange: (value: any) => void }) {
  const common = { value: value ?? '', onChange: (e: any) => onChange(e.target.value) };
  if (q.input_type === 'TEXTAREA') return <FieldFrame q={q}><textarea className="field min-h-[155px] resize-y" {...common} /></FieldFrame>;
  if (q.input_type === 'NUMBER') return <FieldFrame q={q}><input type="number" className="field" {...common} /></FieldFrame>;
  if (q.input_type === 'SELECT' || q.input_type === 'RADIO') {
    return <FieldFrame q={q}><select className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)}><option value="">اختر الإجابة</option>{q.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select></FieldFrame>;
  }
  if (q.input_type === 'MULTISELECT' || q.input_type === 'CHECKBOX') {
    return <FieldFrame q={q}><div className="grid gap-3 md:grid-cols-2">{q.options?.map(opt => <label key={opt.value} className="option-tile"><input className="ms-2 accent-onestateGold" type="checkbox" checked={Array.isArray(value) && value.includes(opt.value)} onChange={(e) => { const arr = Array.isArray(value) ? value : []; onChange(e.target.checked ? [...arr, opt.value] : arr.filter((x: string) => x !== opt.value)); }} />{opt.label}</label>)}</div></FieldFrame>;
  }
  if (q.input_type === 'CONSENT') {
    return <FieldFrame q={q}><button type="button" onClick={() => onChange(!value)} className={`consent-tile ${value ? 'is-checked' : ''}`}><span className="consent-box">{value && <CheckCircle2 className="h-5 w-5" />}</span><span>{q.description || q.title}</span></button></FieldFrame>;
  }
  return <FieldFrame q={q}><input className="field" {...common} /></FieldFrame>;
}

function normalizeQuestions(questions: Question[], applicationType: ApplicationType, factionSlug: string | null) {
  const source = questions.length ? questions : getFallbackQuestions(applicationType, factionSlug);
  return source.sort((a, b) => a.order_index - b.order_index);
}

function isAnswered(value: any) {
  if (Array.isArray(value)) return value.length > 0;
  return value !== undefined && value !== '' && value !== false && value !== null;
}

export function ApplyFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('TYPE');
  const [applicationType, setApplicationType] = useState<ApplicationType>('ADMIN');
  const [factionSlug, setFactionSlug] = useState<string | null>(null);
  const [factions, setFactions] = useState<Faction[]>(DEFAULT_FACTIONS);
  const [remoteQuestions, setRemoteQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [booting, setBooting] = useState(true);

  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'ADMIN') { setApplicationType('ADMIN'); setFactionSlug(null); setStep('FORM'); }
    if (type === 'FACTION_LEADER') { setApplicationType('FACTION_LEADER'); setStep('FACTION'); }
    const t = window.setTimeout(() => setBooting(false), 320);
    return () => window.clearTimeout(t);
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/public/factions')
      .then(r => r.json())
      .then(d => setFactions(d.factions?.length ? d.factions : DEFAULT_FACTIONS))
      .catch(() => setFactions(DEFAULT_FACTIONS));
  }, []);

  useEffect(() => {
    const params = new URLSearchParams();
    params.set('type', applicationType);
    if (factionSlug) params.set('faction', factionSlug);
    fetch(`/api/public/questions?${params}`)
      .then(r => r.json())
      .then(d => setRemoteQuestions(d.questions || []))
      .catch(() => setRemoteQuestions([]));
  }, [applicationType, factionSlug]);

  useEffect(() => {
    const saved = localStorage.getItem('onestaterp_apply_draft');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setAnswers(parsed.answers || {});
      } catch {}
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('onestaterp_apply_draft', JSON.stringify({ answers, applicationType, factionSlug }));
  }, [answers, applicationType, factionSlug]);

  const questions = useMemo(() => normalizeQuestions(remoteQuestions, applicationType, factionSlug), [remoteQuestions, applicationType, factionSlug]);
  const sections = useMemo(() => FORM_SECTIONS.filter(s => questions.some(q => q.section === s)), [questions]);
  const activeSection = sections[sectionIndex] || sections[0] || 'البيانات الأساسية';
  const activeQuestions = questions.filter(q => q.section === activeSection);
  const totalRequired = questions.filter(q => q.required).length;
  const answeredRequired = questions.filter(q => q.required && isAnswered(answers[q.question_key])).length;
  const progress = totalRequired ? Math.round((answeredRequired / totalRequired) * 100) : 0;
  const activeFaction = factions.find(f => f.slug === factionSlug);

  function selectType(type: ApplicationType) {
    setApplicationType(type);
    setFactionSlug(null);
    setSectionIndex(0);
    setStep(type === 'FACTION_LEADER' ? 'FACTION' : 'FORM');
    setError('');
  }

  function selectFaction(slug: string) {
    setFactionSlug(slug);
    setSectionIndex(0);
    setStep('FORM');
    setError('');
  }

  function canGoNext() {
    return activeQuestions.every(q => !q.required || isAnswered(answers[q.question_key]));
  }

  function missingLabels() {
    return activeQuestions.filter(q => q.required && !isAnswered(answers[q.question_key])).map(q => q.title);
  }

  async function submit() {
    if (!canGoNext()) { setError(`أكمل الحقول المطلوبة: ${missingLabels().join('، ')}`); return; }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          applicationType,
          factionSlug,
          answers,
          deviceHash: deviceId(),
          screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '',
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
          website: ''
        })
      });
      const data = await res.json();
      if (!data.ok) { setError(data.message || 'حدث خطأ أثناء إرسال الطلب'); return; }
      localStorage.removeItem('onestaterp_apply_draft');
      setResult(data);
      setStep('SUCCESS');
    } catch {
      setError('تعذر الاتصال بالخادم الآن. حاول مرة أخرى بعد لحظات.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen overflow-hidden py-24">
        <div className="apply-aurora" />
        <div className="container-page relative z-10">
          <header className="mb-8 grid gap-6 lg:grid-cols-[1fr_420px] lg:items-end">
            <div>
              <div className="eyebrow"><Sparkles className="h-4 w-4" /> بوابة تقديم OneState NA</div>
              <h1 className="mt-5 text-4xl font-black leading-tight md:text-6xl">تقديم واضح. <span className="gold-text">مراجعة منظمة.</span></h1>
              <p className="mt-4 max-w-3xl text-lg leading-9 text-zinc-300">اختر المسار المناسب، اكتب بياناتك وإجاباتك بجدية، ثم احتفظ برقم الطلب لمتابعة الحالة لاحقًا.</p>
            </div>
            <div className="status-strip">
              <div><span>المسار</span><strong>{APPLICATION_TYPE_LABELS[applicationType]}</strong></div>
              <div><span>الفصيل</span><strong>{activeFaction?.name_ar || 'غير محدد'}</strong></div>
              <div><span>اكتمال البيانات</span><strong>{progress}%</strong></div>
            </div>
          </header>

          <AnimatePresence mode="wait">
            {booting && <motion.section key="boot" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="mx-auto max-w-xl rounded-[2rem] border border-white/10 bg-black/45 p-8 text-center shadow-panel"><Loader2 className="mx-auto h-9 w-9 animate-spin text-onestateGold" /><div className="mt-4 font-black">جاري تجهيز بوابة التقديم...</div></motion.section>}

            {!booting && step === 'TYPE' && (
              <motion.section key="type" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 lg:grid-cols-2">
                <button onClick={() => selectType('ADMIN')} className="track-card track-card-gold text-right">
                  <div className="track-icon"><UserCheck className="h-12 w-12" /></div>
                  <div className="mt-8 text-sm font-black text-onestateGoldSoft">المسار الأول</div>
                  <h2 className="mt-2 text-4xl font-black">الفريق الإداري</h2>
                  <p className="mt-4 max-w-xl leading-9 text-zinc-300">مخصص لمن يريد الانضمام لفريق الإدارة ومراجعة البلاغات وتنظيم التجربة داخل السيرفر.</p>
                  <span className="mt-8 inline-flex items-center gap-2 font-black text-onestateGoldSoft">ابدأ طلب الإدارة <ChevronLeft className="h-5 w-5" /></span>
                </button>
                <button onClick={() => selectType('FACTION_LEADER')} className="track-card text-right">
                  <div className="track-icon"><Crown className="h-12 w-12" /></div>
                  <div className="mt-8 text-sm font-black text-onestateGoldSoft">المسار الثاني</div>
                  <h2 className="mt-2 text-4xl font-black">قائد فصيل</h2>
                  <p className="mt-4 max-w-xl leading-9 text-zinc-300">مخصص لمن يريد قيادة الشرطة أو الجيش أو التحالف الطبي، مع أسئلة قيادة ومواقف عملية.</p>
                  <span className="mt-8 inline-flex items-center gap-2 font-black text-onestateGoldSoft">اختيار الفصيل <ChevronLeft className="h-5 w-5" /></span>
                </button>
              </motion.section>
            )}

            {!booting && step === 'FACTION' && (
              <motion.section key="faction" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                <button onClick={() => setStep('TYPE')} className="btn-dark mb-6"><ArrowRight className="h-4 w-4" /> رجوع لاختيار المسار</button>
                <div className="mb-8 max-w-3xl"><h2 className="text-4xl font-black">اختر الفصيل المطلوب قيادته</h2><p className="mt-3 leading-8 text-zinc-400">كل فصيل له سيناريوهات مختلفة، لذلك اختر بدقة قبل بدء الطلب.</p></div>
                <div className="grid gap-6 lg:grid-cols-3">
                  {factions.map((f) => (
                    <button key={f.slug} onClick={() => selectFaction(f.slug)} disabled={!f.is_open} className={`faction-select-card faction-${f.slug} text-right disabled:opacity-40`}>
                      <FactionEmblem slug={f.slug} />
                      <h3 className="mt-7 text-3xl font-black">{f.name_ar}</h3>
                      <p className="mt-3 min-h-24 leading-8 text-zinc-300">{f.description_ar}</p>
                      {f.requirements_ar && <div className="mt-4 rounded-2xl border border-white/10 bg-black/25 p-4 text-sm leading-7 text-zinc-400">{f.requirements_ar}</div>}
                      <span className="mt-6 inline-flex items-center gap-2 font-black text-onestateGoldSoft">{f.is_open ? 'بدء تقديم هذا الفصيل' : 'التقديم مغلق'} <ChevronLeft className="h-4 w-4" /></span>
                    </button>
                  ))}
                </div>
              </motion.section>
            )}

            {!booting && step === 'FORM' && (
              <motion.section key="form" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="grid gap-6 xl:grid-cols-[340px_1fr]">
                <aside className="form-sidebar">
                  <button onClick={() => setStep(applicationType === 'FACTION_LEADER' ? 'FACTION' : 'TYPE')} className="btn-dark mb-5 w-full"><ArrowRight className="h-4 w-4" /> رجوع</button>
                  <div className="rounded-[1.5rem] border border-onestateGold/25 bg-onestateGold/10 p-5">
                    <div className="text-xs font-bold text-zinc-400">الطلب الحالي</div>
                    <div className="mt-2 text-xl font-black text-onestateGoldSoft">{APPLICATION_TYPE_LABELS[applicationType]}</div>
                    {activeFaction && <div className="mt-4 flex items-center gap-3"><FactionEmblem slug={activeFaction.slug} size="sm" /><div><div className="text-xs text-zinc-500">الفصيل</div><div className="font-black">{activeFaction.name_ar}</div></div></div>}
                  </div>
                  <div className="mt-5 rounded-[1.5rem] border border-white/10 bg-black/20 p-4">
                    <div className="mb-2 flex justify-between text-xs font-bold text-zinc-400"><span>اكتمال الحقول المطلوبة</span><span>{progress}%</span></div>
                    <div className="h-2 overflow-hidden rounded-full bg-white/10"><div className="h-full rounded-full bg-gradient-to-l from-onestateGoldSoft to-onestateGold" style={{ width: `${progress}%` }} /></div>
                  </div>
                  <div className="mt-5 space-y-2">
                    {sections.map((s, i) => {
                      const count = questions.filter(q => q.section === s).length;
                      const done = questions.filter(q => q.section === s && (!q.required || isAnswered(answers[q.question_key]))).length;
                      return <button key={s} onClick={() => setSectionIndex(i)} className={`step-tab ${i === sectionIndex ? 'is-active' : ''}`}><span>{i + 1}</span><strong>{s}</strong><small>{done}/{count}</small></button>;
                    })}
                  </div>
                </aside>
                <section className="form-stage">
                  <div className="mb-7 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
                    <div>
                      <div className="text-sm font-bold text-onestateGoldSoft">المرحلة {sectionIndex + 1} من {sections.length}</div>
                      <h2 className="mt-2 text-4xl font-black">{activeSection}</h2>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/[.04] px-4 py-3 text-sm leading-7 text-zinc-400"><LockKeyhole className="ms-2 inline h-4 w-4 text-onestateGold" /> لن تحتاج إلى إنشاء حساب. سيتم إنشاء رقم متابعة بعد الإرسال.</div>
                  </div>

                  {activeQuestions.length === 0 ? (
                    <div className="rounded-[2rem] border border-red-400/30 bg-red-500/10 p-6 text-red-100"><AlertCircle className="mb-3 h-7 w-7" /> لم يتم تحميل أسئلة هذه المرحلة. تم تجهيز أسئلة احتياطية داخل النظام، حدّث الصفحة أو راجع اتصال قاعدة البيانات.</div>
                  ) : (
                    <div className="space-y-4">{activeQuestions.map(q => <RenderQuestion key={q.id} q={q} value={answers[q.question_key]} onChange={(value) => setAnswers(prev => ({ ...prev, [q.question_key]: value }))} />)}</div>
                  )}

                  {error && <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-sm leading-7 text-red-100"><AlertCircle className="ms-2 inline h-5 w-5" />{error}</div>}

                  <div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row">
                    <button className="btn-dark" disabled={sectionIndex === 0} onClick={() => setSectionIndex(i => Math.max(0, i - 1))}><ArrowRight className="h-4 w-4" /> السابق</button>
                    {sectionIndex < sections.length - 1 ? (
                      <button className="btn-gold" disabled={!canGoNext()} onClick={() => { setError(''); setSectionIndex(i => Math.min(sections.length - 1, i + 1)); }}>التالي <ArrowLeft className="h-4 w-4" /></button>
                    ) : (
                      <button className="btn-gold" disabled={loading || !canGoNext()} onClick={submit}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> إرسال الطلب للمراجعة</>}</button>
                    )}
                  </div>
                </section>
              </motion.section>
            )}

            {!booting && step === 'SUCCESS' && (
              <motion.section key="success" initial={{ opacity: 0, scale: .96 }} animate={{ opacity: 1, scale: 1 }} className="mx-auto max-w-2xl rounded-[2.5rem] border border-onestateGold/30 bg-gradient-to-br from-onestateGold/15 to-black/55 p-9 text-center shadow-gold backdrop-blur-xl">
                <FileCheck2 className="mx-auto h-20 w-20 text-onestateGold" />
                <h2 className="mt-6 text-5xl font-black">تم إرسال الطلب</h2>
                <p className="mt-4 leading-8 text-zinc-300">احتفظ برقم الطلب. ستحتاجه لمتابعة الحالة لاحقًا.</p>
                <div className="mt-7 rounded-[2rem] border border-onestateGold/30 bg-black/50 p-6 text-4xl font-black tracking-wider text-onestateGoldSoft">{result?.applicationNo}</div>
                <a href="/track" className="btn-gold mt-7"><ClipboardCheck className="h-5 w-5" /> متابعة الطلب</a>
              </motion.section>
            )}
          </AnimatePresence>
        </div>
      </main>
      <Footer />
    </>
  );
}
