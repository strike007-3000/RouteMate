'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  ChevronRight, 
  Settings, 
  Globe, 
  Bell, 
  Shield, 
  LogOut,
  CreditCard,
  History,
  Sparkles
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { useRouter } from 'next/navigation';

export default function AccountPage() {
  const { user, logout, isLoggedIn } = useAuthStore();
  const router = useRouter();
  const tripCount = useLiveQuery(() => db.trips.count(), []) ?? 0;
  const favoriteCount = useLiveQuery(() => db.favorites.count(), []) ?? 0;

  const handleLogout = () => {
    logout();
    window.location.replace('/api/auth/logout');
  };

  const settingsItems = [
    { icon: User, label: 'Personal Info', color: 'text-blue-400' },
    { icon: Settings, label: 'App Settings', color: 'text-zinc-400' },
    { icon: Globe, label: 'Currency & Units', color: 'text-emerald-400', detail: 'EUR/KM' },
    { icon: Bell, label: 'Notification Settings', color: 'text-amber-400' },
    { icon: Shield, label: 'Privacy & Security', color: 'text-purple-400' },
    { 
      icon: LogOut, 
      label: 'Logout', 
      color: 'text-red-500/80', 
      isLast: true,
      onClick: handleLogout
    },
  ];

  const [devKeys, setDevKeys] = React.useState(() => {
    // Return defaults if on server or not in dev
    const defaults = {
      openrouter: '',
      groq: '',
      unsplash: '',
      ors: '',
      weatherstack: '',
      aviationstack: '',
      preferred_ai: 'OpenRouter'
    };

    if (typeof window === 'undefined' || process.env.NODE_ENV !== 'development') {
      return defaults;
    }

    return {
      openrouter: localStorage.getItem('dev_openrouter_key') || '',
      groq: localStorage.getItem('dev_groq_key') || '',
      unsplash: localStorage.getItem('dev_unsplash_key') || '',
      ors: localStorage.getItem('dev_ors_key') || '',
      weatherstack: localStorage.getItem('dev_weatherstack_key') || '',
      aviationstack: localStorage.getItem('dev_aviationstack_key') || '',
      preferred_ai: localStorage.getItem('dev_preferred_ai_key') || 'OpenRouter'
    };
  });

  // useEffect removed to avoid cascading renders; initialization handled by useState lazy initializer.

  const handleDevKeyChange = (key: keyof typeof devKeys, value: string) => {
    setDevKeys(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`dev_${key}_key`, value);
  };

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-[500px] mx-auto overflow-x-hidden relative flex flex-col">
      <Header />
      
      <div className="px-[var(--gutter,24px)] pt-8 space-y-10">
        {/* Identity Section */}
        <div className="relative flex flex-col items-center text-center">

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 p-1 mb-6"
          >
            <div className="w-full h-full rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden">
              {user?.image ? (
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-1/2 h-1/2 text-zinc-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/20" />
            </div>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <h2 className="text-[clamp(1.5rem,5vw,2.5rem)] font-black text-white tracking-tighter mb-2 leading-none">
              {user?.name || 'Guest User'}
            </h2>
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mt-3 block">
              {user?.status || 'Elite Traveler'}
            </span>
          </motion.div>
        </div>

        {/* Travel Stats Bento - Adaptive Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center text-center group hover:bg-zinc-800/50 transition-colors h-32"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Trips</span>
            <span className="text-3xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{tripCount}</span>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-zinc-900/50 border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center text-center group hover:bg-zinc-800/50 transition-colors h-32"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Saved Places</span>
            <span className="text-3xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{favoriteCount}</span>
          </motion.div>
        </div>

        {/* Developer Settings - EXCLUSIVELY FOR LOCAL DEV */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6"
          >
            <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <h2 className="text-[10px] font-black text-white uppercase tracking-[0.4em]">DEVELOPER SETTINGS</h2>
            </div>
            
            <div className="p-6 rounded-[24px] bg-zinc-900/30 border border-white/5 space-y-5">
              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">OpenRouter Key (AI Extraction)</label>
                <input 
                  type="password"
                  value={devKeys.openrouter}
                  onChange={(e) => handleDevKeyChange('openrouter', e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Groq Key (Backup Provider)</label>
                <input 
                  type="password"
                  value={devKeys.groq}
                  onChange={(e) => handleDevKeyChange('groq', e.target.value)}
                  placeholder="gsk_..."
                  className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">Unsplash Access Key (Images)</label>
                <input 
                   type="password"
                   value={devKeys.unsplash}
                   onChange={(e) => handleDevKeyChange('unsplash', e.target.value)}
                   placeholder="Enter Access Key"
                   className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">ORS API Key (Transit)</label>
                <input 
                   type="password"
                   value={devKeys.ors}
                   onChange={(e) => handleDevKeyChange('ors', e.target.value)}
                   placeholder="Enter ORS Key"
                   className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">WeatherStack Key</label>
                <input 
                   type="password"
                   value={devKeys.weatherstack}
                   onChange={(e) => handleDevKeyChange('weatherstack', e.target.value)}
                   placeholder="Enter WeatherStack Key"
                   className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">AviationStack Key</label>
                <input 
                   type="password"
                   value={devKeys.aviationstack}
                   onChange={(e) => handleDevKeyChange('aviationstack', e.target.value)}
                   placeholder="Enter AviationStack Key"
                   className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                />
              </div>

              <div className="pt-4 mt-4 border-t border-white/5">
                <button
                  onClick={() => handleDevKeyChange('openrouter', devKeys.openrouter === 'MOCK_MODE' ? '' : 'MOCK_MODE')}
                  className={cn(
                    "w-full py-4 px-6 rounded-2xl border transition-all flex items-center justify-between group",
                    devKeys.openrouter === 'MOCK_MODE' 
                      ? "bg-primary/10 border-primary/30 text-primary" 
                      : "bg-black/40 border-white/5 text-zinc-500 hover:border-white/10"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <Sparkles className={cn("w-4 h-4", devKeys.openrouter === 'MOCK_MODE' ? "text-primary" : "text-zinc-600")} />
                    <span className="text-[10px] font-black uppercase tracking-widest">Mock AI Mode</span>
                  </div>
                  <div className={cn(
                    "w-10 h-5 rounded-full relative transition-colors duration-300",
                    devKeys.openrouter === 'MOCK_MODE' ? "bg-primary" : "bg-zinc-800"
                  )}>
                    <div className={cn(
                      "absolute top-1 w-3 h-3 rounded-full bg-white transition-all duration-300",
                      devKeys.openrouter === 'MOCK_MODE' ? "right-1" : "left-1"
                    )} />
                  </div>
                </button>
                <p className="text-[8px] font-bold text-zinc-600 uppercase tracking-widest mt-3 mb-6 text-center">
                  Enable this to test extraction without an API key
                </p>

                <div className="bg-black/40 border border-white/5 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Sparkles className="w-4 h-4 text-zinc-600" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Preferred AI</span>
                  </div>
                  <div className="flex bg-black/50 p-1 rounded-xl border border-white/5 shrink-0">
                    <button 
                      onClick={() => handleDevKeyChange('preferred_ai', 'OpenRouter')}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${devKeys.preferred_ai === 'OpenRouter' ? 'bg-zinc-800 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      OpenRouter
                    </button>
                    <button 
                      onClick={() => handleDevKeyChange('preferred_ai', 'Groq')}
                      className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all ${devKeys.preferred_ai === 'Groq' ? 'bg-primary text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300'}`}
                    >
                      Groq
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Integrated Settings List - Intrinsic Sizing */}
        <div className="space-y-3 pb-10">
          <div className="flex items-center gap-3 px-2 mb-4">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">PREFERENCES</h2>
          </div>
          {settingsItems.map((item, index) => (
            <motion.button
              key={item.label}
              onClick={item.onClick}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 + index * 0.05 }}
              className={cn(
                "w-full min-h-[64px] py-4 px-6 rounded-[24px] bg-zinc-900/30 border border-white/5 flex items-center gap-4 active:scale-[0.98] transition-all hover:bg-zinc-900/50",
                item.isLast && "mt-4"
              )}
            >
              <div className={cn("w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 flex-shrink-0")}>
                <item.icon className={cn("w-5 h-5 text-primary")} />
              </div>
              <span className={cn(
                "text-sm font-bold text-left flex-1",
                item.isLast ? "text-red-500/80" : "text-white/80"
              )}>
                {item.label}
              </span>
              {item.detail && (
                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mr-2">{item.detail}</span>
              )}
              {!item.isLast && <ChevronRight className="w-5 h-5 text-zinc-600 flex-shrink-0 self-center" />}
            </motion.button>
          ))}
        </div>
      </div>

      <BottomNav />
    </main>
  );
}
