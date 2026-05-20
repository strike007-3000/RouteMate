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
    <div className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto z-50 glass border-t-0 rounded-t-[32px] pt-4 pb-[var(--safe-bottom,16px)] shadow-2xl">
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
              "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-2",
              item.active ? "opacity-100 scale-105" : "opacity-30 hover:opacity-50"
            )}
          >
            {item.active && (
              <motion.div 
                layoutId="active-nav-dot"
                className="absolute -top-3 w-1 h-1 rounded-full bg-primary shadow-[0_0_12px_rgba(59,130,246,0.8)]"
              />
            )}
            <item.icon className={cn("w-[18px] h-[18px] transition-transform", item.active ? "text-primary" : "text-white")} />
            <span className={cn(
              "text-[8px] font-black uppercase tracking-[0.3em] text-center",
              item.active ? "text-primary" : "text-white"
            )}>
              {item.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
