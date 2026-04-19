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
    
    // Confirmed 2026 High-Fidelity Stack
    const primaryModel = process.env.NVIDIA_MODEL_PRIMARY || 'mistralai/mistral-small-4-119b-2603';
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
              
              CONTENT_RULES:
              - Return ONLY a flat JSON array of objects.
              - FLIGHTS: "Flight from A to B" MUST generate TWO separate objects: 
                1. "Departure from [Market/City]" at 08:00.
                2. "Arrival at [Destination/City]" at 14:00.
              - IMPLICIT HUBS: For Flight objects, include a metadata field:
                "metadata": { 
                  "departureAirport": string, // e.g. "Brussels Airport (BRU)"
                  "arrivalAirport": string,   // e.g. "Tokyo Narita (NRT)"
                  "departureCoords": { "lat": number, "lng": number },
                  "arrivalCoords": { "lat": number, "lng": number }
                }
              - NO AIRPORT STOPS: Do NOT create separate "Airport" category cards.
              
              TIMES (STRICT):
              - Flight DEPARTURE: 08:00.
              - Hotel CHECK-OUT: 10:00.
              - Flight ARRIVAL: 14:00.
              - Hotel CHECK-IN: 16:00.
              - Activities: 17:00.
              
              SCHEMA:
              [{ 
                 "category": "Flight" | "Lodging" | "Train" | "Food" | "Activity", 
                 "title": string, 
                 "address": string, 
                 "startTime": "YYYY-MM-DDTHH:mm:ssZ", 
                 "metadata": object
              }]`
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
      parsedPoints = JSON.parse(jsonString.trim()).map((p: Record<string, unknown>) => ({
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
        parsedPoints = JSON.parse(jsonString.trim()).map((p: Record<string, unknown>) => ({
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
