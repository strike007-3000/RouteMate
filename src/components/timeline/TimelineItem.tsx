'use client';

import React from 'react';
import { Plane, Building, MapPin, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { TripPoint } from '@/stores/useTripStore';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export const TimelineItem = ({ point }: { point: TripPoint }) => {
  const Icon = point.type === 'flight' ? Plane : point.type === 'hotel' ? Building : MapPin;
  
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 w-10 h-full flex flex-col items-center">
        <div className="w-4 h-4 rounded-full bg-primary border-4 border-background z-10" />
        <div className="w-0.5 flex-1 bg-border" />
      </div>
      
      <motion.div 
        whileHover={{ scale: 1.01 }}
        className="glass-card p-5 rounded-3xl"
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
            <Icon className="w-3.5 h-3.5 text-primary" />
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{point.type}</span>
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-xs font-semibold">{format(new Date(point.startTime), 'HH:mm')}</span>
          </div>
        </div>
        
        <h3 className="text-lg font-bold mb-1">{point.title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-1">{point.address}</p>
      </motion.div>
    </div>
  );
};
