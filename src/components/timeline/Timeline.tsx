'use client';

import React, { useState, useEffect } from 'react';
import { useTripStore } from '@/stores/useTripStore';
import { TimelineItem } from './TimelineItem';
import { TransitCard } from './TransitCard';
import { SmartPaste } from './SmartPaste';
import { Plus, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const Timeline = () => {
  const [isSmartPasteOpen, setIsSmartPasteOpen] = useState(false);
  const { points, hydrate, isHydrated } = useTripStore();

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center py-20">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Sparkles className="w-8 h-8 text-primary" />
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-white">Your Itinerary</h2>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsSmartPasteOpen(true)}
            className="px-4 h-10 rounded-2xl bg-primary text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Smart Add
          </motion.button>
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col">
        {points.map((point, index) => {
          const nextPoint = points[index + 1];
          return (
            <React.Fragment key={point.id}>
              <TimelineItem point={point} />
              {nextPoint && <TransitCard from={point} to={nextPoint} />}
            </React.Fragment>
          );
        })}
        
        {points.length === 0 && (

          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">No plans yet</h3>
            <p className="text-sm text-muted-foreground px-12 leading-relaxed">
              Start by pasting a confirmation email or adding a manual destination.
            </p>
          </div>
        )}
      </div>

      <SmartPaste isOpen={isSmartPasteOpen} onClose={() => setIsSmartPasteOpen(false)} />
    </div>
  );
};

