'use client';

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, Sparkles } from 'lucide-react';

interface ToastProps {
  message: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Toast = ({ message, isOpen, onClose }: ToastProps) => {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(onClose, 3000);
      return () => clearTimeout(timer);
    }
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 20, scale: 0.9 }}
          className="fixed bottom-24 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-3 px-6 py-4 bg-primary rounded-[24px] shadow-2xl shadow-primary/40 border border-white/20"
        >
          <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-sm font-black text-white tracking-tight">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
