'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Key, X, Check, ExternalLink, Eye, EyeOff } from 'lucide-react';
import { useSettingsStore } from '@/stores/useSettingsStore';

export const SettingsModal = ({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) => {
  const { 
    openRouterApiKey, 
    setOpenRouterApiKey, 
    groqApiKey,
    setGroqApiKey,
    clearAllKeys,
    hereApiKey,
    setHereApiKey,
    orsApiKey,
    setOrsApiKey,
    unsplashAccessKey,
    setUnsplashAccessKey,
    preferredAiProvider,
    setPreferredAiProvider
  } = useSettingsStore();

  const [tempOpenRouterKey, setTempOpenRouterKey] = useState(openRouterApiKey);
  const [tempGroqKey, setTempGroqKey] = useState(groqApiKey || '');
  const [tempHereKey, setTempHereKey] = useState(hereApiKey || '');
  const [tempOrsKey, setTempOrsKey] = useState(orsApiKey || '');
  const [tempUnsplashKey, setTempUnsplashKey] = useState(unsplashAccessKey || '');
  const [tempPreferredAi, setTempPreferredAi] = useState(preferredAiProvider || 'OpenRouter');
  
  const [showOpenRouterKey, setShowOpenRouterKey] = useState(false);
  const [showGroqKey, setShowGroqKey] = useState(false);
  const [showHereKey, setShowHereKey] = useState(false);
  const [showOrsKey, setShowOrsKey] = useState(false);
  const [showUnsplashKey, setShowUnsplashKey] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const handleSave = () => {
    setOpenRouterApiKey(tempOpenRouterKey);
    setGroqApiKey(tempGroqKey);
    setHereApiKey(tempHereKey);
    setOrsApiKey(tempOrsKey);
    setUnsplashAccessKey(tempUnsplashKey);
    setPreferredAiProvider(tempPreferredAi);
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
            className="fixed inset-x-4 top-[5%] bottom-[5%] md:max-w-md md:mx-auto glass-card rounded-[2.5rem] z-[101] p-8 overflow-y-auto"
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
              
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">Preferred AI Provider</h4>
                  <p className="text-[10px] text-zinc-400 font-medium leading-tight pr-4">
                    Select your primary model for itinerary extraction. Falls back to OpenRouter.
                  </p>
                </div>
                <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 shrink-0">
                  <button 
                    onClick={() => setTempPreferredAi('OpenRouter')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tempPreferredAi === 'OpenRouter' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    OpenRouter
                  </button>
                  <button 
                    onClick={() => setTempPreferredAi('Groq')}
                    className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${tempPreferredAi === 'Groq' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                  >
                    Groq
                  </button>
                </div>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  OpenRouter API Key (AI Extraction)
                </label>
                <div className="relative">
                  <input
                    type={showOpenRouterKey ? "text" : "password"}
                    value={tempOpenRouterKey}
                    onChange={(e) => setTempOpenRouterKey(e.target.value)}
                    placeholder="sk-or-v1-..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowOpenRouterKey(!showOpenRouterKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showOpenRouterKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <a 
                  href="https://openrouter.ai/keys" 
                  target="_blank" 
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                >
                  Get your OpenRouter key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  Groq API Key (Backup Provider)
                </label>
                <div className="relative">
                  <input
                    type={showGroqKey ? "text" : "password"}
                    value={tempGroqKey}
                    onChange={(e) => setTempGroqKey(e.target.value)}
                    placeholder="gsk_..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowGroqKey(!showGroqKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showGroqKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <a 
                  href="https://console.groq.com/keys" 
                  target="_blank" 
                  className="mt-3 flex items-center gap-1.5 text-[10px] font-bold text-primary hover:underline"
                >
                  Get your free Groq key
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>

              <div>
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground mb-3 block">
                  Unsplash Access Key (Atmospheric Images)
                </label>
                <div className="relative">
                  <input
                    type={showUnsplashKey ? "text" : "password"}
                    value={tempUnsplashKey}
                    onChange={(e) => setTempUnsplashKey(e.target.value)}
                    placeholder="Access Key..."
                    className="w-full bg-black/40 border border-white/10 rounded-2xl py-4 pl-5 pr-12 text-sm focus:outline-none focus:border-primary/50 transition-colors"
                  />
                  <button 
                    onClick={() => setShowUnsplashKey(!showUnsplashKey)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showUnsplashKey ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                    clearAllKeys();
                    setTempOpenRouterKey('');
                    setTempHereKey('');
                    setTempOrsKey('');
                    setTempUnsplashKey('');
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
