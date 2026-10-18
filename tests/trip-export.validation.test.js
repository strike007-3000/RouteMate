const { isTripExport } = require('../src/lib/tripExportValidation.js');

const valid = {
  trip: {
    id: 4,
    name: 'Trip to Brussels',
    destination: 'Brussels',
    startDate: '2026-10-18',
    endDate: '2026-10-20',
    status: 'upcoming'
  },
  itinerary: [{
    id: 1,
    tripId: 4,
    type: 'attraction',
    category: 'Activity',
    title: 'Grand Place',
    address: 'Brussels',
    startTime: '2026-10-18T12:00:00Z',
    endTime: '2026-10-18T13:00:00Z',
    sortOrder: 0
  }],
  expenses: [{
    id: 2,
    tripId: 4,
    amount: 20,
    currency: 'EUR',
    payer: 'Alice',
    participants: ['Alice', 'Bob'],
    createdAt: '2026-10-18T10:00:00Z'
  }],
  lists: [{
    id: 3,
    tripId: 4,
    type: 'packing',
    title: 'Essentials',
    items: [{ id: 'passport', text: 'Passport', checked: false }],
    createdAt: '2026-10-18T10:00:00Z'
  }]
};

if (!isTripExport(valid)) throw new Error('Valid export was rejected');
const typeOmitted = { ...valid, itinerary: [{ ...valid.itinerary[0], type: undefined }] };
if (!isTripExport(typeOmitted)) throw new Error('Derivable itinerary type was rejected');
if (isTripExport({ ...valid, trip: { id: 4, name: 'Incomplete' } })) throw new Error('Incomplete trip was accepted');
if (isTripExport({ ...valid, trip: { ...valid.trip, startDate: '10/18/2026' } })) throw new Error('Non-ISO trip date was accepted');
if (isTripExport({ ...valid, trip: { ...valid.trip, startDate: '2026-02-31' } })) throw new Error('Invalid calendar date was accepted');
if (isTripExport({ ...valid, itinerary: [{ ...valid.itinerary[0], startTime: 'invalid' }] })) throw new Error('Invalid itinerary date was accepted');
if (isTripExport({ ...valid, itinerary: [{ ...valid.itinerary[0], links: {} }] })) throw new Error('Invalid itinerary links were accepted');
if (isTripExport({ ...valid, expenses: [{ ...valid.expenses[0], tripId: 99 }] })) throw new Error('Mismatched child tripId was accepted');
if (isTripExport({ ...valid, lists: [{ ...valid.lists[0], items: [{ id: '', text: '', checked: false }] }] })) throw new Error('Invalid list item was accepted');

console.log('PASS trip export validation');
