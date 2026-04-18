import { create } from 'zustand';
import { db, Trip, ItineraryItem } from '@/lib/db';

export type PointType = 'hotel' | 'flight' | 'attraction' | 'transit';

export interface TripPoint {
  id: string;
  type: PointType;
  title: string;
  address: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  metadata?: Record<string, any>;
}

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  points: ItineraryItem[];
  isHydrated: boolean;
  
  // Trip Actions
  fetchTrips: () => Promise<void>;
  setActiveTrip: (id: number) => Promise<void>;
  createTrip: (trip: Omit<Trip, 'id'>) => Promise<number>;
  duplicateTrip: (id: number) => Promise<void>;
  deleteTrip: (id: number) => Promise<void>;

  
  // Itinerary Actions
  addPoint: (point: Omit<ItineraryItem, 'id'>) => Promise<void>;
  removePoint: (id: string) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  activeTrip: null,
  points: [],
  isHydrated: false,
  
  fetchTrips: async () => {
    const allTrips = await db.trips.toArray();
    set({ trips: allTrips });
  },

  setActiveTrip: async (id: number) => {
    const trip = await db.trips.get(id);
    if (trip) {
      const points = await db.itineraryItems.where('tripId').equals(id).toArray();
      set({ 
        activeTrip: trip, 
        points: points.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) 
      });
    }
  },

  createTrip: async (trip) => {
    const id = await db.trips.add(trip);
    await get().fetchTrips();
    return id as number;
  },

  duplicateTrip: async (id) => {
    const trip = await db.trips.get(id);
    if (!trip) return;
    
    await db.transaction('rw', [db.trips, db.itineraryItems], async () => {
      const { id: _, ...tripData } = trip;
      const newTripId = await db.trips.add({ 
        ...tripData, 
        name: `${tripData.name} (Copy)`,
        status: 'draft' 
      });
      
      const points = await db.itineraryItems.where('tripId').equals(id).toArray();
      const newPoints = points.map(({ id: _, ...item }) => ({
        ...item,
        tripId: newTripId as number
      }));
      
      await db.itineraryItems.bulkAdd(newPoints);
    });
    await get().fetchTrips();
  },

  deleteTrip: async (id) => {

    await db.transaction('rw', [db.trips, db.itineraryItems], async () => {
      await db.itineraryItems.where('tripId').equals(id).delete();
      await db.trips.delete(id);
    });
    await get().fetchTrips();
    if (get().activeTrip?.id === id) {
      set({ activeTrip: null, points: [] });
    }
  },

  addPoint: async (point) => {
    if (!get().activeTrip?.id) return;
    const item = { ...point, tripId: get().activeTrip!.id! } as ItineraryItem;
    await db.itineraryItems.add(item);
    const updated = await db.itineraryItems.where('tripId').equals(get().activeTrip!.id!).toArray();
    set({ points: updated.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) });
  },

  removePoint: async (id) => {
    if (!get().activeTrip?.id) return;
    await db.itineraryItems.where('id').equals(id).delete();
    const updated = get().points.filter((p) => p.id !== id);
    set({ points: updated });
  },
}));


