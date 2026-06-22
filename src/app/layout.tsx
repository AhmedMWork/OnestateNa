import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Onestaterp Recruitment Portal',
  description: 'بوابة عربية احترافية للتقديم على الإدارة وقادة الفصائل في OneState RP',
  robots: { index: false, follow: false }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
