import { useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { searchSuggestions, SearchSuggestion, RealStateUserSuggestion } from '../service/searchService';
import { Suggestion } from '../service/mapApiService';

export type SearchAction = {
  onSelectSuggestion: (suggestion: SearchSuggestion) => void;
  isLoading: boolean;
  query: string;
  setQuery: (q: string) => void;
  suggestions: SearchSuggestion[];
};

export function useSearch(): SearchAction {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const fetchSuggestions = useCallback(
    debounce(async (searchQuery: string) => {
      if (!searchQuery || searchQuery.length < 3) {
        setSuggestions([]);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      const results = await searchSuggestions(searchQuery);
      setSuggestions(results);
      setIsLoading(false);
    }, 300),
    []
  );

  const handleQueryChange = (newQuery: string) => {
    setQuery(newQuery);
    fetchSuggestions(newQuery);
  };

  const onSelectSuggestion = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'ADDRESS') {
      const mapSuggestion = suggestion as Suggestion;
      router.push(`/map?lat=${mapSuggestion.lat}&lon=${mapSuggestion.lon}&q=${encodeURIComponent(mapSuggestion.display_name)}`);
    } else if (suggestion.type === 'REALSTATE_USER') {
      const userSuggestion = suggestion as RealStateUserSuggestion;
      router.push(`/profile/${userSuggestion.id}`);
    }
    setQuery('');
    setSuggestions([]);
  };

  return useMemo(() => ({
    onSelectSuggestion,
    isLoading,
    query,
    setQuery: handleQueryChange,
    suggestions,
  }), [onSelectSuggestion, isLoading, query, suggestions]);
}