'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { nvidiaApiKey, setNvidiaApiKey, clearNvidiaApiKey } = useSettingsStore();
  const [tempKey, setTempKey] = useState(nvidiaApiKey);
  const [showKey, setShowKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setNvidiaApiKey(tempKey);
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

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
            className="fixed inset-x-4 top-[20%] md:max-w-md md:mx-auto glass-card rounded-[2.5rem] z-[101] p-8"
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

            <div className="space-y-6">
              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  NVIDIA NIM API Key
                </label>
                <div className="relative">
                  <input
                    type={showKey ? "text" : "password"}
                    value={tempKey}
                    onChange={(e) => setTempKey(e.target.value)}
                    placeholder="nvapi-..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <a 
                  href="https://build.nvidia.com/mistralai/mistral-large-3-2412" 
                  target="_blank" 
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                >
                  Get your free key from NVIDIA Build
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div className="pt-4 flex gap-3">
                <button
                  onClick={clearNvidiaApiKey}
                  className="flex-1 py-4 rounded-2xl bg-secondary text-xs font-bold hover:bg-muted transition-colors"
                >
                  Clear Key
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
                    "Save Configuration"
                  )}
                </button>
              </div>
            </div>
            
            <p className="mt-8 text-[10px] text-center text-muted-foreground leading-relaxed">
              Your key is stored locally in your browser's persistence layer and is only used to facilitate itinerary extraction.
            </p>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
