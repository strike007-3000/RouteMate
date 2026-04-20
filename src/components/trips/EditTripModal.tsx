'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, MapPin, Calendar, Save, Sparkles } from 'lucide-react';
import { db, Trip } from '@/lib/db';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

interface EditTripModalProps {
  isOpen: boolean;
  onClose: () => void;
  trip: Trip;
}

export const EditTripModal = ({ isOpen, onClose, trip }: EditTripModalProps) => {
  const [destination, setDestination] = useState(trip.destination);
  const [startDate, setStartDate] = useState(trip.startDate);
  const [endDate, setEndDate] = useState(trip.endDate);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    setDestination(trip.destination);
    setStartDate(trip.startDate);
    setEndDate(trip.endDate);
  }, [trip]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !trip.id) return;
    
    setIsSaving(true);
    try {
      await db.trips.update(trip.id, {
        destination,
        startDate,
        endDate,
        name: `Trip to ${destination}`
      });
      onClose();
    } catch (error) {
      console.error("Failed to update trip:", error);
    } finally {
      setIsSaving(false);
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
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[150]"
          />

          <div className="fixed inset-0 z-[151] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none">
            <motion.div
              initial={{ y: "100%", opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="w-full max-w-md bg-zinc-950 border-t sm:border border-white/10 rounded-t-[2.5rem] sm:rounded-[2.5rem] overflow-hidden pointer-events-auto shadow-2xl h-[70vh] sm:h-auto"
            >
              <div className="p-8">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[24px] bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                      <Calendar className="w-6 h-6 text-blue-500" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] mb-1 block leading-none">EDIT LOGISTICS</span>
                      <h2 className="text-xl font-black text-white tracking-tighter leading-none">Modify dates & destination</h2>
                    </div>
                  </div>
                  <button onClick={onClose} className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleSave} className="space-y-6">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-blue-500 uppercase tracking-[0.2em] ml-1 block leading-none">Destination</label>
                    <div className="relative">
                      <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
                      <input 
                        type="text"
                        value={destination}
                        onChange={(e) => setDestination(e.target.value)}
                        className="w-full h-16 bg-zinc-900/50 border border-white/5 rounded-[24px] pl-16 pr-8 text-sm font-bold placeholder:text-zinc-700 focus:outline-none focus:border-blue-500/30 transition-all"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">Start Date</label>
                      <input 
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] px-6 text-xs font-bold focus:outline-none focus:border-blue-500/20 [color-scheme:dark]"
                      />
                    </div>
                    <div className="space-y-3">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">End Date</label>
                      <input 
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] px-6 text-xs font-bold focus:outline-none focus:border-blue-500/20 [color-scheme:dark]"
                      />
                    </div>
                  </div>

                  <button 
                    type="submit"
                    disabled={isSaving}
                    className="group relative mt-6 w-full h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center gap-3 active:scale-[0.98] transition-all shadow-xl shadow-black/20"
                  >
                    <Save className={cn("w-4 h-4 text-blue-500", isSaving && "animate-pulse")} />
                    <span className="text-[11px] font-black text-blue-500 uppercase tracking-[0.2em]">{isSaving ? "Saving..." : "Save Changes"}</span>
                  </button>
                </form>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
};
