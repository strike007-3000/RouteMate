'use client';

import { useEffect } from 'react';
import { useParams } from 'next/navigation';
import { useTripStore } from '@/stores/useTripStore';
import { Header } from '@/components/layout/Header';

import { BentoGrid } from '@/components/dashboard/BentoGrid';
import { Timeline } from '@/components/timeline/Timeline';

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
    <main className="min-h-screen bg-background pb-20 max-w-md mx-auto border-x border-border/50 shadow-2xl shadow-black/50">
      <Header />
      <BentoGrid />
      <Timeline />
      
      {/* Dynamic Tab Bar for Mobile Navigation */}
      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto glass h-20 px-10 flex items-center justify-between z-50">
        <button 
          onClick={() => window.location.href = '/trips'}
          className="flex flex-col items-center gap-1 opacity-100 group"
        >
           <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center group-hover:bg-primary/40 transition-colors">
             <div className="w-2.5 h-2.5 rounded-full bg-primary" />
           </div>
           <span className="text-[8px] font-black text-primary uppercase tracking-widest">Dashboard</span>
        </button>
        <div className="flex flex-col items-center gap-1 opacity-30">
           <div className="w-6 h-6 rounded-full bg-foreground/20" />
           <span className="text-[8px] font-black uppercase tracking-widest">Timeline</span>
        </div>
        <div className="flex flex-col items-center gap-1 opacity-30">
           <div className="w-6 h-6 rounded-full bg-foreground/20" />
           <span className="text-[8px] font-black uppercase tracking-widest">Guides</span>
        </div>
      </div>
    </main>
  );
}

