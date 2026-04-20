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

  return (
    <div className="px-4 pt-12">
      <div className="flex items-end justify-between mb-10 pr-2">
        <div className="flex flex-col">
          <span className="text-[10px] font-bold text-primary uppercase tracking-[0.3em] mb-1.5 leading-none ml-1">LOGISTICS</span>
          <h2 className="text-2xl font-black tracking-tighter text-white leading-none">Your Itinerary</h2>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onOpenSmartAdd}
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 border border-primary/20 text-primary hover:bg-primary/20 transition-all group"
        >
          <Sparkles className="w-4 h-4 group-hover:animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Smart Add</span>
        </motion.button>
      </div>
      
      <div className="space-y-4">
        {points.length > 0 && (
          <Reorder.Group 
            axis="y" 
            values={sortedPoints} 
            onReorder={(newOrder) => updatePointOrder(newOrder)}
            className="flex flex-col"
          >
            {sortedPoints.map((point, index) => (
              <DraggableItem 
                key={point.id} 
                point={point} 
                nextPoint={sortedPoints[index + 1]} 
              />
            ))}
          </Reorder.Group>
        )}
      </div>
        
      {points.length === 0 && (
        <div className="flex flex-col items-center justify-center py-32 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 0.1, scale: 1 }}
            className="mb-8"
          >
             <Sparkles className="w-24 h-24 text-primary" />
          </motion.div>
          <h3 className="text-xl font-black text-white tracking-tight mb-3">Nothing scheduled</h3>
          <p className="text-sm text-muted-foreground px-12 leading-relaxed font-bold">
            Use <button onClick={onOpenSmartAdd} className="text-primary hover:underline underline-offset-4 decoration-2">Smart Add</button> to fill the gap.
          </p>
        </div>
      )}

    </div>
  );
};
