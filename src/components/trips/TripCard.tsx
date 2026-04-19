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
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => onSelect(trip.id!)}
      className="group relative w-full h-[280px] rounded-[2.5rem] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-700 cursor-pointer shadow-2xl shadow-black"
    >
      {/* Hero Background */}
      <div className="absolute inset-0 bg-zinc-900">
        {trip.coverImage ? (
          <img 
            src={trip.coverImage} 
            alt={trip.name} 
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 select-none"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-zinc-900 via-zinc-800 to-black animate-pulse" />
        )}
        {/* Multi-layer Overlay for readability */}
        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      </div>

      {/* Top Bar: Status */}
      <div className="absolute top-6 right-6">
        <div className={`px-3 py-1 rounded-full border text-[8px] font-black uppercase tracking-widest backdrop-blur-md shadow-lg ${statusColors[trip.status]}`}>
          {trip.status}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-1 transform group-hover:-translate-y-2 transition-transform duration-500">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-6 h-6 rounded-lg bg-primary/20 backdrop-blur-md flex items-center justify-center border border-primary/30">
               <MapPin className="w-3 h-3 text-primary" />
            </div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">{trip.destination}</span>
          </div>
          
          <h3 className="text-2xl font-black text-white tracking-tighter leading-none mb-2">
            {trip.name}
          </h3>
          
          <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-bold uppercase tracking-widest opacity-80">
            <Calendar className="w-3 h-3" />
            <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions bar (Visible on hover or mobile) */}
        <div className="mt-6 pt-6 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex items-center gap-2">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (confirm('Delete this trip?')) deleteTrip(trip.id!);
              }}
              className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center border border-red-500/20"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                duplicateTrip(trip.id!);
              }}
              className="w-10 h-10 rounded-2xl bg-white/5 text-white/50 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center border border-white/10"
            >
              <Copy className="w-4 h-4" />
            </button>
          </div>
          
          <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-black">
            <ArrowRight className="w-5 h-5" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
