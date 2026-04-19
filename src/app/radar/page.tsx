'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Radar, Navigation, MapPin, Compass, Loader2, AlertCircle } from 'lucide-react';
import { useGeolocation } from '@/components/layout/GeolocationProvider';
import { useTripStore } from '@/stores/useTripStore';
import { BottomNav } from '@/components/layout/BottomNav';

const globalHubs = [
  {
    name: 'London St Pancras',
    location: 'London, UK',
    type: 'International Rail',
    image: 'https://images.unsplash.com/photo-1549410940-0259b13ca671?q=80&w=1000&auto=format&fit=crop',
    details: 'Eurostar terminal. Strategic hub for European transit.'
  },
  {
    name: 'Grand Central NYC',
    location: 'New York, USA',
    type: 'Historic Terminal',
    image: 'https://images.unsplash.com/photo-1517457373958-b7bdd4587205?q=80&w=1000&auto=format&fit=crop',
    details: 'The beating heart of Manhattan. World-renowned architecture.'
  },
  {
    name: 'Tokyo Station',
    location: 'Tokyo, Japan',
    type: 'Shinkansen Hub',
    image: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?q=80&w=1000&auto=format&fit=crop',
    details: 'The ultimate interchange for the worlds fastest trains.'
  }
];

export default function RadarPage() {
  const { coords, permission, loading, error } = useGeolocation();
  const { activeTrip } = useTripStore();

  const isPermissionDenied = permission === 'denied';
  const displayHubs = isPermissionDenied ? globalHubs : []; // In a real app we would fetch nearby

  return (
    <main className="min-h-screen bg-background pb-32 max-w-md mx-auto border-x border-border/50 shadow-2xl relative overflow-x-hidden">
      <header className="p-8 pb-10 pt-16 relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Radar className="w-60 h-60 animate-pulse text-primary" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-4 block">Transit Radar</span>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-3">Radar</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed">
            Scanning for nearby logistics & transit hubs.
          </p>
        </motion.div>
      </header>

      <section className="px-6 relative min-h-[400px]">
        {loading && !isPermissionDenied && (
          <div className="flex flex-col items-center justify-center pt-20">
            <div className="relative w-40 h-40">
              <div className="absolute inset-0 rounded-full border-2 border-primary/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border-2 border-primary/40 animate-ping [animation-delay:0.2s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-10 h-10 text-primary animate-spin" />
              </div>
            </div>
            <p className="mt-8 text-[10px] font-black text-zinc-500 uppercase tracking-widest animate-pulse">
              Syncing Satellite Coords...
            </p>
          </div>
        )}

        {isPermissionDenied && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            <div className="flex items-center gap-3 p-4 rounded-3xl bg-amber-500/10 border border-amber-500/20 mb-10">
              <AlertCircle className="w-5 h-5 text-amber-500" />
              <div>
                <p className="text-[10px] font-black text-white uppercase tracking-tight">Geo-Sync Restricted</p>
                <p className="text-[9px] text-amber-500/70 font-bold uppercase tracking-tight">Showing Global Strategic Hubs</p>
              </div>
            </div>

            {globalHubs.map((hub, i) => (
              <motion.div
                key={hub.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group p-5 rounded-[2rem] bg-zinc-900/50 border border-white/5 hover:border-primary/30 transition-all duration-500"
              >
                <div className="flex gap-4">
                  <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-white/10">
                    <img src={hub.image} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[8px] font-black text-primary uppercase tracking-widest bg-primary/10 px-2 py-0.5 rounded-full">
                        {hub.type}
                      </span>
                      <Navigation className="w-3.5 h-3.5 text-zinc-600 group-hover:text-primary transition-colors" />
                    </div>
                    <h3 className="text-sm font-black text-white mt-1">{hub.name}</h3>
                    <div className="flex items-center gap-1 text-[9px] text-zinc-500 font-bold uppercase mt-1">
                      <MapPin className="w-3 h-3" />
                      {hub.location}
                    </div>
                  </div>
                </div>
                <p className="mt-4 text-[10px] text-zinc-500 leading-relaxed font-medium">
                  {hub.details}
                </p>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && !isPermissionDenied && coords && (
           <div className="flex flex-col items-center justify-center pt-20 text-center">
             <div className="w-20 h-20 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6">
                <Compass className="w-10 h-10 text-primary" />
             </div>
             <h3 className="text-xl font-black text-white mb-2">Geolocation Active</h3>
             <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-10">
               Lat: {coords.latitude.toFixed(4)} | Lng: {coords.longitude.toFixed(4)}
             </p>
             
             <div className="w-full space-y-4">
                <p className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">Nearby Stops</p>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-left flex items-center justify-between">
                   <div>
                     <p className="text-xs font-black text-white">Local Transit Point A</p>
                     <p className="text-[9px] text-zinc-500 font-bold uppercase">250m • Walking</p>
                   </div>
                   <Navigation className="w-4 h-4 text-primary" />
                </div>
                <div className="p-4 rounded-2xl bg-zinc-900/50 border border-white/5 text-left flex items-center justify-between">
                   <div>
                     <p className="text-xs font-black text-white">Local Transit Point B</p>
                     <p className="text-[9px] text-zinc-500 font-bold uppercase">600m • Bus</p>
                   </div>
                   <Navigation className="w-4 h-4 text-primary" />
                </div>
             </div>
           </div>
        )}
      </section>

      <BottomNav />
    </main>
  );
}
