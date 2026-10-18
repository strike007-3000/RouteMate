// RED phase: test suggestions service exists
const fs = require('fs');
const path = require('path');

function testSuggestionsExists() {
  const filePath = path.join(__dirname, '../src/lib/suggestions.ts');
  const exists = fs.existsSync(filePath);
  console.log('suggestions service exists:', exists);
  if (!exists) {
    console.error('FAIL: Suggestions service not implemented');
    process.exit(1);
  }
  console.log('PASS: Suggestions service present');
}

testSuggestionsExists();
