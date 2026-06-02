'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  User, 
  ChevronRight, 
  SlidersHorizontal, 
  Globe, 
  Shield, 
  LogOut,
  Sparkles,
  Camera,
  MapPin
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '@/lib/db';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/stores/useAuthStore';
import { useClerk, useUser } from '@clerk/nextjs';
import { useSettingsStore } from '@/stores/useSettingsStore';

export function AccountClient() {
  const { user, logout, isLoggedIn } = useAuthStore();
  const { signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const router = useRouter();
  const settings = useSettingsStore();
  const [activePanel, setActivePanel] = React.useState<string | null>(null);
  const [isIdentityExpanded, setIsIdentityExpanded] = React.useState(false);

  const tripCount = useLiveQuery(() => db.trips.count(), []) ?? 0;
  const favoriteCount = useLiveQuery(() => db.favorites.count(), []) ?? 0;

  const settingsItems = [
    { icon: User, label: 'Personal Info', color: 'text-blue-400', onClick: () => setActivePanel('personalInfo') },
    { icon: SlidersHorizontal, label: 'App Preferences', color: 'text-zinc-400', onClick: () => setActivePanel('appPreferences') },
    { icon: Globe, label: 'Currency & Units', color: 'text-emerald-400', detail: `${settings.currency}/${settings.distanceUnit}`, onClick: () => setActivePanel('currencyUnits') },
    { icon: Shield, label: 'Privacy & Security', color: 'text-purple-400', onClick: () => setActivePanel('privacySecurity') },
    { 
      icon: LogOut, 
      label: 'Logout', 
      color: 'text-red-500/80', 
      isLast: true,
      onClick: () => setActivePanel('logout')
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

  const handleDevKeyChange = (key: keyof typeof devKeys, value: string) => {
    setDevKeys(prev => ({ ...prev, [key]: value }));
    localStorage.setItem(`dev_${key}_key`, value);
  };

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-[500px] mx-auto [overflow:clip] relative flex flex-col page-glow">
      <Header />
      
      <div className="px-[var(--gutter,24px)] pt-8 space-y-10">
        {/* Identity Section */}
        <div className="relative flex flex-col items-center text-center">

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={cn(
              "w-[clamp(6rem,20vw,8rem)] h-[clamp(6rem,20vw,8rem)] rounded-full bg-gradient-to-tr from-primary/20 to-primary/5 p-1 mb-6 relative cursor-pointer",
              !user?.image && "ring-2 ring-primary/30 animate-pulse"
            )}
            onClick={() => setActivePanel('personalInfo')}
          >
            <div className="w-full h-full rounded-full bg-zinc-900 border border-white/5 flex items-center justify-center relative overflow-hidden group">
              {user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-1/2 h-1/2 text-zinc-700" />
              )}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="w-8 h-8 text-white/80" />
              </div>
            </div>
            <div className="absolute bottom-0 right-2 w-8 h-8 bg-primary rounded-full flex items-center justify-center border-2 border-black shadow-lg">
              <Camera className="w-4 h-4 text-white" />
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
            <div className="flex items-center justify-center gap-3 mt-4">
              {tripCount > 0 && (
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <MapPin className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{tripCount} Trips</span>
                </div>
              )}
              <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] bg-primary/10 border border-primary/20 rounded-full px-3 py-1">
                {user?.status || 'Elite Traveler'}
              </span>
            </div>
          </motion.div>
        </div>

        {/* Travel Identity Section */}
        {isLoggedIn && (
          <div className="space-y-4 pt-2 relative">
            <div 
              className="flex items-center justify-between px-2 cursor-pointer group"
              onClick={() => setIsIdentityExpanded(!isIdentityExpanded)}
            >
              <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] group-hover:text-zinc-300 transition-colors">TRAVEL IDENTITY</h2>
              <ChevronRight className={cn(
                "w-4 h-4 text-zinc-600 transition-transform", 
                isIdentityExpanded && "rotate-90"
              )} />
            </div>

            <AnimatePresence>
              {isIdentityExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-5 bg-zinc-900/30 border border-white/5 rounded-[24px] space-y-6 mt-2">
                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Home City</label>
                      <input 
                        type="text" 
                        value={settings.homeCity} 
                        onChange={(e) => settings.setHomeCity(e.target.value)} 
                        placeholder="e.g. New York, LHR, Tokyo"
                        className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/30"
                      />
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Travel Style</label>
                      <div className="flex flex-wrap gap-2">
                        {['Solo', 'Couple', 'Family', 'Business', 'Adventure'].map(style => {
                          const isSelected = settings.travelStyles.includes(style);
                          return (
                            <button
                              key={style}
                              onClick={() => {
                                if (isSelected) {
                                  settings.setTravelStyles(settings.travelStyles.filter(s => s !== style));
                                } else {
                                  settings.setTravelStyles([...settings.travelStyles, style]);
                                }
                              }}
                              className={cn(
                                "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                                isSelected ? "bg-primary text-black" : "bg-black/40 text-zinc-500 border border-white/5"
                              )}
                            >
                              {style}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Preferred Cabin</label>
                      <div className="flex flex-wrap gap-2">
                        {['Economy', 'Premium', 'Business', 'First'].map(cabin => (
                          <button
                            key={cabin}
                            onClick={() => settings.setPreferredCabin(cabin)}
                            className={cn(
                              "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                              settings.preferredCabin === cabin ? "bg-primary/20 text-primary border border-primary/30" : "bg-black/40 text-zinc-500 border border-white/5"
                            )}
                          >
                            {cabin}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Travel Stats Bento - Adaptive Grid */}
        <div className="grid grid-cols-[repeat(auto-fit,minmax(140px,1fr))] gap-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/trips')}
            className="bg-zinc-900/50 border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center text-center group hover:bg-zinc-800/50 hover:-translate-y-0.5 transition-all h-32 cursor-pointer relative"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Total Trips</span>
            <span className="text-3xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{tripCount}</span>
            <ChevronRight className="w-4 h-4 text-zinc-700 absolute bottom-4 right-4" />
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            onClick={() => router.push('/explore')}
            className="bg-zinc-900/50 border border-white/5 rounded-[24px] p-6 flex flex-col items-center justify-center text-center group hover:bg-zinc-800/50 hover:-translate-y-0.5 transition-all h-32 cursor-pointer relative"
          >
            <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest mb-2">Saved Places</span>
            <span className="text-3xl font-black text-white tracking-tighter group-hover:scale-110 transition-transform">{favoriteCount}</span>
            <ChevronRight className="w-4 h-4 text-zinc-700 absolute bottom-4 right-4" />
          </motion.div>
        </div>



        {/* Integrated Settings List - Intrinsic Sizing */}
        <div className="space-y-3 pb-10">
          <div className="flex items-center gap-3 px-2 mb-4">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">PREFERENCES</h2>
          </div>
          {settingsItems.map((item, index) => {
            const colorMaps: Record<string, { bg: string, border: string }> = {
              'text-blue-400': { bg: 'bg-blue-400/10', border: 'border-blue-400/20' },
              'text-zinc-400': { bg: 'bg-zinc-400/10', border: 'border-zinc-700/30' },
              'text-emerald-400': { bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' },
              'text-amber-400': { bg: 'bg-amber-400/10', border: 'border-amber-400/20' },
              'text-purple-400': { bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
              'text-red-500/80': { bg: 'bg-red-500/10', border: 'border-red-500/20' },
            };
            const style = colorMaps[item.color] || { bg: 'bg-primary/10', border: 'border-primary/20' };

            return (
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
                <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center border flex-shrink-0", style.bg, style.border)}>
                  <item.icon className={cn("w-5 h-5", item.color)} />
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
            );
          })}
        </div>

        {/* Developer Settings - EXCLUSIVELY FOR LOCAL DEV */}
        {process.env.NODE_ENV === 'development' && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-6 mt-8"
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
      </div>

      <AnimatePresence>
        {activePanel === 'personalInfo' && (
          <PersonalInfoPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)} 
            user={user} 
            clerkUser={clerkUser} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'appPreferences' && (
          <AppPreferencesPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)} 
            settings={settings} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'currencyUnits' && (
          <CurrencyUnitsPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)} 
            settings={settings} 
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'privacySecurity' && (
          <PrivacySecurityPanel 
            isOpen={true} 
            onClose={() => setActivePanel(null)} 
            user={user}
            clerkUser={clerkUser}
          />
        )}
      </AnimatePresence>
      <AnimatePresence>
        {activePanel === 'logout' && (
          <LogoutConfirmSheet 
            isOpen={true} 
            onClose={() => setActivePanel(null)} 
            user={user}
            onConfirm={async () => {
              setActivePanel(null);
              logout();
              await signOut();
            }}
          />
        )}
      </AnimatePresence>

      <BottomNav />
    </main>
  );
}

// Subcomponents

const BottomSheet = ({ 
  isOpen, 
  onClose, 
  title, 
  icon: Icon, 
  children 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  icon: React.ElementType; 
  children: React.ReactNode; 
}) => (
  <>
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[100]"
      onClick={onClose}
    />
    <motion.div 
      initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[500px] rounded-t-[32px] bg-zinc-950 border-t border-x border-white/[0.08] z-[101] max-h-[85vh] overflow-y-auto shadow-2xl flex flex-col"
    >
      <div className="sticky top-0 bg-zinc-950/95 backdrop-blur-md z-10 flex items-center justify-between px-6 py-5 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-primary/20 flex items-center justify-center text-primary">
            <Icon className="w-5 h-5" />
          </div>
          <h2 className="text-xl font-black text-white">{title}</h2>
        </div>
        <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full bg-white/5 text-zinc-500 hover:text-white transition-colors">
          <ChevronRight className="w-5 h-5 rotate-90" />
        </button>
      </div>
      <div className="p-6 pb-8">
        {children}
      </div>
    </motion.div>
  </>
);

const PersonalInfoPanel = ({ isOpen, onClose, user, clerkUser }: any) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [name, setName] = React.useState(user?.name || '');
  const [isSaving, setIsSaving] = React.useState(false);

  const prebakedAvatars = [
    '/avatars/avatar-1.png',
    '/avatars/avatar-2.png',
    '/avatars/avatar-3.png',
    '/avatars/avatar-4.png',
    '/avatars/avatar-5.png',
    '/avatars/avatar-6.png',
  ];

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !clerkUser) return;
    setIsSaving(true);
    try {
      await clerkUser.setProfileImage({ file });
    } catch (err) {
      console.error('Failed to update image', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSelectPrebakedAvatar = async (avatarPath: string) => {
    if (!clerkUser) return;
    setIsSaving(true);
    try {
      const response = await fetch(avatarPath);
      const blob = await response.blob();
      const filename = avatarPath.split('/').pop() || 'avatar.png';
      const file = new File([blob], filename, { type: blob.type });
      await clerkUser.setProfileImage({ file });
    } catch (err) {
      console.error('Failed to set prebaked avatar', err);
    } finally {
      setIsSaving(false);
    }
  };

  const isSelected = (avatarPath: string) => {
    const filename = avatarPath.split('/').pop();
    return filename ? user?.image?.includes(filename) : false;
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const trimmed = name.trim();
      const firstSpaceIndex = trimmed.indexOf(' ');
      let firstName = trimmed;
      let lastName = '';
      if (firstSpaceIndex !== -1) {
        firstName = trimmed.substring(0, firstSpaceIndex).trim();
        lastName = trimmed.substring(firstSpaceIndex + 1).trim();
      }
      await clerkUser?.update({ firstName, lastName });
      onClose();
    } catch (err) {
      console.error('Failed to update name', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Personal Info" icon={User}>
      <div className="space-y-6">
        <div className="flex flex-col items-center">
          <input 
            type="file" 
            ref={fileInputRef} 
            accept="image/*" 
            className="hidden" 
            onChange={handleImageChange} 
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            disabled={isSaving}
            className="w-24 h-24 rounded-full bg-zinc-900 border border-white/5 relative group overflow-hidden mb-4 ring-2 ring-primary/40 disabled:opacity-50"
          >
            {user?.image ? (
              <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              <User className="w-1/2 h-1/2 text-zinc-700 mx-auto mt-6" />
            )}
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Camera className="w-6 h-6 text-white" />
            </div>
          </button>
          <p className="text-xs text-zinc-500">Tap to upload photo</p>
        </div>

        {/* Prebaked Avatars Grid */}
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Prebaked Avatars</label>
          <div className="grid grid-cols-6 gap-2 bg-black/40 p-3 rounded-2xl border border-white/5">
            {prebakedAvatars.map((path, idx) => {
              const active = isSelected(path);
              return (
                <button
                  key={path}
                  onClick={() => handleSelectPrebakedAvatar(path)}
                  disabled={isSaving}
                  className={cn(
                    "w-full aspect-square rounded-xl overflow-hidden border-2 bg-zinc-900 relative transition-all active:scale-95 disabled:opacity-50",
                    active ? "border-primary shadow-lg shadow-primary/20 scale-105" : "border-white/10 hover:border-white/30"
                  )}
                  title={`Avatar option ${idx + 1}`}
                >
                  <img src={path} alt={`Avatar option ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              );
            })}
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Full Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              className="w-full h-14 bg-black/40 border border-white/5 rounded-2xl px-4 text-sm font-bold text-white focus:outline-none focus:border-primary/50 transition-colors" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Email Address</label>
            <input 
              type="text" 
              value={clerkUser?.primaryEmailAddress?.emailAddress || ''} 
              disabled 
              className="w-full h-14 bg-zinc-900/50 border border-white/5 rounded-2xl px-4 text-sm font-bold text-zinc-500 cursor-not-allowed" 
            />
          </div>
        </div>

        <div className="pt-4">
          <button 
            onClick={handleSave} 
            disabled={isSaving}
            className="w-full h-14 rounded-[24px] border-2 border-primary text-primary font-black uppercase tracking-[0.2em] flex items-center justify-center hover:bg-primary hover:text-black transition-all disabled:opacity-50"
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

const AppPreferencesPanel = ({ isOpen, onClose, settings }: any) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="App Preferences" icon={SlidersHorizontal}>
      <div className="space-y-6">
        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Default Trip View</label>
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {['summary', 'logistics'].map(mode => (
              <button
                key={mode}
                onClick={() => settings.setDefaultViewMode(mode)}
                className={cn(
                  "w-full min-w-0 flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  settings.defaultViewMode === mode ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {mode}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Time Format</label>
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {['12h', '24h'].map(format => (
              <button
                key={format}
                onClick={() => settings.setTimeFormat(format)}
                className={cn(
                  "w-full min-w-0 flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all",
                  settings.timeFormat === format ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Date Format</label>
          <div className="flex flex-col gap-2">
            {['DD/MM/YYYY', 'MM/DD/YYYY'].map(format => (
              <button
                key={format}
                onClick={() => settings.setDateFormat(format)}
                className={cn(
                  "w-full py-4 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all border",
                  settings.dateFormat === format ? "bg-primary/20 text-primary border-primary/30" : "bg-black/40 text-zinc-500 border-white/5"
                )}
              >
                {format}
              </button>
            ))}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-white">Smart Paste Auto-detect</h3>
            <p className="text-[10px] text-zinc-500">Automatically scan clipboard for travel info</p>
          </div>
          <button 
            onClick={() => settings.setSmartPasteAutoDetect(!settings.smartPasteAutoDetect)}
            className={cn(
              "w-12 h-6 rounded-full relative transition-colors duration-300",
              settings.smartPasteAutoDetect ? "bg-primary" : "bg-zinc-800"
            )}
          >
            <div className={cn(
              "absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-300 shadow-sm",
              settings.smartPasteAutoDetect ? "right-1" : "left-1"
            )} />
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};

const CurrencyUnitsPanel = ({ isOpen, onClose, settings }: any) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Currency & Units" icon={Globe}>
      <div className="space-y-8">
        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Currency</label>
          <div className="grid grid-cols-3 gap-3">
            {['EUR', 'USD', 'GBP', 'JPY', 'INR'].map(cur => (
              <button
                key={cur}
                onClick={() => settings.setCurrency(cur)}
                className={cn(
                  "py-4 rounded-xl text-sm font-black transition-all border",
                  settings.currency === cur ? "bg-primary/20 text-primary border-primary/30" : "bg-black/40 text-zinc-500 border-white/5 hover:border-white/10"
                )}
              >
                {cur}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">Distance Unit</label>
          <div className="flex bg-black/40 p-1 rounded-2xl border border-white/5">
            {['KM', 'MI'].map(unit => (
              <button
                key={unit}
                onClick={() => settings.setDistanceUnit(unit)}
                className={cn(
                  "flex-1 py-4 rounded-xl text-sm font-black transition-all",
                  settings.distanceUnit === unit ? "bg-zinc-800 text-white shadow-lg" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {unit === 'KM' ? 'Kilometers (km)' : 'Miles (mi)'}
              </button>
          ))}
          </div>
        </div>
      </div>
    </BottomSheet>
  );
};

const PrivacySecurityPanel = ({ isOpen, onClose, user, clerkUser }: any) => {
  const [deleteStep, setDeleteStep] = React.useState(0);
  const [deleteInput, setDeleteInput] = React.useState('');
  
  const [clearDataStep, setClearDataStep] = React.useState(0);

  const [passwordStep, setPasswordStep] = React.useState(false);
  const [currentPassword, setCurrentPassword] = React.useState('');
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [isChangingPassword, setIsChangingPassword] = React.useState(false);

  const hasPassword = clerkUser?.passwordEnabled;

  const handleChangePassword = async () => {
    if (newPassword !== confirmPassword) return alert("Passwords don't match");
    setIsChangingPassword(true);
    try {
      await clerkUser?.updatePassword({ currentPassword, newPassword });
      setPasswordStep(false);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      alert("Password updated successfully");
    } catch (err: any) {
      alert(err.errors?.[0]?.message || "Failed to update password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await clerkUser?.delete();
      await db.delete();
      localStorage.clear();
      window.location.href = '/';
    } catch (err) {
      console.error(err);
    }
  };

  const handleClearData = async () => {
    try {
      await db.delete();
      localStorage.clear();
      window.location.reload();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Privacy & Security" icon={Shield}>
      <div className="space-y-6">
        
        {/* Group 1: Authentication */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 border-b border-white/5 pb-2">Authentication</h3>
          
          {hasPassword ? (
            <div className="bg-zinc-900/30 rounded-[24px] border border-white/5 overflow-hidden transition-all">
              <button 
                onClick={() => setPasswordStep(!passwordStep)}
                className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
              >
                <span className="text-sm font-bold text-white">Change Password</span>
                <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", passwordStep && "rotate-90")} />
              </button>
              
              <AnimatePresence>
                {passwordStep && (
                  <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                    <div className="p-4 pt-0 space-y-3">
                      <input type="password" placeholder="Current Password" value={currentPassword} onChange={e => setCurrentPassword(e.target.value)} className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50" />
                      <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50" />
                      <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="w-full h-12 bg-black/40 border border-white/5 rounded-xl px-4 text-xs font-bold text-white focus:outline-none focus:border-primary/50" />
                      <button onClick={handleChangePassword} disabled={isChangingPassword} className="w-full h-12 rounded-xl bg-primary text-black font-black uppercase tracking-widest text-[10px] disabled:opacity-50">
                        {isChangingPassword ? 'Saving...' : 'Save Password'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ) : (
            <div className="bg-zinc-900/30 rounded-[24px] border border-white/5 p-4 flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
                <svg viewBox="0 0 24 24" className="w-4 h-4"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/><path fill="none" d="M1 1h22v22H1z"/></svg>
              </div>
              <span className="text-xs font-bold text-zinc-400">Password managed by Google</span>
            </div>
          )}

          <div className={cn(
            "bg-zinc-900/30 rounded-[24px] border transition-all overflow-hidden",
            deleteStep > 0 ? "border-red-500/30 bg-red-500/5" : "border-white/5"
          )}>
            <button 
              onClick={() => setDeleteStep(deleteStep === 0 ? 1 : 0)}
              className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors"
            >
              <span className="text-sm font-bold text-red-500">Delete Account</span>
              <ChevronRight className={cn("w-4 h-4 text-zinc-500 transition-transform", deleteStep > 0 && "rotate-90")} />
            </button>
            <AnimatePresence>
              {deleteStep > 0 && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <div className="p-4 pt-0 space-y-3">
                    <p className="text-xs text-red-400/80 font-bold">This permanently deletes your routemate.top account and all local data.</p>
                    <input 
                      type="text" 
                      placeholder="Type DELETE to confirm" 
                      value={deleteInput}
                      onChange={e => setDeleteInput(e.target.value)}
                      className="w-full h-12 bg-black/40 border border-red-500/30 rounded-xl px-4 text-xs font-bold text-red-500 focus:outline-none focus:border-red-500"
                    />
                    <button 
                      onClick={handleDeleteAccount}
                      disabled={deleteInput !== 'DELETE'}
                      className="w-full h-12 rounded-xl border-2 border-red-500 text-red-500 font-black uppercase tracking-widest text-[10px] disabled:opacity-30 disabled:border-red-500/30"
                    >
                      Permanently Delete Account
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Group 2: Data */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 border-b border-white/5 pb-2">Local Data</h3>
          
          <button 
            onClick={() => clearDataStep === 0 ? setClearDataStep(1) : handleClearData()}
            className={cn(
              "w-full h-14 rounded-[24px] border flex items-center justify-center font-black uppercase tracking-widest text-[10px] transition-all",
              clearDataStep === 0 ? "bg-zinc-900/30 border-white/5 text-zinc-400 hover:text-white" : "bg-amber-500/10 border-amber-500/50 text-amber-500"
            )}
          >
            {clearDataStep === 0 ? 'Clear All Local Data' : 'Tap again to clear all data'}
          </button>
        </div>

        {/* Group 3: Legal */}
        <div className="space-y-4">
          <h3 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em] mb-2 border-b border-white/5 pb-2">Legal</h3>
          
          <div className="bg-zinc-900/30 rounded-[24px] border border-white/5 overflow-hidden">
            <button onClick={() => window.open('/privacy', '_blank')} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors border-b border-white/5">
              <span className="text-sm font-bold text-zinc-300">Privacy Policy</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
            <button onClick={() => window.open('/terms', '_blank')} className="w-full p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
              <span className="text-sm font-bold text-zinc-300">Terms of Service</span>
              <ChevronRight className="w-4 h-4 text-zinc-600" />
            </button>
          </div>
        </div>

      </div>
    </BottomSheet>
  );
};

const LogoutConfirmSheet = ({ isOpen, onClose, user, onConfirm }: any) => {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Sign Out" icon={LogOut}>
      <div className="space-y-8 flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-zinc-900 border border-white/5 relative overflow-hidden mb-2">
          {user?.image ? (
            <img src={user.image} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            <User className="w-1/2 h-1/2 text-zinc-700 mx-auto mt-5" />
          )}
        </div>
        
        <div>
          <h3 className="text-lg font-black text-white mb-2">Sign out of {user?.name || 'Account'}?</h3>
          <p className="text-xs text-zinc-500">You will need to sign back in to access your trips and saved places.</p>
        </div>

        <div className="w-full space-y-3">
          <button 
            onClick={onConfirm}
            className="w-full h-14 rounded-[24px] border-2 border-red-500 text-red-500 font-black uppercase tracking-[0.2em] flex items-center justify-center hover:bg-red-500 hover:text-black transition-all"
          >
            Sign Out
          </button>
          <button 
            onClick={onClose}
            className="w-full h-14 rounded-[24px] bg-zinc-900 text-white font-black uppercase tracking-[0.2em] flex items-center justify-center hover:bg-zinc-800 transition-all"
          >
            Cancel
          </button>
        </div>
      </div>
    </BottomSheet>
  );
};
