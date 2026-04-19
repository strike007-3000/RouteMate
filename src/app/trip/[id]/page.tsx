'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTripStore } from '@/stores/useTripStore';
import { Header } from '@/components/layout/Header';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { Timeline } from '@/components/timeline/Timeline';
import { BottomNav } from '@/components/layout/BottomNav';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';

export default function TripPage() {
  const { id } = useParams();
  const { setActiveTrip } = useTripStore();
  
  const tripId = Number(id);
  const activeTrip = useLiveQuery(() => db.trips.get(tripId), [tripId]);

  useEffect(() => {
    if (tripId) {
      setActiveTrip(tripId);
    }
  }, [tripId, setActiveTrip]);

  if (!activeTrip) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-md mx-auto border-x border-border/50 shadow-2xl shadow-black/50 relative overflow-x-hidden flex flex-col">
      <Header />
      
      <section className="mt-4">
        <BentoGrid />
      </section>
      
      <section className="mt-8">
        <Timeline />
      </section>

      <BottomNav />
    </main>
  );
}
