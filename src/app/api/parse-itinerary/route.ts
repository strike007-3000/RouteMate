import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: 'No text provided' }, { status: 400 });
    }

    const serverKey = process.env.NVIDIA_API_KEY;
    const clientKey = req.headers.get('x-user-nvidia-key');
    const apiKey = serverKey && serverKey !== 'your_nvidia_api_key_here' ? serverKey : clientKey;
    
    const model = process.env.NVIDIA_MODEL_PRIMARY || 'mistralai/mistral-large-3-675b-instruct-2512';

    // Mock logic if no API key is provided anywhere
    if (!apiKey || apiKey === 'your_nvidia_api_key_here') {
      const source = serverKey && serverKey !== 'your_nvidia_api_key_here' ? 'Server Env' : clientKey ? 'Client Header' : 'None (Mock)';
      console.log(`Using mock extraction logic (Source: ${source})`);
      
      // Artificial delay for realism
      await new Promise(r => setTimeout(r, 1500));

      // Simple mock extraction for "Arrival at JFK" or similar
      if (text.toLowerCase().includes('jfk') || text.toLowerCase().includes('flight')) {
        return NextResponse.json({
          debug: { source },
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
            [{ "type": "hotel" | "flight" | "attraction", "title": string, "address": string, "startTime": ISO_DATE_STRING, "endTime": ISO_DATE_STRING }]
            If date/time is missing, estimate based on context or use tomorrow at 10:00 AM.
            Output ONLY the raw JSON array, no explanation.`
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

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    // Clean up markdown if present
    const cleanContent = content.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsedPoints = JSON.parse(cleanContent).map((p: any) => ({
      ...p,
      id: Math.random().toString(36).substr(2, 9)
    }));

    return NextResponse.json({ points: parsedPoints });

  } catch (error) {
    console.error('Extraction Error:', error);
    return NextResponse.json({ error: 'Failed to extract itinerary' }, { status: 500 });
  }
}
