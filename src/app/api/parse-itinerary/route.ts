import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text, rootYear = "2026" } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const serverKey = process.env.OPENROUTER_API_KEY;
    const clientKey = req.headers.get('x-user-openrouter-key');
    const apiKey = serverKey || clientKey;
    
    // --- MOCK MODE HANDLING ---
    if (apiKey === 'MOCK_MODE') {
      console.log('--- MOCK AI Extraction Active ---');
      
      // Try to extract a month from text, default to current month
      const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
      const foundMonth = months.findIndex(m => text.toLowerCase().includes(m.toLowerCase()));
      const monthIdx = foundMonth !== -1 ? foundMonth : new Date().getMonth();
      const monthStr = (monthIdx + 1).toString().padStart(2, '0');

      const mockPoints = [
        {
          id: 'mock-1',
          category: 'Flight',
          title: 'Flight to ' + (text.match(/to ([A-Z][a-z]+)/)?.[1] || 'London'),
          address: 'International Airport',
          startTime: `${rootYear}-${monthStr}-23T10:00:00Z`,
          endTime: `${rootYear}-${monthStr}-23T14:30:00Z`,
          isTimeExplicit: true,
          metadata: { flightNumber: 'RM123' }
        },
        {
          id: 'mock-2',
          category: 'Lodging',
          title: 'Stay at ' + (text.match(/Stay at ([A-Z][a-z]+ [A-Z][a-z]+)/)?.[1] || 'Grand Plaza Hotel'),
          address: 'City Center',
          startTime: `${rootYear}-${monthStr}-23T16:00:00Z`,
          endTime: `${rootYear}-${monthStr}-26T11:00:00Z`,
          isTimeExplicit: true,
          metadata: { confirmation: 'MOCK-CONF' }
        },
        {
          id: 'mock-3',
          category: 'Activity',
          title: (text.match(/visit ([A-Z][a-z]+ [A-Z][a-z]+)/i)?.[1] || 'City Sightseeing'),
          address: 'Central District',
          startTime: `${rootYear}-${monthStr}-24T11:00:00Z`,
          endTime: `${rootYear}-${monthStr}-24T13:00:00Z`,
          isTimeExplicit: true,
          metadata: {}
        }
      ];
      // Simulate delay
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ points: mockPoints });
    }

    if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey.length < 10) {
      return NextResponse.json({ 
        error: 'Missing OpenRouter API Key', 
        details: 'Please enter your key in the Settings Gear (top right) to enable AI extraction. Or type "MOCK_MODE" for testing.' 
      }, { status: 401 });
    }

    // Use the official OpenRouter free model router
    const primaryModel = 'openrouter/free';
    const fallbackModel = 'nousresearch/hermes-3-llama-3.1-405b:free'; // Frontier-level free model
    const emergencyModel = 'google/gemma-3-27b-it:free'; // Optimized for structured outputs

    console.log('--- OpenRouter Extraction Attempt (Free Stack) ---', { model: primaryModel, textLen: text.length });

    const callOpenRouter = async (targetModel: string) => {
      try {
        const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${apiKey}`,
            'HTTP-Referer': 'https://routemate.travel',
            'X-Title': 'RouteMate',
          },
          body: JSON.stringify({
            model: targetModel,
            response_format: { type: 'json_object' },
            messages: [
              {
                role: 'system',
                content: `You are a high-fidelity travel data extractor.
                TASK: Convert unstructured travel text into a valid JSON array of itinerary objects.
                
                STRICT OUTPUT RULES:
                - Output MUST be a valid JSON object with a single key "points" containing an array of objects.
                - NO markdown formatting. NO code blocks. NO preamble.
                - Return ONLY the JSON object.
                
                DATA RULES:
                - ANCHOR YEAR: ${rootYear}.
                - FLIGHTS: Generate TWO objects (Departure and Arrival).
                - SCHEMA per object: { "category": "Flight"|"Lodging"|"Train"|"Food"|"Activity", "title": string, "address": string, "startTime": "YYYY-MM-DDTHH:mm:ssZ", "endTime": "YYYY-MM-DDTHH:mm:ssZ", "isTimeExplicit": boolean, "metadata": object }`
              },
              { role: 'user', content: text }
            ],
            temperature: 0.1,
            max_tokens: 2048,
          }),
        });
        return res;
      } catch (e) {
        return null;
      }
    };

    const processResponse = async (res: Response | null) => {
      if (!res || !res.ok) return null;
      try {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        if (!content) return null;
        
        // Try to find and parse JSON
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        JSON.parse(jsonString.trim()); // Validation step
        return content;
      } catch (e) {
        return null;
      }
    };

    let response = await callOpenRouter(primaryModel);
    let content = await processResponse(response);
    
    // Tiered Fallback Strategy
    if (!content) {
      console.warn(`Primary (${primaryModel}) failed or returned invalid JSON. Trying fallback...`);
      response = await callOpenRouter(fallbackModel);
      content = await processResponse(response);
    }

    if (!content) {
      console.warn(`Secondary (${fallbackModel}) failed. Trying Emergency fallback...`);
      response = await callOpenRouter(emergencyModel);
      content = await processResponse(response);
    }

    if (!content) {
      const errorData = await response?.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || 'AI models failed to generate valid itinerary data.';
      
      let finalDetails = errorMsg;
      if (errorMsg.toLowerCase().includes('insufficient credits') || response?.status === 402) {
        finalDetails = 'Insufficient credits on OpenRouter. Please top up at openrouter.ai or use "MOCK_MODE" in settings to continue testing.';
      }

      return NextResponse.json({ error: 'AI Provider Error', details: finalDetails }, { status: response?.status || 500 });
    }
    
    try {
      // Find JSON object regardless of markdown or text padding
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonString.trim());
      
      // Handle both flat array or { points: [] } wrappers
      const pointsArray = Array.isArray(parsed) ? parsed : (parsed.points || []);
      
      const parsedPoints = pointsArray.map((p: Record<string, unknown>) => ({
        ...p,
        id: Math.random().toString(36).substr(2, 9)
      }));
      
      return NextResponse.json({ points: parsedPoints });
    } catch (parseError) {
      console.error('JSON Parse Error:', content);
      return NextResponse.json({ error: 'Failed to parse AI output', details: 'The model did not return valid JSON.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Global Extraction Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
