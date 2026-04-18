import { create } from 'zustand';
import { persist } from 'zustand/middleware';

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
  addPoint: (point: TripPoint) => void;
  removePoint: (id: string) => void;
  setPoints: (points: TripPoint[]) => void;
}

export const useTripStore = create<TripState>()(
  persist(
    (set) => ({
      points: [
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
      ],
      addPoint: (point) => set((state) => ({ points: [...state.points, point].sort((a, b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()) })),
      removePoint: (id) => set((state) => ({ points: state.points.filter((p) => p.id !== id) })),
      setPoints: (points) => set({ points }),
    }),
    {
      name: 'routemate-trip-storage',
    }
  )
);
