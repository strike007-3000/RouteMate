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
import { format, parseISO, differenceInDays, startOfDay, addDays, isSameDay } from 'date-fns';
import { motion, AnimatePresence, Reorder } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';

export default function TimelinePage() {
  const { id } = useParams();
  const tripId = Number(id);
  const router = useRouter();
  
  const { expandedDays, toggleDay, setExpandedDays } = useTripStore();
  
  const trip = useLiveQuery(() => db.trips.get(tripId), [tripId]);
  const points = useLiveQuery(
    () => db.itineraryItems.where('tripId').equals(tripId).toArray(),
    [tripId]
  ) || [];

  // Group items by date
  const groupedTimeline = useMemo(() => {
    if (!trip) return [];
    
    const start = startOfDay(parseISO(trip.startDate));
    const end = startOfDay(parseISO(trip.endDate));
    const totalDays = differenceInDays(end, start) + 1;
    
    return Array.from({ length: totalDays }).map((_, i) => {
      const currentDate = addDays(start, i);
      const currentDateStr = format(currentDate, 'yyyy-MM-dd');
      
      const items = points
        .filter(p => {
          const itemDateStr = format(parseISO(p.startTime), 'yyyy-MM-dd');
          return itemDateStr === currentDateStr;
        })
        .sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
      
      return {
        dayNumber: i + 1,
        date: currentDate.toISOString(),
        items
      };
    });
  }, [trip, points]);

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
  }, [trip, groupedTimeline, expandedDays.length]);

  if (!trip) return null;

  return (
    <main className="min-h-screen bg-black pb-32 w-full max-w-md mx-auto border-x border-border/50 shadow-2xl relative overflow-x-hidden flex flex-col">
      {/* Hero Background Layer */}
      <div className="absolute top-0 left-0 w-full h-64 overflow-hidden pointer-events-none">
        {trip.coverImage && (
          <>
            <img 
              src={trip.coverImage} 
              alt="" 
              className="w-full h-full object-cover blur-3xl opacity-40 scale-150"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black to-black" />
          </>
        )}
      </div>

      <Header />
      
      <div className="p-4 pt-10 relative z-10">
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 p-6 rounded-[2.5rem] bg-zinc-900/40 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-3 h-3 text-primary" />
            <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">{trip.destination}</span>
          </div>
          <h1 className="text-3xl font-black text-white tracking-tighter leading-none">
            {trip.name}
          </h1>
          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2 italic">
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
                      className="overflow-hidden bg-zinc-900/10 rounded-b-3xl"
                    >
                      <div className="px-2 pb-6 space-y-0">
                        {day.items.length > 0 ? (
                          <Reorder.Group 
                            axis="y" 
                            values={day.items} 
                            onReorder={(newOrder) => {
                              // We only update the order if it actually changed
                              const { updatePointOrder } = useTripStore.getState();
                              updatePointOrder(newOrder);
                            }}
                            className="space-y-0"
                          >
                            {day.items.map((item, idx) => {
                              const nextItem = day.items[idx + 1];
                              return (
                                <Reorder.Item 
                                  key={item.id} 
                                  value={item}
                                  initial={{ opacity: 0 }}
                                  animate={{ opacity: 1 }}
                                  exit={{ opacity: 0 }}
                                >
                                  <TimelineItem point={item} />
                                  {nextItem && <TransitCard from={item} to={nextItem} />}
                                </Reorder.Item>
                              );
                            })}
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
