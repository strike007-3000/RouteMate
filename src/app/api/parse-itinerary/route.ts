import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, rootYear = "2026" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const serverKey = process.env.NVIDIA_API_KEY;
    const clientKey = req.headers.get('x-user-nvidia-key');
    const apiKey = (serverKey && serverKey.startsWith('nvapi-')) ? serverKey : clientKey;
    
    // Validate API Key early to avoid hangs
    if (!apiKey || apiKey === 'your_nvidia_api_key_here' || apiKey.length < 10) {
      return NextResponse.json({ 
        error: 'Missing NVIDIA API Key', 
        details: 'Please enter your key in the Settings Gear (top right) to enable AI extraction.' 
      }, { status: 401 });
    }

    // Confirmed 2026 High-Fidelity Stack
    const primaryModel = process.env.NVIDIA_MODEL_PRIMARY || 'mistralai/mistral-small-4-119b-2603';
    const fallbackModel = process.env.NVIDIA_MODEL_FALLBACK || 'mistralai/mistral-large-3-675b-instruct-2512';

    console.log('--- Extraction Attempt ---', { model: primaryModel, textLen: text.length });

    // Helper for API Call
    const callNvidiaNIM = async (targetModel: string) => {
      return fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
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
              - Return ONLY a flat JSON array.
              - ANCHOR YEAR: If the user provides a date without a year (e.g., "April 21st", "22nd April", "21 Apr"), ASSUME the year is ${rootYear}.
              - DATE FORMATTING: Handle ordinal suffixes (st, nd, rd, th) by stripping them before parsing.
              - ORIGIN DETECTION: Identify the user's starting city (Home Base). Do NOT create a "Check-out" event for the starting city (travelers start from home).
              - FLIGHTS: "Flight from A to B" MUST generate TWO objects: 
                1. "Departure from A" (category: Flight, address: A).
                2. "Arrival at B" (category: Flight, address: B).
              - METADATA: ALWAYS include "departureCity", "arrivalCity", "departureAirport", "arrivalAirport", and coordinates.
              - ADDRESSES: The "address" field for any item must be its physical location.
              
              DEFAULT TIMES: Check-out (11:00), Arrival (14:00), Check-in (15:00), Departure (16:00), Activity (12:00).
              
              SCHEMA:
              [{ 
                 "category": "Flight" | "Lodging" | "Train" | "Food" | "Activity" | "Rental", 
                 "title": string, "address": string, 
                 "startTime": "YYYY-MM-DDTHH:mm:ssZ", "endTime": "YYYY-MM-DDTHH:mm:ssZ",
                 "isTimeExplicit": boolean, "metadata": { "departureCity"?: string, "arrivalCity"?: string, "departureAirport"?: string, "arrivalAirport"?: string, ... }
              }]`
            },
            { role: 'user', content: text }
          ],
          temperature: 0.1,
          max_tokens: 2048,
        }),
      });
    };

    let response = await callNvidiaNIM(primaryModel);
    
    // Automatic Fallback Strategy
    if (!response.ok || response.status === 404) {
      console.warn(`Primary model ${primaryModel} failed (${response.status}). Trying fallback...`);
      response = await callNvidiaNIM(fallbackModel);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMsg = errorData.detail || errorData.message || await response.text();
      console.error('NIM API Error:', errorMsg);
      return NextResponse.json({ 
        error: 'AI Provider Error', 
        details: `NIM API returned: ${errorMsg}` 
      }, { status: response.status });
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
