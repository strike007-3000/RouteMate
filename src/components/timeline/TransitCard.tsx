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
  const isOceanCrossing = distance !== null && distance > 500;

  // Hub Handoff Detection
  const isRoutingToFlight = to.category === 'Flight';
  const isRoutingFromFlight = from.category === 'Flight';

  useEffect(() => {
    if (isOceanCrossing) {
      setLoading(false);
      return;
    }

    const fetchTransit = async () => {
      setLoading(true);
      try {
        // Prepare precise locations for API
        const getHubCoords = (p: TripPoint, type: 'departure' | 'arrival') => {
          const meta = p.metadata as any;
          if (type === 'departure') return meta?.departureCoords;
          return meta?.arrivalCoords;
        };

        const finalFrom = isRoutingFromFlight ? { ...from, coordinates: getHubCoords(from, 'arrival') || from.coordinates } : from;
        const finalTo = isRoutingToFlight ? { ...to, coordinates: getHubCoords(to, 'departure') || to.coordinates } : to;

        const response = await fetch('/api/transit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ from: finalFrom, to: finalTo }),
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
  }, [from, to, isRoutingFromFlight, isRoutingToFlight, isOceanCrossing]);

  if (isOceanCrossing) return null;

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
                      {isRoutingToFlight ? 'Route to Airport' : isRoutingFromFlight ? 'Route to Hotel/City' : isInterCity ? 'Inter-city Connection' : 'Cheap Route Suggested'}
                    </span>
                    <p className="text-[10px] text-muted-foreground font-medium">
                      {isRoutingToFlight || isRoutingFromFlight ? 'Implicit Hub detected' : isInterCity ? `${Math.round(distance || 0)}km distance` : 'Logistics detected'}
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
                  <p className="text-[10px] text-muted-foreground leading-tight italic">&quot;{suggestion.description}&quot;</p>
                </div>
              </div>
              
              <div className="flex flex-col gap-2 mt-4">
                {suggestion.externalUrl && (
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      
                      // True Hub Routing Logic
                      const getPreciseLocation = (item: TripPoint, hubType: 'departure' | 'arrival'): string => {
                        const meta = item.metadata as any;
                        if (item.category === 'Flight') {
                           // If we are looking for the ARRIVAL hub (transit AFTER flight)
                           if (hubType === 'arrival') {
                             return (meta?.arrivalAirport as string) || item.address;
                           }
                           // If we are looking for the DEPARTURE hub (transit BEFORE flight)
                           return (meta?.departureAirport as string) || item.address;
                        }
                        
                        // For Lodging, Food, and Activities: Combine Place Name + City
                        // Strip common prefixes for a cleaner search
                        const cleanTitle = item.title.replace(/Check-in at |Check-out from |Stay at |Visit |Dinner at |Flight to |Returning to /g, '');
                        if (item.address.toLowerCase().includes(cleanTitle.toLowerCase())) {
                            return item.address;
                        }
                        return `${cleanTitle}, ${item.address}`;
                      };

                      const origin = getPreciseLocation(from, 'arrival');
                      const destination = getPreciseLocation(to, 'departure');
                      const mode = isInterCity ? 'driving' : 'transit';
                      
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="w-full py-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 text-blue-500 text-[10px] font-bold hover:bg-blue-500/20 transition-all flex items-center justify-center gap-3 uppercase tracking-[0.2em] group/btn"
                  >
                    <Navigation className="w-4 h-4 fill-blue-500 animate-pulse" />
                    {isRoutingToFlight ? 'Navigate to Airport' : isRoutingFromFlight ? 'Open Google Maps' : isInterCity ? 'Open Driving Directions' : 'Open Google Maps'}
                    <div className="w-4 h-4 rounded-full bg-blue-500/20 flex items-center justify-center">
                      <ArrowRight className="w-2.5 h-2.5 group-hover/btn:translate-x-0.5 transition-transform" />
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
