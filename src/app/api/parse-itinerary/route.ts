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
    
    // Hierarchy: Primary (Small) -> Fallback (Large)
    const primaryModel = process.env.NVIDIA_MODEL_PRIMARY || 'mistralai/mistral-small-3.1-24b-instruct-2503';
    const fallbackModel = process.env.NVIDIA_MODEL_FALLBACK || 'mistralai/mistral-large-3-675b-instruct-2512';

    console.log('--- Extraction Attempt ---');
    console.log('Text Length:', text.length);
    console.log('Primary Model:', primaryModel);

    // Helper for API Call
    const callNvidiaNIM = async (targetModel: string) => {
      const response = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: targetModel,
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
              - SMART TIME BUFFERS (If no specific time is mentioned in text, use these defaults):
                  - Flight Arrival: 08:00
                  - Flight Departure: 20:00
                  - Train Arrival: 09:00
                  - Train Departure: 18:00
              - LODGING SPLIT: If a stay covers a date range (e.g. June 1st to 5th), generate TWO objects: 
                  1. 'Check-in at [Hotel]' on the start date (default 15:00) 
                  2. 'Check-out from [Hotel]' on the end date (default 11:00).
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
      return response;
    };

    let response = await callNvidiaNIM(primaryModel);
    
    // Automatic Fallback Strategy
    if (!response.ok || response.status === 404) {
      console.warn(`Primary model ${primaryModel} failed. Falling back to ${fallbackModel}...`);
      response = await callNvidiaNIM(fallbackModel);
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('NIM API Error:', errorText);
      return NextResponse.json({ error: 'AI provider rejected request', details: errorText }, { status: response.status });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
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
      console.warn('Small model JSON failed. Forcing Large model fallback...');
      // If JSON parse fails, try the large model as a last resort
      const secondaryResponse = await callNvidiaNIM(fallbackModel);
      if (secondaryResponse.ok) {
        const secondaryData = await secondaryResponse.json();
        const secondaryContent = secondaryData.choices?.[0]?.message?.content;
        const jsonMatch = secondaryContent.match(/\[[\s\S]*\]/);
        const jsonString = jsonMatch ? jsonMatch[0] : secondaryContent;
        parsedPoints = JSON.parse(jsonString.trim()).map((p: any) => ({
          ...p,
          id: Math.random().toString(36).substr(2, 9)
        }));
      } else {
        throw parseError;
      }
    }


    return NextResponse.json({ points: parsedPoints });

  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Failed to extract itinerary' }, { status: 500 });
  }
}
