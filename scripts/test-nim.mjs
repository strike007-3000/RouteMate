import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function runTest() {
  console.log('\n--- NVIDIA NIM Itinerary Extraction Tester ---');
  
  const apiKey = await question('Enter your NVIDIA API Key: ');
  if (!apiKey) {
    console.log('Error: API Key is required.');
    process.exit(1);
  }

  const model = await question('Enter Model Name (default: mistralai/mistral-large-3-675b-instruct-2512): ') || 'mistralai/mistral-large-3-675b-instruct-2512';
  
  const sampleText = `Flight FR123 confirmed. Departure from NYC (JFK) at 10:00 AM on June 15th. 
  Arrival in London (LHR) at 10:00 PM. Stay at The Hoxton Hotel from June 15th to June 20th.`;
  
  const text = await question(`Enter text to parse (leave blank for sample):\n`) || sampleText;

  console.log(`\nTesting model: ${model}...`);

  try {
    const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: 'system',
            content: `Extract trip itinerary details. Output ONLY a JSON array. 
            Schema: [{ "type": "hotel" | "flight" | "attraction", "title": string, "address": string, "startTime": ISO_DATE_STRING, "endTime": ISO_DATE_STRING }]`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.1,
      }),
    });

    console.log(`\nHTTP Status: ${response.status} ${response.statusText}`);

    const rawText = await response.text();
    
    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.log('\nError: Response is not valid JSON.');
      console.log('--- RAW RESPONSE BODY ---');
      console.log(rawText);
      rl.close();
      return;
    }

    if (data.choices && data.choices.length > 0) {

      const content = data.choices[0].message.content;
      console.log('\n--- RAW AI RESPONSE ---');
      console.log(content);
      
      try {
        const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsed = JSON.parse(cleanContent);
        console.log('\n--- PARSED STRUCTURED DATA ---');
        console.table(parsed);
      } catch (e) {
        console.log('\n[Warning] Could not parse JSON from response.');
      }
    } else {
      console.log('\nError: No valid response from API.');
      console.log(JSON.stringify(data, null, 2));
    }

  } catch (error) {
    console.error('\nFetch Error:', error.message);
  }

  rl.close();
}

runTest();
