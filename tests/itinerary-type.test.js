const { getPointType } = require('../src/lib/tripExportValidation.js');

const expected = {
  Flight: 'flight',
  Lodging: 'hotel',
  Train: 'transit',
  Rental: 'transit',
  Food: 'attraction',
  Activity: 'attraction'
};

for (const [category, type] of Object.entries(expected)) {
  if (getPointType(category) !== type) throw new Error(`${category} type was not normalized`);
}

if (getPointType('Unknown') !== undefined) throw new Error('Unknown category received a type');

console.log('PASS itinerary type normalization');
