import { db } from '@/lib/db';

export class UnsplashService {
  private static ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

  static async getTripImage(tripId: number, query: string, userKey?: string): Promise<string | null> {
    const devKey = typeof window !== 'undefined' ? localStorage.getItem('dev_unsplash_key') : null;
    const key = userKey || devKey || this.ACCESS_KEY;
    
    // 1. Check if trip already has a cover image
    const trip = await db.trips.get(tripId);
    if (trip?.coverImage) return trip.coverImage;

    if (!key || key === 'your_unsplash_access_key' || key === '') {
      console.warn('Unsplash API key missing. Using dynamic placeholder.');
      return this.getPlaceholder(query);
    }

    try {
      // 2. Fetch from Unsplash with High Quality Filters
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' luxury travel landmark landscape')}&orientation=landscape&per_page=5&content_filter=high&featured=true`,
        {
          headers: {
            Authorization: `Client-ID ${key}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Unsplash API failed: ${response.status}`);

      const data = await response.json();
      const results = data.results || [];
      const imageUrl = results[0]?.urls?.regular || results[1]?.urls?.regular;

      if (imageUrl) {
        // 3. Cache in Dexie
        await db.trips.update(tripId, { coverImage: imageUrl });
        return imageUrl;
      }

      return this.getPlaceholder(query);
    } catch (error) {
      console.error('Unsplash Service Error:', error);
      return this.getPlaceholder(query);
    }
  }

  static async getCityImage(query: string, userKey?: string): Promise<string> {
    const devKey = typeof window !== 'undefined' ? localStorage.getItem('dev_unsplash_key') : null;
    const key = userKey || devKey || this.ACCESS_KEY;
    
    if (!key || key === 'your_unsplash_access_key' || key === '') {
      return this.getPlaceholder(query);
    }

    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' landmark scenery tourism')}&orientation=landscape&per_page=5&content_filter=high&featured=true`,
        {
          headers: {
            Authorization: `Client-ID ${key}`,
          },
        }
      );

      if (!response.ok) throw new Error(`Unsplash API failed: ${response.status}`);

      const data = await response.json();
      const results = data.results || [];
      return results[0]?.urls?.regular || results[1]?.urls?.regular || this.getPlaceholder(query);
    } catch (error) {
      console.error('Unsplash City Image Error:', error);
      return this.getPlaceholder(query);
    }
  }

  static getPlaceholder(query: string): string {
    // Return a high-quality, reliable scenic placeholder if everything else fails
    const fallbacks = [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1000', // Nature
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000', // Landscape
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000', // Foggy forest
    ];
    // Seeded random based on query length for stability
    return fallbacks[query.length % fallbacks.length];
  }
}
