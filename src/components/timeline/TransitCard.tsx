'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { Bus, Train, Footprints, ArrowRight, Loader2, Sparkles, Navigation } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { TripPoint } from '@/stores/useTripStore';
import { TransitSuggestion } from '@/services/transit/types';
import { useTripStore } from '@/stores/useTripStore';

interface TransitCardProps {
  from: TripPoint;
  to: TripPoint;
}

export const TransitCard = ({ from, to }: TransitCardProps) => {
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

  const isInterCity = useMemo(() => distance !== null && distance >= 50, [distance]);
  const isOceanCrossing = useMemo(() => distance !== null && distance > 2000, [distance]);

  const [suggestion, setSuggestion] = useState<TransitSuggestion | null>(null);
  const [loading, setLoading] = useState(!isOceanCrossing);

  // Hub Handoff Detection
  const isRoutingToFlight = to.category === 'Flight';
  const isRoutingFromFlight = from.category === 'Flight';

  useEffect(() => {
    if (isOceanCrossing) {
      return;
    }

    const fetchTransit = async () => {
      setLoading(true);
      try {
        // Prepare precise locations for API
        const getHubCoords = (p: TripPoint, type: 'departure' | 'arrival') => {
          const meta = p.metadata;
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
    <div className="relative pl-[var(--gutter,24px)] pb-8 last:pb-0">
      {/* Continuous Journey Thread */}
      <div className="absolute left-[calc(var(--gutter,24px)/2)] top-0 bottom-0 w-[1px] bg-primary/20 border-l border-dashed z-0" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="bg-zinc-900/30 border border-white/5 p-4 rounded-[var(--radius-card,24px)] relative overflow-hidden group min-h-[120px] z-10"
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
                        const meta = item.metadata;
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
                      let destination = getPreciseLocation(to, 'departure');
                      
                      // Smart Airport Fallback: If we are routing to a flight but the AI didn't extract the departure airport,
                      // the 'address' field usually represents the final destination (e.g., 'Brussels').
                      // Instead of routing to Brussels, we should route to the airport in our current city!
                      if (to.category === 'Flight') {
                        const meta = to.metadata;
                        if (!meta?.departureAirport && !meta?.departureCity) {
                          destination = `${from.address} Airport`;
                        }
                      }

                      const mode = isInterCity ? 'driving' : 'transit';
                      
                      const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destination)}&travelmode=${mode}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    className="btn-primary w-full h-14"
                  >
                    <Navigation className="w-4 h-4" />
                    <span>
                      {isRoutingToFlight ? 'Navigate to Airport' : isRoutingFromFlight ? 'Open Google Maps' : isInterCity ? 'Open Driving Directions' : 'Open Google Maps'}
                    </span>
                  </button>
                )}
                
                {!suggestion.externalUrl && (
                  <button className="btn-primary w-full h-14">
                    <span>Save to Itinerary</span>
                    <ArrowRight className="w-4 h-4 scale-75" />
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
