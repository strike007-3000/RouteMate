import { db } from '@/lib/db';

export class UnsplashService {

  static async getTripImage(tripId: number, query: string, userKey?: string): Promise<string | null> {
    // 1. Check if trip already has a cover image
    const trip = await db.trips.get(tripId);
    if (trip?.coverImage) return trip.coverImage;

    try {
      const imageUrl = await this.fetchViaProxy(query, userKey);
      if (imageUrl) {
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
    try {
      const imageUrl = await this.fetchViaProxy(query, userKey);
      return imageUrl || this.getPlaceholder(query);
    } catch (error) {
      console.error('Unsplash City Image Error:', error);
      return this.getPlaceholder(query);
    }
  }

  private static async fetchViaProxy(query: string, userKey?: string): Promise<string | null> {
    const devKey = typeof window !== 'undefined' ? localStorage.getItem('dev_unsplash_key') : null;
    const key = userKey || devKey || '';

    const headers: HeadersInit = {};
    if (key) headers['x-user-unsplash-key'] = key;

    const res = await fetch(
      `/api/unsplash-image?query=${encodeURIComponent(query)}`,
      { headers }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.imageUrl || null;
  }

  static getPlaceholder(query: string): string {
    const fallbacks = [
      'https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&q=80&w=1000',
      'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&q=80&w=1000',
    ];
    return fallbacks[query.length % fallbacks.length];
  }
}
