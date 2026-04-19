const readline = require('readline');

if (!global.fetch) {
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const ask = (query) => new Promise((resolve) => rl.question(query, resolve));

const Log = {
  info: (msg) => console.log(`\x1b[34m[INFO]\x1b[0m ${msg}`),
  pass: (msg) => console.log(`\x1b[32m[PASS]\x1b[0m ${msg}`),
  fail: (msg) => console.log(`\x1b[31m[FAIL]\x1b[0m ${msg}`),
  warn: (msg) => console.log(`\x1b[33m[WARN]\x1b[0m ${msg}`),
  header: (msg) => console.log(`\n\x1b[1m\x1b[35m=== ${msg} ===\x1b[0m\n`),
};

async function runTests() {
  Log.header('RouteMate v2.6.2 Interactive Integrity Suite');

  const nvidiaKey = await ask('Enter NVIDIA NIM API Key: ');
  const unsplashKey = await ask('Enter Unsplash Access Key: ');
  const orsKey = await ask('Enter ORS_API_KEY: ');

  Log.header('1. API Connectivity (Unsplash & ORS)');
  
  // Unsplash Check
  try {
    const res = await fetch(`https://api.unsplash.com/search/photos?query=Tokyo&per_page=1`, { headers: { 'Authorization': `Client-ID ${unsplashKey}` } });
    if (res.ok) Log.pass('Unsplash: OK'); else Log.fail('Unsplash: REJECTED');
  } catch(e) { Log.fail('Unsplash: ERROR'); }

  // ORS Check
  try {
    const res = await fetch(`https://api.openrouteservice.org/geocode/search?api_key=${orsKey}&text=Tokyo&size=1`);
    if (res.ok) Log.pass('ORS: OK'); else Log.fail('ORS: REJECTED');
  } catch(e) { Log.fail('ORS: ERROR'); }

  Log.header('2. Extraction Sequencing (Mistral v4 Live Test)');
  
  const testInput = await ask('\nPaste the trip text you want to test: \n> ');
  const modelToTest = 'mistralai/mistral-small-4-119b-2603';
  
  try {
    process.stdout.write(`\nTesting Extraction on ${modelToTest}...\n`);
    const startTime = Date.now();
    
    const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${nvidiaKey}`,
      },
      body: JSON.stringify({
        model: modelToTest,
        messages: [
          { 
            role: 'system', 
            content: `Return ONLY flat JSON array. SCHEMA: [{ "title": string, "startTime": string }]. 
            RULES: No nesting. No "flights" or "hotel" keys. Flight Arrival 08:00, Hotel Check-in 15:00. Year 2026.` 
          },
          { role: 'user', content: testInput }
        ],
        temperature: 0.1,
      }),
    });

    const endTime = Date.now();
    const duration = ((endTime - startTime) / 1000).toFixed(2);

    if (res.ok) {
        Log.pass(`Extraction Complete in ${duration}s.`);
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        
        try {
            const jsonMatch = content.match(/\[[\s\S]*\]/);
            const parsed = JSON.parse(jsonMatch ? jsonMatch[0] : content);
            
            Log.info(`AI returned ${parsed.length} travel objects.`);
            
            // Defensive scanning
            const flight = parsed.find(p => p.startTime && p.startTime.includes('08:00'));
            const checkin = parsed.find(p => p.title && p.title.toLowerCase().includes('check-in') && p.startTime && p.startTime.includes('15:00'));

            if (flight && checkin) {
                const flightTime = new Date(flight.startTime).getTime();
                const checkinTime = new Date(checkin.startTime).getTime();
                if (checkinTime > flightTime) {
                    Log.pass('Chronology Success: [Flight 08:00] -> [Hotel 15:00].');
                } else {
                    Log.fail('Logic Error: Hotel check-in is NOT scheduled after flight arrival.');
                }
            } else {
                Log.warn('Partial Result: Logic test could not find both Flight (08:00) and Check-in (15:00).');
            }
            
            console.log('\x1b[33m--- Final JSON Output ---\x1b[0m');
            console.log(JSON.stringify(parsed, null, 2));

        } catch (e) {
            Log.fail('JSON Fidelity Failure: Response malformed or missing fields.');
            console.log(content);
        }
    } else {
        Log.fail(`FAILED (Status: ${res.status})`);
        const errText = await res.text();
        console.log(errText);
    }
  } catch (e) {
    Log.fail(`Test Execution Crash: ${e.message}`);
  }

  Log.header('Final Status: Verification Complete');
  process.exit(0);
}

runTests();
