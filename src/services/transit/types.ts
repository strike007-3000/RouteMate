import { TripPoint } from '@/stores/useTripStore';

export interface TransitSuggestion {
  id: string;
  mode: 'bus' | 'train' | 'walk' | 'subway' | 'unknown';
  provider: string;
  duration: string;
  cost: string;
  description: string;
  departureTime?: string;
}

export interface TransitProvider {
  name: string;
  getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null>;
}
