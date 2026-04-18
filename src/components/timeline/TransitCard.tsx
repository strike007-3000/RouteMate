'use client';

import React from 'react';
import { Bus, ArrowRight, Loader2, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

export const TransitCard = () => {
  return (
    <div className="relative pl-10 pb-8 last:pb-0">
      <div className="absolute left-0 top-0 w-10 h-full flex flex-col items-center">
        <div className="w-0.5 flex-1 bg-primary/20 bg-dashed" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        className="bg-primary/5 border border-primary/20 border-dashed p-4 rounded-3xl relative overflow-hidden group"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
        
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            </div>
            <div>
              <span className="text-xs font-bold text-primary uppercase tracking-tighter">Automatic Logistics</span>
              <p className="text-[10px] text-muted-foreground font-medium">Gap Detected: 4h 30m</p>
            </div>
          </div>
          <div className="px-2 py-0.5 rounded-md bg-emerald-500/10 border border-emerald-500/20">
             <span className="text-[10px] font-bold text-emerald-500">FREE</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4 py-2">
          <div className="flex flex-col items-center gap-1">
             <div className="w-2 h-2 rounded-full bg-muted" />
             <div className="w-0.5 h-4 bg-muted" />
             <div className="w-2 h-2 rounded-full bg-muted" />
          </div>
          <div className="flex-1">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <Bus className="w-4 h-4 text-muted-foreground" />
                <span className="text-sm font-bold">Elizabeth Line</span>
              </div>
              <span className="text-xs font-bold">£0.00</span>
            </div>
            <p className="text-[10px] text-muted-foreground leading-tight">Suggested: Take the Elizabeth Line from Heathrow to Canary Wharf. Extremely fast and covered by your Travel Pass.</p>
          </div>
        </div>
        
        <button className="w-full mt-4 py-2.5 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2">
          Confirm Connection
          <ArrowRight className="w-3 h-3" />
        </button>
      </motion.div>
    </div>
  );
};
