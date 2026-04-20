'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Trash2, Copy, ArrowRight } from 'lucide-react';
import { Trip } from '@/lib/db';
import { useTripStore } from '@/stores/useTripStore';
import { cn } from '@/lib/utils';

interface TripCardProps {
  trip: Trip;
  onSelect: (id: number) => void;
}

export const TripCard = ({ trip, onSelect }: TripCardProps) => {
  const { deleteTrip, duplicateTrip } = useTripStore();
  const [imageUrl, setImageUrl] = useState(trip.coverImage || '');
  const [isDeleting, setIsDeleting] = useState(false);

  // Status tokens for vibrant UI
  const statusColors = {
    upcoming: 'bg-primary/20 text-primary border-primary/30',
    past: 'bg-zinc-800 text-zinc-400 border-zinc-700',
    draft: 'bg-amber-500/20 text-amber-500 border-amber-500/30'
  };

  // Update image if trip data changes (live query)
  React.useEffect(() => {
    if (trip.coverImage) setImageUrl(trip.coverImage);
  }, [trip.coverImage]);

  const handleImageError = () => {
    // If Unsplash fails to load, fallback to a reliable scenic asset
    setImageUrl('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000');
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      onClick={() => onSelect(trip.id!)}
      className={cn(
        "group relative w-full h-[280px] rounded-[24px] overflow-hidden border border-white/10 hover:border-primary/50 transition-all duration-700 cursor-pointer shadow-2xl shadow-black",
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
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-zinc-900 to-black animate-pulse" />
        )}
        {/* Multi-layer Overlay for readability */}
        <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-700" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
      </div>

      {/* Top Bar: Status */}
      <div className="absolute top-6 right-6">
        <div className={`px-4 py-1.5 rounded-full border text-[10px] font-bold uppercase tracking-[0.2em] backdrop-blur-md shadow-lg ${statusColors[trip.status]}`}>
          {trip.status}
        </div>
      </div>

      {/* Bottom Content Area */}
      <div className="absolute inset-0 p-8 flex flex-col justify-end">
        <div className="space-y-2 transform group-hover:-translate-y-2 transition-transform duration-500">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-8 h-8 rounded-[12px] bg-primary/20 backdrop-blur-lg flex items-center justify-center border border-primary/30 shadow-lg shadow-primary/20">
               <MapPin className="w-4 h-4 text-primary" />
            </div>
            <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em]">{trip.destination}</span>
          </div>
          
          <h3 className="text-3xl font-black text-white tracking-tighter leading-none mb-3 drop-shadow-2xl">
            {trip.name}
          </h3>
          
          <div className="flex items-center gap-3 text-[10px] text-zinc-300 font-bold uppercase tracking-[0.2em] drop-shadow-md">
            <Calendar className="w-4 h-4 text-primary" />
            <span>{new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions bar */}
        <div className="mt-8 pt-6 border-t border-white/10 flex items-center justify-between opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
          <div className="flex items-center gap-3">
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isDeleting) {
                  setIsDeleting(true);
                  setTimeout(() => setIsDeleting(false), 3000);
                } else {
                  deleteTrip(trip.id!);
                }
              }}
              className={cn(
                "h-12 rounded-[16px] transition-all flex items-center justify-center gap-2 border",
                isDeleting 
                  ? "bg-red-600 text-white border-red-500 px-6 shadow-lg shadow-red-500/20" 
                  : "bg-red-500/10 text-red-500 border-red-500/20 w-12 hover:bg-red-500 hover:text-white"
              )}
            >
              <Trash2 className={cn("w-5 h-5", isDeleting && "animate-pulse")} />
              {isDeleting && <span className="text-[10px] font-bold uppercase tracking-widest">Confirm removal?</span>}
            </button>
            <button 
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                duplicateTrip(trip.id!);
              }}
              className="w-12 h-12 rounded-[16px] bg-white/5 text-white/50 hover:bg-white/20 hover:text-white transition-all flex items-center justify-center border border-white/10 hover:shadow-lg"
            >
              <Copy className="w-5 h-5" />
            </button>
          </div>
          
          <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-xl shadow-primary/20">
            <ArrowRight className="w-6 h-6" />
          </div>
        </div>
      </div>
    </motion.div>
  );
};
