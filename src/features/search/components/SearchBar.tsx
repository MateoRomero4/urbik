'use client';

import React, { useRef } from 'react';
import { useSearch } from '../hooks/useSearch';
import { ResultList } from './ResultList';

export const SearchBar: React.FC = () => {
  const { onSelectSuggestion, isLoading, query, setQuery, suggestions } = useSearch();
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {

    if (e.key === 'Enter' && suggestions.length > 0) {
      onSelectSuggestion(suggestions[0]);
    }
  };

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <input
        ref={inputRef}
        type="text"
        placeholder="Buscar Inmobiliarias o Direcciones en Argentina..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <ResultList
        suggestions={suggestions}
        isLoading={isLoading}
        onSelect={onSelectSuggestion}
      />
    </div>
  );
};