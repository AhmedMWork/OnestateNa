import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'OneState RP Recruitment Portal',
  description: 'بوابة عربية للتقديم على الإدارة وقيادة الفصائل في OneState RP',
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
