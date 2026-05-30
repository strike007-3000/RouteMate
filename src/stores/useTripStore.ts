import { create } from 'zustand';
import { db, Trip, ItineraryItem } from '@/lib/db';
import { sortItinerary } from '@/lib/itineraryUtils';

export type PointType = 'hotel' | 'flight' | 'attraction' | 'transit';

export interface TravelMetadata {
  departureCity?: string;
  arrivalCity?: string;
  airportCode?: string;
  terminal?: string;
  hotelName?: string;
  [key: string]: unknown;
}

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
  metadata?: TravelMetadata;
}

interface TripState {
  trips: Trip[];
  activeTrip: Trip | null;
  points: ItineraryItem[];
  isHydrated: boolean;
  expandedDays: string[]; // ['YYYY-MM-DD'] towns that are open
  viewMode: 'itinerary' | 'timeline';
  
  // App Logic
  setViewMode: (mode: 'itinerary' | 'timeline') => void;
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
  updatePointTime: (id: number, startTime: string) => Promise<void>;
  updatePointMetadata: (id: number, metadata: TravelMetadata) => Promise<void>;
  sortItinerary: (points: ItineraryItem[]) => ItineraryItem[];
}

export const useTripStore = create<TripState>((set, get) => ({
  trips: [],
  activeTrip: null,
  points: [],
  isHydrated: false,
  expandedDays: [],
  viewMode: 'itinerary',

  setViewMode: (mode) => set({ viewMode: mode }),

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
    try {
      const trip = await db.trips.get(id);
      if (trip) {
        const points = await db.itineraryItems.where('tripId').equals(id).toArray();
        set({ 
          activeTrip: trip, 
          points: get().sortItinerary(points)
        });
      }
    } catch (error) {
      console.error(`Failed to set active trip ${id}:`, error);
    }
  },

  createTrip: async (trip) => {
    try {
      const id = await db.trips.add(trip);
      await get().fetchTrips();
      return id as number;
    } catch (error) {
      console.error('Failed to create trip:', error);
      throw error;
    }
  },

  duplicateTrip: async (id) => {
    const trip = await db.trips.get(id);
    if (!trip) return;
    
    try {
      await db.transaction('rw', [db.trips, db.itineraryItems], async () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { id: _, ...tripData } = trip;
        const newTripId = await db.trips.add({ 
          ...tripData, 
          name: `${tripData.name} (Copy)`,
          status: 'draft' 
        });
        
        const points = await db.itineraryItems.where('tripId').equals(id).toArray();
        const newPoints = points.map((item) => {
          const newItem = { ...item, tripId: newTripId as number };
          delete newItem.id;
          return newItem;
        });
        
        await db.itineraryItems.bulkAdd(newPoints);
      });
      await get().fetchTrips();
    } catch (error) {
      console.error(`Failed to duplicate trip ${id}:`, error);
    }
  },

  deleteTrip: async (id) => {
    try {
      await db.transaction('rw', [db.trips, db.itineraryItems], async () => {
        await db.itineraryItems.where('tripId').equals(id).delete();
        await db.trips.delete(id);
      });
      await get().fetchTrips();
      if (get().activeTrip?.id === id) {
        set({ activeTrip: null, points: [] });
      }
    } catch (error) {
      console.error(`Failed to delete trip ${id}:`, error);
    }
  },

  addPoint: async (point) => {
    if (!get().activeTrip?.id) return;
    const tripId = get().activeTrip!.id!;
    
    try {
      // Remove temporary id to avoid ConstraintError (Key already exists)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { id: _, ...pointData } = point as ItineraryItem;

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
    } catch (error) {
      console.error('Failed to add itinerary point:', error);
    }
  },

  removePoint: async (id: number) => {
    if (!get().activeTrip?.id) return;
    try {
      await db.itineraryItems.where('id').equals(id).delete();
      const updated = get().points.filter((p) => p.id !== id);
      set({ points: updated });
    } catch (error) {
      console.error(`Failed to remove point ${id}:`, error);
    }
  },

  updatePointOrder: async (orderedPoints: ItineraryItem[]) => {
    if (!get().activeTrip?.id) return;
    
    try {
      // Update sortOrder for each item based on its index in the array
      const updates = orderedPoints.map((p, idx) => ({
        ...p,
        sortOrder: idx
      }));
      
      await db.transaction('rw', db.itineraryItems, async () => {
        await db.itineraryItems.bulkPut(updates);
      });

      set({ points: updates });
    } catch (error) {
      console.error('Failed to update point order:', error);
    }
  },

  updatePointTime: async (id: number, startTime: string) => {
    if (!get().activeTrip?.id) return;
    
    try {
      await db.transaction('rw', db.itineraryItems, async () => {
        await db.itineraryItems.update(id, { startTime, isTimeExplicit: true });
      });
      
      const tripId = get().activeTrip!.id!;
      const updated = await db.itineraryItems.where('tripId').equals(tripId).toArray();
      set({ points: get().sortItinerary(updated) });
    } catch (error) {
      console.error(`Failed to update point time for ${id}:`, error);
    }
  },

  updatePointMetadata: async (id: number, metadata: TravelMetadata) => {
    if (!get().activeTrip?.id) return;
    
    try {
      const point = await db.itineraryItems.get(id);
      if (!point) return;

      const newMetadata = { ...point.metadata, ...metadata };
      
      await db.transaction('rw', db.itineraryItems, async () => {
        await db.itineraryItems.update(id, { metadata: newMetadata });
      });
      
      const tripId = get().activeTrip!.id!;
      const updated = await db.itineraryItems.where('tripId').equals(tripId).toArray();
      set({ points: get().sortItinerary(updated) });
    } catch (error) {
      console.error(`Failed to update point metadata for ${id}:`, error);
    }
  },

  /**
   * Core Sorting Engine: Implements 'Human-First' logistical flow.
   * Delegated to standalone utility for testability.
   */
  sortItinerary: (points) => sortItinerary(points),
}));
