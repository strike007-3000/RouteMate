import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';

export class GoogleMapsProvider implements TransitProvider {
  name = 'Google Maps Transit';

  async getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null> {
    // We always provide a Google Maps fallback for transit
    // unless the locations are identical (unlikely in this context)
    
    const queryOrigin = encodeURIComponent(from.address || from.title);
    const queryDest = encodeURIComponent(to.address || to.title);
    
    // Deep link format: https://www.google.com/maps/dir/?api=1&origin={origin}&destination={destination}&travelmode=transit
    const deepLink = `https://www.google.com/maps/dir/?api=1&origin=${queryOrigin}&destination=${queryDest}&travelmode=transit`;

    return {
      id: `google-${crypto.randomUUID()}`,
      mode: 'bus',
      provider: 'Google Maps',
      duration: 'Live Data',
      cost: 'Varies',
      description: 'Check real-time local transit schedules, live arrivals, and platform info.',
      externalUrl: deepLink
    };
  }
}
