'use client';

import React from 'react';
import { useTripStore } from '@/stores/useTripStore';
import { TimelineItem } from './TimelineItem';
import { TransitCard } from './TransitCard';
import { Plus } from 'lucide-react';
import { motion } from 'framer-motion';

export const Timeline = () => {
  const points = useTripStore((state) => state.points);

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black tracking-tighter">Your Itinerary</h2>
        <motion.button 
          whileTap={{ scale: 0.95 }}
          className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
        >
          <Plus className="w-6 h-6" />
        </motion.button>
      </div>
      
      <div className="flex flex-col">
        {points.map((point, index) => (
          <React.Fragment key={point.id}>
            <TimelineItem point={point} />
            {index < points.length - 1 && <TransitCard />}
          </React.Fragment>
        ))}
        
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
    </div>
  );
};
