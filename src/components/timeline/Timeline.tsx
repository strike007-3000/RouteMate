'use client';

import React from 'react';
import { useTripStore } from '@/stores/useTripStore';
import { TimelineItem } from './TimelineItem';
import { TransitCard } from './TransitCard';
import { Plus, Sparkles } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { Reorder, motion, useDragControls } from 'framer-motion';
import { format, isToday, startOfDay } from 'date-fns';

const DraggableItem = ({ point, nextPoint }: { point: ItineraryItem, nextPoint?: ItineraryItem }) => {
  const dragControls = useDragControls();
  
  return (
    <Reorder.Item 
      value={point} 
      dragListener={false} 
      dragControls={dragControls}
      className="relative mb-4"
    >
      <TimelineItem point={point} dragControls={dragControls} />
      {nextPoint && <TransitCard from={point} to={nextPoint} />}
    </Reorder.Item>
  );
};

export const Timeline = ({ onOpenSmartAdd }: { onOpenSmartAdd: () => void }) => {
  const { activeTrip, updatePointOrder } = useTripStore();
  
  const points = useLiveQuery<ItineraryItem[]>(
    () => activeTrip?.id ? db.itineraryItems.where('tripId').equals(activeTrip.id).toArray() : Promise.resolve([] as ItineraryItem[]),
    [activeTrip?.id]
  ) || [];

  const sortedPoints = React.useMemo(() => 
    points ? useTripStore.getState().sortItinerary(points) : [],
    [points]
  );

  // Group by date for section headers
  const groupedDates = React.useMemo(() => {
    const groups: Record<string, ItineraryItem[]> = {};
    sortedPoints.forEach(p => {
      const date = format(new Date(p.startTime), 'yyyy-MM-dd');
      if (!groups[date]) groups[date] = [];
      groups[date].push(p);
    });
    return groups;
  }, [sortedPoints]);

  const dates = Object.keys(groupedDates).sort();

  return (
    <div className="p-6 pt-12">
      <div className="flex items-center justify-between w-full mb-8">
        <h2 className="text-2xl font-black tracking-tighter text-white">Your Itinerary</h2>
        <div className="flex gap-2">
          <motion.button 
            whileTap={{ scale: 0.95 }}
            onClick={onOpenSmartAdd}
            className="px-4 h-10 rounded-2xl bg-primary text-white flex items-center justify-center gap-2 text-xs font-bold shadow-lg shadow-primary/20"
          >
            <Sparkles className="w-4 h-4" />
            Smart Add
          </motion.button>
        </div>
      </div>
      
      <div className="space-y-12">
        {dates.map((dateString) => {
          const date = new Date(dateString);
          const dayPoints = groupedDates[dateString];
          
          return (
            <div key={dateString} className="relative">
              {/* Sticky Date Header */}
              <div className="sticky top-0 z-20 py-4 mb-6 bg-black/80 backdrop-blur-md flex items-center gap-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-black text-primary uppercase tracking-[0.3em]">
                    {format(date, 'EEEE')}
                    {isToday(date) && " • TODAY"}
                  </span>
                  <span className="text-lg font-black text-white tracking-tighter">
                    {format(date, 'MMMM do')}
                  </span>
                </div>
                <div className="flex-1 h-[1px] bg-white/10" />
              </div>

              <Reorder.Group 
                axis="y" 
                values={dayPoints} 
                onReorder={(newOrder) => {
                  const otherPoints = sortedPoints.filter(p => format(startOfDay(new Date(p.startTime)), 'yyyy-MM-dd') !== dateString);
                  updatePointOrder([...otherPoints, ...newOrder]);
                }}
                className="flex flex-col"
              >
                {dayPoints.map((point, index) => (
                  <DraggableItem 
                    key={point.id} 
                    point={point} 
                    nextPoint={dayPoints[index + 1]} 
                  />
                ))}
              </Reorder.Group>
            </div>
          );
        })}
      </div>
        
      {points.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-20 h-20 rounded-full bg-secondary flex items-center justify-center mb-6">
             <Plus className="w-10 h-10 text-muted-foreground" />
          </div>
          <h3 className="text-xl font-bold mb-2">No plans yet</h3>
          <p className="text-sm text-muted-foreground px-12 leading-relaxed">
            Start by pasting a confirmation email or adding a manual destination.
          </p>
        </div>
      )}
    </div>
  );
};
