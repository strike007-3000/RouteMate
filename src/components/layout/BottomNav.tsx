'use client';

import React from 'react';
import { Globe, Clock, Search, User } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useTripStore } from '@/stores/useTripStore';

export const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { getBestTimelineTrip } = useTripStore();

  const handleTimelineClick = async () => {
    const tripId = await getBestTimelineTrip();
    if (tripId) {
      router.push(`/trip/${tripId}/timeline`);
    } else {
      router.push('/trips');
    }
  };

  const navItems = [
    { 
      label: 'TRIPS', 
      icon: Globe, 
      path: '/trips',
      active: pathname === '/trips' || pathname === '/'
    },
    { 
      label: 'ITINERARY', 
      icon: Clock, 
      action: handleTimelineClick,
      active: pathname.includes('/timeline')
    },
    { 
      label: 'EXPLORE', 
      icon: Search, 
      path: '/explore',
      active: pathname === '/explore'
    },
    { 
      label: 'ACCOUNT', 
      icon: User, 
      path: '/account',
      active: pathname === '/account'
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto z-50 bg-zinc-950/95 backdrop-blur-2xl border-t border-white/[0.06] rounded-t-[32px] pt-4 pb-[var(--safe-bottom,16px)] shadow-2xl">
      <div className="flex items-center justify-around px-4 h-14">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => {
              const navigate = () => {
                if (item.action) {
                  item.action();
                } else if (item.path) {
                  router.push(item.path);
                }
              };

              if (document.startViewTransition) {
                document.startViewTransition(navigate);
              } else {
                navigate();
              }
            }}
            className={cn(
              "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4 py-1.5 rounded-[16px] cursor-pointer",
              item.active ? "scale-105" : "hover:text-zinc-400"
            )}
          >
            {item.active && (
              <motion.div 
                layoutId="nav-pill"
                className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-[16px] -z-10"
                transition={{ type: "spring", stiffness: 380, damping: 30 }}
              />
            )}
            <item.icon className={cn("w-[18px] h-[18px] transition-transform", item.active ? "text-primary" : "text-zinc-600")} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.3em] text-center",
              item.active ? "text-primary" : "text-zinc-600"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
