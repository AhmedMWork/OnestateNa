"use client";
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Badge, ChevronLeft, ChevronRight, ClipboardCheck, Crown, ImageIcon, Loader2, Send, Shield, Stethoscope, UserCheck } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { APPLICATION_TYPE_LABELS, FORM_SECTIONS } from '@/lib/constants';
import type { ApplicationType, Faction, Question } from '@/lib/types';

type Step = 'TYPE' | 'FACTION' | 'FORM' | 'SUCCESS';

function deviceId() {
  if (typeof window === 'undefined') return '';
  const key = 'onestaterp_device_id';
  let id = localStorage.getItem(key);
  if (!id) { id = crypto.randomUUID(); localStorage.setItem(key, id); }
  return id;
}

function GuideImage({ src, title }: { src: string; title: string }) {
  return <div className="mt-3 overflow-hidden rounded-2xl border border-onestateGold/25 bg-black/30"><div className="flex items-center gap-2 border-b border-white/10 px-4 py-2 text-sm font-bold text-onestateGoldSoft"><ImageIcon className="h-4 w-4" /> {title}</div><img src={src} alt={title} className="w-full" /></div>;
}

function RenderQuestion({ q, value, onChange }: { q: Question; value: any; onChange: (value: any) => void }) {
  const common = { value: value ?? '', onChange: (e: any) => onChange(e.target.value) };
  return <div className="rounded-3xl border border-white/10 bg-black/25 p-5"><label className="label text-base">{q.title}{q.required && <span className="text-onestateGold"> *</span>}</label>{q.description && <p className="mb-3 text-sm leading-7 text-zinc-400">{q.description}</p>}{q.input_type === 'TEXTAREA' ? <textarea className="field min-h-32" {...common} /> : q.input_type === 'NUMBER' ? <input type="number" className="field" {...common} /> : q.input_type === 'SELECT' || q.input_type === 'RADIO' ? <select className="field" value={value ?? ''} onChange={(e) => onChange(e.target.value)}><option value="">اختر</option>{q.options?.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}</select> : q.input_type === 'MULTISELECT' || q.input_type === 'CHECKBOX' ? <div className="grid gap-2 md:grid-cols-2">{q.options?.map(opt => <label key={opt.value} className="rounded-2xl border border-white/10 bg-white/[.04] p-3 text-sm"><input className="ms-2" type="checkbox" checked={Array.isArray(value) && value.includes(opt.value)} onChange={(e) => { const arr = Array.isArray(value) ? value : []; onChange(e.target.checked ? [...arr, opt.value] : arr.filter((x: string) => x !== opt.value)); }} />{opt.label}</label>)}</div> : q.input_type === 'CONSENT' ? <label className="flex items-start gap-3 rounded-2xl border border-onestateGold/20 bg-onestateGold/10 p-4 text-sm leading-7 text-zinc-200"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-1" /> <span>{q.description || q.title}</span></label> : <input className="field" {...common} />}{q.helper_image === 'client-id' && <GuideImage src="/images/client-id-guide.jpg" title="توضيح مكان Client ID" />}{q.helper_image === 'discord' && <GuideImage src="/images/discord-guide.jpg" title="توضيح مكان Discord Username" />}</div>;
}

export function ApplyFlow() {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>('TYPE');
  const [applicationType, setApplicationType] = useState<ApplicationType>('ADMIN');
  const [factionSlug, setFactionSlug] = useState<string | null>(null);
  const [factions, setFactions] = useState<Faction[]>([]);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, any>>({});
  const [sectionIndex, setSectionIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');


  useEffect(() => {
    const type = searchParams.get('type');
    if (type === 'ADMIN') {
      setApplicationType('ADMIN');
      setFactionSlug(null);
      setStep('FORM');
    }
    if (type === 'FACTION_LEADER') {
      setApplicationType('FACTION_LEADER');
      setStep('FACTION');
    }
  }, [searchParams]);

  useEffect(() => { fetch('/api/public/factions').then(r => r.json()).then(d => setFactions(d.factions || [])).catch(() => setFactions([])); }, []);
  useEffect(() => {
    const params = new URLSearchParams(); params.set('type', applicationType); if (factionSlug) params.set('faction', factionSlug);
    fetch(`/api/public/questions?${params}`).then(r => r.json()).then(d => setQuestions(d.questions || [])).catch(() => setQuestions([]));
  }, [applicationType, factionSlug]);

  useEffect(() => {
    const saved = localStorage.getItem('onestaterp_apply_draft');
    if (saved) { try { const parsed = JSON.parse(saved); setAnswers(parsed.answers || {}); } catch {} }
  }, []);
  useEffect(() => { localStorage.setItem('onestaterp_apply_draft', JSON.stringify({ answers, applicationType, factionSlug })); }, [answers, applicationType, factionSlug]);

  const sections = useMemo(() => FORM_SECTIONS.filter(s => questions.some(q => q.section === s)), [questions]);
  const activeSection = sections[sectionIndex] || sections[0] || 'البيانات الأساسية';
  const activeQuestions = questions.filter(q => q.section === activeSection);

  function selectType(type: ApplicationType) { setApplicationType(type); setFactionSlug(null); setSectionIndex(0); setStep(type === 'FACTION_LEADER' ? 'FACTION' : 'FORM'); }
  function canGoNext() {
    return activeQuestions.every(q => !q.required || (answers[q.question_key] !== undefined && answers[q.question_key] !== '' && answers[q.question_key] !== false));
  }
  async function submit() {
    setLoading(true); setError('');
    const res = await fetch('/api/applications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ applicationType, factionSlug, answers, deviceHash: deviceId(), screen: typeof window !== 'undefined' ? `${window.innerWidth}x${window.innerHeight}` : '', timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, website: '' }) });
    const data = await res.json(); setLoading(false);
    if (!data.ok) { setError(data.message || 'حدث خطأ أثناء إرسال الطلب'); return; }
    localStorage.removeItem('onestaterp_apply_draft'); setResult(data); setStep('SUCCESS');
  }

  return <><Navbar /><main className="container-page min-h-screen py-28"><div className="mb-8"><h1 className="text-4xl font-black gold-text">إرسال طلب جديد</h1><p className="mt-3 leading-8 text-zinc-400">اختر المسار المناسب ثم أكمل البيانات المطلوبة للمراجعة.</p></div>{step === 'TYPE' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid gap-5 md:grid-cols-2"><button onClick={() => selectType('ADMIN')} className="gold-panel card-hover rounded-[2rem] p-8 text-right"><UserCheck className="h-11 w-11 text-onestateGold" /><h2 className="mt-5 text-3xl font-black">التقديم على الإدارة</h2><p className="mt-3 leading-8 text-zinc-300">مسار خاص بالانضمام للفريق الإداري ومتابعة التنظيم وخدمة اللاعبين.</p></button><button onClick={() => selectType('FACTION_LEADER')} className="glass-panel card-hover rounded-[2rem] p-8 text-right"><Crown className="h-11 w-11 text-onestateGold" /><h2 className="mt-5 text-3xl font-black">التقديم على قائد فصيل</h2><p className="mt-3 leading-8 text-zinc-300">مسار لقادة الشرطة أو الجيش أو التحالف الطبي.</p></button></motion.div>}
  {step === 'FACTION' && <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}><button onClick={() => setStep('TYPE')} className="btn-dark mb-5"><ChevronRight className="h-4 w-4" /> رجوع</button><div className="grid gap-5 md:grid-cols-3">{factions.map(f => { const Icon = f.slug === 'medical' ? Stethoscope : f.slug === 'army' ? Shield : Badge; return <button key={f.slug} onClick={() => { setFactionSlug(f.slug); setStep('FORM'); }} className="glass-panel card-hover rounded-[2rem] p-7 text-right disabled:opacity-50" disabled={!f.is_open}><Icon className="h-11 w-11 text-onestateGold" /><h2 className="mt-5 text-2xl font-black">{f.name_ar}</h2><p className="mt-3 min-h-20 leading-7 text-zinc-400">{f.description_ar}</p><div className="mt-4 text-sm font-bold text-onestateGoldSoft">{f.is_open ? 'اختيار هذا الفصيل' : 'مغلق حاليًا'}</div></button>; })}</div></motion.div>}
  {step === 'FORM' && <div className="grid gap-6 lg:grid-cols-[280px_1fr]"><aside className="glass-panel h-fit rounded-[2rem] p-4"><button onClick={() => setStep(applicationType === 'FACTION_LEADER' ? 'FACTION' : 'TYPE')} className="btn-dark mb-4 w-full"><ChevronRight className="h-4 w-4" /> رجوع</button><div className="rounded-2xl border border-onestateGold/20 bg-onestateGold/10 p-4"><div className="text-sm text-zinc-400">المسار الحالي</div><div className="mt-1 font-black text-onestateGoldSoft">{APPLICATION_TYPE_LABELS[applicationType]}</div>{factionSlug && <div className="mt-2 text-sm text-zinc-300">الفصيل: {factions.find(f => f.slug === factionSlug)?.name_ar}</div>}</div><div className="mt-5 space-y-2">{sections.map((s, i) => <button key={s} onClick={() => setSectionIndex(i)} className={`w-full rounded-2xl px-4 py-3 text-right text-sm font-bold ${i === sectionIndex ? 'bg-onestateGold text-black' : 'bg-white/10 text-zinc-300'}`}>{i + 1}. {s}</button>)}</div></aside><section className="glass-panel rounded-[2rem] p-6"><div className="mb-6 flex items-center justify-between gap-4"><div><div className="text-sm text-zinc-400">المرحلة {sectionIndex + 1} من {sections.length}</div><h2 className="mt-1 text-3xl font-black">{activeSection}</h2></div><div className="h-2 w-44 overflow-hidden rounded-full bg-white/10"><div className="h-full bg-gradient-to-l from-onestateGoldSoft to-onestateGold" style={{ width: `${((sectionIndex + 1) / Math.max(sections.length, 1)) * 100}%` }} /></div></div><div className="space-y-4">{activeQuestions.map(q => <RenderQuestion key={q.id} q={q} value={answers[q.question_key]} onChange={(value) => setAnswers(prev => ({ ...prev, [q.question_key]: value }))} />)}</div>{error && <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-100">{error}</div>}<div className="mt-8 flex flex-col justify-between gap-3 sm:flex-row"><button className="btn-dark" disabled={sectionIndex === 0} onClick={() => setSectionIndex(i => Math.max(0, i - 1))}><ChevronRight className="h-4 w-4" /> السابق</button>{sectionIndex < sections.length - 1 ? <button className="btn-gold" disabled={!canGoNext()} onClick={() => setSectionIndex(i => Math.min(sections.length - 1, i + 1))}>التالي <ChevronLeft className="h-4 w-4" /></button> : <button className="btn-gold" disabled={loading || !canGoNext()} onClick={submit}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Send className="h-5 w-5" /> إرسال الطلب</>}</button>}</div></section></div>}
  {step === 'SUCCESS' && <section className="mx-auto max-w-2xl gold-panel rounded-[2rem] p-8 text-center"><ClipboardCheck className="mx-auto h-16 w-16 text-onestateGold" /><h2 className="mt-5 text-4xl font-black">تم إرسال الطلب</h2><p className="mt-4 leading-8 text-zinc-300">احتفظ برقم الطلب لمتابعة الحالة لاحقًا.</p><div className="mt-6 rounded-3xl border border-onestateGold/30 bg-black/40 p-5 text-3xl font-black text-onestateGoldSoft">{result?.applicationNo}</div><a href="/track" className="btn-gold mt-6">متابعة الطلب</a></section>}
  </main><Footer /></>;
}
