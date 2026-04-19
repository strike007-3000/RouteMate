'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Globe, Plane, Navigation } from 'lucide-react';
import { useTripStore } from '@/stores/useTripStore';
import { TripCard } from '@/components/trips/TripCard';
import { useRouter } from 'next/navigation';

import { BottomNav } from '@/components/layout/BottomNav';
import { NewTripModal } from '@/components/trips/NewTripModal';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export default function Dashboard() {
  const { createTrip } = useTripStore();
  const router = useRouter();
  const [isModalOpen, setIsModalOpen] = React.useState(false);

  const trips = useLiveQuery(() => db.trips.toArray(), []) || [];

  const upcomingTrips = trips.filter(t => t.status === 'upcoming');
  const pastTrips = trips.filter(t => t.status === 'past');
  const draftTrips = trips.filter(t => t.status === 'draft');

  const handleCreateNew = async (data: { destination: string, startDate: string, endDate: string }) => {
    const id = await createTrip({
      name: `Trip to ${data.destination}`,
      destination: data.destination,
      startDate: data.startDate,
      endDate: data.endDate,
      status: 'upcoming'
    });
    setIsModalOpen(false);
    router.push(`/trip/${id}`);
  };

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-md mx-auto border-x border-border/50 shadow-2xl shadow-black/50 overflow-x-hidden relative flex flex-col">
      {/* Premium Header */}
      <header className="px-6 pb-10 pt-16 relative">
        <div className="absolute top-0 right-0 p-8 opacity-5 pointer-events-none">
          <Globe className="w-60 h-60 rotate-12" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative z-10"
        >
          <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] mb-4 block">ROUTEMATE</span>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-none mb-3">My Trips</h1>
          <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest leading-relaxed max-w-[200px]">
            Plan smarter, travel cheap. Pocket Intelligence active.
          </p>
        </motion.div>

        <button 
          onClick={() => setIsModalOpen(true)}
          className="mt-10 group relative w-full h-14 bg-primary rounded-2xl flex items-center justify-center gap-3 overflow-hidden active:scale-95 transition-transform shadow-lg shadow-primary/20"
        >
          <div className="absolute inset-0 bg-white/20 translate-y-[100%] group-hover:translate-y-0 transition-transform duration-300" />
          <Plus className="w-5 h-5 text-black relative z-10" />
          <span className="text-xs font-black text-black uppercase tracking-widest relative z-10">Create New Trip</span>
        </button>
      </header>

      <section className="px-6 space-y-12 pb-10">
        {/* ... Sections ... */}
        {/* Verification of the sections below to keep logic intact */}
        {upcomingTrips.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-primary" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Upcoming</h2>
            </div>
            <div className="space-y-6">
              {upcomingTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} onSelect={(id) => router.push(`/trip/${id}`)} />
              ))}
            </div>
          </div>
        )}

        {draftTrips.length > 0 && (
          <div>
            <div className="flex items-center gap-3 mb-6 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">Drafts</h2>
            </div>
            <div className="space-y-6">
              {draftTrips.map(trip => (
                <TripCard key={trip.id} trip={trip} onSelect={(id) => router.push(`/trip/${id}`)} />
              ))}
            </div>
          </div>
        )}

        {trips.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-8 text-center"
          >
            <div className="w-20 h-20 rounded-full bg-zinc-900 flex items-center justify-center mb-6">
               <Plane className="w-8 h-8 text-zinc-700" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">Ready for a new adventure?</h3>
            <p className="text-xs text-zinc-500 font-bold mb-8">Start by creating your first itinerary. We'll handle the logistics.</p>
            <button 
              onClick={() => setIsModalOpen(true)}
              className="px-8 py-4 rounded-2xl border border-primary/20 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest hover:bg-primary/10 transition-colors"
            >
              Plan first trip
            </button>
          </motion.div>
        )}
      </section>

      <NewTripModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onCreate={handleCreateNew} 
      />

      <BottomNav />
    </main>
  );
}

