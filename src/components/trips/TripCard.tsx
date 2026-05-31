/* eslint-disable @next/next/no-img-element */
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar, MapPin, Trash2, Copy, ArrowRight, MoreHorizontal, X } from 'lucide-react';
import { Trip } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  onSelect: (id: number) => void;
}

export const TripCard = ({ trip, onSelect }: TripCardProps) => {
  const { deleteTrip, duplicateTrip } = useTripStore();
  const [hasError, setHasError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showMenu, setShowMenu] = useState(false);

  const formatDateSafe = (dateStr: string | undefined | null) => {
    if (!dateStr) return 'TBD';
    const d = new Date(dateStr);
    return isNaN(d.getTime()) ? 'TBD' : d.toLocaleDateString();
  };

  const imageUrl = hasError 
    ? 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000'
    : (trip.coverImage || '');

  // Status tokens for vibrant UI
  const statusColors = {
    upcoming: 'bg-primary/20 text-primary border-primary/30',
    past: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    draft: 'bg-amber-500/20 text-amber-500 border-amber-500/30'
  } as const;

  const handleImageError = () => {
    setHasError(true);
  };

  const toggleMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => onSelect(trip.id!)}
      className={cn(
        "group relative w-full h-[280px] rounded-[var(--radius-card,24px)] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-700 cursor-pointer shadow-2xl shadow-black",
        isDeleting && "opacity-50"
      )}
    >
      {/* Hero Background */}
      <div className="absolute inset-0 bg-zinc-900 overflow-hidden">
        {imageUrl ? (
          <img 
            src={imageUrl} 
            alt={trip.name} 
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2000ms] select-none scale-105"
            loading="lazy"
            style={{ viewTransitionName: `trip-image-${trip.id}` } as React.CSSProperties}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-zinc-900 to-black animate-pulse" />
        )}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Top Bar: Status & Menu button */}
      <div className="absolute top-6 left-6 right-6 flex items-center justify-between z-20">
        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-lg ${statusColors[trip.status]}`}>
          {trip.status}
        </div>
        
        <button 
          onClick={toggleMenu}
          className="w-10 h-10 rounded-2xl bg-black/40 backdrop-blur-xl border border-white/10 flex items-center justify-center text-white hover:bg-black/60 transition-all active:scale-95"
        >
          {showMenu ? <X className="w-5 h-5" /> : <MoreHorizontal className="w-5 h-5" />}
        </button>
      </div>

      {/* Popover Menu actions */}
      <AnimatePresence>
        {showMenu && (
          <motion.div 
            initial={{ opacity: 0, y: -10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.9 }}
            className="absolute top-16 right-6 w-48 bg-zinc-950/90 backdrop-blur-2xl border border-white/10 rounded-[24px] p-2 z-30 shadow-2xl"
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                duplicateTrip(trip.id!);
                setShowMenu(false);
              }}
              className="w-full px-5 py-3 rounded-2xl hover:bg-white/5 flex items-center gap-3 transition-colors"
            >
              <Copy className="w-4 h-4 text-zinc-400" />
              <span className="text-[10px] font-black uppercase tracking-widest text-white/80">Duplicate</span>
            </button>
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDeleting) {
                  setIsDeleting(true);
                  setTimeout(() => setIsDeleting(false), 3000);
                } else {
                  deleteTrip(trip.id!);
                  setShowMenu(false);
                }
              }}
              className={cn(
                "w-full px-5 py-3 rounded-2xl flex items-center gap-3 transition-all",
                isDeleting ? "bg-red-500 text-white" : "hover:bg-red-500/10 text-red-500"
              )}
            >
              <Trash2 className="w-4 h-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">
                {isDeleting ? 'Confirm?' : 'Delete'}
              </span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom Content Area */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-2 transform group-hover:-translate-y-2 transition-transform duration-500">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-[12px] bg-primary/20 backdrop-blur-lg flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
               <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{trip.destination}</span>
          </div>
          
          <h3 
            className="text-3xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-2xl"
            style={{ viewTransitionName: `trip-title-${trip.id}` } as React.CSSProperties}
          >
            {trip.name}
          </h3>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em] drop-shadow-md">
              <Calendar className="w-4 h-4 text-primary" />
              <span>{formatDateSafe(trip.startDate)} - {formatDateSafe(trip.endDate)}</span>
            </div>
            
            {/* Minimal Arrow on hover */}
            <div className="w-10 h-10 rounded-full bg-transparent border-2 border-primary flex items-center justify-center text-primary opacity-0 group-hover:opacity-100 transition-all duration-500 translate-x-4 group-hover:translate-x-0">
              <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
