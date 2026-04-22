import { create } from 'zustand';
import { db, Trip, ItineraryItem } from '@/lib/db';
import { format } from 'date-fns';

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

  /**
   * Core Sorting Engine: Implements 'Human-First' logistical flow.
   * 1. Groups by Date
   * 2. Respects Manual sortOrder
   * 3. Uses Explicit/Predicted Time
   * 4. Tie-breaks with Logistical Ranking (Checkout -> Departure -> Arrival -> Checkin)
   * 
   * Special Logic:
   * - Detects 'Home Base' from the first flight to identify return flights.
   * - Forces Day 1 departures to the top.
   * - Forces Last Day return flights to the bottom.
   */
  sortItinerary: (points) => {
    if (points.length === 0) return [];
    
    // 0. Pre-calculate Trip Context for Smart Sorting
    // Identify the origin of the trip to detect when the traveler is 'heading home'
    const sortedByStart = [...points].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    const firstFlight = sortedByStart.find(p => p.category === 'Flight' && p.title.toLowerCase().includes('departure'));
    const homeBase = (firstFlight?.metadata as any)?.departureCity?.toLowerCase();
    
    // Day boundaries for contextual overrides
    const lastDate = format(new Date(Math.max(...points.map(p => new Date(p.startTime).getTime()))), 'yyyy-MM-dd');
    const firstDate = format(new Date(Math.min(...points.map(p => new Date(p.startTime).getTime()))), 'yyyy-MM-dd');

    /**
     * Determines the logistical rank (1-7) for same-day items.
     * Lower numbers = Earlier in the day.
     */
    const getRank = (item: ItineraryItem) => {
      const title = item.title.toLowerCase();
      const cat = item.category;
      const date = format(new Date(item.startTime), 'yyyy-MM-dd');
      const isDay1 = date === firstDate;
      const isLastDay = date === lastDate;

      // Smart Return Flight Detection: If we land in the home city, this is the trip's anchor.
      const arrivalCity = (item.metadata as any)?.arrivalCity?.toLowerCase();
      const isReturnFlight = cat === 'Flight' && arrivalCity === homeBase;

      // Priority 1: Home Base Departure (Force to top on Day 1)
      if (isDay1 && cat === 'Flight' && title.includes('departure')) return -100;
      
      // Suppression: On Day 1, if we have a checkout from Home Base, or transit from Home Base, suppress it.
      // (Simplified by giving it a rank that might be ignored if we add a 'filter' later, but for now we rank it low)
      if (isDay1 && (title.includes('check-out from') && title.includes(homeBase || ''))) return 1000;

      // Priority 6: Return Flight (Link home arrival sequence to absolute bottom)
      // Any flight arriving at home base, or departing to arrive at home base, is part of the final anchor.
      if (isReturnFlight) {
        return title.includes('departure') ? 1999 : 2000;
      }

      // 1-5 Logistical Sequence for normal days
      if (cat === 'Lodging' && title.includes('check-out')) return 1;
      if (cat === 'Flight' && title.includes('departure')) return 2;
      if (cat === 'Flight' && title.includes('arrival')) return 3;
      if (cat === 'Lodging' && title.includes('check-in')) return 4;
      
      return 5; // Activities, Food, etc.
    };

    const getSortTime = (item: ItineraryItem) => {
      const date = new Date(item.startTime);
      if (item.isTimeExplicit === false) {
        const title = item.title.toLowerCase();
        let hour = CATEGORY_DEFAULTS.ACTIVITY;

        // Use slightly shifted hours to help stabilize sort if multiple Predicted items exist
        if (item.category === 'Lodging') {
          hour = title.includes('check-out') ? CATEGORY_DEFAULTS.CHECK_OUT : CATEGORY_DEFAULTS.CHECK_IN;
        } else if (item.category === 'Flight') {
          hour = title.includes('arrival') ? CATEGORY_DEFAULTS.FLIGHT_ARRIVAL : CATEGORY_DEFAULTS.FLIGHT_DEPARTURE;
        }

        date.setHours(hour, 0, 0, 0);
      }
      return date.getTime();
    };

    return [...points].sort((a, b) => {
      const dateA = format(new Date(a.startTime), 'yyyy-MM-dd');
      const dateB = format(new Date(b.startTime), 'yyyy-MM-dd');
      
      // 1. Primary Sort: Day
      if (dateA !== dateB) {
        return new Date(a.startTime).getTime() - new Date(b.startTime).getTime();
      }
      
      // 2. Rank 6 Override: Lock Return Flights to the absolute bottom of the day
      const rankA = getRank(a);
      const rankB = getRank(b);
      const isReturnA = rankA >= 1999;
      const isReturnB = rankB >= 1999;
      if (isReturnA && !isReturnB) return 1;
      if (!isReturnA && isReturnB) return -1;
      
      // 3. Secondary Sort: Manual sortOrder (if defined and non-zero)
      const orderA = a.sortOrder || 0;
      const orderB = b.sortOrder || 0;
      if (orderA !== orderB) return orderA - orderB;

      // 4. Tertiary Sort: Time (Explicit or Predicted)
      const timeA = getSortTime(a);
      const timeB = getSortTime(b);
      if (timeA !== timeB) return timeA - timeB;

      // 5. Final Tie-breaker: Logistical Rank
      return rankA - rankB;
    });
  },
}));
