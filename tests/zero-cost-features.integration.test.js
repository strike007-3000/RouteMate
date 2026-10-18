const fs = require('fs');
const path = require('path');

const read = (relativePath) => fs.readFileSync(path.join(__dirname, '..', relativePath), 'utf8');

const timeline = read('src/app/trip/[id]/timeline/TimelineClient.tsx');
const trips = read('src/app/trips/TripsClient.tsx');
const timelineItem = read('src/components/timeline/TimelineItem.tsx');
const checklist = read('src/components/trip/Checklist.tsx');
const expenseTracker = read('src/components/trip/ExpenseTracker.tsx');
const exportTrip = read('src/lib/exportTrip.ts');
const tripStore = read('src/stores/useTripStore.ts');

if (!/<ExpenseTracker tripId={tripId} \/>/.test(timeline) || !/<Checklist tripId={tripId} \/>/.test(timeline)) {
  throw new Error('Trip tools are not mounted on the reachable timeline route');
}

if (!/<TripPortability tripId={tripId} \/>/.test(timeline) || !/<TripPortability \/>/.test(trips)) {
  throw new Error('Trip import/export controls are not reachable');
}

if (!/viewMode === 'timeline' && \(\s*<NotesEditor item={point} \/>/.test(timelineItem)) {
  throw new Error('Empty itinerary items cannot open the notes editor');
}

if (!/\.\.\.PACKING_TEMPLATES\.packing, \.\.\.\(customItem \? \[customItem\] : \[\]\)/.test(checklist)) {
  throw new Error('Packing lists discard the custom item');
}

if (!/db\.tripExpenses\.where\('tripId'\).*\.delete\(\)/s.test(tripStore)
  || !/db\.tripLists\.where\('tripId'\).*\.delete\(\)/s.test(tripStore)) {
  throw new Error('Trip deletion leaves child records behind');
}

if (!/const newExpenses = expenses\.map/.test(tripStore)
  || !/const newLists = lists\.map/.test(tripStore)
  || !/db\.tripExpenses\.bulkAdd\(newExpenses\)/.test(tripStore)
  || !/db\.tripLists\.bulkAdd\(newLists\)/.test(tripStore)) {
  throw new Error('Trip duplication omits expenses or checklists');
}

if (!/type: record\.type \?\? getPointType\(record\.category\)/.test(exportTrip)) {
  throw new Error('Imported itinerary types are not normalized');
}

if (!/parseParticipants\(participants\)/.test(expenseTracker)
  || !/if \(participantsArr\.length === 0\) return;/.test(expenseTracker)) {
  throw new Error('Empty parsed participant lists are persisted');
}
if (!/e\.notes\?\.trim\(\)/.test(expenseTracker)) throw new Error('Saved expense notes are not rendered');

console.log('PASS zero-cost feature integration');
