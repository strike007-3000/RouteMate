'use client';

import React from 'react';
import { Plane, Hotel, MapPin, Clock, Utensils, Train, Car } from 'lucide-react';
import { motion } from 'framer-motion';
import { ItineraryItem } from '@/lib/db';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryConfig = {
  Flight: { icon: Plane, color: 'text-blue-400', glow: 'shadow-blue-500/20', border: 'border-blue-500/30', bg: 'bg-blue-500/10' },
  Lodging: { icon: Hotel, color: 'text-emerald-400', glow: 'shadow-emerald-500/20', border: 'border-emerald-500/30', bg: 'bg-emerald-500/10' },
  Food: { icon: Utensils, color: 'text-amber-400', glow: 'shadow-amber-500/20', border: 'border-amber-500/30', bg: 'bg-amber-500/10' },
  Activity: { icon: MapPin, color: 'text-purple-400', glow: 'shadow-purple-500/20', border: 'border-purple-500/30', bg: 'bg-purple-500/10' },
  Train: { icon: Train, color: 'text-zinc-400', glow: 'shadow-zinc-500/20', border: 'border-zinc-500/30', bg: 'bg-zinc-500/10' },
  Rental: { icon: Car, color: 'text-teal-400', glow: 'shadow-teal-500/20', border: 'border-teal-500/30', bg: 'bg-teal-500/10' },
};

export const TimelineItem = ({ point }: { point: ItineraryItem }) => {
  const config = categoryConfig[point.category as keyof typeof categoryConfig] || categoryConfig.Activity;
  const Icon = config.icon;
  
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
          "p-5 rounded-3xl bg-zinc-900/50 border backdrop-blur-xl transition-all duration-300",
          config.border,
          config.glow,
          "shadow-lg"
        )}
      >
        <div className="flex items-start justify-between mb-4">
          <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full border", config.bg, config.border)}>
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
            <span className={cn("text-[9px] font-black uppercase tracking-[0.2em]", config.color)}>{point.category}</span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500">
            <Clock className="w-3 h-3" />
            <span className="text-[10px] font-black tracking-widest">{format(new Date(point.startTime), 'HH:mm')}</span>
          </div>
        </div>
        
        <h3 className="text-xl font-black text-white tracking-tighter leading-none mb-2">{point.title}</h3>
        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest line-clamp-1">{point.address}</p>
      </motion.div>
    </div>
  );
};
