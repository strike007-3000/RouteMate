'use client';

import React from 'react';
import { ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { useParams, useRouter, usePathname } from 'next/navigation';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { cn } from '@/lib/utils';

export const Header = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { id } = useParams();
  const tripId = Number(id);
  
  const activeTrip = useLiveQuery(() => db.trips.get(tripId || -1), [tripId]);

  const isSubRoute = pathname.includes('/trip/') || pathname.includes('/explore/') || pathname.includes('/timeline/');
  const isDashboard = pathname === '/trips' || pathname === '/';

  // Determine Title
  let title = 'My Adventure';
  if (activeTrip) title = activeTrip.name;
  else if (pathname === '/explore') title = 'Explore';
  else if (pathname === '/account') title = 'Account Hub';

  return (
    <header 
      style={{ paddingTop: 'var(--safe-top)' }}
      className={cn(
        "sticky top-0 z-50 w-full px-[var(--gutter,24px)] pb-4 transition-all duration-500",
        isSubRoute ? "bg-black/60 backdrop-blur-xl" : "bg-black border-b border-white/5"
      )}
    >
      <div className="h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {isSubRoute && !isDashboard && (
            <button 
              onClick={() => router.back()}
              className="w-10 h-10 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-white hover:bg-white/10 transition-all active:scale-90"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
          )}
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">ROUTEMATE</span>
              {process.env.NODE_ENV === 'development' && (
                <div className="px-1.5 py-0.5 rounded-sm bg-amber-500/10 border border-amber-500/20">
                  <span className="text-[8px] font-black text-amber-500 uppercase">DEV MODE</span>
                </div>
              )}
            </div>
            <h1 className="text-xl font-black text-white tracking-tighter leading-none mt-[var(--brand-gap,4px)] truncate max-w-[200px]">
              {title}
            </h1>
          </div>
        </div>

        {/* Asymmetric balance: Right side empty or could have account icon */}
        <div className="w-10" />
      </div>
    </header>
  );
};