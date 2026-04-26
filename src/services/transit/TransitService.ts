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
    
    const orsKey = process.env.NEXT_PUBLIC_ORS_API_KEY || process.env.ORS_API_KEY;
    
    // Server-safe key detection. 
    this.providers = [
      new OpenRouteServiceProvider(orsKey || undefined),
      new GoogleMapsProvider(), 
      new MockProvider() 
    ];

  }


  async getCheapRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion> {
    const errors: string[] = [];
    for (const provider of this.providers) {
      try {
        const suggestion = await provider.getRoute(from, to);
        if (suggestion) {
          return suggestion;
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        errors.push(`${provider.name}: ${msg}`);
        console.error(`Provider ${provider.name} failed:`, msg);
      }
    }

    // Default emergency fallback
    return {
      id: `err-${crypto.randomUUID()}`,
      mode: 'walk',
      provider: 'System Default',
      duration: 'Unknown',
      cost: 'Free',
      description: errors.length > 0 
        ? `Transit calculation failed across ${errors.length} providers. Check connectivity.` 
        : 'Unable to calculate specific route. Check local signs.'
    };
  }
}

// Singleton for API use
export const transitService = new TransitService();
