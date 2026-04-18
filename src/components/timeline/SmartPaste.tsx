'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useTripStore } from '@/stores/useTripStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils';

export const SmartPaste = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const addPoint = useTripStore((state) => state.addPoint);
  const nvidiaApiKey = useSettingsStore((state) => state.nvidiaApiKey);

  const handleExtract = async () => {
    if (!text.trim()) return;
    
    setStatus('parsing');
    try {
      const response = await fetch('/api/parse-itinerary', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-nvidia-key': nvidiaApiKey
        },
        body: JSON.stringify({ text }),
      });


      const data = await response.json();
      
      if (data.points) {
        for (const point of data.points) {
          await addPoint(point);
        }
        setStatus('success');
        setTimeout(() => {
          onClose();
          setStatus('idle');
          setText('');
        }, 1500);
      } else {
        setStatus('error');
      }
    } catch (err) {
      console.error(err);
      setStatus('error');
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:max-w-md md:mx-auto glass-card rounded-[2.5rem] z-[101] overflow-hidden flex flex-col p-8"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center">
                  <Sparkles className="text-primary w-5 h-5" />
                </div>
                <h2 className="text-xl font-black">Smart Extraction</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
              Paste your confirmation email, flight details, or hotel booking below. Our AI will handle the logistics.
            </p>

            <textarea
              className="flex-1 w-full bg-black/40 border border-white/10 rounded-3xl p-6 text-sm resize-none focus:outline-none focus:border-primary/50 transition-colors placeholder:text-zinc-700"
              placeholder="E.g. Your flight FR123 is confirmed for May 20th... check-in at CitizenM starts at 15:00..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={status === 'parsing'}
            />

            <div className="mt-8">
              <button
                disabled={!text.trim() || status === 'parsing'}
                onClick={handleExtract}
                className={cn(
                  "w-full py-5 rounded-3xl flex items-center justify-center gap-3 font-black text-sm transition-all",
                  status === 'idle' && "bg-primary text-white hover:bg-primary/90",
                  status === 'parsing' && "bg-secondary text-muted-foreground cursor-wait",
                  status === 'success' && "bg-emerald-500 text-white",
                  status === 'error' && "bg-destructive text-white"
                )}
              >
                {status === 'idle' && (
                  <>
                    <Sparkles className="w-5 h-5" />
                    Extract Itinerary
                  </>
                )}
                {status === 'parsing' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    AI is processing...
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Success!
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-5 h-5" />
                    Extraction Failed
                  </>
                )}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
