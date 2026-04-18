import { TripPoint } from '@/stores/useTripStore';

export interface TransitSuggestion {
  id: string;
  mode: 'bus' | 'train' | 'walk' | 'subway' | 'unknown';
  provider: string;
  duration: string;
  cost: string;
  description: string;
  externalUrl?: string; // Deep link to Google Maps or other
  distance?: number; // In meters, for internal logic
  departureTime?: string;
}


export interface TransitProvider {
  name: string;
  getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null>;
}
