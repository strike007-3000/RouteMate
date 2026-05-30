import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { city } = await req.json();

    if (!city) {
      return NextResponse.json({ error: 'No city provided' }, { status: 400 });
    }

    const serverKey = process.env.OPENROUTER_API_KEY;
    const clientKey = req.headers.get('x-user-openrouter-key');
    const apiKey = serverKey || clientKey;
    
    const groqServerKey = process.env.GROQ_API_KEY;
    const groqClientKey = req.headers.get('x-user-groq-key');
    const groqApiKey = groqServerKey || groqClientKey;
    
    // --- MOCK MODE HANDLING ---
    if (apiKey === 'MOCK_MODE' || groqApiKey === 'MOCK_MODE') {
      console.log(`--- MOCK AI Explore Active for: ${city} ---`);
      
      const slug = city.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
      const capitalizedCity = city.charAt(0).toUpperCase() + city.slice(1);
      
      const mockDestination = {
        id: slug,
        name: capitalizedCity,
        country: 'Global Destination',
        image: '', // Will be updated on client via Unsplash
        description: `Experience the breathtaking atmosphere of ${capitalizedCity}. A unique destination filled with historic architecture, vibrant neighborhoods, and unforgettable local culture.`,
        tags: ['CULTURE', 'EXPLORE', 'LOCAL'],
        category: 'Cities',
        highlights: [
          {
            title: `${capitalizedCity} City Center`,
            description: `Explore the historic central square of ${capitalizedCity}.`,
            category: 'Activity',
            address: 'Downtown'
          },
          {
            title: 'The Grand Boulevard',
            description: 'Stroll down the primary avenue famed for local shops and cafes.',
            category: 'Activity',
            address: 'Main Avenue'
          },
          {
            title: 'Local Delights Tavern',
            description: `A classic eatery serving traditional dishes authentic to ${capitalizedCity}.`,
            category: 'Food',
            address: 'Culinary Lane'
          },
          {
            title: 'Scenic Panorama Overlook',
            description: `Vantage point offering beautiful views of the skyline.`,
            category: 'Activity',
            address: 'Summit Peak'
          }
        ]
      };
      
      await new Promise(r => setTimeout(r, 1200));
      return NextResponse.json(mockDestination);
    }

    if (!apiKey && !groqApiKey) {
      return NextResponse.json({ 
        error: 'No AI Provider Key Found', 
        details: 'Please enter an OpenRouter or Groq key in Settings to enable AI city discovery.' 
      }, { status: 401 });
    }

    const systemPrompt = `You are a professional travel curator and local guide.
    TASK: Generate a high-quality tourist overview and curated list of top 4 highlights for the requested city.
    STRICT OUTPUT RULES:
    - Output MUST be a valid JSON object matching the Destination interface.
    - NO markdown formatting (no \`\`\`json blocks), NO preamble, NO extra characters. Output only raw JSON.
    - SCHEMA:
    {
      "id": "lowercase-url-friendly-slug",
      "name": "City Name",
      "country": "Country Name",
      "description": "A compelling, premium 2-3 sentence overview of why this city is amazing to visit.",
      "tags": ["TAG1", "TAG2", "TAG3"], // Exactly 3 uppercase tags, e.g. ["URBAN", "FOOD", "HISTORY", "NATURE"]
      "category": "Cities", // Must be exactly one of: "Cities", "Beaches", "Nature", "Culture"
      "highlights": [
        {
          "title": "Name of Landmark or Activity",
          "description": "A concise, single-sentence description of what makes it famous (around 12-18 words max).",
          "category": "Activity", // Must be exactly "Activity" or "Food"
          "address": "General location or address"
        }
      ]
    }
    - Ensure highlights array contains EXACTLY 4 items. Use categories "Activity" or "Food" for activities/restaurants.`;

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
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Explore city: ${city}` }],
            temperature: 0.2,
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
            messages: [{ role: 'system', content: systemPrompt }, { role: 'user', content: `Explore city: ${city}` }],
            temperature: 0.2,
          }),
        });
      } catch { return null; }
    };

    const processResponse = async (res: Response | null, _modelName: string) => {
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

    // Execution Queue - Defaults to OpenRouter as preferred by user for Explore
    const baseQueue = [
      { provider: 'OpenRouter', model: 'openrouter/free', call: callOpenRouter },
      { provider: 'OpenRouter', model: 'meta-llama/llama-3.3-70b-instruct:free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.3-70b-versatile', call: callGroq },
      { provider: 'OpenRouter', model: 'google/gemma-3-27b-it:free', call: callOpenRouter },
      { provider: 'Groq', model: 'llama-3.1-8b-instant', call: callGroq },
    ];

    const clientPreference = req.headers.get('x-preferred-ai');
    const serverPreference = process.env.PRIMARY_AI_PROVIDER;
    const primaryProvider = clientPreference || serverPreference || 'OpenRouter';

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
      if (!response) continue;

      const result = await processResponse(response, `${item.provider}:${item.model}`);
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
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      const jsonString = jsonMatch ? jsonMatch[0] : content;
      const parsed = JSON.parse(jsonString.trim());
      
      // Basic validation and fallback mappings
      if (!parsed.id) parsed.id = city.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      if (!parsed.name) parsed.name = city;
      if (!parsed.country) parsed.country = 'Global';
      if (!parsed.description) parsed.description = `Discover the landmarks of ${city}.`;
      if (!parsed.tags || !Array.isArray(parsed.tags)) parsed.tags = ['CULTURE', 'EXPLORE'];
      if (!parsed.category || !['Cities', 'Beaches', 'Nature', 'Culture'].includes(parsed.category)) {
        parsed.category = 'Cities';
      }
      if (!parsed.highlights || !Array.isArray(parsed.highlights)) {
        parsed.highlights = [];
      }
      
      // Ensure image field is present (to be filled in by Unsplash on UI side)
      parsed.image = '';

      return NextResponse.json(parsed);
    } catch {
      return NextResponse.json({ error: 'Failed to parse AI output', details: 'The model output was not valid JSON.' }, { status: 500 });
    }

  } catch (error) {
    console.error('City Explore Discovery Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
