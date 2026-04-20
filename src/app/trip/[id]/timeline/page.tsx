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
import { motion, AnimatePresence, Reorder, useDragControls } from 'framer-motion';
import { Sparkles, Calendar } from 'lucide-react';
import { TripHero } from '@/components/trip/TripHero';
import { useState } from 'react';

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
  const [isSmartAddOpen, setIsSmartAddOpen] = useState(false);
  
  const trip = useLiveQuery(() => db.trips.get(tripId), [tripId]);
  const points = useLiveQuery(
    () => db.itineraryItems.where('tripId').equals(tripId).toArray(),
    [tripId]
  ) || [];

  // Group items by date using the store's unified sorting logic
  const groupedTimeline = useMemo(() => {
    if (!trip) return [];
    
    // Ensure start and end are pinned to local 00:00 for stable iteration
    const start = startOfDay(parseISO(trip.startDate));
    const end = startOfDay(parseISO(trip.endDate));
    const totalDays = Math.max(1, differenceInDays(end, start) + 1);
    
    const sortedAllPoints = sortItinerary(points);
    
    return Array.from({ length: totalDays }).map((_, i) => {
      const currentDate = addDays(start, i);
      
      const items = sortedAllPoints.filter(p => {
        const itemDate = parseISO(p.startTime);
        
        // Logistical Buffering: If an item lands within 6 hours BEFORE the trip starts, 
        // we anchor it to Day 1 (e.g. late night airport arrivals). Otherwise, strict day matching.
        if (i === 0) {
          const tripStart = startOfDay(parseISO(trip.startDate));
          const diffInHours = (itemDate.getTime() - tripStart.getTime()) / 3600000;
          return isSameDay(itemDate, currentDate) || (diffInHours < 0 && diffInHours > -12);
        }
        
        return isSameDay(itemDate, currentDate);
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
    <main className="min-h-screen bg-black pb-32 w-full max-w-md mx-auto border-x border-border/50 shadow-2xl relative overflow-x-hidden flex flex-col font-sans">
      <Header />
      
      <TripHero 
        trip={trip} 
        mode="timeline" 
        onAction={() => setIsSmartAddOpen(true)} 
      />
      
      <div className="relative z-10 -mt-10">
        <div className="space-y-4 px-4 mb-8">
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

      <SmartPaste isOpen={isSmartAddOpen} onClose={() => setIsSmartAddOpen(false)} />
      <BottomNav />
    </main>
  );
}
