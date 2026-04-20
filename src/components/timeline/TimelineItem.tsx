'use client';

import React from 'react';
import { Plane, Hotel, MapPin, Clock, Utensils, Train, Car, GripVertical, ArrowDownToLine, ArrowUpFromLine } from 'lucide-react';
import { motion } from 'framer-motion';
import { ItineraryItem } from '@/lib/db';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryConfig = {
  Flight: { icon: Plane, color: 'text-blue-400', glow: 'shadow-blue-500/50', border: 'border-blue-500/50', bg: 'bg-blue-500/20' },
  Lodging: { icon: Hotel, color: 'text-emerald-400', glow: 'shadow-emerald-500/50', border: 'border-emerald-500/50', bg: 'bg-emerald-500/20' },
  Food: { icon: Utensils, color: 'text-amber-400', glow: 'shadow-amber-500/50', border: 'border-amber-500/50', bg: 'bg-amber-500/20' },
  Activity: { icon: MapPin, color: 'text-purple-400', glow: 'shadow-purple-500/50', border: 'border-purple-500/50', bg: 'bg-purple-500/20' },
  Train: { icon: Train, color: 'text-orange-400', glow: 'shadow-orange-500/50', border: 'border-orange-500/50', bg: 'bg-orange-500/20' },
  Rental: { icon: Car, color: 'text-cyan-400', glow: 'shadow-cyan-500/50', border: 'border-cyan-500/50', bg: 'bg-cyan-500/20' },
};

export const TimelineItem = ({ point, dragControls }: { point: ItineraryItem, dragControls?: any }) => {
  const config = categoryConfig[point.category as keyof typeof categoryConfig] || categoryConfig.Activity;
  
  // Lodging Life-cycle Icons
  let Icon = config.icon;
  if (point.category === 'Lodging') {
    if (point.title.toLowerCase().includes('check-in')) Icon = ArrowDownToLine;
    else if (point.title.toLowerCase().includes('check-out')) Icon = ArrowUpFromLine;
  }
  
  return (
    <div className="relative pl-10 pb-4">
      <div className="absolute left-0 top-0 w-10 h-full flex flex-col items-center">
        <div className={cn("w-3 h-3 rounded-full border-2 border-black z-10", config.color.replace('text-', 'bg-'))} />
        <div className="w-0.5 flex-1 bg-white/5" />
      </div>
      
      <motion.div 
        layout
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ scale: 1.01, y: -2 }}
        className={cn(
          "p-6 rounded-[24px] bg-zinc-900/50 border border-white/5 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-black/50",
          config.glow
        )}
      >
        <div className="flex items-start justify-between mb-6">
          <div className={cn("flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10", config.bg)}>
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
            <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", config.color)}>{point.category}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">
              {point.isTimeExplicit === false ? 'Time TBD' : format(new Date(point.startTime), 'HH:mm')}
            </span>
          </div>
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-black text-white tracking-tighter leading-none">
                {point.title}
              </h3>
              {point.category === 'Flight' && (point.metadata?.arrivalAirport as string) && (
                <div className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30">
                  <span className="text-[10px] font-black text-blue-400">
                    {(point.metadata?.arrivalAirport as string).match(/\b[A-Z]{3}\b/)?.[0] || 'APT'}
                  </span>
                </div>
              )}
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest line-clamp-1">
              {(point.metadata?.fullAddress as string) || point.address}
            </p>
          </div>
          
          <div 
            className="pt-1 text-zinc-700 hover:text-zinc-500 transition-colors cursor-grab active:cursor-grabbing touch-none"
            onPointerDown={(e) => dragControls?.start(e)}
          >
            <GripVertical className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
    </div>
  );
};
