'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, CreditCard, Navigation, Wind } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BentoBoxProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  className?: string;
  delay?: number;
}

const BentoBox = ({ title, value, icon, className, delay = 0 }: BentoBoxProps) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className={cn(
      "glass-card p-4 rounded-3xl flex flex-col justify-between overflow-hidden relative group",
      className
    )}
  >
    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
      {icon}
    </div>
    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{title}</span>
    <div className="flex flex-col gap-1 mt-4">
      <span className="text-2xl font-bold tracking-tight">{value}</span>
      <div className="flex items-center gap-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
        <span className="text-[10px] text-muted-foreground font-medium">Updated just now</span>
      </div>
    </div>
  </motion.div>
);

export const BentoGrid = () => {
  return (
    <div className="grid grid-cols-2 gap-3 p-6 pt-2">
      <BentoBox 
        title="Next Action" 
        value="Check-in" 
        icon={<Calendar className="w-12 h-12" />}
        className="col-span-1"
        delay={0.1}
      />
      <BentoBox 
        title="Est. Transit" 
        value="£12.50" 
        icon={<CreditCard className="w-12 h-12" />}
        className="col-span-1"
        delay={0.2}
      />
      <BentoBox 
        title="Distance" 
        value="8.4 km" 
        icon={<Navigation className="w-12 h-12" />}
        className="col-span-2 aspect-[3/1]"
        delay={0.3}
      />
    </div>
  );
};
