'use client';

import React, { useState } from 'react';
import { MapPin, User, Settings } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTripStore } from '@/stores/useTripStore';
import { SettingsModal } from './SettingsModal';

export const Header = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { activeTrip } = useTripStore();

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass px-6 py-4 flex items-center justify-between">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-2"
        >
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center shadow-lg shadow-primary/20">
            <MapPin className="text-white w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight">RouteMate</h1>
            <p className="text-[10px] text-primary font-black uppercase tracking-widest leading-none">
              {activeTrip?.name || 'My Adventure'}
            </p>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3"
        >
          <button 
            onClick={() => setIsSettingsOpen(true)}
            className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center hover:bg-muted transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" />
          </button>
          <div className="w-10 h-10 rounded-full bg-primary/10 border border-primary/20 p-0.5">
            <div className="w-full h-full rounded-full bg-primary flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
          </div>
        </motion.div>
      </header>

      <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
    </>
  );
};
