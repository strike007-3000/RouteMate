// RED phase: test that DB schema includes expense tracking
const fs = require('fs');
const path = require('path');

const dbFile = path.join(__dirname, '../src/lib/db.ts');

function testSchemaContainsTripExpenses() {
  const content = fs.readFileSync(dbFile, 'utf8');
  const hasVersion = /version\(8\)/.test(content);
  const hasTable = /tripExpenses/.test(content);
  const hasInterface = /interface TripExpense/.test(content);
  
  console.log('Schema contains version 8:', hasVersion);
  console.log('Schema contains tripExpenses table:', hasTable);
  console.log('Schema contains TripExpense interface:', hasInterface);
  
  if (!hasVersion || !hasTable || !hasInterface) {
    console.error('FAIL: Expense schema not implemented');
    process.exit(1);
  }
  console.log('PASS: Expense schema present');
}

testSchemaContainsTripExpenses();
