'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plane, Hash } from 'lucide-react';
import { useTripStore } from '@/stores/useTripStore';
import { ItineraryItem } from '@/lib/db';

interface EditItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  item: ItineraryItem;
}

export const EditItemModal = ({ isOpen, onClose, item }: EditItemModalProps) => {
  const updatePointMetadata = useTripStore((state) => state.updatePointMetadata);
  const [formData, setFormData] = useState({
    flightNumber: (item.metadata?.flightNumber as string) || '',
    airline: (item.metadata?.airline as string) || '',
    confirmationNumber: (item.metadata?.confirmationNumber as string) || '',
    notes: (item.metadata?.notes as string) || ''
  });

  const handleSave = async () => {
    if (item.id) {
      await updatePointMetadata(item.id, formData);
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg bg-zinc-900 border border-white/10 rounded-[32px] overflow-hidden shadow-2xl"
          >
            <div className="p-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tighter">Edit Details</h2>
                  <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest mt-1">{item.title}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-6">
                {item.category === 'Flight' && (
                  <>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                        <Plane className="w-3 h-3" /> Flight Number
                      </label>
                      <input
                        type="text"
                        value={formData.flightNumber}
                        onChange={(e) => setFormData(prev => ({ ...prev, flightNumber: e.target.value.toUpperCase() }))}
                        placeholder="e.g. SN3151"
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                         Airline Name
                      </label>
                      <input
                        type="text"
                        value={formData.airline}
                        onChange={(e) => setFormData(prev => ({ ...prev, airline: e.target.value }))}
                        placeholder="e.g. Cathay Pacific"
                        className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                      />
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">
                    <Hash className="w-3 h-3" /> Confirmation #
                  </label>
                  <input
                    type="text"
                    value={formData.confirmationNumber}
                    onChange={(e) => setFormData(prev => ({ ...prev, confirmationNumber: e.target.value }))}
                    placeholder="Enter booking reference"
                    className="w-full h-14 bg-white/5 border border-white/10 rounded-2xl px-5 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] ml-1">Notes</label>
                  <textarea
                    value={formData.notes}
                    onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    placeholder="Add any specific details, gate info, or check-in instructions..."
                    rows={3}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-5 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-all resize-none"
                  />
                </div>
              </div>

              <button
                onClick={handleSave}
                className="w-full h-16 bg-primary text-black font-black uppercase tracking-widest rounded-2xl mt-8 flex items-center justify-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-xl shadow-primary/20"
              >
                <Save className="w-5 h-5" />
                Save Changes
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
