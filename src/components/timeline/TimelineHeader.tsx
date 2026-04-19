'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Plane, Hotel, Train, Utensils, Sparkles, Car, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

const categoryIcons = {
  Flight: Plane,
  Lodging: Hotel,
  Train: Train,
  Food: Utensils,
  Activity: Sparkles,
  Rental: Car
};

interface TimelineHeaderProps {
  dayNumber: number;
  date: string;
  categories: string[];
  isExpanded: boolean;
  onToggle: () => void;
}

export const TimelineHeader = ({ 
  dayNumber, 
  date, 
  categories, 
  isExpanded, 
  onToggle 
}: TimelineHeaderProps) => {
  const formattedDate = format(new Date(date), 'EEEE, MMM do');
  
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
          <h3 className="text-xl font-black text-white tracking-tighter">{formattedDate}</h3>
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
