import { Navbar } from '@/components/shared/Navbar';
import { Footer } from '@/components/shared/Footer';
export default function Page() { return <><Navbar /><main className="container-page py-28"><section className="glass-panel rounded-[2rem] p-8"><h1 className="text-4xl font-black gold-text">شروط الاستخدام</h1><p className="mt-5 leading-9 text-zinc-300">إرسال الطلب يعني أن المتقدم يقر بصحة البيانات التي كتبها وبقبوله مراجعة الإدارة لها. يحق للإدارة رفض أو تأجيل أو حظر أي طلب عند وجود بيانات مضللة أو تكرار أو مخالفة لشروط السيرفر.</p></section></main><Footer /></>; }
