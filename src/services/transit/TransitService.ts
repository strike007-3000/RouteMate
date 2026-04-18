import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';
import { MockProvider } from './MockProvider';
import { TransitousProvider } from './TransitousProvider';
import { HereMapsProvider } from './HereMapsProvider';

export class TransitService {
  private providers: TransitProvider[];

  constructor() {
    // Priority order: HERE (if key present) -> Transitous -> Mock Fallback
    const hereKey = process.env.HERE_API_KEY;

    this.providers = [
      new HereMapsProvider(hereKey),
      new TransitousProvider(),
      new MockProvider() // Heuristic fallback is always last
    ];
  }

  async getCheapRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion> {
    for (const provider of this.providers) {
      try {
        const suggestion = await provider.getRoute(from, to);
        if (suggestion) {
          console.log(`Logistics source: ${provider.name}`);
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
