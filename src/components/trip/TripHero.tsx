'use client';

import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { format, parseISO, differenceInDays, startOfDay, isToday, isBefore, isAfter } from 'date-fns';
import { Trip } from '@/lib/db';
import { Calendar, Euro, Clock, Compass, Sparkles, MapPin, PencilLine } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { EditTripModal } from '../trips/EditTripModal';

interface TripHeroProps {
  trip: Trip;
  mode: 'dashboard' | 'timeline';
  onAction?: () => void;
}

export const TripHero = ({ trip, mode, onAction }: TripHeroProps) => {
  const router = useRouter();
  const [isEditOpen, setIsEditOpen] = useState(false);
  
  const metadata = useMemo(() => {
    const start = parseISO(trip.startDate);
    const end = parseISO(trip.endDate);
    const now = startOfDay(new Date());
    const tripStart = startOfDay(start);
    const tripEnd = startOfDay(end);

    const totalDays = Math.max(1, differenceInDays(tripEnd, tripStart) + 1);
    const dailyBudget = 200;
    const estimatedCost = totalDays * dailyBudget;

    let countdown = "";
    if (isToday(tripStart)) {
      countdown = "STARTS TODAY";
    } else if (isBefore(now, tripStart)) {
      const remaining = differenceInDays(tripStart, now);
      countdown = `${remaining} ${remaining === 1 ? 'DAY' : 'DAYS'} REMAINING`;
    } else if (isAfter(now, tripEnd)) {
      countdown = "PAST TRIP";
    } else {
      countdown = "TRIP IN PROGRESS";
    }

    return {
      dateRange: `${format(start, 'd MMM').toUpperCase()} - ${format(end, 'd MMM').toUpperCase()}`,
      duration: `${totalDays} ${totalDays === 1 ? 'DAY' : 'DAYS'}`,
      cost: `€${estimatedCost.toLocaleString()} (EST. COST)`,
      countdown
    };
  }, [trip]);

  const handlePrimaryAction = () => {
    if (mode === 'dashboard') {
      router.push(`/trip/${trip.id}/timeline`);
    } else if (onAction) {
      onAction();
    }
  };

  return (
    <div className="relative w-full h-[40vh] min-h-[350px] max-h-[500px] overflow-hidden flex flex-col items-center justify-end pb-12 px-[var(--gutter,24px)] group/hero">
      {/* Immersive Full-Bleed Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/20 to-black/90 z-[1]" />
        {trip.coverImage ? (
          <img 
            src={trip.coverImage} 
            alt={trip.destination} 
            className="w-full h-full object-cover aspect-video transition-all duration-1000 group-hover/hero:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-zinc-900 to-black" />
        )}
      </div>

      {/* Content Layer */}
      <div className="relative z-10 w-full flex flex-col items-center text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col items-center w-full"
        >
          {/* Main Title (Clamp Logic) */}
          <h1 className="text-[clamp(1.5rem,8vw,3rem)] font-black text-white tracking-tighter mb-4 leading-none drop-shadow-2xl px-4">
            {trip.destination}
          </h1>

          {/* Metadata Grid */}
          <div className="flex flex-col gap-3 mb-8 items-center">
            <button 
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1.5 text-primary text-[10px] font-black uppercase tracking-[0.2em] hover:text-white transition-colors group/edit"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>{metadata.dateRange}</span>
              <PencilLine className="w-2.5 h-2.5 opacity-0 group-hover/edit:opacity-100 transition-opacity ml-0.5" />
            </button>
            
            <div className="flex items-center gap-4 text-zinc-400">
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{metadata.duration}</span>
              <div className="w-1 h-1 rounded-full bg-zinc-800" />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">{metadata.cost}</span>
            </div>

            <div className="mt-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20">
              <span className="text-primary text-[9px] font-black uppercase tracking-[0.3em]">{metadata.countdown}</span>
            </div>
          </div>

          <div className="w-full max-w-[280px]">
            <button 
              onClick={handlePrimaryAction}
              className="btn-primary w-full"
            >
               <Sparkles className="w-4 h-4" />
               <span>{mode === 'dashboard' ? 'View Full Timeline' : 'Smart Extraction'}</span>
            </button>
          </div>
        </motion.div>
      </div>

      <EditTripModal 
        isOpen={isEditOpen} 
        onClose={() => setIsEditOpen(false)} 
        trip={trip} 
      />
    </div>
  );
};
