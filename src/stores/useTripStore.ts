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
  isTimeExplicit?: boolean;
  coordinates?: { lat: number; lng: number };
  metadata?: Record<string, unknown>;
}

const CATEGORY_DEFAULTS = {
  CHECK_OUT: 10,       // 10:00 AM
  FLIGHT_DEPARTURE: 11, // 11:00 AM
  ACTIVITY: 13,        // 01:00 PM
  FLIGHT_ARRIVAL: 16,  // 04:00 PM
  CHECK_IN: 18,       // 06:00 PM
};

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
    const tripId = get().activeTrip!.id!;
    
    // Remote temporary id to avoid ConstraintError (Key already exists)
    const { id: _, ...pointData } = point as any;

    // Auto-Split Lodging Logic
    if (pointData.category === 'Lodging') {
      const start = new Date(pointData.startTime);
      const end = new Date(pointData.endTime);
      const isMultiDay = start.toDateString() !== end.toDateString();

      if (isMultiDay) {
        // Create Check-in
        const checkIn: ItineraryItem = {
          ...pointData,
          tripId,
          title: `Check-in at ${pointData.title}`,
          endTime: pointData.startTime, // One-point event
          sortOrder: 0,
          isTimeExplicit: pointData.isTimeExplicit ?? false
        } as ItineraryItem;

        // Create Check-out
        const checkOut: ItineraryItem = {
          ...pointData,
          tripId,
          title: `Check-out from ${pointData.title}`,
          startTime: pointData.endTime,
          endTime: pointData.endTime,
          sortOrder: 0,
          isTimeExplicit: pointData.isTimeExplicit ?? false
        } as ItineraryItem;

        await db.itineraryItems.bulkAdd([checkIn, checkOut]);
      } else {
        await db.itineraryItems.add({ ...pointData, tripId, sortOrder: 0 } as ItineraryItem);
      }
    } else {
      await db.itineraryItems.add({ ...pointData, tripId, sortOrder: 0 } as ItineraryItem);
    }

    const updated = await db.itineraryItems.where('tripId').equals(tripId).toArray();
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
    const getSortTime = (item: ItineraryItem) => {
      const date = new Date(item.startTime);
      if (item.isTimeExplicit === false) {
        const title = item.title.toLowerCase();
        let hour = CATEGORY_DEFAULTS.ACTIVITY;

        if (item.category === 'Lodging') {
          hour = title.includes('check-out') ? CATEGORY_DEFAULTS.CHECK_OUT : CATEGORY_DEFAULTS.CHECK_IN;
        } else if (item.category === 'Flight') {
          hour = title.includes('arrival') ? CATEGORY_DEFAULTS.FLIGHT_ARRIVAL : CATEGORY_DEFAULTS.FLIGHT_DEPARTURE;
        }

        date.setHours(hour, 0, 0, 0);
      }
      return date.getTime();
    };

    const getCategoryRank = (item: ItineraryItem) => {
      const title = item.title.toLowerCase();
      const category = item.category;

      if (category === 'Lodging') {
        if (title.includes('check-out')) return 1;
        if (title.includes('check-in')) return 5;
        return 5;
      }
      if (category === 'Flight') {
        if (title.includes('arrival')) return 4;
        if (title.includes('departure')) return 3;
        return 2;
      }
      if (category === 'Train') return 3;
      return 6; // Activity, Food, etc.
    };

    return [...points].sort((a, b) => {
      const dateA = new Date(a.startTime).toDateString();
      const dateB = new Date(b.startTime).toDateString();
      
      // 1. Primary Sort: Day
      if (dateA !== dateB) {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      
      // 2. Secondary Sort: Manual sortOrder (if defined and non-zero)
      const orderA = a.sortOrder || 0;
      const orderB = b.sortOrder || 0;
      if (orderA !== orderB) return orderA - orderB;

      // 3. Tertiary Sort: Time (Explicit or Predicted)
      const timeA = getSortTime(a);
      const timeB = getSortTime(b);
      if (timeA !== timeB) return timeA - timeB;

      // 4. Final Tie-breaker: Category Rank
      return getCategoryRank(a) - getCategoryRank(b);
    });
  },
}));
