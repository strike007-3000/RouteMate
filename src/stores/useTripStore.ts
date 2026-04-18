import { create } from 'zustand';
import { db } from '@/lib/db';

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
  points: TripPoint[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  addPoint: (point: TripPoint) => Promise<void>;
  removePoint: (id: string) => Promise<void>;
  setPoints: (points: TripPoint[]) => Promise<void>;
}

export const useTripStore = create<TripState>((set, get) => ({
  points: [],
  isHydrated: false,
  
  hydrate: async () => {
    const allPoints = await db.points.toArray();
    
    // Initial mock data if empty
    if (allPoints.length === 0) {
      const initial = [
        {
          id: '1',
          type: 'flight',
          title: 'Arrival at LHR',
          address: 'Heathrow Airport, Longford TW6, UK',
          startTime: '2026-05-20T10:00:00Z',
          endTime: '2026-05-20T10:30:00Z',
        },
        {
          id: '2',
          type: 'hotel',
          title: 'CitizenM Hotel',
          address: '40 Marsh Wall, London E14 9TP, UK',
          startTime: '2026-05-20T15:00:00Z',
          endTime: '2026-05-25T11:00:00Z',
        }
      ] as TripPoint[];
      await db.points.bulkAdd(initial);
      set({ points: initial, isHydrated: true });
    } else {
      set({ points: allPoints.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()), isHydrated: true });
    }
  },

  addPoint: async (point) => {
    await db.points.add(point);
    const updated = [...get().points, point].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime());
    set({ points: updated });
  },

  removePoint: async (id) => {
    await db.points.delete(id);
    set({ points: get().points.filter((p) => p.id !== id) });
  },

  setPoints: async (points) => {
    await db.points.clear();
    await db.points.bulkAdd(points);
    set({ points: points.sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) });
  },
}));

