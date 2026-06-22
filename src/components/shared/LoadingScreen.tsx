"use client";
import { motion } from 'framer-motion';
import { Shield } from 'lucide-react';

export function LoadingScreen() {
  return (
    <motion.div initial={{ opacity: 1 }} animate={{ opacity: 0, pointerEvents: 'none' }} transition={{ delay: 1.2, duration: .65 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-black">
      <div className="text-center">
        <motion.div initial={{ scale: .85, rotate: -8 }} animate={{ scale: 1, rotate: 0 }} transition={{ duration: .7, type: 'spring' }} className="mx-auto flex h-28 w-28 items-center justify-center rounded-[2rem] border border-onestateGold/45 bg-onestateGold/10 shadow-gold">
          <Shield className="h-14 w-14 text-onestateGold" />
        </motion.div>
        <div className="mt-6 text-3xl font-black gold-text">Onestaterp</div>
        <div className="mt-2 text-sm text-zinc-400">جاري تجهيز بوابة التقديم</div>
        <div className="mt-6 h-2 w-72 overflow-hidden rounded-full bg-white/10">
          <motion.div initial={{ width: '0%' }} animate={{ width: '100%' }} transition={{ duration: 1.1 }} className="h-full rounded-full bg-gradient-to-l from-onestateGoldSoft to-onestateGold" />
        </div>
      </div>
    </motion.div>
  );
}
