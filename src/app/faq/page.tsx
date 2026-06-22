import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
import { HelpCircle } from 'lucide-react';
const items = [
  ['هل أحتاج تسجيل دخول؟', 'لا. التقديم ومتابعة الطلب يعملان بدون حساب. لوحة الإدارة فقط محمية بباسورد.'],
  ['هل يتم الربط بديسكورد؟', 'لا يوجد Webhook أو ربط خارجي. Discord يُستخدم فقط كبيان يكتبه المتقدم للتواصل.'],
  ['هل توجد نقاط نجاح؟', 'لا. النظام يعتمد على مراجعة إدارية وحالات وFlags بدل النسبة الرقمية.'],
  ['هل يمكن تعديل الأسئلة والقوانين؟', 'نعم. الأدمن يستطيع إضافة وتعديل وتعطيل وحذف الأسئلة والقوانين من لوحة التحكم.']
];
export default function Page() { return <><Navbar /><main className="container-page py-28"><div className="mb-10 flex items-center gap-3"><HelpCircle className="h-8 w-8 text-onestateGold" /><h1 className="text-4xl font-black">الأسئلة الشائعة</h1></div><div className="grid gap-4 md:grid-cols-2">{items.map(([q,a]) => <div key={q} className="glass-panel rounded-3xl p-6"><h2 className="text-xl font-black text-onestateGold">{q}</h2><p className="mt-3 leading-8 text-zinc-300">{a}</p></div>)}</div></main><Footer /></>; }
