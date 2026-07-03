'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Globe, 
  MapPin, 
  Sparkles, 
  Search, 
  Heart, 
  X, 
  Calendar, 
  Loader2, 
  Compass, 
  Utensils, 
  ArrowRight
} from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, Destination } from '@/lib/db';
import { seedDestinations } from '@/lib/seedDestinations';
import { BottomNav } from '@/components/layout/BottomNav';
import { Header } from '@/components/layout/Header';
import { Toast } from '@/components/layout/Toast';
import { useRouter } from 'next/navigation';
import { useTripStore } from '@/stores/useTripStore';
import { useSettingsStore } from '@/stores/useSettingsStore';
import { UnsplashService } from '@/services/images/UnsplashService';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';

export function ExploreClient() {
  const router = useRouter();
  const { createTrip } = useTripStore();
  const { openRouterApiKey, groqApiKey, preferredAiProvider, unsplashAccessKey } = useSettingsStore();

  // Search & Filtering States
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  
  // Selected Destination & Itinerary Generation states
  const [selectedDestination, setSelectedDestination] = useState<Destination | null>(null);
  const [isBuilderOpen, setIsBuilderOpen] = useState(false);
  const [startDate, setStartDate] = useState(() => format(new Date(), 'yyyy-MM-dd'));
  const [endDate, setEndDate] = useState(() => format(new Date(Date.now() + 86400000 * 4), 'yyyy-MM-dd'));
  const [selectedVibe, setSelectedVibe] = useState<'Chill' | 'Adventure' | 'Foodie' | 'Culture & History'>('Culture & History');
  
  // Async Loading States
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [isExploring, setIsExploring] = useState(false);
  const [exploringStatus, setExploringStatus] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // AI Curation & Progressive Loading States
  const [showIntentModal, setShowIntentModal] = useState(false);
  const [travelIntent, setTravelIntent] = useState('');
  const [selectedMoods, setSelectedMoods] = useState<string[]>([]);
  const [progressiveStage, setProgressiveStage] = useState(1);
  const [transientDestination, setTransientDestination] = useState<Destination | null>(null);
  const [showReviewCard, setShowReviewCard] = useState(false);

  // Local DB Queries
  const exploredDestinations = useLiveQuery(() => db.destinations.toArray(), []);
  const favorites = useLiveQuery(() => db.favorites.toArray(), []);

  // Combine seed destinations and dynamic ones from Dexie
  const allDestinations = React.useMemo(() => {
    const combined = [...seedDestinations];
    
    // Add dynamically discovered ones without duplicates
    if (exploredDestinations) {
      exploredDestinations.forEach(explored => {
        if (!combined.some(c => c.id === explored.id)) {
          combined.push(explored);
        }
      });
    }
    
    return combined;
  }, [exploredDestinations]);

  // Check if a destination name is favorited
  const isFavorited = React.useCallback((destName: string) => {
    return favorites ? favorites.some(f => f.name.toLowerCase() === destName.toLowerCase()) : false;
  }, [favorites]);

  // Toggle favorite status
  const toggleFavorite = async (dest: Destination) => {
    if (!favorites) return;
    const existing = favorites.find(f => f.name.toLowerCase() === dest.name.toLowerCase());
    if (existing) {
      await db.favorites.delete(existing.id!);
    } else {
      await db.favorites.add({
        name: dest.name,
        category: dest.category,
        image: dest.image || 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1000',
        location: dest.country
      });
    }
  };

  // Filtering Logic
  const filteredDestinations = React.useMemo(() => {
    return allDestinations.filter(dest => {
      // 1. Search Query filter
      const matchesSearch = 
        dest.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
        dest.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      if (!matchesSearch) return false;

      // 2. Category filter
      if (activeCategory === 'All') return true;
      if (activeCategory === 'Saved') return isFavorited(dest.name);
      return dest.category.toLowerCase() === activeCategory.toLowerCase();
    });
  }, [allDestinations, searchQuery, activeCategory, isFavorited]);

  // Helper: resolve API keys from dev localStorage override or settings store
  const getApiKeys = () => ({
    apiOpenRouterKey: localStorage.getItem('dev_openrouter_key') || openRouterApiKey || '',
    apiGroqKey: localStorage.getItem('dev_groq_key') || groqApiKey || '',
    finalPreferredAi: localStorage.getItem('dev_preferred_ai_key') || preferredAiProvider || '',
  });

  // AI Discover City Trigger (Option B)
  const handleAiExplore = async () => {
    if (!searchQuery.trim()) return;
    
    // Close intent modal if open
    setShowIntentModal(false);
    
    setIsExploring(true);
    setProgressiveStage(1);
    setExploringStatus('🤖 Mapping geographical coordinates and vibes...');
    
    try {
      const { apiOpenRouterKey, apiGroqKey, finalPreferredAi } = getApiKeys();

      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'x-user-openrouter-key': apiOpenRouterKey || '',
        'x-user-groq-key': apiGroqKey || '',
      };
      if (finalPreferredAi) {
        headers['x-preferred-ai'] = finalPreferredAi;
      }

      // Small delay to allow reading the first stage
      await new Promise(r => setTimeout(r, 600));

      const response = await fetch('/api/explore-city', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          city: searchQuery.trim(),
          intent: travelIntent.trim(),
          moodModifiers: selectedMoods
        })
      });

      const data = await response.json();

      if (response.ok && data.id) {
        setProgressiveStage(2);
        setExploringStatus('🏛️ Synthesizing local landmarks and hidden spots...');
        await new Promise(r => setTimeout(r, 800));
        
        setProgressiveStage(3);
        setExploringStatus('📸 Curation complete! Sourcing high-fidelity imagery...');
        
        // Dynamic image fetch from Unsplash
        const imageUrl = await UnsplashService.getCityImage(data.name, unsplashAccessKey);
        const finalDest = { ...data, image: imageUrl };
        
        // Hold strictly in transient state variable (Database Guardrail Rule)
        setTransientDestination(finalDest);
        setIsExploring(false);
        setShowReviewCard(true);
      } else {
        throw new Error(data.details || data.error || 'Failed to discover city');
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to explore city. Please check settings keys.';
      setToastMessage(msg);
      setShowToast(true);
      setIsExploring(false);
    }
  };

  // Commit destination payload to database
  const handleConfirmSave = async () => {
    if (!transientDestination) return;

    setIsExploring(true);
    setProgressiveStage(4);
    setExploringStatus('💾 Committing destination payload to local vault...');

    try {
      await new Promise(r => setTimeout(r, 800));
      
      // Cache in IndexedDB destinations table
      await db.destinations.put(transientDestination);
      
      setShowReviewCard(false);
      setIsExploring(false);
      setSearchQuery('');
      setTravelIntent('');
      setSelectedMoods([]);
      setSelectedDestination(transientDestination);
      setTransientDestination(null);
    } catch (err) {
      console.error(err);
      setToastMessage('Failed to save destination to local vault.');
      setShowToast(true);
      setIsExploring(false);
    }
  };

  // Discard transient state cleanly
  const handleCancelReRoll = () => {
    setTransientDestination(null);
    setShowReviewCard(false);
    // Reopen intent configuration
    setShowIntentModal(true);
  };

  // Spark AI Planner Generation Trigger
  const handleGenerateItinerary = async () => {
    if (!startDate || !endDate || !selectedDestination) return;
    setIsGenerating(true);
    setGenerationStatus('Structuring travel prompt...');
    
    try {
      const dest = selectedDestination;
      const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (86400000)) + 1;

      const { apiOpenRouterKey, apiGroqKey, finalPreferredAi } = getApiKeys();

      const headers: Record<string, string> = { 
        'Content-Type': 'application/json',
        'x-user-openrouter-key': apiOpenRouterKey || '',
        'x-user-groq-key': apiGroqKey || '',
      };
      if (finalPreferredAi) {
        headers['x-preferred-ai'] = finalPreferredAi;
      }

      setGenerationStatus('Mapping activities with AI...');

      const response = await fetch('/api/parse-itinerary', {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          city: dest.country ? `${dest.name}, ${dest.country}` : dest.name,
          destinationId: dest.id,
          startDate,
          endDate,
          tripVibe: selectedVibe,
          highlights: dest.highlights
        }),
      });

      const data = await response.json();

      if (response.ok && data.points && data.points.length > 0) {
        setGenerationStatus('Creating local database references...');
        
        // Create new Trip in Dexie DB
        const tripId = await createTrip({
          name: `Trip to ${dest.name}`,
          destination: dest.name,
          startDate,
          endDate,
          coverImage: dest.image,
          status: 'upcoming'
        });

        // Insert itinerary items
        for (const point of data.points) {
          await db.itineraryItems.add({
            ...point,
            tripId,
            id: undefined // let Dexie auto-generate key
          });
        }

        // Trigger cover photo cache trigger just in case
        if (!dest.image) {
          UnsplashService.getTripImage(tripId, dest.name, unsplashAccessKey);
        }

        setGenerationStatus('Itinerary updated! Launching timeline...');
        
        setTimeout(() => {
          setIsGenerating(false);
          setIsBuilderOpen(false);
          setSelectedDestination(null);
          router.push(`/trip/${tripId}/timeline`);
        }, 800);
      } else {
        throw new Error(data.details || data.error || 'Failed to generate itinerary');
      }
    } catch (err) {
      console.error(err);
      const msg = err instanceof Error ? err.message : 'Failed to generate itinerary. Please verify your keys.';
      alert(msg);
      setIsGenerating(false);
    }
  };

  const categoriesList = ['All', 'Cities', 'Beaches', 'Nature', 'Culture', 'Saved'];
  const vibeOptions = ['Chill', 'Adventure', 'Foodie', 'Culture & History'];

  return (
    <main className="min-h-screen bg-background pb-36 relative overflow-x-hidden w-full max-w-[500px] mx-auto flex flex-col page-glow">
      <Header />

      {/* Search Input Section */}
      <section className="px-[var(--gutter,24px)] pt-6">
        <div className="relative group">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 group-focus-within:text-primary transition-colors" />
          <input 
            type="text"
            placeholder="Search by city, country, or vibe..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-[72px] bg-zinc-950/80 border border-white/5 rounded-[24px] pl-16 pr-6 text-sm font-bold placeholder:text-zinc-700 focus:outline-none focus:border-primary/30 transition-all focus:bg-zinc-900 shadow-xl"
          />
        </div>
      </section>

      {/* Category Pills Slider */}
      <section className="pt-6 overflow-x-auto no-scrollbar flex items-center gap-2 px-[var(--gutter,24px)]">
        {categoriesList.map(cat => {
          const isSelected = activeCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-5 py-3 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all active:scale-95 whitespace-nowrap",
                isSelected 
                  ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                  : "bg-zinc-950/50 border-white/5 text-zinc-500 hover:text-white hover:border-white/10"
              )}
            >
              {cat}
            </button>
          );
        })}
      </section>

      {/* Destination Grid */}
      <section className="px-[var(--gutter,24px)] pt-8 space-y-8 flex-1">
        <AnimatePresence mode="popLayout">
          {filteredDestinations.map((dest, i) => (
            <motion.div
              key={dest.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ delay: i * 0.05, type: 'spring', damping: 25, stiffness: 200 }}
              className="group relative h-96 rounded-[32px] overflow-hidden border border-white/5 shadow-2xl"
            >
              {dest.image ? (
                <Image
                  src={dest.image}
                  alt={dest.name}
                  fill
                  sizes="(max-width: 500px) 500px, 500px"
                  className="object-cover group-hover:scale-105 transition-transform duration-[3000ms]"
                  onError={() => {}}
                />
              ) : (
                <div className="w-full h-full bg-zinc-900 flex items-center justify-center">
                  <Globe className="w-12 h-12 text-zinc-800 animate-pulse" />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent" />
              
              {/* Overlay Content */}
              <div className="absolute bottom-0 left-0 right-0 p-8">
                <div className="flex gap-1.5 mb-3">
                  {dest.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="text-[8px] font-black text-white/70 uppercase tracking-widest bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="text-3xl font-black text-white tracking-tighter mb-1 leading-none">{dest.name}</h3>
                <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest flex items-center gap-1.5 mb-6">
                  <MapPin className="w-3 h-3 text-primary" />
                  {dest.country}
                </p>
                
                <button 
                  onClick={() => setSelectedDestination(dest)}
                  className="btn-primary w-full"
                >
                  <Globe className="w-4 h-4" />
                  <span>View Details</span>
                </button>
              </div>
              
              {/* Sparkle Badge or Saved status */}
              <div className="absolute top-6 right-6 flex gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    toggleFavorite(dest);
                  }}
                  className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg hover:bg-black/60 transition-colors active:scale-95"
                >
                  <Heart 
                    className={cn(
                      "w-5 h-5 transition-transform", 
                      isFavorited(dest.name) ? "text-red-500 fill-red-500 scale-110" : "text-white/60"
                    )} 
                  />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedDestination(dest);
                    setIsBuilderOpen(true);
                  }}
                  className="w-12 h-12 rounded-2xl bg-black/40 backdrop-blur-md flex items-center justify-center border border-white/10 shadow-lg hover:bg-black/60 transition-colors active:scale-95"
                >
                  <Sparkles className="w-5 h-5 text-primary" />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Empty state & AI discovery loader / trigger */}
        {filteredDestinations.length === 0 && !isExploring && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-8 text-center bg-zinc-950/20 border border-white/5 rounded-[32px] mt-6"
          >
            <div className="w-20 h-20 rounded-[28px] bg-zinc-900/50 flex items-center justify-center mb-6 border border-white/5">
               <Compass className="w-8 h-8 text-zinc-500 animate-spin [animation-duration:10s]" />
            </div>
            <h3 className="text-lg font-black text-white mb-2">
              {searchQuery ? `"${searchQuery}" not found` : 'No saved places'}
            </h3>
            <p className="text-xs text-zinc-500 font-bold mb-8 uppercase tracking-wide">
              {searchQuery 
                ? 'Discovered somewhere new? Query the database with AI.' 
                : 'Your favorites page is empty. Tap the heart icons on destination cards.'}
            </p>
            {searchQuery && (
              <button 
                onClick={() => setShowIntentModal(true)}
                className="btn-primary px-8"
              >
                <Sparkles className="w-4 h-4" />
                <span>Explore with AI</span>
              </button>
            )}
          </motion.div>
        )}

        {/* AI Explorer Loading State */}
        {isExploring && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col items-center justify-center py-20 px-8 text-center bg-zinc-950/20 border border-white/5 rounded-[32px] mt-6 w-full"
          >
            <div className="relative w-28 h-28 mb-8">
              <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
              <div className="absolute inset-4 rounded-full border border-primary/30 animate-ping [animation-delay:0.3s]" />
              <div className="absolute inset-0 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
              </div>
            </div>
            <h3 className="text-sm font-black text-white uppercase tracking-widest mb-4">Cartography Engine Active</h3>
            
            {/* Step Indicators */}
            <div className="w-full max-w-[320px] space-y-3 text-left bg-zinc-900/40 p-5 rounded-[24px] border border-white/5">
              {[
                { stage: 1, text: 'Mapping geographical coordinates & vibes...' },
                { stage: 2, text: 'Synthesizing local landmarks & hidden spots...' },
                { stage: 3, text: 'Curation complete! Sourcing high-fidelity imagery...' },
                { stage: 4, text: 'Committing destination payload to local vault...' }
              ].map(step => {
                const isActive = progressiveStage === step.stage;
                const isCompleted = progressiveStage > step.stage;
                return (
                  <div 
                    key={step.stage}
                    className={cn(
                      "flex items-center gap-3 transition-opacity duration-300",
                      isActive ? "opacity-100" : isCompleted ? "opacity-60" : "opacity-30"
                    )}
                  >
                    <div className={cn(
                      "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black border transition-colors",
                      isActive 
                        ? "bg-primary/20 border-primary text-primary animate-pulse"
                        : isCompleted
                          ? "bg-green-500/10 border-green-500/30 text-green-500"
                          : "bg-zinc-900 border-white/5 text-zinc-600"
                    )}>
                      {isCompleted ? '✓' : step.stage}
                    </div>
                    <span className={cn(
                      "text-[10px] font-bold uppercase tracking-wider",
                      isActive ? "text-white" : isCompleted ? "text-zinc-400" : "text-zinc-600"
                    )}>
                      {step.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}
      </section>

      {/* Destination Details Bottom Drawer */}
      <AnimatePresence>
        {selectedDestination && !isBuilderOpen && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/80 backdrop-blur-xl z-[100] max-w-[500px] mx-auto"
              onClick={() => setSelectedDestination(null)}
            />

            {/* Bottom Drawer container */}
            <motion.div 
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed bottom-0 left-0 right-0 max-w-[500px] mx-auto z-[101] bg-zinc-950 border-t border-white/10 rounded-t-[40px] shadow-2xl p-8 max-h-[85vh] overflow-y-auto pb-32 no-scrollbar"
            >
              {/* Drag Indicator Handle */}
              <div className="w-12 h-1.5 rounded-full bg-zinc-800 mx-auto mb-6" />

              {/* Title & Saved toggle */}
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-black text-white tracking-tighter leading-none mb-1">
                    {selectedDestination.name}
                  </h2>
                  <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-primary" />
                    {selectedDestination.country}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleFavorite(selectedDestination)}
                    className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center active:scale-95 transition-all text-zinc-500 hover:text-white"
                  >
                    <Heart 
                      className={cn(
                        "w-5 h-5", 
                        isFavorited(selectedDestination.name) ? "text-red-500 fill-red-500" : ""
                      )} 
                    />
                  </button>
                  <button 
                    onClick={() => setSelectedDestination(null)}
                    className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/5 flex items-center justify-center active:scale-95 transition-all text-zinc-500 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Image banner */}
              {selectedDestination.image && (
                <div className="relative h-48 rounded-[24px] overflow-hidden my-6 border border-white/5 shadow-lg">
                  <Image
                    src={selectedDestination.image}
                    alt={selectedDestination.name}
                    fill
                    sizes="(max-width: 500px) 460px, 460px"
                    className="object-cover"
                  />
                </div>
              )}

              {/* Description */}
              <p className="text-[13px] text-zinc-400 font-medium leading-relaxed mb-8">
                {selectedDestination.description}
              </p>

              {/* Curated Highlights POIs */}
              <div className="space-y-5">
                <div className="flex items-center gap-2.5 px-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <h4 className="text-[10px] font-black text-white uppercase tracking-[0.3em]">TOP HIGHLIGHTS</h4>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  {selectedDestination.highlights.map((poi, idx) => {
                    const Icon = poi.category === 'Food' ? Utensils : Compass;
                    return (
                      <div 
                        key={idx}
                        className="p-5 rounded-[24px] bg-zinc-900/40 border border-white/5 flex gap-4 hover:border-white/10 transition-colors"
                      >
                        <div className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0 self-start">
                          <Icon className="w-5 h-5" />
                        </div>
                        <div className="space-y-1">
                          <h5 className="text-sm font-black text-white">{poi.title}</h5>
                          <span className="text-[8px] font-black text-zinc-500 uppercase tracking-widest block">{poi.address}</span>
                          <p className="text-[11px] text-zinc-500 font-bold leading-relaxed pr-2">{poi.description}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Generate Itinerary CTA */}
              <div className="mt-10">
                <button 
                  onClick={() => setIsBuilderOpen(true)}
                  className="btn-primary w-full h-16"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Build Custom Itinerary</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Date & Travel Vibe Builder Modal */}
      <AnimatePresence>
        {isBuilderOpen && selectedDestination && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[102] max-w-[500px] mx-auto"
              onClick={() => {
                if (!isGenerating) setIsBuilderOpen(false);
              }}
            />

            {/* Modal Dialog */}
            <div className="fixed inset-0 z-[103] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none max-w-[500px] mx-auto">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-zinc-950 border-t sm:border border-white/10 rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 pb-12 pointer-events-auto h-[85vh] sm:h-auto overflow-y-auto no-scrollbar"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block leading-none">AI BUILDER</span>
                      <h2 className="text-xl font-black text-white tracking-tighter leading-none">Design your trip</h2>
                    </div>
                  </div>
                  <button 
                    disabled={isGenerating}
                    onClick={() => setIsBuilderOpen(false)}
                    className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {!isGenerating ? (
                  <div className="space-y-6">
                    {/* Dates */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">Start Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                            className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] pl-16 pr-6 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                          />
                        </div>
                      </div>
                      <div className="space-y-3">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">End Date</label>
                        <div className="relative">
                          <Calendar className="absolute left-6 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-600" />
                          <input 
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                            className="w-full h-16 bg-zinc-900/30 border border-white/5 rounded-[24px] pl-16 pr-6 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all [color-scheme:dark]"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Vibe Selection */}
                    <div className="space-y-4">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none">Trip Vibe</label>
                      <div className="grid grid-cols-2 gap-3">
                        {vibeOptions.map(vibe => {
                          const isVibeSelected = selectedVibe === vibe;
                          return (
                            <button
                              key={vibe}
                              type="button"
                              onClick={() => setSelectedVibe(vibe as 'Chill' | 'Adventure' | 'Foodie' | 'Culture & History')}
                              className={cn(
                                "h-14 rounded-2xl border text-xs font-black uppercase tracking-wider transition-all active:scale-95",
                                isVibeSelected
                                  ? "bg-primary/10 border-primary/30 text-primary"
                                  : "bg-zinc-900/30 border-white/5 text-zinc-500 hover:text-white"
                              )}
                            >
                              {vibe}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Action Button */}
                    <button 
                      onClick={handleGenerateItinerary}
                      className="btn-primary w-full h-16 mt-8"
                    >
                      <span>Generate Plan with AI</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  /* Generating AI Loading view */
                  <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="relative w-28 h-28 mb-8">
                      <div className="absolute inset-0 rounded-full border border-primary/20 animate-ping" />
                      <div className="absolute inset-4 rounded-full border border-primary/30 animate-ping [animation-delay:0.3s]" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <Loader2 className="w-8 h-8 text-primary animate-spin" />
                      </div>
                    </div>
                    <h3 className="text-sm font-black text-white uppercase tracking-widest mb-2">routemate.top AI Brain</h3>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest animate-pulse max-w-[280px] leading-relaxed">
                      {generationStatus}
                    </p>
                  </div>
                )}
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Intent Collection Modal */}
      <AnimatePresence>
        {showIntentModal && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[102] max-w-[500px] mx-auto"
              onClick={() => setShowIntentModal(false)}
            />

            {/* Modal Dialog */}
            <div className="fixed inset-0 z-[103] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none max-w-[500px] mx-auto">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-zinc-950 border-t sm:border border-white/10 rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 pb-12 pointer-events-auto h-[85vh] sm:h-auto overflow-y-auto no-scrollbar relative page-glow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Sparkles className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block leading-none font-black">AI CURATION</span>
                      <h2 className="text-xl font-black text-white tracking-tighter leading-none">Explore with AI</h2>
                    </div>
                  </div>
                  <button 
                    onClick={() => setShowIntentModal(false)}
                    className="w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-zinc-500 hover:text-white transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <div className="space-y-6">
                  {/* Confirmed Search Query */}
                  <div className="p-4 rounded-[24px] bg-zinc-900/50 border border-white/5">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] block mb-1">Destination Query</span>
                    <p className="text-sm font-black text-white">{searchQuery}</p>
                  </div>

                  {/* Intent Text Input */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none font-black">What are you planning to do there?</label>
                    <textarea 
                      placeholder="e.g. Find cozy coffee shops, visit art museums, explore local hiking trails..."
                      value={travelIntent}
                      onChange={(e) => setTravelIntent(e.target.value)}
                      className="w-full h-24 bg-zinc-900/30 border border-white/5 rounded-[24px] p-4 text-xs font-bold focus:outline-none focus:border-primary/20 transition-all placeholder:text-zinc-600 resize-none"
                    />
                  </div>

                  {/* Mood Selector Chips */}
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none font-black">Vibe Modifiers</label>
                    <div className="flex flex-wrap gap-2">
                      {[
                        'Food & Dining',
                        'Architecture & Culture',
                        'Hidden Gems',
                        'Budget-Friendly',
                        'Outdoor Adventure'
                      ].map(mood => {
                        const isSelected = selectedMoods.includes(mood);
                        return (
                          <button
                            key={mood}
                            type="button"
                            onClick={() => {
                              if (isSelected) {
                                setSelectedMoods(selectedMoods.filter(m => m !== mood));
                              } else {
                                setSelectedMoods([...selectedMoods, mood]);
                              }
                            }}
                            className={cn(
                              "px-4 py-2.5 rounded-full text-[9px] font-black uppercase tracking-wider border transition-all active:scale-95",
                              isSelected
                                ? "bg-primary/10 border-primary/40 text-primary shadow-[0_0_12px_rgba(59,130,246,0.15)]"
                                : "bg-zinc-900/30 border-white/5 text-zinc-500 hover:text-white"
                            )}
                          >
                            {mood}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Submit CTA */}
                  <button 
                    onClick={handleAiExplore}
                    className="btn-primary w-full h-16 mt-8"
                  >
                    <span>Generate Custom Spot</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      {/* Review & Refine Card Modal */}
      <AnimatePresence>
        {showReviewCard && transientDestination && (
          <>
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/95 backdrop-blur-xl z-[104] max-w-[500px] mx-auto"
            />

            {/* Modal Dialog */}
            <div className="fixed inset-0 z-[105] flex items-end sm:items-center justify-center p-0 sm:p-4 pointer-events-none max-w-[500px] mx-auto">
              <motion.div 
                initial={{ y: '100%' }}
                animate={{ y: 0 }}
                exit={{ y: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="w-full bg-zinc-950 border-t sm:border border-white/10 rounded-t-[40px] sm:rounded-[40px] shadow-2xl p-8 pb-12 pointer-events-auto h-[85vh] sm:h-auto overflow-y-auto no-scrollbar relative page-glow"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-[24px] bg-primary/10 border border-primary/20 flex items-center justify-center">
                      <Compass className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-[0.2em] mb-1 block leading-none font-black">PREVIEW SPOT</span>
                      <h2 className="text-xl font-black text-white tracking-tighter leading-none">Review & Refine</h2>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Destination Info Card */}
                  <div className="rounded-[24px] overflow-hidden border border-white/5 bg-zinc-900/20 shadow-xl p-5 space-y-4">
                    {transientDestination.image && (
                      <div className="relative h-40 rounded-[18px] overflow-hidden border border-white/5 shadow-md">
                        <Image
                          src={transientDestination.image}
                          alt={transientDestination.name}
                          fill
                          sizes="(max-width: 500px) 460px, 460px"
                          className="object-cover"
                        />
                      </div>
                    )}
                    
                    <div>
                      <h3 className="text-2xl font-black text-white tracking-tighter mb-1 leading-none">{transientDestination.name}</h3>
                      <p className="text-[10px] text-zinc-400 font-black uppercase tracking-widest flex items-center gap-1.5 mb-3">
                        <MapPin className="w-3 h-3 text-primary" />
                        {transientDestination.country}
                      </p>
                      <p className="text-xs text-zinc-400 font-medium leading-relaxed">
                        {transientDestination.description}
                      </p>
                    </div>

                    {/* Metadata tags */}
                    <div className="flex flex-wrap gap-1.5">
                      {transientDestination.tags.map(tag => (
                        <span key={tag} className="text-[8px] font-black text-white/70 uppercase tracking-widest bg-black/40 backdrop-blur-md px-2.5 py-1 rounded-full border border-white/5">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Highlights Summary */}
                  <div className="space-y-3">
                    <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-[0.2em] ml-1 block leading-none font-black">Curated Highlights</span>
                    <div className="grid grid-cols-1 gap-2">
                      {transientDestination.highlights.map((poi, idx) => (
                        <div key={idx} className="p-3.5 rounded-[18px] bg-zinc-900/40 border border-white/5 flex items-center gap-3">
                          <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary flex-shrink-0">
                            {poi.category === 'Food' ? <Utensils className="w-4 h-4" /> : <Compass className="w-4 h-4" />}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h5 className="text-xs font-black text-white truncate">{poi.title}</h5>
                            <p className="text-[10px] text-zinc-500 font-bold truncate">{poi.description}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Dual Action Buttons */}
                  <div className="grid grid-cols-2 gap-4 pt-4">
                    <button
                      onClick={handleCancelReRoll}
                      className="h-14 rounded-[24px] border border-white/10 text-xs font-black uppercase tracking-[0.2em] bg-zinc-900 text-zinc-400 hover:text-white transition-all active:scale-95"
                    >
                      Re-roll
                    </button>
                    <button
                      onClick={handleConfirmSave}
                      className="btn-primary w-full"
                    >
                      Confirm & Save
                    </button>
                  </div>
                </div>
              </motion.div>
            </div>
          </>
        )}
      </AnimatePresence>

      <Toast 
        message={toastMessage} 
        isOpen={showToast} 
        onClose={() => setShowToast(false)} 
      />
      <BottomNav />
    </main>
  );
}
