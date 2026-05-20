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

  // Determine Title based on current architecture
  let title = 'My Trips';
  if (pathname.includes('/timeline')) title = 'Itinerary';
  else if (pathname === '/explore') title = 'Explore';
  else if (pathname === '/account') title = 'Account Hub';
  else if (pathname === '/trips' || pathname === '/') title = 'My Trips';

  // Javascript fallback for browsers that do not support CSS scroll-driven animations
  const [scrollPercent, setScrollPercent] = React.useState(0);

  React.useEffect(() => {
    if (typeof window === 'undefined') return;

    const isScrollTimelineSupported = 
      window.CSS && 
      window.CSS.supports('(animation-timeline: scroll()) and (animation-range: 0% 100%)');

    if (isScrollTimelineSupported) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const percent = Math.min(1, scrollY / 100);
      setScrollPercent(percent);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      style={{ 
        paddingTop: 'var(--safe-top)',
        '--scroll-percent': scrollPercent
      } as React.CSSProperties}
      className={cn(
        "sticky top-0 z-50 w-full px-[var(--gutter,24px)] pb-4 transition-all duration-300 shrinking-header border-b",
        isSubRoute ? "bg-black/60 backdrop-blur-xl border-white/5" : "bg-black border-white/5"
      )}
    >
      <div className="h-16 flex items-center justify-between header-inner">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-1 header-brand">
              <span className="text-[10px] font-bold text-primary uppercase tracking-[0.4em]">ROUTEMATE</span>
            </div>
            <h1 className="text-[clamp(1.5rem,5vw,2.25rem)] font-black text-white tracking-tighter leading-none truncate max-w-[250px] header-title">
              {title}
            </h1>
          </div>
        </div>

        {/* Relocated DEV Indicator & Asymmetric balance */}
        <div className="flex items-center gap-3">
          {process.env.NODE_ENV === 'development' && (
            <span className="text-[8px] font-black text-amber-500/60 uppercase tracking-widest border border-amber-500/20 px-1.5 py-0.5 rounded-sm bg-amber-500/5">DEV</span>
          )}
          <div className="w-10" />
        </div>
      </div>
    </header>
  );
};