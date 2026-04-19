'use client';

import { TimelineItem } from './TimelineItem';
import { TransitCard } from './TransitCard';
import { Plus, Sparkles } from 'lucide-react';
import { useLiveQuery } from 'dexie-react-hooks';
import { db, ItineraryItem } from '@/lib/db';
import { motion } from 'framer-motion';

export const Timeline = ({ onOpenSmartAdd }: { onOpenSmartAdd: () => void }) => {
  const { activeTrip } = useTripStore();
  
  const points = useLiveQuery<ItineraryItem[]>(
    () => activeTrip?.id ? db.itineraryItems.where('tripId').equals(activeTrip.id).toArray() : Promise.resolve([] as ItineraryItem[]),
    [activeTrip?.id]
  ) || [];

  const sortedPoints = points ? [...points].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) : [];

  return (
    <div className="p-6 pt-12">

      <div className="flex items-center justify-between w-full mb-6">
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
          <motion.button 
            whileTap={{ scale: 0.95 }}
            className="w-10 h-10 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary"
          >
            <Plus className="w-6 h-6" />
          </motion.button>
        </div>
      </div>
      
      <div className="flex flex-col">
        {sortedPoints.map((point, index) => {
          const nextPoint = sortedPoints[index + 1];
          return (
            <React.Fragment key={point.id}>
              <TimelineItem point={point} />
              {nextPoint && <TransitCard from={point} to={nextPoint} />}
            </React.Fragment>
          );
        })}
        
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

      </div>
    </div>
  );
};

