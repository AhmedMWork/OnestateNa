"use client";
import { useEffect, useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { RuleItem } from '@/lib/types';

export function RulesExplorer() {
  const [rules, setRules] = useState<RuleItem[]>([]);
  const [q, setQ] = useState('');
  const [category, setCategory] = useState('');
  useEffect(() => { const t = setTimeout(() => { fetch(`/api/public/rules?q=${encodeURIComponent(q)}${category ? `&category=${encodeURIComponent(category)}` : ''}`).then(r => r.json()).then(d => setRules(d.rules || [])); }, 250); return () => clearTimeout(t); }, [q, category]);
  const categories = useMemo(() => Array.from(new Set(rules.map((r) => r.category))).filter(Boolean), [rules]);
  return <section className="container-page py-12"><h1 className="text-4xl font-black">مكتبة القوانين</h1><p className="mt-3 text-zinc-400">بحث وتصنيف سريع داخل قوانين OneState RP المضافة من ملفات المشروع.</p><div className="glass-panel mt-8 rounded-3xl p-5"><div className="grid gap-3 md:grid-cols-[1fr_240px]"><div className="relative"><Search className="absolute right-4 top-3.5 h-5 w-5 text-zinc-500" /><input className="field pr-12" placeholder="ابحث بالكود أو النص أو العقوبة..." value={q} onChange={(e) => setQ(e.target.value)} /></div><select className="field" value={category} onChange={(e) => setCategory(e.target.value)}><option value="">كل التصنيفات</option>{categories.map((c) => <option key={c} value={c}>{c}</option>)}</select></div></div><div className="mt-6 grid gap-4">{rules.map((rule) => <article key={rule.id} className="glass-panel rounded-3xl p-5"><div className="mb-3 flex flex-wrap items-center gap-2"><span className="pill bg-onestateGold/10 text-onestateGold">{rule.category}</span>{rule.code && <span className="pill">{rule.code}</span>}<span className="pill">{rule.severity}</span></div><h2 className="text-xl font-black">{rule.title}</h2><p className="mt-3 leading-8 text-zinc-300">{rule.body}</p>{rule.penalty && <div className="mt-3 rounded-2xl border border-red-400/20 bg-red-500/10 p-3 text-sm text-red-100">العقوبة: {rule.penalty}</div>}</article>)}</div></section>;
}
