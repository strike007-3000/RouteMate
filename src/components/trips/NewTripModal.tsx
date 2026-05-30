'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { format } from 'date-fns';

interface NewTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { destination: string; startDate: string; endDate: string }) => void;
}

export const NewTripModal = ({ isOpen, onClose, onCreate }: NewTripModalProps) => {
  const [destination, setDestination] = useState('');
  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(new Date(Date.now() + 86400000 * 7), 'yyyy-MM-dd'));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination) return;
    onCreate({ destination, startDate, endDate });
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[101] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
            initial={{ y: "100%", opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-full max-w-md bg-zinc-950 border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl shadow-black h-[75vh]"
          >
            <div className="relative p-8">
              {/* Header */}
              <div className="flex items-center justify-between mb-10">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-[24px] bg-primary/10 flex items-center justify-center border border-primary/20">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block leading-none">NEW ADVENTURE</span>
                    <h2 className="text-xl font-black text-white tracking-tighter leading-none">Plan a new trip</h2>
                  </div>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Destination */}
                <div className="space-y-3 group">
                  <label className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] ml-1 block leading-none">Where to?</label>
                  <div className="relative group/input">
                    <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                    <input 
                      type="text"
                      placeholder="e.g. Paris, New York, Tokyo"
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      autoFocus
                      className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-[24px] pl-16 pr-8 text-sm font-bold placeholder:text-zinc-700 focus:outline-none focus:border-primary/30 transition-all focus:bg-zinc-900"
                      required
                    />
                  </div>
                </div>

                {/* Dates Row */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">Start Date</label>
                     <div className="relative">
                       <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] pl-16 pr-6 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                       />
                     </div>
                  </div>
                  <div className="space-y-3">
                     <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">End Date</label>
                     <div className="relative">
                       <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                       <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] pl-16 pr-6 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                       />
                     </div>
                  </div>
                </div>

                {/* Submit Button */}
                <button 
                  type="submit"
                  className="btn-primary w-full mt-10"
                >
                  <span>Start Planning</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>

                <div className="pb-4" />
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
