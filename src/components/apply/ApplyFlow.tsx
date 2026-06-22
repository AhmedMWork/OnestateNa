"use client";
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CheckCircle2, ChevronLeft, ChevronRight, Loader2, Shield, UserCog, Users } from 'lucide-react';
import { APPLICATION_TYPE_LABELS } from '@/lib/constants';
import type { Faction, PublicQuestion, QuestionOption } from '@/lib/types';

type Step = { name: string; questions: PublicQuestion[] };

async function fingerprint() {
  const raw = [navigator.userAgent, navigator.language, screen.width, screen.height, screen.colorDepth, Intl.DateTimeFormat().resolvedOptions().timeZone].join('|');
  const hash = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw));
  return Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, '0')).join('');
}

function GuideImage({ type }: { type: 'client' | 'discord' }) {
  return (
    <div className="mt-3 rounded-2xl border border-onestateGold/20 bg-black/40 p-3">
      <div className="mb-2 text-xs font-bold text-onestateGold">{type === 'client' ? 'توضيح مكان Client ID' : 'توضيح اسم Discord المطلوب'}</div>
      <div className="relative aspect-[16/7] overflow-hidden rounded-xl border border-white/10">
        <Image src={type === 'client' ? '/images/client-id-guide.jpg' : '/images/discord-guide.jpg'} alt={type === 'client' ? 'Client ID Guide' : 'Discord Guide'} fill className="object-cover" />
      </div>
    </div>
  );
}

