export type Suggestion = {
  title: string;
  description: string;
  category: string;
  distanceKm?: number;
};

export async function getNearbySuggestions(
  lat: number,
  lng: number,
  vibe?: string
): Promise<Suggestion[]> {
  // MVP: return static suggestions; real implementation would call OpenRouter/Groq
  // with a prompt like: "Given location lat,lng and vibe, suggest 3 nearby places"
  const prompt = `Suggest 3 nearby places near ${lat},${lng}${vibe ? ` with vibe ${vibe}` : ''}. Return JSON array.`;
  // Placeholder – no external call to keep cost $0 for MVP
  return [
    { title: 'Local café', description: 'Cozy spot near your stop', category: 'Food' },
    { title: 'Park walk', description: 'Green space for a break', category: 'Activity' },
    { title: 'Museum', description: 'Cultural highlight nearby', category: 'Activity' }
  ];
}
