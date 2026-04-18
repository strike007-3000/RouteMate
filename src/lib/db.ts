import Dexie, { type Table } from 'dexie';
import { TripPoint } from '@/stores/useTripStore';

export class RouteMateDatabase extends Dexie {
  points!: Table<TripPoint>;

  constructor() {
    super('RouteMateDB');
    this.version(1).stores({
      points: 'id, type, startTime' // primary key and indices
    });
  }
}

export const db = new RouteMateDatabase();