function Field({ q, value, onChange }: { q: PublicQuestion; value: unknown; onChange: (v: unknown) => void }) {
  const common = { id: q.id, required: q.required };
  const options = (q.options || []) as QuestionOption[];
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[.04] p-5">
      <label htmlFor={q.id} className="label text-base">{q.title}{q.required && <span className="text-onestateGold"> *</span>}</label>
      {q.description && <p className="mb-3 text-sm leading-7 text-zinc-400">{q.description}</p>}
      {q.question_key === 'client_id' && <GuideImage type="client" />}
      {q.question_key === 'discord_username' && <GuideImage type="discord" />}
      <div className={q.question_key === 'client_id' || q.question_key === 'discord_username' ? 'mt-4' : ''}>
        {q.input_type === 'TEXTAREA' && <textarea {...common} className="field min-h-32" value={String(value || '')} onChange={(e) => onChange(e.target.value)} />}
        {q.input_type === 'TEXT' && <input {...common} className="field" value={String(value || '')} onChange={(e) => onChange(e.target.value)} />}
        {q.input_type === 'NUMBER' && <input {...common} type="number" className="field" value={String(value || '')} onChange={(e) => onChange(e.target.value)} />}
        {q.input_type === 'SELECT' && <select {...common} className="field" value={String(value || '')} onChange={(e) => onChange(e.target.value)}><option value="">اختر...</option>{options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}</select>}
        {q.input_type === 'RADIO' && <div className="grid gap-2 sm:grid-cols-2">{options.map((o) => <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-3"><input type="radio" checked={value === o.value} onChange={() => onChange(o.value)} /> <span>{o.label}</span></label>)}</div>}
        {q.input_type === 'MULTISELECT' && <div className="grid gap-2 sm:grid-cols-2">{options.map((o) => { const arr = Array.isArray(value) ? value as string[] : []; return <label key={o.value} className="flex cursor-pointer items-center gap-2 rounded-2xl border border-white/10 bg-black/30 p-3"><input type="checkbox" checked={arr.includes(o.value)} onChange={(e) => onChange(e.target.checked ? [...arr, o.value] : arr.filter((x) => x !== o.value))} /> <span>{o.label}</span></label>; })}</div>}
        {(q.input_type === 'CHECKBOX' || q.input_type === 'CONSENT') && <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-onestateGold/20 bg-onestateGold/10 p-4"><input type="checkbox" checked={Boolean(value)} onChange={(e) => onChange(e.target.checked)} className="mt-1" /> <span className="leading-7">أوافق على ذلك</span></label>}
        {q.input_type === 'SCALE' && <input {...common} type="range" min={1} max={10} value={Number(value || 5)} onChange={(e) => onChange(e.target.value)} className="w-full" />}
      </div>
    </div>
  );
}

export function ApplyFlow() {
  const [type, setType] = useState<'ADMIN' | 'FACTION_LEADER' | ''>('');
  const [factions, setFactions] = useState<Faction[]>([]);
  const [faction, setFaction] = useState('');
  const [questions, setQuestions] = useState<PublicQuestion[]>([]);
  const [answers, setAnswers] = useState<Record<string, unknown>>({});
  const [stepIndex, setStepIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ applicationNo: string; status: string; score: number } | null>(null);
  const [error, setError] = useState('');

  useEffect(() => { fetch('/api/public/factions').then(r => r.json()).then(d => setFactions(d.factions || [])); }, []);
  useEffect(() => {
    if (!type) return;
    if (type === 'FACTION_LEADER' && !faction) return;
    setLoading(true); setError('');
    fetch(`/api/public/questions?type=${type}${faction ? `&faction=${faction}` : ''}`)
      .then(r => r.json()).then(d => setQuestions(d.questions || [])).catch(() => setError('تعذر تحميل الأسئلة'))
      .finally(() => setLoading(false));
  }, [type, faction]);

  const steps: Step[] = useMemo(() => {
    const map = new Map<string, PublicQuestion[]>();
    for (const q of questions) { if (!map.has(q.section)) map.set(q.section, []); map.get(q.section)!.push(q); }
    return Array.from(map.entries()).map(([name, qs]) => ({ name, questions: qs }));
  }, [questions]);

  async function submit() {
    setLoading(true); setError('');
    try {
      const deviceHash = await fingerprint().catch(() => null);
      const res = await fetch('/api/applications', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ applicationType: type, factionSlug: faction || null, answers, deviceHash, screen: `${screen.width}x${screen.height}`, timezone: Intl.DateTimeFormat().resolvedOptions().timeZone }) });
      const data = await res.json();
      if (!data.ok) throw new Error(data.message);
      setResult({ applicationNo: data.applicationNo, status: data.status, score: data.score });
      window.localStorage.removeItem('onestate-application-draft');
    } catch (e: any) { setError(e.message || 'حدث خطأ'); }
    finally { setLoading(false); }
  }

  if (result) return <section className="container-page py-16"><div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8 text-center"><CheckCircle2 className="mx-auto h-20 w-20 text-emerald-400" /><h1 className="mt-5 text-3xl font-black">تم إرسال الطلب بنجاح</h1><p className="mt-3 text-zinc-300">احتفظ برقم الطلب لمتابعة الحالة.</p><div className="mx-auto mt-6 rounded-2xl border border-onestateGold/30 bg-onestateGold/10 p-5 text-3xl font-black text-onestateGold">{result.applicationNo}</div><p className="mt-4 text-sm text-zinc-400">النتيجة المبدئية: {result.score}% — الحالة: {result.status}</p></div></section>;

  return (
    <section className="container-page py-12">
      <div className="mb-8"><h1 className="text-4xl font-black">بوابة التقديم</h1><p className="mt-3 text-zinc-400">اختر نوع التقديم ثم أكمل النموذج. لا يحتاج المتقدم إلى تسجيل دخول.</p></div>
      {!type && <div className="grid gap-5 md:grid-cols-2">
        <button onClick={() => setType('ADMIN')} className="glass-panel group rounded-[2rem] p-8 text-right transition hover:border-onestateGold/40"><UserCog className="mb-5 h-14 w-14 text-onestateGold" /><h2 className="text-3xl font-black">التقديم على الإدارة</h2><p className="mt-3 leading-8 text-zinc-400">اختبار معرفة بالقوانين وسيناريوهات إدارة ومتابعة اللاعبين.</p></button>
        <button onClick={() => setType('FACTION_LEADER')} className="glass-panel group rounded-[2rem] p-8 text-right transition hover:border-onestateGold/40"><Shield className="mb-5 h-14 w-14 text-onestateGold" /><h2 className="text-3xl font-black">التقديم على قائد فصيل</h2><p className="mt-3 leading-8 text-zinc-400">اختر الشرطة أو الجيش أو التحالف الطبي ثم أجب على أسئلة القيادة.</p></button>
      </div>}

      {type === 'FACTION_LEADER' && !faction && <div className="grid gap-4 md:grid-cols-3">{factions.map((f) => <button key={f.slug} onClick={() => setFaction(f.slug)} className="glass-panel rounded-[2rem] p-6 text-right hover:border-onestateGold/40"><h3 className="text-2xl font-black text-onestateGold">{f.name_ar}</h3><p className="mt-3 leading-7 text-zinc-400">{f.description_ar}</p><div className="mt-4 pill inline-flex">الحد الأدنى: {f.min_hours || 4} ساعات</div></button>)}</div>}

      {loading && <div className="mt-10 flex items-center gap-3 text-zinc-300"><Loader2 className="h-5 w-5 animate-spin" /> جاري التحميل...</div>}
      {error && <div className="mt-6 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div>}

      {type && (type === 'ADMIN' || faction) && steps.length > 0 && <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
        <aside className="glass-panel h-fit rounded-[2rem] p-5"><button onClick={() => { setType(''); setFaction(''); setQuestions([]); setStepIndex(0); }} className="mb-5 text-sm text-zinc-400 hover:text-white">تغيير نوع التقديم</button><h3 className="font-black text-onestateGold">{APPLICATION_TYPE_LABELS[type]}</h3><div className="mt-5 space-y-2">{steps.map((s, i) => <button key={s.name} onClick={() => setStepIndex(i)} className={`w-full rounded-2xl p-3 text-right text-sm font-bold ${i === stepIndex ? 'bg-onestateGold text-black' : 'bg-white/10 text-zinc-300'}`}>{i + 1}. {s.name}</button>)}</div></aside>
        <div>
          <div className="mb-5 flex items-center justify-between"><h2 className="text-2xl font-black">{steps[stepIndex]?.name}</h2><span className="pill">{stepIndex + 1} / {steps.length}</span></div>
          <div className="space-y-4">{steps[stepIndex]?.questions.map((q) => <Field key={q.id} q={q} value={answers[q.id]} onChange={(v) => setAnswers((a) => ({ ...a, [q.id]: v }))} />)}</div>
          <div className="mt-6 flex justify-between gap-3"><button className="btn-dark gap-2" disabled={stepIndex === 0} onClick={() => setStepIndex((i) => Math.max(0, i - 1))}><ChevronRight className="h-4 w-4" /> السابق</button>{stepIndex < steps.length - 1 ? <button className="btn-gold gap-2" onClick={() => setStepIndex((i) => i + 1)}>التالي <ChevronLeft className="h-4 w-4" /></button> : <button disabled={loading} onClick={submit} className="btn-gold">إرسال الطلب</button>}</div>
        </div>
      </div>}
    </section>
  );
}
