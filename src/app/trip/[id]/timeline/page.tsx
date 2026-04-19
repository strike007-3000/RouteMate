'use client';

import React, { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useTripStore } from '@/stores/useTripStore';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { Header } from '@/components/layout/Header';
import { BottomNav } from '@/components/layout/BottomNav';
import { TimelineHeader } from '@/components/timeline/TimelineHeader';
import { TimelineItem } from '@/components/timeline/TimelineItem';
import { TransitCard } from '@/components/timeline/TransitCard';
import { SmartPaste } from '@/components/timeline/SmartPaste';
import { format, parseISO, differenceInDays, startOfDay, addDays } from 'date-fns';
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';

// Sub-component to handle drag controls per item
const TimelineReorderItem = ({ item, nextItem }: { item: ItineraryItem, nextItem?: ItineraryItem }) => {
  const dragControls = useDragControls();
  
  return (
    <Reorder.Item 
      value={item}
      dragListener={false}
      dragControls={dragControls}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileDrag={{ scale: 1.02, boxShadow: "0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)" }}
      className="relative"
    >
      <TimelineItem point={item} dragControls={dragControls} />
      {nextItem && <TransitCard from={item} to={nextItem} />}
    </Reorder.Item>
  );
};

export default function TimelinePage() {
  const { id } = useParams();
  const tripId = Number(id);
  const router = useRouter();
  
  const { expandedDays, toggleDay, setExpandedDays, sortItinerary } = useTripStore();
  
  const trip = useLiveQuery(() => db.trips.get(tripId), [tripId]);
  const points = useLiveQuery(
    () => db.itineraryItems.where('tripId').equals(tripId).toArray(),
    [tripId]
  ) || [];

  // Group items by date using the store's unified sorting logic
  const groupedTimeline = useMemo(() => {
    if (!trip) return [];
    
    const start = startOfDay(parseISO(trip.startDate));
    const end = startOfDay(parseISO(trip.endDate));
    const totalDays = differenceInDays(end, start) + 1;
    
    const sortedAllPoints = sortItinerary(points);
    
    return Array.from({ length: totalDays }).map((_, i) => {
      const currentDate = addDays(start, i);
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      
      const items = sortedAllPoints.filter(p => {
        const itemDateStr = format(parseISO(p.startTime), 'yyyy-MM-dd');
        return itemDateStr === currentDateStr;
      });
      
      return {
        dayNumber: i + 1,
        date: currentDate.toISOString(),
        items
      };
    });
  }, [trip, points, sortItinerary]);

  // Handle Initial Expansion
  useEffect(() => {
    if (trip && expandedDays.length === 0) {
      const today = startOfDay(new Date());
      const tripStart = startOfDay(parseISO(trip.startDate));
      const tripEnd = startOfDay(parseISO(trip.endDate));
      
      if (today >= tripStart && today <= tripEnd) {
        setExpandedDays([today.toISOString().split('T')[0]]);
      } else if (groupedTimeline.length > 0) {
        setExpandedDays([groupedTimeline[0].date.split('T')[0]]);
      }
    }
  }, [trip, groupedTimeline, expandedDays.length, setExpandedDays]);

  if (!trip) return null;

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-md mx-auto border-x border-border/50 shadow-2xl relative overflow-x-hidden flex flex-col">
      {/* Hero Background Layer */}
      <div className="absolute top-0 left-0 w-full h-80 overflow-hidden pointer-events-none">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-black/40 to-black z-[1]" />
        {trip.coverImage && trip.coverImage !== "" ? (
          <img 
            src={trip.coverImage} 
            alt="" 
            className="w-full h-full object-cover blur-sm opacity-60 scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 via-zinc-900 to-black" />
        )}
      </div>

      <Header />
      
      <div className="p-4 pt-14 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10 p-8 rounded-[3rem] bg-black/40 backdrop-blur-2xl border border-white/10 shadow-2xl ring-1 ring-white/5"
        >
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-primary animate-pulse" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em]">{trip.destination}</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tighter leading-tight">
            {trip.name}
          </h1>
          <p className="text-[11px] text-zinc-400 font-bold uppercase tracking-widest mt-4 flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-zinc-600" />
            {format(parseISO(trip.startDate), 'MMM dd')} — {format(parseISO(trip.endDate), 'MMM dd, yyyy')}
          </p>
        </motion.div>
        
        <div className="space-y-4">
          {groupedTimeline.map((day) => {
            const dateStr = day.date.split('T')[0];
            const isExpanded = expandedDays.includes(dateStr);
            
            return (
              <div key={day.date} className="relative">
                <TimelineHeader 
                  dayNumber={day.dayNumber}
                  date={day.date}
                  categories={day.items.map(item => item.category)}
                  isExpanded={isExpanded}
                  onToggle={() => toggleDay(dateStr)}
                />
                
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden bg-white/[0.02] rounded-b-3xl"
                    >
                      <div className="px-2 pb-8 pt-2">
                        {day.items.length > 0 ? (
                          <Reorder.Group 
                            axis="y" 
                            values={day.items} 
                            onReorder={(newOrder) => {
                              const { updatePointOrder } = useTripStore.getState();
                              updatePointOrder(newOrder);
                            }}
                            className="space-y-0"
                          >
                            {day.items.map((item, idx) => (
                              <TimelineReorderItem 
                                key={item.id} 
                                item={item} 
                                nextItem={day.items[idx + 1]} 
                              />
                            ))}
                          </Reorder.Group>
                        ) : (
                          <div className="py-10 text-center flex flex-col items-center gap-3">
                            <Calendar className="w-8 h-8 text-zinc-700" />
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">No plans for this day</p>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        {points.length === 0 && (
          <div className="mt-20 text-center flex flex-col items-center gap-6">
             <div className="w-20 h-20 rounded-full bg-primary/5 flex items-center justify-center border border-primary/20">
                <Sparkles className="w-10 h-10 text-primary" />
             </div>
             <div>
                <h3 className="text-xl font-black text-white">Empty Itinerary</h3>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mt-2">
                  Use Smart Add to fuel your trip.
                </p>
             </div>
          </div>
        )}
      </div>

      <BottomNav />
    </main>
  );
}
