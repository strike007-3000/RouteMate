'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trash2, Copy, ArrowRight } from 'lucide-react';
import { Trip } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';

interface TripCardProps {
  trip: Trip;
  onSelect: (id: number) => void;
}

export const TripCard = ({ trip, onSelect }: TripCardProps) => {
  const { deleteTrip, duplicateTrip } = useTripStore();


  const statusColors = {
    upcoming: 'bg-primary/20 text-primary border-primary/30',
    past: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    draft: 'bg-amber-500/20 text-amber-500 border-amber-500/30'
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative bg-zinc-900/50 border border-white/5 rounded-3xl overflow-hidden hover:border-primary/30 transition-all duration-500"
    >
      {/* Cover Image with Glass Overlay */}
      <div className="h-32 relative overflow-hidden">
        {trip.coverImage ? (
          <img 
            src={trip.coverImage} 
            alt={trip.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center">
            <MapPin className="w-8 h-8 text-white/10" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900 via-zinc-900/40 to-transparent" />
        
        {/* Status Badge */}
        <div className={`absolute top-4 right-4 px-2 py-0.5 rounded-full border text-[8px] font-black uppercase tracking-widest ${statusColors[trip.status]}`}>
          {trip.status}
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-sm font-black text-white group-hover:text-primary transition-colors decoration-slice line-clamp-1">
          {trip.name}
        </h3>
        
        <div className="mt-3 space-y-2">
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
            <MapPin className="w-3 h-3 text-primary" />
            {trip.destination}
          </div>
          <div className="flex items-center gap-2 text-[10px] text-zinc-400 font-bold uppercase tracking-tight">
            <Calendar className="w-3 h-3 text-primary" />
            {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-1">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                if (confirm('Delete this trip and all its items?')) {
                  deleteTrip(trip.id!);
                }
              }}
              className="p-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                duplicateTrip(trip.id!);
              }}
              className="p-2 rounded-xl bg-white/5 text-white/50 hover:bg-white/10 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
            </button>

          </div>
          
          <button 
            onClick={() => onSelect(trip.id!)}
            className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-primary text-black text-[10px] font-black uppercase tracking-widest hover:scale-105 transition-transform active:scale-95"
          >
            Open Trip
            <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};
