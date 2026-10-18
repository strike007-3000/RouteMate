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

/**
 * @param {string} category
 * @returns {'hotel' | 'flight' | 'attraction' | 'transit' | undefined}
 */
function getPointType(category) {
  if (category === 'Flight') return 'flight';
  if (category === 'Lodging') return 'hotel';
  if (category === 'Train' || category === 'Rental') return 'transit';
  if (category === 'Food' || category === 'Activity') return 'attraction';
  return undefined;
}

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
  const hasRequiredFields = hasOptionalNumericId(trip.id)
    && isNonEmptyString(trip.name)
    && isNonEmptyString(trip.destination)
    && isDateString(trip.startDate)
    && isDateString(trip.endDate)
    && typeof trip.status === 'string'
    && tripStatuses.has(trip.status)
    && (trip.coverImage === undefined || typeof trip.coverImage === 'string');
  return hasRequiredFields && Date.parse(/** @type {string} */ (trip.endDate)) >= Date.parse(/** @type {string} */ (trip.startDate));
}

/** @param {unknown} value */
function isItineraryItem(value) {
  if (!isRecord(value)) return false;
  const item = /** @type {Record<string, unknown>} */ (value);
  const expectedType = typeof item.category === 'string' ? getPointType(item.category) : undefined;
  return hasOptionalNumericId(item.id)
    && typeof item.tripId === 'number'
    && Number.isFinite(item.tripId)
    && (item.type === undefined || (typeof item.type === 'string' && pointTypes.has(item.type) && item.type === expectedType))
    && typeof item.category === 'string'
    && categories.has(item.category)
    && expectedType !== undefined
    && isNonEmptyString(item.title)
    && typeof item.address === 'string'
    && isDateString(item.startTime)
    && isDateString(item.endTime)
    && Date.parse(/** @type {string} */ (item.endTime)) >= Date.parse(/** @type {string} */ (item.startTime))
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
  const participants = Array.isArray(expense.participants) ? expense.participants : [];
  const uniqueParticipants = new Set(participants.filter(isNonEmptyString).map(participant => participant.toLocaleLowerCase()));
  return hasOptionalNumericId(expense.id)
    && typeof expense.tripId === 'number'
    && Number.isFinite(expense.tripId)
    && typeof expense.amount === 'number'
    && Number.isFinite(expense.amount)
    && expense.amount > 0
    && isNonEmptyString(expense.currency)
    && isNonEmptyString(expense.payer)
    && participants.length > 0
    && participants.every(isNonEmptyString)
    && uniqueParticipants.size === participants.length
    && (expense.notes === undefined || typeof expense.notes === 'string')
    && isDateString(expense.createdAt);
}

/** @param {unknown} value */
function isList(value) {
  if (!isRecord(value)) return false;
  const list = /** @type {Record<string, unknown>} */ (value);
  const items = Array.isArray(list.items) ? list.items : [];
  const itemIds = new Set(items.filter(isRecord).map(item => item.id));
  return hasOptionalNumericId(list.id)
    && typeof list.tripId === 'number'
    && Number.isFinite(list.tripId)
    && typeof list.type === 'string'
    && listTypes.has(list.type)
    && isNonEmptyString(list.title)
    && Array.isArray(list.items)
    && items.every((item) => {
      if (!isRecord(item)) return false;
      const entry = /** @type {Record<string, unknown>} */ (item);
      return isNonEmptyString(entry.id)
        && isNonEmptyString(entry.text)
        && typeof entry.checked === 'boolean';
    })
    && itemIds.size === items.length
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
  const trip = /** @type {Record<string, unknown>} */ (data.trip);
  const tripStart = /** @type {string} */ (trip.startDate);
  const tripEnd = /** @type {string} */ (trip.endDate);

  const belongsToTrip = (record) => isRecord(record)
    && /** @type {Record<string, unknown>} */ (record).tripId === sourceTripId;
  const occursDuringTrip = (item) => {
    if (!isRecord(item)) return false;
    const record = /** @type {Record<string, unknown>} */ (item);
    return typeof record.startTime === 'string'
      && typeof record.endTime === 'string'
      && record.startTime.slice(0, 10) >= tripStart
      && record.endTime.slice(0, 10) <= tripEnd;
  };

  return data.itinerary.every(item => belongsToTrip(item) && isItineraryItem(item) && occursDuringTrip(item))
    && data.expenses.every(expense => belongsToTrip(expense) && isExpense(expense))
    && data.lists.every(list => belongsToTrip(list) && isList(list));
}

module.exports = { getPointType, isTripExport };
