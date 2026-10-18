import { db } from '@/lib/db';

export async function exportTrip(tripId: number) {
  const trip = await db.trips.get(tripId);
  if (!trip) throw new Error('Trip not found');
  const items = await db.itineraryItems.where('tripId').equals(tripId).toArray();
  const expenses = await db.tripExpenses.where('tripId').equals(tripId).toArray();
  const lists = await db.tripLists.where('tripId').equals(tripId).toArray();
  
  const payload = {
    exportedAt: new Date().toISOString(),
    trip,
    itinerary: items,
    expenses,
    lists
  };
  
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `routemate-trip-${tripId}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export async function importTrip(file: File) {
  const text = await file.text();
  const data = JSON.parse(text);
  // Minimal validation
  if (!data.trip || !data.trip.id) throw new Error('Invalid export');
  // Import logic would merge into DB – simplified for MVP
  return data;
}
