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
    
    const groqServerKey = process.env.GROQ_API_KEY;
    const groqClientKey = req.headers.get('x-user-groq-key');
    const groqApiKey = groqServerKey || groqClientKey;
    
    // --- MOCK MODE HANDLING ---
    if (apiKey === 'MOCK_MODE' || groqApiKey === 'MOCK_MODE') {
      console.log('--- MOCK AI Extraction Active ---');
      // ... (mock implementation remains same)
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
      await new Promise(r => setTimeout(r, 1000));
      return NextResponse.json({ points: mockPoints });
    }

    if (!apiKey && !groqApiKey) {
      return NextResponse.json({ 
        error: 'No AI Provider Key Found', 
        details: 'Please enter an OpenRouter or Groq key in Settings to enable AI extraction.' 
      }, { status: 401 });
    }

    const systemPrompt = `You are a high-fidelity travel data extractor.
    TASK: Convert unstructured travel text into a valid JSON array of itinerary objects.
    STRICT OUTPUT RULES:
    - Output MUST be a valid JSON object with a single key "points" containing an array of objects.
    - NO markdown formatting. NO preamble.
    - DATA RULES: ANCHOR YEAR: ${rootYear}. FLIGHTS: Generate TWO objects. SCHEMA: { "category": string, "title": string, "address": string, "startTime": "YYYY-MM-DDTHH:mm:ssZ", "endTime": "YYYY-MM-DDTHH:mm:ssZ", "isTimeExplicit": boolean, "metadata": object }`;

    const callOpenRouter = async (targetModel: string) => {
      if (!apiKey) return null;
      try {
        return await fetch('https://openrouter.ai/api/v1/chat/completions', {
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
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
            temperature: 0.1,
          }),
        });
      } catch (e) { return null; }
    };

    const callGroq = async (targetModel: string) => {
      if (!groqApiKey) return null;
      try {
        return await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${groqApiKey}`,
          },
          body: JSON.stringify({
            model: targetModel,
            response_format: { type: 'json_object' },
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: text }],
            temperature: 0.1,
          }),
        });
      } catch (e) { return null; }
    };

    const processResponse = async (res: Response | null, modelName: string) => {
      if (!res) return { success: false, error: 'Network Error', status: 500 };
      const status = res.status;
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        return { success: false, error: errorData?.error?.message || `HTTP ${status}`, status };
      }
      try {
        const data = await res.json();
        const content = data.choices?.[0]?.message?.content;
        const jsonMatch = content.match(/\{[\s\S]*\}/);
        const jsonString = jsonMatch ? jsonMatch[0] : content;
        JSON.parse(jsonString.trim());
        return { success: true, content, status };
      } catch (e) {
        return { success: false, error: 'Invalid JSON', status: 500 };
      }
    };

    // Execution Queue
    const queue = [
      { provider: 'OpenRouter', model: 'openrouter/free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.3-70b-versatile', call: callGroq },
      { provider: 'OpenRouter', model: 'meta-llama/llama-3.3-70b-instruct:free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.1-8b-instant', call: callGroq },
      { provider: 'OpenRouter', model: 'google/gemma-3-27b-it:free', call: callOpenRouter },
    ];

    let lastError = '';
    let lastStatus = 500;
    let content = '';

    for (const item of queue) {
      const response = await item.call(item.model);
      if (!response) continue; // Skip if provider key missing

      const result = await processResponse(response, `${item.provider}:${item.model}`);
      if (result.success) {
        content = result.content!;
        console.log(`--- Extraction Success --- Provider: ${item.provider}, Model: ${item.model}`);
        break;
      } else {
        lastError = result.error!;
        lastStatus = result.status!;
        if (lastStatus === 429) {
          console.warn(`Rate limit on ${item.provider}:${item.model}. Failing over...`);
          await new Promise(r => setTimeout(r, 800));
        }
      }
    }

    if (!content) {
      return NextResponse.json({ 
        error: 'AI Provider Error', 
        details: lastError || 'All providers failed.',
        tried: queue.length
      }, { status: lastStatus });
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
