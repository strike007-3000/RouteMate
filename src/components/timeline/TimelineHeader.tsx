'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Train, Utensils, Sparkles, Car, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryIcons = {
  Flight: Plane,
  Lodging: Hotel,
  Train: Train,
  Food: Utensils,
  Activity: Sparkles,
  Rental: Car
};

import { useTripStore } from '@/stores/useTripStore';

interface TimelineHeaderProps {
  dayNumber: number;
  date: string;
  categories: string[];
  isExpanded: boolean;
  onToggle: () => void;
  trip?: any;
}

export const TimelineHeader = ({ 
  dayNumber, 
  date, 
  categories, 
  isExpanded, 
  onToggle,
  trip
}: TimelineHeaderProps) => {
  const formattedDate = format(parseISO(date), 'EEEE, MMM do');
  const viewMode = useTripStore((state) => state.viewMode);
  
  if (viewMode === 'summary') {
    return (
      <div 
        onClick={onToggle}
        className={cn(
          "relative w-full overflow-hidden cursor-pointer transition-all duration-500",
          isExpanded ? "rounded-t-[var(--radius-container,32px)]" : "rounded-[var(--radius-container,32px)]"
        )}
      >
        {/* Day Card Background (Imagery) */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent z-10" />
          {trip?.coverImage ? (
            <img 
              src={trip.coverImage} 
              alt={trip.destination} 
              className="w-full h-full object-cover opacity-60 scale-110 group-hover:scale-100 transition-transform duration-1000"
            />
          ) : (
            <div className="w-full h-full bg-zinc-900" />
          )}
        </div>

        <div className="relative z-20 p-8 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">DAY {dayNumber}</span>
            <h3 className="text-2xl font-black text-white tracking-tighter">{formattedDate}</h3>
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center border border-white/20"
          >
            <ChevronDown className="w-5 h-5 text-white" />
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onToggle}
      className={cn(
        "sticky top-0 z-30 py-4 mb-2 cursor-pointer transition-all duration-300",
        isExpanded ? "bg-black/90 backdrop-blur-md" : "bg-transparent"
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">Day {dayNumber}</span>
          <h3 className="text-xl font-black text-white tracking-tighter mt-[var(--brand-gap,4px)]">{formattedDate}</h3>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex -space-x-1">
            {Array.from(new Set(categories)).slice(0, 4).map((cat, i) => {
              const Icon = categoryIcons[cat as keyof typeof categoryIcons] || Sparkles;
              return (
                <div 
                  key={i}
                  className="w-7 h-7 rounded-full bg-zinc-900 border border-white/10 flex items-center justify-center shadow-lg shadow-black/50"
                >
                  <Icon className="w-3.5 h-3.5 text-zinc-400" />
                </div>
              );
            })}
          </div>
          
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            className="w-8 h-8 rounded-2xl bg-primary/5 flex items-center justify-center border border-primary/20"
          >
            <ChevronDown className="w-4 h-4 text-primary" />
          </motion.div>
        </div>
      </div>
    </div>
  );
};
