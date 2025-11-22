export type Suggestion = {
  type: 'ADDRESS';
  display_name: string;
  lat: string;
  lon: string;
};

const NOMINATIM_URL = 'https://nominatim.openstreetmap.org/search';

export async function getMapSuggestions(query: string): Promise<Suggestion[]> {

  const params = new URLSearchParams({
    q: query,
    format: 'json',
    countrycodes: 'ar',
    limit: '5',
  });

  const response = await fetch(`${NOMINATIM_URL}?${params.toString()}`);

  if (!response.ok) {
    console.error('Error al buscar direcciones en Nominatim:', response.statusText);
    return [];
  }

  const data = await response.json();

  const suggestions: Suggestion[] = data
    .filter((item: any) => item.lat && item.lon)
    .map((item: any) => ({
      type: 'ADDRESS' as const,
      display_name: item.display_name,
      lat: item.lat,
      lon: item.lon,
    }));

  return suggestions;
}