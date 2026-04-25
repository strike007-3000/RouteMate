'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, X, Loader2, CheckCircle2, AlertCircle, Plane, Hotel, Train, Utensils, MapPin, Car } from 'lucide-react';
import { useTripStore } from '@/stores/useTripStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { cn } from '@/lib/utils';
import { db, Trip } from '@/lib/db';
import { UnsplashService } from '@/services/images/UnsplashService';
import { Toast } from '../layout/Toast';

export const SmartPaste = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const [text, setText] = useState('');
  const [status, setStatus] = useState<'idle' | 'parsing' | 'success' | 'error'>('idle');
  const addPoint = useTripStore((state) => state.addPoint);
  const openRouterApiKey = useSettingsStore((state) => state.openRouterApiKey);
  const groqApiKey = useSettingsStore((state) => state.groqApiKey);
  const activeTrip = useTripStore((state) => state.activeTrip);

  const templates = [
    { icon: Plane, label: 'Flight', text: 'Flight from [Origin] to [Destination] on [Date]' },
    { icon: Hotel, label: 'Lodging', text: 'Stay at [Hotel Name] from [Check-in] to [Check-out]' },
    { icon: Train, label: 'Train', text: 'Train from [Station A] to [Station B] on [Date]' },
    { icon: Utensils, label: 'Food', text: 'Dinner at [Restaurant] on [Date] at 20:00' },
    { icon: MapPin, label: 'Activity', text: 'Visit [Attraction] on [Date] at 10:00' },
    { icon: Car, label: 'Rental', text: 'Pick up rental car at [Location] on [Date]' },
  ];

  const handleTemplateClick = (templateText: string) => {
    setText((prev) => prev + (prev.trim() ? '\n' : '') + templateText);
  };

  const [showToast, setShowToast] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleExtract = async () => {
    if (!text.trim()) return;
    
    setStatus('parsing');
    setErrorMessage(null);

    try {
      const rootYear = activeTrip?.startDate ? activeTrip.startDate.split('-')[0] : "2026";
      
      const apiOpenRouterKey = openRouterApiKey;
      const apiGroqKey = groqApiKey;

      const response = await fetch('/api/parse-itinerary', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'x-user-openrouter-key': apiOpenRouterKey || '',
          'x-user-groq-key': apiGroqKey || ''
        },
        body: JSON.stringify({ 
          text,
          rootYear
        }),
      });

      const data = await response.json();
      console.log('--- Extraction Result ---', data);
      
      if (response.ok && data.points && data.points.length > 0) {
        let successCount = 0;
        for (const point of data.points) {
          try {
            await addPoint(point);
            successCount++;
          } catch (e) {
            console.error('Failed to add point:', point, e);
          }
        }

        if (successCount === 0) {
          throw new Error('All extracted points failed to save. Check date formats.');
        }

        // Auto-expand and adaptive dates
        if (activeTrip && activeTrip.id) {
          let minDate = activeTrip.startDate;
          let maxDate = activeTrip.endDate;
          let changed = false;
          const addedDates: string[] = [];
          
          for (const point of data.points) {
            const pointStart = point.startTime.split('T')[0];
            const pointEnd = point.endTime.split('T')[0];
            
            if (!addedDates.includes(pointStart)) addedDates.push(pointStart);
            
            // Extend Start Date backwards
            if (pointStart < minDate) {
              minDate = pointStart;
              changed = true;
            }
            
            // Extend End Date forwards
            if (pointEnd > maxDate) {
              maxDate = pointEnd;
              changed = true;
            }
          }

          // Expand the new days
          useTripStore.getState().setExpandedDays([
            ...useTripStore.getState().expandedDays,
            ...addedDates
          ]);

          if (changed) {
            await db.trips.update(activeTrip.id, { 
              startDate: minDate,
              endDate: maxDate 
            });
            // REFRESH the active trip in the store to sync the new dates
            await useTripStore.getState().setActiveTrip(activeTrip.id);
          }
        }

        setStatus('success');
        setShowToast(true);
        
        // Immediate cleanup and close
        setTimeout(() => {
          onClose();
          setText('');
          setStatus('idle');
        }, 1000);
      } else {
        const errorMsg = data.details || data.error || 'Check the text and try again';
        setErrorMessage(errorMsg);
        setStatus('error');
        // Reset to active state after a brief moment so user can retry
        setTimeout(() => setStatus('idle'), 2000);
      }
    } catch (err) {
      setErrorMessage('Network error. Please try again.');
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  return (
    <>
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-[101] flex items-center justify-center p-4"
          >
            <motion.div 
              initial={{ y: 20 }}
              animate={{ y: 0 }}
              className="relative w-full max-w-[500px] h-full max-h-[85vh] sm:h-auto bg-zinc-950 border border-white/10 rounded-[40px] shadow-2xl overflow-hidden flex flex-col p-8 pb-10"
            >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                  <Sparkles className="text-primary w-6 h-6" />
                </div>
                <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block leading-none">SMART EXTRACTION</span>
                    <h2 className="text-xl font-black text-white tracking-tighter leading-none">Intelligence Engine</h2>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex gap-2 mb-8 overflow-x-auto pb-2 no-scrollbar px-1">
              {templates.map((t) => (
                <button
                  key={t.label}
                  onClick={() => handleTemplateClick(t.text)}
                  className="group flex items-center gap-2.5 px-5 py-3 rounded-[24px] bg-white/5 border border-white/10 hover:bg-white/10 transition-all active:scale-95 whitespace-nowrap"
                >
                  <t.icon className="w-4 h-4 text-primary group-hover:scale-110 transition-transform" />
                  <span className="text-[10px] font-black text-zinc-400 group-hover:text-white uppercase tracking-wider">{t.label}</span>
                </button>
              ))}
            </div>

            {/* Subtle Error Alert */}
            <AnimatePresence>
                {errorMessage && (
                    <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-4 bg-destructive/10 border border-destructive/20 rounded-[24px] flex items-center gap-3"
                    >
                        <AlertCircle className="w-4 h-4 text-destructive" />
                        <span className="text-xs font-bold text-destructive/80">{errorMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            <textarea
              className="flex-1 w-full bg-zinc-900/50 border border-white/5 rounded-[32px] p-8 text-sm font-bold resize-none focus:outline-none focus:border-primary/30 transition-all placeholder:text-zinc-700 leading-relaxed"
              placeholder="Paste your confirmation email or flight details here..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              disabled={status === 'parsing'}
            />

            <div className="mt-8">
              <button
                disabled={!text.trim() || status === 'parsing'}
                onClick={handleExtract}
                className={cn(
                  "btn-primary w-full h-16 relative overflow-hidden",
                  status === 'idle' && "border-primary text-primary",
                  status === 'parsing' && "border-zinc-800 text-zinc-500 cursor-wait bg-zinc-900/50",
                  status === 'success' && "border-emerald-500 text-emerald-500 shadow-emerald-500/20 bg-emerald-500/5",
                  status === 'error' && "border-destructive text-destructive shadow-destructive/20 bg-destructive/5"
                )}
              >
                {status === 'idle' && (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Extract Itinerary</span>
                  </>
                )}
                {status === 'parsing' && (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>AI Processing...</span>
                  </>
                )}
                {status === 'success' && (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Itinerary updated!</span>
                  </>
                )}
                {status === 'error' && (
                  <>
                    <AlertCircle className="w-4 h-4" />
                    <span>Retry Extraction</span>
                  </>
                )}
                
                {/* Pulse effect during parsing */}
                {status === 'parsing' && (
                    <motion.div 
                        animate={{ opacity: [0, 0.1, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="absolute inset-0 bg-primary/20"
                    />
                )}
              </button>
            </div>
          </motion.div>
        </motion.div>
        </>
      )}
    </AnimatePresence>
    <Toast 
        message="Itinerary updated!" 
        isOpen={showToast} 
        onClose={() => setShowToast(false)} 
    />
    </>
  );
};
