"use client";
import Image from 'next/image';
import { motion } from 'framer-motion';

export function LoadingScreen() {
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, pointerEvents: 'none' }} transition={{ delay: 1.05, duration: .55 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="text-center">
        <motion.div initial={{ scale: .85 }} animate={{ scale: 1 }} transition={{ duration: .65, type: 'spring' }} className="mx-auto h-32 w-32 overflow-hidden rounded-[2rem] border border-onestateGold/45 bg-black shadow-gold">
          <Image src="/images/onestate-logo-reference.jpg" alt="OneState" width={128} height={128} className="h-full w-full object-cover" priority />
        </motion.div>
        <div className="mt-6 text-3xl font-black gold-text">OneState NA</div>
        <div className="mt-2 text-sm text-zinc-400">جاري تجهيز بوابة التقديم</div>
        <div className="mt-6 h-2 w-72 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1 }} className="h-full rounded-full bg-gradient-to-l from-onestateGoldSoft to-onestateGold" />
        </div>
      </div>
    </motion.div>
  );
}
