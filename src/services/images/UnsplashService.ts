const UNSPLASH_ACCESS_KEY = typeof window !== 'undefined' ? localStorage.getItem('unsplash-key') : process.env.UNSPLASH_ACCESS_KEY;

export async function getDestinationImage(destination: string): Promise<string | null> {
  // Fallback to high-end abstract travel if no destination provided or key missing
  if (!UNSPLASH_ACCESS_KEY || UNSPLASH_ACCESS_KEY === 'your_key_here') {
    return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop`;
  }

  try {
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(destination)}&orientation=landscape&per_page=1&client_id=${UNSPLASH_ACCESS_KEY}`
    );
    const data = await response.json();
    
    if (data.results && data.results.length > 0) {
      return data.results[0].urls.regular;
    }
  } catch (error) {
    console.error('Unsplash fetch failed:', error);
  }

  return `https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=1000&auto=format&fit=crop`;
}
