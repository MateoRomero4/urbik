import { getMapSuggestions, Suggestion } from './mapApiService';

export type RealStateUserSuggestion = {
  type: 'REALSTATE_USER';
  id: number;
  name: string;
  email: string;
};

export type SearchSuggestion = RealStateUserSuggestion | Suggestion;

async function searchRealStateUsers(query: string): Promise<RealStateUserSuggestion[]> {


  const response = await fetch(`/api/search?q=${query}`);
  if (!response.ok) {
    console.error('Error al buscar usuarios REALSTATE:', response.statusText);
    return [];
  }
  const data = await response.json();
  return data.users as RealStateUserSuggestion[];
}

export async function searchSuggestions(query: string): Promise<SearchSuggestion[]> {
  if (!query || query.length < 3) return [];

  try {
    const [userSuggestions, mapSuggestions] = await Promise.all([
      searchRealStateUsers(query),
      getMapSuggestions(query), 
    ]);

    return [
      ...userSuggestions,
      ...mapSuggestions,
    ];
  } catch (error) {
    console.error('Error general en la búsqueda de sugerencias:', error);
    return [];
  }
}