'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Navigation, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';
import { format } from 'date-fns';

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
      "glass-card p-3 rounded-2xl flex flex-col justify-center overflow-hidden relative group border border-white/5 min-w-[120px]",
      onClick && "cursor-pointer active:scale-95",
      className
    )}
  >
    <div className="absolute top-2 right-2 opacity-5 group-hover:opacity-10 transition-all duration-500">
      {icon}
    </div>
    <span className="text-[8px] font-black text-primary/50 uppercase tracking-[0.2em] mb-1">{title}</span>
    <span className={cn("text-sm font-black tracking-tighter text-white line-clamp-1", value === "Plan a Step" && "text-primary")}>{value}</span>
    <div className="flex items-center gap-1 mt-1">
      <div className="w-0.5 h-0.5 rounded-full bg-primary" />
      <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
        {subValue || "Intelligence Active"}
      </span>
    </div>
  </motion.div>
);

export const BentoGrid = ({ onOpenSmartAdd }: { onOpenSmartAdd: () => void }) => {
  const { activeTrip } = useTripStore();
  
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
      } catch (e) {
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
    <div className="flex gap-3 p-6 pt-2 overflow-x-auto no-scrollbar pb-2">
      <BentoBox 
        title="Next Step" 
        value={nextActionValue} 
        icon={<Calendar className="w-8 h-8" />}
        className="flex-1 min-w-[130px]"
        delay={0.1}
        onClick={nextActionValue === "Plan a Step" ? onOpenSmartAdd : undefined}
      />
      <BentoBox 
        title="Logistics" 
        value={transitStatus} 
        icon={<Sparkles className="w-8 h-8" />}
        className="flex-1 min-w-[110px]"
        delay={0.2}
        subValue={points.length > 0 ? `${points.length} stops` : "Detecting"}
      />
      <BentoBox 
        title="Countdown" 
        value={nextPoint ? format(new Date(nextPoint.startTime), 'HH:mm') : "??:??"} 
        icon={<Navigation className="w-8 h-8" />}
        className="flex-1 min-w-[110px]"
        delay={0.3}
        subValue={statusSubValue}
      />
    </div>
  );
};
