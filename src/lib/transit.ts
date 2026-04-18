import { TripPoint } from '@/stores/useTripStore';

export interface TransitSuggestion {
  id: string;
  mode: 'bus' | 'train' | 'walk' | 'subway';
  provider: string;
  duration: string;
  cost: string;
  description: string;
  departureTime?: string;
}

export function getCheapRoute(from: TripPoint, to: TripPoint): TransitSuggestion {
  const fromText = (from.title + ' ' + from.address).toLowerCase();
  const toText = (to.title + ' ' + to.address).toLowerCase();

  // Logic: Airport to City
  if (fromText.includes('airport') || fromText.includes('lhr') || fromText.includes('jfk')) {
    if (fromText.includes('lhr') || fromText.includes('heathrow')) {
      return {
        id: Math.random().toString(36).substr(2, 9),
        mode: 'train',
        provider: 'Elizabeth Line',
        duration: '35m',
        cost: '£0.00',
        description: 'Take the Elizabeth Line towards Canary Wharf. Rapid, air-conditioned, and covered by your Travel Pass.',
      };
    }
    if (fromText.includes('jfk')) {
       return {
        id: Math.random().toString(36).substr(2, 9),
        mode: 'subway',
        provider: 'MTA AirTrain + Blue Line',
        duration: '50m',
        cost: '$0.00',
        description: 'Take the AirTrain to Howard Beach, then catch the A Train. Use your OMNY cap for a free ride.',
      };
    }
  }

  // Logic: Proximity (Walk)
  if (from.type === 'hotel' && to.type === 'attraction') {
     return {
      id: Math.random().toString(36).substr(2, 9),
      mode: 'walk',
      provider: 'Walking',
      duration: '12m',
      cost: 'Free',
      description: 'A pleasant walk through the local district. Best for sight-seeing.',
    };
  }

  // Default: Local Bus
  return {
    id: Math.random().toString(36).substr(2, 9),
    mode: 'bus',
    provider: 'Local Bus Network',
    duration: '25m',
    cost: '£0.00',
    description: 'Use the local bus network. High frequency and cost is capped daily.',
  };
}
