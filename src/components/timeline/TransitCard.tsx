'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bus, Train, Footprints, ArrowRight, Loader2, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripPoint } from '@/stores/useTripStore';
import { TransitSuggestion } from '@/services/transit/types';

interface TransitCardProps {
  from: TripPoint;
  to: TripPoint;
}

export const TransitCard = ({ from, to }: TransitCardProps) => {
  const [suggestion, setSuggestion] = useState<TransitSuggestion | null>(null);
  const [loading, setLoading] = useState(true);

  // Haversine Distance Logic
  const distance = useMemo(() => {
    if (!from.coordinates || !to.coordinates) return null;
    const R = 6371; // km
    const dLat = (to.coordinates.lat - from.coordinates.lat) * Math.PI / 180;
    const dLon = (to.coordinates.lng - from.coordinates.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(from.coordinates.lat * Math.PI / 180) * Math.cos(to.coordinates.lat * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }, [from.coordinates, to.coordinates]);

  const isInterCity = distance !== null && distance >= 50;

  useEffect(() => {
    const fetchTransit = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/transit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from, to }),
        });
        const data = await response.json();
        if (data.suggestion) {
          setSuggestion(data.suggestion);
        }
      } catch (err) {
        console.error('Transit fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTransit();
  }, [from, to]);

  const Icon = suggestion?.mode === 'train' || suggestion?.mode === 'subway' ? Train : suggestion?.mode === 'walk' ? Footprints : Bus;

  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 w-10 h-full flex flex-col items-center">
        <div className="w-0.5 flex-1 bg-primary/20 border-l-2 border-dashed border-primary" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-primary/5 border border-primary/20 border-dashed p-4 rounded-3xl relative overflow-hidden group min-h-[140px]"
      >
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-6 gap-3"
            >
              <Loader2 className="w-6 h-6 text-primary animate-spin" />
              <span className="text-[10px] font-bold text-primary uppercase tracking-tighter animate-pulse">Calculating Best Route...</span>
            </motion.div>
          ) : suggestion ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-primary uppercase tracking-tighter">
                      {isInterCity ? 'Inter-city Connection' : 'Cheap Route Suggested'}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {isInterCity ? `${Math.round(distance || 0)}km distance` : 'Logistics detected'}
                    </p>
                  </div>
                </div>
                <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
                   <span className="text-[10px] font-bold text-emerald-500">{suggestion.cost}</span>
                </div>
              </div>
              
              <div className="flex items-center gap-4 py-2">
                <div className="flex flex-col items-center gap-1 opacity-40">
                   <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                   <div className="w-0.5 h-4 bg-muted" />
                   <div className="w-1.5 h-1.5 rounded-full bg-muted" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-primary" />
                      <span className="text-sm font-bold">{suggestion.provider}</span>
                    </div>
                    <span className="text-xs font-bold text-muted-foreground">{suggestion.duration}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-tight italic">"{suggestion.description}"</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                {suggestion.externalUrl && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // Address Cleaning Logic
                      const cleanAddress = (addr: string) => {
                        if (!addr) return '';
                        // Remove " to ...", " from ...", and terminal descriptors if they follow a "to"
                        return addr.split(/\s(to|from)\s/i)[0].trim();
                      };

                      const origin = cleanAddress(from.address) || "My+Location";
                      const destination = cleanAddress(to.address);
                      const mode = isInterCity ? 'driving' : 'transit';
                      
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full py-4 rounded-2xl bg-[#4285F4] text-white text-[10px] font-black hover:bg-[#357ABD] transition-all flex items-center justify-center gap-3 uppercase tracking-widest shadow-lg shadow-[#4285F4]/20 group/btn"
                  >
                    <Navigation className="w-4 h-4 fill-white animate-pulse" />
                    {isInterCity ? 'Open Driving Directions' : 'Open Google Maps Transit'}
                    <div className="w-3 h-3 rounded-full bg-white/20 flex items-center justify-center">
                      <ArrowRight className="w-2 h-2 group-hover/btn:translate-x-0.5 transition-transform" />
                    </div>
                  </button>
                )}
                
                {!suggestion.externalUrl && (
                  <button className="w-full py-3 rounded-2xl bg-zinc-900 border border-white/5 text-white text-[10px] font-black hover:bg-zinc-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest group/btn">
                    Save to Itinerary
                    <ArrowRight className="w-3 h-3 group-hover/btn:translate-x-1 transition-transform" />
                  </button>
                )}
              </div>


            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};
