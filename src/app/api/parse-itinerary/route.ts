import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { text, city, startDate, endDate, tripVibe, highlights } = body;
    let rootYear = "2026";
    
    if (startDate) {
      rootYear = startDate.split('-')[0];
    } else if (body.rootYear) {
      rootYear = body.rootYear;
    }

    let userMessage = text || '';
    if (city && startDate && endDate && tripVibe) {
      const totalDays = Math.ceil((new Date(endDate).getTime() - new Date(startDate).getTime()) / (86400000)) + 1;
      userMessage = `I am planning a ${tripVibe} trip to ${city} from ${startDate} to ${endDate} (${totalDays} days).
Please plan a high-fidelity itinerary exactly spanning these ${totalDays} days.
Make sure to visit these famous landmarks if applicable:
${highlights?.map((h: any) => `- ${h.title}: ${h.description}`).join('\n') || ''}

Tailor the daily schedule blocks (activities, morning/afternoon/evening slots) to strictly align with the chosen tripVibe: ${tripVibe}.
Generate a perfectly structured timeline mapping exactly to the duration between ${startDate} and ${endDate}.
Please output this in chronological order.`;
    }

    if (!userMessage) {
      return NextResponse.json({ error: 'No text or trip parameters provided' }, { status: 400 });
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
      const foundMonth = months.findIndex(m => userMessage.toLowerCase().includes(m.toLowerCase()));
      const monthIdx = foundMonth !== -1 ? foundMonth : new Date().getMonth();
      const monthStr = (monthIdx + 1).toString().padStart(2, '0');

      const mockPoints = [
        {
          id: 'mock-1',
          category: 'Flight',
          title: 'Flight to ' + (userMessage.match(/to ([A-Z][a-z]+)/)?.[1] || 'London'),
          address: 'International Airport',
          startTime: `${rootYear}-${monthStr}-23T10:00:00Z`,
          endTime: `${rootYear}-${monthStr}-23T14:30:00Z`,
          isTimeExplicit: true,
          metadata: { flightNumber: 'RM123' }
        },
        {
          id: 'mock-2',
          category: 'Lodging',
          title: 'Stay at ' + (userMessage.match(/Stay at ([A-Z][a-z]+ [A-Z][a-z]+)/)?.[1] || 'Grand Plaza Hotel'),
          address: 'City Center',
          startTime: `${rootYear}-${monthStr}-23T16:00:00Z`,
          endTime: `${rootYear}-${monthStr}-26T11:00:00Z`,
          isTimeExplicit: true,
          metadata: { confirmation: 'MOCK-CONF' }
        },
        {
          id: 'mock-3',
          category: 'Activity',
          title: (userMessage.match(/visit ([A-Z][a-z]+ [A-Z][a-z]+)/i)?.[1] || 'City Sightseeing'),
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
    - DATA RULES: ANCHOR YEAR: ${rootYear}.
    - CATEGORY RULES: MUST be exactly one of: ["Flight", "Lodging", "Train", "Food", "Activity", "Rental"]. Use "Activity" for sightseeing.
    - SCHEMA: { "category": string, "title": string, "address": string, "startTime": "YYYY-MM-DDTHH:mm:ssZ", "endTime": "YYYY-MM-DDTHH:mm:ssZ", "isTimeExplicit": boolean, "metadata": object }.
    - FLIGHT RULES: If category is "Flight", metadata MUST include "flightNumber" (e.g. "SN3151"). Do not hallucinate numbers if not found.`;

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
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
            temperature: 0,
          }),
        });
      } catch { return null; }
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
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: userMessage }],
            temperature: 0,
          }),
        });
      } catch { return null; }
    };

    const processResponse = async (res: Response | null) => {
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
      } catch {
        return { success: false, error: 'Invalid JSON', status: 500 };
      }
    };

    // Execution Queue
    const baseQueue = [
      { provider: 'OpenRouter', model: 'openrouter/free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.3-70b-versatile', call: callGroq },
      { provider: 'OpenRouter', model: 'meta-llama/llama-3.3-70b-instruct:free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.1-8b-instant', call: callGroq },
      { provider: 'OpenRouter', model: 'google/gemma-3-27b-it:free', call: callOpenRouter },
    ];

    const clientPreference = req.headers.get('x-preferred-ai');
    const serverPreference = process.env.PRIMARY_AI_PROVIDER;
    const primaryProvider = clientPreference || serverPreference || 'Groq';

    const queue = [...baseQueue].sort((a, b) => {
      if (a.provider === primaryProvider && b.provider !== primaryProvider) return -1;
      if (b.provider === primaryProvider && a.provider !== primaryProvider) return 1;
      return 0;
    });

    let lastError = '';
    let lastStatus = 500;
    let content = '';

    for (const item of queue) {
      const response = await item.call(item.model);
      if (!response) continue; // Skip if provider key missing

      const result = await processResponse(response);
      if (result.success) {
        content = result.content!;
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
      
      const parsedPoints = pointsArray.map((p: Record<string, unknown>) => {
        // Enforce strict Title Case for valid categories
        let cat = typeof p.category === 'string' ? p.category : 'Activity';
        cat = cat.charAt(0).toUpperCase() + cat.slice(1).toLowerCase();
        
        // Map common AI hallucinations to valid UI categories
        if (['Sightseeing', 'Tour', 'Museum', 'Attraction', 'Show'].includes(cat)) cat = 'Activity';
        if (['Hotel', 'Airbnb', 'Stay', 'Resort', 'Hostel'].includes(cat)) cat = 'Lodging';
        if (['Restaurant', 'Dining', 'Lunch', 'Dinner', 'Breakfast'].includes(cat)) cat = 'Food';
        if (cat === 'Transit' || cat === 'Bus' || cat === 'Ferry') cat = 'Train';
        if (!['Flight', 'Lodging', 'Train', 'Food', 'Activity', 'Rental'].includes(cat)) cat = 'Activity';

        // Validate and sanitize dates
        let startTime = typeof p.startTime === 'string' ? p.startTime : '';
        let endTime = typeof p.endTime === 'string' ? p.endTime : '';
        
        let startD = new Date(startTime);
        if (isNaN(startD.getTime())) {
          const fallbackYear = /^\d{4}$/.test(String(rootYear)) ? rootYear : new Date().getFullYear();
          startTime = startDate ? `${startDate}T10:00:00Z` : `${fallbackYear}-01-01T12:00:00Z`;
          startD = new Date(startTime);
        }

        // Strict mapping against calendar bounds if provided
        if (startDate && endDate) {
          const tripStart = new Date(`${startDate}T00:00:00Z`);
          const tripEnd = new Date(`${endDate}T23:59:59Z`);
          
          if (startD < tripStart) startD = tripStart;
          if (startD > tripEnd) startD = tripEnd;
        }

        startTime = isNaN(startD.getTime()) ? new Date().toISOString() : startD.toISOString();

        const endD = new Date(endTime);
        if (isNaN(endD.getTime())) {
          endTime = startTime;
        } else {
          if (startDate && endDate) {
            const tripStart = new Date(`${startDate}T00:00:00Z`);
            const tripEnd = new Date(`${endDate}T23:59:59Z`);
            if (endD < tripStart) endD.setTime(tripStart.getTime());
            if (endD > tripEnd) endD.setTime(tripEnd.getTime());
          }
          endTime = endD.toISOString();
          if (isNaN(new Date(endTime).getTime())) {
            endTime = startTime;
          }
        }

        return {
          ...p,
          category: cat,
          startTime,
          endTime,
          id: crypto.randomUUID()
        };
      });
      
      return NextResponse.json({ points: parsedPoints });
    } catch {
      console.error('JSON Parse Error:', content);
      return NextResponse.json({ error: 'Failed to parse AI output', details: 'The model did not return valid JSON.' }, { status: 500 });
    }

  } catch (error) {
    console.error('Global Extraction Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
