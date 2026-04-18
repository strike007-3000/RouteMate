import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';
import { MockProvider } from './MockProvider';
import { GoogleMapsProvider } from './GoogleMapsProvider';
import { OpenRouteServiceProvider } from './OpenRouteServiceProvider';

export class TransitService {

  private providers: TransitProvider[];

  constructor() {
    // Current configuration: 
    // 1. OpenRouteService (High accuracy walking < 2km)
    // 2. Transitous (Primary Open Transit)
    // 3. Google Maps (Primary Deep Link for Transit > 2km)
    // 4. Mock (Fallback)
    
    // Reading from Zustand persist storage in LocalStorage
    let orsKey = process.env.ORS_API_KEY;
    
    if (typeof window !== 'undefined') {
      const storage = localStorage.getItem('routemate-settings');
      if (storage) {
        try {
          const parsed = JSON.parse(storage);
          orsKey = parsed.state?.orsApiKey || orsKey;
        } catch (e) {
          console.error('Failed to parse settings for TransitService', e);
        }
      }
    }

    this.providers = [
      new OpenRouteServiceProvider(orsKey || undefined),
      new GoogleMapsProvider(), 
      new MockProvider() 
    ];

  }


  async getCheapRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion> {
    for (const provider of this.providers) {
      try {
        const suggestion = await provider.getRoute(from, to);
        if (suggestion) {
          return suggestion;
        }
      } catch (err) {
        console.error(`Provider ${provider.name} failed:`, err);
      }
    }

    // Default emergency fallback
    return {
      id: 'err-' + Math.random().toString(36).substr(2, 5),
      mode: 'walk',
      provider: 'System Default',
      duration: 'Unknown',
      cost: 'Free',
      description: 'Unable to calculate specific route. Check local signs.'
    };
  }
}

// Singleton for API use
export const transitService = new TransitService();
