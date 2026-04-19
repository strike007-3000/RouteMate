'use client';
import React, { useState } from 'react';
import { User, Settings, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { SettingsModal } from './SettingsModal';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { useParams, useRouter, usePathname } from 'next/navigation';

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
      <header className="sticky top-0 z-50 w-full bg-black/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between border-b border-white/5">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-4"
        >
          {isSubRoute && !isDashboard && (
            <button 
              onClick={handleBack}
              className="w-8 h-8 rounded-xl bg-zinc-900 flex items-center justify-center hover:bg-zinc-800 transition-colors border border-white/5"
            >
              <ChevronLeft className="w-5 h-5 text-zinc-400" />
            </button>
          )}

          <div>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.5em] leading-none mb-1.5 block">ROUTEMATE</span>
            <h1 className="text-xs font-black text-white uppercase tracking-[0.2em] leading-none">
              {activeTrip?.name || (pathname === '/explore' ? 'Global Explore' : 'My Adventure')}
            </h1>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center hover:bg-zinc-800 transition-colors"
          >
            <Settings className="w-4 h-4 text-zinc-500" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 p-0.5">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
              <User className="w-4 h-4 text-black" />
            </div>
          </div>
        </motion.div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};