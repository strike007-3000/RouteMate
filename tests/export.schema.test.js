// RED phase: test export schema
const fs = require('fs');
const path = require('path');

function testExportUtilityExists() {
  const exportPath = path.join(__dirname, '../src/lib/exportTrip.ts');
  const exists = fs.existsSync(exportPath);
  const content = exists ? fs.readFileSync(exportPath, 'utf8') : '';
  const persistsImport = /db\.transaction/.test(content)
    && /db\.trips\.add/.test(content)
    && /db\.itineraryItems\.bulkAdd/.test(content)
    && /db\.tripExpenses\.bulkAdd/.test(content)
    && /db\.tripLists\.bulkAdd/.test(content);
  console.log('exportTrip utility exists:', exists);
  console.log('importTrip persists all exported collections:', persistsImport);
  if (!exists || !persistsImport) {
    console.error('FAIL: Export utility not implemented');
    process.exit(1);
  }
  console.log('PASS: Export utility present');
}

testExportUtilityExists();
