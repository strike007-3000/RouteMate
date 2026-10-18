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
  void lat;
  void lng;
  void vibe;
  // MVP: return static suggestions; real implementation would call OpenRouter/Groq
  // Placeholder – no external call to keep cost $0 for MVP
  return [
    { title: 'Local café', description: 'Cozy spot near your stop', category: 'Food' },
    { title: 'Park walk', description: 'Green space for a break', category: 'Activity' },
    { title: 'Museum', description: 'Cultural highlight nearby', category: 'Activity' }
  ];
}
