'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, Navigation, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';
import { format, parseISO } from 'date-fns';

interface BentoBoxProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
  subValue?: string;
  onClick?: () => void;
}

const BentoBox = ({ title, value, icon, className, delay = 0, subValue, onClick }: BentoBoxProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ delay }}
    whileHover={{ y: -2 }}
    onClick={onClick}
    className={cn(
      "bg-black/40 backdrop-blur-xl p-4 rounded-[24px] flex flex-col justify-center overflow-hidden relative group border border-white/5 min-w-[130px] h-24 hover:border-primary/20 transition-all duration-300",
      onClick && "cursor-pointer active:scale-95",
      className
    )}
  >
    <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-all duration-500">
      {icon}
    </div>
    <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1.5 leading-none">{title}</span>
    <span className={cn("text-base font-black tracking-tighter text-white line-clamp-1 leading-none", value === "Plan a Step" && "text-primary")}>{value}</span>
    <div className="flex items-center gap-1.5 mt-2">
      <div className="w-1 h-1 rounded-full bg-primary" />
      <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest leading-none">
        {subValue || "READY"}
      </span>
    </div>
  </motion.div>
);

export const BentoGrid = ({ onOpenSmartAdd }: { onOpenSmartAdd: () => void }) => {
  const { activeTrip } = useTripStore();
  const now = new Date();
  
  const points = useLiveQuery<ItineraryItem[]>(
    async () => {
      if (activeTrip?.id) {
        return db.itineraryItems.where('tripId').equals(activeTrip.id).toArray();
      }
      // If no active trip (dashboard), find the next point across ALL trips
      return db.itineraryItems.toArray();
    },
    [activeTrip?.id]
  ) || [];
  
  const nextPoint = points
    .filter(p => {
      try {
        const itemTime = parseISO(p.startTime);
        return itemTime.getTime() > now.getTime();
      } catch {
        return false;
      }
    })
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  const flightRegex = /[A-Z]{2,3}\s?\d{3,4}/i;
  const flightMatch = nextPoint?.title.match(flightRegex);
  const nextActionValue = nextPoint ? (flightMatch ? flightMatch[0] : nextPoint.title) : "Plan a Step";
  
  const transitStatus = points.length > 0 ? "Optimized" : "Add Stop";
  
  let statusSubValue = "Ready";
  if (nextPoint) {
    const hours = Math.round((new Date(nextPoint.startTime).getTime() - now.getTime()) / 3600000);
    statusSubValue = hours > 0 ? `${hours}h left` : "Soon";
  }

  return (
    <div className="grid grid-cols-3 gap-3 px-[var(--gutter,24px)] pt-2 pb-6">
      <BentoBox 
        title="Next Step" 
        value={nextActionValue} 
        icon={<Calendar className="w-8 h-8" />}
        delay={0.1}
        onClick={nextActionValue === "Plan a Step" ? onOpenSmartAdd : undefined}
      />
      <BentoBox 
        title="Smart Add" 
        value={transitStatus} 
        icon={<Sparkles className="w-8 h-8 text-primary" />}
        delay={0.2}
        subValue={points.length > 0 ? "AI OPTIMIZED" : "DETECTING"}
        onClick={onOpenSmartAdd}
      />
      <BentoBox 
        title="Countdown" 
        value={nextPoint ? format(new Date(nextPoint.startTime), 'HH:mm') : (activeTrip ? format(new Date(activeTrip.startDate), 'MMM dd') : "Ready")} 
        icon={<Navigation className="w-8 h-8" />}
        delay={0.3}
        subValue={statusSubValue}
      />
    </div>
  );
};
