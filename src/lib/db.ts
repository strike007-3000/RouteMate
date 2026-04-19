import Dexie, { type Table } from 'dexie';
import { TripPoint } from '@/stores/useTripStore';

export interface Trip {

  id?: number;
  name: string;
  destination: string;
  startDate: string;
  endDate: string;
  coverImage?: string;
  status: 'upcoming' | 'past' | 'draft';
}

export interface ItineraryItem extends TripPoint {
  tripId: number;
  category: 'Flight' | 'Lodging' | 'Train' | 'Food' | 'Activity' | 'Rental';
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export class RouteMateDatabase extends Dexie {
  trips!: Table<Trip>;
  itineraryItems!: Table<ItineraryItem>;
  points!: Table<TripPoint>; // Kept for v1 migration

  constructor() {
    super('RouteMateDB');
    
    this.version(1).stores({
      points: 'id, type, startTime'
    });

    this.version(2).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime',
      points: null
    });

    this.version(3).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category'
    }).upgrade(async (tx) => {
      // Migration: Default existing items to 'Activity'
      await tx.table('itineraryItems').toCollection().modify(item => {
        if (!item.category) item.category = 'Activity';
      });
    });
  }
}

export const db = new RouteMateDatabase();

