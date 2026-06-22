"use client";
import { useState } from 'react';
import { STATUS_LABELS } from '@/lib/constants';

export function TrackingForm() {
  const [applicationNo, setApplicationNo] = useState('');
  const [verifier, setVerifier] = useState('');
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  async function submit(e: React.FormEvent) { e.preventDefault(); setLoading(true); setError(''); setResult(null); try { const res = await fetch('/api/track', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ applicationNo, verifier }) }); const data = await res.json(); if (!data.ok) throw new Error(data.message); setResult(data.application); } catch (e: any) { setError(e.message); } finally { setLoading(false); } }
  return <section className="container-page py-16"><div className="glass-panel mx-auto max-w-2xl rounded-[2rem] p-8"><h1 className="text-3xl font-black">متابعة حالة الطلب</h1><p className="mt-3 text-zinc-400">اكتب رقم الطلب مع Client ID أو Discord أو اسم RP للتحقق.</p><form onSubmit={submit} className="mt-7 space-y-4"><div><label className="label">رقم الطلب</label><input className="field" value={applicationNo} onChange={(e) => setApplicationNo(e.target.value)} placeholder="OS-2026-XXXX" /></div><div><label className="label">Client ID أو Discord أو اسم RP</label><input className="field" value={verifier} onChange={(e) => setVerifier(e.target.value)} /></div><button disabled={loading} className="btn-gold w-full">متابعة</button></form>{error && <div className="mt-5 rounded-2xl border border-red-400/30 bg-red-500/10 p-4 text-red-200">{error}</div>}{result && <div className="mt-6 rounded-2xl border border-onestateGold/30 bg-onestateGold/10 p-5"><div className="text-sm text-zinc-400">الحالة الحالية</div><div className="mt-1 text-2xl font-black text-onestateGold">{STATUS_LABELS[result.status] || result.status}</div><div className="mt-3 text-zinc-300">النتيجة المبدئية: {result.score}%</div></div>}</div></section>;
}
