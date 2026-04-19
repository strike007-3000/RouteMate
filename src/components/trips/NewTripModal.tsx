'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, ArrowRight, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
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
              className="w-full max-w-md bg-zinc-950 border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl shadow-black"
            >
              <div className="relative p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20">
                      <Sparkles className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-xl font-black text-white tracking-tighter">Plan a new trip</h2>
                      <p className="text-[10px] text-muted-foreground font-bold uppercase tracking-widest">Intelligence engine ready</p>
                    </div>
                  </div>
                  <button 
                    onClick={onClose}
                    className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Destination */}
                  <div className="space-y-2 group">
                    <label className="text-[10px] font-black text-primary uppercase tracking-[0.3em] ml-2 block transition-all group-focus-within:translate-x-1">Where to?</label>
                    <div className="relative group/input">
                      <MapPin className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within/input:text-primary transition-colors" />
                      <input 
                        type="text"
                        placeholder="e.g. Paris, New York, Tokyo"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        autoFocus
                        className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-2xl pl-14 pr-6 text-sm font-bold placeholder:text-zinc-600 focus:outline-none focus:border-primary/30 transition-all focus:bg-zinc-900"
                        required
                      />
                    </div>
                  </div>

                  {/* Dates Row */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 block italic">Start Date</label>
                       <div className="relative">
                         <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                         <input 
                          type="date"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full h-14 bg-zinc-900/30 border border-white/5 rounded-2xl pl-14 pr-4 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                         />
                       </div>
                    </div>
                    <div className="space-y-2">
                       <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-2 block italic">End Date</label>
                       <div className="relative">
                         <Calendar className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                         <input 
                          type="date"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full h-14 bg-zinc-900/30 border border-white/5 rounded-2xl pl-14 pr-4 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                         />
                       </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button 
                    type="submit"
                    className="group mt-6 w-full h-16 bg-primary rounded-2xl flex items-center justify-center gap-3 overflow-hidden active:scale-[0.98] transition-all shadow-xl shadow-primary/20 hover:shadow-primary/40"
                  >
                    <span className="text-xs font-black text-white uppercase tracking-[0.2em] relative z-10 transition-all group-hover:scale-110">Start Planning</span>
                    <ArrowRight className="w-4 h-4 text-white relative z-10 group-hover:translate-x-1 transition-transform" />
                    <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                  </button>
                </form>

                <div className="mt-8 pt-6 border-t border-white/5 text-center">
                   <p className="text-[9px] text-zinc-600 font-bold uppercase tracking-widest">RouteMate v2.1 Smart Engine</p>
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
