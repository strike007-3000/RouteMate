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
    
    if (!apiKey || apiKey === 'your_openrouter_api_key_here' || apiKey.length < 10) {
      return NextResponse.json({ 
        error: 'Missing OpenRouter API Key', 
        details: 'Please enter your key in the Settings Gear (top right) to enable AI extraction.' 
      }, { status: 401 });
    }

    // High-Fidelity OpenRouter Stack (Optimized for JSON)
    const primaryModel = 'meta-llama/llama-3.3-70b-instruct:free';
    const fallbackModel = 'google/gemini-2.0-flash-001';
    const emergencyModel = 'deepseek/deepseek-chat';

    console.log('--- OpenRouter Extraction Attempt ---', { model: primaryModel, textLen: text.length });

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

    let response = await callOpenRouter(primaryModel);
    
    // Tiered Fallback Strategy
    if (!response || !response.ok || response.status === 429) {
      console.warn(`Primary failed (${response?.status}). Trying Llama fallback...`);
      response = await callOpenRouter(fallbackModel);
    }

    if (!response || !response.ok || response.status === 429) {
      console.warn(`Secondary failed. Trying Emergency fallback...`);
      response = await callOpenRouter(emergencyModel);
    }

    if (!response || !response.ok) {
      const errorData = await response?.json().catch(() => ({}));
      const errorMsg = errorData?.error?.message || 'OpenRouter Service Unavailable';
      return NextResponse.json({ error: 'AI Provider Error', details: errorMsg }, { status: response?.status || 500 });
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      return NextResponse.json({ error: 'Empty response from AI', details: 'The model failed to generate content.' }, { status: 500 });
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
