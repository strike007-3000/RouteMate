// RED phase: test itinerary notes schema
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '../src/lib/db.ts');

function testNotesSchema() {
  const content = fs.readFileSync(dbFile, 'utf8');
  const hasVersion = /version\(10\)/.test(content);
  const hasNotesField = /notes\?: string/.test(content);
  const hasLinksField = /links\?: string\[\]/.test(content);
  
  console.log('Schema contains version 10:', hasVersion);
  console.log('Schema contains notes field:', hasNotesField);
  console.log('Schema contains links field:', hasLinksField);
  
  if (!hasVersion || !hasNotesField || !hasLinksField) {
    console.error('FAIL: Notes schema not implemented');
    process.exit(1);
  }
  console.log('PASS: Notes schema present');
}

testNotesSchema();
