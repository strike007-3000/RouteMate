'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Navigation, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';

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
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    onClick={onClick}
    className={cn(
      "glass-card p-4 rounded-3xl flex flex-col justify-between overflow-hidden relative group border border-white/5",
      onClick && "cursor-pointer active:scale-95",
      className
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all duration-500 scale-150">
      {icon}
    </div>
    <span className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">{title}</span>
    <div className="flex flex-col gap-1 mt-4">
      <span className={cn("text-xl font-black tracking-tighter text-white line-clamp-1", value === "Plan a Step" && "text-primary")}>{value}</span>
      <div className="flex items-center gap-1.5 mt-1">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest leading-none">
          {subValue || "Real-time Intelligence"}
        </span>
      </div>
    </div>
  </motion.div>
);

export const BentoGrid = ({ onOpenSmartAdd }: { onOpenSmartAdd: () => void }) => {
  const { activeTrip } = useTripStore();
  
  const points = useLiveQuery<ItineraryItem[]>(
    () => activeTrip?.id ? db.itineraryItems.where('tripId').equals(activeTrip.id).toArray() : Promise.resolve([] as ItineraryItem[]),
    [activeTrip?.id]
  ) || [];
  
  // Logic for Next Action
  const now = new Date();
  const nextPoint = points
    .filter(p => new Date(p.startTime) > now)
    .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime())[0];

  // Try to extract flight number or use title
  const flightRegex = /[A-Z]{2,3}\s?\d{3,4}/i;
  const flightMatch = nextPoint?.title.match(flightRegex);
  const nextActionValue = nextPoint ? (flightMatch ? flightMatch[0] : nextPoint.title) : "Plan a Step";
  
  // Logistics Status
  const transitStatus = points.length > 0 ? "Transit Optimized" : "Add a stop";
  const transitDetail = points.length > 0 ? "30m to destination" : "Real-time Intelligence";

  // Status Countdown
  let statusSubValue = "Real-time Intelligence";
  if (nextPoint) {
    const hours = Math.round((new Date(nextPoint.startTime).getTime() - now.getTime()) / 3600000);
    statusSubValue = hours > 0 ? `Next stop in ${hours}h` : "Arriving soon";
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-6 pt-4">
      <BentoBox 
        title="Next Action" 
        value={nextActionValue} 
        icon={<Calendar className="w-12 h-12" />}
        className="col-span-1 aspect-square"
        delay={0.1}
        onClick={nextActionValue === "Plan a Step" ? onOpenSmartAdd : undefined}
      />
      <BentoBox 
        title="Logistics" 
        value={transitStatus} 
        icon={<Sparkles className="w-12 h-12" />}
        className="col-span-1 aspect-square"
        delay={0.2}
        subValue={transitDetail}
      />
      <BentoBox 
        title="Itinerary Status" 
        value={`${points.length} Points Planned`} 
        icon={<Navigation className="w-12 h-12" />}
        className="col-span-2 aspect-[2/1] min-h-[120px]"
        delay={0.3}
        subValue={statusSubValue}
      />
    </div>
  );
};
