import { db, type ItineraryItem, type Trip, type TripExpense, type TripList } from '@/lib/db';

interface TripExport {
  trip: Trip;
  itinerary: ItineraryItem[];
  expenses: TripExpense[];
  lists: TripList[];
}

function isTripExport(value: unknown): value is TripExport {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<TripExport>;
  return Boolean(
    data.trip
    && typeof data.trip.name === 'string'
    && Array.isArray(data.itinerary)
    && Array.isArray(data.expenses)
    && Array.isArray(data.lists)
  );
}

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
  const data: unknown = JSON.parse(text);
  if (!isTripExport(data)) throw new Error('Invalid export');

  return db.transaction('rw', [db.trips, db.itineraryItems, db.tripExpenses, db.tripLists], async () => {
    const trip = { ...data.trip };
    delete trip.id;
    const newTripId = Number(await db.trips.add(trip));

    const remap = <T extends { id?: number; tripId: number }>(record: T) => {
      const copy = { ...record };
      delete copy.id;
      return { ...copy, tripId: newTripId };
    };

    await db.itineraryItems.bulkAdd(data.itinerary.map(remap));
    await db.tripExpenses.bulkAdd(data.expenses.map(remap));
    await db.tripLists.bulkAdd(data.lists.map(remap));

    return newTripId;
  });
}
