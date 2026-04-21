'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTripStore } from '@/stores/useTripStore';
import { Header } from '@/components/layout/Header';
import { TripHero } from '@/components/trip/TripHero';
import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { Timeline } from '@/components/timeline/Timeline';
import { BottomNav } from '@/components/layout/BottomNav';
import { SmartPaste } from '@/components/timeline/SmartPaste';
import { useState } from 'react';
import { motion } from 'framer-motion';

import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { format, parseISO } from 'date-fns';
import { Calendar } from 'lucide-react';

export default function TripPage() {
  const { id } = useParams();
  const { setActiveTrip } = useTripStore();
  const [isSmartAddOpen, setIsSmartAddOpen] = useState(false);
  
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
    <main className="min-h-screen bg-black pb-32 flex flex-col relative overflow-x-hidden max-w-[500px] mx-auto">
      <Header />
      
      <TripHero trip={activeTrip} mode="dashboard" />

      <section className="relative z-10 mt-4">
        <BentoGrid onOpenSmartAdd={() => setIsSmartAddOpen(true)} />
      </section>
      
      <section className="mt-0">
        <Timeline onOpenSmartAdd={() => setIsSmartAddOpen(true)} />
      </section>

      <SmartPaste isOpen={isSmartAddOpen} onClose={() => setIsSmartAddOpen(false)} />
      <BottomNav />
    </main>
  );
}
