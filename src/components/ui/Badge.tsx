import { clsx } from 'clsx';
export function Badge({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <span className={clsx('inline-flex items-center rounded-full border px-3 py-1 text-xs font-black', className || 'border-white/10 bg-white/10 text-zinc-200')}>{children}</span>;
}
