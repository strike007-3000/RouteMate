'use client';
import React, { useState } from 'react';
import { User, Settings, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingsModal } from './SettingsModal';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const tripId = Number(id);
  
  const activeTrip = useLiveQuery(() => db.trips.get(tripId || -1), [tripId]);

  const isSubRoute = pathname.includes('/trip/') || pathname.includes('/explore/') || pathname.includes('/timeline/');
  const isDashboard = pathname === '/trips' || pathname === '/';

  const handleBack = () => {
    if (pathname.includes('/timeline')) {
      router.push(`/trip/${tripId}`);
    } else {
      router.push('/trips');
    }
  };

  return (
    <>
      <header className={cn(
        "sticky top-0 z-50 w-full h-20 flex items-center px-6 transition-all duration-500",
        isSubRoute ? "bg-transparent border-none" : "bg-black/80 backdrop-blur-xl border-b border-white/5"
      )}>
        {/* Fixed Left Slot (64px wide to match pl-16) */}
        <div className="w-16 flex items-center">
          {isSubRoute && !isDashboard && (
            <button 
              onClick={handleBack}
              className="w-10 h-10 rounded-2xl bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors border border-white/5 active:scale-90"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}
        </div>

        {/* Center Slot (Fixed pl-0 since container has px-6, but logically start at 16 units from left) */}
        <motion.div 
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex-1 flex flex-col justify-center"
        >
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] leading-none mb-1.5">ROUTEMATE</span>
          <h1 className="text-sm font-black text-white tracking-tighter leading-none">
            {activeTrip?.name || (pathname === '/explore' ? 'Global Explore' : 'My Adventure')}
          </h1>
        </motion.div>

        {/* Right Slot */}
        <motion.div 
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-colors active:scale-90"
          >
            <Settings className="w-4 h-4 text-zinc-500" />
          </button>
          <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 p-0.5">
            <div className="w-full h-full rounded-2xl bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-primary-foreground" />
            </div>
          </div>
        </motion.div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};