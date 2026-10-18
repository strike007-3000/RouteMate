/** @typedef {import('./db').Trip} Trip */
/** @typedef {import('./db').ItineraryItem} ItineraryItem */
/** @typedef {import('./db').TripExpense} TripExpense */
/** @typedef {import('./db').TripList} TripList */
/** @typedef {{ trip: Trip, itinerary: ItineraryItem[], expenses: TripExpense[], lists: TripList[] }} TripExport */

const tripStatuses = new Set(['upcoming', 'past', 'draft']);
const pointTypes = new Set(['hotel', 'flight', 'attraction', 'transit']);
const categories = new Set(['Flight', 'Lodging', 'Train', 'Food', 'Activity', 'Rental']);
const listTypes = new Set(['packing', 'todo', 'shopping']);
const isoDatePattern = /^\d{4}-\d{2}-\d{2}$/;
const isoDateTimePattern = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(?::\d{2}(?:\.\d{1,3})?)?(?:Z|[+-]\d{2}:\d{2})?$/;

/** @param {unknown} value */
const isRecord = (value) => Boolean(value) && typeof value === 'object';

/** @param {unknown} value */
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;

/** @param {unknown} value */
const isDateString = (value) => {
  if (!isNonEmptyString(value) || (!isoDatePattern.test(value) && !isoDateTimePattern.test(value))) return false;
  const [year, month, day] = value.slice(0, 10).split('-').map(Number);
  const calendarDate = new Date(Date.UTC(year, month - 1, day));
  return calendarDate.getUTCFullYear() === year
    && calendarDate.getUTCMonth() === month - 1
    && calendarDate.getUTCDate() === day
    && !Number.isNaN(Date.parse(value));
};

/** @param {unknown} value */
const hasOptionalNumericId = (value) => value === undefined || (typeof value === 'number' && Number.isFinite(value));

/** @param {unknown} value */
const isCoordinates = (value) => {
  if (value === undefined) return true;
  if (!isRecord(value)) return false;
  const coordinates = /** @type {Record<string, unknown>} */ (value);
  return typeof coordinates.lat === 'number'
    && Number.isFinite(coordinates.lat)
    && typeof coordinates.lng === 'number'
    && Number.isFinite(coordinates.lng);
};

/** @param {unknown} value */
function isTrip(value) {
  if (!isRecord(value)) return false;
  const trip = /** @type {Record<string, unknown>} */ (value);
  return hasOptionalNumericId(trip.id)
    && isNonEmptyString(trip.name)
    && isNonEmptyString(trip.destination)
    && isDateString(trip.startDate)
    && isDateString(trip.endDate)
    && typeof trip.status === 'string'
    && tripStatuses.has(trip.status)
    && (trip.coverImage === undefined || typeof trip.coverImage === 'string');
}

/** @param {unknown} value */
function isItineraryItem(value) {
  if (!isRecord(value)) return false;
  const item = /** @type {Record<string, unknown>} */ (value);
  return hasOptionalNumericId(item.id)
    && typeof item.tripId === 'number'
    && Number.isFinite(item.tripId)
    && typeof item.type === 'string'
    && pointTypes.has(item.type)
    && typeof item.category === 'string'
    && categories.has(item.category)
    && isNonEmptyString(item.title)
    && typeof item.address === 'string'
    && isDateString(item.startTime)
    && isDateString(item.endTime)
    && typeof item.sortOrder === 'number'
    && Number.isFinite(item.sortOrder)
    && (item.isTimeExplicit === undefined || typeof item.isTimeExplicit === 'boolean')
    && isCoordinates(item.coordinates)
    && (item.metadata === undefined || isRecord(item.metadata))
    && (item.notes === undefined || typeof item.notes === 'string')
    && (item.links === undefined || (Array.isArray(item.links) && item.links.every(isNonEmptyString)));
}

/** @param {unknown} value */
function isExpense(value) {
  if (!isRecord(value)) return false;
  const expense = /** @type {Record<string, unknown>} */ (value);
  return hasOptionalNumericId(expense.id)
    && typeof expense.tripId === 'number'
    && Number.isFinite(expense.tripId)
    && typeof expense.amount === 'number'
    && Number.isFinite(expense.amount)
    && expense.amount > 0
    && isNonEmptyString(expense.currency)
    && isNonEmptyString(expense.payer)
    && Array.isArray(expense.participants)
    && expense.participants.length > 0
    && expense.participants.every(isNonEmptyString)
    && (expense.notes === undefined || typeof expense.notes === 'string')
    && isDateString(expense.createdAt);
}

/** @param {unknown} value */
function isList(value) {
  if (!isRecord(value)) return false;
  const list = /** @type {Record<string, unknown>} */ (value);
  return hasOptionalNumericId(list.id)
    && typeof list.tripId === 'number'
    && Number.isFinite(list.tripId)
    && typeof list.type === 'string'
    && listTypes.has(list.type)
    && isNonEmptyString(list.title)
    && Array.isArray(list.items)
    && list.items.every((item) => {
      if (!isRecord(item)) return false;
      const entry = /** @type {Record<string, unknown>} */ (item);
      return isNonEmptyString(entry.id)
        && isNonEmptyString(entry.text)
        && typeof entry.checked === 'boolean';
    })
    && isDateString(list.createdAt);
}

/**
 * @param {unknown} value
 * @returns {value is TripExport}
 */
function isTripExport(value) {
  if (!isRecord(value)) return false;
  const data = /** @type {Record<string, unknown>} */ (value);
  if (!isTrip(data.trip)
    || !Array.isArray(data.itinerary)
    || !Array.isArray(data.expenses)
    || !Array.isArray(data.lists)) return false;

  const sourceTripId = /** @type {Record<string, unknown>} */ (data.trip).id;
  if (typeof sourceTripId !== 'number') return false;

  const belongsToTrip = (record) => isRecord(record)
    && /** @type {Record<string, unknown>} */ (record).tripId === sourceTripId;

  return data.itinerary.every(item => belongsToTrip(item) && isItineraryItem(item))
    && data.expenses.every(expense => belongsToTrip(expense) && isExpense(expense))
    && data.lists.every(list => belongsToTrip(list) && isList(list));
}

module.exports = { isTripExport };
