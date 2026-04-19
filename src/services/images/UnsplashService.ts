import { db } from '@/lib/db';

export class UnsplashService {
  private static ACCESS_KEY = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY || '';

  static async getTripImage(tripId: number, query: string, userKey?: string): Promise<string | null> {
    const key = userKey || this.ACCESS_KEY;
    
    // 1. Check if trip already has a cover image
    const trip = await db.trips.get(tripId);
    if (trip?.coverImage) return trip.coverImage;

    if (!key || key === 'your_unsplash_access_key') {
      console.warn('Unsplash API key missing. Using dynamic placeholder.');
      return this.getPlaceholder(query);
    }

    try {
      // 2. Fetch from Unsplash
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query + ' landscape')}&orientation=landscape&per_page=1`,
        {
          headers: {
            Authorization: `Client-ID ${key}`,
          },
        }
      );

      if (!response.ok) throw new Error('Unsplash API failed');

      const data = await response.json();
      const imageUrl = data.results?.[0]?.urls?.regular;

      if (imageUrl) {
        // 3. Cache in Dexie
        await db.trips.update(tripId, { coverImage: imageUrl });
        return imageUrl;
      }

      return null;
    } catch (error) {
      console.error('Unsplash Service Error:', error);
      return this.getPlaceholder(query);
    }
  }

  static getPlaceholder(query: string): string {
    // Premium dark gradient placeholder with query text center-aligned
    // Using a reliable placeholder service or just a CSS-based approach in the component
    return `https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000`; // Default scenic placeholder
  }
}
