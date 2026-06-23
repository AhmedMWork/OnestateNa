import { Suspense } from 'react';
import { ApplyFlow } from '@/components/apply/ApplyFlow';
export default function Page() { return <Suspense fallback={<main className="container-page min-h-screen py-28"><div className="glass-panel rounded-[2rem] p-8">جاري تجهيز نموذج التقديم...</div></main>}><ApplyFlow /></Suspense>; }
