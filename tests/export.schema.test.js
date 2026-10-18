// RED phase: test export schema
const fs = require('fs');
const path = require('path');

function testExportUtilityExists() {
  const exportPath = path.join(__dirname, '../src/lib/exportTrip.ts');
  const exists = fs.existsSync(exportPath);
  console.log('exportTrip utility exists:', exists);
  if (!exists) {
    console.error('FAIL: Export utility not implemented');
    process.exit(1);
  }
  console.log('PASS: Export utility present');
}

testExportUtilityExists();
