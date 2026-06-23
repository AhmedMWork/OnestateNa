"use client";
import { useEffect, useMemo, useState } from 'react';
import { FileText, Filter, Loader2, Search } from 'lucide-react';
import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { Badge } from '@/components/ui/Badge';
import type { RuleItem } from '@/lib/types';

export function RulesExplorer() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  const [loading, setLoading] = useState(true);
  async function load() {
    setLoading(true);
    const params = new URLSearchParams();
    if (q) params.set('q', q);
    if (category) params.set('category', category);
    const data = await fetch(`/api/public/rules?${params}`).then(r => r.json()).catch(() => ({ rules: [] }));
    setRules(data.rules || []); setLoading(false);
  }
  useEffect(() => { load(); }, []);
  const categories = useMemo(() => Array.from(new Set(rules.map(r => r.category))).sort(), [rules]);
  return <><Navbar /><main className="container-page min-h-screen py-28"><div className="mb-8 flex items-center gap-3"><FileText className="h-9 w-9 text-onestateGold" /><div><h1 className="text-4xl font-black gold-text">مكتبة القوانين</h1><p className="mt-2 text-zinc-400">بحث وتصنيف القوانين مع الكود والعقوبة.</p></div></div><section className="glass-panel mb-8 rounded-[2rem] p-5"><div className="grid gap-3 md:grid-cols-[1fr_260px_auto]"><div className="relative"><Search className="absolute right-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500" /><input className="field pr-12" placeholder="ابحث بالكود أو النص أو العقوبة" value={q} onChange={(e) => setQ(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') load(); }} /></div><select className="field" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">كل التصنيفات</option>{categories.map(c => <option key={c} value={c}>{c}</option>)}</select><button onClick={load} className="btn-gold"><Filter className="h-4 w-4" /> تطبيق</button></div></section>{loading ? <div className="flex justify-center py-20"><Loader2 className="h-9 w-9 animate-spin text-onestateGold" /></div> : <div className="grid gap-4">{rules.map(rule => <article key={rule.id} className="glass-panel card-hover rounded-[1.5rem] p-5"><div className="mb-3 flex flex-wrap gap-2"><Badge>{rule.category}</Badge>{rule.code && <Badge className="border-onestateGold/30 bg-onestateGold/10 text-onestateGoldSoft">{rule.code}</Badge>}<Badge className={rule.severity === 'CRITICAL' ? 'border-red-400/30 bg-red-500/10 text-red-200' : 'border-white/10 bg-white/10 text-zinc-300'}>{rule.severity}</Badge></div><h2 className="text-xl font-black text-white">{rule.title}</h2><p className="mt-3 whitespace-pre-line leading-8 text-zinc-300">{rule.body}</p>{rule.penalty && <div className="mt-4 rounded-2xl border border-onestateGold/20 bg-onestateGold/10 p-3 text-sm text-onestateGoldSoft"><b>العقوبة:</b> {rule.penalty}</div>}</article>)}</div>}</main><Footer /></>;
}
