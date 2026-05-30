'use client';

import React from 'react';
import { Plane, Hotel, MapPin, Clock, Utensils, Train, Car, GripVertical, ArrowDownToLine, ArrowUpFromLine, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { ItineraryItem } from '@/lib/db';
import { cn } from '@/lib/utils';
import { useTripStore } from '@/stores/useTripStore';
import { FlightStatusWidget } from './FlightStatusWidget';
import { EditItemModal } from './EditItemModal';

import { LucideIcon, Edit2 } from 'lucide-react';

interface CategoryStyle {
  icon: LucideIcon;
  color: string;
  glow: string;
  border: string;
  bg: string;
}

const categoryConfig: Record<string, CategoryStyle> = {
  Flight: { icon: Plane, color: 'text-blue-400', glow: 'shadow-blue-500/10', border: 'border-blue-500/20', bg: 'bg-blue-500/10' },
  Lodging: { icon: Hotel, color: 'text-emerald-400', glow: 'shadow-emerald-500/10', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  Hotel: { icon: Hotel, color: 'text-emerald-400', glow: 'shadow-emerald-500/10', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  Stay: { icon: Hotel, color: 'text-emerald-400', glow: 'shadow-emerald-500/10', border: 'border-emerald-500/20', bg: 'bg-emerald-500/10' },
  Food: { icon: Utensils, color: 'text-amber-400', glow: 'shadow-amber-500/10', border: 'border-emerald-500/20', bg: 'bg-amber-500/10' },
  Activity: { icon: MapPin, color: 'text-purple-400', glow: 'shadow-purple-500/10', border: 'border-purple-500/20', bg: 'bg-purple-500/10' },
  Train: { icon: Train, color: 'text-orange-400', glow: 'shadow-orange-500/10', border: 'border-orange-500/20', bg: 'bg-orange-500/10' },
  Rental: { icon: Car, color: 'text-cyan-400', glow: 'shadow-cyan-500/10', border: 'border-cyan-500/20', bg: 'bg-cyan-500/10' },
};

import { DragControls } from 'framer-motion';

export const TimelineItem = ({ point, prevPoint, dragControls }: { point: ItineraryItem, prevPoint?: ItineraryItem, dragControls?: DragControls }) => {
  const [isEditingTime, setIsEditingTime] = React.useState(false);
  const updatePointTime = useTripStore((state) => state.updatePointTime);
  const removePoint = useTripStore((state) => state.removePoint);

  const [isDeleting, setIsDeleting] = React.useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = React.useState(false);

  const categoryKey = point.category as keyof typeof categoryConfig;
  const config = categoryConfig[categoryKey] || categoryConfig.Activity;
  
  // Smart Title Extraction (Entity-First / Verb Strip)
  const cleanTitle = point.title
    .replace(/^(Departure from |Arrival at |Check-in at |Check-out from |Stay at |Visit |Dinner at |Lunch at |Breakfast at |Flight from |Flight to |Travel to |Explore )/i, '')
    .replace(/^(at |from |to |in )/i, '') // Recursive strip for nested prepositions
    .trim();

  // Helper for Precision Search logic (the "one from the repo")
  const getPreciseLocation = (item: ItineraryItem, type: 'departure' | 'arrival'): string => {
    const meta = item.metadata;
    if (item.category === 'Flight') {
      return type === 'arrival' 
        ? ((meta?.arrivalAirport as string) || (meta?.arrivalCity as string) || item.address)
        : ((meta?.departureAirport as string) || (meta?.departureCity as string) || item.address);
    }
    const cleanName = item.title.replace(/Check-in at |Check-out from |Stay at |Visit |Dinner at /g, '');
    return `${cleanName}, ${item.address}`;
  };

  // Lodging Life-cycle Icons
  let Icon = config.icon;
  if (point.category === 'Lodging') {
    if (point.title.toLowerCase().includes('check-in')) Icon = ArrowDownToLine;
    else if (point.title.toLowerCase().includes('check-out')) Icon = ArrowUpFromLine;
  }

  const handleTimeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = e.target.value; // "HH:mm"
    if (!newTime || !point.id) {
      setIsEditingTime(false);
      return;
    }
    
    // Preserve the original date string (YYYY-MM-DD) to prevent timezone date shifting
    const dateStr = point.startTime.split('T')[0];
    const newStartTime = `${dateStr}T${newTime}:00Z`;
    
    await updatePointTime(point.id, newStartTime);
    setIsEditingTime(false);
  };
  
  // Extract "HH:mm" safely regardless of local timezone
  const displayTime = point.startTime?.includes('T') ? point.startTime.slice(11, 16) : '00:00';

  return (
    <div className="relative pb-8 last:pb-0 pl-[var(--gutter,24px)] overflow-hidden">
      <div className="absolute left-[calc(var(--gutter,24px)/2)] top-0 bottom-0 w-[1px] bg-primary/20 border-l border-dashed z-0" />
      <div className="absolute left-0 top-0 w-[var(--gutter,24px)] h-full flex justify-center pt-3 z-10">
        <div className={cn("timeline-dot", config.color.replace('text-', 'bg-'), config.color)} />
      </div>

      {/* Swipe Action Background revealed behind the card */}
      <div className="absolute inset-y-0 right-0 left-[var(--gutter,24px)] mb-8 rounded-[var(--radius-card,24px)] overflow-hidden z-0 bg-zinc-950 flex justify-end">
        <button
          onClick={(e) => {
            e.stopPropagation();
            if (point.id) removePoint(point.id);
          }}
          className="h-full w-28 bg-red-600 hover:bg-red-700 flex flex-col items-center justify-center gap-1.5 text-white transition-colors cursor-pointer"
        >
          <Trash2 className="w-5 h-5 text-white animate-pulse" />
          <span className="text-[8px] font-black uppercase tracking-widest text-center text-white">Confirm?</span>
        </button>
      </div>
      
      <motion.div 
        layout
        drag="x"
        dragDirectionLock
        dragConstraints={{ left: -112, right: 0 }}
        dragElastic={{ left: 0.15, right: 0.05 }}
        animate={{ 
          x: isDeleting ? -112 : 0,
          opacity: 1, 
          scale: 1 
        }}
        onDragEnd={(event, info) => {
          if (info.offset.x < -40) {
            setIsDeleting(true);
            setTimeout(() => setIsDeleting(false), 3000);
          } else if (info.offset.x > 40) {
            setIsDeleting(false);
          }
        }}
        initial={{ opacity: 0, scale: 0.98 }}
        transition={{ 
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        whileHover={{ scale: 1.01, y: -2 }}
        className={cn(
          "p-6 bg-zinc-900/50 border border-white/5 backdrop-blur-xl transition-all duration-300 shadow-2xl shadow-black/50 overflow-hidden relative z-10",
          "rounded-[var(--radius-card,24px)]",
          config.glow
        )}
      >
        <div className="flex items-start justify-between mb-6">
          <div className={cn("flex items-center gap-2.5 px-3 py-1.5 rounded-full border border-white/10", config.bg)}>
            <Icon className={cn("w-3.5 h-3.5", config.color)} />
            <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em]", config.color)}>
              {point.category}
              {point.category === 'Flight' && !!point.metadata?.flightNumber && (
                <span className="opacity-60 ml-1.5 border-l border-white/20 pl-1.5">
                  {point.metadata.flightNumber as string}
                </span>
              )}
            </span>
          </div>
          <div className="flex items-center gap-2 text-zinc-500 whitespace-nowrap">
            <Clock className="w-3.5 h-3.5" />
            {isEditingTime ? (
              <input 
                type="time" 
                className="bg-zinc-800/50 border border-white/10 rounded px-2 py-0.5 text-white text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-primary w-[75px]"
                defaultValue={displayTime}
                onChange={handleTimeChange}
                onBlur={() => setIsEditingTime(false)}
                autoFocus
              />
            ) : (
              <button 
                onClick={() => setIsEditingTime(true)}
                className="text-[10px] font-bold tracking-[0.2em] uppercase hover:text-primary transition-colors text-left"
              >
                {point.isTimeExplicit === false ? 'Time TBD' : displayTime}
              </button>
            )}
          </div>
        </div>
        
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-black text-white tracking-tighter leading-tight truncate pr-4">
                {cleanTitle}
              </h3>
              <div className="flex items-center gap-2">
                {point.category === 'Flight' && (point.metadata?.arrivalAirport as string) && (
                  <div className="px-2 py-1 rounded-lg bg-blue-500/20 border border-blue-500/30 flex-shrink-0">
                    <span className="text-[10px] font-black text-blue-400">
                      {(point.metadata?.arrivalAirport as string).match(/\b[A-Z]{3}\b/)?.[0] || 'APT'}
                    </span>
                  </div>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsEditModalOpen(true);
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary transition-all active:scale-90 mr-1.5"
                >
                  <Edit2 className="w-3.5 h-3.5" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    const destination = getPreciseLocation(point, 'departure');
                    let url = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(destination)}`;
                    
                    if (prevPoint) {
                      const origin = getPreciseLocation(prevPoint, 'arrival');
                      url += `&origin=${encodeURIComponent(origin)}`;
                    }
 
                    window.open(url, '_blank');
                  }}
                  className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-500 hover:text-primary transition-all active:scale-90"
                >
                  <MapPin className="w-4 h-4" />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (!isDeleting) {
                      setIsDeleting(true);
                      setTimeout(() => setIsDeleting(false), 3000);
                    } else {
                      if (point.id) removePoint(point.id);
                    }
                  }}
                  className={cn(
                    "h-8 rounded-full border flex items-center justify-center transition-all active:scale-90",
                    isDeleting 
                      ? "px-3 bg-red-500 border-red-400 text-white gap-2" 
                      : "w-8 bg-white/5 border-white/10 text-zinc-500 hover:text-red-400"
                  )}
                >
                  <Trash2 className="w-4 h-4" />
                  {isDeleting && <span className="text-[10px] font-black uppercase tracking-widest">Confirm?</span>}
                </button>
              </div>
            </div>
            <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest truncate">
              {(point.metadata?.fullAddress as string) || point.address}
            </p>
            {point.category === 'Flight' && (
              <FlightStatusWidget 
                pointId={point.id!}
                flightNumber={point.metadata?.flightNumber as string} 
                startTime={point.startTime} 
                departureAirport={point.metadata?.departureAirport as string}
                arrivalAirport={point.metadata?.arrivalAirport as string}
              />
            )}
          </div>
          
          <div 
            className="pt-1 text-zinc-700 hover:text-zinc-500 transition-colors cursor-grab active:cursor-grabbing touch-none flex-shrink-0"
            onPointerDown={(e) => dragControls?.start(e)}
          >
            <GripVertical className="w-5 h-5" />
          </div>
        </div>
      </motion.div>
      <EditItemModal 
        key={point.id}
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        item={point} 
      />
    </div>
  );
};
