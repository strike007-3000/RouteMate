'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { 
    nvidiaApiKey, 
    setNvidiaApiKey, 
    clearNvidiaApiKey,
    hereApiKey,
    setHereApiKey,
    orsApiKey,
    setOrsApiKey
  } = useSettingsStore();

  const [tempNvidiaKey, setTempNvidiaKey] = useState(nvidiaApiKey);
  const [tempHereKey, setTempHereKey] = useState(hereApiKey || '');
  const [tempOrsKey, setTempOrsKey] = useState(orsApiKey || '');
  const [showNvidiaKey, setShowNvidiaKey] = useState(false);
  const [showHereKey, setShowHereKey] = useState(false);
  const [showOrsKey, setShowOrsKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setNvidiaApiKey(tempNvidiaKey);
    setHereApiKey(tempHereKey);
    setOrsApiKey(tempOrsKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };
// ... rest of the component


  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-x-4 top-[10%] bottom-[10%] md:max-w-md md:mx-auto glass-card rounded-[2.5rem] z-[101] p-8 overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
                  <Key className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-black">Settings</h2>
              </div>
              <button onClick={onClose} className="text-muted-foreground hover:text-foreground">
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="space-y-8">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  NVIDIA NIM API Key (AI Extraction)
                </label>
                <div className="relative">
                  <input
                    type={showNvidiaKey ? "text" : "password"}
                    value={tempNvidiaKey}
                    onChange={(e) => setTempNvidiaKey(e.target.value)}
                    placeholder="nvapi-..."

                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowNvidiaKey(!showNvidiaKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showNvidiaKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  OpenRouteService API Key (Walking Logistics)
                </label>
                <div className="relative">
                  <input
                    type={showOrsKey ? "text" : "password"}
                    value={tempOrsKey}
                    onChange={(e) => setTempOrsKey(e.target.value)}
                    placeholder="5b3ce..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowOrsKey(!showOrsKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOrsKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <a 
                  href="https://openrouteservice.org/dev/#/home" 
                  target="_blank" 
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                >
                  Get your free ORS key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>


              <div className="pt-4 flex gap-3">
                <button
                  onClick={() => {
                    clearNvidiaApiKey();
                    setTempNvidiaKey('');
                    setTempHereKey('');
                  }}
                  className="flex-1 py-4 rounded-2xl bg-secondary text-xs font-bold hover:bg-muted transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={handleSave}
                  className="flex-[2] py-4 rounded-2xl bg-primary text-white text-xs font-bold hover:bg-primary/90 transition-all flex items-center justify-center gap-2"
                >
                  {isSaved ? (
                    <>
                      <Check className="w-4 h-4" />
                      Saved!
                    </>
                  ) : (
                    "Save & Sync"
                  )}
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-[10px] text-center text-muted-foreground leading-relaxed italic">
              RouteMate is &quot;Pocket-Friendly.&quot; Your keys are stored locally and never synced to a server.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

