// RED phase: test that DB schema includes checklists
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '../src/lib/db.ts');

function testSchemaContainsChecklists() {
  const content = fs.readFileSync(dbFile, 'utf8');
  const hasVersion = /version\(9\)/.test(content);
  const hasTable = /tripLists/.test(content);
  const hasInterface = /interface TripList/.test(content);
  const hasItem = /interface ListItem/.test(content);
  
  console.log('Schema contains version 9:', hasVersion);
  console.log('Schema contains tripLists table:', hasTable);
  console.log('Schema contains TripList interface:', hasInterface);
  console.log('Schema contains ListItem interface:', hasItem);
  
  if (!hasVersion || !hasTable || !hasInterface || !hasItem) {
    console.error('FAIL: Checklist schema not implemented');
    process.exit(1);
  }
  console.log('PASS: Checklist schema present');
}

testSchemaContainsChecklists();
