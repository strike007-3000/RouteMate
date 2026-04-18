import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';

export class MockProvider implements TransitProvider {
  name = 'Mock Service';

  async getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null> {
    const fromText = (from.title + ' ' + from.address).toLowerCase();
    const toText = (to.title + ' ' + to.address).toLowerCase();

    // Heuristics moved from transit.ts
    if (fromText.includes('airport') || fromText.includes('lhr') || fromText.includes('jfk')) {
      if (fromText.includes('lhr') || fromText.includes('heathrow')) {
        return {
          id: Math.random().toString(36).substr(2, 9),
          mode: 'train',
          provider: 'Elizabeth Line',
          duration: '35m',
          cost: '£0.00',
          description: 'Take the Elizabeth Line towards Canary Wharf. Multi-modal fallback.',
        };
      }
      if (fromText.includes('jfk')) {
         return {
          id: Math.random().toString(36).substr(2, 9),
          mode: 'subway',
          provider: 'MTA AirTrain + Blue Line',
          duration: '50m',
          cost: '$0.00',
          description: 'Take the AirTrain to Howard Beach. Using MockProvider heuristics.',
        };
      }
    }

    if (from.type === 'hotel' && to.type === 'attraction') {
       return {
        id: Math.random().toString(36).substr(2, 9),
        mode: 'walk',
        provider: 'Walking Map',
        duration: '12m',
        cost: 'Free',
        description: 'Estimated walking distance based on mock coordinates.',
      };
    }

    return {
      id: Math.random().toString(36).substr(2, 9),
      mode: 'bus',
      provider: 'Local Bus Service',
      duration: '22m',
      cost: 'Free',
      description: 'Standard mock bus connection.',
    };
  }
}
