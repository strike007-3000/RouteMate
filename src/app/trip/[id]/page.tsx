'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { BottomNav } from '@/components/layout/BottomNav';

export default function TripPage() {
  const { id } = useParams();
  const { setActiveTrip, activeTrip } = useTripStore();

  useEffect(() => {
    if (id) {
      setActiveTrip(Number(id));
    }
  }, [id, setActiveTrip]);

  if (!activeTrip) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  return (
    <main className="min-h-screen bg-background pb-32 max-w-md mx-auto border-x border-border/50 shadow-2xl shadow-black/50 relative overflow-x-hidden">
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


