import { TripPoint } from '@/stores/useTripStore';
import { TransitProvider, TransitSuggestion } from './types';

/**
 * TransitousProvider: Primary free source (Open Transit Data)
 * Mocked logic for the MVP but follows Transitous response patterns.
 */
export class TransitousProvider implements TransitProvider {
  name = 'Transitous (Open Source)';

  async getRoute(from: TripPoint, to: TripPoint): Promise<TransitSuggestion | null> {
    // Artificial delay for realism
    await new Promise(r => setTimeout(r, 800));

    // For the MVP, we use the title to simulate a real search
    if (from.title.includes('LHR') || to.title.includes('Hotel')) {
      return {
        id: 'tra-' + Math.random().toString(36).substr(2, 5),
        mode: 'train',
        provider: 'National Rail / Transitous',
        duration: '42m',
        cost: '£0.00',
        description: 'Suggested route via Transitous Open Data. Reliable and community-verified.',
      };
    }

    return null; // Fallback to orchestrator
  }
}
