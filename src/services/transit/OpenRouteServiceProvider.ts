import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';

export class OpenRouteServiceProvider implements TransitProvider {
  name = 'OpenRouteService';

  constructor(private apiKey?: string) {}

  private async geocode(address: string): Promise<[number, number] | null> {
    if (!this.apiKey) return null;
    try {
      const resp = await fetch(`https://api.openrouteservice.org/geocode/search?text=${encodeURIComponent(address)}&layers=venue,address,coarse&size=1`, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });
      
      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`ORS Geocode failed (${resp.status}): ${errorText}`);
      }

      const data = await resp.json();
      if (data.features && data.features.length > 0) {
        return data.features[0].geometry.coordinates as [number, number];
      }
    } catch (err) {
      console.error('ORS geocoding error:', err instanceof Error ? err.message : err);
    }
    return null;
  }

  async getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null> {
    if (!this.apiKey) return null;

    try {
      // PERFORMANCE: Fetch geocodes in parallel
      const [fromCoords, toCoords] = await Promise.all([
        this.geocode(from.address),
        this.geocode(to.address)
      ]);

      if (!fromCoords || !toCoords) {
        console.warn('ORS: Could not geocode one or both points');
        return null;
      }

      const resp = await fetch(`https://api.openrouteservice.org/v2/directions/foot-walking?start=${fromCoords.join(',')}&end=${toCoords.join(',')}`, {
        headers: {
          'Authorization': this.apiKey,
          'Content-Type': 'application/json'
        }
      });

      if (!resp.ok) {
        const errorText = await resp.text();
        throw new Error(`ORS Routing failed (${resp.status}): ${errorText}`);
      }

      const data = await resp.json();

      if (data.features && data.features.length > 0) {
        const route = data.features[0].properties.summary;
        const distance = route.distance; // in meters

        // Only return ORS results for walking (< 2km)
        if (distance > 2000) return null;

        return {
          id: `ors-${crypto.randomUUID()}`,
          mode: 'walk',
          provider: 'ORS Walking',
          duration: `${Math.round(route.duration / 60)}m`,
          cost: 'Free',
          description: `A pleasant walk (${Math.round(distance)}m). Detailed directions available in timeline.`,
          distance: distance
        };
      }
    } catch (err) {
      console.error('ORS routing error:', err instanceof Error ? err.message : err);
    }

    return null;
  }
}
