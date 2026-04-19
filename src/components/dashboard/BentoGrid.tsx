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
}

const BentoBox = ({ title, value, icon, className, delay = 0 }: BentoBoxProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    whileHover={{ y: -5 }}
    className={cn(
      "glass-card p-4 rounded-3xl flex flex-col justify-between overflow-hidden relative group border border-white/5",
      className
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all duration-500 scale-150">
      {icon}
    </div>
    <span className="text-[10px] font-black text-primary/50 uppercase tracking-[0.2em]">{title}</span>
    <div className="flex flex-col gap-1 mt-4">
      <span className="text-xl font-black tracking-tighter text-white line-clamp-1">{value}</span>
      <div className="flex items-center gap-1.5 mt-1">
        <div className="w-1 h-1 rounded-full bg-primary animate-pulse" />
        <span className="text-[9px] text-muted-foreground font-bold uppercase tracking-widest">Real-time Intelligence</span>
      </div>
    </div>
  </motion.div>
);

export const BentoGrid = () => {
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

  const nextAction = nextPoint ? nextPoint.title : "No stops added";
  const stopsCount = points.length;
  const transitStatus = points.length > 0 ? "Logistics Ready" : "Add a stop";

  return (
    <div className="grid grid-cols-2 gap-4 p-6 pt-4">
      <BentoBox 
        title="Next Action" 
        value={nextAction} 
        icon={<Calendar className="w-12 h-12" />}
        className="col-span-1 aspect-square"
        delay={0.1}
      />
      <BentoBox 
        title="Logistics" 
        value={transitStatus} 
        icon={<Sparkles className="w-12 h-12" />}
        className="col-span-1 aspect-square"
        delay={0.2}
      />
      <BentoBox 
        title="Itinerary Status" 
        value={`${stopsCount} Points Planned`} 
        icon={<Navigation className="w-12 h-12" />}
        className="col-span-2 aspect-[2/1] min-h-[120px]"
        delay={0.3}
      />
    </div>
  );
};
