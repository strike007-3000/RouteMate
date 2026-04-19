import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const serverKey = process.env.NVIDIA_API_KEY;
    const clientKey = req.headers.get('x-user-nvidia-key');
    const apiKey = (serverKey && serverKey.startsWith('nvapi-')) ? serverKey : clientKey;
    
    // Switch to a high-capacity model known for JSON fidelity
    const model = process.env.NVIDIA_MODEL_PRIMARY || 'meta/llama-3.1-70b-instruct';

    console.log('--- Extraction Attempt ---');
    console.log('Text Length:', text.length);
    console.log('Model:', model);
    console.log('Using Key Path:', serverKey ? 'Server' : 'Client');

    // Mock logic if no valid API key is provided
    if (!apiKey || apiKey === 'your_nvidia_api_key_here' || !apiKey.startsWith('nvapi-')) {
      // Artificial delay for realism
      await new Promise(r => setTimeout(r, 1500));

      // Simple mock extraction for "Arrival at JFK" or similar
      if (text.toLowerCase().includes('jfk') || text.toLowerCase().includes('flight')) {
        return NextResponse.json({
          points: [{

            id: Math.random().toString(36).substr(2, 9),
            type: 'flight',
            title: 'Flight to New York (JFK)',
            address: 'John F. Kennedy International Airport, Queens, NY 11430, USA',
            startTime: new Date(Date.now() + 86400000).toISOString(),
            endTime: new Date(Date.now() + 86400000 + 3600000).toISOString(),
          }]
        });
      }

      return NextResponse.json({
        points: [{
          id: Math.random().toString(36).substr(2, 9),
          type: 'attraction',
          title: 'Extracted Event',
          address: 'Location extracted from text',
          startTime: new Date().toISOString(),
          endTime: new Date(Date.now() + 3600000).toISOString(),
        }]
      });
    }

    // Real NVIDIA NIM API Call
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
            content: `You are a travel logistics assistant. Extract trip itinerary details from the text. 
            Return ONLY a JSON array of objects with this schema:
            [{ 
               "category": "Flight" | "Lodging" | "Train" | "Food" | "Activity" | "Rental", 
               "title": string, 
               "address": string, 
               "startTime": ISO_DATE_STRING, 
               "endTime": ISO_DATE_STRING,
               "coordinates": { "lat": number, "lng": number } 
            }]
            
            RULES:
            - If it's a hotel/stay, category is 'Lodging'. Provide the 'fullAddress' including street name.
            - If it's a restaurant/bar, category is 'Food'.
            - If it's a flight, category is 'Flight'. 
                - Prefix title with 'Arrival:' or 'Departure:' (e.g. 'Arrival: Oslo to Brussels').
                - Include 'arrivalAirport' (e.g., 'Brussels Airport BRU') and 'departureAirport' in the metadata object.
            - LODGING SPLIT: If a stay covers a date range (e.g. June 1st to 5th), generate TWO objects: 1. 'Check-in at [Hotel]' on the start date (default 15:00) and 2. 'Check-out from [Hotel]' on the end date (default 11:00).
            - Extract the most accurate coordinates available for the address.
            - Output ONLY the raw JSON array, no explanation.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.2,
        max_tokens: 1024,
      }),
    });

    console.log('NVIDIA API Response Status:', response.status);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('NVIDIA API Error:', errorText);
      return NextResponse.json({ error: 'AI provider rejected request', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    console.log('AI Raw Content (First 200 chars):', data.choices?.[0]?.message?.content?.substring(0, 200) || 'EMPTY');
    
    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      console.error('AI Provider Error Details:', JSON.stringify(data));
      return NextResponse.json({ 
        error: 'AI provider failed', 
        details: data.error || 'Unknown provider error' 
      }, { status: 502 });
    }

    const content = data.choices[0].message.content;
    
    if (!content) {
      return NextResponse.json({ points: [] });
    }
    
    // Clean up markdown and extract JSON array
    let parsedPoints = [];
    try {
      const jsonMatch = content.match(/\[[\s\S]*\]/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      parsedPoints = JSON.parse(jsonString.trim()).map((p: any) => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9)
      }));
    } catch (parseError) {
      console.error('JSON Parse Error:', parseError, 'Raw Content:', content);
      return NextResponse.json({ 
        error: 'Failed to parse AI response', 
        raw: content.substring(0, 100) 
      }, { status: 422 });
    }


    return NextResponse.json({ points: parsedPoints });

  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Failed to extract itinerary' }, { status: 500 });
  }
}
