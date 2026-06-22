"use client";
import { useState } from 'react';
import { Loader2, SearchCheck } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { STATUS_CLASSES, STATUS_LABELS, APPLICATION_TYPE_LABELS } from '@/lib/constants';
import { Badge } from '@/components/ui/Badge';
import type { ApplicationStatus, ApplicationType } from '@/lib/types';

export function TrackRequest() {
  const [applicationNo, setApplicationNo] = useState('');
  const [verifier, setVerifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError(''); setResult(null);
    const res = await fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ applicationNo, verifier }) });
    const data = await res.json(); setLoading(false);
    if (!data.ok) setError(data.message || 'تعذر العثور على الطلب'); else setResult(data.application);
  }
  return <><Navbar /><main className="container-page min-h-screen py-28"><section className="mx-auto max-w-2xl glass-panel rounded-[2rem] p-8"><SearchCheck className="h-12 w-12 text-onestateGold" /><h1 className="mt-5 text-4xl font-black gold-text">متابعة حالة الطلب</h1><p className="mt-3 leading-8 text-zinc-400">اكتب رقم الطلب وClient ID أو Discord للتحقق.</p><form onSubmit={submit} className="mt-8 space-y-4"><div><label className="label">رقم الطلب</label><input className="field" value={applicationNo} onChange={(e) => setApplicationNo(e.target.value)} placeholder="OS-2026-XXXXXX" /></div><div><label className="label">Client ID أو Discord أو اسم RP</label><input className="field" value={verifier} onChange={(e) => setVerifier(e.target.value)} /></div><button className="btn-gold w-full" disabled={loading}>{loading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'متابعة الطلب'}</button></form>{error && <div className="mt-5 rounded-2xl border border-red-400/25 bg-red-500/10 p-4 text-red-100">{error}</div>}{result && <div className="mt-6 rounded-3xl border border-onestateGold/25 bg-onestateGold/10 p-5"><div className="flex items-center justify-between gap-3"><div><div className="text-sm text-zinc-400">رقم الطلب</div><div className="text-2xl font-black text-onestateGold">{result.application_no}</div></div><Badge className={STATUS_CLASSES[result.status as ApplicationStatus]}>{STATUS_LABELS[result.status as ApplicationStatus]}</Badge></div><div className="mt-4 grid gap-3 md:grid-cols-2"><div className="rounded-2xl bg-black/25 p-3 text-sm text-zinc-300">نوع الطلب: {APPLICATION_TYPE_LABELS[result.application_type as ApplicationType]}</div><div className="rounded-2xl bg-black/25 p-3 text-sm text-zinc-300">الفصيل: {result.faction_slug || 'إدارة'}</div></div></div>}</section></main><Footer /></>;
}
