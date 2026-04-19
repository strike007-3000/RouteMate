import { create } from 'zustand';
import { db, Trip, ItineraryItem } from '@/lib/db';

export type PointType = 'hotel' | 'flight' | 'attraction' | 'transit';

export interface TripPoint {
  id?: number;
  type: PointType;
  category?: 'Flight' | 'Lodging' | 'Train' | 'Food' | 'Activity' | 'Rental';
  title: string;
  address: string;
  startTime: string; // ISO string
  endTime: string;   // ISO string
  coordinates?: { lat: number; lng: number };
  metadata?: Record<string, any>;
}

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  points: ItineraryItem[];
  isHydrated: boolean;
  expandedDays: string[]; // ['YYYY-MM-DD'] towns that are open
  
  // App Logic
  getBestTimelineTrip: () => Promise<number | null>;
  toggleDay: (date: string) => void;
  setExpandedDays: (dates: string[]) => void;
  
  // Trip Actions
  fetchTrips: () => Promise<void>;
  setActiveTrip: (id: number) => Promise<void>;
  createTrip: (trip: Omit<Trip, 'id'>) => Promise<number>;
  duplicateTrip: (id: number) => Promise<void>;
  deleteTrip: (id: number) => Promise<void>;

  
  // Itinerary Actions
  addPoint: (point: Omit<ItineraryItem, 'id'>) => Promise<void>;
  removePoint: (id: number) => Promise<void>;
  updatePointOrder: (points: ItineraryItem[]) => Promise<void>;
  sortItinerary: (points: ItineraryItem[]) => ItineraryItem[];
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  activeTrip: null,
  points: [],
  isHydrated: false,
  expandedDays: [],

  toggleDay: (date) => set((state) => ({
    expandedDays: state.expandedDays.includes(date)
      ? state.expandedDays.filter(d => d !== date)
      : [...state.expandedDays, date]
  })),

  setExpandedDays: (dates) => set({ expandedDays: dates }),

  getBestTimelineTrip: async () => {
    const state = get();
    // 1. If activeTrip is set, use it
    if (state.activeTrip?.id) return state.activeTrip.id;

    // 2. Find closest future trip
    const now = new Date().toISOString();
    const futureTrip = await db.trips
      .where('startDate')
      .aboveOrEqual(now)
      .sortBy('startDate');
    
    if (futureTrip.length > 0) return futureTrip[0].id!;

    // 3. Fallback to any trip
    const anyTrip = await db.trips.orderBy('startDate').reverse().first();
    return anyTrip?.id || null;
  },
  
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
        points: get().sortItinerary(points)
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
    set({ points: get().sortItinerary(updated) });
  },

  removePoint: async (id: number) => {
    if (!get().activeTrip?.id) return;
    await db.itineraryItems.where('id').equals(id).delete();
    const updated = get().points.filter((p) => p.id !== id);
    set({ points: updated });
  },

  updatePointOrder: async (orderedPoints: ItineraryItem[]) => {
    if (!get().activeTrip?.id) return;
    
    // Update sortOrder for each item based on its index in the array
    const updates = orderedPoints.map((p, idx) => ({
      ...p,
      sortOrder: idx
    }));
    
    await db.transaction('rw', db.itineraryItems, async () => {
      for (const p of updates) {
        if (p.id) {
          await db.itineraryItems.update(p.id, { sortOrder: p.sortOrder });
        }
      }
    });

    set({ points: updates });
  },

  sortItinerary: (points) => {
    const getCategoryRank = (item: ItineraryItem) => {
      const title = item.title.toLowerCase();
      const category = item.category;

      if (category === 'Flight') {
        if (title.includes('arrival')) return 1;
        if (title.includes('departure')) return 6;
        return 1; // Default flight to top
      }
      if (category === 'Train') {
        if (title.includes('arrival')) return 2;
        return 2;
      }
      if (category === 'Lodging') {
        if (title.includes('check-in')) return 3;
        if (title.includes('check-out')) return 5;
        return 3;
      }
      return 4; // Food, Activity, Rental, etc.
    };

    return [...points].sort((a, b) => {
      const timeA = new Date(a.startTime).getTime();
      const timeB = new Date(b.startTime).getTime();
      
      if (timeA !== timeB) {
        return timeA - timeB;
      }
      
      const rankDiff = getCategoryRank(a) - getCategoryRank(b);
      if (rankDiff !== 0) return rankDiff;

      return (a.sortOrder || 0) - (b.sortOrder || 0);
    });
  },
}));
