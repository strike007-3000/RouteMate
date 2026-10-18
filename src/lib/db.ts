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
  sortOrder: number;
  isTimeExplicit?: boolean;
  coordinates?: {
    lat: number;
    lng: number;
  };
  notes?: string;
  links?: string[];
}

export interface HighlightItem {
  title: string;
  description: string;
  category: 'Flight' | 'Lodging' | 'Train' | 'Food' | 'Activity' | 'Rental';
  address: string;
}

export interface Destination {
  id: string;
  name: string;
  country: string;
  image: string;
  description: string;
  tags: string[];
  category: 'Cities' | 'Beaches' | 'Nature' | 'Culture';
  highlights: HighlightItem[];
}

export class RouteMateDatabase extends Dexie {
  trips!: Table<Trip>;
  itineraryItems!: Table<ItineraryItem>;
  favorites!: Table<Favorite>;
  destinations!: Table<Destination>;
  tripExpenses!: Table<TripExpense>;
  tripLists!: Table<TripList>;
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

    this.version(4).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder'
    }).upgrade(async (tx) => {
      // Migration: Initial sortOrder to 0
      await tx.table('itineraryItems').toCollection().modify(item => {
        if (item.sortOrder === undefined) item.sortOrder = 0;
      });
    });

    this.version(5).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit'
    }).upgrade(async (tx) => {
      // Migration: Default isTimeExplicit to true for legacy items
      await tx.table('itineraryItems').toCollection().modify(item => {
        if (item.isTimeExplicit === undefined) item.isTimeExplicit = true;
      });
    });

    this.version(6).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit',
      favorites: '++id, name, category, image'
    });

    this.version(7).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit',
      favorites: '++id, name, category, image',
      destinations: 'id, name, country, category'
    });

    this.version(8).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit',
      favorites: '++id, name, category, image',
      destinations: 'id, name, country, category',
      tripExpenses: '++id, tripId, payer, createdAt'
    });

    this.version(9).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit',
      favorites: '++id, name, category, image',
      destinations: 'id, name, country, category',
      tripExpenses: '++id, tripId, payer, createdAt',
      tripLists: '++id, tripId, type'
    });

    this.version(10).stores({
      trips: '++id, name, destination, startDate, status',
      itineraryItems: '++id, tripId, type, startTime, category, sortOrder, isTimeExplicit',
      favorites: '++id, name, category, image',
      destinations: 'id, name, country, category',
      tripExpenses: '++id, tripId, payer, createdAt',
      tripLists: '++id, tripId, type'
    });
  }
}

export interface Favorite {
  id?: number;
  name: string;
  category: string;
  image: string;
  location?: string;
}

export interface TripExpense {
  id?: number;
  tripId: number;
  amount: number;
  currency: string;
  payer: string;
  participants: string[];
  notes?: string;
  createdAt: string;
}

export interface ListItem {
  id: string;
  text: string;
  checked: boolean;
}

export interface TripList {
  id?: number;
  tripId: number;
  type: 'packing' | 'todo' | 'shopping';
  title: string;
  items: ListItem[];
  createdAt: string;
}

export const db = new RouteMateDatabase();

