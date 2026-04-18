'use client';

import React from 'react';
import { Globe, Navigation, Clock, Search } from 'lucide-react';
import { motion } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export const BottomNav = () => {
  const router = useRouter();
  const pathname = usePathname();

  const navItems = [
    { 
      label: 'Trips', 
      icon: Globe, 
      path: '/trips',
      active: pathname === '/trips'
    },
    { 
      label: 'Explore', 
      icon: Search, 
      path: '#',
      active: false
    },
    { 
      label: 'Radar', 
      icon: Navigation, 
      path: '#',
      active: false
    }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto h-20 px-8 flex items-center justify-between z-50 bg-[#0A0A0A]/80 backdrop-blur-xl border-t border-white/5 rounded-t-[2.5rem] shadow-2xl">
      {navItems.map((item, index) => (
        <button
          key={item.label}
          onClick={() => item.path !== '#' && router.push(item.path)}
          className={cn(
            "flex flex-col items-center gap-1.5 transition-all duration-300 relative px-4",
            item.active ? "opacity-100 scale-110" : "opacity-30 hover:opacity-50"
          )}
        >
          {item.active && (
            <motion.div 
              layoutId="active-indicator"
              className="absolute -top-3 w-1 h-1 rounded-full bg-primary"
            />
          )}
          <item.icon className={cn("w-5 h-5", item.active ? "text-primary" : "text-white")} />
          <span className={cn(
            "text-[8px] font-black uppercase tracking-[0.2em]",
            item.active ? "text-primary" : "text-white"
          )}>
            {item.label}
          </span>
        </button>
      ))}
    </div>
  );
};
